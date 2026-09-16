# About — real Capex photography registry (client-supplied PDFs)

All 18 frames in this directory are **real Capex site, plant and equipment photography
extracted from the three client-supplied company profile PDFs**. They replace the earlier
atmospheric Wikimedia reference set (which still lives in `public/uploads/about/` but is no
longer used by the About page). Per the brief: real documentary Capex imagery only, no
reference/stock/AI imagery presented as Capex, no repeats.

Sources:

- **DOC A** — `Capex Construction & Engineering — Company Profile.pdf` (21 pp, integrated profile)
- **DOC B** — `Capex-Profile (12 Pages) ff (Revision 6-7-22) (1).pdf` (HVAC & fire protection profile)
- **DOC C** — `Capex Profile for Electrical and CGD (1).pdf` (UG utilities, electrical & CGD profile)

| File                    | Depicts (honest)                                                                                                                      | Source PDF · page | Used on About section               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------- |
| substation-erection.jpg | Sub-station erection — site photograph (captioned on the PDF's "About Capex" page)                                                    | DOC A p4          | The engineered world (margin print) |
| hdd-drilling.jpg        | Horizontal directional drilling — rig and crew at work (captioned, DOC A p4)                                                          | DOC A p4          | Two worlds · Below the street       |
| hvac-plant-install.jpg  | HVAC plant installation (captioned, DOC A p4)                                                                                         | DOC A p4          | Two worlds · Within the building    |
| below-the-street.jpg    | HDD rig and site operations — wide frame                                                                                              | DOC C p4          | Opening echo / practice plates      |
| within-the-building.jpg | Roof-top chiller and AHU plant (captioned, DOC A p16)                                                                                 | DOC A p16         | The physical Capex                  |
| ug-trench.jpg           | Trench / pipeline gallery photograph                                                                                                  | DOC C p5          | The story (documented work print)   |
| hdd-rig-ops.jpg         | HDD rig at work on site                                                                                                               | DOC C p18         | The physical Capex — rig portrait   |
| boring-interface.jpg    | Horizontal boring at the building interface (captioned, DOC A p11)                                                                    | DOC A p11         | The record / process echo           |
| substation-build.jpg    | Sub-station construction (captioned, DOC A p11)                                                                                       | DOC A p11         | What the company does               |
| wtt-flagship.jpg        | World Trade Tower, Noida — largest single HVAC installation at 4000 TR (captioned, DOC A p16)                                         | DOC A p16         | The record                          |
| site-team.jpg           | Site crew at work — gallery photograph                                                                                                | DOC C p5          | The people behind the work          |
| field-work.jpg          | Field work — gallery photograph                                                                                                       | DOC C p5          | The range of work                   |
| pipeline-work.jpg       | Pipeline work on site                                                                                                                 | DOC C p18         | The story / connection              |
| hvac-detail.jpg         | HVAC system installation detail                                                                                                       | DOC B p3          | Two worlds · detail                 |
| firefitting-detail.jpg  | Fire-fighting & hydrant installation detail                                                                                           | DOC B p3          | Two worlds · detail                 |
| safety-site.jpg         | Safety-regime site photograph                                                                                                         | DOC B p6          | The people / safety line            |
| team-boards.jpg         | Management team — the two boards (Sanjay Sharma, Mayank Kaushal, Anurag Parashar with Malkit Singh, CA Chitin Sapria, Vinod Pouchary) | DOC B p4          | The people behind the work          |
| pipeline-laying.jpg     | Cross-country pipeline laying (captioned, DOC A p4)                                                                                   | DOC A p4          | Delivery line composition           |

## Notes

- Extracted at native PDF resolution (or 300-dpi page crops where the PDF stores a masked
  composite), then graded once toward the site's warm register (split RGB → r×1.045+6,
  g×1.005+2, b×0.93 → Color 0.82 → Contrast 1.04), progressive JPEG, long edge ≤ 1800.
- No photograph is repeated across the page. One plate (`horizontal-boring`) is byte-identical
  to `projects/horizontal-boring.jpg` — the same documentary photograph published on the
  project record it belongs to (Bhutani Infra 33 kV, DOC A p11); on About it is used as the
  "boring at the building interface" process plate. This is the only intentional cross-page
  reuse and is flagged in the code registry's provenance note.
- The registry that consumes these files is `src/lib/about-media.ts`; components never
  hardcode image paths.
- When the client sends print-quality photography, replace 1:1 by filename — no code change.
