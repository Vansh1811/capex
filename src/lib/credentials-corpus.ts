/**
 * VERIFIED CREDENTIALS CORPUS — the audited fallback for /credentials.
 *
 * Source of truth: supabase/migrations/20260903120100_phase6b_entities_seeds.sql
 * (the 12-row credentials insert, transcribed verbatim from the company
 * record — DOC A p19/p20, DOC B p12, DOC C p9, and the GST REG-06 / Udyam /
 * ESI certificate set). Publication disposition per the Phase 7B D5
 * assertion: exactly 10 published credentials (9 statutory + MSME
 * membership). ISO 9001:2015 (gate #13 — badge only, no issuing body or
 * certificate scan anywhere) and Make in India (needs_client_review) are
 * gated OUT of every public surface, including this file.
 *
 * Integrity rules (absolute):
 * - Every number, title, issuer, jurisdiction and date is transcribed from
 *   the audited seed — nothing invented, nothing completed.
 * - issued_at is carried only where the seed documents a date; null
 *   otherwise (the field is omitted in rendering, never guessed).
 * - Document scans do not exist anywhere yet (scan_status 'on_request'
 *   across the board) — the corpus marks them available on request and
 *   never implies a downloadable file.
 *
 * When the Phase 6/7 entity tables are applied to the live database,
 * site-data.ts reads them FIRST (RLS enforces the same verified+active
 * matrix) and this module stops being used — same contract as the other
 * corpora.
 */

export type CredentialKind = "statutory" | "membership";

export type CredentialRecord = {
  /** Register index — the migration's sort_order, published rows only. */
  n: number;
  title: string;
  kind: CredentialKind;
  /** Registry number of record, transcribed verbatim. */
  number: string;
  /** Issuing authority as documented (displayed as the issuer). */
  issuer: string;
  /** Jurisdiction of record — state for GST, authority seat otherwise. */
  jurisdiction: string;
  /** Documented issue date (ISO) — null where the record states none. */
  issued_at: string | null;
  /** Document availability — always 'on request' today; wired for scans. */
  scan: "approved" | "on_request";
  /** Phase 6B/7 source of record. */
  source_ref: string;
};

/** GST registrations lifted out of the register for the geography index. */
export type GstStateRecord = {
  state: string;
  /** GSTIN code prefix (first two digits) as documented. */
  gstinPrefix: string;
  /** Office city the certificate names. */
  place: string;
  number: string;
  issued_at: string | null;
};

export const CREDENTIALS_SOURCE_NOTE =
  "Register transcribed from the company record — incorporation certificate, GST REG-06 set, Udyam and ESI registrations (Phase 6B/7 audit).";

export const CREDENTIALS_TOTAL_PUBLISHED = 10;

const CORPUS: CredentialRecord[] = [
  {
    n: 1,
    title: "Certificate of Incorporation",
    kind: "statutory",
    number: "U45400UP2012PTC054355",
    issuer: "Registrar of Companies",
    jurisdiction: "Uttar Pradesh",
    issued_at: "2012-12-26",
    scan: "on_request",
    source_ref: "Certificate scan — DOC B p12 / DOC C p9",
  },
  {
    n: 2,
    title: "Permanent Account Number (PAN)",
    kind: "statutory",
    number: "AAFCC1314H",
    issuer: "Income Tax Department",
    jurisdiction: "Govt of India",
    issued_at: null,
    scan: "on_request",
    source_ref: "DOC A p20 / Udyam certificate",
  },
  {
    n: 3,
    title: "Udyam (MSME) Registration",
    kind: "statutory",
    number: "UDYAM-UP-28-0013458",
    issuer: "Ministry of MSME",
    jurisdiction: "Small · Services",
    issued_at: "2021-02-17",
    scan: "on_request",
    source_ref: "Udyam certificate scan",
  },
  {
    n: 4,
    title: "GST Registration — Uttar Pradesh",
    kind: "statutory",
    number: "09AAFCC1314H1Z0",
    issuer: "GST Network",
    jurisdiction: "Uttar Pradesh",
    issued_at: null,
    scan: "on_request",
    source_ref: "GST REG-06 certificate",
  },
  {
    n: 5,
    title: "GST Registration — Maharashtra",
    kind: "statutory",
    number: "27AAFCC1314H1Z2",
    issuer: "GST Network",
    jurisdiction: "Maharashtra",
    issued_at: "2021-03-04",
    scan: "on_request",
    source_ref: "GST REG-06 certificate",
  },
  {
    n: 6,
    title: "GST Registration — Bihar",
    kind: "statutory",
    number: "10AAFCC1314H1ZH",
    issuer: "GST Network",
    jurisdiction: "Bihar",
    issued_at: "2018-04-10",
    scan: "on_request",
    source_ref: "GST REG-06 certificate",
  },
  {
    n: 7,
    title: "GST Registration — Delhi",
    kind: "statutory",
    number: "07AAFCC1314H1Z4",
    issuer: "GST Network",
    jurisdiction: "Delhi",
    issued_at: "2018-05-07",
    scan: "on_request",
    source_ref: "GST REG-06 certificate",
  },
  {
    n: 8,
    title: "GST Registration — Haryana",
    kind: "statutory",
    number: "06AAFCC1314H1Z6",
    issuer: "GST Network",
    jurisdiction: "Haryana",
    issued_at: "2018-11-30",
    scan: "on_request",
    source_ref: "GST REG-06 certificate",
  },
  {
    n: 9,
    title: "ESI Registration",
    kind: "statutory",
    number: "67000673940001019",
    issuer: "Employees' State Insurance Corporation",
    jurisdiction: "Govt of India",
    issued_at: "2018-05-01",
    scan: "on_request",
    source_ref: "ESIC letter scan",
  },
  {
    n: 10,
    title: "MSME Membership",
    kind: "membership",
    number: "UDYAM-UP-28-0013458",
    issuer: "Ministry of MSME",
    jurisdiction: "Govt of India",
    issued_at: "2021-02-17",
    scan: "on_request",
    source_ref: "Udyam certificate",
  },
];

/** The verified GST geography — derived from the five GST register rows. */
export const GST_STATES: GstStateRecord[] = [
  {
    state: "Uttar Pradesh",
    gstinPrefix: "09",
    place: "Noida",
    number: "09AAFCC1314H1Z0",
    issued_at: null,
  },
  {
    state: "Maharashtra",
    gstinPrefix: "27",
    place: "Sangli",
    number: "27AAFCC1314H1Z2",
    issued_at: "2021-03-04",
  },
  {
    state: "Bihar",
    gstinPrefix: "10",
    place: "Patna",
    number: "10AAFCC1314H1ZH",
    issued_at: "2018-04-10",
  },
  {
    state: "Delhi",
    gstinPrefix: "07",
    place: "New Delhi",
    number: "07AAFCC1314H1Z4",
    issued_at: "2018-05-07",
  },
  {
    state: "Haryana",
    gstinPrefix: "06",
    place: "Gurugram",
    number: "06AAFCC1314H1Z6",
    issued_at: "2018-11-30",
  },
];

/** Verified record milestones for THE RECORD — dates from the seed only. */
export const RECORD_MILESTONES: { year: string; label: string; note: string }[] = [
  {
    year: "2012",
    label: "Incorporated",
    note: "Certificate of Incorporation issued 26 December 2012 — Registrar of Companies, Uttar Pradesh (CIN U45400UP2012PTC054355).",
  },
  {
    year: "2018",
    label: "Multi-state GST",
    note: "Bihar, Delhi and Haryana GST registrations recorded through 2018 (April, May, November).",
  },
  {
    year: "2018",
    label: "ESI",
    note: "Employees' State Insurance registration recorded 1 May 2018.",
  },
  {
    year: "2021",
    label: "Udyam & GST renewal",
    note: "Udyam (MSME) registration recorded 17 February 2021; Maharashtra GST recorded 4 March 2021.",
  },
  {
    year: "Now",
    label: "Present",
    note: "Ten registrations of record — each available for verification on request.",
  },
];

export { CORPUS as CREDENTIALS_CORPUS };
