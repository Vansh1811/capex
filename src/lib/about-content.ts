/**
 * ABOUT CONTENT — the structured, source-verified copy for the About page.
 *
 * Every factual statement below is traceable to the three client-supplied
 * PDFs (DOC A "Company Profile" 21pp · DOC B "HVAC & fire profile" 22pp ·
 * DOC C "Electrical & CGD profile" 20pp) or to the already-verified site
 * corpus. Facts owned by other pages (services detail → /services, sector
 * catalogue → /sectors, project register → /projects, roster → /team,
 * clients → /clients, evidence → /credentials) appear here only as bridges.
 * No legacy statistics (10+ years, 150+ projects, 315+ KM, 24/7) — those
 * are not in the verified record.
 *
 * Delivery verbs: the PDFs describe the turnkey scope variously as
 * "engineering, procurement, execution, testing, commissioning and final
 * handover" (DOC A p4) and "Supply, Installation, Testing & Commissioning"
 * (all three). The six-step line merges the two source formulations
 * without inventing a stage neither document names.
 */

import { aboutPlate } from "@/lib/about-media";

/** 01 — Opening. Text left, documentary plate right. No statistics. */
export const OPENING = {
  eyebrow: "About Capex",
  lines: ["We build what", "keeps things", "moving."],
  support: "Capex Construction & Engineering Pvt. Ltd. — a turnkey engineering company since 2012.",
  plate: aboutPlate("pipeline-work"),
  plateCaption: "Cross-country pipeline works · company profile record",
} as const;

/**
 * 02 — Two worlds / the engineered world. The narrative + the image field
 * that opens it: what people see, then what we actually build.
 */
export const TWO_WORLDS = {
  eyebrow: "The engineered world",
  statementOne: "What people see is the finished place.",
  statementTwo: "What we build is everything that makes it work.",
  body: "Capex Construction & Engineering is a turnkey engineering solutions provider. Under one accountable contract — supply, installation, testing & commissioning — it builds the underground utility, electrical and city-gas networks that move power and fuel beneath cities, and the mechanical, electrical and fire-protection systems that keep buildings alive inside. Two practices, one company, accountable end to end.",
  plate: aboutPlate("site-team"),
} as const;

/**
 * 03 — Why Capex. The differentiation, stated as working principles drawn
 * from the record — no invented SLAs, ratings, certifications or counts.
 */
export const WHY = {
  eyebrow: "Why Capex",
  headline: ["Built on", "rigor."],
  note: "The difference is structural, not rhetorical — one company, one contract, from the first survey to final handover.",
  register: "Working principles · from the company record",
  principles: [
    {
      title: "Engineering-led",
      short: "Turnkey scope",
      body: "Projects are taken on a complete turnkey basis: engineering, procurement, execution, testing, commissioning and final handover.",
    },
    {
      title: "One accountable contract",
      short: "Single contract",
      body: "Supply, installation, testing & commissioning under a single contract — the system that runs on day one is the system one company answers for.",
    },
    {
      title: "Two practices, one company",
      short: "Beneath + within",
      body: "Underground utilities, electrical & CGD beneath the street; MEP, HVAC & fire protection within the building — delivered by the same pool of directors, managers and engineers.",
    },
    {
      title: "Planned execution",
      short: "Noida + sites",
      body: "Planning, design and coordination run from the Noida corporate office; resident project managers and site engineers hold the work at each site.",
    },
    {
      title: "Own plant and people",
      short: "Own register",
      body: "Owned rigs, welding and jointing equipment, and a central manufacturing unit in Rajasthan — scheduled from the company's own register, deployed to site.",
    },
    {
      title: "Tested before handed over",
      short: "Segmented tests",
      body: "Segmented testing and commissioning under the same contract that signed the first drawing, with one safety regime on every site.",
    },
  ] as const,
} as const;

/**
 * 04 — How the work moves: the common operating model (source verbs).
 * Each stage carries an output / held-by register line drawn from the same
 * record as the note — descriptors of the documented process, not claims.
 */
export const DELIVERY = {
  eyebrow: "How the work moves",
  note: "One accountable contract · from the company profile",
  source: "Company profile, p4",
  steps: [
    {
      word: "Understand",
      note: "Every engagement starts with the site and the system as they actually are — surveyed, walked, drawn.",
      output: "Site survey",
      holder: "Engineering & planning",
      measure: "The site as it is",
    },
    {
      word: "Engineer",
      note: "Design and engineering shaped around the project — routes, plant rooms, calculations, panels.",
      output: "Design & drawings",
      holder: "Design engineers",
      measure: "Routes, plant rooms, calculations",
    },
    {
      word: "Supply",
      note: "Procurement and supply on the turnkey contract, backed by the company's own plant and manufacturing unit.",
      output: "Procured materials",
      holder: "Central manufacturing unit",
      measure: "Own plant, own register",
    },
    {
      word: "Install",
      note: "Execution by resident project managers and site engineers, with owned rigs and jointing equipment on the ground.",
      output: "Executed works",
      holder: "Resident project managers",
      measure: "Owned rigs on the ground",
    },
    {
      word: "Test",
      note: "Segmented hydraulic and functional testing — the safety regime applied on every site, for every worker.",
      output: "Test records",
      holder: "Site engineers",
      measure: "Segmented, every section",
    },
    {
      word: "Commission",
      note: "Commissioning and final handover under the same contract that signed the first drawing.",
      output: "Final handover",
      holder: "One company, end to end",
      measure: "The system runs on day one",
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
      label: "Foundation",
      title: "Incorporated",
      body: "Capex Construction & Engineering Pvt. Ltd. is incorporated on 26 December 2012 at Kanpur, Uttar Pradesh — an engineering company built around a single idea: one accountable contract, from engineering to commissioning.",
    },
    {
      mark: "Two practices",
      label: "How Capex took shape",
      title: "The company takes shape",
      body: "The work organises into two connected worlds — underground utilities, electrical and city gas beneath the street; MEP, HVAC and fire protection within the building. Both are delivered turnkey: supply, installation, testing & commissioning.",
    },
    {
      mark: "A base to build from",
      label: "The physical capability",
      title: "One company, five locations",
      body: "Project planning, design and coordination run from the Noida corporate office, with branch offices at Patna, Gurugram and Sangli, and a central manufacturing unit in Rajasthan from which the company's own plant, rigs and jointing equipment deploy to sites.",
    },
    {
      mark: "On the record",
      label: "Documented work",
      title: "Documented work",
      body: "Programmes now on record span smart-city and metro connectivity — Patna, Banaras, Lucknow Metro, Gurugram, Dhanbad, Aurangabad, Sangli — alongside building-systems work led by World Trade Tower, Noida and World Trade Park, Jaipur.",
    },
  ] as const,
  statutory: "CIN U45400UP2012PTC054355 · incorporated 26 December 2012 · Kanpur, Uttar Pradesh",
  plate: aboutPlate("hvac-plant-install"),
} as const;

/**
 * 06 — Sectors transition. The bridge from About into the Sectors page —
 * no catalogue, no project grid. The sector record lives on /sectors.
 */
export const RANGE = {
  eyebrow: "Where the work lives",
  headline: "Beneath cities. Within buildings.",
  body: "Smart-city and metro programmes. City gas distribution. Corporate, industrial, healthcare and institutional buildings. The environments Capex serves are the ones people move through every day — the record lives on the Sectors page.",
  plate: aboutPlate("boring-interface"),
} as const;

/** 07 — People transition. The gateway to /team — no roster, no bios. */
export const PEOPLE = {
  eyebrow: "The people behind the work",
  headline: ["Directed by engineers.", "Run by site experience."],
  body: "A named, real organisation — three directors across both practices, a patron with four decades in HVAC design and execution, delivery and project managers, site and design engineers. Planning, design and coordination run from the Noida corporate office; resident project managers hold the work at each site.",
  boardNote: "Between them, the boards bring more than a century of combined site experience.",
  plate: aboutPlate("field-work"),
  linkLabel: "Meet the team",
} as const;

/** 08 — Presence: the geographic index. */
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

/** 09 — Trust / proof bridge. */
export const TRUST = {
  eyebrow: "Trust",
  headline: "Trust is built in the work.",
  body: "Long-term associations with public-sector undertakings, gas utilities, EPC majors, corporates, developers and consultants — documented, not claimed.",
  links: [
    { label: "Clients", to: "/clients" },
    { label: "Credentials", to: "/credentials" },
  ] as const,
} as const;

/** 10 — Closing frame into the site footer. */
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
