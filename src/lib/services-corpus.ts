/**
 * VERIFIED SERVICE CORPUS — the audited fallback for the Capabilities page
 * (THE ENGINE ROOM).
 *
 * Source of truth for the 11 services + 2 practices:
 *   supabase/migrations/20260903120100_phase6b_entities_seeds.sql
 *   (names, slugs, taglines, standfirsts, overviews, included lists, icons,
 *   source_refs transcribed verbatim — no invented rows. The seed marks
 *   every row is_active=false pending client wording review; the corpus
 *   carries the same 11 rows so the published surface shows the canonical
 *   taxonomy, exactly as the Contact page's capability index already does.)
 * Source of truth for the HDD fleet + equipment register:
 *   the same migration's equipment inserts (DOC A p11 / DOC C p5 —
 *   Practice 01 rows, count-free per Phase 1 §2.4).
 * Source of truth for service↔project↔sector relationships:
 *   the published archive rows in src/lib/project-corpus.ts (the 49
 *   verified records). A relationship exists ONLY where a published
 *   record's own `services` field names the service — never inferred from
 *   client names, sector vibes or service similarity. The four documented
 *   slugs are the only ones with relationships today; every other service
 *   renders the honest "on the register, records pending publication" state.
 *
 * When the Phase 6/7 entity tables are applied to the live database,
 * site-data.ts reads them FIRST (RLS enforces the verified+active matrix)
 * and this module stops being used — same contract as PROJECT_CORPUS.
 */

import { PROJECT_CORPUS, type ProjectRecord } from "@/lib/project-corpus";

export type ServiceRecord = {
  /** Register index — the migration's sort_order. */
  n: number;
  name: string;
  slug: string;
  /** The migration's tagline — the discipline's short register word. */
  tagline: string | null;
  /** The migration's standfirst — the discipline's own scope line. */
  standfirst: string;
  /** The migration's overview — verified long copy. */
  overview: string;
  /** The migration's included list — scope items, verbatim. */
  included: string[];
  practice: 1 | 2;
  source_ref: string;
  /** Atmosphere frame — reference material keyed by slug. */
  plate: string;
  /** Art-directed crop for the hover plate (reference imagery, reused with intent). */
  platePosition: string;
  /** Plate subject for alt text — what the reference frame shows. */
  plateAlt: string;
  /** Published project records naming this service (archive order). */
  projects: ProjectRecord[];
  /** Sectors documented on those records (deduped, archive order). */
  sectors: { name: string; slug: string }[];
  /** Places documented on those records (deduped). */
  places: string[];
  /** Documented metric of the first record, if any — the figure of record. */
  figure: string | null;
};

export type PracticeRecord = {
  number: 1 | 2;
  /** The room's editorial title — matches the site-wide two-worlds naming. */
  world: "below" | "within";
  name: string;
  short_label: string;
  slug: string;
  /** The migration's scope_line — verified description. */
  scope_line: string;
  source_ref: string;
  /** Atmosphere plate for the practice room. */
  plate: string;
  plateAlt: string;
  services: ServiceRecord[];
  /** Published archive records under this practice. */
  projectCount: number;
};

/**
 * Atmosphere frames — all third-party reference imagery (see
 * public/uploads/capabilities/SOURCES.md), plus the established
 * service-*.jpg frames shared with the locked homepage/Projects surfaces.
 * Reused with different crops where a discipline has no dedicated frame —
 * never a meaningless per-service gallery.
 */
const PLATE = {
  ug: "/uploads/service-ug.jpg",
  electrical: "/uploads/service-electrical.jpg",
  cleanroom: "/uploads/service-cleanroom.jpg",
  fire: "/uploads/service-fire.jpg",
  tunnel: "/uploads/capabilities/cable-tunnel.jpg",
  gasTrench: "/uploads/capabilities/gas-trench.jpg",
  substation: "/uploads/capabilities/substation-build.jpg",
  hddRig: "/uploads/capabilities/hdd-rig-drillto.jpg",
  sprinkler: "/uploads/capabilities/sprinkler-ceiling.jpg",
  cleanroomLab: "/uploads/capabilities/cleanroom-lab.jpg",
  plantRoom: "/uploads/about/plant-room.jpg",
} as const;

/** The 11 services — transcribed verbatim from phase6b_entities_seeds. */
const SERVICE_ROWS: Omit<ServiceRecord, "projects" | "sectors" | "places" | "figure">[] = [
  {
    n: 1,
    name: "UG HT/LT Cable Laying",
    slug: "ug-ht-lt-cable-laying",
    tagline: "Underground Power Networks",
    standfirst:
      "Underground 11 kV, 33 kV and 220 kV cable laying including trenching, ducting, jointing and reinstatement.",
    overview:
      "Underground HT/LT cable laying for smart-city and metro connectivity programmes, delivered turnkey: supply, installation, testing and commissioning.",
    included: ["Trenching", "Ducting", "Cable laying", "Jointing", "Reinstatement"],
    practice: 1,
    source_ref: "DOC A §2 / DOC C p8",
    plate: PLATE.ug,
    platePosition: "object-[50%_38%]",
    plateAlt:
      "Underground cable works in an open trench — reference imagery, not a documented Capex project",
  },
  {
    n: 2,
    name: "CGD Networks — MDPE & Steel",
    slug: "cgd-networks",
    tagline: "City Gas Distribution",
    standfirst:
      "City gas distribution networks — MDPE and steel gas mains with HDPE/MDPE pipeline installation, trenching, jointing and reinstatement.",
    overview:
      "City gas distribution networks: MDPE and steel gas mains, house and industry connections, and last-mile connectivity for gas utilities.",
    included: [
      "MDPE mains",
      "Steel mains",
      "HDPE/MDPE pipeline installation",
      "Trenching",
      "Jointing",
      "Reinstatement",
    ],
    practice: 1,
    source_ref: "DOC A §2 / DOC C",
    plate: PLATE.gasTrench,
    platePosition: "object-[62%_58%]",
    plateAlt: "Gas main laid in an open trench — reference imagery, not a documented Capex project",
  },
  {
    n: 3,
    name: "LMC Works",
    slug: "lmc-works",
    tagline: "Last-Mile Connectivity",
    standfirst: "Last-mile connectivity: house and industry gas connections at program scale.",
    overview:
      "LMC (last-mile connectivity) works — house and industry connections demonstrated at 5,000-connection scale at Sangli.",
    included: ["House connections", "Industry connections", "Network tie-ins"],
    practice: 1,
    source_ref: "DOC A §2 / DOC C p8",
    plate: PLATE.gasTrench,
    platePosition: "object-[30%_72%]",
    plateAlt:
      "Utility connection pipework in a trench — reference imagery, not a documented Capex project",
  },
  {
    n: 4,
    name: "33/11 kV Substation Construction & Erection",
    slug: "substation-construction",
    tagline: "Sub-Stations",
    standfirst:
      "Construction and erection of 33/11 kV sub-stations, complete with panel installation and commissioning.",
    overview:
      "Construction and erection of 33/11 kV sub-stations, complete with panel installation and commissioning.",
    included: ["Structure erection", "Panel installation", "Commissioning"],
    practice: 1,
    source_ref: "DOC A §2",
    plate: PLATE.substation,
    platePosition: "object-[50%_46%]",
    plateAlt:
      "Distribution substation under construction — reference imagery, not a documented Capex project",
  },
  {
    n: 5,
    name: "HDD & Trenchless Works",
    slug: "hdd-trenchless",
    tagline: "Trenchless Crossing",
    standfirst:
      "Horizontal directional drilling with an owned Drillto fleet up to 32-tonne pullback.",
    overview:
      "Horizontal directional drilling with an owned Drillto fleet (32 t, 28 t, 20 t rigs) — trenchless crossings up to 32-tonne pullback capability.",
    included: ["HDD crossings", "Drillto 32/28/20 t fleet", "Winch up to 250 m"],
    practice: 1,
    source_ref: "DOC A p11-p12 / DOC C p5",
    plate: PLATE.hddRig,
    platePosition: "object-[56%_50%]",
    plateAlt:
      "Drillto horizontal directional drilling rig — reference imagery, not Capex-owned equipment",
  },
  {
    n: 6,
    name: "HVAC Systems",
    slug: "hvac-systems",
    tagline: "Climate Engineering",
    standfirst:
      "Centralized HVAC systems — chillers, AHUs, ducting — delivered turnkey with testing and commissioning.",
    overview:
      "HVAC system design, supply, installation, testing and commissioning for corporate, retail, industrial and hospitality projects. Largest single installation on record: 4,000 TR at World Trade Tower, Noida.",
    included: ["Chillers", "AHU plants", "Ducting", "Air & water balancing"],
    practice: 2,
    source_ref: "DOC A §3 / DOC B p3",
    plate: PLATE.plantRoom,
    platePosition: "object-[42%_52%]",
    plateAlt: "Chiller plant room ductwork — reference imagery, not a documented Capex project",
  },
  {
    n: 7,
    name: "VRV / VRF Systems",
    slug: "vrv-vrf-systems",
    tagline: "Precision Cooling",
    standfirst:
      "Variable refrigerant volume systems for offices, hotels and residences with centralized and zoned control.",
    overview:
      "VRV/VRF systems with centralized and zoned control for offices, hotels and residences.",
    included: ["Outdoor & indoor units", "Refrigerant piping", "Centralized controllers"],
    practice: 2,
    source_ref: "DOC B p3",
    plate: PLATE.plantRoom,
    platePosition: "object-[70%_66%]",
    plateAlt:
      "Mechanical plant equipment detail — reference imagery, not a documented Capex project",
  },
  {
    n: 8,
    name: "Fire Fighting & Hydrant / Sprinkler Systems",
    slug: "fire-fighting-hydrant",
    tagline: "Life Safety",
    standfirst:
      "Turnkey fire protection — hydrant networks, sprinklers, wet risers and pump rooms engineered to national codes.",
    overview:
      "Fire fighting and hydrant/sprinkler systems delivered turnkey; 22 documented installations across Noida, New Delhi, Gurugram, Ghaziabad and Jaipur.",
    included: ["Hydrant networks", "Sprinkler systems", "Wet risers", "Pump rooms"],
    practice: 2,
    source_ref: "DOC A p17 / DOC B p10",
    plate: PLATE.sprinkler,
    platePosition: "object-[50%_54%]",
    plateAlt:
      "Fire-protection sprinklers being installed in a ceiling — reference imagery, not a documented Capex project",
  },
  {
    n: 9,
    name: "Clean Rooms — Hospital",
    slug: "clean-rooms",
    tagline: "Controlled Environments",
    standfirst:
      "Hospital, pharmaceutical and laboratory clean rooms with HEPA filtration and pressure control.",
    overview:
      "Clean rooms for hospitals and controlled environments with HEPA filtration, laminar flow and pressure cascade.",
    included: ["HEPA filtration", "Laminar flow", "Pressure cascade", "Validation support"],
    practice: 2,
    source_ref: "DOC B p3 (Clean Room – Hospital)",
    plate: PLATE.cleanroomLab,
    platePosition: "object-[50%_42%]",
    plateAlt:
      "Cleanroom interior with filtered ceiling — reference imagery, not a documented Capex project",
  },
  {
    n: 10,
    name: "MEP Services",
    slug: "mep-services",
    tagline: "Integrated MEP",
    standfirst:
      "Mechanical, electrical and plumbing execution as a single accountable partner — from BOQ to commissioning.",
    overview:
      "MEP services delivered on a turnkey basis — supply, installation, testing & commissioning — for both practices.",
    included: [
      "Design & BOQ",
      "Multi-trade execution",
      "Testing & commissioning",
      "Handover support",
    ],
    practice: 2,
    source_ref: "DOC A p5 (listed under both practices)",
    plate: PLATE.tunnel,
    platePosition: "object-[46%_60%]",
    plateAlt:
      "Services corridor carrying cable racks — reference imagery, not a documented Capex project",
  },
  {
    n: 11,
    name: "Testing & Commissioning",
    slug: "testing-commissioning",
    tagline: "Commissioning Rigor",
    standfirst:
      "Ten named testing & commissioning services from air & water balancing to pre-construction plan review.",
    overview:
      "Testing & commissioning: air & water balancing, functional performance testing, control system verification, HVAC commissioning, cleanroom testing, sound & vibration, fume hood, duct leakage, cooling tower performance and pre-construction plan review.",
    included: [
      "Air & water balancing",
      "Functional performance testing",
      "Cleanroom testing",
      "Duct leakage testing",
    ],
    practice: 2,
    source_ref: "DOC A p15 / DOC B p6",
    plate: PLATE.electrical,
    platePosition: "object-[50%_50%]",
    plateAlt: "Electrical engineering detail — reference imagery, not a documented Capex project",
  },
];

function figureOfRecord(p: ProjectRecord): string | null {
  const m = p.metrics[0];
  return m ? `${m.value}${m.unit ? ` ${m.unit}` : ""}` : null;
}

/** Join each service to the published archive's own records — the only
 *  relationship source. No inference, no cross-contamination. */
function buildService(row: (typeof SERVICE_ROWS)[number]): ServiceRecord {
  const projects = PROJECT_CORPUS.filter((p) => p.services.some((s) => s.slug === row.slug));
  const sectors = [...new Map(projects.flatMap((p) => p.sectors).map((s) => [s.slug, s])).values()];
  const places = [...new Set(projects.map((p) => `${p.city}, ${p.state}`))];
  return {
    ...row,
    projects,
    sectors,
    places,
    figure: projects[0] ? figureOfRecord(projects[0]) : null,
  };
}

/** The two practices — scope lines verbatim from phase6b_entities_seeds. */
const PRACTICE_ROWS: Omit<PracticeRecord, "services" | "projectCount">[] = [
  {
    number: 1,
    world: "below",
    name: "UG Utilities, Electrical & CGD",
    short_label: "UG Utilities & Electrical",
    slug: "ug-utilities-electrical",
    scope_line:
      "Underground HT/LT cable networks, city gas distribution, last-mile connections, 33/11 kV substations and HDD trenchless works.",
    source_ref: "DOC A p5 — Practice One",
    plate: PLATE.tunnel,
    plateAlt: "Underground services corridor — reference imagery, not a documented Capex project",
  },
  {
    number: 2,
    world: "within",
    name: "MEP, Fire Fighting & Fire Protection",
    short_label: "MEP, HVAC & Fire",
    slug: "mep-fire-protection",
    scope_line:
      "HVAC, VRV, clean rooms, fire fighting & hydrant systems and MEP services with testing, commissioning and SLA-backed service.",
    source_ref: "DOC A p5 — Practice Two",
    plate: PLATE.plantRoom,
    plateAlt: "Chiller plant room ductwork — reference imagery, not a documented Capex project",
  },
];

/** The register — all 11 verified services, migration order. */
export const SERVICE_CORPUS: ServiceRecord[] = SERVICE_ROWS.map(buildService);

/** The two practices, each with its services + published archive count. */
export const PRACTICE_CORPUS: PracticeRecord[] = PRACTICE_ROWS.map((row) => ({
  ...row,
  services: SERVICE_CORPUS.filter((s) => s.practice === row.number),
  projectCount: PROJECT_CORPUS.filter((p) => p.practice === row.number).length,
}));

/** Lookup one service by slug (or null — callers decide how to 404). */
export function findServiceCorpus(slug: string): ServiceRecord | null {
  return SERVICE_CORPUS.find((s) => s.slug === slug) ?? null;
}

/** Lookup one practice by slug (or null). */
export function findPracticeCorpus(slug: string): PracticeRecord | null {
  return PRACTICE_CORPUS.find((p) => p.slug === slug) ?? null;
}

/**
 * The physical register — Practice 01's equipment list, verbatim from the
 * migration (DOC A p11 / DOC C p5). Unit counts are now carried: the
 * 2026-09-08 PDF re-audit re-read the two-column layout by row position
 * (quantity block and item block share the same baseline row), resolving
 * the Phase 1 §2.4 ambiguity — each pair below is the source's own row.
 */
export const EQUIPMENT_REGISTER: { item: string; spec: string | null; qty?: string }[] = [
  { item: "Drillto HDD Machine", spec: "32-tonne pullback", qty: "02" },
  { item: "Drillto HDD Machine", spec: "28-tonne pullback", qty: "02" },
  { item: "Drillto HDD Machine", spec: "20-tonne pullback", qty: "03" },
  { item: "Winch Machine", spec: "up to 250 m", qty: "02" },
  { item: "Butt Fusion Machine", spec: null, qty: "04" },
  { item: "HDPE Pipe Jointing Machine", spec: null, qty: "08" },
  { item: "Electric Welding Set", spec: null, qty: "05" },
  { item: "Threading Machine", spec: null, qty: "12" },
  { item: "Drilling Machine", spec: null, qty: "16" },
  { item: "Gas Cutter", spec: null, qty: "04" },
  { item: "Tractors with Tankers", spec: null, qty: "06" },
  { item: "Mud Mixing Machine", spec: null, qty: "02" },
  { item: "Generator", spec: null, qty: "06" },
  { item: "JCB", spec: null, qty: "01" },
  { item: "Air Pressure Compressor", spec: null, qty: "03" },
  {
    item: "Measuring Instruments",
    spec: "Vernier calipers, screw gauge, spirit level, tapes",
  },
];

/** The Drillto trenchless fleet — the three pullback classes, for the oversized numeral. */
export const HDD_FLEET: { tonnes: number }[] = [{ tonnes: 32 }, { tonnes: 28 }, { tonnes: 20 }];

export const SERVICES_SOURCE_NOTE =
  "Service register transcribed from the Phase 6B entity seeds (DOC A §2/p5/p11-12/p15/p17, DOC B p3/p6/p10, DOC C); project relationships from the published archive corpus.";
