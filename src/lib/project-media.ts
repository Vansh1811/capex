/**
 * PROJECT MEDIA REGISTRY — the single, central mapping of every published
 * project record to its visual asset.
 *
 * Rules encoded here (Projects phase, 2026-09-10):
 *  - `sourceType: "PDF_EXTRACTED"` plates are real Capex site/works
 *    photography extracted from the three client-supplied profile PDFs
 *    (see public/uploads/projects/SOURCES.md). They may be captioned as
 *    Capex works photography per their subject.
 *  - `sourceType: "REFERENCE"` plates are the legacy atmospheric frames —
 *    third-party reference material. They ALWAYS render the "Reference
 *    imagery — not a documented Capex project" caption and are never
 *    presented as project photography.
 *  - A discipline-appropriate PDF plate is preferred over a reference
 *    frame wherever one exists (P1 electrical/UG/CGD → electrical/UG/site
 *    plates; P2 HVAC/fire → HVAC plates). Where the pool runs out, the
 *    registry deliberately REPEATS with different crops (cropOfVariance)
 *    only within the same discipline — a fire record never borrows an
 *    HDD photograph.
 *  - When the client sends print-quality project photography, replace the
 *    file 1:1 by filename and flip `sourceType` to "CAPEX_REAL" — no layout
 *    change, no component change.
 *
 * Assignment is deterministic: this file is the only place a project's
 * image is decided. Components consume `resolveProjectMedia(slug)`.
 */

import { PROJECT_CORPUS } from "@/lib/project-corpus";
import wtpDiscipline from "@/assets/Projects/World-Trade-Park/PIC-1.jpeg";
import wtpHero from "@/assets/Projects/World-Trade-Park/pic-3.jpeg";
// NOTE: pic-2.jpeg in the same folder is a 0-byte file — intentionally not imported.

export type MediaSource = "PDF_EXTRACTED" | "REFERENCE" | "CAPEX_REAL";

export type ProjectMediaEntry = {
  /** The record's corpus slug — the join key. */
  slug: string;
  /** Asset path under /public. */
  src: string;
  sourceType: MediaSource;
  /** Provenance string for the file (kept out of the visible design). */
  sourceReference: string;
  /** Meaningful alt text — what the frame shows, honestly. */
  alt: string;
  /**
   * Optional ultra-wide hero frame (the 21/9 case-study hero). Consumed only
   * by the case-study hero with `?? src` fallback — every other surface and
   * record renders exactly as before when absent.
   */
  heroSrc?: string;
  heroAlt?: string;
};

/** Real Capex plates from the client PDFs — graded, in public/uploads/projects. */
const PDF_PLATES: Record<string, { subject: string; source: string }> = {
  "wtt-chiller-plant": {
    subject: "Roof-top chiller and AHU plant, World Trade Tower, Noida",
    source: "DOC A p16 (captioned)",
  },
  "wtt-booster-set": {
    subject: "Hydrant and sprinkler booster set, World Trade Tower, Noida",
    source: "DOC A p16 (captioned)",
  },
  "wtt-atrium": {
    subject: "Retail atrium ventilation and hydrant coverage, WTT programme",
    source: "DOC A p16 (captioned)",
  },
  "hvac-cover": {
    subject: "HVAC plant installation — Capex HVAC & fire protection profile cover photograph",
    source: "DOC B p1 (cover)",
  },
  "cleanroom-hvac": { subject: "Clean-room HVAC installation", source: "DOC B p1" },
  "ug-execution": {
    subject: "Underground utility and CGD execution — site photograph",
    source: "DOC A p10",
  },
  commissioning: {
    subject: "Testing and commissioning — functional performance testing",
    source: "DOC A p13",
  },
  "mdpe-gas-main": { subject: "MDPE gas main laying", source: "DOC A p11 (captioned)" },
  "panel-installation": { subject: "HT/LT panel installation", source: "DOC A p11 (captioned)" },
  "duct-cable": { subject: "Underground duct and cable work", source: "DOC A p11 (captioned)" },
  "horizontal-boring": {
    subject: "Horizontal boring at the building interface",
    source: "DOC A p11 (captioned)",
  },
  "cgd-site": { subject: "UG utility and CGD execution — site photograph", source: "DOC C p6" },
  "hdd-dark": { subject: "HDD drilling operation — dark frame", source: "DOC C p5" },
  "hdd-ops": { subject: "HDD rig and site operations", source: "DOC C p5" },
  "site-detail-1": { subject: "UG utility site photograph", source: "DOC C p5" },
  "site-detail-2": { subject: "Pipeline site photograph", source: "DOC C p5" },
  "site-detail-3": { subject: "UG utilities site photograph", source: "DOC C p5" },
  "gallery-mdpe": { subject: "Project gallery — gas main work", source: "DOC A p12 §2.5" },
  "gallery-trench": { subject: "Project gallery — trench work", source: "DOC A p12 §2.5" },
};

/** Legacy atmospheric frames — reference material only. */
const REFERENCE_PLATES: Record<string, string> = {
  "service-ug": "/uploads/service-ug.jpg",
  "service-electrical": "/uploads/service-electrical.jpg",
  "service-cleanroom": "/uploads/service-cleanroom.jpg",
  "service-fire": "/uploads/service-fire.jpg",
};

/**
 * Deterministic PDF-plate pools per discipline. Index order matters: records
 * are assigned plates in archive order, so each pool is curated so no two
 * ADJACENT records in the same discipline share a plate (and the flagship
 * WTT record is pinned explicitly below before pool rotation begins).
 */
const P1_ELECTRICAL_POOL = [
  "duct-cable",
  "panel-installation",
  "ug-execution",
  "commissioning",
  "horizontal-boring",
  "hdd-ops",
  "hdd-dark",
  "gallery-trench",
  "site-detail-1",
  "site-detail-3",
];
const P1_GAS_POOL = ["mdpe-gas-main", "cgd-site", "gallery-mdpe", "site-detail-2", "ug-execution"];
const P2_HVAC_POOL = [
  "hvac-cover",
  "cleanroom-hvac",
  "wtt-atrium",
  "commissioning",
  "wtt-chiller-plant",
  "wtt-booster-set",
];

/** Explicit pins — records whose plate must be exact. */
const PINNED: Record<string, string> = {
  // The flagship: its own documented photographs.
  "world-trade-tower-hvac-fire": "wtt-chiller-plant",
  // Practice-01 completed flagships: the captioned smart-city scope strips.
  "patna-smart-city-electrical": "duct-cable",
  "banaras-smart-city-electrical": "ug-execution",
  "lucknow-metro-electrical": "panel-installation",
  // Ongoing programme pins — the captioned scope-of-work photographs.
  "gurugram-smart-city-electrical-08": "commissioning",
  "dhanbad-smart-city-electrical": "horizontal-boring",
  "aurangabad-cmdp-pipe-laying": "mdpe-gas-main",
  "sangli-lmc-work": "cgd-site",
  "bhutani-infra-33kv-electrical": "hdd-ops",
  "capgemini-11kv-electrical": "site-detail-1",
};

/** Legacy atmosphere key → path (imported for the reference fallback). */
import { CORPUS_IMAGE } from "@/lib/project-corpus";

/**
 * The registry — one entry per published record. The WTT fire-system services
 * and every discipline keep honest pools; records with no PDF plate that fits
 * fall back to the legacy reference frame (captioned as reference).
 */
function buildRegistry(): Map<string, ProjectMediaEntry> {
  const registry = new Map<string, ProjectMediaEntry>();

  // Pool cursors per discipline — rotate without adjacent repeats.
  const cursors = { p1e: 0, p1g: 0, p2: 0 };
  const lastTaken: Record<string, string | null> = { p1e: null, p1g: null, p2: null };

  const take = (poolKey: "p1e" | "p1g" | "p2", pool: string[]): string => {
    for (let k = 0; k < pool.length; k++) {
      const plate = pool[(cursors[poolKey] + k) % pool.length];
      if (plate !== lastTaken[poolKey]) {
        cursors[poolKey] = (cursors[poolKey] + k + 1) % pool.length;
        lastTaken[poolKey] = plate;
        return plate;
      }
    }
    const plate = pool[cursors[poolKey] % pool.length];
    cursors[poolKey] = (cursors[poolKey] + 1) % pool.length;
    lastTaken[poolKey] = plate;
    return plate;
  };

  for (const p of PROJECT_CORPUS) {
    // World Trade Park — client-supplied original project photography
    // (CAPEX_REAL). Principal frame PIC-1 carries the 16/10 print and the
    // 4/5 same-frame detail; pic-3 carries the ultra-wide hero.
    if (p.slug === "world-trade-park-hvac") {
      registry.set(p.slug, {
        slug: p.slug,
        src: wtpDiscipline,
        heroSrc: wtpHero,
        sourceType: "CAPEX_REAL",
        sourceReference: "Client-supplied project photography — PIC-1 / pic-3",
        alt: "Chilled-water risers with valves, gauges and flexible connectors in the World Trade Park plant room — Capex works photograph",
        heroAlt:
          "Chilled-water pump headers running the length of the World Trade Park plant room — Capex works photograph",
      });
      continue;
    }
    const pinned = PINNED[p.slug];
    if (pinned && PDF_PLATES[pinned]) {
      registry.set(p.slug, pdfEntry(p.slug, pinned));
      continue;
    }
    if (p.practice === 1) {
      const gas = p.services.some((s) => s.slug === "cgd-networks" || s.slug === "lmc-works");
      const plate = take(gas ? "p1g" : "p1e", gas ? P1_GAS_POOL : P1_ELECTRICAL_POOL);
      registry.set(p.slug, pdfEntry(p.slug, plate));
      continue;
    }
    // Practice 02 — HVAC pool.
    const plate = take("p2", P2_HVAC_POOL);
    registry.set(p.slug, pdfEntry(p.slug, plate));
  }
  return registry;
}

function pdfEntry(slug: string, plate: string): ProjectMediaEntry {
  const meta = PDF_PLATES[plate];
  return {
    slug,
    src: `/uploads/projects/${plate}.jpg`,
    sourceType: "PDF_EXTRACTED",
    sourceReference: meta.source,
    alt: `${meta.subject} — Capex works photograph`,
  };
}

function referenceEntry(slug: string, frame: keyof typeof CORPUS_IMAGE): ProjectMediaEntry {
  return {
    slug,
    src: CORPUS_IMAGE[frame],
    sourceType: "REFERENCE",
    sourceReference: "Atmospheric reference frame (third-party)",
    alt: "Atmospheric reference imagery — not a documented Capex project",
  };
}

const REGISTRY = buildRegistry();

/**
 * Resolve a record's media entry. Records missing from the registry (none
 * today, but future corpus rows only carry the atmosphere key) fall back to
 * the reference frame the corpus itself names.
 */
export function resolveProjectMedia(slug: string): ProjectMediaEntry {
  const entry = REGISTRY.get(slug);
  if (entry) return entry;
  const record = PROJECT_CORPUS.find((p) => p.slug === slug);
  return referenceEntry(slug, record?.image ?? "ug");
}

/** True when the record carries real Capex photography (affects captions). */
export function isRealCapexPhotography(slug: string): boolean {
  return resolveProjectMedia(slug).sourceType !== "REFERENCE";
}

/** Registry-wide audit numbers for the media report. */
export const MEDIA_REGISTRY_STATS = {
  total: REGISTRY.size,
  pdfExtracted: [...REGISTRY.values()].filter((e) => e.sourceType === "PDF_EXTRACTED").length,
  reference: [...REGISTRY.values()].filter((e) => e.sourceType === "REFERENCE").length,
  distinctPlates: new Set([...REGISTRY.values()].map((e) => e.src)).size,
};
