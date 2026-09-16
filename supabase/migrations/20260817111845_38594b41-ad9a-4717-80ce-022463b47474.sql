
-- 1. About: remove SITC from capabilities, reorder association groups
update public.sections
set extra = jsonb_set(
      jsonb_set(extra, '{capabilities}', '["Fire Fighting & Fire Protection Systems","HVAC Systems","Electrical HT/LT Works","City Gas Distribution (CGD)","LMC Works","Underground Utility Works","Turnkey Engineering Solutions"]'::jsonb),
      '{association_groups}',
      '[{"label":"Corporate & Client Associations","items":["Creative LLP","Vichitra Constructions Pvt. Ltd.","JSP Projects Pvt. Ltd.","BGRL","Bhutani Infra","IGL","BPCL","L&T"]},{"label":"Associated Architects & PMCs","items":["Design Tree","Design & Organise","Vince View","AVA","Hexagramme","Aeiforia Architects","Credence Gate","Habitat Systems","UDC Interiors","Synergy-Ce Corporate","ISA Projects","Knight Frank","CBRE","JLL"]}]'::jsonb)
where key = 'about';

-- 2. Services: Clean Rooms -> Solar
update public.content_items
set title = 'Solar',
    tag = 'Renewable Energy',
    icon = 'Sun',
    image_url = '/uploads/service-solar.jpg',
    body = 'Design, supply and installation of rooftop and ground-mounted solar photovoltaic systems — engineered for maximum generation, safety and long-term reliability.',
    bullet_points = '["Solar Power Systems","Solar Installation & EPC","Energy Solutions & Audits","Net Metering & O&M"]'::jsonb
where id = 'a83a9a8f-1674-4fbb-a39f-dd0a40867b89';

-- 3. Oil & Gas category heading
update public.categories set name = 'Oil & Gas Industries' where id = 'b87410a6-c21f-47d6-8733-d4ab214d3e73';

-- 4. Replace Oil & Gas + Builders client lists
delete from public.content_items
where collection = 'clients'
  and category_id in ('b87410a6-c21f-47d6-8733-d4ab214d3e73','8ec3e82f-fea2-454a-9415-3a9acea88bae');

insert into public.content_items (collection, category_id, title, sort_order, is_active, image_url)
values
  ('clients','b87410a6-c21f-47d6-8733-d4ab214d3e73','Think Gas',1,true,null),
  ('clients','b87410a6-c21f-47d6-8733-d4ab214d3e73','Purva Bharti Gas',2,true,null),
  ('clients','b87410a6-c21f-47d6-8733-d4ab214d3e73','AG&P — Atlantic Gulf & Pacific',3,true,null),
  ('clients','b87410a6-c21f-47d6-8733-d4ab214d3e73','IGL — Indraprastha Gas Limited',4,true,'/__l5e/assets-v1/09a4d9ba-edd8-4ae2-9b69-e1d826dd0698/igl.png'),
  ('clients','b87410a6-c21f-47d6-8733-d4ab214d3e73','BPCL — Bharat Petroleum Corporation Limited',5,true,null),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','Noida Tower Pvt. Ltd.',1,true,null),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','Lakhani Pvt. Ltd.',2,true,null),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','Eldeco',3,true,null),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','Paras',4,true,null),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','BPTP',5,true,null),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','ACE',6,true,null),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','WTT (ET Infra)',7,true,'/__l5e/assets-v1/74b9f3a0-74e2-4d4b-90f5-0a985207e4e2/wtt.png'),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','Bhutani',8,true,'/__l5e/assets-v1/97e9c65a-2495-4270-9699-e1e620843250/bhutani-infra.png'),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','Tata Homes',9,true,null),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','Godrej',10,true,null),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','JC Penny',11,true,null),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','Qatar Airways',12,true,null),
  ('clients','8ec3e82f-fea2-454a-9415-3a9acea88bae','Aditya Birla Group',13,true,null);
