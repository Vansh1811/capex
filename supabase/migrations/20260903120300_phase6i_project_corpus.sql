-- PHASE 6I-1 — Project corpus seed (86 records)
-- Source: Phase 1 §4 tables, transcribed line-by-line from DOC B pp.8-9 (54 HVAC),
-- DOC A p17 / DOC B p10 (22 fire), DOC C p8 (10 UG). No invented values.
-- All rows insert as unverified+inactive; publication happens via the admin
-- verification workflow after the transcription check (Phase 5 §18.3).
-- Conflict rules applied (Phase 5 §19): statuses unconfirmed where flagged;
-- ONE INDIA double-listing preserved with C14 note; Gurugram 60km preserved
-- as two records with C13 note; residential clients anonymized.

-- Helper: refs computed as P{n}-{seq} at insert time via ordering.

-- ============ PRACTICE 01 — UG / ELECTRICAL / CGD (10 records, DOC C p8) ============
insert into public.projects
 (ref, title, slug, practice_id, location_city, location_state, status, status_note, scope_line, metrics, sort_order, source_ref)
select 'P1-' || lpad((row_number() over ())::text, 3, '0'), v.title, v.slug,
       (select id from public.practices where number = 1),
       v.city, v.state, v.status, v.status_note, v.scope,
       v.metrics::jsonb, v.ord, v.src
from (values
  ('Patna Smart City Electrical Work','patna-smart-city-electrical','Patna','Bihar','completed',null,
   '150 KM 11&33 KV cable laying',
   '[{"label":"Cable laid","value":"150","unit":"KM"},{"label":"Voltage class","value":"11/33","unit":"KV"}]'::text,
   1,'DOC C p8 §4.1 #1 — client L&T'),
  ('Banaras Smart City Electrical Work','banaras-smart-city-electrical','Banaras','Uttar Pradesh','completed',null,
   '180 KM 11/33 KV cable laying',
   '[{"label":"Cable laid","value":"180","unit":"KM"},{"label":"Voltage class","value":"11/33","unit":"KV"}]'::text,
   2,'DOC C p8 §4.1 #2 — client L&T'),
  ('Lucknow Metro Connectivity Electrical Work','lucknow-metro-electrical','Lucknow','Uttar Pradesh','completed',null,
   '20 KM 220 KV cable laying',
   '[{"label":"Cable laid","value":"20","unit":"KM"},{"label":"Voltage class","value":"220","unit":"KV"}]'::text,
   3,'DOC C p8 §4.1 #3 — client L&T'),
  ('Gurugram Smart City Electrical Work','gurugram-smart-city-electrical-06','Gurugram','Haryana','unconfirmed',
   'C13: 60 KM scope appears in both Completed ("06") and Running ("08") tables — package numbers unexplained. Status stays unconfirmed until the client clarifies.',
   '60 KM 11/33 KV cable laying',
   '[{"label":"Cable laid","value":"60","unit":"KM"},{"label":"Voltage class","value":"11/33","unit":"KV"}]'::text,
   4,'DOC C p8 §4.1 #4 — client TATA PROJECTS (06)'),
  ('Gurugram Smart City Electrical Work — Package 08','gurugram-smart-city-electrical-08','Gurugram','Haryana','unconfirmed',
   'C13: same 60 KM scope listed under Running with package number (08). Kept as a separate record pending client clarification of packages.',
   '60 KM 11/33 KV cable laying',
   '[{"label":"Cable laid","value":"60","unit":"KM"},{"label":"Voltage class","value":"11/33","unit":"KV"}]'::text,
   5,'DOC C p8 §4.2 #1 — client TATA PROJECTS (08)'),
  ('Dhanbad Smart City Electrical Work','dhanbad-smart-city-electrical','Dhanbad','Jharkhand','unconfirmed',
   'DOC C lists as running (July 2022 documents); current status needs client confirmation (gate #11).',
   '50 KM 11&33 KV cable laying',
   '[{"label":"Cable laid","value":"50","unit":"KM"},{"label":"Voltage class","value":"11/33","unit":"KV"}]'::text,
   6,'DOC C p8 §4.2 #2 — client JSP Projects Pvt Ltd'),
  ('Aurangabad City MDP Pipe Laying','aurangabad-cmdp-pipe-laying','Aurangabad','Maharashtra','unconfirmed',
   'DOC C lists as running; current status needs client confirmation (gate #11).',
   '165 KM gas line',
   '[{"label":"Gas line laid","value":"165","unit":"KM"}]'::text,
   7,'DOC C p8 §4.2 #3 — client BGRL (Vichitra Construction Pvt Ltd)'),
  ('Sangli LMC Work','sangli-lmc-work','Sangli','Maharashtra','unconfirmed',
   'DOC C lists as running; current status needs client confirmation (gate #11).',
   '5000 house & industry connections',
   '[{"label":"Connections","value":"5,000","unit":""},{"label":"Program","value":"LMC","unit":""}]'::text,
   8,'DOC C p8 §4.2 #4 — client BGRL (Vichitra Construction Pvt Ltd)'),
  ('Bhutani Infra 33 kV Electrical Work','bhutani-infra-33kv-electrical','Noida','Uttar Pradesh','unconfirmed',
   'DOC C lists as running; current status needs client confirmation (gate #11).',
   '6.8 KM',
   '[{"label":"Scope","value":"6.8","unit":"KM"},{"label":"Voltage class","value":"33","unit":"KV"}]'::text,
   9,'DOC C p8 §4.2 #5 — via Parmesh Construction Company Ltd'),
  ('Capgemini 11 kV Electrical Work','capgemini-11kv-electrical','Noida','Uttar Pradesh','unconfirmed',
   'DOC C lists as running; current status needs client confirmation (gate #11).',
   '1.8 KM',
   '[{"label":"Scope","value":"1.8","unit":"KM"},{"label":"Voltage class","value":"11","unit":"KV"}]'::text,
   10,'DOC C p8 §4.2 #6 — client Capgemini (NSEZ Noida)')
) as v(title, slug, city, state, status, status_note, scope, metrics, ord, src)
on conflict (slug) do nothing;

-- ============ PRACTICE 02 — HVAC (54 records, DOC B pp.8-9) ============
-- Residential/individual clients anonymized per P4 §19.10; corporate names kept
-- (public record in company documents). TR/sqft per source; ambiguous pairings
-- (entries 07/08, 31-33) flagged with C16/C20 notes.
insert into public.projects
 (ref, title, slug, practice_id, location_city, location_state, status, status_note, scope_line, metrics, client_display, sort_order, source_ref)
select 'P2-' || lpad((row_number() over ())::text, 3, '0'), v.title, v.slug,
       (select id from public.practices where number = 2),
       v.city, v.state, v.status, v.status_note, v.scope,
       v.metrics::jsonb, v.client_display, v.ord, v.src
from (values
  ('World Trade Tower — HVAC & Fire','world-trade-tower-hvac-fire','Noida','Uttar Pradesh','completed',null,
   '4,000 TR HVAC with integrated fire hydrant & sprinkler system',
   '[{"label":"Capacity","value":"4,000","unit":"TR"}]'::text, 'World Trade Tower (WTT)',
   1,'DOC B p8 #01 / DOC A p16 — flagship; Template-B candidate (narrative requested)'),
  ('World Trade Park — HVAC','world-trade-park-hvac','Jaipur','Rajasthan','completed',null,
   '2,400 TR HVAC system',
   '[{"label":"Capacity","value":"2,400","unit":"TR"}]'::text, 'World Trade Park (WTP)',
   2,'DOC B p8 #02'),
  ('United Transformers — HVAC','united-transformers-hvac','Jaipur','Rajasthan','completed',null,
   '100 TR HVAC system',
   '[{"label":"Capacity","value":"100","unit":"TR"}]'::text, 'United Transformers',
   3,'DOC B p8 #03'),
  ('Apollo Pipes Ltd — HVAC','apollo-pipes-hvac','Noida','Uttar Pradesh','completed',null,
   '300 TR HVAC system',
   '[{"label":"Capacity","value":"300","unit":"TR"}]'::text, 'Apollo Pipes Limited',
   4,'DOC B p8 #04'),
  ('Pearson Education — HVAC','pearson-education-hvac-bangalore','Bangalore','Karnataka','completed',null,
   '120 TR HVAC system',
   '[{"label":"Capacity","value":"120","unit":"TR"}]'::text, 'Pearson Education India Pvt. Ltd.',
   5,'DOC B p8 #05 — note C17: only Bangalore record; fire-section "05 cities" claim excludes it'),
  ('UltraTech — HVAC','ultratech-hvac','Noida','Uttar Pradesh','completed',null,
   '125 TR HVAC system',
   '[{"label":"Capacity","value":"125","unit":"TR"}]'::text, 'UltraTech',
   6,'DOC B p8 #06'),
  ('JCPenney — HVAC','jcpenney-hvac-noida','Noida','Uttar Pradesh','completed',
   'C16: source numbering glitch — entries 07/08 (JC Penny / Pearson) share a duplicated "05" with ambiguous pairing; verify scope split.',
   '150 TR HVAC system',
   '[{"label":"Capacity","value":"150","unit":"TR"}]'::text, 'JCPenney',
   7,'DOC B p8 #07-08 (ambiguous pairing)'),
  ('Pearson Education — HVAC (Noida)','pearson-education-hvac-noida','Noida','Uttar Pradesh','completed',
   'C16: paired with #07 JC Penny in source layout; capacity pairing uncertain.',
   '300 TR HVAC system',
   '[{"label":"Capacity","value":"300","unit":"TR"}]'::text, 'Pearson Education India Pvt. Ltd.',
   8,'DOC B p8 #07-08 (ambiguous pairing)'),
  ('SS Foods — HVAC','ss-foods-hvac','Noida','Uttar Pradesh','completed',null,
   '80 TR HVAC system','[{"label":"Capacity","value":"80","unit":"TR"}]'::text, 'SS Foods',
   9,'DOC B p8 #09'),
  ('Invenio — HVAC','invenio-hvac','Noida','Uttar Pradesh','completed',null,
   '80 TR HVAC system','[{"label":"Capacity","value":"80","unit":"TR"}]'::text, 'Invenio',
   10,'DOC B p8 #10'),
  ('Arkadin — HVAC','arkadin-hvac','Noida','Uttar Pradesh','completed',null,
   '70 TR HVAC system','[{"label":"Capacity","value":"70","unit":"TR"}]'::text, 'Arkadin',
   11,'DOC B p8 #11'),
  ('GEBTECH — HVAC','gebtech-hvac','Noida','Uttar Pradesh','completed',null,
   '35,000 sq.ft. HVAC installation','[{"label":"Area served","value":"35,000","unit":"SQ.FT."}]'::text, 'GEBTECH',
   12,'DOC B p8 #12'),
  ('Noida Towers Pvt Ltd — HVAC','noida-towers-hvac','Noida','Uttar Pradesh','completed',null,
   '30,000 sq.ft. HVAC installation','[{"label":"Area served","value":"30,000","unit":"SQ.FT."}]'::text, 'Noida Towers Pvt Ltd.',
   13,'DOC B p8 #13'),
  ('Nippon Steel — HVAC','nippon-steel-hvac','New Delhi','Delhi','completed',null,
   '18,000 sq.ft. HVAC installation','[{"label":"Area served","value":"18,000","unit":"SQ.FT."}]'::text, 'Nippon Steel & Sumitomo Metal',
   14,'DOC B p8 #14'),
  ('TATA Advanced Ltd — HVAC','tata-advanced-hvac','Noida','Uttar Pradesh','completed',null,
   '16,000 sq.ft. HVAC installation','[{"label":"Area served","value":"16,000","unit":"SQ.FT."}]'::text, 'TATA Advanced Systems',
   15,'DOC B p8 #15'),
  ('Qatar Airways (Gurugram office) — HVAC','qatar-airways-hvac','Gurugram','Haryana','completed',null,
   '15,000 sq.ft. HVAC installation','[{"label":"Area served","value":"15,000","unit":"SQ.FT."}]'::text, 'Qatar Airways',
   16,'DOC B p8 #16 — "Qatar Airway" in source (C20)'),
  ('IMGC — HVAC','imgc-hvac','Noida','Uttar Pradesh','completed',null,
   '14,000 sq.ft. HVAC installation','[{"label":"Area served","value":"14,000","unit":"SQ.FT."}]'::text, 'IMGC',
   17,'DOC B p8 #17'),
  ('DEN TV — HVAC','den-tv-hvac','New Delhi','Delhi','completed',null,
   '14,000 sq.ft. HVAC installation','[{"label":"Area served","value":"14,000","unit":"SQ.FT."}]'::text, 'DEN',
   18,'DOC B p8 #18'),
  ('Regus — HVAC','regus-hvac','Noida','Uttar Pradesh','completed',null,
   '60 TR HVAC system','[{"label":"Capacity","value":"60","unit":"TR"}]'::text, 'Regus',
   19,'DOC B p8 #19'),
  ('CommScope — HVAC','commscope-hvac','Noida','Uttar Pradesh','completed',null,
   '45 TR HVAC system','[{"label":"Capacity","value":"45","unit":"TR"}]'::text, 'CommScope',
   20,'DOC B p8 #20 — "Comscope" in source (C20)'),
  ('Hexagramme — HVAC','hexagramme-hvac','Noida','Uttar Pradesh','completed',null,
   '50 TR HVAC system','[{"label":"Capacity","value":"50","unit":"TR"}]'::text, 'Hexagramme',
   21,'DOC B p8 #21'),
  ('TATA AIG — HVAC','tata-aig-hvac','Noida','Uttar Pradesh','completed',null,
   '50 TR HVAC system','[{"label":"Capacity","value":"50","unit":"TR"}]'::text, 'TATA AIG',
   22,'DOC B p8 #22'),
  ('ICICI Lombard — HVAC','icici-lombard-hvac','Noida','Uttar Pradesh','completed',null,
   '40 TR HVAC system','[{"label":"Capacity","value":"40","unit":"TR"}]'::text, 'ICICI Lombard',
   23,'DOC B p8 #23'),
  ('Acquisory Services — HVAC','acquisory-hvac','Noida','Uttar Pradesh','completed',null,
   '40 TR HVAC system','[{"label":"Capacity","value":"40","unit":"TR"}]'::text, 'Acquisory',
   24,'DOC B p8 #24'),
  ('CHROME — HVAC','chrome-hvac','Noida','Uttar Pradesh','completed',null,
   '40 TR HVAC system','[{"label":"Capacity","value":"40","unit":"TR"}]'::text, 'CHROME',
   25,'DOC B p8 #25'),
  ('Virus-Eraser — HVAC','virus-eraser-hvac','Noida','Uttar Pradesh','completed',null,
   '10 TR HVAC system','[{"label":"Capacity","value":"10","unit":"TR"}]'::text, null,
   26,'DOC B p9 #26 — client name per source'),
  ('Mr. Geocon Infra — HVAC','geocon-infra-hvac','Noida','Uttar Pradesh','completed',null,
   '10 TR HVAC system','[{"label":"Capacity","value":"10","unit":"TR"}]'::text, 'Private residential client, Noida',
   27,'DOC B p9 #27 — anonymized per P4 §19.10'),
  ('I-Avatar — HVAC','i-avatar-hvac','Noida','Uttar Pradesh','completed',null,
   '10 TR HVAC system','[{"label":"Capacity","value":"10","unit":"TR"}]'::text, null,
   28,'DOC B p9 #28'),
  ('Tricon Builcon — HVAC','tricon-builcon-hvac','Noida','Uttar Pradesh','completed',null,
   '12 TR HVAC system','[{"label":"Capacity","value":"12","unit":"TR"}]'::text, 'Tricon Builcon',
   29,'DOC B p9 #29'),
  ('Ishaan International — HVAC','ishaan-international-hvac','Noida','Uttar Pradesh','completed',null,
   '12 TR HVAC system','[{"label":"Capacity","value":"12","unit":"TR"}]'::text, 'ISHAAN INTERNATIONAL',
   30,'DOC B p9 #30'),
  ('Residential installation — record 31','residential-hvac-record-31','Noida','Uttar Pradesh','completed',
   'C16: entries 31-33 (Mr. Guptaji / Golder Associates / Prakash Generator) have ambiguous 10/12 TR pairing in source.',
   '10/12 TR HVAC system','[{"label":"Capacity","value":"10/12","unit":"TR"}]'::text, 'Private residential client, Noida',
   31,'DOC B p9 #31 — anonymized; pairing ambiguous'),
  ('Golder Associates — HVAC','golder-associates-hvac','Noida','Uttar Pradesh','completed',
   'C16: entries 31-33 pairing ambiguous in source.',
   '10/12 TR HVAC system','[{"label":"Capacity","value":"10/12","unit":"TR"}]'::text, 'GOLDER',
   32,'DOC B p9 #32 — pairing ambiguous'),
  ('Prakash Gen-Tech — HVAC','prakash-gentech-hvac','Noida','Uttar Pradesh','completed',
   'C16: entries 31-33 pairing ambiguous in source.',
   '10/12 TR HVAC system','[{"label":"Capacity","value":"10/12","unit":"TR"}]'::text, 'Prakash Gen-Tech',
   33,'DOC B p9 #33 — pairing ambiguous'),
  ('Residential installation — record 34','residential-hvac-record-34','Noida','Uttar Pradesh','completed',null,
   '15 TR HVAC system','[{"label":"Capacity","value":"15","unit":"TR"}]'::text, 'Private residential client, Noida',
   34,'DOC B p9 #34 — anonymized per P4 §19.10'),
  ('Residential installation — record 35','residential-hvac-record-35','Noida','Uttar Pradesh','completed',null,
   '15 TR HVAC system','[{"label":"Capacity","value":"15","unit":"TR"}]'::text, 'Private residential client, Noida',
   35,'DOC B p9 #35 — anonymized per P4 §19.10'),
  ('V & S SeAir Logistics — HVAC','vs-seair-logistics-hvac','Noida','Uttar Pradesh','completed',null,
   '20 TR HVAC system','[{"label":"Capacity","value":"20","unit":"TR"}]'::text, 'V & S SeAir Logistics Pvt. Ltd',
   36,'DOC B p9 #36'),
  ('Paperpedia — HVAC','paperpedia-hvac','Noida','Uttar Pradesh','completed',null,
   '15 TR HVAC system','[{"label":"Capacity","value":"15","unit":"TR"}]'::text, 'Paperpedia',
   37,'DOC B p9 #37'),
  ('Rama Refrigeration — HVAC','rama-refrigeration-hvac','Noida','Uttar Pradesh','completed',null,
   '25 TR HVAC system','[{"label":"Capacity","value":"25","unit":"TR"}]'::text, 'Rama Refrigeration',
   38,'DOC B p9 #38 — "Rama Refgeration" in source (C20)'),
  ('APC — HVAC','apc-hvac','Noida','Uttar Pradesh','completed',null,
   '25 TR HVAC system','[{"label":"Capacity","value":"25","unit":"TR"}]'::text, 'APC',
   39,'DOC B p9 #39'),
  ('My Desk — HVAC','my-desk-hvac','Noida','Uttar Pradesh','completed',null,
   '25 TR HVAC system','[{"label":"Capacity","value":"25","unit":"TR"}]'::text, 'My Desk',
   40,'DOC B p9 #40'),
  ('One India — HVAC','one-india-hvac-30tr','Noida','Uttar Pradesh','completed',
   'C14: ONE INDIA double-listed in source (30 TR at #41 and 20 TR at #44). Both records preserved pending client clarification.',
   '30 TR HVAC system','[{"label":"Capacity","value":"30","unit":"TR"}]'::text, 'One India',
   41,'DOC B p9 #41 — C14 duplicate listing (1 of 2)'),
  ('Mr. R.U Khan — HVAC','residential-hvac-record-42','Noida','Uttar Pradesh','completed',null,
   '20 TR HVAC system','[{"label":"Capacity","value":"20","unit":"TR"}]'::text, 'Private residential client, Noida',
   42,'DOC B p9 #42 — anonymized per P4 §19.10'),
  ('AVNET — HVAC','avnet-hvac','New Delhi','Delhi','completed',null,
   '25 TR HVAC system','[{"label":"Capacity","value":"25","unit":"TR"}]'::text, 'AVNET',
   43,'DOC B p9 #43'),
  ('One India — HVAC (second listing)','one-india-hvac-20tr','Noida','Uttar Pradesh','completed',
   'C14: second ONE INDIA listing with different capacity; kept as separate record pending client clarification.',
   '20 TR HVAC system','[{"label":"Capacity","value":"20","unit":"TR"}]'::text, 'One India',
   44,'DOC B p9 #44 — C14 duplicate listing (2 of 2)'),
  ('Aditya Birla — HVAC','aditya-birla-hvac','Noida','Uttar Pradesh','completed',null,
   '35 TR HVAC system','[{"label":"Capacity","value":"35","unit":"TR"}]'::text, 'Aditya Birla Group',
   45,'DOC B p9 #45'),
  ('AON Global — HVAC','aon-global-hvac','Noida','Uttar Pradesh','completed',null,
   '35 TR HVAC system','[{"label":"Capacity","value":"35","unit":"TR"}]'::text, 'AON',
   46,'DOC B p9 #46'),
  ('B.L Agro — HVAC','bl-agro-hvac','Noida','Uttar Pradesh','completed',null,
   '20 TR HVAC system','[{"label":"Capacity","value":"20","unit":"TR"}]'::text, 'B.L Agro',
   47,'DOC B p9 #47'),
  ('Softcell — HVAC','softcell-hvac','Noida','Uttar Pradesh','completed',null,
   '20 TR HVAC system','[{"label":"Capacity","value":"20","unit":"TR"}]'::text, 'Softcell',
   48,'DOC B p9 #48'),
  ('Singhi & Company — HVAC','singhi-company-hvac','Noida','Uttar Pradesh','completed',null,
   '20 TR HVAC system','[{"label":"Capacity","value":"20","unit":"TR"}]'::text, 'Singhi & Company',
   49,'DOC B p9 #49'),
  ('Lakhani Pvt Ltd — HVAC','lakhani-hvac','Ghaziabad','Uttar Pradesh','completed',null,
   '20 TR HVAC system','[{"label":"Capacity","value":"20","unit":"TR"}]'::text, 'Lakhani',
   50,'DOC B p9 #50'),
  ('Sandhaar Eco Green — HVAC','sandhaar-eco-green-hvac','Noida','Uttar Pradesh','completed',null,
   '10 TR HVAC system','[{"label":"Capacity","value":"10","unit":"TR"}]'::text, 'Sandhaar Eco Green',
   51,'DOC B p9 #51'),
  ('Kotak Securities — HVAC','kotak-securities-hvac','Noida','Uttar Pradesh','completed',null,
   '10 TR HVAC system','[{"label":"Capacity","value":"10","unit":"TR"}]'::text, 'Kotak Securities',
   52,'DOC B p9 #52'),
  ('Essar Oil — HVAC','essar-oil-hvac','Noida','Uttar Pradesh','completed',null,
   '10 TR HVAC system','[{"label":"Capacity","value":"10","unit":"TR"}]'::text, 'Essar',
   53,'DOC B p9 #53'),
  ('Elcon — HVAC','elcon-hvac','Noida','Uttar Pradesh','completed',null,
   '10 TR HVAC system','[{"label":"Capacity","value":"10","unit":"TR"}]'::text, 'Elcon',
   54,'DOC B p9 #54')
) as v(title, slug, city, state, status, status_note, scope, metrics, client_display, ord, src)
on conflict (slug) do nothing;

-- ============ PRACTICE 02 — FIRE (22 records, DOC A p17 / DOC B p10) ============
insert into public.projects
 (ref, title, slug, practice_id, location_city, location_state, status, scope_line, metrics, client_display, sort_order, source_ref)
select 'P2-' || lpad((55 + row_number() over ())::text, 3, '0'), v.title, v.slug,
       (select id from public.practices where number = 2),
       v.city, v.state, 'completed', v.scope,
       '[{"label":"System","value":"Fire protection","unit":""}]'::jsonb, v.client_display, v.ord, v.src
from (values
  ('World Trade Tower — Fire Protection','world-trade-tower-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system (integrated with 4,000 TR HVAC installation)','World Trade Tower (WTT)',
   55,'DOC A p17 #01 / DOC B p10'),
  ('World Trade Park — Fire Protection','world-trade-park-fire','Jaipur','Rajasthan',
   'Fire hydrant & sprinkler system','World Trade Park (WTP)',56,'DOC A p17 #02'),
  ('United Transformers — Fire Protection','united-transformers-fire','Jaipur','Rajasthan',
   'Fire hydrant & sprinkler system','United Transformers',57,'DOC A p17 #03'),
  ('Apollo Pipes Ltd — Fire Protection','apollo-pipes-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','Apollo Pipes Limited',58,'DOC A p17 #04'),
  ('My Desk — Fire Protection','my-desk-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','My Desk',59,'DOC A p17 #05'),
  ('Lakhani Pvt Ltd — Fire Protection','lakhani-fire','Ghaziabad','Uttar Pradesh',
   'Fire hydrant & sprinkler system','Lakhani',60,'DOC A p17 #06'),
  ('UltraTech — Fire Protection','ultratech-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','UltraTech',61,'DOC A p17 #07'),
  ('JCPenney — Fire Protection','jcpenney-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','JCPenney',62,'DOC A p17 #08'),
  ('Qatar Airways — Fire Protection','qatar-airways-fire','Gurugram','Haryana',
   'Fire hydrant & sprinkler system','Qatar Airways',63,'DOC A p17 #09'),
  ('TATA Advanced Ltd — Fire Protection','tata-advanced-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','TATA Advanced Systems',64,'DOC A p17 #10'),
  ('Noida Towers Pvt Ltd — Fire Protection','noida-towers-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','Noida Towers Pvt Ltd.',65,'DOC A p17 #11'),
  ('DEN TV — Fire Protection','den-tv-fire','New Delhi','Delhi',
   'Fire hydrant & sprinkler system','DEN',66,'DOC A p17 #12'),
  ('Nippon Steel — Fire Protection','nippon-steel-fire','New Delhi','Delhi',
   'Fire hydrant & sprinkler system','Nippon Steel & Sumitomo Metal',67,'DOC A p17 #13'),
  ('Kotak Securities — Fire Protection','kotak-securities-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','Kotak Securities',68,'DOC A p17 #14'),
  ('Aditya Birla — Fire Protection','aditya-birla-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','Aditya Birla Group',69,'DOC A p17 #15'),
  ('Essar Oil — Fire Protection','essar-oil-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','Essar',70,'DOC A p17 #16'),
  ('TATA AIG — Fire Protection','tata-aig-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','TATA AIG',71,'DOC A p17 #17'),
  ('ICICI Lombard — Fire Protection','icici-lombard-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','ICICI Lombard',72,'DOC A p17 #18'),
  ('Pearson Education — Fire Protection','pearson-education-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','Pearson Education India Pvt. Ltd.',73,'DOC A p17 #19'),
  ('SS Foods — Fire Protection','ss-foods-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','SS Foods',74,'DOC A p17 #20'),
  ('Invenio — Fire Protection','invenio-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','Invenio',75,'DOC A p17 #21'),
  ('Arkadin — Fire Protection','arkadin-fire','Noida','Uttar Pradesh',
   'Fire hydrant & sprinkler system','Arkadin',76,'DOC A p17 #22 — "Arkidin" in source (C20)')
) as v(title, slug, city, state, scope, client_display, ord, src)
on conflict (slug) do nothing;

-- ============ RELATIONS (junctions) ============
-- Services by slug per project category
-- P01 records: smart-city electrical -> ug-ht-lt-cable-laying; gas -> cgd-networks; Sangli -> lmc-works; Bhutani/Capgemini -> ug-ht-lt-cable-laying + substation
insert into public.project_services (project_id, service_id)
select p.id, s.id from public.projects p, public.services s
where p.slug in ('patna-smart-city-electrical','banaras-smart-city-electrical','lucknow-metro-electrical',
                 'gurugram-smart-city-electrical-06','gurugram-smart-city-electrical-08','dhanbad-smart-city-electrical')
  and s.slug = 'ug-ht-lt-cable-laying'
on conflict do nothing;

insert into public.project_services (project_id, service_id)
select p.id, s.id from public.projects p, public.services s
where p.slug = 'aurangabad-cmdp-pipe-laying' and s.slug = 'cgd-networks'
on conflict do nothing;

insert into public.project_services (project_id, service_id)
select p.id, s.id from public.projects p, public.services s
where p.slug = 'sangli-lmc-work' and s.slug in ('lmc-works','cgd-networks')
on conflict do nothing;

insert into public.project_services (project_id, service_id)
select p.id, s.id from public.projects p, public.services s
where p.slug in ('bhutani-infra-33kv-electrical','capgemini-11kv-electrical')
  and s.slug in ('ug-ht-lt-cable-laying','substation-construction')
on conflict do nothing;

-- P02 HVAC records -> hvac-systems (or mep-services for sq.ft. fit-outs); fire records -> fire-fighting-hydrant
insert into public.project_services (project_id, service_id)
select p.id, s.id from public.projects p, public.services s
where p.ref like 'P2-0%' and p.ref <= 'P2-054' and s.slug = 'hvac-systems'
on conflict do nothing;

insert into public.project_services (project_id, service_id)
select p.id, s.id from public.projects p, public.services s
where p.ref >= 'P2-055' and s.slug = 'fire-fighting-hydrant'
on conflict do nothing;

-- WTT gets HVAC + fire + T&C (integrated system per DOC A p16)
insert into public.project_services (project_id, service_id)
select p.id, s.id from public.projects p, public.services s
where p.slug = 'world-trade-tower-hvac-fire' and s.slug = 'testing-commissioning'
on conflict do nothing;

-- Sectors: smart-city records -> smart-city-metro; gas records -> oil-gas-cgd; HVAC/fire corporates -> corporate-commercial
insert into public.project_sectors (project_id, sector_id)
select p.id, se.id from public.projects p, public.sectors se
where p.slug in ('patna-smart-city-electrical','banaras-smart-city-electrical','lucknow-metro-electrical',
                 'gurugram-smart-city-electrical-06','gurugram-smart-city-electrical-08','dhanbad-smart-city-electrical')
  and se.slug = 'smart-city-metro'
on conflict do nothing;

insert into public.project_sectors (project_id, sector_id)
select p.id, se.id from public.projects p, public.sectors se
where p.slug in ('aurangabad-cmdp-pipe-laying','sangli-lmc-work') and se.slug = 'oil-gas-cgd'
on conflict do nothing;

insert into public.project_sectors (project_id, sector_id)
select p.id, se.id from public.projects p, public.sectors se
where p.ref like 'P2-%' and se.slug = 'corporate-commercial'
on conflict do nothing;

-- Clients: link by name match
insert into public.project_clients (project_id, client_id, role)
select p.id, c.id, case
  when p.slug in ('aurangabad-cmdp-pipe-laying','sangli-lmc-work') and c.name = 'Vichitra Constructions Pvt. Ltd.' then 'contractor'
  when p.slug in ('bhutani-infra-33kv-electrical') and c.name = 'Parmesh Construction Company Ltd.' then 'contractor'
  else 'principal' end
from public.projects p
join public.clients c
  on c.name = p.client_display
  or (p.slug = 'patna-smart-city-electrical' and c.name = 'L&T')
  or (p.slug = 'banaras-smart-city-electrical' and c.name = 'L&T')
  or (p.slug = 'lucknow-metro-electrical' and c.name = 'L&T')
  or (p.slug in ('gurugram-smart-city-electrical-06','gurugram-smart-city-electrical-08') and c.name = 'TATA Projects')
  or (p.slug = 'dhanbad-smart-city-electrical' and c.name = 'JSP Projects Pvt. Ltd.')
  or (p.slug in ('aurangabad-cmdp-pipe-laying','sangli-lmc-work') and c.name = 'BGRL')
  or (p.slug = 'capgemini-11kv-electrical' and c.name = 'Capgemini')
  or (p.slug like '%-fire' and c.name = case p.client_display
      when 'World Trade Tower (WTT)' then 'World Trade Tower'
      when 'World Trade Park (WTP)' then 'World Trade Park'
      when 'UltraTech' then 'UltraTech'
      when 'JCPenney' then 'JCPenney'
      when 'Qatar Airways' then 'Qatar Airways'
      when 'TATA Advanced Systems' then 'TATA Advanced Systems'
      when 'Nippon Steel & Sumitomo Metal' then 'Nippon Steel & Sumitomo Metal'
      when 'Kotak Securities' then 'Kotak Securities'
      when 'Aditya Birla Group' then 'Aditya Birla Group'
      when 'Essar' then 'Essar'
      when 'TATA AIG' then 'TATA AIG'
      when 'ICICI Lombard' then 'ICICI Lombard'
      when 'Pearson Education India Pvt. Ltd.' then 'Pearson'
      when 'SS Foods' then 'SS Foods'
      when 'Invenio' then 'Invenio'
      when 'Arkadin' then 'Arkadin'
      when 'DEN' then 'DEN'
      when 'My Desk' then 'My Desk'
      when 'Lakhani' then 'Lakhani'
      when 'United Transformers' then 'United Transformers'
      when 'Apollo Pipes Limited' then 'Apollo Pipes Limited'
      when 'Noida Towers Pvt Ltd.' then 'Noida Towers Pvt. Ltd.'
      else c.name end)
where p.client_display is not null
on conflict do nothing;

-- Featured flags for the flagship projects (WTT, Patna, Aurangabad)
update public.projects set featured = true
where slug in ('world-trade-tower-hvac-fire','patna-smart-city-electrical','aurangabad-cmdp-pipe-laying');

-- Mark Template-B candidates (narrative requested from client; stay as A until provided)
update public.projects set verification_note =
  'Template-B candidate — client-supplied narrative requested (Phase 3 §10.2). Renders as Template A until summary + scope breakdown are provided.'
where slug in ('world-trade-tower-hvac-fire','world-trade-park-hvac','patna-smart-city-electrical',
               'banaras-smart-city-electrical','lucknow-metro-electrical','aurangabad-cmdp-pipe-laying','sangli-lmc-work');

-- Verification pass rule: all corpus rows stay unverified for the editor
-- transcription check; the 14 conflict-flagged rows additionally carry notes.
-- (Conflicts are already in status_note / source_ref above — C13, C14, C16, C17.)
