/**
 * VERIFIED CLIENT CORPUS — the audited fallback registry.
 *
 * Source of truth: the Phase 6B/7A migration pack, re-verified 2026-09-08
 * against the three client-supplied profile PDFs (coordinate-level audit of
 * the project tables — every note below now carries the figure printed in
 * the source row for that client):
 *   - supabase/migrations/20260903120100_phase6b_entities_seeds.sql
 *     (clients table seed: text-stated associations + DOC B p2 PMC/architects)
 *   - supabase/migrations/20260903130000_phase7a_content_population.sql
 *     §1a/1b: logo-wall brands UPGRADED to verified where a corpus project
 *     record names them (project-table presence = evidence, Phase 1 §5.6);
 *     §9: `update clients set is_active = true where verification_status =
 *     'verified'` — the publication matrix this list applies.
 *
 * Published = verified AND is_active. Logo-wall-only brands with no project
 * record (Infosys, Cadence, Eldeco…) stay needs_client_review and are
 * correctly absent. L&T is verified via DOC C p3/p8 (client on the three
 * smart-city UG records) — the same evidence the migration's project_clients
 * insert encodes. Residential records are anonymized in the corpus and are
 * not a client relationship.
 *
 * 2026-09-08 PDF re-audit corrections: client notes previously carried
 * figures transcribed from adjacent rows (Invenio 60→80 TR, Arkadin 60→70
 * TR, GEBTECH 40 TR→35,000 sq.ft., Noida Towers 150 TR→30,000 sq.ft.,
 * AVNET Noida→New Delhi, Acquisory 20→40 TR, plus vague "HVAC system"
 * notes now given their true figures). Knight Frank added to the PMC set
 * (listed as "Knight Frenk" in DOC B p2). "Synergy-ce Corporate" removed:
 * no such name appears in the PDFs' architect/PMC list — its seed row was
 * an transcription artifact, not a documented association.
 *
 * project links carry the slug of the published corpus record; they render
 * only when that record exists in PROJECT_CORPUS (site-data joins them).
 */

import { PROJECT_CORPUS, type ProjectRecord } from "@/lib/project-corpus";

export type ClientRelationship = "client" | "epc_counterparty" | "pmc" | "architect";

export type ClientRecord = {
  name: string;
  slug: string;
  relationship: ClientRelationship;
  /** One quiet line, verified facts only — never an invented claim. */
  note: string | null;
  /** Corpus project slugs (joined to PROJECT_CORPUS in site-data). */
  projects: string[];
  source_ref: string;
  sort_order: number;
};

export const RELATIONSHIP_LABEL: Record<ClientRelationship, string> = {
  client: "Client",
  epc_counterparty: "EPC counterparty",
  pmc: "PMC association",
  architect: "Architect association",
};

export const RELATIONSHIP_TERMS: Record<ClientRelationship, string> = {
  client: "Direct client",
  epc_counterparty: "EPC counterparty",
  pmc: "Architects / PMC",
  architect: "Architects / PMC",
};

/** Which corpus frame a client with published work reads through. */
function frameFor(slugs: string[]): ProjectRecord["image"] {
  const p = PROJECT_CORPUS.find((r) => slugs.includes(r.slug));
  if (!p) return "ug";
  return p.practice === 1 ? "ug" : "cleanroom";
}

export const CLIENT_CORPUS: ClientRecord[] = [
  // --- direct clients, text-stated + project-record evidence (DOC C p3/p8) ---
  {
    name: "L&T",
    slug: "larsen-toubro",
    relationship: "client",
    note: "Long-term association — smart-city electrical programmes, Patna to Lucknow.",
    projects: [
      "patna-smart-city-electrical",
      "banaras-smart-city-electrical",
      "lucknow-metro-electrical",
    ],
    source_ref: "DOC C p3 (long-term association) / DOC C p8 (project client)",
    sort_order: 1,
  },
  {
    name: "BGRL",
    slug: "bgrl",
    relationship: "client",
    note: "Long-term association — city gas distribution works, Aurangabad & Sangli.",
    projects: ["aurangabad-cmdp-pipe-laying", "sangli-lmc-work"],
    source_ref: "DOC C p3 / DOC C p8 (Aurangabad, Sangli)",
    sort_order: 2,
  },
  {
    name: "IGL",
    slug: "igl",
    relationship: "client",
    note: "Long-term association.",
    projects: [],
    source_ref: "DOC C p3 (long-term association)",
    sort_order: 3,
  },
  {
    name: "BPCL",
    slug: "bpcl",
    relationship: "client",
    note: "Long-term association.",
    projects: [],
    source_ref: "DOC C p3 (long-term association)",
    sort_order: 4,
  },
  {
    name: "JSP Projects Pvt. Ltd.",
    slug: "jsp-projects",
    relationship: "client",
    note: "Dhanbad smart-city electrical work.",
    projects: ["dhanbad-smart-city-electrical"],
    source_ref: "DOC C p3 / DOC C p8 (Dhanbad)",
    sort_order: 5,
  },
  {
    name: "Vichitra Constructions Pvt. Ltd.",
    slug: "vichitra-constructions",
    relationship: "epc_counterparty",
    note: "Contractor counterpart on BGRL city-gas works.",
    projects: [],
    source_ref: "DOC C p3 / DOC C p8 (BGRL contractor)",
    sort_order: 6,
  },
  {
    name: "TATA Projects",
    slug: "tata-projects",
    relationship: "client",
    note: "Gurugram smart-city electrical packages.",
    projects: ["gurugram-smart-city-electrical-08"],
    source_ref: "DOC C p3 / DOC C p8 (Gurugram)",
    sort_order: 7,
  },
  {
    name: "Bhutani Infra",
    slug: "bhutani-infra",
    relationship: "client",
    note: "33 kV electrical work, Noida.",
    projects: ["bhutani-infra-33kv-electrical"],
    source_ref: "DOC C p3 / DOC C p8 (33 kV work)",
    sort_order: 8,
  },
  {
    name: "Creative LLP",
    slug: "creative-llp",
    relationship: "client",
    note: "Long-term association.",
    projects: [],
    source_ref: "DOC C p3 (long-term association)",
    sort_order: 9,
  },
  {
    name: "Capgemini",
    slug: "capgemini",
    relationship: "client",
    note: "11 kV electrical work, NSEZ Noida.",
    projects: ["capgemini-11kv-electrical"],
    source_ref: "DOC C p8 (Capgemini NSEZ Noida, direct client)",
    sort_order: 10,
  },
  {
    name: "Parmesh Construction Company Ltd.",
    slug: "parmesh-construction",
    relationship: "epc_counterparty",
    note: "Contractor counterpart, Bhutani Infra 33 kV work.",
    projects: [],
    source_ref: "DOC C p8 (Bhutani Infra 33 kV work)",
    sort_order: 11,
  },
  // --- corpus-evidence clients (Phase 7A §1a/1b: project record = evidence) ---
  {
    name: "World Trade Tower",
    slug: "world-trade-tower",
    relationship: "client",
    note: "4,000 TR HVAC with integrated fire systems, Noida.",
    projects: ["world-trade-tower-hvac-fire"],
    source_ref: "DOC B p8 #01 / DOC A p16 — corpus project record",
    sort_order: 12,
  },
  {
    name: "World Trade Park",
    slug: "world-trade-park",
    relationship: "client",
    note: "2,400 TR HVAC system, Jaipur.",
    projects: ["world-trade-park-hvac"],
    source_ref: "DOC B p8 #02 — corpus project record",
    sort_order: 13,
  },
  {
    name: "United Transformers",
    slug: "united-transformers",
    relationship: "client",
    note: "100 TR HVAC system, Jaipur.",
    projects: ["united-transformers-hvac"],
    source_ref: "DOC B p8 #03 — corpus project record",
    sort_order: 14,
  },
  {
    name: "Apollo Pipes Limited",
    slug: "apollo-pipes",
    relationship: "client",
    note: "300 TR HVAC system, Noida.",
    projects: ["apollo-pipes-hvac"],
    source_ref: "DOC B p8 #04 — corpus project record",
    sort_order: 15,
  },
  {
    name: "UltraTech",
    slug: "ultratech",
    relationship: "client",
    note: "125 TR HVAC system, Noida.",
    projects: ["ultratech-hvac"],
    source_ref: "DOC B p8 #06 — corpus project record",
    sort_order: 16,
  },
  {
    name: "SS Foods",
    slug: "ss-foods",
    relationship: "client",
    note: "80 TR HVAC system, Noida.",
    projects: ["ss-foods-hvac"],
    source_ref: "DOC B p8 #09 — corpus project record",
    sort_order: 17,
  },
  {
    name: "Invenio",
    slug: "invenio",
    relationship: "client",
    note: "80 TR HVAC system, Noida.",
    projects: ["invenio-hvac"],
    source_ref: "DOC B p8 #10 — corpus project record",
    sort_order: 18,
  },
  {
    name: "Arkadin",
    slug: "arkadin",
    relationship: "client",
    note: "70 TR HVAC system, Noida.",
    projects: ["arkadin-hvac"],
    source_ref: "DOC B p8 #11 — corpus project record",
    sort_order: 19,
  },
  {
    name: "GEBTECH",
    slug: "gebtech",
    relationship: "client",
    note: "35,000 sq.ft. HVAC installation, Noida.",
    projects: ["gebtech-hvac"],
    source_ref: "DOC B p8 #12 — corpus project record",
    sort_order: 20,
  },
  {
    name: "Noida Towers Pvt. Ltd.",
    slug: "noida-towers",
    relationship: "client",
    note: "30,000 sq.ft. HVAC installation, Noida.",
    projects: ["noida-towers-hvac"],
    source_ref: "DOC B p8 #13 — corpus project record",
    sort_order: 21,
  },
  {
    name: "Nippon Steel & Sumitomo Metal",
    slug: "nippon-steel",
    relationship: "client",
    note: "18,000 sq.ft. HVAC installation, New Delhi.",
    projects: ["nippon-steel-hvac"],
    source_ref: "DOC B p8 #14 — corpus project record",
    sort_order: 22,
  },
  {
    name: "TATA Advanced Systems",
    slug: "tata-advanced-systems",
    relationship: "client",
    note: "16,000 sq.ft. HVAC installation, Noida.",
    projects: ["tata-advanced-hvac"],
    source_ref: "DOC B p8 #15 — corpus project record",
    sort_order: 23,
  },
  {
    name: "Qatar Airways",
    slug: "qatar-airways",
    relationship: "client",
    note: "15,000 sq.ft. HVAC installation, Gurugram.",
    projects: ["qatar-airways-hvac"],
    source_ref: "DOC B p8 #16 — corpus project record",
    sort_order: 24,
  },
  {
    name: "IMGC",
    slug: "imgc",
    relationship: "client",
    note: "14,000 sq.ft. HVAC installation, Noida.",
    projects: ["imgc-hvac"],
    source_ref: "DOC B p8 #17 — corpus project record",
    sort_order: 25,
  },
  {
    name: "DEN",
    slug: "den",
    relationship: "client",
    note: "14,000 sq.ft. HVAC installation, New Delhi.",
    projects: ["den-tv-hvac"],
    source_ref: "DOC B p8 #18 — corpus project record",
    sort_order: 26,
  },
  {
    name: "Regus",
    slug: "regus",
    relationship: "client",
    note: "60 TR HVAC system, Noida.",
    projects: ["regus-hvac"],
    source_ref: "DOC B p8 #19 — corpus project record",
    sort_order: 27,
  },
  {
    name: "CommScope",
    slug: "commscope",
    relationship: "client",
    note: "45 TR HVAC system, Noida.",
    projects: ["commscope-hvac"],
    source_ref: "DOC B p8 #22 — corpus project record",
    sort_order: 28,
  },
  {
    name: "Hexagramme",
    slug: "hexagramme",
    relationship: "client",
    note: "50 TR HVAC system, Noida.",
    projects: ["hexagramme-hvac"],
    source_ref: "DOC B p8 #21 — corpus project record",
    sort_order: 29,
  },
  {
    name: "TATA AIG",
    slug: "tata-aig",
    relationship: "client",
    note: "50 TR HVAC system, Noida.",
    projects: ["tata-aig-hvac"],
    source_ref: "DOC B p8 #22 — corpus project record",
    sort_order: 30,
  },
  {
    name: "ICICI Lombard",
    slug: "icici-lombard",
    relationship: "client",
    note: "40 TR HVAC system, Noida.",
    projects: ["icici-lombard-hvac"],
    source_ref: "DOC B p9 #23 — corpus project record",
    sort_order: 31,
  },
  {
    name: "Acquisory",
    slug: "acquisory",
    relationship: "client",
    note: "40 TR HVAC system, Noida.",
    projects: ["acquisory-hvac"],
    source_ref: "DOC B p9 #25 — corpus project record",
    sort_order: 32,
  },
  {
    name: "CHROME",
    slug: "chrome",
    relationship: "client",
    note: "40 TR HVAC system, Noida.",
    projects: ["chrome-hvac"],
    source_ref: "DOC B p9 #24 — corpus project record",
    sort_order: 33,
  },
  {
    name: "Virus-Eraser",
    slug: "virus-eraser",
    relationship: "client",
    note: "10 TR HVAC system, Noida.",
    projects: ["virus-eraser-hvac"],
    source_ref: "DOC B p9 #50 — corpus project record",
    sort_order: 34,
  },
  {
    name: "I-Avatar",
    slug: "i-avatar",
    relationship: "client",
    note: "10 TR HVAC system, Noida.",
    projects: ["i-avatar-hvac"],
    source_ref: "DOC B p9 #48 — corpus project record",
    sort_order: 35,
  },
  {
    name: "Tricon Builcon",
    slug: "tricon-builcon",
    relationship: "client",
    note: "12 TR HVAC system, Noida.",
    projects: ["tricon-builcon-hvac"],
    source_ref: "DOC B p9 #43 — corpus project record",
    sort_order: 36,
  },
  {
    name: "Ishaan International",
    slug: "ishaan-international",
    relationship: "client",
    note: "12 TR HVAC system, Noida.",
    projects: ["ishaan-international-hvac"],
    source_ref: "DOC B p9 #44 — corpus project record",
    sort_order: 37,
  },
  {
    name: "V & S SeAir Logistics Pvt. Ltd",
    slug: "vs-seair-logistics",
    relationship: "client",
    note: "20 TR HVAC system, Noida.",
    projects: ["vs-seair-logistics-hvac"],
    source_ref: "DOC B p9 #39 — corpus project record",
    sort_order: 38,
  },
  {
    name: "Paperpedia",
    slug: "paperpedia",
    relationship: "client",
    note: "15 TR HVAC system, Noida.",
    projects: ["paperpedia-hvac"],
    source_ref: "DOC B p9 #40 — corpus project record",
    sort_order: 39,
  },
  {
    name: "Rama Refrigeration",
    slug: "rama-refrigeration",
    relationship: "client",
    note: "25 TR HVAC system, Noida.",
    projects: ["rama-refrigeration-hvac"],
    source_ref: "DOC B p9 #31 — corpus project record",
    sort_order: 40,
  },
  {
    name: "APC",
    slug: "apc",
    relationship: "client",
    note: "25 TR HVAC system, Noida.",
    projects: ["apc-hvac"],
    source_ref: "DOC B p9 #29 — corpus project record",
    sort_order: 41,
  },
  {
    name: "My Desk",
    slug: "my-desk",
    relationship: "client",
    note: "25 TR HVAC system, Noida.",
    projects: ["my-desk-hvac"],
    source_ref: "DOC B p9 #30 — corpus project record",
    sort_order: 42,
  },
  {
    name: "AVNET",
    slug: "avnet",
    relationship: "client",
    note: "25 TR HVAC system, New Delhi.",
    projects: ["avnet-hvac"],
    source_ref: "DOC B p9 #32 — corpus project record",
    sort_order: 43,
  },
  {
    name: "Aditya Birla Group",
    slug: "aditya-birla",
    relationship: "client",
    note: "35 TR HVAC system, Noida.",
    projects: ["aditya-birla-hvac"],
    source_ref: "DOC B p9 #26 — corpus project record",
    sort_order: 44,
  },
  {
    name: "AON",
    slug: "aon",
    relationship: "client",
    note: "35 TR HVAC system, Noida.",
    projects: ["aon-global-hvac"],
    source_ref: "DOC B p9 #27 — corpus project record",
    sort_order: 45,
  },
  {
    name: "B.L Agro",
    slug: "bl-agro",
    relationship: "client",
    note: "20 TR HVAC system, Noida.",
    projects: ["bl-agro-hvac"],
    source_ref: "DOC B p9 #37 — corpus project record",
    sort_order: 46,
  },
  {
    name: "Softcell",
    slug: "softcell",
    relationship: "client",
    note: "20 TR HVAC system, Noida.",
    projects: ["softcell-hvac"],
    source_ref: "DOC B p9 #35 — corpus project record",
    sort_order: 47,
  },
  {
    name: "Singhi & Company",
    slug: "singhi-company",
    relationship: "client",
    note: "20 TR HVAC system, Noida.",
    projects: ["singhi-company-hvac"],
    source_ref: "DOC B p9 #36 — corpus project record",
    sort_order: 48,
  },
  {
    name: "Lakhani",
    slug: "lakhani",
    relationship: "client",
    note: "20 TR HVAC system, Ghaziabad.",
    projects: ["lakhani-hvac"],
    source_ref: "DOC B p9 #50 — corpus project record",
    sort_order: 49,
  },
  {
    name: "Sandhaar Eco Green",
    slug: "sandhaar-eco-green",
    relationship: "client",
    note: "10 TR HVAC system, Noida.",
    projects: ["sandhaar-eco-green-hvac"],
    source_ref: "DOC B p9 #51 — corpus project record",
    sort_order: 50,
  },
  {
    name: "Kotak Securities",
    slug: "kotak-securities",
    relationship: "client",
    note: "10 TR HVAC system, Noida.",
    projects: ["kotak-securities-hvac"],
    source_ref: "DOC B p9 #52 — corpus project record",
    sort_order: 51,
  },
  {
    name: "Essar",
    slug: "essar",
    relationship: "client",
    note: "10 TR HVAC system, Noida.",
    projects: ["essar-oil-hvac"],
    source_ref: "DOC B p9 #53 — corpus project record",
    sort_order: 52,
  },
  {
    name: "Elcon",
    slug: "elcon",
    relationship: "client",
    note: "10 TR HVAC system, Noida.",
    projects: ["elcon-hvac"],
    source_ref: "DOC B p9 #54 — corpus project record",
    sort_order: 53,
  },
  {
    name: "JCPenney",
    slug: "jcpenney",
    relationship: "client",
    note: "150 TR HVAC system, Noida.",
    projects: ["jcpenney-hvac-noida"],
    source_ref: "DOC B p8 #05 — corpus project record (C16 resolved)",
    sort_order: 54,
  },
  {
    name: "Pearson Education India Pvt. Ltd.",
    slug: "pearson-education",
    relationship: "client",
    note: "HVAC systems, Noida (300 TR) and Bangalore (120 TR).",
    projects: ["pearson-education-hvac-noida", "pearson-education-hvac-bangalore"],
    source_ref: "DOC B p8 #04 / #07 — corpus project records (C16/C17 resolved)",
    sort_order: 55,
  },
  {
    name: "Golder Associates",
    slug: "golder-associates",
    relationship: "client",
    note: "12 TR HVAC system, Noida.",
    projects: ["golder-associates-hvac"],
    source_ref: "DOC B p9 #45 — corpus project record (C16 resolved)",
    sort_order: 56,
  },
  {
    name: "Prakash Group of Industries",
    slug: "prakash-group",
    relationship: "client",
    note: "10 TR HVAC system, Noida (GEN-TECH).",
    projects: ["prakash-gentech-hvac"],
    source_ref: "DOC B p9 #49 + logo wall p11 — corpus project record (C16 resolved)",
    sort_order: 57,
  },
  // --- architects & PMC associations (DOC B p2 — conservative wording) ---
  {
    name: "JLL",
    slug: "jll",
    relationship: "pmc",
    note: "Associated PMC.",
    projects: [],
    source_ref: "DOC B p2 (Associated Architects & PMC)",
    sort_order: 70,
  },
  {
    name: "CBRE",
    slug: "cbre",
    relationship: "pmc",
    note: "Associated PMC.",
    projects: [],
    source_ref: "DOC B p2",
    sort_order: 71,
  },
  {
    name: "Knight Frank",
    slug: "knight-frank",
    relationship: "pmc",
    note: "Associated PMC.",
    projects: [],
    // DOC B p2 spells it "Knight Frenk" — corrected spelling; association itself is directly listed.
    source_ref: "DOC B p2 — spelled 'Knight Frenk' in source (C20)",
    sort_order: 71.5,
  },
  {
    name: "AVA",
    slug: "ava",
    relationship: "architect",
    note: "Associated architect.",
    projects: [],
    source_ref: "DOC B p2",
    sort_order: 72,
  },
  {
    name: "Vince View",
    slug: "vince-view",
    relationship: "architect",
    note: "Associated architect.",
    projects: [],
    source_ref: "DOC B p2",
    sort_order: 73,
  },
  {
    name: "ISA Projects",
    slug: "isa-projects",
    relationship: "architect",
    note: "Associated architect.",
    projects: [],
    source_ref: "DOC B p2",
    sort_order: 74,
  },
  {
    name: "Design Tree",
    slug: "design-tree",
    relationship: "architect",
    note: "Associated architect.",
    projects: [],
    source_ref: "DOC B p2",
    sort_order: 75,
  },
  {
    name: "Hexagramme",
    slug: "hexagramme-architect",
    relationship: "architect",
    note: "Associated architect.",
    projects: [],
    source_ref: "DOC B p2",
    sort_order: 76,
  },
  {
    name: "UDC Interiors",
    slug: "udc-interiors",
    relationship: "architect",
    note: "Associated architect.",
    projects: [],
    source_ref: "DOC B p2",
    sort_order: 77,
  },
  {
    name: "Credence Gate",
    slug: "credence-gate",
    relationship: "architect",
    note: "Associated architect.",
    projects: [],
    source_ref: "DOC B p2",
    sort_order: 78,
  },
  {
    name: "Habitat Systems",
    slug: "habitat-systems",
    relationship: "architect",
    note: "Associated architect.",
    projects: [],
    source_ref: "DOC B p2",
    sort_order: 79,
  },
  {
    name: "Aeiforia Architects",
    slug: "aeiforia-architects",
    relationship: "architect",
    note: "Associated architect.",
    projects: [],
    source_ref: "DOC B p2",
    sort_order: 80,
  },
  {
    name: "Designe & Organise",
    slug: "designe-organise",
    relationship: "architect",
    note: "Associated architect.",
    projects: [],
    source_ref: "DOC B p2",
    sort_order: 81,
  },
];

/**
 * The corpus frames a client's published work reads through — derived, never
 * hand-assigned: a client with UG work reads "ug", HVAC work "cleanroom",
 * both/either electrical "electrical". Clients without published records
 * (associations) read the ug/electrical atmosphere of the practice world.
 */
export function clientFrame(slugs: string[]): ProjectRecord["image"] {
  const records = PROJECT_CORPUS.filter((r) => slugs.includes(r.slug));
  if (records.length === 0) return "ug";
  const practices = new Set(records.map((r) => r.practice));
  if (practices.has(2)) return "cleanroom";
  const anyElectrical = records.some((r) => r.image === "electrical");
  return anyElectrical ? "electrical" : "ug";
}

export const CLIENTS_SOURCE_NOTE =
  "Client registry from company records DOC B p2/p8-9 and DOC C p3/p8; publication states per the Phase 7 verification matrix.";
