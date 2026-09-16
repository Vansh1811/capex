/**
 * STATIC SITE SETTINGS — the final, minimal architecture.
 *
 * The admin/CMS experiment is retired: the public site is a premium static
 * frontend (the verified corpora in src/lib/*-corpus.ts are the single
 * content source) plus two submission backends — the enquiry form and the
 * credential request form. Supabase persists those submissions only.
 *
 * The values below are the verified company record, transcribed from the
 * live site_settings rows (Phase 6A/7 audit) — the same values the pages
 * render today. Nothing invented.
 */

export const SITE_SETTINGS: Record<string, string> = {
  brand_wordmark: "CAPEX",
  logo_tagline: "Construction & Engineering",
  contact_phone: "+91 98185 40532",
  contact_email: "mail2capex@yahoo.in",
};

export const SITE_OFFICES: { city: string; role: string }[] = [
  { city: "Noida", role: "Head office" },
  { city: "Patna", role: "Branch" },
  { city: "Gurugram", role: "Branch" },
  { city: "Sangli", role: "Branch" },
  { city: "Rajasthan", role: "Manufacturing unit" },
];

/** Registration numbers of record for the chrome (Footer CIN / Udyam line). */
export const SITE_REGISTRATIONS = {
  cin: "U45400UP2012PTC054355",
  udyam: "UDYAM-UP-28-0013458",
};
