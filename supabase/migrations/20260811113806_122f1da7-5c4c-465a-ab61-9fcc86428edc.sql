
UPDATE public.sections SET
  eyebrow = 'About Us',
  title = 'Turnkey engineering, delivered end to end.',
  subtitle = 'Noida-based. Pan-India delivery.',
  body = 'Capex Construction & Engineering Pvt. Ltd. is a Noida-based engineering company operating from a sophisticated, modern setup in the heart of Noida and serving clients across India. Founded in 2012 to meet the up-market demand for professional, high-quality integrated engineering services, Capex has established itself as an organisation providing complete turnkey solutions — from design and execution through to testing and commissioning.

Our strength lies in tailor-made turnkey solutions engineered around each project''s requirements, covering fire fighting, HVAC, electrical HT/LT works, City Gas Distribution, LMC works and underground utility works. Every engagement is delivered under a single accountable contract for supply, installation, testing and commissioning (SITC), backed by a dedicated technical team of engineers and an uncompromising, quality-focused approach.

We have executed projects across commercial complexes, industrial projects, manufacturing plants, multistoried residential societies and townships, hospitals, hotels, malls and shopping complexes, educational institutions, cineplexes, retail outlets, corporate facilities and other infrastructure programmes.',
  extra = '{
    "highlights": ["Turnkey delivery across MEP verticals", "Dedicated in-house engineering & QA/QC", "Pan-India project execution", "Repeat orders from marquee corporates"],
    "capabilities": ["Fire Fighting & Fire Protection Systems", "HVAC Systems", "Electrical HT/LT Works", "City Gas Distribution (CGD)", "LMC Works", "Underground Utility Works", "Turnkey Engineering Solutions", "Supply, Installation, Testing & Commissioning (SITC)"],
    "sectors": ["Commercial Complexes", "Industrial Projects", "Manufacturing Plants", "Multistoried Residential Societies", "Residential Townships", "Hospitals", "Hotels", "Malls & Shopping Complexes", "Educational Institutions", "Cineplexes", "Retail Outlets", "Corporate Facilities"],
    "cards": [
      {"label": "Our Vision", "icon": "Gauge", "title": "To be India''s most trusted turnkey engineering partner.", "desc": "Recognised for engineering rigor, on-time delivery and long-term client partnerships across every project we touch."},
      {"label": "Our Mission", "icon": "ShieldCheck", "title": "Deliver safe, efficient, code-compliant systems — on time, every time.", "desc": "Combine skilled crews, genuine equipment and transparent SLAs to protect the assets, people and operations we serve."}
    ],
    "association_groups": [
      {"label": "Corporate & Client Associations", "items": ["L&T", "BGRL", "IGL", "Creative LLP", "Bhutani Infra", "BPCL", "JSP Projects Pvt. Ltd.", "Vichitra Constructions Pvt. Ltd."]},
      {"label": "Associated Architects & PMCs", "items": ["JLL", "CBRE", "Knight Frank", "AVA", "Vince View", "ISA Projects", "Design Tree", "Hexagramme", "UDC Interiors", "Credence Gate", "Habitat Systems", "Aeiforia Architects", "Design & Organise", "Synergy-Ce Corporate"]}
    ]
  }'::jsonb
WHERE key = 'about';

UPDATE public.sections SET is_active = false WHERE key IN ('projects', 'vision_mission');
