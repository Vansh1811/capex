import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getProjectsArchive, getSearchCorpus, type ArchiveProject } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { Closing } from "@/components/site/home/Closing";
import { Reveal } from "@/components/site/home/Reveal";
import {
  ArchiveNav,
  FilterOverlay,
  RegisterOverlay,
} from "@/components/site/projects/ArchiveVocabulary";
import {
  CompletedOpening,
  CompletedField,
  CompletedClose,
} from "@/components/site/projects/ArchiveScenes";
import { ProjectsExperience } from "@/components/site/projects/ProjectsExperience";
import { buildSearchCorpus } from "@/components/site/home/SearchOverlay";

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
          "The record of Capex's delivered work — completed underground utilities, electrical, CGD, HVAC and fire protection projects across India, each with its documented client, quantity and place.",
      },
      { property: "og:title", content: "Capex Completed Projects — The Record" },
      { property: "og:type", content: "website" },
    ],
  }),
});

/**
 * THE RECORD — the Completed archive. Every project shown derives from the
 * corpus's single authoritative status field; counts derive at render; the
 * hang is deterministic (see ArchiveScenes.CompletedField). Filter state lives
 * in the URL (shareable); the Register overlay holds the complete index.
 */
function CompletedArchive() {
  const search = Route.useSearch();
  const router = useRouter();
  const { data } = useSuspenseQuery(searchQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const [filterOpen, setFilterOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);

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

  // nav tone follows the room beneath it (dark scenes render the nav light)
  const [navOverDark, setNavOverDark] = useState(true);
  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("#main [data-tone]"));
    if (scenes.length === 0) return;
    const visible = new Map<HTMLElement, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target as HTMLElement, e.isIntersecting);
        const live = scenes
          .filter((s) => visible.get(s))
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
        if (live) setNavOverDark(live.dataset.tone !== "light");
      },
      { rootMargin: "-72px 0px -35% 0px", threshold: 0 },
    );
    for (const s of scenes) io.observe(s);
    return () => io.disconnect();
  }, [indexOpen]);

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

  const onPlace = (stateSlug: string) => setFilter({ state: stateSlug });

  return (
    <ProjectsExperience brandWordmark="CAPEX" corpus={corpus}>
      <ArchiveNav
        overDark={navOverDark}
        brandWordmark="CAPEX"
        state="completed"
        completedCount={data.completedCount}
        ongoingCount={data.ongoingCount}
        onOpenIndex={() => setIndexOpen(true)}
        indexActive={indexOpen}
        onOpenFilter={() => setFilterOpen(true)}
        filterActive={anyFilter}
      />
      <main id="main">
        <CompletedOpening
          total={filtered.length === completed.length ? completed.length : filtered.length}
          practices={2}
          onOpenIndex={() => setIndexOpen(true)}
        />

        {/* filtered notice — the archive's quiet state line */}
        {anyFilter && (
          <div className="paper mx-auto flex max-w-[1680px] flex-wrap items-baseline gap-6 bg-background px-6 pt-14 md:px-10 lg:px-12">
            <Reveal>
              <p className="font-tech text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {filtered.length} project{filtered.length === 1 ? "" : "s"} — filtered
              </p>
            </Reveal>
            <button
              onClick={() =>
                setFilter({ practice: undefined, sector: undefined, state: undefined })
              }
              className="font-tech text-[11px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Reset
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="paper mx-auto max-w-[1680px] bg-background px-6 py-32 md:px-10 lg:px-12">
            <p className="font-display text-2xl font-normal text-foreground/80">
              No completed projects match these filters.
            </p>
            <button
              onClick={() =>
                setFilter({ practice: undefined, sector: undefined, state: undefined })
              }
              className="mt-6 font-tech text-[11px] uppercase tracking-[0.24em] text-foreground underline-offset-4 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <CompletedField projects={filtered} total={filtered.length} onPlace={onPlace} />
        )}

        <CompletedClose ongoingCount={data.ongoingCount} />
      </main>
      <Closing />
      <RegisterOverlay
        open={indexOpen}
        onClose={() => setIndexOpen(false)}
        projects={filtered}
        stateLabel="Completed"
        count={filtered.length}
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
