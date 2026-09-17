/**
 * CLIENT EXHIBITION — the curated /clients taxonomy.
 *
 * Four editorial categories. One active at a time. Every client listed here
 * is a verified direct client from CLIENT_CORPUS (relationship === "client");
 * EPC counterparties and architect/PMC associations are intentionally absent —
 * the new page is about CLIENTS, not the old relationship explorer.
 *
 * Logos are local assets in public/uploads/clients/logos/ — sourced 2026-09-17
 * from each company's official website (see public/uploads/clients/logos/SOURCES.md).
 * No invented logos, no external logo APIs, no stock. A client without a
 * verified asset renders as elegant typography — a missing logo is acceptable,
 * a false logo is not. The former /__l5e/ Lovable CDN paths 404 off-platform
 * (Phase2 TD8) and are gone; unmapped slugs intentionally fall back to text.
 */

export type ExhibitionCategoryId =
  "it-technology" | "corporates" | "oil-gas-industries" | "builders-developers";

export type ExhibitionCategory = {
  id: ExhibitionCategoryId;
  n: string;
  label: string;
  /** Verified direct-client slugs, exactly one category each. */
  slugs: string[];
};

/**
 * Verified logo asset per direct-client slug. Keyed by CLIENT_CORPUS slug.
 * Files were downloaded from official company domains and verified 2026-09-17;
 * provenance per asset is recorded in public/uploads/clients/logos/SOURCES.md.
 */
const LOGO: Record<string, string> = {
  acquisory: "/uploads/clients/logos/acquisory.png",
  "apollo-pipes": "/uploads/clients/logos/apollo-pipes.png",
  "bhutani-infra": "/uploads/clients/logos/bhutani-infra.png",
  "bl-agro": "/uploads/clients/logos/bl-agro.png",
  bpcl: "/uploads/clients/logos/bpcl.png",
  capgemini: "/uploads/clients/logos/capgemini.svg",
  commscope: "/uploads/clients/logos/commscope.png",
  imgc: "/uploads/clients/logos/imgc.png",
  "pearson-education": "/uploads/clients/logos/pearson-education.png",
  softcell: "/uploads/clients/logos/softcell.png",
  "tata-advanced-systems": "/uploads/clients/logos/tata-advanced-systems.png",
  "tata-aig": "/uploads/clients/logos/tata-aig.svg",
  ultratech: "/uploads/clients/logos/ultratech.png",
};

export function exhibitionLogo(slug: string): string | null {
  return LOGO[slug] ?? null;
}

export const EXHIBITION_CATEGORIES: ExhibitionCategory[] = [
  {
    id: "it-technology",
    n: "01",
    label: "IT & Technology",
    slugs: [
      "capgemini",
      "commscope",
      "invenio",
      "arkadin",
      "avnet",
      "apc",
      "softcell",
      "i-avatar",
      "gebtech",
      "chrome",
      "den",
      "virus-eraser",
    ],
  },
  {
    id: "corporates",
    n: "02",
    label: "Corporates",
    slugs: [
      "tata-advanced-systems",
      "qatar-airways",
      "imgc",
      "regus",
      "hexagramme",
      "tata-aig",
      "icici-lombard",
      "acquisory",
      "ishaan-international",
      "vs-seair-logistics",
      "paperpedia",
      "rama-refrigeration",
      "my-desk",
      "aditya-birla",
      "aon",
      "bl-agro",
      "singhi-company",
      "sandhaar-eco-green",
      "kotak-securities",
      "jcpenney",
      "pearson-education",
      "golder-associates",
      "ss-foods",
    ],
  },
  {
    id: "oil-gas-industries",
    n: "03",
    label: "Oil & Gas Industries",
    slugs: [
      "bgrl",
      "igl",
      "bpcl",
      "essar",
      "apollo-pipes",
      "ultratech",
      "united-transformers",
      "prakash-group",
      "elcon",
      "nippon-steel",
    ],
  },
  {
    id: "builders-developers",
    n: "04",
    label: "Builders & Developers",
    slugs: [
      "larsen-toubro",
      "jsp-projects",
      "tata-projects",
      "bhutani-infra",
      "creative-llp",
      "world-trade-tower",
      "world-trade-park",
      "noida-towers",
      "tricon-builcon",
      "lakhani",
    ],
  },
];

export function categoryById(id: ExhibitionCategoryId): ExhibitionCategory {
  return EXHIBITION_CATEGORIES.find((c) => c.id === id) ?? EXHIBITION_CATEGORIES[0];
}
