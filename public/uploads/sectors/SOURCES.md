# Sectors — atmospheric reference imagery

All frames in this directory are **third-party reference/atmosphere imagery**,
not Capex project photography. They communicate the _environment_ of each
sector (metro systems, city grids, plant floors, campuses, townships…) and are
always captioned as reference material on the page — never presented as
Capex-owned assets, projects or people. Replace 1:1 by the same filename when
approved Capex photography arrives.

| File                         | Subject                                                          | Commons source                                                              | Author               | License       |
| ---------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------- | ------------- |
| atlas-opening.jpg            | Vidyasagar Setu, Kolkata, lit at night — the atlas' opening plate | "Vidyasagar Setu (7605077050)"                                              | Rajarshi MITRA       | CC BY 2.0     |
| smart-city-metro.jpg         | Metro train entering an elevated station                         | "A metro train entering Baranagar Metro station in Kolkata, India"          | Ravi Dwivedi         | CC BY-SA 4.0  |
| oil-gas-cgd.jpg              | Steel gas main being laid into an open trench                    | "Обновление газопровода 41,2 км от Воскресенска на КРП-11"                   | Incnis Mrsi          | CC0           |
| corporate-commercial.jpg     | Office tower façade, curtain wall + concrete grid                 | "Bandra-Kurla complex Bombay 3239"                                          | Nikhil Kulkarni      | Public domain |
| healthcare-hospitals.jpg     | Hospital corridor, second level                                  | "Corridor on the second level - NÄL hospital 1"                              | W.carter             | CC0           |
| industrial-manufacturing.jpg | Floodlit industrial plant beneath a mountain at night            | "Cimenterie Jbal Ressas la nuit"                                            | Smailtn              | CC BY-SA 4.0  |
| education.jpg                | Modern institutional campus arcade                               | "Entrance West Facade Central Arcade IIT Gandhinagar Sep25 A7CR 07888"      | Timothy A. Gonsalves | CC BY-SA 4.0  |
| hotels-hospitality.jpg       | Warm marble lobby corridor, gilt light                           | "Hyatt Regency Embarcadero Atrium, San Francisco, US"                        | Dale Cruse           | CC BY 2.0     |
| residential-townships.jpg    | High-rise residential towers above tree cover, Powai             | "Hiranandani towers at Powai Mumbai"                                        | Sneha G Gupta        | CC BY-SA 4.0  |
| public-sector.jpg            | North Block, Central Secretariat, New Delhi, at dusk             | "North Block, Secretariat Building, New Delhi, India, 2018"                 | Kuldeep Maruvada     | CC BY-SA 4.0  |

## Notes

- 2026-10-16 replacement set (7 frames, verified visually before commit):
  atlas-opening, oil-gas-cgd, corporate-commercial, public-sector,
  residential-townships, hotels-hospitality, industrial-manufacturing.
  smart-city-metro, healthcare-hospitals and education carry over unchanged.
- The 2026-10-16 grade desaturates 0.88 with a mild warm curve (r×1.04+2,
  b×0.955) and contrast 1.03, saved at long edge 1600, q76 progressive, plus a
  q72 WebP sibling. The opener is graded harder (desaturate 0.62, contrast
  1.06, r×1.07+4, b×0.93) to pull its night floodlighting toward the site's
  bronzed steel register. Re-grade frames on swap; `python` snippets live in
  the project's temp research history (grade_plates.py / regrade_opener.py).
- The oil-gas frame contends with visible Komatsu equipment livery —
  manufacturer markings on plant, not advertising imagery; acceptable
  documentary content, and the portrait desktop mat crop de-emphasises it. The
  industrial frame (Jbal Ressas) keys no third-party branding; the Ramco
  cement-plant candidate was rejected for motion blur + a plant sign that a
  clean crop could not exclude.
- **CC BY / CC BY-SA frames** require attribution if shipped long-term; they
  are placeholders until approved Capex photography lands (Phase 7 media
  gate). If any remain at launch, add a footer credit line or swap them out.
- **CC0 frames** need no attribution.
- Reference captions on the page always read "Reference imagery — not a
  documented Capex project", per the site-wide honesty rule.
