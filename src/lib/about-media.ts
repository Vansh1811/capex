/**
 * ABOUT MEDIA REGISTRY — the single mapping of every About-section image to
 * its asset and provenance.
 *
 * Rules (About rebuild, 2026-09-14):
 *  - Every plate is REAL Capex photography extracted from the three
 *    client-supplied profile PDFs (see public/uploads/about-capex/SOURCES.md).
 *    No reference/stock/AI imagery is used on the About page.
 *  - No plate is repeated across the page; each entry is consumed by exactly
 *    one section. (`boring-interface` is byte-identical to the Projects
 *    registry's `horizontal-boring` — the same documented photograph on its
 *    own project record; that cross-page reuse is intentional and flagged.)
 *  - Components consume `aboutPlate(key)`; nobody hardcodes paths.
 */

export type AboutPlate = {
  /** Asset path under /public. */
  src: string;
  /** Provenance: source PDF · page. */
  source: string;
  /** Meaningful, honest alt text. */
  alt: string;
  /** Small caption fragment — what the frame documents. */
  caption: string;
};

const PLATES: Record<string, AboutPlate> = {
  "substation-erection": {
    src: "/uploads/about-capex/substation-erection.jpg",
    source: "Company profile, p4 — sub-station erection",
    alt: "Capex crew erecting a sub-station — site photograph from the company profile",
    caption: "Sub-station erection · company record",
  },
  "hdd-drilling": {
    src: "/uploads/about-capex/hdd-drilling.jpg",
    source: "Company profile, p4 — horizontal directional drilling",
    alt: "Capex horizontal directional drilling rig and crew at work on a site",
    caption: "Horizontal directional drilling · company record",
  },
  "pipeline-laying": {
    src: "/uploads/about-capex/pipeline-laying.jpg",
    source: "Company profile, p4 — cross-country pipeline laying",
    alt: "Capex cross-country pipeline laying in an open trench",
    caption: "Cross-country pipeline laying · company record",
  },
  "hvac-plant-install": {
    src: "/uploads/about-capex/hvac-plant-install.jpg",
    source: "Company profile, p4 — HVAC plant installation",
    alt: "Capex HVAC plant installation inside a building",
    caption: "HVAC plant installation · company record",
  },
  "below-the-street": {
    src: "/uploads/about-capex/below-the-street.jpg",
    source: "Electrical & CGD profile, p4 — HDD site operations",
    alt: "Capex HDD rig and site operations beneath an urban street",
    caption: "Trenchless operations · site record",
  },
  "within-the-building": {
    src: "/uploads/about-capex/within-the-building.jpg",
    source: "Company profile, p16 — roof-top chiller and AHU plant (captioned)",
    alt: "Roof-top chiller and AHU plant installed by Capex",
    caption: "Roof-top chiller & AHU plant · company record",
  },
  "ug-trench": {
    src: "/uploads/about-capex/ug-trench.jpg",
    source: "Electrical & CGD profile, p5 — gallery",
    alt: "Open utility trench with laid pipe on a Capex site",
    caption: "Utility trench · site record",
  },
  "hdd-rig-ops": {
    src: "/uploads/about-capex/hdd-rig-ops.jpg",
    source: "Electrical & CGD profile, p18 — HDD rig at work",
    alt: "Capex HDD drilling rig deployed on a utility crossing",
    caption: "Drillto HDD rig on the documented register · site record",
  },
  "boring-interface": {
    src: "/uploads/about-capex/boring-interface.jpg",
    source: "Company profile, p11 — horizontal boring at the building interface (captioned)",
    alt: "Horizontal boring at the building interface by Capex",
    caption: "Boring at the building interface · scope record",
  },
  "substation-build": {
    src: "/uploads/about-capex/substation-build.jpg",
    source: "Company profile, p11 — sub-station construction (captioned)",
    alt: "Capex sub-station construction with panel installation",
    caption: "33/11 kV sub-station construction · scope record",
  },
  "wtt-flagship": {
    src: "/uploads/about-capex/wtt-flagship.jpg",
    source: "Company profile, p16 — World Trade Tower, Noida (captioned: 4000 TR)",
    alt: "World Trade Tower, Noida — Capex's largest single HVAC installation at 4000 TR",
    caption: "World Trade Tower, Noida · 4,000 TR · company record",
  },
  "site-team": {
    src: "/uploads/about-capex/site-team.jpg",
    source: "Electrical & CGD profile, p5 — site crew, gallery",
    alt: "Capex site crew working on a utility installation",
    caption: "Site crew · company record",
  },
  "field-work": {
    src: "/uploads/about-capex/field-work.jpg",
    source: "Electrical & CGD profile, p5 — field work, gallery",
    alt: "Field work on a Capex utility site",
    caption: "Field work · company record",
  },
  "pipeline-work": {
    src: "/uploads/about-capex/pipeline-work.jpg",
    source: "Electrical & CGD profile, p18 — pipeline work",
    alt: "Pipeline work on a Capex utility site",
    caption: "Pipeline work · site record",
  },
  "hvac-detail": {
    src: "/uploads/about-capex/hvac-detail.jpg",
    source: "HVAC & fire profile, p3 — HVAC system installation",
    alt: "Detail of a Capex HVAC system installation",
    caption: "HVAC installation · practice record",
  },
  "firefitting-detail": {
    src: "/uploads/about-capex/firefitting-detail.jpg",
    source: "HVAC & fire profile, p3 — fire-fighting & hydrant system",
    alt: "Detail of a Capex fire-fighting and hydrant installation",
    caption: "Fire-fighting & hydrant system · practice record",
  },
  "safety-site": {
    src: "/uploads/about-capex/safety-site.jpg",
    source: "HVAC & fire profile, p6 — safety procedures",
    alt: "Capex site work under the company safety regime",
    caption: "One safety regime, every site · company record",
  },
  "team-boards": {
    src: "/uploads/about-capex/team-boards.jpg",
    source: "HVAC & fire profile, p4 — management team",
    alt: "The Capex management boards — directors with the practice patron, financial advisor and senior project manager",
    caption: "The boards · company record",
  },
};

export function aboutPlate(key: keyof typeof PLATES | string): AboutPlate {
  const plate = PLATES[key];
  if (!plate) throw new Error(`about-media: unknown plate key "${key}"`);
  return plate;
}
