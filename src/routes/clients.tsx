import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import {
  getClientsPage,
  getNavChrome,
  getSearchCorpus,
  type ClientsPageClient,
} from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/SearchOverlay";
import { ClientsExperience } from "@/components/site/clients/ClientsExperience";
import { Opening } from "@/components/site/clients/Opening";
import { RelationshipField } from "@/components/site/clients/RelationshipField";
import { ClientIndex } from "@/components/site/clients/ClientIndex";
import { LargeRelationship, PhotographicField } from "@/components/site/clients/Interruptions";
import { FilterLine, ClientsClosing } from "@/components/site/clients/Vocabulary";

const chromeQuery = queryOptions({
  queryKey: ["public", "chrome"],
  queryFn: () => getNavChrome(),
  ...PUBLIC_QUERY_DEFAULTS,
});

const searchCorpusQuery = queryOptions({
  queryKey: ["public", "search-corpus"],
  queryFn: () => getSearchCorpus(),
  ...PUBLIC_QUERY_DEFAULTS,
});

const clientsQuery = queryOptions({
  queryKey: ["public", "clients"],
  queryFn: () => getClientsPage(),
  ...PUBLIC_QUERY_DEFAULTS,
});

export const Route = createFileRoute("/clients")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(clientsQuery),
      context.queryClient.ensureQueryData(chromeQuery),
      context.queryClient.ensureQueryData(searchCorpusQuery),
    ]),
  component: ClientsPage,
  head: () => ({
    meta: [
      { title: "Clients — Capex Construction & Engineering" },
      {
        name: "description",
        content:
          "Trust, in practice — the clients, EPC counterparties and associated architects & PMCs connected to Capex's documented work.",
      },
    ],
  }),
});

/**
 * THE RELATIONSHIP ARCHIVE — the Clients page as a curated record of
 * relationships. One shared selection state drives the whole page: the
 * RelationshipField, the index's preview plate, and the large-relationship
 * interruption all read from it (whichever interaction touched last).
 * Filtering narrows the same editorial index — typographic controls, no
 * dashboard bar. Sections change environment deliberately: deep earth →
 * ivory → warm stone → ink photograph → ivory → black close.
 */

type Filter = "all" | "clients" | "counterparties" | "associations";

const FILTER_TERMS: Record<Exclude<Filter, "all">, string[]> = {
  clients: ["Direct client"],
  counterparties: ["EPC counterparty"],
  associations: ["Architects / PMC"],
};

function ClientsPage() {
  const { data: chromeData } = useSuspenseQuery(chromeQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const { data } = useSuspenseQuery(clientsQuery);

  const settings = chromeData.settings;
  const corpus: SearchCorpus = useMemo(
    () =>
      buildSearchCorpus({
        services: corpusData.services,
        sectors: corpusData.sectors,
        projects: corpusData.projects,
        people: corpusData.people,
        clients: corpusData.clients,
        credentials: corpusData.credentials,
      }),
    [corpusData],
  );

  const all = data.clients;

  // ---- the shared selection -------------------------------------------
  const [selected, setSelected] = useState<string | null>(null);
  // the standing selection for the RelationshipField: the first client
  // with published work, until the visitor chooses another
  const standing = useMemo(() => all.find((c) => c.projects.length > 0)?.slug ?? null, [all]);
  const fieldClient =
    (selected && all.find((c) => c.slug === selected)) ||
    all.find((c) => c.slug === standing) ||
    null;

  // ---- the filter -------------------------------------------------------
  const [filter, setFilter] = useState<Filter>("all");
  const counts = useMemo(
    () => ({
      all: all.length,
      clients: all.filter((c) => FILTER_TERMS.clients.some((t) => c.terms.includes(t))).length,
      counterparties: all.filter((c) =>
        FILTER_TERMS.counterparties.some((t) => c.terms.includes(t)),
      ).length,
      associations: all.filter((c) => FILTER_TERMS.associations.some((t) => c.terms.includes(t)))
        .length,
    }),
    [all],
  );
  const filterOptions = useMemo(
    () =>
      (
        [
          { value: "all", label: "All", count: counts.all },
          { value: "clients", label: "Direct clients", count: counts.clients },
          { value: "counterparties", label: "Counterparties", count: counts.counterparties },
          { value: "associations", label: "Associations", count: counts.associations },
        ] as { value: Filter; label: string; count: number }[]
      ).filter((o) => o.count > 0),
    [counts],
  );
  const indexClients = useMemo(
    () =>
      filter === "all"
        ? all
        : all.filter((c) => FILTER_TERMS[filter].some((t) => c.terms.includes(t))),
    [all, filter],
  );

  // the flagship relationship: most published work — honest selection
  const flagship = useMemo<ClientsPageClient | null>(() => {
    const pool = indexClients.length > 0 ? indexClients : all;
    return [...pool].sort((a, b) => b.projects.length - a.projects.length)[0] ?? null;
  }, [indexClients, all]);

  // when the filter changes, a stale selection falls back to standing
  useEffect(() => {
    if (selected && !indexClients.some((c) => c.slug === selected)) setSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <ClientsExperience brandWordmark={settings.brand_wordmark || "CAPEX"} corpus={corpus}>
      <Opening counts={data.relationshipCounts} />
      <RelationshipField clients={all} active={fieldClient} onPick={(slug) => setSelected(slug)} />

      {/* the index + its interruptions */}
      <ClientIndex
        clients={indexClients}
        activeSlug={selected}
        onActiveChange={setSelected}
        filter={{ options: filterOptions, active: filter, onChange: (v) => setFilter(v as Filter) }}
      />

      {flagship && flagship.projects.length > 0 && <LargeRelationship client={flagship} />}

      <PhotographicField
        image="/uploads/service-electrical.jpg"
        line="The material world a relationship has to survive."
        caption="Reference imagery — not a documented Capex project"
      />

      {/* second index block — the associations, set as the quiet final
          chapter of the archive rather than a second grid. The chapter head
          and the first names share one composition so the opening doesn't
          hang alone in paper. */}
      <section
        aria-label="Associations"
        data-tone="light"
        className="paper bg-background text-foreground"
      >
        <div className="mx-auto max-w-[1680px] px-6 pb-28 pt-24 md:px-10 md:pt-32 lg:px-12 lg:pb-40">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <p className="eyebrow-sans text-muted-foreground">The associations</p>
              <h2 className="mt-6 max-w-[16ch] text-balance font-display text-[34px] font-normal leading-[1.08] tracking-[-0.02em] md:text-[54px]">
                Worked with, alongside.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-[1.8] text-muted-foreground lg:col-span-4 lg:col-start-8 lg:pb-3">
              Architects and project-management consultants Capex has worked alongside —
              associations stated conservatively, per the record.
            </p>
          </div>
          <ol className="mt-16 grid gap-x-10 md:grid-cols-2 xl:grid-cols-3">
            {all
              .filter((c) => FILTER_TERMS.associations.some((t) => c.terms.includes(t)))
              .map((c) => (
                <li key={c.slug} className="border-t border-border">
                  <div className="flex items-baseline justify-between gap-4 py-5">
                    <span className="font-display text-lg font-normal tracking-[-0.01em] text-foreground/85 md:text-xl">
                      {c.name}
                    </span>
                    <span className="font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
                      {c.terms[0]}
                    </span>
                  </div>
                </li>
              ))}
          </ol>
        </div>
      </section>

      <ClientsClosing />
    </ClientsExperience>
  );
}
