/**
 * CLIENT EXHIBITION — the curated /clients taxonomy.
 *
 * Four editorial categories matching the company DOC A p6 CLIENT LIST wall
 * (IT / Corporates / Oil and Gas Industries / Builder and Developer). Entries
 * are direct clients from CLIENT_CORPUS (relationship === "client");
 * EPC counterparties and architect/PMC associations are intentionally absent —
 * the new page is about CLIENTS, not the old relationship explorer.
 *
 * 2026-09-23: logo-wall-only brands with no project record yet (Infosys,
 * Cadence, TCS, THINK GAS, oneindia, APL Apollo Steel, ACE, Eldeco, Paras
 * Buildtech, Tata Value Homes, Godrej Properties, BPTP) are listed per the
 * wall grouping — no invented claim. Real logo files were added the same day
 * for all of them except Tata Value Homes (official file is white-on-dark,
 * invisible on ivory — rides as type until a color version is approved).
 * Purba Bharati Gas + AG&P (corpus project evidence) are now included in
 * Oil & Gas (previously in corpus but missing from the exhibition).
 * WTT and Arkadin ride as type (no verified mark file yet).
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
 * Files were downloaded from official company domains (or official-brand
 * vectors where the official site blocks bots) and verified 2026-09-17 /
 * 2026-09-23; provenance per asset is recorded in
 * public/uploads/clients/logos/SOURCES.md.
 */
const LOGO: Record<string, string> = {
  acquisory: "/uploads/clients/logos/acquisory.png",
  ace: "/uploads/clients/logos/ace.webp",
  "aditya-birla": "/uploads/clients/logos/aditya-birla.png",
  agp: "/uploads/clients/logos/agp.png",
  aon: "/uploads/clients/logos/aon.png",
  apc: "/uploads/clients/logos/apc.png",
  "apl-apollo-steel": "/uploads/clients/logos/apl-apollo-steel.png",
  "apollo-pipes": "/uploads/clients/logos/apollo-pipes.png",
  avnet: "/uploads/clients/logos/avnet.svg",
  "bhutani-infra": "/uploads/clients/logos/bhutani-infra.png",
  "bl-agro": "/uploads/clients/logos/bl-agro.png",
  bpcl: "/uploads/clients/logos/bpcl.png",
  bptp: "/uploads/clients/logos/bptp.png",
  cadence: "/uploads/clients/logos/cadence.svg",
  capgemini: "/uploads/clients/logos/capgemini.svg",
  commscope: "/uploads/clients/logos/commscope.png",
  den: "/uploads/clients/logos/den.png",
  eldeco: "/uploads/clients/logos/eldeco.png",
  essar: "/uploads/clients/logos/essar.svg",
  "godrej-properties": "/uploads/clients/logos/godrej-properties.svg",
  "icici-lombard": "/uploads/clients/logos/icici-lombard.png",
  igl: "/uploads/clients/logos/igl.png",
  imgc: "/uploads/clients/logos/imgc.png",
  infosys: "/uploads/clients/logos/infosys.svg",
  "ishaan-international": "/uploads/clients/logos/ishaan-international.jpg",
  jcpenney: "/uploads/clients/logos/jcpenney.png",
  "jsp-projects": "/uploads/clients/logos/jsp-projects.jpg",
  "kotak-securities": "/uploads/clients/logos/kotak-securities.svg",
  lakhani: "/uploads/clients/logos/lakhani.png",
  "larsen-toubro": "/uploads/clients/logos/larsen-toubro.svg",
  oneindia: "/uploads/clients/logos/oneindia.svg",
  "nippon-steel": "/uploads/clients/logos/nippon-steel.svg",
  "paras-buildtech": "/uploads/clients/logos/paras-buildtech.png",
  "pearson-education": "/uploads/clients/logos/pearson-education.png",
  "prakash-group": "/uploads/clients/logos/prakash-group.jpg",
  "purba-bharati-gas": "/uploads/clients/logos/purba-bharati-gas.png",
  "qatar-airways": "/uploads/clients/logos/qatar-airways.svg",
  regus: "/uploads/clients/logos/regus.png",
  "tata-advanced-systems": "/uploads/clients/logos/tata-advanced-systems.png",
  "tata-aig": "/uploads/clients/logos/tata-aig.svg",
  "tata-consultancy-services": "/uploads/clients/logos/tata-consultancy-services.svg",
  "think-gas": "/uploads/clients/logos/think-gas.webp",
  "united-transformers": "/uploads/clients/logos/united-transformers.jpg",
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
      "infosys",
      "cadence",
      "tata-consultancy-services",
      "commscope",
      "invenio",
      "arkadin",
      "avnet",
      "apc",
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
      "think-gas",
      "qatar-airways",
      "imgc",
      "regus",
      "hexagramme",
      "tata-aig",
      "icici-lombard",
      "acquisory",
      "apl-apollo-steel",
      "oneindia",
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
      "purba-bharati-gas",
      "agp",
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
      "ace",
      "godrej-properties",
      "bptp",
      "eldeco",
      "paras-buildtech",
      "tata-value-homes",
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
