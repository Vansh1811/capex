-- =====================================================================
-- MINIMAL BACKEND REDUCTION — 2026-09
--
-- Final architecture decision: the Capex website is a premium STATIC
-- frontend (verified corpora in the repo are the single content source)
-- plus two submission backends. This migration reduces the database to
-- exactly that:
--
--   KEEP:   form_submissions (enquiries)   + submit_form_submission RPC
--   CREATE: credential_requests             + submit_credential_request RPC
--   HARDEN: revoke every anon/authenticated TABLE grant (both RPCs are
--           SECURITY DEFINER — no table access is needed by the app)
--   DROP:   the retired CMS surface — content_items, sections, pages,
--           categories, nav_items, media, newsletter_subscribers,
--           site_settings, audit_log (if the unapplied 6A file ran),
--           ref_sequence is KEPT (drives both RPCs' reference allocation)
--
-- The enquiry RPC is re-declared here identically because the Phase 6A
-- migration that introduced it was never applied to this project.
--
-- Apply to the live Supabase project via SQL editor. Forward-only.
-- =====================================================================

-- ============================================================
-- 1. ENQUIRY INFRASTRUCTURE (as designed in Phase 6A §2, never applied)
-- ============================================================
alter table public.form_submissions
  add column if not exists ref text unique,
  add column if not exists practice text,
  add column if not exists service_slug text,
  add column if not exists ip_hash text,
  add column if not exists user_agent_hash text,
  add column if not exists flagged boolean not null default false,
  add column if not exists accepted boolean not null default true;

-- ENQ sequence row (locked via FOR UPDATE inside the RPC transaction)
create table if not exists public.ref_sequence (
  id text primary key,
  last_seq bigint not null default 0
);
insert into public.ref_sequence (id, last_seq) values ('enquiry', 0)
on conflict (id) do nothing;
insert into public.ref_sequence (id, last_seq) values ('credential_request', 0)
on conflict (id) do nothing;
-- internal table: no anon/authenticated grants; service_role + RPCs only
grant all on public.ref_sequence to service_role;
revoke all on public.ref_sequence from anon, authenticated;

-- The single atomic enquiry RPC: honeypot/timing decisions are made in the
-- server fn; everything that touches rows is HERE, inside one transaction:
--   advisory lock on ip_hash -> duplicate check -> rate-limit count -> reject
--   or (lock ref_sequence row FOR UPDATE -> allocate seq -> insert with ENQ ref).
-- Invariants:
--   enquiry: max 5 accepted rows per ip_hash per rolling 10-minute window
--   duplicates (identical email+message within 10 min) insert flagged — leads
--   are never lost; rate-limit rejections consume no sequence value.
create or replace function public.submit_form_submission(
  p_form_type text,
  p_name text,
  p_email text,
  p_phone text,
  p_subject text,
  p_message text,
  p_data jsonb,
  p_ip_hash text,
  p_user_agent_hash text,
  p_practice text default null,
  p_service_slug text default null,
  p_flagged boolean default false
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limit int;
  v_window interval;
  v_count int;
  v_dup int;
  v_seq bigint;
  v_ref text;
  v_year text := to_char(now(), 'YYYY');
begin
  v_limit := 5;
  v_window := interval '10 minutes';

  -- Serialize per-source concurrent submissions: no check-then-insert race
  perform pg_advisory_xact_lock(hashtext(coalesce(p_ip_hash, 'anon') || ':enquiry'));

  -- Duplicate detection: identical email+message within 10 min inserts with
  -- flagged=true instead of rejecting — leads are never lost.
  select count(*) into v_dup
  from public.form_submissions
  where accepted
    and created_at > now() - interval '10 minutes'
    and email is not distinct from p_email
    and message is not distinct from p_message;
  if v_dup > 0 then
    p_flagged := true;
  end if;

  -- Rate limit check (accepted rows only, rolling window)
  select count(*) into v_count
  from public.form_submissions
  where accepted
    and ip_hash = p_ip_hash
    and created_at > now() - v_window;

  if v_count >= v_limit then
    raise exception 'RATE_LIMITED'
      using errcode = 'P0002';
  end if;

  -- ENQ reference allocation + insert, atomically
  update public.ref_sequence
     set last_seq = last_seq + 1
   where id = 'enquiry'
  returning last_seq into v_seq;

  v_ref := 'ENQ-' || v_year || '-' || lpad(v_seq::text, 4, '0');

  insert into public.form_submissions
    (form_type, name, email, phone, subject, message, data,
     ip_hash, user_agent_hash, practice, service_slug, flagged, ref)
  values
    (p_form_type, p_name, p_email, p_phone, p_subject, p_message, p_data,
     p_ip_hash, p_user_agent_hash, p_practice, p_service_slug, p_flagged, v_ref);

  return v_ref;
end;
$$;
revoke all on function public.submit_form_submission(text, text, text, text, text, text, jsonb, text, text, text, text, boolean) from public, anon, authenticated;
grant execute on function public.submit_form_submission(text, text, text, text, text, text, jsonb, text, text, text, text, boolean) to anon, authenticated;

-- ============================================================
-- 2. CREDENTIAL REQUESTS (the verification desk flow)
-- ============================================================
create table if not exists public.credential_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  credential text not null,
  message text,
  ip_hash text,
  user_agent_hash text,
  flagged boolean not null default false,
  accepted boolean not null default true,
  ref text unique,
  created_at timestamptz not null default now()
);
create index if not exists idx_credential_requests_created
  on public.credential_requests (created_at desc);

-- No table grants to anon/authenticated — the SECURITY DEFINER RPC is the
-- only public surface. Submissions are read by the service_role/dashboard only.
revoke all on public.credential_requests from anon, authenticated;
grant all on public.credential_requests to service_role;

-- Row Level Security on, with no policies: neither anon nor authenticated
-- (nor any logged-in role without a policy) can read, update or delete rows.
alter table public.credential_requests enable row level security;

-- The atomic credential-request RPC — same contract as the enquiry RPC:
-- advisory lock -> duplicate screen -> rate limit (5 per ip_hash per 10 min)
-- -> locked CREQ sequence allocation + insert.
create or replace function public.submit_credential_request(
  p_name text,
  p_company text,
  p_email text,
  p_phone text,
  p_credential text,
  p_message text,
  p_ip_hash text,
  p_user_agent_hash text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
  v_dup int;
  v_seq bigint;
  v_ref text;
  v_year text := to_char(now(), 'YYYY');
begin
  -- basic sanity: the RPC never trusts the network layer alone
  if p_name is null or btrim(p_name) = '' then
    raise exception 'INVALID_NAME' using errcode = 'P0001';
  end if;
  if p_email is null or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'INVALID_EMAIL' using errcode = 'P0001';
  end if;
  if p_credential is null or btrim(p_credential) = '' then
    raise exception 'INVALID_CREDENTIAL' using errcode = 'P0001';
  end if;

  perform pg_advisory_xact_lock(hashtext(coalesce(p_ip_hash, 'anon') || ':credential_request'));

  -- Duplicate screen: identical email+credential within 10 min — flagged, kept
  select count(*) into v_dup
  from public.credential_requests
  where accepted
    and created_at > now() - interval '10 minutes'
    and email is not distinct from p_email
    and credential is not distinct from p_credential;

  -- Rate limit (accepted rows only, rolling 10-minute window)
  select count(*) into v_count
  from public.credential_requests
  where accepted
    and ip_hash = p_ip_hash
    and created_at > now() - interval '10 minutes';

  if v_count >= 5 then
    raise exception 'RATE_LIMITED'
      using errcode = 'P0002';
  end if;

  update public.ref_sequence
     set last_seq = last_seq + 1
   where id = 'credential_request'
  returning last_seq into v_seq;

  v_ref := 'CREQ-' || v_year || '-' || lpad(v_seq::text, 4, '0');

  insert into public.credential_requests
    (name, company, email, phone, credential, message,
     ip_hash, user_agent_hash, flagged, ref)
  values
    (btrim(p_name), nullif(btrim(p_company), ''), lower(p_email), nullif(btrim(p_phone), ''),
     p_credential, nullif(btrim(p_message), ''),
     p_ip_hash, p_user_agent_hash, v_dup > 0, v_ref);

  return v_ref;
end;
$$;
revoke all on function public.submit_credential_request(text, text, text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_credential_request(text, text, text, text, text, text, text, text) to anon, authenticated;

-- ============================================================
-- 3. HARDEN: no table access for the website's anon/auth keys at all.
--    The two SECURITY DEFINER RPCs are the entire public surface.
--    (service_role keeps access for the dashboard/inbox.)
-- ============================================================
revoke select on public.form_submissions from anon, authenticated;
revoke insert on public.form_submissions from anon, authenticated;
revoke all on public.credential_requests from anon, authenticated;   -- no-op if just granted none; kept for clarity
revoke all on public.ref_sequence from anon, authenticated;

-- keep RLS enabled on form_submissions (already on); belt-and-braces for
-- credential_requests is above. No policies for anon/authenticated exist on
-- either table, so even a leaked grant cannot expose submissions.

-- ============================================================
-- 4. RETIRE THE CMS SURFACE (content now lives in the verified corpora)
-- ============================================================
-- The anon-key app no longer reads any of these; drop them so no stale
-- content can leak from an unmaintained admin flow.
drop table if exists public.content_items cascade;
drop table if exists public.sections cascade;
drop table if exists public.pages cascade;
drop table if exists public.categories cascade;
drop table if exists public.nav_items cascade;
drop table if exists public.media cascade;
drop table if exists public.newsletter_subscribers cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.audit_log cascade;
drop table if exists public.profiles cascade;
drop table if exists public.user_roles cascade;
drop type if exists public.app_role;

-- The auto-signup trigger that maintained profiles/user_roles goes with them.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.has_role(uuid, public.app_role);
drop function if exists public.is_staff(uuid);
