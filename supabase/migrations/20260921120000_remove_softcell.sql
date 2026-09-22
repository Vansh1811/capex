-- Remove Softcell (client request, 2026-09-21).
-- The DOC B p9 #48 "Softcell" rows are not a Capex client project and must not
-- appear on any public surface (projects register, clients registry, search).
-- Pattern follows the Phase 7 conflict policy: hide via needs_client_review +
-- is_active = false (hidden rows stay in review, never silently deleted).

-- 1. Drop the principal client link for the Softcell project record.
delete from public.project_clients
where project_id in (select id from public.projects where slug = 'softcell-hvac');

-- 2. Drop service/sector junctions for the Softcell project record so no
--    published join can surface it.
delete from public.project_services
where project_id in (select id from public.projects where slug = 'softcell-hvac');

delete from public.project_sectors
where project_id in (select id from public.projects where slug = 'softcell-hvac');

-- 3. Hide the Softcell project record.
update public.projects
set is_active = false,
    verification_status = 'needs_client_review',
    verification_note = 'Removed per client request 2026-09-21 — not a Capex client project. Hidden from all public surfaces.'
where slug = 'softcell-hvac';

-- 4. Hide the Softcell client record.
update public.clients
set is_active = false,
    verification_status = 'needs_client_review',
    verification_note = 'Removed per client request 2026-09-21 — not a Capex client. Hidden from all public surfaces.'
where slug = 'softcell';
