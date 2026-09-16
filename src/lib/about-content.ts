/**
 * ABOUT CONTENT — the structured, source-verified copy for the About page.
 *
 * Every factual statement below is traceable to the three client-supplied
 * PDFs (DOC A "Company Profile" 21pp · DOC B "HVAC & fire profile" 22pp ·
 * DOC C "Electrical & CGD profile" 20pp) or to the already-verified site
 * corpus. Facts owned by other pages (services detail → /services, sector
 * catalogue → /sectors, project register → /projects, roster → /team,
 * clients → /clients, evidence → /credentials) appear here only as bridges.
 *
 * Delivery verbs: the PDFs describe the turnkey scope variously as
 * "engineering, procurement, execution, testing, commissioning and final
 * handover" (DOC A p4) and "Supply, Installation, Testing & Commissioning"
 * (all three). The six-step line below merges the two source formulations
 * without inventing a stage neither document names.
 */

import { aboutPlate } from "@/lib/about-media";

/** 01 — Opening. Sparse, dark, architectural. No statistics. */
export const OPENING = {
  eyebrow: "About Capex",
  lines: ["We build what", "keeps things", "moving."],
  support: "Capex Construction & Engineering Pvt. Ltd. — a turnkey engineering company since 2012.",
} as const;

/** 02 — The engineered world. */
export const MANIFESTO = {
  eyebrow: "The engineered world",
  statementOne: "What people see is the finished place.",
  statementTwo: "What we build is everything that makes it work.",
  body: "Capex Construction & Engineering is a turnkey engineering solutions provider. Under one accountable contract — supply, installation, testing & commissioning — it builds the underground utility, electrical and city-gas networks that move power and fuel beneath cities, and the mechanical, electrical and fire-protection systems that keep buildings alive inside.",
  marginPlate: aboutPlate("substation-erection"),
} as const;

/** 03 — Two worlds / two practices. */
export const TWO_WORLDS = {
  eyebrow: "Two practices · one engineering company",
  one: {
    index: "01",
    title: "Below",
    titleTail: " the street",
    sub: "UG Utilities · Electrical & CGD",
    body: "Underground utility, electrical and city-gas distribution projects — HT/LT cable networks, MDPE and steel gas mains, last-mile connectivity — executed from the site to commissioning.",
    plate: aboutPlate("below-the-street"),
    linkLabel: "Explore capabilities",
  },
  two: {
    index: "02",
    title: "Within",
    titleTail: " the building",
    sub: "MEP · HVAC · Fire Fighting & Fire Protection",
    body: "Air-conditioning, ventilation, clean-room and life-safety systems for commercial, industrial and institutional buildings — engineered, installed and commissioned by one partner.",
    plate: aboutPlate("within-the-building"),
    linkLabel: "Explore capabilities",
  },
  connection:
    "Both practices run on the same delivery model and the same pool of directors, managers and engineers — one company, accountable end to end.",
} as const;

/** 04 — The connection: the common operating model (source-supported verbs). */
export const DELIVERY = {
  eyebrow: "How the work moves",
  note: "One accountable contract · from the company profile",
  steps: [
    {
      word: "Understand",
      note: "Every engagement starts with the site and the system as they actually are — surveyed, walked, drawn.",
    },
    {
      word: "Engineer",
      note: "Design and engineering shaped around the project — routes, plant rooms, calculations, panels.",
    },
    {
      word: "Supply",
      note: "Procurement and supply on the turnkey contract, backed by the company's own plant and manufacturing unit.",
    },
    {
      word: "Install",
      note: "Execution by resident project managers and site engineers, with owned rigs and jointing equipment on the ground.",
    },
    {
      word: "Test",
      note: "Segmented hydraulic and functional testing — the safety regime applied on every site, for every worker.",
    },
    {
      word: "Commission",
      note: "Commissioning and final handover under the same contract that signed the first drawing.",
    },
  ] as const,
} as const;

/** 05 — The story: company development, only documented milestones. */
export const STORY = {
  eyebrow: "The story",
  note: "From the certificate of incorporation & company profile",
  chapters: [
    {
      mark: "2012",
      title: "Incorporated",
      body: "Capex Construction & Engineering Pvt. Ltd. is incorporated on 26 December 2012 at Kanpur, Uttar Pradesh — an engineering company built around a single idea: one accountable contract, from engineering to commissioning.",
    },
    {
      mark: "Two practices",
      title: "The company takes shape",
      body: "The work organises into two connected worlds — underground utilities, electrical and city gas beneath the street; MEP, HVAC and fire protection within the building. Both are delivered turnkey: supply, installation, testing & commissioning.",
    },
    {
      mark: "A base to build from",
      title: "One company, five locations",
      body: "Project planning, design and coordination run from the Noida corporate office, with branch offices at Patna, Gurugram and Sangli, and a central manufacturing unit in Rajasthan from which the company's own plant, rigs and jointing equipment deploy to sites.",
    },
    {
      mark: "On the record",
      title: "Documented work",
      body: "Programmes now on record span smart-city and metro connectivity — Patna, Banaras, Lucknow Metro, Gurugram, Dhanbad, Aurangabad, Sangli — alongside building-systems work led by World Trade Tower, Noida and World Trade Park, Jaipur.",
    },
  ] as const,
  statutory: "CIN U45400UP2012PTC054355 · incorporated 26 December 2012 · Kanpur, Uttar Pradesh",
  plate: aboutPlate("ug-trench"),
} as const;

/** 06 — What the company actually does (nature, not a service list). */
export const THE_MODEL = {
  eyebrow: "The model",
  words: ["Engineering", "Procurement", "Execution", "Testing", "Commissioning"],
  body: "Capex is not simply a design consultant and not simply a contractor. It undertakes projects on a complete turnkey basis — engineering, procurement, execution, testing, commissioning and final handover — so the system that runs on day one is the system one company is answerable for.",
  plate: aboutPlate("substation-build"),
} as const;

/** 07 — The physical Capex. */
export const PHYSICAL = {
  eyebrow: "The physical Capex",
  headline: ["We build with", "more than plans."],
  body: "Owned plant and equipment, available for deployment across UG utility, electrical and CGD projects — scheduled from the company's own register, not rented, not brokered.",
  tonnage: "32",
  tonnageLabel: "Tonne pullback · trenchless class",
  register:
    "On the documented register: Drillto 32-tonne, 28-tonne and 20-tonne HDD machines · welding, jointing and threading equipment · support vehicles",
  rigPlate: aboutPlate("hdd-rig-ops"),
  statement: "A company that owns its machines can promise its dates.",
  statementBody:
    "The HDD fleet drills crossings under roads, rail and rivers without opening the surface. A central manufacturing unit in Rajasthan stands behind the practice's work.",
  detailPlate: aboutPlate("boring-interface"),
} as const;

/** 09 — The range of work (bridge to Sectors). */
export const RANGE = {
  eyebrow: "The range of work",
  headline: "Beneath cities. Within buildings.",
  body: "Smart-city and metro programmes. City gas distribution. Corporate, industrial, healthcare and institutional buildings. The environments Capex serves are the ones people move through every day — the record lives on the Sectors page.",
  plate: aboutPlate("field-work"),
} as const;

/** 10 — The people behind the work. */
export const PEOPLE = {
  eyebrow: "The people behind the work",
  headline: ["Directed by engineers.", "Run by site experience."],
  body: "A named, real organisation — three directors across both practices, a patron with four decades in HVAC design and execution, delivery and project managers, site and design engineers. Planning, design and coordination run from the Noida corporate office; resident project managers hold the work at each site.",
  boardNote: "Between them, the boards bring more than a century of combined site experience.",
  plate: aboutPlate("team-boards"),
  sitePlate: aboutPlate("site-team"),
  linkLabel: "Meet the team",
} as const;

/** 11 — Presence: the geographic index. */
export const PRESENCE = {
  places: [
    { name: "Noida", role: "Corporate office" },
    { name: "Patna", role: "Branch office" },
    { name: "Gurugram", role: "Branch office" },
    { name: "Sangli", role: "Branch office" },
    { name: "Rajasthan", role: "Central manufacturing unit" },
  ] as const,
  reach:
    "Project reach across India and Nepal — radiating from the corporate office and the central manufacturing unit to sites across the country.",
} as const;

/** 12 — Trust / proof bridge. */
export const TRUST = {
  headline: "Trust is built in the work.",
  body: "Long-term associations with public-sector undertakings, gas utilities, EPC majors, corporates, developers and consultants — documented, not claimed.",
  links: [
    { label: "Clients", to: "/clients" },
    { label: "Credentials", to: "/credentials" },
  ] as const,
} as const;

/** 13 — The record: restrained project index. */
export const THE_RECORD = {
  eyebrow: "The record",
  headline: "The work speaks for itself.",
  intro:
    "A few entries from the documented project record — the full archive lives on the Projects page.",
  entries: [
    {
      name: "World Trade Tower, Noida",
      detail: "4,000 TR HVAC with integrated hydrant & sprinkler system",
      slug: "world-trade-tower-hvac-fire",
    },
    {
      name: "Patna Smart City",
      detail: "150 km · 11 & 33 kV cable laying",
      slug: "patna-smart-city-electrical",
    },
    {
      name: "Banaras Smart City",
      detail: "180 km · 11/33 kV cable laying",
      slug: "banaras-smart-city-electrical",
    },
    {
      name: "Lucknow Metro",
      detail: "20 km · 220 kV cable laying",
      slug: "lucknow-metro-electrical",
    },
    {
      name: "Aurangabad City MDP",
      detail: "165 km gas line · ongoing",
      slug: "aurangabad-cmdp-pipe-laying",
    },
    {
      name: "Sangli LMC",
      detail: "5,000 house & industry connections · ongoing",
      slug: "sangli-lmc-work",
    },
  ] as const,
  plate: aboutPlate("wtt-flagship"),
} as const;

/** 14 — Closing. */
export const CLOSING = {
  eyebrow: "Now you know the company",
  headline: ["Let's talk about", "what needs to work."],
  links: [
    { label: "Projects", to: "/projects" },
    { label: "Start a conversation", to: "/contact" },
  ] as const,
  legal: "Capex Construction & Engineering Pvt. Ltd. · Est. 2012",
  place: "Noida, India",
} as const;
