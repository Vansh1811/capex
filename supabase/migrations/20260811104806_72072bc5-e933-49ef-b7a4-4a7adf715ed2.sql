-- 1) authentic logos from brochures
update public.content_items set image_url='/__l5e/assets-v1/97e9c65a-2495-4270-9699-e1e620843250/bhutani-infra.png' where collection='clients' and title='Bhutani';
update public.content_items set image_url='/__l5e/assets-v1/74b9f3a0-74e2-4d4b-90f5-0a985207e4e2/wtt.png' where collection='clients' and title='WTT (ET Infra)';
update public.content_items set image_url='/__l5e/assets-v1/69c330ac-e637-474f-9eeb-695f5656919b/ultratech-cement.png' where collection='clients' and title='UltraTech Cement';
update public.content_items set image_url='/__l5e/assets-v1/90871f73-c039-4838-8916-5e702248f04c/pearson.png' where collection='clients' and title='Pearson';
update public.content_items set image_url='/__l5e/assets-v1/51654039-4bc8-4211-8d62-3a47b35678aa/arkadin.png' where collection='clients' and title='Arcadin';
update public.content_items set image_url='/__l5e/assets-v1/485d2930-d139-442b-840a-ae9fb8e02d4b/icici-lombard.png' where collection='clients' and title='ICICI Lombard';
update public.content_items set image_url='/__l5e/assets-v1/ff33c8ae-2796-448e-a76e-262877e1fa1d/tata-advanced-systems.png' where collection='clients' and title='TATA Advanced Ltd.';
update public.content_items set image_url='/__l5e/assets-v1/de35ec2d-283d-40d1-b9bc-563f4fc4515e/imgc.png' where collection='clients' and title='IMGC';
update public.content_items set image_url='/__l5e/assets-v1/22e0e757-fb14-4f1f-af3d-3d7224e1383d/tata-aig.png' where collection='clients' and title='TATA AIG';
update public.content_items set image_url='/__l5e/assets-v1/726d5845-97cd-4a08-a5f6-b3b1207c1d62/apl-apollo.png' where collection='clients' and title='Apollo Pipes';
update public.content_items set image_url='/__l5e/assets-v1/19421a48-4735-40b2-92c1-3f2175c5fe76/regus.png' where collection='clients' and title='Regus';
update public.content_items set image_url='/__l5e/assets-v1/ad10c287-9cf6-4cb2-a705-3937d732ae35/aon-global.png' where collection='clients' and title='AON Global';
update public.content_items set image_url='/__l5e/assets-v1/a6b6b39e-e91e-4fff-9791-68829bf786c7/oneindia.png' where collection='clients' and title='One India';
update public.content_items set image_url='/__l5e/assets-v1/485c5807-8323-437e-86f5-e7ec6527d310/lakhani-vardaan.png' where collection='clients' and title='Lakhani Pvt. Ltd.';
update public.content_items set image_url='/__l5e/assets-v1/4b9c4c5a-c99f-43c6-af6d-0fb776a854c8/qatar-airways.png' where collection='clients' and title='Qatar Airways';
update public.content_items set image_url='/__l5e/assets-v1/3cdb61a6-7453-453e-99f7-95f4a29fad7f/jcpenney.png' where collection='clients' and title='JC Penney';
update public.content_items set image_url='/__l5e/assets-v1/d4dbf70c-e068-41e5-84d8-b85240f37284/aditya-birla.png' where collection='clients' and title='Aditya Birla Group';
update public.content_items set image_url='/__l5e/assets-v1/6d644071-2323-4f58-ba95-4f6616f2862f/capgemini.png' where collection='clients' and title='Capgemini';
update public.content_items set image_url='/__l5e/assets-v1/09a4d9ba-edd8-4ae2-9b69-e1d826dd0698/igl.png' where collection='clients' and title='IGL';

-- 2) drop auto-fetched favicon placeholders (no authentic logo in the profiles) -> show name as text
update public.content_items set image_url=null
where collection='clients' and image_url like 'https://www.google.com/s2/favicons%';

-- 3) remaining clients shown in the profiles, with their real logos
insert into public.content_items (collection, category_id, title, image_url, sort_order)
select 'clients', (select id from public.categories where collection='clients' and name=v.cat limit 1), v.title, v.url, v.ord
from (values
  ('Corporates','Larsen & Toubro','/__l5e/assets-v1/7e451148-2790-4f25-b45d-a54708b0a741/larsen-toubro.png',30),
  ('Corporates','TATA Projects Limited','/__l5e/assets-v1/382af80b-fd1d-48be-bba6-888bafad88c3/tata-projects.png',31),
  ('Corporates','Essar','/__l5e/assets-v1/75ce841f-6146-4b57-89aa-b6240ef5b408/essar.png',32),
  ('Corporates','APC','/__l5e/assets-v1/ba563ec7-9c49-4496-91be-f7b03159cf5e/apc.png',33),
  ('Corporates','Prakash Group of Industries','/__l5e/assets-v1/7418033c-8457-47a4-bef2-e232269f3389/prakash.png',34),
  ('Corporates','Gen-Tech','/__l5e/assets-v1/9e1e4ba8-d9b2-4c1d-b7a2-dcb48b071b90/gen-tech.png',35),
  ('Corporates','Nippon Steel & Sumitomo Metal','/__l5e/assets-v1/ec4d129b-6d9a-42ec-bbcd-3215959fd4fe/nippon-steel.png',36),
  ('Corporates','Kotak Securities','/__l5e/assets-v1/90e851cf-c47f-465d-a019-923534d27b2b/kotak-securities.png',37),
  ('Corporates','Acquisory','/__l5e/assets-v1/1ee74c74-64d0-47a2-a0d5-914980f5b8f5/acquisory.png',38),
  ('Corporates','United Transformers','/__l5e/assets-v1/be87d6eb-4ffd-42e6-8ed7-c81393982d3c/united-transformers.png',39),
  ('Corporates','Rentech Designs','/__l5e/assets-v1/5da5b241-2f6a-4b86-a8b7-337f277f3cb8/rentech-designs.png',40),
  ('Corporates','BL Agro','/__l5e/assets-v1/8e66c95d-9766-4565-a407-fc623162be58/bl-agro.png',41),
  ('Corporates','Paperpedia','/__l5e/assets-v1/02ee8dcf-6d18-425e-a081-42975c6b6eee/paperpedia.png',42),
  ('Corporates','DEN','/__l5e/assets-v1/1c53eee6-2a13-4c60-bf4b-96d8bd57e68c/den.png',43),
  ('Corporates','V&S','/__l5e/assets-v1/27e1062d-c4c7-480e-8aab-c7b4c6183010/vs-delivering.png',44),
  ('IT & Technology','CommScope','/__l5e/assets-v1/2893a0d0-c4a4-4637-8a42-fc00e94d8316/commscope.png',10),
  ('IT & Technology','Avnet','/__l5e/assets-v1/b061b41f-0e75-4317-ba38-3f4bda1f79e8/avnet.png',11),
  ('IT & Technology','Invenio Business Solutions','/__l5e/assets-v1/c7ff2729-c9b1-46b3-b342-9a9a8c705f41/invenio.png',12),
  ('IT & Technology','Golder','/__l5e/assets-v1/1941072b-350b-4d38-947d-fa473ec75377/golder.png',13),
  ('Oil & Gas','Bharat Gas Resources (BGRL)','/__l5e/assets-v1/a60e3012-6ea4-471d-87cb-80360932ee6c/bharat-gas.png',10),
  ('Builders & Developers','World Trade Park','/__l5e/assets-v1/8a71aa8e-5134-4d5f-9fb1-242a41204807/wtp.png',20)
) as v(cat,title,url,ord)
where not exists (select 1 from public.content_items ci where ci.collection='clients' and ci.title=v.title);