-- PHASE 6B — Content/entity tables, junctions, verification policies, seeds
-- Per Phase 5 §2 (schema), §3 (verification), §4 (projects), §5 (graph), §18 (migration).
-- 9 new content/entity tables + audit_log(6A) + 3 junction tables.
-- Seeds: only undisputed facts from Phase 1 sources carry 'verified';
-- conflict-flagged rows carry 'needs_client_review' with the Phase 1 conflict noted.

-- ============================================================
-- PRACTICES (Phase 5 §2.3)
-- ============================================================
create table public.practices (
  id uuid primary key default gen_random_uuid(),
  number int not null unique check (number in (1,2)),
  name text not null,
  short_label text not null,
  slug text not null unique,
  scope_line text,
  narrative text,
  hero_media_id uuid references public.media(id) on delete set null,
  hero_focal jsonb,
  metrics jsonb not null default '[]'::jsonb,
  -- shared conventions
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','needs_client_review','verified')),
  source_ref text,
  verification_note text,
  is_active boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_practices_order on public.practices (number);
grant select on public.practices to anon;
grant select, insert, update, delete on public.practices to authenticated;
grant all on public.practices to service_role;
alter table public.practices enable row level security;
create policy "practices public read" on public.practices
  for select to anon, authenticated
  using (is_active and verification_status = 'verified' or public.is_staff(auth.uid()));
create policy "practices staff write" on public.practices
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_practices_updated before update on public.practices
  for each row execute function public.touch_updated_at();
create trigger t_practices_guard before insert or update on public.practices
  for each row execute function public.guard_publication();
create trigger t_practices_audit after insert or update or delete on public.practices
  for each row execute function public.audit_row_change();

-- ============================================================
-- SERVICES (canonical — Phase 5 §2.3, §5.1; kills 3-way duplication)
-- ============================================================
create table public.services (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete restrict,
  name text not null,
  slug text not null unique,
  tagline text,
  standfirst text,
  overview text,
  included jsonb not null default '[]'::jsonb,
  method_panels jsonb not null default '[]'::jsonb,
  icon text,
  sort_order int not null default 0,
  is_active boolean not null default false,
  -- verification/publication per conventions; is_active requires verified (trigger)
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','needs_client_review','verified')),
  source_ref text,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_services_practice on public.services (practice_id, sort_order);
grant select on public.services to anon;
grant select, insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "services public read" on public.services
  for select to anon, authenticated
  using (is_active and verification_status = 'verified' or public.is_staff(auth.uid()));
create policy "services staff write" on public.services
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_services_updated before update on public.services
  for each row execute function public.touch_updated_at();
create trigger t_services_guard before insert or update on public.services
  for each row execute function public.guard_publication();
create trigger t_services_audit after insert or update or delete on public.services
  for each row execute function public.audit_row_change();

-- ============================================================
-- SECTORS (Phase 5 §2.3 — public label "Sectors", evidence tiers)
-- ============================================================
create table public.sectors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  evidence_tier text not null check (evidence_tier in ('hub','service_led','list_only')),
  standfirst text,
  relevance text,
  sort_order int not null default 0,
  is_active boolean not null default false,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','needs_client_review','verified')),
  source_ref text,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.sectors to anon;
grant select, insert, update, delete on public.sectors to authenticated;
grant all on public.sectors to service_role;
alter table public.sectors enable row level security;
create policy "sectors public read" on public.sectors
  for select to anon, authenticated
  using (is_active and verification_status = 'verified' or public.is_staff(auth.uid()));
create policy "sectors staff write" on public.sectors
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_sectors_updated before update on public.sectors
  for each row execute function public.touch_updated_at();
create trigger t_sectors_guard before insert or update on public.sectors
  for each row execute function public.guard_publication();
create trigger t_sectors_audit after insert or update or delete on public.sectors
  for each row execute function public.audit_row_change();

-- ============================================================
-- CLIENTS (Phase 5 §2.3 — relationship-typed; partners merged here)
-- ============================================================
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  category_id uuid references public.categories(id) on delete set null,
  relationship text not null check (relationship in ('client','pmc','architect','epc_counterparty')),
  logo_media_id uuid references public.media(id) on delete set null,
  logo_permission text not null default 'pending'
    check (logo_permission in ('granted','pending','denied','n_a')),
  practice_id uuid references public.practices(id) on delete set null,
  sort_order int not null default 0,
  is_active boolean not null default false,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','needs_client_review','verified')),
  source_ref text,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_clients_relationship on public.clients (relationship);
create index idx_clients_category on public.clients (category_id);
grant select on public.clients to anon;
grant select, insert, update, delete on public.clients to authenticated;
grant all on public.clients to service_role;
alter table public.clients enable row level security;
create policy "clients public read" on public.clients
  for select to anon, authenticated
  using (is_active and verification_status = 'verified' or public.is_staff(auth.uid()));
create policy "clients staff write" on public.clients
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_clients_updated before update on public.clients
  for each row execute function public.touch_updated_at();
create trigger t_clients_guard before insert or update on public.clients
  for each row execute function public.guard_publication();
create trigger t_clients_audit after insert or update or delete on public.clients
  for each row execute function public.audit_row_change();

-- ============================================================
-- PROJECTS (Phase 5 §4 — single schema, Template A/B)
-- ============================================================
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  ref text unique,
  title text not null,
  slug text not null unique,
  practice_id uuid not null references public.practices(id) on delete restrict,
  location_city text not null,
  location_state text not null,
  country text not null default 'India',
  status text not null default 'unconfirmed'
    check (status in ('completed','ongoing','unconfirmed')),
  status_note text,
  scope_line text,
  metrics jsonb not null default '[]'::jsonb,
  client_display text,
  hero_media_id uuid references public.media(id) on delete set null,
  completion_year int,
  featured boolean not null default false,
  template text not null default 'a' check (template in ('a','b')),
  summary text,
  scope_breakdown jsonb not null default '[]'::jsonb,
  execution_notes jsonb not null default '[]'::jsonb,
  outcome text,
  seo_title text,
  seo_description text,
  sort_order int not null default 0,
  is_active boolean not null default false,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','needs_client_review','verified')),
  source_ref text,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_projects_practice on public.projects (practice_id, sort_order);
create index idx_projects_state on public.projects (location_state);
create index idx_projects_status on public.projects (status);
grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "projects public read" on public.projects
  for select to anon, authenticated
  using (is_active and verification_status = 'verified' or public.is_staff(auth.uid()));
create policy "projects staff write" on public.projects
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_projects_updated before update on public.projects
  for each row execute function public.touch_updated_at();
create trigger t_projects_guard before insert or update on public.projects
  for each row execute function public.guard_publication();
create trigger t_projects_audit after insert or update or delete on public.projects
  for each row execute function public.audit_row_change();

-- Template B publish gate (Phase 5 §4.2): publishing template='b' requires
-- summary + scope_breakdown; effective template downgrade is enforced in queries.
create or replace function public.guard_project_template()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.template = 'b' and new.is_active
     and (new.summary is null or btrim(new.summary) = ''
          or jsonb_array_length(new.scope_breakdown) = 0) then
    raise exception 'Template B requires summary and scope_breakdown before publication (Phase 5 §4.2)'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;
create trigger t_projects_template before insert or update on public.projects
  for each row execute function public.guard_project_template();

-- ============================================================
-- TEAM MEMBERS (Phase 5 §2.3)
-- ============================================================
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  "group" text not null check ("group" in ('leadership','delivery','site_design')),
  practice_id uuid references public.practices(id) on delete set null,
  note text,
  photo_media_id uuid references public.media(id) on delete set null,
  sort_order int not null default 0,
  is_active boolean not null default false,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','needs_client_review','verified')),
  source_ref text,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_team_group on public.team_members ("group", sort_order);
grant select on public.team_members to anon;
grant select, insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;
alter table public.team_members enable row level security;
create policy "team public read" on public.team_members
  for select to anon, authenticated
  using (is_active and verification_status = 'verified' or public.is_staff(auth.uid()));
create policy "team staff write" on public.team_members
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_team_updated before update on public.team_members
  for each row execute function public.touch_updated_at();
create trigger t_team_guard before insert or update on public.team_members
  for each row execute function public.guard_publication();
create trigger t_team_audit after insert or update or delete on public.team_members
  for each row execute function public.audit_row_change();

-- ============================================================
-- CREDENTIALS (Phase 5 §2.3)
-- ============================================================
create table public.credentials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('statutory','quality','membership')),
  number text,
  jurisdiction text,
  issued_at date,
  expires_at date,
  scan_media_id uuid references public.media(id) on delete set null,
  scan_status text not null default 'on_request'
    check (scan_status in ('approved','on_request','pending')),
  sort_order int not null default 0,
  is_active boolean not null default false,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','needs_client_review','verified')),
  source_ref text,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.credentials to anon;
grant select, insert, update, delete on public.credentials to authenticated;
grant all on public.credentials to service_role;
alter table public.credentials enable row level security;
create policy "credentials public read" on public.credentials
  for select to anon, authenticated
  using (is_active and verification_status = 'verified' or public.is_staff(auth.uid()));
create policy "credentials staff write" on public.credentials
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_credentials_updated before update on public.credentials
  for each row execute function public.touch_updated_at();
create trigger t_credentials_guard before insert or update on public.credentials
  for each row execute function public.guard_publication();
create trigger t_credentials_audit after insert or update or delete on public.credentials
  for each row execute function public.audit_row_change();

-- ============================================================
-- OFFICES (Phase 5 §2.3)
-- ============================================================
create table public.offices (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  type text not null check (type in ('corporate','branch','manufacturing')),
  address text,
  phone text,
  map_url text,
  hours text,
  is_primary boolean not null default false,
  sort_order int not null default 0,
  is_active boolean not null default false,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','needs_client_review','verified')),
  source_ref text,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.offices to anon;
grant select, insert, update, delete on public.offices to authenticated;
grant all on public.offices to service_role;
alter table public.offices enable row level security;
create policy "offices public read" on public.offices
  for select to anon, authenticated
  using (is_active and verification_status = 'verified' or public.is_staff(auth.uid()));
create policy "offices staff write" on public.offices
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_offices_updated before update on public.offices
  for each row execute function public.touch_updated_at();
create trigger t_offices_guard before insert or update on public.offices
  for each row execute function public.guard_publication();
create trigger t_offices_audit after insert or update or delete on public.offices
  for each row execute function public.audit_row_change();

-- ============================================================
-- EQUIPMENT (Phase 5 §2.3 — plant register; quantity null = count-free row)
-- ============================================================
create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  item text not null,
  spec text,
  quantity int,
  sort_order int not null default 0,
  is_active boolean not null default false,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','needs_client_review','verified')),
  source_ref text,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_equipment_practice on public.equipment (practice_id, sort_order);
grant select on public.equipment to anon;
grant select, insert, update, delete on public.equipment to authenticated;
grant all on public.equipment to service_role;
alter table public.equipment enable row level security;
create policy "equipment public read" on public.equipment
  for select to anon, authenticated
  using (is_active and verification_status = 'verified' or public.is_staff(auth.uid()));
create policy "equipment staff write" on public.equipment
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger t_equipment_updated before update on public.equipment
  for each row execute function public.touch_updated_at();
create trigger t_equipment_guard before insert or update on public.equipment
  for each row execute function public.guard_publication();
create trigger t_equipment_audit after insert or update or delete on public.equipment
  for each row execute function public.audit_row_change();

-- ============================================================
-- JUNCTIONS (Phase 5 §2.4)
-- ============================================================
create table public.project_services (
  project_id uuid not null references public.projects(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  primary key (project_id, service_id)
);
create index idx_ps_service on public.project_services (service_id);
grant select on public.project_services to anon, authenticated;
grant select, insert, update, delete on public.project_services to authenticated;
grant all on public.project_services to service_role;
alter table public.project_services enable row level security;
create policy "project_services public read" on public.project_services
  for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.id = project_id
                 and p.is_active and p.verification_status = 'verified')
         or public.is_staff(auth.uid()));
create policy "project_services staff write" on public.project_services
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.project_sectors (
  project_id uuid not null references public.projects(id) on delete cascade,
  sector_id uuid not null references public.sectors(id) on delete cascade,
  primary key (project_id, sector_id)
);
create index idx_pse_sector on public.project_sectors (sector_id);
grant select on public.project_sectors to anon, authenticated;
grant select, insert, update, delete on public.project_sectors to authenticated;
grant all on public.project_sectors to service_role;
alter table public.project_sectors enable row level security;
create policy "project_sectors public read" on public.project_sectors
  for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.id = project_id
                 and p.is_active and p.verification_status = 'verified')
         or public.is_staff(auth.uid()));
create policy "project_sectors staff write" on public.project_sectors
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.project_clients (
  project_id uuid not null references public.projects(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  role text not null check (role in ('principal','contractor','pmc','owner')),
  primary key (project_id, client_id)
);
create index idx_pc_client on public.project_clients (client_id);
grant select on public.project_clients to anon, authenticated;
grant select, insert, update, delete on public.project_clients to authenticated;
grant all on public.project_clients to service_role;
alter table public.project_clients enable row level security;
create policy "project_clients public read" on public.project_clients
  for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.id = project_id
                 and p.is_active and p.verification_status = 'verified')
         or public.is_staff(auth.uid()));
create policy "project_clients staff write" on public.project_clients
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- ============================================================
-- EDITOR CANNOT SELF-VERIFY (Phase 5 §3.3): verified-transition requires admin.
-- guard_publication handles publish/de-verify; this guards the status transition.
-- ============================================================
create or replace function public.guard_verification_transition()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.verification_status = 'verified' and old.verification_status <> 'verified' then
    if not public.has_role(auth.uid(), 'admin') then
      raise exception 'Only an admin can mark content as verified (Phase 5 §3.3)'
        using errcode = '42501';
    end if;
    if new.source_ref is null or btrim(new.source_ref) = '' then
      raise exception 'Verified content requires a source_ref (Phase 5 §3.3)'
        using errcode = 'check_violation';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.guard_verification_transition() from public, anon, authenticated;

-- attach to every verification-capable entity table
do $$
declare t text;
begin
  foreach t in array array['practices','services','sectors','clients','projects',
                           'team_members','credentials','offices','equipment',
                           'content_items','site_settings','pages'] loop
    execute format('drop trigger if exists t_%I_verify on public.%I', t, t);
    execute format('create trigger t_%I_verify before update on public.%I
                    for each row execute function public.guard_verification_transition()', t, t);
  end loop;
end $$;

-- ============================================================
-- SEEDS (Phase 5 §21.5) — reviewed against Phase 1 line-by-line.
-- Undisputed facts: verified. Conflicts/gaps: needs_client_review with note.
-- Nothing invented. Nothing resolved by guessing.
-- ============================================================

-- --- practices (DOC A p5) ---
insert into public.practices (number, name, short_label, slug, scope_line, is_active, verification_status, source_ref, sort_order) values
 (1, 'UG Utilities, Electrical & CGD', 'UG Utilities & Electrical', 'ug-utilities-electrical',
  'Underground HT/LT cable networks, city gas distribution, last-mile connections, 33/11 kV substations and HDD trenchless works.',
  true, 'verified', 'DOC A p5 — Practice One', 1),
 (2, 'MEP, Fire Fighting & Fire Protection', 'MEP, HVAC & Fire', 'mep-fire-protection',
  'HVAC, VRV, clean rooms, fire fighting & hydrant systems and MEP services with testing, commissioning and SLA-backed service.',
  true, 'verified', 'DOC A p5 — Practice Two', 2)
on conflict (slug) do nothing;

-- --- services (P3 §5.2 taxonomy; scope wording from PDFs; published=pending review of wording) ---
insert into public.services (practice_id, name, slug, tagline, standfirst, overview, included, icon, is_active, verification_status, source_ref, sort_order) values
 ((select id from public.practices where number=1), 'UG HT/LT Cable Laying', 'ug-ht-lt-cable-laying',
  'Underground Power Networks', 'Underground 11 kV, 33 kV and 220 kV cable laying including trenching, ducting, jointing and reinstatement.',
  'Underground HT/LT cable laying for smart-city and metro connectivity programmes, delivered turnkey: supply, installation, testing and commissioning.',
  '["Trenching","Ducting","Cable laying","Jointing","Reinstatement"]'::jsonb, 'Cable',
  false, 'verified', 'DOC A §2 / DOC C p8', 1),
 ((select id from public.practices where number=1), 'CGD Networks — MDPE & Steel', 'cgd-networks',
  'City Gas Distribution', 'City gas distribution networks — MDPE and steel gas mains with HDPE/MDPE pipeline installation, trenching, jointing and reinstatement.',
  'City gas distribution networks: MDPE and steel gas mains, house and industry connections, and last-mile connectivity for gas utilities.',
  '["MDPE mains","Steel mains","HDPE/MDPE pipeline installation","Trenching","Jointing","Reinstatement"]'::jsonb, 'Flame',
  false, 'verified', 'DOC A §2 / DOC C', 2),
 ((select id from public.practices where number=1), 'LMC Works', 'lmc-works',
  'Last-Mile Connectivity', 'Last-mile connectivity: house and industry gas connections at program scale.',
  'LMC (last-mile connectivity) works — house and industry connections demonstrated at 5,000-connection scale at Sangli.',
  '["House connections","Industry connections","Network tie-ins"]'::jsonb, 'Building2',
  false, 'verified', 'DOC A §2 / DOC C p8', 3),
 ((select id from public.practices where number=1), '33/11 kV Substation Construction & Erection', 'substation-construction',
  'Sub-Stations', 'Construction and erection of 33/11 kV sub-stations, complete with panel installation and commissioning.',
  'Construction and erection of 33/11 kV sub-stations, complete with panel installation and commissioning.',
  '["Structure erection","Panel installation","Commissioning"]'::jsonb, 'Zap',
  false, 'verified', 'DOC A §2', 4),
 ((select id from public.practices where number=1), 'HDD & Trenchless Works', 'hdd-trenchless',
  'Trenchless Crossing', 'Horizontal directional drilling with an owned Drillto fleet up to 32-tonne pullback.',
  'Horizontal directional drilling with an owned Drillto fleet (32 t, 28 t, 20 t rigs) — trenchless crossings up to 32-tonne pullback capability.',
  '["HDD crossings","Drillto 32/28/20 t fleet","Winch up to 250 m"]'::jsonb, 'Tornado',
  false, 'verified', 'DOC A p11-p12 / DOC C p5', 5),
 ((select id from public.practices where number=2), 'HVAC Systems', 'hvac-systems',
  'Climate Engineering', 'Centralized HVAC systems — chillers, AHUs, ducting — delivered turnkey with testing and commissioning.',
  'HVAC system design, supply, installation, testing and commissioning for corporate, retail, industrial and hospitality projects. Largest single installation on record: 4,000 TR at World Trade Tower, Noida.',
  '["Chillers","AHU plants","Ducting","Air & water balancing"]'::jsonb, 'Snowflake',
  false, 'verified', 'DOC A §3 / DOC B p3', 6),
 ((select id from public.practices where number=2), 'VRV / VRF Systems', 'vrv-vrf-systems',
  'Precision Cooling', 'Variable refrigerant volume systems for offices, hotels and residences with centralized and zoned control.',
  'VRV/VRF systems with centralized and zoned control for offices, hotels and residences.',
  '["Outdoor & indoor units","Refrigerant piping","Centralized controllers"]'::jsonb, 'Wind',
  false, 'verified', 'DOC B p3', 7),
 ((select id from public.practices where number=2), 'Fire Fighting & Hydrant / Sprinkler Systems', 'fire-fighting-hydrant',
  'Life Safety', 'Turnkey fire protection — hydrant networks, sprinklers, wet risers and pump rooms engineered to national codes.',
  'Fire fighting and hydrant/sprinkler systems delivered turnkey; 22 documented installations across Noida, New Delhi, Gurugram, Ghaziabad and Jaipur.',
  '["Hydrant networks","Sprinkler systems","Wet risers","Pump rooms"]'::jsonb, 'FlameKindling',
  false, 'verified', 'DOC A p17 / DOC B p10', 8),
 ((select id from public.practices where number=2), 'Clean Rooms — Hospital', 'clean-rooms',
  'Controlled Environments', 'Hospital, pharmaceutical and laboratory clean rooms with HEPA filtration and pressure control.',
  'Clean rooms for hospitals and controlled environments with HEPA filtration, laminar flow and pressure cascade.',
  '["HEPA filtration","Laminar flow","Pressure cascade","Validation support"]'::jsonb, 'ShieldCheck',
  false, 'verified', 'DOC B p3 (Clean Room – Hospital)', 9),
 ((select id from public.practices where number=2), 'MEP Services', 'mep-services',
  'Integrated MEP', 'Mechanical, electrical and plumbing execution as a single accountable partner — from BOQ to commissioning.',
  'MEP services delivered on a turnkey basis — supply, installation, testing & commissioning — for both practices.',
  '["Design & BOQ","Multi-trade execution","Testing & commissioning","Handover support"]'::jsonb, 'Layers',
  false, 'verified', 'DOC A p5 (listed under both practices)', 10),
 ((select id from public.practices where number=2), 'Testing & Commissioning', 'testing-commissioning',
  'Commissioning Rigor', 'Ten named testing & commissioning services from air & water balancing to pre-construction plan review.',
  'Testing & commissioning: air & water balancing, functional performance testing, control system verification, HVAC commissioning, cleanroom testing, sound & vibration, fume hood, duct leakage, cooling tower performance and pre-construction plan review.',
  '["Air & water balancing","Functional performance testing","Cleanroom testing","Duct leakage testing"]'::jsonb, 'Wrench',
  false, 'verified', 'DOC A p15 / DOC B p6', 11)
on conflict (slug) do nothing;

-- --- sectors (P3 §5.3 tiers) ---
insert into public.sectors (name, slug, evidence_tier, standfirst, is_active, verification_status, source_ref, sort_order) values
 ('Smart-City & Metro Infrastructure', 'smart-city-metro', 'hub',
  'Smart-city electrical programs and metro connectivity across Patna, Banaras, Lucknow and Gurugram.',
  true, 'verified', 'DOC C p8', 1),
 ('Oil, Gas & CGD Utilities', 'oil-gas-cgd', 'hub',
  'City gas distribution networks and last-mile connections for BGRL and allied gas utilities.',
  true, 'verified', 'DOC C p8 / Phase 1 §3', 2),
 ('Corporate & Commercial Real Estate', 'corporate-commercial', 'hub',
  'HVAC, fire protection and MEP installations for corporates, offices, retail and commercial spaces.',
  true, 'verified', 'DOC B pp.8-9 / DOC A p14', 3),
 ('Healthcare & Hospitals', 'healthcare-hospitals', 'service_led',
  'Clean room capability and hospital-sector HVAC — service-led framing.',
  true, 'verified', 'DOC A p14 / DOC B p3', 4),
 ('Industrial & Manufacturing', 'industrial-manufacturing', 'hub',
  'HVAC and electrical works for manufacturing plants and industrial clients.',
  true, 'verified', 'DOC A p14 / DOC B pp.8-9', 5),
 ('Education', 'education', 'list_only', null,
  false, 'verified', 'DOC A p14 (Educational Institutions)', 6),
 ('Hotels & Hospitality', 'hotels-hospitality', 'list_only', null,
  false, 'verified', 'DOC A p14', 7),
 ('Residential Townships', 'residential-townships', 'list_only', null,
  false, 'verified', 'DOC A p14', 8),
 ('Public Sector (PSU)', 'public-sector', 'list_only', null,
  false, 'verified', 'DOC A p4 (Public Sector Organizations)', 9)
on conflict (slug) do nothing;

-- --- credentials (statutory: verified — certificate-backed; ISO: gate #13) ---
insert into public.credentials (title, category, number, jurisdiction, issued_at, scan_status, is_active, verification_status, source_ref, sort_order) values
 ('Certificate of Incorporation', 'statutory', 'U45400UP2012PTC054355', 'Registrar of Companies, Uttar Pradesh', '2012-12-26', 'on_request', true, 'verified', 'Certificate scan — DOC B p12 / DOC C p9', 1),
 ('Permanent Account Number (PAN)', 'statutory', 'AAFCC1314H', 'Income Tax Department, Govt of India', null, 'on_request', true, 'verified', 'DOC A p20 / Udyam certificate', 2),
 ('Udyam (MSME) Registration', 'statutory', 'UDYAM-UP-28-0013458', 'Ministry of MSME — Small · Services', '2021-02-17', 'on_request', true, 'verified', 'Udyam certificate scan', 3),
 ('GST Registration — Uttar Pradesh', 'statutory', '09AAFCC1314H1Z0', 'GST Network — Noida', null, 'on_request', true, 'verified', 'GST REG-06 certificate', 4),
 ('GST Registration — Maharashtra', 'statutory', '27AAFCC1314H1Z2', 'GST Network — Sangli', '2021-03-04', 'on_request', true, 'verified', 'GST REG-06 certificate', 5),
 ('GST Registration — Bihar', 'statutory', '10AAFCC1314H1ZH', 'GST Network — Patna', '2018-04-10', 'on_request', true, 'verified', 'GST REG-06 certificate', 6),
 ('GST Registration — Delhi', 'statutory', '07AAFCC1314H1Z4', 'GST Network — New Delhi', '2018-05-07', 'on_request', true, 'verified', 'GST REG-06 certificate', 7),
 ('GST Registration — Haryana', 'statutory', '06AAFCC1314H1Z6', 'GST Network — Gurugram', '2018-11-30', 'on_request', true, 'verified', 'GST REG-06 certificate', 8),
 ('ESI Registration', 'statutory', '67000673940001019', 'Employees'' State Insurance Corporation', '2018-05-01', 'on_request', true, 'verified', 'ESIC letter scan', 9),
 ('ISO 9001:2015', 'quality', null, null, null, 'on_request', false, 'needs_client_review',
  'DOC A p19 (badge only)',
  10),
 ('MSME Membership', 'membership', 'UDYAM-UP-28-0013458', 'Ministry of MSME', '2021-02-17', 'pending', true, 'verified', 'Udyam certificate', 11),
 ('Make in India', 'membership', null, null, null, 'pending', false, 'needs_client_review', 'DOC A p19 badge', 12)
on conflict do nothing;

-- ISO gate note (gate #13): verification_note, not part of insert above
update public.credentials set verification_note =
  'Gate #13: ISO 9001:2015 badge appears in DOC A p19 with no issuing body or certificate scan anywhere. "ISO 9001:2015 Certified" is the documented badge wording; publish only as "certificate on request" until issuer/scan provided.'
where title = 'ISO 9001:2015';

-- --- offices (gates #2/#16: all needs_client_review except none — no guessing) ---
insert into public.offices (city, type, address, is_primary, is_active, verification_status, source_ref, verification_note, sort_order) values
 ('Noida', 'corporate', '801, KM03, Jaypee Kosmos, Sector-134, Noida – 201304', true, false, 'needs_client_review',
  'DOC A p19 / DOC C p20',
  'Gate #2 (C10): profile says Jaypee Kosmos Sector-134 201304; certificates say Jaypee Greens 201301; the existing website shows Bhutani Alphathum Sector 90 (matches no document). Client must confirm the current address before publication.',
  1),
 ('Patna', 'branch', 'M.M. Colony, Sec-D, Khagaul, Patna, Bihar 801105', false, false, 'needs_client_review',
  'DOC A p19 / Bihar GST certificate',
  'Branch address per GST certificate; confirm current status (gate #16).', 2),
 ('Gurugram', 'branch', '1403, New-3, Patel Nagar, Gurgaon, Haryana 122001', false, false, 'needs_client_review',
  'DOC A p19 / Haryana GST certificate',
  'Branch address per GST certificate; confirm current status (gate #16).', 3),
 ('Sangli', 'branch', 'Flat No. 102, Abhaynagar, New Utkarshra, Sangli, Maharashtra 416416', false, false, 'needs_client_review',
  'DOC A p19 / Maharashtra GST certificate',
  'Branch address per GST certificate; confirm current status (gate #16).', 4),
 ('Rajasthan', 'manufacturing', null, false, false, 'needs_client_review',
  'DOC A p19 (Central Manufacturing Unit — city/address not given)',
  'Gate #16: no city or address documented for the Rajasthan manufacturing unit; also what is manufactured is not stated. Requires client input.', 5)
on conflict do nothing;

-- --- team (Phase 1 §9 — names+roles only; bios/years EXCLUDED pending C1-C7) ---
insert into public.team_members (name, role, "group", practice_id, is_active, verification_status, source_ref, verification_note, sort_order) values
 ('Sanjay Sharma', 'Director', 'leadership', null, false, 'needs_client_review', 'DOC A p7 / DOC B p4',
  'C1/C4: 25 yrs (UG section) vs 20 yrs (HVAC section); title Director vs Director: Projects. Name+role only until resolved.', 1),
 ('Mayank Kaushal', 'Director', 'leadership', null, false, 'verified', 'DOC A p7 (15 yrs, UG utilities — consistent)', null, 2),
 ('Anurag Parashar', 'Director', 'leadership', null, false, 'needs_client_review', 'DOC A p7 / DOC B p4',
  'C2/C4: 14 yrs (UG) vs 11 yrs (HVAC); title variants. Name+role only until resolved.', 3),
 ('Malkit Singh', 'Patron', 'leadership', (select id from public.practices where number=2), false, 'needs_client_review', 'DOC A p8 / DOC B p4',
  'C3: Malkit (titles) vs Malkiyat (DOC B bio). 42 yrs HVAC is consistent. Name+role only until resolved.', 4),
 ('CA Chitin Sapria', 'Financial Advisor', 'leadership', null, false, 'verified', 'DOC A p8 (20 yrs, financial sector)', null, 5),
 ('Vinod Pouchary', 'Sr. Project Manager', 'delivery', null, false, 'needs_client_review', 'DOC A p7-9',
  'C5: three title variants (Sr. PM UG / Sr. PM HVAC & Fire / Sr. Manager Fire & HVAC Division). Name+role only until resolved.', 6),
 ('Sachin Jamdhade', 'BDM', 'delivery', (select id from public.practices where number=1), false, 'verified', 'DOC A p7 (10 yrs BD)', null, 7),
 ('Shailendra Sharma', 'Sr. Project Manager – HVAC', 'delivery', (select id from public.practices where number=2), false, 'needs_client_review', 'DOC A p9 / DOC B p5',
  'C7: Shaliendra (name field) vs Shailendra (bio).', 8),
 ('Ashish Sharma', 'Manager – UG', 'delivery', (select id from public.practices where number=1), false, 'needs_client_review', 'DOC A p7 / DOC C p7',
  'C6: Manager Project (DOC C) vs Manager – UG (DOC A).', 9),
 ('Vir Kumar Singh', 'Manager – UG', 'delivery', (select id from public.practices where number=1), false, 'verified', 'DOC A p7 (10 yrs)', null, 10),
 ('Rajeshwar Boke', 'Project Manager – UG', 'delivery', (select id from public.practices where number=1), false, 'verified', 'DOC A p7 (5 yrs)', null, 11),
 ('Rajneesh Kumar', 'Project Manager – CGD & LMC', 'delivery', (select id from public.practices where number=1), false, 'verified', 'DOC A p7 (7 yrs)', null, 12),
 ('Pawan Singh', 'Site Engineer', 'site_design', null, false, 'verified', 'DOC A p9 / DOC B p5', null, 13),
 ('Santosh Kumar', 'Site Engineer', 'site_design', null, false, 'verified', 'DOC A p9 / DOC B p5', null, 14),
 ('Gopal Agnihoty', 'Site Engineer', 'site_design', null, false, 'verified', 'DOC A p9 / DOC B p5', null, 15),
 ('Hari Dutt', 'Site Engineer', 'site_design', null, false, 'verified', 'DOC A p9 / DOC B p5', null, 16),
 ('Bechen Kumar', 'Site Engineer', 'site_design', null, false, 'verified', 'DOC A p9 / DOC B p5', null, 17),
 ('Deepak Sharma', 'Site Engineer', 'site_design', null, false, 'verified', 'DOC A p9 / DOC B p5', null, 18),
 ('Ankit Pouchori', 'Site Engineer', 'site_design', null, false, 'verified', 'DOC A p9 / DOC B p5', null, 19),
 ('Mirnal Kumar', 'Site Engineer', 'site_design', null, false, 'verified', 'DOC A p9 / DOC B p5', null, 20),
 ('Balbeer Kumar', 'Site Engineer', 'site_design', null, false, 'verified', 'DOC A p9 / DOC B p5', null, 21),
 ('Piyush Chaudhary', 'Design Engineer', 'site_design', null, false, 'verified', 'DOC A p9 / DOC B p5', null, 22)
on conflict do nothing;

-- --- equipment (Practice 01 — DOC A p11 / DOC C p5; quantities ambiguous per Phase 1 §2.4 note: count-free) ---
insert into public.equipment (practice_id, item, spec, quantity, is_active, verification_status, source_ref, verification_note, sort_order)
select (select id from public.practices where number=1), v.item, v.spec, null, false, 'needs_client_review',
  'DOC A p11 / DOC C p5',
  'Phase 1 §2.4: quantity-to-item pairing ambiguous after extraction; publish count-free per Phase 4 §6.2 until verified.',
  v.ord
from (values
  ('Drillto HDD Machine', '32-tonne pullback', 1),
  ('Drillto HDD Machine', '28-tonne pullback', 2),
  ('Drillto HDD Machine', '20-tonne pullback', 3),
  ('Electric Welding Set', null, 4),
  ('Threading Machine', null, 5),
  ('Drilling Machine', null, 6),
  ('Gas Cutter', null, 7),
  ('Tractors with Tankers', null, 8),
  ('Mud Mixing Machine', null, 9),
  ('Winch Machine', 'up to 250 m', 10),
  ('Butt Fusion Machine', null, 11),
  ('HDPE Pipe Jointing Machine', null, 12),
  ('Generator', null, 13),
  ('JCB', null, 14),
  ('Air Pressure Compressor', null, 15),
  ('Measuring Instruments', 'Vernier calipers, screw gauge, spirit level, tapes', 16)
) as v(item, spec, ord)
on conflict do nothing;

-- --- equipment (Practice 02 — DOC A p16 / DOC B p7; clean table WITH quantities) ---
insert into public.equipment (practice_id, item, spec, quantity, is_active, verification_status, source_ref, sort_order)
select (select id from public.practices where number=2), v.item, v.spec, v.qty, false, 'verified',
  'DOC A p16 / DOC B p7', v.ord
from (values
  ('Welding Machine (rectifier type)', '10', 10, 1),
  ('Hydro Test Pump', '35 kg/cm²', 2, 2),
  ('Hand Grinder', null, 6, 3),
  ('Electric Welding Set', '450 A', 2, 4),
  ('Measuring Instruments', 'Vernier calipers, screw gauge, spirit level, tapes', 8, 5),
  ('Drilling Machine', null, 8, 6),
  ('Gas Cutter', null, 8, 7),
  ('Threading Machine', null, 2, 8),
  ('Winch Machine', '1 T / 150 m', 1, 9)
) as v(item, spec, qty, ord)
on conflict do nothing;

-- --- clients: long-term associations from text (DOC C p3) + PMC/architects (DOC B p2) ---
-- text-stated = verified; logo-wall-only brands entered needs_client_review (gate #12 + P1 §5.6)
insert into public.clients (name, slug, relationship, logo_permission, is_active, verification_status, source_ref, sort_order) values
 ('L&T', 'larsen-toubro', 'client', 'pending', false, 'verified', 'DOC C p3 (long-term association) / DOC C p8 (project client)', 1),
 ('BGRL', 'bgrl', 'client', 'pending', false, 'verified', 'DOC C p3 / DOC C p8 (Aurangabad, Sangli)', 2),
 ('IGL', 'igl', 'client', 'pending', false, 'verified', 'DOC C p3 (long-term association)', 3),
 ('BPCL', 'bpcl', 'client', 'pending', false, 'verified', 'DOC C p3 (long-term association)', 4),
 ('JSP Projects Pvt. Ltd.', 'jsp-projects', 'client', 'pending', false, 'verified', 'DOC C p3 / DOC C p8 (Dhanbad)', 5),
 ('Vichitra Constructions Pvt. Ltd.', 'vichitra-constructions', 'epc_counterparty', 'pending', false, 'verified', 'DOC C p3 / DOC C p8 (BGRL contractor)', 6),
 ('TATA Projects', 'tata-projects', 'client', 'pending', false, 'verified', 'DOC C p3 / DOC C p8 (Gurugram)', 7),
 ('Bhutani Infra', 'bhutani-infra', 'client', 'pending', false, 'verified', 'DOC C p3 / DOC C p8 (33 kV work)', 8),
 ('Creative LLP', 'creative-llp', 'client', 'pending', false, 'verified', 'DOC C p3 (long-term association)', 9),
 ('Capgemini', 'capgemini', 'client', 'pending', false, 'verified', 'DOC C p8 (Capgemini NSEZ Noida, direct client)', 10),
 ('Parmesh Construction Company Ltd.', 'parmesh-construction', 'epc_counterparty', 'pending', false, 'verified', 'DOC C p8 (Bhutani Infra 33 kV work)', 11),
 -- PMC & architect associations (DOC B p2 — "associated", conservative wording per gate #14)
 ('JLL', 'jll', 'pmc', 'n_a', false, 'verified', 'DOC B p2 (Associated Architects & PMC)', 20),
 ('CBRE', 'cbre', 'pmc', 'n_a', false, 'verified', 'DOC B p2', 21),
 ('Knight Frank', 'knight-frank', 'pmc', 'n_a', false, 'needs_client_review', 'DOC B p2 — spelled "Knight Frenk" (C20); corrected spelling used, verify association', 22),
 ('AVA', 'ava', 'architect', 'n_a', false, 'verified', 'DOC B p2', 23),
 ('Vince View', 'vince-view', 'architect', 'n_a', false, 'verified', 'DOC B p2', 24),
 ('ISA Projects', 'isa-projects', 'architect', 'n_a', false, 'verified', 'DOC B p2', 25),
 ('Design Tree', 'design-tree', 'architect', 'n_a', false, 'verified', 'DOC B p2', 26),
 ('Hexagramme', 'hexagramme', 'architect', 'n_a', false, 'verified', 'DOC B p2', 27),
 ('UDC Interiors', 'udc-interiors', 'architect', 'n_a', false, 'verified', 'DOC B p2', 28),
 ('Credence Gate', 'credence-gate', 'architect', 'n_a', false, 'verified', 'DOC B p2', 29),
 ('Habitat Systems', 'habitat-systems', 'architect', 'n_a', false, 'verified', 'DOC B p2', 30),
 ('Aeiforia Architects', 'aeiforia-architects', 'architect', 'n_a', false, 'verified', 'DOC B p2', 31),
 ('Designe & Organise', 'designe-organise', 'architect', 'n_a', false, 'verified', 'DOC B p2', 32),
 ('Synergy-ce Corporate', 'synergy-ce', 'architect', 'n_a', false, 'verified', 'DOC B p2', 33)
on conflict (slug) do nothing;

-- logo-wall-only brands (no project/text evidence — Phase 1 §5.6) — needs_client_review
do $$
declare
  i int := 40;
  r record;
begin
  for r in
    select v.name, v.slug from (values
      ('UltraTech', 'ultratech'),
      ('Pearson', 'pearson'),
      ('ICICI Lombard', 'icici-lombard'),
      ('TATA AIG', 'tata-aig'),
      ('IMGC', 'imgc'),
      ('Regus', 'regus'),
      ('AON', 'aon'),
      ('APL Apollo', 'apl-apollo'),
      ('Lakhani', 'lakhani'),
      ('One India', 'one-india'),
      ('Qatar Airways', 'qatar-airways'),
      ('JCPenney', 'jcpenney'),
      ('Aditya Birla Group', 'aditya-birla'),
      ('Arkadin', 'arkadin'),
      ('AG&P', 'agp'),
      ('Purba Bharati Gas', 'purba-bharati-gas'),
      ('Bharat Petroleum', 'bharat-petroleum'),
      ('2ACE', '2ace'),
      ('Eldeco', 'eldeco'),
      ('Paras', 'paras'),
      ('TATA Value Homes', 'tata-value-homes'),
      ('Buildtech', 'buildtech'),
      ('THINK GAS', 'think-gas'),
      ('Infosys', 'infosys'),
      ('Cadence', 'cadence'),
      ('TATA Consultancy Services', 'tcs'),
      ('World Trade Park', 'wtp'),
      ('World Trade Tower', 'wtt'),
      ('United Transformers', 'united-transformers'),
      ('CommScope', 'commscope'),
      ('AVNET', 'avnet'),
      ('Nippon Steel & Sumitomo Metal', 'nippon-steel'),
      ('GOLDER', 'golder'),
      ('DEN', 'den'),
      ('Essar', 'essar'),
      ('Kotak Securities', 'kotak-securities'),
      ('My Desk', 'my-desk'),
      ('Invenio', 'invenio'),
      ('SS Foods', 'ss-foods'),
      ('GEBTECH', 'gebtech'),
      ('Noida Towers Pvt. Ltd.', 'noida-towers'),
      ('Rentech', 'rentech'),
      ('Paperpedia', 'paperpedia'),
      ('Prakash Gen-Tech', 'prakash-gen-tech'),
      ('Vardaan', 'vardaan'),
      ('TATA Advanced Systems', 'tata-advanced-systems'),
      ('Apollo Pipes Limited', 'apollo-pipes')
    ) as v(name, slug)
  loop
    i := i + 1;
    insert into public.clients (name, slug, relationship, logo_permission, is_active,
                                verification_status, source_ref, verification_note, sort_order)
    values (r.name, r.slug, 'client', 'pending', false, 'needs_client_review',
            'DOC A p6/p18 logo walls',
            'Logo-wall-only brand: no project table or text association documented (Phase 1 §5.6). Confirm relationship + logo permission (gate #12) before any publication.',
            i)
    on conflict (slug) do nothing;
  end loop;
end $$;
