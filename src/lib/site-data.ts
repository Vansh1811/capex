import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  PROJECT_CORPUS,
  CORPUS_TOTAL_DOCUMENTED,
  CORPUS_SOURCE_NOTE,
  CORPUS_IMAGE,
  type ProjectRecord,
} from "@/lib/project-corpus";
import { resolveProjectMedia, type ProjectMediaEntry } from "@/lib/project-media";
import { PEOPLE_CORPUS, PEOPLE_TOTAL_NAMED, PEOPLE_SOURCE_NOTE } from "@/lib/people-corpus";
import {
  CLIENT_CORPUS,
  CLIENTS_SOURCE_NOTE,
  RELATIONSHIP_TERMS,
  clientFrame,
  type ClientRelationship,
} from "@/lib/client-corpus";
import { SITE_SETTINGS, SITE_OFFICES, SITE_REGISTRATIONS } from "@/lib/site-settings";
import {
  SERVICE_CORPUS,
  PRACTICE_CORPUS,
  HDD_FLEET,
  EQUIPMENT_REGISTER,
  SERVICES_SOURCE_NOTE,
  type ServiceRecord,
} from "@/lib/services-corpus";
import { SECTOR_CORPUS } from "@/lib/sector-corpus";
import {
  CREDENTIALS_CORPUS,
  GST_STATES,
  RECORD_MILESTONES,
  CREDENTIALS_SOURCE_NOTE,
} from "@/lib/credentials-corpus";

/**
 * Public site data (minimal backend architecture, 2026-09).
 *
 * The website is a premium STATIC frontend: every public surface — the
 * archive, the capability register, the sector atlas, the roster, the
 * clients registry, the credentials register, the search corpus, the nav
 * chrome — is composed from the verified corpora in src/lib/*-corpus.ts.
 * No content reads a database. Supabase is used only to persist the two
 * submission flows (enquiries and credential requests — see
 * src/lib/cms.functions.ts and src/lib/credentials.ts).
 *
 * These server functions remain the data layer's public contract so the
 * frozen routes/components keep their exact shapes; each one now composes
 * its DTO directly from the corpus (the shape the previous DB-first reads
 * fell back to on every page — i.e. the data the site has been rendering
 * all along). Returned `source` fields now say "corpus" for every page.
 */

// ---------- projects archive (editorial experience) ----------

export type ArchiveProject = {
  ref: string;
  title: string;
  slug: string;
  practice: 1 | 2;
  practice_label: string;
  practice_name: string;
  practice_slug: string;
  city: string;
  state: string;
  status: "completed" | "ongoing" | "unconfirmed";
  scope_line: string;
  metrics: { label: string; value: string; unit: string }[];
  client_display: string | null;
  services: { name: string; slug: string }[];
  sectors: { name: string; slug: string }[];
  featured: boolean;
  image: string;
  source_ref: string;
  /** The media registry entry — the single source of the record's visual asset. */
  media: ProjectMediaEntry;
};

/** The work — composed ONLY from a record's own verified fields. Never invented. */
export function composeWorkNarrative(p: ArchiveProject): string {
  const svc = p.services.map((s) => s.name).join(", ");
  const metric = p.metrics[0]
    ? `${p.metrics[0].value}${p.metrics[0].unit ? ` ${p.metrics[0].unit}` : ""} ${p.metrics[0].label.toLowerCase()}`
    : "";
  const who = p.client_display ? ` for ${p.client_display}` : "";
  const practiceWord =
    p.practice === 1
      ? "Practice One — UG Utilities, Electrical & CGD"
      : "Practice Two — MEP, Fire Fighting & Fire Protection";
  const verb = p.status === "ongoing" ? "is executing" : "delivered";
  const sentences: string[] = [];
  sentences.push(
    metric
      ? `Capex ${verb} ${p.scope_line}${who} — ${metric} on record.`
      : `Capex ${verb} ${p.scope_line}${who}.`,
  );
  if (svc)
    sentences.push(
      `The documented scope: ${svc}, under ${practiceWord}${
        p.status === "ongoing" ? ". The programme is ongoing." : "."
      }`,
    );
  return sentences.join(" ");
}

/**
 * The published archive — the corpus IS the published set. Each record's
 * `image` is resolved through the media registry (its single source of
 * truth); `status` is the single authoritative completed/ongoing field —
 * every archive, count, filter and search derives from it.
 */
function loadArchive(): { projects: ArchiveProject[] } {
  return {
    projects: PROJECT_CORPUS.map((p) => ({
      ...p,
      image: CORPUS_IMAGE[p.image],
      media: resolveProjectMedia(p.slug),
    })),
  };
}

/**
 * Archive ordering, shared by every surface: featured flagships first
 * (WTT → Patna → Banaras → Lucknow Metro), then the remaining records in
 * sheet order, each within its status set. Ongoing records keep their own
 * corpus order (P1-101…) — the register reads as a live programme list.
 */
function orderArchive(projects: ArchiveProject[]): ArchiveProject[] {
  const byStatus = (s: "completed" | "ongoing") => {
    const set = projects.filter((p) => p.status === s);
    const featured = set.filter((p) => p.featured);
    const rest = set.filter((p) => !p.featured);
    return [...featured, ...rest];
  };
  return [...byStatus("completed"), ...byStatus("ongoing")];
}

/** Facets computed over one status set (filters are per-archive). */
function archiveFacets(projects: ArchiveProject[]) {
  const states = [...new Set(projects.map((p) => p.state))].sort();
  const sectors = [
    ...new Map(projects.flatMap((p) => p.sectors).map((s) => [s.slug, s])).values(),
  ].sort((a, b) => a.name.localeCompare(b.name));
  const services = [
    ...new Map(projects.flatMap((p) => p.services).map((s) => [s.slug, s])).values(),
  ].sort((a, b) => a.name.localeCompare(b.name));
  return { states, sectors, services };
}

export const getProjectsArchive = createServerFn({ method: "GET" }).handler(async () => {
  const { projects } = loadArchive();
  const ordered = orderArchive(projects);
  const completed = projects.filter((p) => p.status === "completed");
  const ongoing = projects.filter((p) => p.status === "ongoing");
  const facets = archiveFacets(projects);

  return {
    projects: ordered,
    published: projects.length,
    documented: CORPUS_TOTAL_DOCUMENTED,
    completedCount: completed.length,
    ongoingCount: ongoing.length,
    states: facets.states,
    sectors: facets.sectors,
    services: facets.services,
    sourceNote: CORPUS_SOURCE_NOTE,
    source: "corpus",
  };
});

export const getProjectCaseStudy = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string().max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { projects } = loadArchive();
    const project = projects.find((p) => p.slug === data.slug) ?? null;
    if (!project) return null;

    // Next project: the record that follows in the same status register,
    // wrapping within that register — Completed stays Completed, Ongoing
    // stays Ongoing, so no archive link crosses the two worlds.
    const register = orderArchive(projects).filter((p) => p.status === project.status);
    const idx = register.findIndex((p) => p.slug === data.slug);
    const next = register[(idx + 1) % register.length];

    // Related: same sector, then same state — register order keeps it stable.
    const related = projects
      .filter(
        (p) =>
          p.slug !== data.slug &&
          (p.sectors.some((s) => project.sectors.some((m) => m.slug === s.slug)) ||
            p.state === project.state),
      )
      .slice(0, 3);

    return {
      project,
      related:
        related.length > 0 ? related : projects.filter((p) => p.slug !== data.slug).slice(0, 2),
      next,
      work: composeWorkNarrative(project),
      source: "corpus",
    };
  });

// ---------- clients page (relationship archive) ----------

export type ClientsPageClient = {
  id: string;
  name: string;
  slug: string;
  relationship: ClientRelationship;
  /** One verified line from the registry, or null. */
  note: string | null;
  /** Published associated work, joined to the corpus record. */
  projects: {
    slug: string;
    title: string;
    city: string;
    state: string;
    practice_label: string;
    sector: string | null;
    figure: string;
    image: string;
  }[];
  /** Verified relationship terms present in the data, e.g. ["Direct client"]. */
  terms: string[];
  /** Atmosphere frame key for the hover plate (implementation material). */
  image: string;
  source_ref: string;
};

/**
 * Compose the published registry from the audited corpus: clients joined to
 * their published project records. Project links render ONLY when the corpus
 * record exists (the projects archive is the single source of which records
 * are published), so a hidden record never surfaces as a client association.
 */
function composeClientRegistry() {
  const clients: ClientsPageClient[] = CLIENT_CORPUS.map((c) => {
    const projects = c.projects
      .map((slug) => PROJECT_CORPUS.find((p) => p.slug === slug))
      .filter((p): p is ProjectRecord => Boolean(p))
      .map((p) => ({
        slug: p.slug,
        title: p.title.replace(" — HVAC & Fire", "").replace(" — HVAC", "").replace(" — Fire", ""),
        city: p.city,
        state: p.state,
        practice_label: p.practice_label,
        sector: p.sectors[0]?.name ?? null,
        figure: p.metrics[0]
          ? `${p.metrics[0].value}${p.metrics[0].unit ? ` ${p.metrics[0].unit}` : ""}`
          : "",
        image: resolveProjectMedia(p.slug).src,
      }));
    return {
      id: c.slug,
      name: c.name,
      slug: c.slug,
      relationship: c.relationship,
      note: c.note,
      projects,
      terms: [RELATIONSHIP_TERMS[c.relationship]],
      image: CORPUS_IMAGE[clientFrame(c.projects)],
      source_ref: c.source_ref,
    };
  });
  const sorted = [...clients].sort((a, b) => a.name.localeCompare(b.name));
  const withWork = sorted.filter((c) => c.projects.length > 0);
  const clientsOfRecord = withWork.filter(
    (c) => c.relationship === "client" || c.relationship === "epc_counterparty",
  );
  const associations = sorted.filter(
    (c) => c.relationship === "pmc" || c.relationship === "architect",
  );
  return {
    clients: sorted,
    categories: [] as { id: string; name: string; slug: string }[],
    source: "corpus" as const,
    relationshipCounts: {
      clientsOfRecord: clientsOfRecord.length,
      counterparties: sorted.filter((c) => c.relationship === "epc_counterparty").length,
      associations: associations.length,
      withWork: withWork.length,
    },
    clientsNote: CLIENTS_SOURCE_NOTE,
  };
}

// ---------- capabilities page (THE ENGINE ROOM) ----------

export type CapabilityService = {
  n: number;
  name: string;
  slug: string;
  tagline: string | null;
  standfirst: string;
  overview: string;
  included: string[];
  practice: 1 | 2;
  practice_name: string;
  practice_slug: string;
  source_ref: string;
  plate: string;
  platePosition: string;
  plateAlt: string;
  projects: {
    ref: string;
    title: string;
    slug: string;
    city: string;
    state: string;
    figure: string | null;
    practice: 1 | 2;
  }[];
  sectors: { name: string; slug: string }[];
  places: string[];
  figure: string | null;
};

export type CapabilityPractice = {
  number: 1 | 2;
  name: string;
  short_label: string;
  slug: string;
  scope_line: string;
  source_ref: string;
  plate: string;
  plateAlt: string;
  services: CapabilityService[];
  projectCount: number;
};

export type CapabilitiesPageData = {
  practices: CapabilityPractice[];
  services: CapabilityService[];
  fleet: { tonnes: number }[];
  equipment: { item: string; spec: string | null; qty?: string }[];
  sourceNote: string;
  source: "database" | "corpus";
};

/** The published archive's figure of record for a corpus project row. */
function capabilityFigure(p: ProjectRecord): string | null {
  const m = p.metrics[0];
  return m ? `${m.value}${m.unit ? ` ${m.unit}` : ""}` : null;
}

/** Compose the Engine Room DTO from the verified services corpus. */
function composeCapabilities(): CapabilitiesPageData {
  const byPractice = new Map(PRACTICE_CORPUS.map((p) => [p.number, p]));
  const services: CapabilityService[] = SERVICE_CORPUS.map((s) => {
    const practice = byPractice.get(s.practice)!;
    return {
      n: s.n,
      name: s.name,
      slug: s.slug,
      tagline: s.tagline,
      standfirst: s.standfirst,
      overview: s.overview,
      included: s.included,
      practice: s.practice,
      practice_name: practice.name,
      practice_slug: practice.slug,
      source_ref: s.source_ref,
      plate: s.plate,
      platePosition: s.platePosition,
      plateAlt: s.plateAlt,
      projects: s.projects.map((p) => ({
        ref: p.ref,
        title: p.title,
        slug: p.slug,
        city: p.city,
        state: p.state,
        figure: capabilityFigure(p),
        practice: p.practice,
      })),
      sectors: s.sectors,
      places: s.places,
      figure: s.figure,
    };
  });
  return {
    practices: PRACTICE_CORPUS.map((p) => ({
      number: p.number,
      name: p.name,
      short_label: p.short_label,
      slug: p.slug,
      scope_line: p.scope_line,
      source_ref: p.source_ref,
      plate: p.plate,
      plateAlt: p.plateAlt,
      services: services.filter((s) => s.practice === p.number),
      projectCount: p.projectCount,
    })),
    services,
    fleet: HDD_FLEET,
    equipment: EQUIPMENT_REGISTER,
    sourceNote: SERVICES_SOURCE_NOTE,
    source: "corpus",
  };
}

export const getCapabilitiesPage = createServerFn({ method: "GET" }).handler(async () =>
  composeCapabilities(),
);

/** Single service detail read — same corpus contract as the register. */
export const getCapabilityDetail = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string().max(120) }).parse(d))
  .handler(async ({ data }) => {
    const page = composeCapabilities();
    const service = page.services.find((s) => s.slug === data.slug) ?? null;
    if (!service) return null;
    const practice = page.practices.find((p) => p.number === service.practice) ?? null;
    // The register's next discipline, in archive order — for the onward link.
    const idx = page.services.findIndex((s) => s.slug === service.slug);
    const next = page.services[(idx + 1) % page.services.length];
    return { service, practice, next, sourceNote: page.sourceNote, source: page.source };
  });

// ---------- sectors ----------

export type AtlasSector = {
  n: number;
  slug: string;
  name: string;
  evidence_tier: "hub" | "service_led" | "list_only";
  standfirst: string | null;
  source_ref: string;
  plate: string;
  projectCount: number;
  services: { name: string; slug: string }[];
  places: string[];
  practices: number[];
};

export type AtlasProjectLink = {
  ref: string;
  title: string;
  slug: string;
  city: string;
  state: string;
  figure: string | null; // first documented metric, if any
  practice: 1 | 2;
};

export type SectorAtlas = {
  sectors: AtlasSector[];
  /** The published archive's project links, per sector slug. */
  linksBySector: Record<string, AtlasProjectLink[]>;
  documented: number;
  sourceNote: string;
};

function figureOf(metrics: { label: string; value: string; unit: string }[]): string | null {
  const m = metrics[0];
  return m ? `${m.value}${m.unit ? ` ${m.unit}` : ""}` : null;
}

/** The verified atlas — the audited sector rows + the archive's own links. */
function loadSectorAtlas(): SectorAtlas {
  const linksBySector: Record<string, AtlasProjectLink[]> = {};
  const sectors: AtlasSector[] = SECTOR_CORPUS.map((s) => {
    linksBySector[s.slug] = s.projects.map((p) => ({
      ref: p.ref,
      title: p.title,
      slug: p.slug,
      city: p.city,
      state: p.state,
      figure: figureOf(p.metrics),
      practice: p.practice,
    }));
    return {
      n: s.n,
      slug: s.slug,
      name: s.name,
      evidence_tier: s.evidence_tier,
      standfirst: s.standfirst,
      source_ref: s.source_ref,
      plate: s.plate,
      projectCount: s.projects.length,
      services: s.services,
      places: s.places,
      practices: s.practices,
    };
  });
  return {
    sectors,
    linksBySector,
    documented: CORPUS_TOTAL_DOCUMENTED,
    sourceNote: CORPUS_SOURCE_NOTE,
  };
}

export const getSectorsAtlas = createServerFn({ method: "GET" }).handler(async () =>
  loadSectorAtlas(),
);

export const getSectorPlate = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string().max(120) }).parse(d))
  .handler(async ({ data }) => {
    const atlas = loadSectorAtlas();
    const sector = atlas.sectors.find((s) => s.slug === data.slug) ?? null;
    if (!sector) return null;
    const links = atlas.linksBySector[data.slug] ?? [];
    return { sector, links, services: sector.services };
  });

// ---------- company pages ----------

export type RosterPerson = {
  name: string;
  role: string;
  group: "leadership" | "delivery" | "site_design";
  practice: 1 | 2 | null;
  practice_label: string;
  profile?: string[];
  experience?: string;
  focus?: string[];
  responsibility?: string;
};

export type PeopleRoster = {
  people: RosterPerson[];
  totalNamed: number;
  sourceNote: string;
  source: "database" | "corpus";
};

export const getPeopleRoster = createServerFn({ method: "GET" }).handler(async () => {
  return {
    people: PEOPLE_CORPUS.map(
      ({ name, role, group, practice, practice_label, profile, experience, focus, responsibility }) => ({
        name,
        role,
        group,
        practice,
        practice_label,
        profile,
        experience,
        focus,
        responsibility,
      }),
    ),
    totalNamed: PEOPLE_TOTAL_NAMED,
    sourceNote: PEOPLE_SOURCE_NOTE,
    source: "corpus",
  } satisfies PeopleRoster;
});

export const getClientsPage = createServerFn({ method: "GET" }).handler(async () =>
  composeClientRegistry(),
);

// ---------- clients page — signature measures ----------

export type SignatureMeasure = {
  /** The published record this figure belongs to — the measure's only source. */
  slug: string;
  /** Sheet number, e.g. P1-103 — the figure of record's own reference. */
  ref: string;
  title: string;
  city: string;
  state: string;
  status: "completed" | "ongoing";
  practice_label: string;
  /** The record's own metric, verbatim (`220` + `KV`). Never recomputed. */
  value: string;
  unit: string;
  metricLabel: string;
  /** Two-line display caption for the measure (presentational, not a claim). */
  caption: string;
  context: string;
};

/**
 * The four signature measures of the Clients page — the register the
 * exhibition opens on. The selection is presentational (one figure of record
 * per programme theme); every value, unit, city and sheet number is READ from
 * the published record it names. A measure whose record is not in the
 * published corpus — or whose status is unconfirmed — simply does not render,
 * so this strip can never publish a figure the archive does not carry.
 */
const SIGNATURE_MEASURES: {
  slug: string;
  /** Index into the record's metrics — the figure this measure carries. */
  metric: number;
  /** Display labels for the measure (presentational, not a claim). */
  caption: string;
  context: string;
}[] = [
  {
    slug: "lucknow-metro-electrical",
    metric: 1,
    caption: "Lucknow Metro",
    context: "cable works",
  },
  {
    slug: "aurangabad-cmdp-pipe-laying",
    metric: 0,
    caption: "BGRL / Aurangabad",
    context: "gas works",
  },
  { slug: "sangli-lmc-work", metric: 0, caption: "Sangli gas", context: "connections" },
  {
    slug: "world-trade-tower-hvac-fire",
    metric: 0,
    caption: "WTT Noida",
    context: "HVAC installation",
  },
];

export const getSignatureMeasures = createServerFn({ method: "GET" }).handler(async () =>
  SIGNATURE_MEASURES.flatMap((m) => {
    const record = PROJECT_CORPUS.find((p) => p.slug === m.slug);
    const metric = record?.metrics[m.metric];
    if (!record || !metric) return [];
    // Publication rule: only completed/ongoing records ever surface.
    if (record.status === "unconfirmed") return [];
    return [
      {
        slug: record.slug,
        ref: record.ref,
        title: record.title,
        city: record.city,
        state: record.state,
        status: record.status,
        practice_label: record.practice_label,
        value: metric.value,
        unit: metric.unit,
        metricLabel: metric.label,
        caption: m.caption,
        context: m.context,
      } satisfies SignatureMeasure,
    ];
  }),
);

// ---------- credentials page (PROOF OF PRACTICE) ----------

export type RegisterCredential = {
  /** Register index within the published set. */
  n: number;
  title: string;
  /** statutory | membership — the seed's category, ISO/make-in-india gated out. */
  kind: "statutory" | "membership";
  number: string;
  issuer: string;
  jurisdiction: string;
  /** ISO date string or null where the record states none (omitted, never guessed). */
  issued_at: string | null;
  /** 'approved' once a real scan exists — never fabricated. */
  scan: "approved" | "on_request";
  source_ref: string;
};

export type RegisterState = {
  state: string;
  gstinPrefix: string;
  place: string;
  number: string;
  issued_at: string | null;
};

export type RegisterMilestone = { year: string; label: string; note: string };

export type CredentialsRegister = {
  credentials: RegisterCredential[];
  gstStates: RegisterState[];
  milestones: RegisterMilestone[];
  sourceNote: string;
  source: "database" | "corpus";
};

export const getCredentialsPage = createServerFn({ method: "GET" }).handler(async () => {
  return {
    credentials: CREDENTIALS_CORPUS,
    gstStates: GST_STATES,
    milestones: RECORD_MILESTONES,
    sourceNote: CREDENTIALS_SOURCE_NOTE,
    source: "corpus",
  } satisfies CredentialsRegister;
});

// ---------- contact page (THE OPEN LINE) ----------

export type ContactCapability = { name: string; slug: string; practice: 1 | 2 };

export type ContactOffice = { city: string; role: string };

export type ContactPageData = {
  phone: string;
  email: string;
  capabilities: ContactCapability[];
  offices: ContactOffice[];
  source: "database" | "fallback";
};

/** The capability index — the 11 verified disciplines from the services corpus. */
function contactCapabilities(): ContactCapability[] {
  return SERVICE_CORPUS.map((s: ServiceRecord) => ({
    name: s.name,
    slug: s.slug,
    practice: s.practice,
  }));
}

export const getContactPageData = createServerFn({ method: "GET" }).handler(async () => {
  return {
    phone: SITE_SETTINGS.contact_phone,
    email: SITE_SETTINGS.contact_email,
    capabilities: contactCapabilities(),
    offices: SITE_OFFICES,
    source: "fallback",
  } satisfies ContactPageData;
});

/** Practice identifiers for the enquiry payload — the corpus slugs. */
export const getContactOptions = createServerFn({ method: "GET" }).handler(async () => {
  return {
    services: SERVICE_CORPUS.map((s) => ({ name: s.name, slug: s.slug, practice: s.practice })),
    practices: PRACTICE_CORPUS.map((p) => ({
      id: p.slug,
      number: p.number,
      name: p.name,
      short_label: p.short_label,
      slug: p.slug,
    })),
  };
});

// ---------- search corpus ----------

/** Searchable surface — the verified corpora, composed for the overlay. */
export const getSearchCorpus = createServerFn({ method: "GET" }).handler(async () => {
  return {
    services: SERVICE_CORPUS.map((s) => ({ name: s.name, slug: s.slug, body: s.overview })),
    sectors: SECTOR_CORPUS.map((s) => ({ name: s.name })),
    // Verified entries only — quantities from the audited record (DOC B/C).
    // Featured flagships first, then the remaining published archive rows
    // with their documented figure + city. Status + client travel with each
    // row so search stays consistent with the two archives; slugs let the
    // overlay link straight to the record.
    projects: [
      ...PROJECT_CORPUS.filter((p) => p.featured),
      ...PROJECT_CORPUS.filter((p) => !p.featured),
    ].map((p) => ({
      title: p.title,
      detail: `${p.metrics[0] ? `${p.metrics[0].value}${p.metrics[0].unit ? ` ${p.metrics[0].unit}` : ""} · ` : ""}${p.city} · ${p.status === "ongoing" ? "Ongoing" : "Completed"}`,
      slug: p.slug,
    })),
    // The published roster — names + roles (the People page's own record).
    people: PEOPLE_CORPUS.map((m) => ({ name: m.name, role: m.role })),
    // The published client registry — names + one verified line each.
    clients: CLIENT_CORPUS.map((c) => ({ name: c.name, note: c.note })),
    // The published credentials register — title + issuer.
    credentials: CREDENTIALS_CORPUS.map((r) => ({ title: r.title, issuer: r.issuer })),
  };
});

// ---------- nav/footer chrome ----------

/** Nav data contract for the Header (practices grouped, services linked). */
export type NavChrome = {
  settings: Record<string, string>;
  practices: { id: string; number: number; name: string; short_label: string; slug: string }[];
  services: { name: string; slug: string; practice_id: string }[];
  careersActive: boolean;
  cin: string;
  udyam: string;
};

export const getNavChrome = createServerFn({ method: "GET" }).handler(async () => {
  return {
    settings: SITE_SETTINGS,
    practices: PRACTICE_CORPUS.map((p) => ({
      id: p.slug,
      number: p.number,
      name: p.name,
      short_label: p.short_label,
      slug: p.slug,
    })),
    services: SERVICE_CORPUS.map((s) => ({
      name: s.name,
      slug: s.slug,
      practice_id: s.practice === 1 ? "practice-one" : "practice-two",
    })),
    careersActive: false,
    cin: SITE_REGISTRATIONS.cin,
    udyam: SITE_REGISTRATIONS.udyam,
  } satisfies NavChrome;
});
