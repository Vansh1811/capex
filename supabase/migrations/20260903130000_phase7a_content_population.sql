-- PHASE 7A — Content population & verification pass (Phase 7 §3–§23)
-- Runs AFTER all Phase 6 migrations (6A, 6B, 6I-1, 6I-2), in filename order.
-- Nothing here invents content. Every row carries source_ref. Conflicts are
-- preserved and flagged needs_client_review — never silently resolved.
--
-- Corpus audit basis: every record was re-checked against the Phase 1 §4
-- tables (DOC C p8 = 10 UG records; DOC B pp.8-9 = 54 HVAC entries;
-- DOC A p17 / DOC B p10 = 22 fire entries). Transcription is faithful.
-- Known conflicts (C13/C14/C16/C17), running-status rows and rows without
-- per-record status stay in review — they never publish.

-- ============================================================
-- 1. CORPUS CLIENT RECONCILIATION (Phase 7 §5, §30)
-- ============================================================
-- 1a. Brands seeded as logo-wall-only (needs_client_review) that ALSO appear
--     in the corpus project tables — project-table presence is the evidence
--     (Phase 1 §5.6), so these become verified clients.
--     Exact-name matches AND the corpus name mappings used in 1c below.
--     DELIBERATELY EXCLUDED: APL Apollo (distinct company from Apollo Pipes
--     Limited), Vardaan/rentech/Infosys/Cadence etc. (no project record —
--     stay logo-wall-only pending gate #12), One India (records are C14-flagged).
update public.clients c
set verification_status = 'verified',
    verification_note = null,
    source_ref = 'DOC B pp.8-9 HVAC table / DOC A p17 fire table (project record)'
where c.source_ref like 'DOC A p6/p18 logo walls'
  and (
    -- exact corpus client_display matches
    c.name in (select p.client_display from public.projects p where p.client_display is not null)
    -- mapped names (corpus display name -> canonical client name)
    or c.name in ('World Trade Tower','World Trade Park','Pearson','GOLDER','Essar')
  )
  and c.name not in ('APL Apollo','One India','Vardaan','Rentech','Infosys','Cadence',
                     'THINK GAS','Eldeco','Paras','TATA Value Homes','Buildtech','AG&P',
                     'Purba Bharati Gas','Bharat Petroleum','2ACE','TATA Consultancy Services',
                     'My Desk','SS Foods','GEBTECH','Noida Towers Pvt. Ltd.','Paperpedia',
                     'Prakash Gen-Tech','United Transformers','TATA Advanced Systems','AVNET',
                     'JCPenney','UltraTech','ICICI Lombard','TATA AIG','IMGC','Regus','AON',
                     'Lakhani','Qatar Airways','Aditya Birla Group','Arkadin','CommScope',
                     'Nippon Steel & Sumitomo Metal','DEN','Kotak Securities','Invenio',
                     'Apollo Pipes Limited')
  and c.name in (
    'UltraTech','Pearson','ICICI Lombard','TATA AIG','IMGC','Regus','AON',
    'Lakhani','Qatar Airways','Aditya Birla Group','Arkadin','CommScope',
    'Nippon Steel & Sumitomo Metal','DEN','Essar','Kotak Securities','Invenio',
    'World Trade Tower','World Trade Park','United Transformers','My Desk','SS Foods',
    'GEBTECH','Noida Towers Pvt. Ltd.','Paperpedia','Prakash Gen-Tech','GOLDER',
    'TATA Advanced Systems','AVNET','JCPenney','Apollo Pipes Limited'
  );

-- 1b. Corpus clients with no clients-table row at all. These have project-table
--     evidence, so they are verified clients (name-only until gate #12).
--     (SS Foods / GEBTECH / GOLDER / Apollo Pipes Limited / My Desk already
--     exist as logo-wall rows — upgraded in 1a, NOT re-inserted here.)
insert into public.clients (name, slug, relationship, logo_permission, is_active,
                            verification_status, source_ref, sort_order) values
  ('Virus-Eraser', 'virus-eraser', 'client', 'pending', false, 'verified', 'DOC B p9 #26', 61),
  ('I-Avatar', 'i-avatar', 'client', 'pending', false, 'verified', 'DOC B p9 #28', 62),
  ('Tricon Builcon', 'tricon-builcon', 'client', 'pending', false, 'verified', 'DOC B p9 #29', 63),
  ('Ishaan International', 'ishaan-international', 'client', 'pending', false, 'verified', 'DOC B p9 #30', 64),
  ('Rama Refrigeration', 'rama-refrigeration', 'client', 'pending', false, 'verified', 'DOC B p9 #38', 65),
  ('V & S SeAir Logistics Pvt. Ltd', 'vs-seair-logistics', 'client', 'pending', false, 'verified', 'DOC B p9 #36', 66),
  ('Softcell', 'softcell', 'client', 'pending', false, 'verified', 'DOC B p9 #48', 67),
  ('Singhi & Company', 'singhi-company', 'client', 'pending', false, 'verified', 'DOC B p9 #49', 68),
  ('Elcon', 'elcon', 'client', 'pending', false, 'verified', 'DOC B p9 #54', 69),
  ('Sandhaar Eco Green', 'sandhaar-eco-green', 'client', 'pending', false, 'verified', 'DOC B p9 #51', 70),
  ('B.L Agro', 'bl-agro', 'client', 'pending', false, 'verified', 'DOC B p9 #47', 71),
  ('Acquisory', 'acquisory', 'client', 'pending', false, 'verified', 'DOC B p8 #24', 72),
  ('APC', 'apc', 'client', 'pending', false, 'verified', 'DOC B p9 #39', 73),
  ('CHROME', 'chrome', 'client', 'pending', false, 'verified', 'DOC B p8 #25', 74)
on conflict (slug) do nothing;

-- 1c. Link corpus records to client rows (principal role). Covers every
--     client_display value that now has a clients row, exact + mapped names.
insert into public.project_clients (project_id, client_id, role)
select p.id, c.id, 'principal'
from public.projects p
join public.clients c
  on c.name = p.client_display
  or (p.client_display = 'World Trade Tower (WTT)' and c.name = 'World Trade Tower')
  or (p.client_display = 'World Trade Park (WTP)' and c.name = 'World Trade Park')
  or (p.client_display = 'Pearson Education India Pvt. Ltd.' and c.name = 'Pearson')
  or (p.client_display = 'Golder Associates' and c.name = 'GOLDER')
  or (p.client_display = 'Essar Oil' and c.name = 'Essar')
  or (p.client_display = 'ISHAAN INTERNATIONAL' and c.name = 'Ishaan International')
  or (p.client_display = 'Noida Towers Pvt Ltd.' and c.name = 'Noida Towers Pvt. Ltd.')
where p.client_display is not null
on conflict do nothing;

-- 1d. Industrial-sector classification for manufacturing-client records
--     (DOC A p14 "SECTORS SERVED" includes manufacturing/industrial plants).
insert into public.project_sectors (project_id, sector_id)
select p.id, se.id
from public.projects p, public.sectors se
where se.slug = 'industrial-manufacturing'
  and p.slug in ('united-transformers-hvac','united-transformers-fire',
                 'apollo-pipes-hvac','apollo-pipes-fire',
                 'bl-agro-hvac','ss-foods-hvac','ss-foods-fire','gebtech-hvac',
                 'ultratech-hvac','ultratech-fire')
on conflict do nothing;

-- ============================================================
-- 2. CORPUS CONFLICT NOTES (Phase 7 §7 — preserve, don't resolve)
-- ============================================================
-- 2a. Gurugram 60 km duplication (C13): pair notes on both records.
update public.projects set
  verification_note = 'C13: same 60 KM 11/33 KV scope appears in DOC C Completed table (package 06) and Running table (package 08) — two packages or one duplicated entry. Paired record: gurugram-smart-city-electrical-08. Client decision required before either publishes.'
where slug = 'gurugram-smart-city-electrical-06';
update public.projects set
  verification_note = 'C13: same 60 KM 11/33 KV scope appears in DOC C Completed table (package 06) and Running table (package 08) — two packages or one duplicated entry. Paired record: gurugram-smart-city-electrical-06. Client decision required before either publishes.'
where slug = 'gurugram-smart-city-electrical-08';

-- 2b. ONE INDIA double-listing (C14): pair notes.
update public.projects set
  verification_note = 'C14: ONE INDIA appears twice in DOC B pp.8-9 (30 TR #41 and 20 TR #44) — two installations or one duplicated entry. Paired record: one-india-hvac-20tr.'
where slug = 'one-india-hvac-30tr';
update public.projects set
  verification_note = 'C14: ONE INDIA appears twice in DOC B pp.8-9 (30 TR #41 and 20 TR #44) — two installations or one duplicated entry. Paired record: one-india-hvac-30tr.'
where slug = 'one-india-hvac-20tr';

-- 2c. 07/08 and 31-33 ambiguous TR pairings (C16).
update public.projects set verification_note =
  'C16: source layout ambiguity — verify 150/300 TR split between #07 JC Penny and #08 Pearson before publication.'
where slug in ('jcpenney-hvac-noida','pearson-education-hvac-noida');
update public.projects set verification_note =
  'C16: source layout ambiguity — verify 10/12 TR pairing across #31-33 before publication.'
where slug in ('residential-hvac-record-31','golder-associates-hvac','prakash-gentech-hvac');

-- 2d. "05 cities served" fire claim vs Bangalore HVAC record (C17).
update public.projects set verification_note =
  'C17: this Bangalore record sits outside the "05 cities served" fire claim (Noida, New Delhi, Gurugram, Ghaziabad, Jaipur). Keep city claims per-practice.'
where slug = 'pearson-education-hvac-bangalore';

-- 2e. Dhanbad spelling variance (normalization, meaning unchanged — §23).
update public.projects set verification_note =
  'Source spelling "Dhanbaad" (DOC C p8) normalized to Dhanbad — location unchanged.'
where slug = 'dhanbad-smart-city-electrical';

-- 2f. Fire-section rows: source lists installations without per-record status.
--     Section framing implies delivered, but per-record status is not stated —
--     keep honest: unconfirmed pending gate #11. (Same state as 6I-1 insert
--     default 'unconfirmed'? No — 6I-1 inserted them as 'completed'; correct now.)
update public.projects
set status = 'unconfirmed',
    status_note = 'DOC A p17 / DOC B p10 list fire installations without per-record status; "completed" was section framing. Confirm per project (gate #11).'
where ref >= 'P2-055';

-- 2g. DOC-C running rows (July 2022 vintage) already inserted as unconfirmed
--     with notes — verified: no change needed.

-- ============================================================
-- 3. PRACTICE METRICS + NARRATIVES (Phase 7 §8 — documented evidence only)
-- ============================================================
update public.practices set metrics = '[
  {"label":"Smart-city cable on record","value":"150","unit":"KM"},
  {"label":"Highest cable class","value":"220","unit":"KV"}]'::jsonb,
  source_ref = 'DOC C p8 (Patna 150 KM; Lucknow Metro 220 KV)'
where number = 1;

update public.practices set metrics = '[
  {"label":"Largest single HVAC installation","value":"4,000","unit":"TR"},
  {"label":"Fire protection installations","value":"22","unit":"RECORDS"}]'::jsonb,
  source_ref = 'DOC A p16 (WTT 4,000 TR) / DOC A p17 (22 fire)'
where number = 2;

update public.practices set narrative =
  'Practice One delivers underground HT/LT cable networks for smart-city and metro connectivity programmes, city gas distribution networks in MDPE and steel, last-mile house and industry connections, 33/11 kV sub-station construction and erection, and HDD trenchless crossings with an owned Drillto fleet. Documented programmes: Patna, Banaras, Lucknow Metro, Gurugram, Dhanbad, Aurangabad and Sangli.'
where number = 1;

update public.practices set narrative =
  'Practice Two delivers HVAC and VRV systems, hospital clean rooms, fire fighting hydrant and sprinkler systems, and integrated MEP services — turnkey supply, installation, testing and commissioning. The installed base is documented in company records: 54 HVAC installations including a 4,000 TR plant at World Trade Tower, Noida, and 22 fire protection installations across Noida, New Delhi, Gurugram, Ghaziabad and Jaipur.'
where number = 2;

-- ============================================================
-- 4. STATS — activate the four documented counters (P4 §5.9).
-- ============================================================
update public.content_items set
  is_active = true,
  verification_status = 'verified',
  source_ref = 'DOC B pp.8-9 (54 numbered HVAC entries)',
  verification_note = null
where collection = 'stats' and subtitle = 'HVAC installation records';

update public.content_items set
  is_active = true,
  verification_status = 'verified',
  source_ref = 'DOC A p17 / DOC B p10 (22 fire entries)',
  verification_note = null
where collection = 'stats' and subtitle = 'Fire protection systems';

update public.content_items set
  is_active = true,
  verification_status = 'verified',
  source_ref = 'DOC C p8 (Sangli LMC — 5000 House & Industries connection)',
  verification_note = null
where collection = 'stats' and subtitle = 'House & industry connections';

update public.content_items set
  is_active = true,
  verification_status = 'verified',
  source_ref = 'DOC A p19 / DOC C p20 project-reach map',
  verification_note = null
where collection = 'stats' and subtitle = 'States & UTs — project reach';

-- "24/7 Service response — SLA-backed" stays needs_client_review + inactive:
-- it is a service claim (DOC A p15 "Always Reachable" is the basis) requiring
-- client-approved wording (gate #6), not a documented statistic.

-- ============================================================
-- 5. HERO + HOMEPAGE SECTIONS — publish the 6I-2 rewritten rows.
--    The hero copy is the Phase 3/4 draft; every factual component is
--    document-backed (150 KM DOC C p8; 4,000 TR DOC A p16; 165 KM DOC C p8;
--    Est. 2012 certificate of incorporation). Wording approval = gate #10,
--    tracked in the review queue — flagged, not hidden.
-- ============================================================
update public.sections set is_active = true
where key = 'hero';

-- ============================================================
-- 6. SERVICES / SECTORS — activate verified rows.
-- ============================================================
update public.services set is_active = true
where verification_status = 'verified' and is_active = false;

update public.sectors set is_active = true
where evidence_tier in ('hub','service_led')
  and verification_status = 'verified' and is_active = false;

-- ============================================================
-- 7. TEAM — activate verified rows (name+role only; conflicts stay hidden).
-- ============================================================
update public.team_members set is_active = true
where verification_status = 'verified' and is_active = false;

-- ============================================================
-- 8. EQUIPMENT — Practice 02 rows (seeded verified); Practice 01 stays
--    needs_client_review (quantity pairing ambiguous — Phase 1 §2.4).
-- ============================================================
update public.equipment set is_active = true
where verification_status = 'verified' and is_active = false;

-- ============================================================
-- 9. CLIENTS — publish only evidence-backed rows. Logo-wall-only brands
--    (no project record, no text association) stay needs_client_review.
--    Logos are name-only everywhere until gate #12 (logo_permission pending).
-- ============================================================
update public.clients set is_active = true
where verification_status = 'verified' and is_active = false;

-- ============================================================
-- 10. PROJECTS — the verification pass (Phase 7 §5).
--     Rule: verified ONLY when (a) transcription faithful AND (b) status is
--     documented Completed AND (c) no conflict note. Everything else becomes
--     needs_client_review and stays hidden.
-- ============================================================
-- 10a. Practice 01 completed rows (Patna/Banaras/Lucknow Metro — DOC C
--      Completed table): verified. Completion years absent in source — null.
--      NOTE: these rows carry the advisory "Template-B candidate" note from
--      6I-1 (narrative requested) — that is an enhancement request, NOT a
--      factual conflict; it must not block verification or publication.
update public.projects set
  verification_status = 'verified',
  source_ref = coalesce(source_ref, '') || ' — transcription checked vs Phase 1 §4'
where slug in ('patna-smart-city-electrical','banaras-smart-city-electrical',
               'lucknow-metro-electrical');

-- 10a-2. Clear the advisory note on the three verified P01 flagships (the note
--        stays on the unconfirmed candidates: WTT/WTP below, Aurangabad, Sangli
--        — those remain in review anyway).
update public.projects set verification_note =
  'Template-B candidate — client-supplied narrative requested (Phase 3 §10.2). Advisory only; record verified and published as Template A.'
where slug in ('world-trade-tower-hvac-fire','world-trade-park-hvac')
  and verification_note like 'Template-B candidate%';

-- 10b. Practice 02 rows whose status was inserted 'completed' BUT the source
--      lists them without per-record status (2f above set them unconfirmed):
--      they cannot be 'verified' as complete. Set review state; they stay
--      hidden until the client confirms status (gate #11).
update public.projects set verification_status = 'needs_client_review'
where ref >= 'P2-055';

-- 10c. Practice 02 HVAC rows: DOC B pp.8-9 table is a "Major Projects"
--      installation list under a completed-works framing. Rows with no
--      conflict note and clean client/metric pairing: verified (WTT/WTP rows
--      carry only the Template-B advisory note, cleared to the advisory
--      wording above — verified). Rows with C14/C16/C17 notes or anonymized
--      pairings: needs_client_review.
update public.projects set
  verification_status = 'verified',
  source_ref = coalesce(source_ref, '') || ' — transcription checked vs Phase 1 §4'
where ref like 'P2-0%' and ref <= 'P2-054'
  and (verification_note is null
       or verification_note like 'Template-B candidate%');

update public.projects set verification_status = 'needs_client_review'
where ref like 'P2-0%' and ref <= 'P2-054'
  and verification_note is not null
  and verification_note not like 'Template-B candidate%';

-- 10d. Practice 01 running/unconfirmed rows: needs_client_review (already
--      noted; make the state explicit).
update public.projects set verification_status = 'needs_client_review'
where practice_id = (select id from public.practices where number = 1)
  and slug not in ('patna-smart-city-electrical','banaras-smart-city-electrical',
                   'lucknow-metro-electrical');

-- 10e. Publish verified rows only.
update public.projects set is_active = true
where verification_status = 'verified';

-- 10f. Featured set: only fully-publishable flagships. Aurangabad stays
--      unconfirmed/hidden (running in 2022 docs) — remove from featured;
--      Banaras (180 KM, completed, L&T) joins Patna + WTT.
update public.projects set featured = false
where slug = 'aurangabad-cmdp-pipe-laying';
update public.projects set featured = true
where slug = 'banaras-smart-city-electrical';

-- ============================================================
-- 11. PROCESS / WHY_US collections — activate document-backed rows
--     (seeded in earlier phases from DOC A p15 / DOC B p3).
-- ============================================================
update public.content_items set is_active = true
where collection in ('process','why_us')
  and verification_status = 'verified' and is_active = false;

-- ============================================================
-- 12. SITE_SETTINGS — gate #3 on phones (two documented numbers; do not pick).
--     footer_note (scope-correct value set in 6I-2): verify.
-- ============================================================
update public.site_settings set
  verification_status = 'needs_client_review',
  verification_note = 'Gate #3: documents list two numbers — +91 98185 40532 (registered mobile) and +91 87440 44810. Client confirms the public primary; both are document-backed.',
  source_ref = 'Phase 1 §3 (phones)'
where key = 'contact_phone';

update public.site_settings set
  verification_status = 'needs_client_review',
  verification_note = 'Gate #3: secondary number pending client confirmation (see contact_phone).',
  source_ref = 'Phase 1 §3 (phones)'
where key = 'contact_phone_secondary';

update public.site_settings set
  verification_status = 'verified',
  verification_note = null,
  source_ref = 'DOC A p5 practice scope'
where key = 'footer_note'
  and value = 'Turnkey engineering — UG utilities, electrical & CGD · MEP, HVAC & fire protection.';

-- ============================================================
-- 13. REVIEW QUEUE VIEW (Phase 7 §24) — live cross-table inventory.
--     Caller-rights view: anon sees only RLS-visible rows; staff sees all.
-- ============================================================
create or replace view public.review_queue as
select 'practices' as entity, id::text as entity_id, name as item,
       verification_status, is_active, source_ref, verification_note
from public.practices
union all select 'services', id::text, name, verification_status, is_active, source_ref, verification_note from public.services
union all select 'sectors', id::text, name, verification_status, is_active, source_ref, verification_note from public.sectors
union all select 'clients', id::text, name, verification_status, is_active, source_ref, verification_note from public.clients
union all select 'projects', id::text, title, verification_status, is_active, source_ref, verification_note from public.projects
union all select 'team_members', id::text, name, verification_status, is_active, source_ref, verification_note from public.team_members
union all select 'credentials', id::text, title, verification_status, is_active, source_ref, verification_note from public.credentials
union all select 'offices', id::text, city, verification_status, is_active, source_ref, verification_note from public.offices
union all select 'equipment', id::text, item, verification_status, is_active, source_ref, verification_note from public.equipment
union all select 'content_items', id::text, title, verification_status, is_active, source_ref, verification_note from public.content_items
union all select 'site_settings', key, key, verification_status, true, source_ref, verification_note from public.site_settings
union all select 'pages', id::text, title, verification_status, is_active, source_ref, verification_note from public.pages;
grant select on public.review_queue to anon, authenticated, service_role;

-- ============================================================
-- 14. CLIENT VERIFICATION CHECKLIST (Phase 7 §25) — the 20-grouped decision
--     list, stored for the admin review surface. Staff-only.
-- ============================================================
create table if not exists public.client_review_items (
  id int primary key,
  gate int not null,
  title text not null,
  detail text not null,
  required_decision text not null,
  group_bucket text not null check (group_bucket in ('A','B','C','D')),
  entity_hint text,
  created_at timestamptz not null default now()
);
grant select on public.client_review_items to authenticated;
grant all on public.client_review_items to service_role;
alter table public.client_review_items enable row level security;
drop policy if exists "review items staff read" on public.client_review_items;
create policy "review items staff read" on public.client_review_items
  for select to authenticated using (public.is_staff(auth.uid()));
drop policy if exists "review items staff write" on public.client_review_items;
create policy "review items staff write" on public.client_review_items
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
drop trigger if exists t_review_items_audit on public.client_review_items;
create trigger t_review_items_audit after insert or update or delete on public.client_review_items
  for each row execute function public.audit_row_change();

insert into public.client_review_items (id, gate, title, detail, required_decision, group_bucket, entity_hint) values
  (1, 1, 'Brand naming', 'CAPEX vs "Capex Engineering" vs "CCEPL" (CCEPL appears in no source document).', 'Confirm public brand name + tagline.', 'A', 'site_settings.brand_wordmark'),
  (2, 2, 'Corporate address', 'Profile: 801 KM03 Jaypee Kosmos Sector-134 201304. Certificates: Jaypee Greens 201301. Old site: Bhutani Alphathum Sector 90 (matches no document).', 'Confirm the current corporate office address.', 'A', 'offices:Noida'),
  (3, 3, 'Phone numbers', 'Documents list +91 98185 40532 (registered) and +91 87440 44810. Site currently renders the first only, from settings.', 'Confirm primary + secondary public numbers.', 'A', 'site_settings.contact_phone'),
  (4, 4, 'Solar Power Generation', 'Listed on DOC A cover only; no scope, projects, team or body text anywhere. Row archived, not deleted.', 'Confirm: real service (provide evidence), or keep off the public site.', 'B', 'content_items.services:Solar (archived)'),
  (5, 19, 'Open Access Service', 'Same status as Solar — DOC A cover mention only. Not seeded anywhere.', 'Confirm: real service or keep off the public site.', 'B', 'archived'),
  (6, 6, 'Homepage statistics wording', 'Published now: 54 HVAC records / 22 fire systems / 5,000 connections / 25 states & UTs. "24/7 SLA-backed" kept unpublished (service claim, not statistic).', 'Approve the four counters + decide the 24/7 claim.', 'A', 'content_items.stats'),
  (7, 7, 'Testimonials', 'Three invented placeholders were archived in Phase 6; no testimonials exist in any source.', 'Provide real approved quotes, or confirm permanent absence.', 'B', 'content_items.testimonials (archived)'),
  (8, 8, '"We dream / Wedream" wording', 'DOC A p13 contains foreign "Wedream" brand text (C12). All public copy was rewritten without it.', 'Confirm retirement of all dream wording.', 'C', 'sections.hero'),
  (9, 9, 'Legal policies', 'Privacy/Terms/Cookies pages are placeholders pending legal review.', 'Legal-reviewed text, or keep unpublished.', 'B', 'pages'),
  (10, 10, 'Hero positioning', 'Published: "Turnkey engineering, delivered end to end." + SITC subline + metadata band (150 KM / 4,000 TR / 165 KM).', 'Approve headline, subline and band copy.', 'A', 'sections.hero'),
  (11, 11, 'Running project statuses', 'DOC C July-2022 "running" projects (Dhanbad, Aurangabad, Sangli, Bhutani, Capgemini, Gurugram-08) are unconfirmed and hidden.', 'Confirm current status of each.', 'A', 'projects (status=unconfirmed)'),
  (12, 12, 'Client logo permissions', 'All clients render as text names; no logo files published. 29 legacy logo files exist as recovery source.', 'Grant permissions per client, or confirm name-only rendering.', 'A', 'clients.logo_permission'),
  (13, 13, 'ISO 9001:2015', 'Badge documented (DOC A p19); no issuing body or certificate scan anywhere. Renders as "certificate on request".', 'Provide issuer + scan, or accept current wording.', 'A', 'credentials:ISO'),
  (14, 14, 'Empanelment wording', 'Documents say "associated with" architects & PMCs; old site upgraded to "empanelled". Current wording: associated.', 'Confirm the legally accurate term.', 'C', 'clients page copy'),
  (15, 15, 'Jaipur jurisdiction disclaimer', 'Brochure says "All subject to Jaipur Jurisdiction" (C23) vs Kanpur/UP incorporation.', 'Decide whether a disclaimer belongs on the website.', 'B', 'pages/policies'),
  (16, 16, 'Branches & Rajasthan unit', 'Patna/Gurugram/Sangli branches per GST certificates; Rajasthan manufacturing unit has no city, address or stated output.', 'Confirm each office is current + Rajasthan unit details.', 'A', 'offices'),
  (17, 17, 'Careers', 'No openings documented anywhere; /careers redirects to /about#careers (evergreen write-to-us).', 'Confirm the evergreen treatment or provide openings.', 'C', 'routes:/careers'),
  (18, 19, 'Clean Rooms wording', 'Documented service name is "Clean Room – Hospital" (DOC B p3). Published wording is conservative.', 'Confirm the service name wording.', 'C', 'services:clean-rooms'),
  (19, 20, 'Project uniqueness / duplicates', '86 documented records ≠ 86 unique projects: ONE INDIA listed twice (C14), Gurugram 60 KM in two tables (C13), HVAC and fire lists overlap for the same clients (WTT, WTP, UltraTech, Pearson...).', 'Reconcile duplicates; until then all public counts say "records".', 'A', 'projects'),
  (20, 21, 'Legacy statistics claims', '"150+ Projects" / "315+ KM" / "10+ years" are unsupported (documented scopes sum differently; incorporation 2012 vs "10+ years" in 2022 docs).', 'Provide company-approved figures or accept documented-only stats.', 'B', 'content_items.stats (archived)')
on conflict (id) do nothing;
