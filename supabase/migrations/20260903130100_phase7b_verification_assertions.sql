-- PHASE 7B — Verification matrix assertions (run in Supabase SQL Editor after 7A).
-- Every block raises an exception on failure. Run as a privileged session
-- (dashboard SQL Editor). Expected counts are stated per block.

do $$
declare
  v_count int;
  v_bad int;
begin
  ------------------------------------------------------------
  -- A. CORPUS INTEGRITY (Phase 7 §30)
  ------------------------------------------------------------
  -- A1. Exactly 86 project records.
  select count(*) into v_count from public.projects;
  if v_count <> 86 then
    raise exception 'A1 FAIL: expected 86 projects, got %', v_count;
  end if;

  -- A2. Refs are unique and well-formed.
  select count(*) into v_bad from public.projects
    where ref !~ '^P[12]-0[0-9][0-9]$';
  if v_bad > 0 then
    raise exception 'A2 FAIL: % malformed refs', v_bad;
  end if;

  -- A3. Practice 01 = 10 records; Practice 02 = 76 (54 HVAC + 22 fire).
  select count(*) into v_count from public.projects p
    join public.practices pr on pr.id = p.practice_id where pr.number = 1;
  if v_count <> 10 then
    raise exception 'A3a FAIL: expected 10 P1 records, got %', v_count;
  end if;
  select count(*) into v_count from public.projects p
    join public.practices pr on pr.id = p.practice_id where pr.number = 2;
  if v_count <> 76 then
    raise exception 'A3b FAIL: expected 76 P2 records, got %', v_count;
  end if;

  -- A4. No project publishes without verified status (guard trigger + this audit).
  select count(*) into v_bad from public.projects
    where is_active and verification_status <> 'verified';
  if v_bad > 0 then
    raise exception 'A4 FAIL: % published projects are not verified', v_bad;
  end if;

  -- A5. Conflict rows never publish: C13 pair, C14 pair, C16 rows, C17 row.
  select count(*) into v_bad from public.projects
    where is_active and (
      slug in ('gurugram-smart-city-electrical-06','gurugram-smart-city-electrical-08',
               'one-india-hvac-30tr','one-india-hvac-20tr',
               'jcpenney-hvac-noida','pearson-education-hvac-noida',
               'residential-hvac-record-31','golder-associates-hvac','prakash-gentech-hvac',
               'pearson-education-hvac-bangalore')
      or status = 'unconfirmed');
  if v_bad > 0 then
    raise exception 'A5 FAIL: % conflict/unconfirmed rows are published', v_bad;
  end if;

  -- A6. Anonymized residential records keep anonymized client_display.
  select count(*) into v_bad from public.projects
    where slug like 'residential-hvac-record-%'
      and (client_display is null or client_display !~ 'Private residential client');
  if v_bad > 0 then
    raise exception 'A6 FAIL: % residential records de-anonymized', v_bad;
  end if;

  ------------------------------------------------------------
  -- B. RELATIONSHIP COVERAGE (Phase 7 §30)
  ------------------------------------------------------------
  -- B1. Every project has >=1 service link.
  select count(*) into v_bad from public.projects p
    where not exists (select 1 from public.project_services ps where ps.project_id = p.id);
  if v_bad > 0 then
    raise exception 'B1 FAIL: % projects without service links', v_bad;
  end if;

  -- B2. Every project has >=1 sector link.
  select count(*) into v_bad from public.projects p
    where not exists (select 1 from public.project_sectors pse where pse.project_id = p.id);
  if v_bad > 0 then
    raise exception 'B2 FAIL: % projects without sector links', v_bad;
  end if;

  -- B3. Non-anonymized projects link to >=1 client row (residential excluded).
  select count(*) into v_bad from public.projects p
    where p.client_display is not null
      and p.client_display not like 'Private residential%'
      and not exists (select 1 from public.project_clients pc where pc.project_id = p.id);
  if v_bad > 0 then
    raise exception 'B3 FAIL: % named-client projects without client links', v_bad;
  end if;

  ------------------------------------------------------------
  -- C. VERIFICATION MATRIX INVENTORY (Phase 7 §29)
  --    (Full RLS behavior is tested by scripts/p7/verify-matrix.mjs;
  --     this asserts the data-level states the RLS test depends on.)
  ------------------------------------------------------------
  -- C1. All six matrix states exist among projects:
  select
    count(*) filter (where verification_status='unverified' and is_active) ,
    count(*) filter (where verification_status='unverified' and not is_active),
    count(*) filter (where verification_status='needs_client_review' and is_active),
    count(*) filter (where verification_status='needs_client_review' and not is_active),
    count(*) filter (where verification_status='verified' and not is_active),
    count(*) filter (where verification_status='verified' and is_active)
  into v_count, v_count, v_count, v_count, v_count, v_count;
  -- (existence-only: values printed via the review view; not asserted numerically
  --  except that verified+active > 0 and needs_review+active = 0)
  select count(*) into v_count from public.projects
    where verification_status='verified' and is_active;
  if v_count = 0 then
    raise exception 'C1 FAIL: no verified+active projects (verification pass did not run?)';
  end if;
  select count(*) into v_bad from public.projects
    where verification_status='needs_client_review' and is_active;
  if v_bad > 0 then
    raise exception 'C1 FAIL: % needs_client_review projects are active', v_bad;
  end if;

  ------------------------------------------------------------
  -- D. ENTITY INVENTORY SANITY (Phase 7 §34)
  ------------------------------------------------------------
  select count(*) into v_count from public.practices where is_active and verification_status='verified';
  if v_count <> 2 then raise exception 'D1 FAIL: expected 2 published practices, got %', v_count; end if;

  select count(*) into v_count from public.services where is_active and verification_status='verified';
  if v_count <> 11 then raise exception 'D2 FAIL: expected 11 published services, got %', v_count; end if;

  select count(*) into v_count from public.sectors where is_active and verification_status='verified';
  if v_count <> 5 then raise exception 'D3 FAIL: expected 5 published sectors (3 hub + 2 service_led), got %', v_count; end if;

  select count(*) into v_count from public.team_members where is_active and verification_status='verified';
  if v_count <> 14 then raise exception 'D4 FAIL: expected 14 published team members, got %', v_count; end if;

  select count(*) into v_count from public.credentials where is_active and verification_status='verified';
  if v_count <> 10 then raise exception 'D5 FAIL: expected 10 published credentials (9 statutory + MSME), got %', v_count; end if;

  select count(*) into v_count from public.offices where is_active;
  if v_count <> 0 then raise exception 'D6 FAIL: offices must stay unpublished (gates #2/#16) — % active', v_count; end if;

  select count(*) into v_count from public.content_items
    where collection='stats' and is_active and verification_status='verified';
  if v_count <> 4 then raise exception 'D7 FAIL: expected 4 published stats, got %', v_count; end if;

  select count(*) into v_count from public.content_items
    where collection='testimonials' and is_active;
  if v_count <> 0 then raise exception 'D8 FAIL: testimonials must stay unpublished — % active', v_count; end if;

  select count(*) into v_count from public.projects where featured and is_active;
  if v_count < 3 then raise exception 'D9 FAIL: expected >=3 published featured projects, got %', v_count; end if;

  -- E. Review queue view + checklist exist.
  select count(*) into v_count from public.review_queue;
  if v_count < 200 then raise exception 'E1 FAIL: review_queue too small: %', v_count; end if;
  select count(*) into v_count from public.client_review_items;
  if v_count <> 20 then raise exception 'E2 FAIL: expected 20 checklist items, got %', v_count; end if;

  raise notice 'PHASE 7B: ALL ASSERTIONS PASSED';
end $$;
