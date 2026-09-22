/**
 * VERIFIED PEOPLE CORPUS — the audited roster for /team.
 *
 * Leadership order and profile content per the approved People-page brief
 * (client-supplied source content — factual meaning preserved, grammar
 * lightly cleaned; nothing invented):
 *
 *   leadership  01 Anurag Parashar (Director)
 *               02 Mayank Kaushal (Director)
 *               03 Sanjay Sharma (Co-Director)
 *               04 CA Chitin Sapria (Financial Advisor)
 *   delivery    Shilpa Choudhary, Vinod Pachori, Rajeshwar Boke,
 *               Rajneesh Kumar, Vir Kumar Singh, Malkit Singh,
 *               Deepa Yadav, Vaishnavi Kesari
 *   site_design Aman Pachori, Deepanshu Sharma, Rajneesh
 *
 * Integrity rules (absolute):
 * - Only the supplied profile / experience / focus / responsibility fields
 *   are published. Where no bio was supplied, only NAME + ROLE render.
 * - No education, certifications, companies, awards or locations are asserted.
 * - No photos of real people, no AI/stock portraits, no placeholders.
 * - People link to PRACTICES only via the practice field, never to projects.
 */

export type PersonGroup = "leadership" | "delivery" | "site_design";

export type PersonRecord = {
  name: string;
  role: string;
  group: PersonGroup;
  /** 1 | 2 — practice affiliation; null = company-wide. */
  practice: 1 | 2 | null;
  /** The practice's registered short label. */
  practice_label: string;
  /** Phase 1 source page of record (kept where known). */
  source_ref: string;
  /** Verified bio paragraphs — omitted entirely when not supplied. */
  profile?: string[];
  /** Verified experience figure, e.g. "15+ Years" — omitted when not supplied. */
  experience?: string;
  /** Verified focus labels — omitted when not supplied. */
  focus?: string[];
  /** Verified responsibility line — omitted when not supplied. */
  responsibility?: string;
};

export const PEOPLE_SOURCE_NOTE =
  "Roster and profiles per the approved company record; names, roles and profile text as supplied — nothing invented.";

export const PEOPLE_TOTAL_NAMED = 15;

const P1 = "UG Utilities & Electrical";
const P2 = "MEP, HVAC & Fire";

export const PEOPLE_CORPUS: PersonRecord[] = [
  // --- leadership (directors first, then co-director and advisor) ---
  {
    name: "Anurag Parashar",
    role: "Director",
    group: "leadership",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "Approved roster — 01",
    profile: [
      "Anurag is an expert in project execution, including UG Utility work and LMC. He has over 14 years of experience in operations and project management.",
      "He is a keen planner and strategist with demonstrated abilities in managing project services.",
      "He has worked in senior positions both with corporate occupiers and service providers.",
    ],
    experience: "14+ Years",
    focus: ["Project Execution", "UG Utilities", "LMC", "Operations", "Project Management"],
  },
  {
    name: "Mayank Kaushal",
    role: "Director",
    group: "leadership",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "Approved roster — 02",
    profile: [
      "Mayank Kaushal has expertise in UG Utility work, with over 15 years of experience in the field of UG utilities work, such as electrical, fiber optics, waterline, and oil & gas lines for multiple projects pan-India.",
      "He has worked in key senior positions both with corporate occupiers and service providers.",
    ],
    experience: "15+ Years",
    focus: ["UG Utilities", "Electrical", "Fiber Optics", "Waterline", "Oil & Gas"],
  },
  {
    name: "Sanjay Sharma",
    role: "Co-Director",
    group: "leadership",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "Approved roster — 03",
    profile: [
      "Sanjay Sharma is a renowned property service expert with over 25 years of experience in the field of civil and construction.",
      "He has worked with several national real estate companies.",
    ],
    experience: "25+ Years",
    focus: ["Civil", "Construction", "Property Services"],
  },
  {
    name: "CA Chitin Sapria",
    role: "Financial Advisor",
    group: "leadership",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "Approved roster — 04",
    profile: [
      "CA Chitin Sapria is responsible for final accounts and all legal work.",
      "He has been in the financial sector for over 20 years.",
    ],
    experience: "20+ Years",
    focus: ["Final Accounts", "Legal Work", "Finance"],
  },

  // --- delivery (project / business development / operations) ---
  {
    name: "Shilpa Choudhary",
    role: "Business Development Manager",
    group: "delivery",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "Approved roster — delivery",
    profile: [
      "Shilpa is an expert in the field of utilities work which includes MEP line work.",
      "She possesses over 12 years of experience of business development in various fields.",
    ],
    experience: "12+ Years",
    focus: ["Utilities", "MEP Line Work", "Business Development"],
  },
  {
    name: "Vinod Pachori",
    role: "General Manager (MEP)",
    group: "delivery",
    practice: 2,
    practice_label: P2,
    source_ref: "Approved roster — delivery",
    profile: [
      "Vinod is an expert in the field of MEP, which includes pipeline work.",
      "He possesses over 20 years of experience in operations and maintenance, project execution, and commissioning.",
      "He is a keen planner for project execution.",
    ],
    experience: "20+ Years",
    focus: ["MEP", "Pipeline Work", "Operations & Maintenance", "Project Execution", "Commissioning"],
  },
  {
    name: "Rajeshwar Boke",
    role: "Project Manager (CGD & LMC)",
    group: "delivery",
    practice: 1,
    practice_label: P1,
    source_ref: "Approved roster — delivery",
    profile: [
      "Rajeshwar Boke is an expert in the field of UG Utility work.",
      "He possesses over 5 years of experience in project execution.",
    ],
    experience: "5+ Years",
    focus: ["UG Utilities", "CGD", "LMC", "Project Execution"],
    responsibility: "Responsible for project execution for multiple sites.",
  },
  {
    name: "Rajneesh Kumar",
    role: "Project Manager (CGD & LMC)",
    group: "delivery",
    practice: 1,
    practice_label: P1,
    source_ref: "Approved roster — delivery",
    profile: [
      "Rajneesh Kumar is an expert in the field of LMC and CGD work.",
      "He possesses over 7 years of experience in project execution.",
    ],
    experience: "7+ Years",
    focus: ["LMC", "CGD", "Project Execution"],
    responsibility: "Responsible for project execution of multiple sites.",
  },
  {
    name: "Vir Kumar Singh",
    role: "Project Manager (MEP)",
    group: "delivery",
    practice: 2,
    practice_label: P2,
    source_ref: "Approved roster — delivery",
    profile: [
      "Vir Kumar Singh is an expert in the field of MEP work.",
      "He possesses over 10 years of experience in project execution.",
    ],
    experience: "10+ Years",
    focus: ["MEP", "Project Execution"],
    responsibility: "Responsible for project execution of multiple sites.",
  },
  {
    name: "Malkit Singh",
    role: "Patron",
    group: "delivery",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "Approved roster — delivery",
    profile: [
      "Mr. Malkit Singh has over 42 years experience in designing, implementing, and executing HVAC systems.",
      "He has been our guiding light on our journey to becoming an icon in the industry.",
      "His generous expert advice is always there when needed.",
    ],
    experience: "42+ Years",
    focus: ["HVAC", "Design", "Implementation", "Execution"],
  },
  {
    name: "Deepa Yadav",
    role: "Accountant",
    group: "delivery",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "Approved roster — delivery",
    profile: [
      "Deepa Yadav manages day-to-day accounting operations, maintains accurate financial records and ensures timely preparation of financial reports.",
    ],
  },
  {
    name: "Vaishnavi Kesari",
    role: "CPM / MIS",
    group: "delivery",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "Approved roster — delivery",
    responsibility:
      "Responsible for preparing and maintaining Management Information System (MIS) reports, analyzing project and operational data.",
  },

  // --- site & design (field engineering) ---
  {
    name: "Aman Pachori",
    role: "Site Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "Approved roster — field",
    responsibility: "Responsible for day to day report to Project Manager.",
  },
  {
    name: "Deepanshu Sharma",
    role: "Site Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "Approved roster — field",
    responsibility: "Responsible for day to day report to Project Manager.",
  },
  {
    name: "Rajneesh",
    role: "Site Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "Approved roster — field",
    responsibility: "Responsible for day to day report to Project Manager.",
  },
];

export const GROUP_LABELS: Record<PersonGroup, { label: string; note: string }> = {
  leadership: {
    label: "Leadership",
    note: "Directors and advisors of record — the company's incorporated governance.",
  },
  delivery: {
    label: "Delivery",
    note: "Project managers and business development across the two practices.",
  },
  site_design: {
    label: "Site & Design",
    note: "The engineers and site staff who hold the work in the field.",
  },
};
