-- PHASE 6A-1 — Security + infrastructure migration
-- Per Phase 5 §14 (auth/security), §14.6 (audit_log), §7.2 (media extension),
-- §3 (verification columns on existing tables), §13.2.4/§13.2.5 (rate-limit RPC + ENQ sequence).
-- Forward-only. Run on dev Supabase first, then production (per Phase 5 §21.4).

-- ============================================================
-- 1. SECURITY: remove open-signup auto-admin bootstrap (Phase 5 §14.1 / S1)
-- ============================================================
-- Drop the first-user-becomes-admin trigger, but KEEP profile creation
-- (profiles row is needed for existing admin UX). New signups get NO role
-- until an admin grants one (admin creation itself is dashboard-driven — RUNBOOK).
drop trigger if exists on_auth_user_created on auth.users;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ============================================================
-- 2. RATE LIMIT + ENQ REFERENCE INFRASTRUCTURE (Phase 5 §13.2, as corrected)
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
-- internal table: no anon grants; service_role and the RPC (security definer) only
grant all on public.ref_sequence to service_role;
revoke all on public.ref_sequence from anon, authenticated;

-- The single atomic RPC: honeypot/timing decisions are made in the server fn;
-- everything that touches rows is HERE, inside one transaction:
--   advisory lock on ip_hash -> duplicate check -> rate-limit count -> reject or
--   (lock ref_sequence row FOR UPDATE -> allocate seq -> insert with ENQ ref).
-- Invariants (Phase 5 §13.2.4–5, corrected pass):
--   enquiry:    max 5 accepted rows per ip_hash per rolling 10-minute window
--   newsletter: max 3 accepted rows per ip_hash per rolling 1-hour window
--   no duplicate ENQ refs; failed transactions leave no partial enquiry;
--   rate-limit rejections consume no sequence value.
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
  -- newsletter uses the same RPC with different window/limit
  if p_form_type = 'newsletter' then
    v_limit := 3;
    v_window := interval '1 hour';
  else
    v_limit := 5;
    v_window := interval '10 minutes';
  end if;

  -- Serialize per-source concurrent submissions: no check-then-insert race
  perform pg_advisory_xact_lock(hashtext(coalesce(p_ip_hash, 'anon') || ':' || p_form_type));

  -- Duplicate detection (enquiry only): identical email+message within 10 min
  -- inserts with flagged=true instead of rejecting — leads are never lost.
  if p_form_type <> 'newsletter' then
    select count(*) into v_dup
    from public.form_submissions
    where accepted
      and created_at > now() - interval '10 minutes'
      and email is not distinct from p_email
      and message is not distinct from p_message;
    if v_dup > 0 then
      p_flagged := true;
    end if;
  end if;

  -- Rate limit check (accepted rows only, rolling window)
  select count(*) into v_count
  from public.form_submissions
  where accepted
    and ip_hash = p_ip_hash
    and form_type = p_form_type
    and created_at > now() - v_window;

  if v_count >= v_limit then
    raise exception 'RATE_LIMITED'
      using errcode = 'P0002';
  end if;

  if p_form_type = 'newsletter' then
    insert into public.newsletter_subscribers (email)
    values (lower(p_email))
    on conflict (email) do nothing;
    return 'OK';
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
revoke all on function public.submit_form_submission(...) from public, anon;
grant execute on function public.submit_form_submission(...) to anon, authenticated;

-- ============================================================
-- 3. AUDIT LOG (Phase 5 §14.6)
-- ============================================================
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor uuid,
  action text not null,
  entity text not null,
  entity_id uuid,
  diff jsonb,
  at timestamptz not null default now()
);
grant select on public.audit_log to authenticated;
grant all on public.audit_log to service_role;
alter table public.audit_log enable row level security;
create policy "staff read audit" on public.audit_log for select to authenticated using (public.has_role(auth.uid(),'admin'));
create index if not exists idx_audit_entity on public.audit_log (entity, entity_id);
create index if not exists idx_audit_at on public.audit_log (at desc);

-- Generic audit writer: attaches to entity tables in 6B migration
create or replace function public.audit_row_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_diff jsonb;
begin
  if TG_OP = 'DELETE' then
    v_diff := jsonb_build_object('deleted', to_jsonb(old));
  elsif TG_OP = 'INSERT' then
    v_diff := jsonb_build_object('inserted', to_jsonb(new));
  else
    v_diff := jsonb_strip_nulls(
      jsonb_build_object('before', to_jsonb(old) - 'updated_at' - 'created_at',
                         'after', to_jsonb(new) - 'updated_at' - 'created_at')
    );
  end if;
  insert into public.audit_log (actor, action, entity, entity_id, diff)
  values (auth.uid(), TG_OP, TG_TABLE_NAME, coalesce(new.id, old.id), v_diff);
  return coalesce(new, old);
end;
$$;
revoke all on function public.audit_row_change() from public, anon, authenticated;

-- ============================================================
-- 4. VERIFICATION COLUMNS on existing tables (Phase 5 §2.5)
-- ============================================================
alter table public.content_items
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified','needs_client_review','verified')),
  add column if not exists source_ref text,
  add column if not exists verification_note text;

alter table public.site_settings
  add column if not exists verification_status text not null default 'verified'
    check (verification_status in ('unverified','needs_client_review','verified')),
  add column if not exists source_ref text,
  add column if not exists verification_note text;

alter table public.pages
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified','needs_client_review','verified')),
  add column if not exists source_ref text,
  add column if not exists verification_note text;

-- Publish-guard trigger function (Phase 5 §3.2): is_active requires verified;
-- de-verification unpublishes. Attached to every verification-capable table.
create or replace function public.guard_publication()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.is_active and new.verification_status <> 'verified' then
    raise exception 'Cannot publish: verification_status must be ''verified'' before is_active can be true'
      using errcode = 'check_violation';
  end if;
  if new.verification_status <> 'verified' and old.is_active then
    new.is_active := false;
  end if;
  return new;
end;
$$;
revoke all on function public.guard_publication() from public, anon, authenticated;

-- Attach to existing content tables now
drop trigger if exists t_content_guard on public.content_items;
create trigger t_content_guard before insert or update on public.content_items
  for each row execute function public.guard_publication();

drop trigger if exists t_pages_guard on public.pages;
create trigger t_pages_guard before insert or update on public.pages
  for each row execute function public.guard_publication();

-- Tighten public read policies: verified+active only (staff bypass via RLS role)
drop policy if exists "content public read" on public.content_items;
create policy "content public read" on public.content_items
  for select to anon, authenticated
  using (is_active and verification_status = 'verified' or public.is_staff(auth.uid()));

drop policy if exists "pages public read" on public.pages;
create policy "pages public read" on public.pages
  for select to anon, authenticated
  using (is_active and verification_status = 'verified' or public.is_staff(auth.uid()));

-- ============================================================
-- 5. MEDIA EXTENSION (Phase 5 §7.2)
-- ============================================================
alter table public.media
  add column if not exists caption text,
  add column if not exists focal_point jsonb,
  add column if not exists width int,
  add column if not exists height int,
  add column if not exists variants jsonb not null default '[]'::jsonb;

-- widen kind to include credential-scan documents
alter table public.media drop constraint if exists media_kind_check;
alter table public.media
  add constraint media_kind_check check (kind in ('image','video','pdf','document','file'));

-- ============================================================
-- 6. SETTINGS: origin + flagged keys groundwork (values via seeds/6B)
-- ============================================================
insert into public.site_settings (key, value, group_name, label, input_type, sort_order)
values
  ('site_url', '', 'general', 'Site URL (origin, for canonical/sitemap/OG)', 'text', 5),
  ('contact_phone_secondary', '', 'contact', 'Secondary phone', 'text', 12)
on conflict (key) do nothing;

-- Flag disputed settings per Phase 5 §19 (do NOT resolve — client gate #2/#3)
update public.site_settings set
  verification_status = 'needs_client_review',
  verification_note = 'Gate #2: 3-way address conflict (profile: Jaypee Kosmos Sector-134 201304; certificates: Jaypee Greens 201301; current site: Bhutani Alphathum Sector 90). Phase 1 C10.',
  source_ref = 'Phase 1 §12 / Phase 5 §19'
where key = 'contact_address';

update public.site_settings set
  verification_status = 'needs_client_review',
  verification_note = 'Gate #6: unsupported statistics — Phase 2 §12. Archived; not public.',
  source_ref = 'Phase 2 §12 / Phase 1 §4.5'
where key in ('seo_title','seo_description');

-- public settings read: verified only (flags above keep disputed copy out of
-- the public site until resolved; chrome keys remain verified by default)
drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
  for select to anon, authenticated
  using (verification_status = 'verified' or public.is_staff(auth.uid()));

-- ============================================================
-- 7. LEGACY CLEANUP GUARDS (Phase 5 §18.1 dispositions)
-- ============================================================
-- Unsupported stats rows: archive (never delete data)
update public.content_items set
  is_active = false,
  verification_status = 'needs_client_review',
  verification_note = case
    when title ilike '%150%' then 'Gate #6: "150+ Projects Commissioned" not sourced (Phase 2 §12). Documented corpus: 54 HVAC + 22 fire + 10 UG records.'
    when title ilike '%315%' then 'Gate #6: "315+ KM Utilities Laid" not sourced; documented scopes sum differently (Phase 2 §12).'
    when title ilike '%10+%' then 'Gate #6: "10+ years" vs 2012 incorporation (Phase 1 C9).'
    else 'Gate #6: stat requires client-approved wording.'
  end,
  source_ref = 'Phase 5 §18.1'
where collection = 'stats' and is_active = true;

-- Invented testimonials: archive, never public (gate #7)
update public.content_items set
  is_active = false,
  verification_status = 'needs_client_review',
  verification_note = 'Gate #7: invented placeholder testimonial (Phase 2 §6). Real, approved quotes only.',
  source_ref = 'Phase 5 §18.1'
where collection = 'testimonials';

-- Solar service row: archive pending gate #4 (cover-only claim, Phase 1 C19)
update public.content_items set
  is_active = false,
  verification_status = 'needs_client_review',
  verification_note = 'Gate #4: Solar appears only on DOC A cover; no scope/projects/team anywhere (Phase 1 C19). Do not publish until client confirms.',
  source_ref = 'Phase 1 §2.1 / Phase 5 §18.1'
where collection = 'services' and title = 'Solar';

-- Placeholder policy pages: unpublish (gate #9)
update public.pages set
  is_active = false,
  verification_status = 'needs_client_review',
  verification_note = 'Gate #9: placeholder legal text requires legal review before publication.',
  source_ref = 'Phase 2 §3 / Phase 5 §18.1'
where content ilike '%[Placeholder%' or is_active = true;
