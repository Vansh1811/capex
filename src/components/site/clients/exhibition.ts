/**
 * CLIENT EXHIBITION — the curated /clients taxonomy.
 *
 * Four editorial categories. One active at a time. Every client listed here
 * is a verified direct client from CLIENT_CORPUS (relationship === "client");
 * EPC counterparties and architect/PMC associations are intentionally absent —
 * the new page is about CLIENTS, not the old relationship explorer.
 *
 * Logo URLs are the verified Lovable R2 assets in src/assets/clients/*.asset.json
 * (read 2026-09-16 — the `url` field of each file). No invented logos, no
 * external logo APIs, no stock. A client without a verified asset renders as
 * elegant typography — a missing logo is acceptable, a false logo is not.
 *
 * Excluded asset files with no verified client (never rendered):
 *   bharat-gas.png, oneindia.png, rentech-designs.png
 * Top-level wall-only brands (Infosys, Cadence, TCS, bhutani-logo.webp) are
 * needs_client_review per the corpus notes and are never used.
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
 * gen-tech.png depicts the Prakash GEN-TECH mark (DOC B p11 logo wall names
 * "Prakash Group of Industries (GEN-TECH)"); vs-delivering.png is the
 * V & S SeAir Logistics mark; apl-apollo.png is the Apollo Pipes mark.
 */
const LOGO: Record<string, string> = {
  acquisory: "/__l5e/assets-v1/1ee74c74-64d0-47a2-a0d5-914980f5b8f5/acquisory.png",
  "aditya-birla": "/__l5e/assets-v1/d4dbf70c-e068-41e5-84d8-b85240f37284/aditya-birla.png",
  aon: "/__l5e/assets-v1/ad10c287-9cf6-4cb2-a705-3937d732ae35/aon-global.png",
  apc: "/__l5e/assets-v1/ba563ec7-9c49-4496-91be-f7b03159cf5e/apc.png",
  "apollo-pipes": "/__l5e/assets-v1/726d5845-97cd-4a08-a5f6-b3b1207c1d62/apl-apollo.png",
  arkadin: "/__l5e/assets-v1/51654039-4bc8-4211-8d62-3a47b35678aa/arkadin.png",
  avnet: "/__l5e/assets-v1/b061b41f-0e75-4317-ba38-3f4bda1f79e8/avnet.png",
  "bhutani-infra": "/__l5e/assets-v1/97e9c65a-2495-4270-9699-e1e620843250/bhutani-infra.png",
  "bl-agro": "/__l5e/assets-v1/8e66c95d-9766-4565-a407-fc623162be58/bl-agro.png",
  capgemini: "/__l5e/assets-v1/6d644071-2323-4f58-ba95-4f6616f2862f/capgemini.png",
  commscope: "/__l5e/assets-v1/2893a0d0-c4a4-4637-8a42-fc00e94d8316/commscope.png",
  den: "/__l5e/assets-v1/1c53eee6-2a13-4c60-bf4b-96d8bd57e68c/den.png",
  essar: "/__l5e/assets-v1/75ce841f-6146-4b57-89aa-b6240ef5b408/essar.png",
  "golder-associates": "/__l5e/assets-v1/1941072b-350b-4d38-947d-fa473ec75377/golder.png",
  "icici-lombard": "/__l5e/assets-v1/485d2930-d139-442b-840a-ae9fb8e02d4b/icici-lombard.png",
  igl: "/__l5e/assets-v1/09a4d9ba-edd8-4ae2-9b69-e1d826dd0698/igl.png",
  imgc: "/__l5e/assets-v1/de35ec2d-283d-40d1-b9bc-563f4fc4515e/imgc.png",
  invenio: "/__l5e/assets-v1/c7ff2729-c9b1-46b3-b342-9a9a8c705f41/invenio.png",
  jcpenney: "/__l5e/assets-v1/3cdb61a6-7453-453e-99f7-95f4a29fad7f/jcpenney.png",
  "kotak-securities": "/__l5e/assets-v1/90e851cf-c47f-465d-a019-923534d27b2b/kotak-securities.png",
  lakhani: "/__l5e/assets-v1/485c5807-8323-437e-86f5-e7ec6527d310/lakhani-vardaan.png",
  "larsen-toubro": "/__l5e/assets-v1/7e451148-2790-4f25-b45d-a54708b0a741/larsen-toubro.png",
  "nippon-steel": "/__l5e/assets-v1/ec4d129b-6d9a-42ec-bbcd-3215959fd4fe/nippon-steel.png",
  paperpedia: "/__l5e/assets-v1/02ee8dcf-6d18-425e-a081-42975c6b6eee/paperpedia.png",
  "pearson-education": "/__l5e/assets-v1/90871f73-c039-4838-8916-5e702248f04c/pearson.png",
  "prakash-group": "/__l5e/assets-v1/7418033c-8457-47a4-bef2-e232269f3389/prakash.png",
  "qatar-airways": "/__l5e/assets-v1/4b9c4c5a-c99f-43c6-af6d-0fb776a854c8/qatar-airways.png",
  regus: "/__l5e/assets-v1/19421a48-4735-40b2-92c1-3f2175c5fe76/regus.png",
  "tata-advanced-systems":
    "/__l5e/assets-v1/ff33c8ae-2796-448e-a76e-262877e1fa1d/tata-advanced-systems.png",
  "tata-aig": "/__l5e/assets-v1/22e0e757-fb14-4f1f-af3d-3d7224e1383d/tata-aig.png",
  "tata-projects": "/__l5e/assets-v1/382af80b-fd1d-48be-bba6-888bafad88c3/tata-projects.png",
  ultratech: "/__l5e/assets-v1/69c330ac-e637-474f-9eeb-695f5656919b/ultratech-cement.png",
  "united-transformers":
    "/__l5e/assets-v1/be87d6eb-4ffd-42e6-8ed7-c81393982d3c/united-transformers.png",
  "vs-seair-logistics": "/__l5e/assets-v1/27e1062d-c4c7-480e-8aab-c7b4c6183010/vs-delivering.png",
  "world-trade-park": "/__l5e/assets-v1/8a71aa8e-5134-4d5f-9fb1-242a41204807/wtp.png",
  "world-trade-tower": "/__l5e/assets-v1/74b9f3a0-74e2-4d4b-90f5-0a985207e4e2/wtt.png",
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
