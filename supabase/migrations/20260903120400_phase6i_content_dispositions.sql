-- PHASE 6I-2 — Legacy content dispositions + cleanup (Phase 5 §18)
-- Everything here ARCHIVES or DEACTIVATES; nothing factual is deleted.

-- 1. Old projects in content_items (13 rows, superseded by the corpus) — deactivate with migration note
update public.content_items
set is_active = false,
    meta = coalesce(meta, '{}'::jsonb) || '{"migrated_to":"public.projects (Phase 6I corpus)"}'::jsonb,
    verification_note = 'Superseded by the structured projects table (Phase 6I). Retained for traceability.'
where collection = 'projects';

-- 2. Old services/industries/clients/partners/certifications/team collections — deactivated (migrated to entity tables in 6B)
update public.content_items
set is_active = false,
    meta = coalesce(meta, '{}'::jsonb) || '{"migrated_to":"entity tables (Phase 6B)"}'::jsonb
where collection in ('services','industries','clients','partners','certifications','team','subsidiaries');

-- 3. Clean Rooms service: restored as verified entity in 6B; old Solar card already archived (gate #4, 6A-1).
--    Nothing further needed here.

-- 4. Sections cleanup (Phase 5 §18.1):
--    a. hero: rewrite copy (gate #8: no "dream" wording; final copy = client gate #10 for band wording)
update public.sections set
  eyebrow = 'Capex Construction & Engineering Pvt. Ltd. · Est. 2012 · Noida',
  title = 'Turnkey engineering, delivered end to end.',
  subtitle = 'Underground utilities, electrical & CGD. MEP, HVAC & fire protection. One accountable partner — supply, installation, testing & commissioning.',
  body = null,
  cta_label = 'Start a Project',
  cta_url = '/contact',
  cta2_label = 'Explore Projects',
  cta2_url = '/projects',
  extra = '{"metadata_line":"150 KM smart-city cable · 4,000 TR HVAC · 165 KM gas networks"}'::jsonb
where key = 'hero';

--    b. contact section: strip the duplicated services list (canonical source = services table)
update public.sections
set extra = extra - 'services'
where key = 'contact';

--    c. about section: strip migrated extras (capabilities→services, sectors→sectors, associations→clients)
update public.sections
set extra = extra - 'capabilities' - 'sectors' - 'association_groups' - 'vision_cards'
where key = 'about';

--    d. footer note: scope-correct tagline (P2 §12: old note ignored UG/CGD practice)
update public.site_settings set value = 'Turnkey engineering — UG utilities, electrical & CGD · MEP, HVAC & fire protection.'
where key = 'footer_note';

--    e. projects section: re-activate (data now real; nav item too)
update public.sections set is_active = true where key = 'projects';
update public.nav_items set is_active = true where lower(label) = 'projects' or url = '#projects';

--    f. old anchor nav items: repoint to real routes
update public.nav_items set url = '/about'    where url = '#about'    and location = 'header';
update public.nav_items set url = '/services' where url = '#services' and location = 'header';
update public.nav_items set url = '/projects' where url = '#projects' and location = 'header';
update public.nav_items set url = '/sectors'  where url = '#industries' and location = 'header';
update public.nav_items set url = '/contact'  where url = '#contact'  and location = 'header';

-- 5. Stats: replace unsourced rows with documented ones (values per P4 §5.9; wording gate #6 noted)
update public.content_items set title = '54', subtitle = 'HVAC installation records',
  excerpt = 'Documented in company profile records.',
  verification_note = 'Gate #6: figure from DOC B pp.8-9 count; wording pending client approval.'
where collection = 'stats' and (title ilike '%150%' or title ilike '%project%');

update public.content_items set title = '22', subtitle = 'Fire protection systems',
  excerpt = 'Documented in company profile records.',
  verification_note = 'Gate #6: figure from DOC A p17.'
where collection = 'stats' and title ilike '%315%';

update public.content_items set title = '24/7', subtitle = 'Service response — SLA-backed',
  verification_note = 'Gate #6: service claim; P3 §10.2 optional. Kept unverified pending approval.'
where collection = 'stats' and title ilike '%10+%' and is_active = false;

-- 6. Add documented stat rows the design needs (inactive until verified — stat policy gate #6)
insert into public.content_items (collection, title, subtitle, excerpt, sort_order, is_active, verification_status, source_ref)
values
  ('stats','5,000','House & industry connections','Sangli LMC program scope.','4',false,'verified','DOC C p8'),
  ('stats','25','States & UTs — project reach','Project reach across India and Nepal.','5',false,'verified','DOC A p19 map')
on conflict do nothing;

-- 7. FAQ entries touching gated facts — flag for review (gates #2/#3)
update public.content_items
set verification_status = 'needs_client_review',
    verification_note = 'Mentions offices/phones/branch facts — verify against gates #2/#3/#16.'
where collection = 'faqs' and (body ilike '%branch%' or body ilike '%phone%' or body ilike '%Patna%' or body ilike '%address%');
update public.content_items
set verification_status = 'needs_client_review',
    verification_note = 'References ISO certification — gate #13.'
where collection = 'faqs' and body ilike '%ISO%';

-- 8. Careers placeholder page — keep unpublished (6A-1 archived it); careers collection stays empty by design.

-- 9. Final safety: no invented content shipped. All publication toggles remain
--    off for unverified rows; the RLS policies guarantee the public site only
--    ever sees verified+active rows regardless of these updates.
