/**
 * Search corpus (performance): the pure data-shaping half of the search
 * overlay, split into its own side-effect-free module so every page can
 * build the corpus for a future overlay open WITHOUT pulling the overlay's
 * interactive component (focus trap, routing, filtering UI) into the
 * initial JS bundle. The component itself loads on demand via
 * `./overlays` (React.lazy).
 */

export type SearchDoc = {
  kind: "Project" | "Service" | "Practice" | "Sector" | "Person" | "Client" | "Credential";
  title: string;
  detail: string;
  href: string;
};

export type SearchCorpus = SearchDoc[];

/**
 * Build the searchable corpus from data that is actually live today.
 * Extensible: callers append more SearchDocs as entity tables come online.
 * The people / clients / credentials sets are optional — every published
 * surface passes them, but callers that predate the expanded index keep
 * working unchanged (the fields default to empty).
 */
export function buildSearchCorpus(input: {
  services: { name: string; slug: string; body?: string | null }[];
  sectors: { name: string }[];
  projects: { title: string; detail: string; slug?: string }[];
  people?: { name: string; role: string }[];
  clients?: { name: string; note: string | null }[];
  credentials?: { title: string; issuer: string }[];
}): SearchCorpus {
  const docs: SearchCorpus = [];
  for (const s of input.services)
    docs.push({
      kind: "Service",
      title: s.name,
      detail: s.body?.slice(0, 110) ?? "Service",
      href: "/services",
    });
  docs.push(
    {
      kind: "Practice",
      title: "UG Utilities, Electrical & CGD",
      detail: "Underground HT/LT cable networks, city gas distribution, HDD trenchless",
      href: "/services",
    },
    {
      kind: "Practice",
      title: "MEP, Fire Fighting & Fire Protection",
      detail: "HVAC, VRV, hydrant & sprinkler systems, integrated MEP",
      href: "/services",
    },
  );
  for (const p of input.projects)
    docs.push({
      kind: "Project",
      title: p.title,
      detail: p.detail,
      href: p.slug ? `/projects/${p.slug}` : "/projects",
    });
  for (const s of input.sectors)
    docs.push({ kind: "Sector", title: s.name, detail: "Sector", href: "/sectors" });
  for (const m of input.people ?? [])
    docs.push({ kind: "Person", title: m.name, detail: m.role, href: "/team" });
  for (const c of input.clients ?? [])
    docs.push({
      kind: "Client",
      title: c.name,
      detail: c.note ?? "Client of record",
      href: "/clients",
    });
  for (const r of input.credentials ?? [])
    docs.push({ kind: "Credential", title: r.title, detail: r.issuer, href: "/credentials" });
  return docs;
}
