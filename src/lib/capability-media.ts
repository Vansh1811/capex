/**
 * CAPABILITY MEDIA REGISTRY — the Capabilities page's single source for the
 * works photography it publishes (audited 2026-10-16 by direct visual
 * inspection of every candidate frame; this registry records what each
 * frame actually shows).
 *
 * Honesty rules (site-wide):
 *  - Every frame referenced here is REAL Capex photography: either
 *    client-supplied project photography (CAPEX_REAL) or plates extracted
 *    from the three client-supplied company profile PDFs (PDF_EXTRACTED —
 *    see public/uploads/projects/SOURCES.md and about-capex/SOURCES.md).
 *  - Frames judged non-photographic on inspection (renders, brochure
 *    graphics, PDF-page crops, montage slices) and third-party reference
 *    imagery are deliberately NOT used here — the previous register's
 *    reference plates are retired from this page.
 *  - Captions state the frame's subject, never a claim: "Capex works
 *    photograph — {subject}".
 *  - No frame is used twice on the page: the nine directory plates, the
 *    equipment frame and the six evidence photos are all distinct files.
 */

export type CapabilityPlate = {
  src: string;
  /** What the frame shows — rendered as the caption subject. */
  subject: string;
  alt: string;
};

const plate = (src: string, subject: string): CapabilityPlate => ({
  src,
  subject,
  alt: `${subject} — Capex works photograph`,
});

/**
 * THE DIRECTORY PLATES — one real frame per discipline, chosen for its
 * subject on visual inspection. Keyed by service slug.
 */
export const CAPABILITY_PLATES: Record<string, CapabilityPlate> = {
  "ug-ht-lt-cable-laying": plate(
    "/uploads/projects/site-detail-3.jpg",
    "Duct coil and cable works in an open excavation",
  ),
  "cgd-networks": plate(
    "/uploads/about-capex/pipeline-laying.jpg",
    "Pipe-laying equipment working along a gas main route",
  ),
  "lmc-works": plate(
    "/uploads/about-capex/field-work.jpg",
    "Site crew reviewing network drawings on site",
  ),
  "substation-construction": plate(
    "/uploads/about-capex/substation-erection.jpg",
    "Sub-station erection on site",
  ),
  "hdd-trenchless": plate(
    "/uploads/about-capex/hdd-rig-ops.jpg",
    "Horizontal directional drilling rig on site",
  ),
  "hvac-systems": plate(
    "/uploads/about-capex/hvac-plant-install.jpg",
    "HVAC plant installation works",
  ),
  "vrv-vrf": plate("/uploads/about-capex/hvac-detail.jpg", "HVAC system installation detail"),
  "fire-fighting-hydrant": plate(
    "/uploads/about-capex/firefitting-detail.jpg",
    "Fire-fighting and hydrant installation detail",
  ),
  "mep-services": plate("/uploads/projects/site-detail-1.jpg", "HT/LT panel room on site"),
};

/**
 * THE EQUIPMENT FRAME (Section D) — the Drillto rig class on the company's
 * own works record (DOC C p5). The fleet numerals beside it are the
 * documented register; the pictured machine is Capex works photography.
 */
export const EQUIPMENT_RIG: CapabilityPlate = plate(
  "/uploads/projects/hdd-dark.jpg",
  "Drillto HDD rig on site (DOC C p5)",
);

/**
 * THE CURATED EVIDENCE SET (Section E) — six published records spanning
 * both practices and both statuses. Every field shown is read from the
 * record itself (src/lib/project-corpus.ts via the archive DTO); `photo`
 * overrides the record's default plate only where visual inspection found
 * a better frame from the SAME record's supplied photography.
 */
export const EVIDENCE_SELECTION: { slug: string; photo?: CapabilityPlate }[] = [
  { slug: "patna-smart-city-electrical" },
  { slug: "lucknow-metro-electrical" },
  { slug: "aurangabad-cmdp-pipe-laying" },
  { slug: "infosys-33kv-electrical" },
  {
    slug: "world-trade-tower-hvac-fire",
    photo: plate(
      "/uploads/projects/wtt-booster-set.jpg",
      "Hydrant and sprinkler booster set, World Trade Tower, Noida (DOC A p16)",
    ),
  },
  { slug: "world-trade-park-hvac" },
];
