/**
 * VERIFIED PEOPLE CORPUS — the audited fallback roster for /team.
 *
 * Source of truth: supabase/migrations/20260903120100_phase6b_entities_seeds.sql
 * (the 22-name team insert, Phase 1 §9 — transcribed from DOC A pp.7-9 and
 * DOC B pp.4-5) with the publication dispositions of
 * 20260903130000_phase7a_content_population.sql §7 applied:
 *
 *   published = verification_status 'verified' (RLS additionally requires
 *               is_active)  →  16 people (+ Ashish Sharma, verified by the
 *               2026-09-08 PDF re-audit — see his row)
 *   hidden    = needs_client_review, held back by documented conflicts
 *               C1-C5, C7 (year discrepancies between DOC A and DOC B
 *               bio paragraphs, name-spelling conflicts)  →  5 people,
 *               correctly absent from every public surface, including this.
 *
 * Integrity rules (absolute):
 * - Name + role ONLY. No biographies, no years-of-experience, no
 *   credentials, no invented locations, no photos of real people.
 * - No person/project relationships are asserted: the source record links
 *   people to PRACTICES (practice_id), never to projects, so this corpus
 *   does the same. People pages therefore show practice affiliation, never
 *   "related projects".
 *
 * When the Phase 6/7 entity tables are applied to the live database,
 * site-data.ts reads them FIRST (RLS enforces the same verified+active
 * matrix) and this module stops being used — no route or component
 * references it directly.
 */

export type PersonGroup = "leadership" | "delivery" | "site_design";

export type PersonRecord = {
  name: string;
  role: string;
  group: PersonGroup;
  /** 1 | 2 — practice affiliation as seeded; null = company-wide. */
  practice: 1 | 2 | null;
  /** The practice's registered short label (migration seed). */
  practice_label: string;
  /** Phase 1 §9 source page of record. */
  source_ref: string;
};

export const PEOPLE_SOURCE_NOTE =
  "Roster transcribed from the company record (DOC A pp.7-9, DOC B pp.4-5); names and roles as verified by the Phase 7 audit.";

export const PEOPLE_TOTAL_NAMED = 22;

const P1 = "UG Utilities & Electrical";
const P2 = "MEP, HVAC & Fire";

export const PEOPLE_CORPUS: PersonRecord[] = [
  // --- leadership (verified rows only) ---
  {
    name: "Anurag Parashar",
    role: "Director",
    group: "leadership",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "DOC B p4",
  },
  {
    name: "Mayank Kaushal",
    role: "Director",
    group: "leadership",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "DOC A p7",
  },
  {
    name: "Sanjay Sharma",
    role: "Co-Director",
    group: "leadership",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "DOC B p4",
  },
  {
    name: "CA Chitin Sapria",
    role: "Financial Advisor",
    group: "leadership",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "DOC A p8",
  },

  // --- delivery (verified rows only) ---
  {
    name: "Vinod Pouchary",
    role: "Sr. Project Manager – HVAC & Fire",
    group: "delivery",
    practice: 2,
    practice_label: P2,
    source_ref: "DOC B p4",
  },
  {
    name: "Malkit Singh",
    role: "Patron",
    group: "delivery",
    practice: null,
    practice_label: "Company-wide",
    source_ref: "DOC B p4",
  },
  {
    name: "Shaliendra Sharma",
    role: "Sr. Project Manager – HVAC",
    group: "delivery",
    practice: 2,
    practice_label: P2,
    source_ref: "DOC B p5",
  },
  {
    name: "Sachin Jamdhade",
    role: "BDM",
    group: "delivery",
    practice: 1,
    practice_label: P1,
    source_ref: "DOC A p7",
  },
  {
    name: "Ashish Sharma",
    role: "Manager Project",
    group: "delivery",
    practice: 1,
    practice_label: P1,
    // C6 resolved by the 2026-09-08 PDF re-audit: both DOC A p7 ("MANAGER
    // PROJECT", title block) and DOC C p7 ("(Manager Project)") print the
    // same role — the earlier "Manager – UG" variant appears in no source.
    source_ref: "DOC A p7 / DOC C p7 — 'Manager Project' in both",
  },
  {
    name: "Vir Kumar Singh",
    role: "Manager – UG",
    group: "delivery",
    practice: 1,
    practice_label: P1,
    source_ref: "DOC A p7",
  },
  {
    name: "Rajeshwar Boke",
    role: "Project Manager – UG",
    group: "delivery",
    practice: 1,
    practice_label: P1,
    source_ref: "DOC A p7",
  },
  {
    name: "Rajneesh Kumar",
    role: "Project Manager – CGD & LMC",
    group: "delivery",
    practice: 1,
    practice_label: P1,
    source_ref: "DOC A p7",
  },

  // --- site & design (the crew sheet — all verified) ---
  {
    name: "Pawan Singh",
    role: "Site Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "DOC A p9 / DOC B p5",
  },
  {
    name: "Santosh Kumar",
    role: "Site Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "DOC A p9 / DOC B p5",
  },
  {
    name: "Gopal Agnihoty",
    role: "Site Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "DOC A p9 / DOC B p5",
  },
  {
    name: "Hari Dutt",
    role: "Site Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "DOC A p9 / DOC B p5",
  },
  {
    name: "Bechen Kumar",
    role: "Site Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "DOC A p9 / DOC B p5",
  },
  {
    name: "Deepak Sharma",
    role: "Site Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "DOC A p9 / DOC B p5",
  },
  {
    name: "Ankit Pouchori",
    role: "Site Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "DOC A p9 / DOC B p5",
  },
  {
    name: "Mirnal Kumar",
    role: "Site Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "DOC A p9 / DOC B p5",
  },
  {
    name: "Balbeer Kumar",
    role: "Site Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "DOC A p9 / DOC B p5",
  },
  {
    name: "Piyush Chaudhary",
    role: "Design Engineer",
    group: "site_design",
    practice: null,
    practice_label: "Site & design",
    source_ref: "DOC A p9 / DOC B p5",
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
