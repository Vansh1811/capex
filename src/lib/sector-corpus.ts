/**
 * VERIFIED SECTOR CORPUS — the audited fallback for the Sectors atlas.
 *
 * Source of truth for sector rows:
 *   supabase/migrations/20260903120100_phase6b_entities_seeds.sql
 *   (9 sectors, P3 §5.3 evidence tiers — names, slugs, tiers, standfirsts,
 *   source_refs transcribed verbatim; no invented rows).
 * Source of truth for project↔sector relationships:
 *   supabase/migrations/20260903120300_phase6i_project_corpus.sql
 *   (published archive rows only — the same 49 records PROJECT_CORPUS carries,
 *   so every relationship is document-backed; no sector link is inferred from
 *   visual similarity or client-name guesswork).
 *
 * Service lists per sector derive from the projects' own verified `services`
 * fields (aggregated + capped). Plate imagery is reference material keyed by
 * slug — swap the file, keep the key, when approved photography arrives.
 *
 * When the Phase 6/7 entity tables are applied to the live database,
 * site-data.ts reads them FIRST (RLS enforces the verified+active matrix)
 * and this module stops being used — same contract as PROJECT_CORPUS.
 */

import { PROJECT_CORPUS, type ProjectRecord } from "@/lib/project-corpus";

export type SectorTier = "hub" | "service_led" | "list_only";

export type SectorRecord = {
  /** Atlas number — the migration's sort_order. */
  n: number;
  name: string;
  slug: string;
  evidence_tier: SectorTier;
  /** From the migration's standfirst — null for list_only rows. */
  standfirst: string | null;
  source_ref: string;
  /** Reference atmosphere plate, by slug → /uploads/sectors/<slug>.jpg. */
  plate: string;
  /** Verified related projects, in archive order. */
  projects: ProjectRecord[];
  /** Services appearing on those projects (deduped, archive order). */
  services: { name: string; slug: string }[];
  /** Places appearing on those projects (deduped, archive order). */
  places: string[];
  /** Practice numbers present on those projects. */
  practices: number[];
};

/** Atmosphere plates — all third-party reference imagery, never Capex work. */
export const SECTOR_PLATE: Record<string, string> = {
  "smart-city-metro": "/uploads/sectors/smart-city-metro.jpg",
  "oil-gas-cgd": "/uploads/sectors/oil-gas-cgd.jpg",
  "corporate-commercial": "/uploads/sectors/corporate-commercial.jpg",
  "healthcare-hospitals": "/uploads/sectors/healthcare-hospitals.jpg",
  "industrial-manufacturing": "/uploads/sectors/industrial-manufacturing.jpg",
  education: "/uploads/sectors/education.jpg",
  "hotels-hospitality": "/uploads/sectors/hotels-hospitality.jpg",
  "residential-townships": "/uploads/sectors/residential-townships.jpg",
  "public-sector": "/uploads/sectors/public-sector.jpg",
};

/** Sector rows — transcribed from phase6b entities_seeds (verbatim). */
const SECTOR_ROWS: Omit<SectorRecord, "projects" | "services" | "places" | "practices">[] = [
  {
    n: 1,
    name: "Smart-City & Metro Infrastructure",
    slug: "smart-city-metro",
    evidence_tier: "hub",
    standfirst:
      "Smart-city electrical programs and metro connectivity across Patna, Banaras, Lucknow and Gurugram.",
    source_ref: "DOC C p8",
    plate: SECTOR_PLATE["smart-city-metro"],
  },
  {
    n: 2,
    name: "Oil, Gas & CGD Utilities",
    slug: "oil-gas-cgd",
    evidence_tier: "hub",
    standfirst:
      "City gas distribution networks and last-mile connections for BGRL and allied gas utilities.",
    source_ref: "DOC C p8 / Phase 1 §3",
    plate: SECTOR_PLATE["oil-gas-cgd"],
  },
  {
    n: 3,
    name: "Corporate & Commercial Real Estate",
    slug: "corporate-commercial",
    evidence_tier: "hub",
    standfirst:
      "HVAC, fire protection and MEP installations for corporates, offices, retail and commercial spaces.",
    source_ref: "DOC B pp.8-9 / DOC A p14",
    plate: SECTOR_PLATE["corporate-commercial"],
  },
  {
    n: 4,
    name: "Healthcare & Hospitals",
    slug: "healthcare-hospitals",
    evidence_tier: "service_led",
    standfirst: "Clean room capability and hospital-sector HVAC — service-led framing.",
    source_ref: "DOC A p14 / DOC B p3",
    plate: SECTOR_PLATE["healthcare-hospitals"],
  },
  {
    n: 5,
    name: "Industrial & Manufacturing",
    slug: "industrial-manufacturing",
    evidence_tier: "hub",
    standfirst: "HVAC and electrical works for manufacturing plants and industrial clients.",
    source_ref: "DOC A p14 / DOC B pp.8-9",
    plate: SECTOR_PLATE["industrial-manufacturing"],
  },
  {
    n: 6,
    name: "Education",
    slug: "education",
    evidence_tier: "list_only",
    standfirst: null,
    source_ref: "DOC A p14 (Educational Institutions)",
    plate: SECTOR_PLATE.education,
  },
  {
    n: 7,
    name: "Hotels & Hospitality",
    slug: "hotels-hospitality",
    evidence_tier: "list_only",
    standfirst: null,
    source_ref: "DOC A p14",
    plate: SECTOR_PLATE["hotels-hospitality"],
  },
  {
    n: 8,
    name: "Residential Townships",
    slug: "residential-townships",
    evidence_tier: "list_only",
    standfirst: null,
    source_ref: "DOC A p14",
    plate: SECTOR_PLATE["residential-townships"],
  },
  {
    n: 9,
    name: "Public Sector (PSU)",
    slug: "public-sector",
    evidence_tier: "list_only",
    standfirst: null,
    source_ref: "DOC A p4 (Public Sector Organizations)",
    plate: SECTOR_PLATE["public-sector"],
  },
];

function buildSector(row: (typeof SECTOR_ROWS)[number]): SectorRecord {
  // Projects carry the relationship; the sector takes only what its own
  // records actually reference. No inference, no cross-contamination.
  const projects = PROJECT_CORPUS.filter((p) => p.sectors.some((s) => s.slug === row.slug));
  const services = [
    ...new Map(projects.flatMap((p) => p.services).map((s) => [s.slug, s])).values(),
  ];
  const places = [...new Set(projects.map((p) => `${p.city}, ${p.state}`))];
  const practices = [...new Set(projects.map((p) => p.practice))];
  return { ...row, projects, services, places, practices };
}

/** The atlas — all 9 verified sector rows, migration order. */
export const SECTOR_CORPUS: SectorRecord[] = SECTOR_ROWS.map(buildSector);

/** Lookup one sector by slug (or null — callers decide how to 404). */
export function findSectorCorpus(slug: string): SectorRecord | null {
  return SECTOR_CORPUS.find((s) => s.slug === slug) ?? null;
}
