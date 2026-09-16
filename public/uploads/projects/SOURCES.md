# Projects — project media registry (client-supplied PDF photography)

All frames in this directory are **real Capex site and works photography extracted from the
three client-supplied company profile PDFs** (DOC A "Capex Construction & Engineering —
Company Profile", DOC B "Capex-Profile (12 Pages) ff" — HVAC & fire protection profile,
DOC C "Capex Profile for Electrical and CGD" — UG utilities profile). They are the only
imagery on the Projects pages that depicts actual Capex work and equipment.

Provenance rule (the registry in `src/lib/project-media.ts` encodes it): every plate carries
`sourceType: PDF_EXTRACTED` with a source reference. The four legacy atmosphere frames
(`/uploads/service-*.jpg`) may still be used where a record has no PDF plate that matches its
discipline — always with the "Reference imagery" caption. A `REFERENCE` plate is never
published as `PDF_EXTRACTED` or vice versa.

| File                   | Subject                                                  | Source                                 | Notes                                        |
| ---------------------- | -------------------------------------------------------- | -------------------------------------- | -------------------------------------------- |
| wtt-chiller-plant.jpg  | Roof-top chiller and AHU plant                           | DOC A p16 (captioned)                  | World Trade Tower, Noida — 4,000 TR flagship |
| wtt-booster-set.jpg    | Hydrant and sprinkler booster set                        | DOC A p16 (captioned)                  | World Trade Tower, Noida                     |
| wtt-atrium.jpg         | Retail atrium — ventilation & hydrant coverage           | DOC A p16 (captioned)                  | WTT programme                                |
| hvac-cover.jpg         | HVAC plant installation                                  | DOC B p1 (cover)                       | HVAC & FF profile cover photograph           |
| cleanroom-hvac.jpg     | Clean-room HVAC installation                             | DOC B p1 (beside "Clean Room" caption) |                                              |
| ug-execution.jpg       | Underground utility & CGD execution                      | DOC A p10                              | Section 2 opening photograph                 |
| commissioning.jpg      | Testing & commissioning — functional performance testing | DOC A p13                              |                                              |
| mdpe-gas-main.jpg      | MDPE gas main laying                                     | DOC A p11 (captioned)                  | Scope-of-work strip                          |
| panel-installation.jpg | HT/LT panel installation                                 | DOC A p11 (captioned)                  | Scope-of-work strip                          |
| duct-cable.jpg         | Underground duct & cable work                            | DOC A p11 (captioned)                  | Scope-of-work strip                          |
| horizontal-boring.jpg  | Horizontal boring at building interface                  | DOC A p11 (captioned)                  | Scope-of-work strip                          |
| cgd-site.jpg           | UG utility & CGD execution — site photograph             | DOC C p6                               | Section 2 opening photograph                 |
| hdd-dark.jpg           | HDD drilling operation (dark frame)                      | DOC C p5                               | Scope-of-work page                           |
| hdd-ops.jpg            | HDD rig and site operations                              | DOC C p5                               | Scope-of-work page                           |
| site-detail-1.jpg      | UG utility site photograph                               | DOC C p5                               | Scope-of-work page                           |
| site-detail-2.jpg      | Pipeline site photograph                                 | DOC C p5                               | Scope-of-work page                           |
| site-detail-3.jpg      | UG utilities site photograph                             | DOC C p5                               | Scope-of-work page                           |
| gallery-mdpe.jpg       | Project gallery — gas main work                          | DOC A p12 §2.5 (gallery cell)          | Captionless gallery photo                    |
| gallery-trench.jpg     | Project gallery — trench work                            | DOC A p12 §2.5 (gallery cell)          | Captionless gallery photo                    |

## Notes

- Extracted at native PDF resolution, graded once toward the site's warm register
  (split RGB → r×1.045+6, g×1.005+2, b×0.93 → Color 0.82 → Contrast 1.04), progressive
  JPEG q80. Long edge capped at 1600.
- The DOC A p12 gallery montage was sliced into individual photos; only cells ≥ ~350px on
  their long edge were kept. Captionless gallery cells are identified by subject, not by
  any client/project claim.
- When the client sends print-quality project photography, replace 1:1 by filename and the
  registry's `sourceType` moves to `CAPEX_REAL` with no layout change.
