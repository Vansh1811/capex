import { useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getProjectsArchive, getSearchCorpus, type ArchiveProject } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { Closing } from "@/components/site/home/Closing";
import { RegisterOpening, RegisterClose } from "@/components/site/projects/RegisterPanels";
import { FilterOverlay } from "@/components/site/projects/ArchiveVocabulary";
import {
  EmptyRegister,
  FilteredNotice,
  FilterTrigger,
  PanelField,
  StateLinks,
  type ArchiveSearch,
} from "@/components/site/projects/RegisterPanels";
import { ProjectsExperience } from "@/components/site/projects/ProjectsExperience";
import { buildSearchCorpus } from "@/components/site/home/search-corpus";

type Search = {
  practice?: string;
  sector?: string;
  state?: string;
};

const searchQuery = queryOptions({
  queryKey: ["public", "projects-archive"],
  queryFn: () => getProjectsArchive(),
  ...PUBLIC_QUERY_DEFAULTS,
});

const searchCorpusQuery = queryOptions({
  queryKey: ["public", "search-corpus"],
  queryFn: () => getSearchCorpus(),
  ...PUBLIC_QUERY_DEFAULTS,
});

export const Route = createFileRoute("/projects/completed")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    practice: typeof s.practice === "string" ? s.practice : undefined,
    sector: typeof s.sector === "string" ? s.sector : undefined,
    state: typeof s.state === "string" ? s.state : undefined,
  }),
  component: CompletedArchive,
  head: () => ({
    meta: [
      { title: "Completed Projects — The Record | Capex Construction & Engineering" },
      {
        name: "description",
        content:
          "The record of Capex's delivered work — completed underground utilities, electrical, CGD, HVAC and fire protection projects, each with its documented client, quantity and place.",
      },
      { property: "og:title", content: "Capex Completed Projects — The Record" },
      { property: "og:type", content: "website" },
    ],
  }),
});

/**
 * THE COMPLETED ARCHIVE — one state of the register, on the shared panel
 * system. Compact typographic opening, the state links, the quiet filter
 * layer. Records derive from the corpus's single authoritative status
 * field; counts derive at render. Filter state lives in the URL.
 */
function CompletedArchive() {
  const search = Route.useSearch();
  const router = useRouter();
  const { data } = useSuspenseQuery(searchQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const [filterOpen, setFilterOpen] = useState(false);

  const corpus = useMemo(
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

  const setFilter = (patch: Partial<Search>) =>
    router.navigate({
      to: "/projects/completed",
      search: (prev: Search) => ({ ...prev, ...patch }),
      replace: true,
    });

  const anyFilter = Boolean(search.practice || search.sector || search.state);

  const completed = useMemo(
    () => data.projects.filter((p) => p.status === "completed"),
    [data.projects],
  );

  const filtered = useMemo(
    () =>
      completed.filter(
        (p) =>
          (!search.practice || p.practice_slug === search.practice) &&
          (!search.sector || p.sectors.some((s) => s.slug === search.sector)) &&
          (!search.state ||
            p.state.toLowerCase().replace(/\s+/g, "-") === search.state.toLowerCase()),
      ),
    [completed, search],
  );

  // facet options computed over the completed set with live counts
  const countBy = (pred: (p: ArchiveProject) => boolean) => completed.filter(pred).length;
  const facets = [
    {
      key: "practice" as const,
      label: "Practice",
      options: [
        {
          value: "ug-utilities-electrical",
          label: "UG Utilities, Electrical & CGD",
          count: countBy((p) => p.practice_slug === "ug-utilities-electrical"),
        },
        {
          value: "mep-fire-protection",
          label: "MEP, HVAC & Fire Protection",
          count: countBy((p) => p.practice_slug === "mep-fire-protection"),
        },
      ],
    },
    {
      key: "sector" as const,
      label: "Sector",
      options: data.sectors
        .map((s) => ({
          value: s.slug,
          label: s.name,
          count: countBy((p) => p.sectors.some((x) => x.slug === s.slug)),
        }))
        .filter((o) => o.count > 0),
    },
    {
      key: "state" as const,
      label: "Location",
      options: data.states
        .map((s) => ({
          value: s.toLowerCase().replace(/\s+/g, "-"),
          label: s,
          count: countBy((p) => p.state === s),
        }))
        .filter((o) => o.count > 0),
    },
  ];

  return (
    <ProjectsExperience brandWordmark="CAPEX" corpus={corpus} footer={<Closing />}>
      <RegisterOpening
        eyebrow="Projects · State of record"
        title="Completed"
        copy="The record of systems built — delivered, commissioned and handed over across infrastructure and buildings. Every project states its documented client, quantity and place."
        meta={
          <>
            <StateLinks
              current="completed"
              completedCount={data.completedCount}
              ongoingCount={data.ongoingCount}
              search={search as ArchiveSearch}
            />
            <FilterTrigger active={anyFilter} onOpen={() => setFilterOpen(true)} />
          </>
        }
      />

      {anyFilter && (
        <div className="mx-auto max-w-[1680px] px-6 md:px-10 lg:px-12">
          <FilteredNotice
            count={filtered.length}
            noun="records"
            onReset={() => setFilter({ practice: undefined, sector: undefined, state: undefined })}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyRegister
          label="completed"
          onClear={() => setFilter({ practice: undefined, sector: undefined, state: undefined })}
        />
      ) : (
        <div className="mx-auto max-w-[1680px] px-6 pb-20 pt-8 md:px-10 md:pt-10 lg:px-12">
          <PanelField projects={filtered} />
        </div>
      )}

      <RegisterClose
        eyebrow="The record continues"
        heading="What Capex has built. What Capex is building."
        label="Ongoing"
        note={`${data.ongoingCount} programmes`}
        to="/projects/ongoing"
      />

      <FilterOverlay
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        facets={facets}
        active={search}
        onApply={(patch) => setFilter(patch)}
        onClear={() => setFilter({ practice: undefined, sector: undefined, state: undefined })}
      />
    </ProjectsExperience>
  );
}
