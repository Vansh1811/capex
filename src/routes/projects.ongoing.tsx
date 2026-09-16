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
  OngoingOpening,
  OngoingField,
  OngoingClose,
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

export const Route = createFileRoute("/projects/ongoing")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    practice: typeof s.practice === "string" ? s.practice : undefined,
    sector: typeof s.sector === "string" ? s.sector : undefined,
    state: typeof s.state === "string" ? s.state : undefined,
  }),
  component: OngoingArchive,
  head: () => ({
    meta: [
      { title: "Ongoing Projects — The Live Programme | Capex Construction & Engineering" },
      {
        name: "description",
        content:
          "Capex work currently taking shape — the ongoing live programme of underground utilities, electrical and CGD projects, stated exactly as the company record states it.",
      },
      { property: "og:title", content: "Capex Ongoing Projects — The Live Programme" },
      { property: "og:type", content: "website" },
    ],
  }),
});

/**
 * THE LIVE PROGRAMME — the Ongoing archive. Distinct rhythm from Completed
 * (the programme line, not the hang): a deep-earth opening, stations sequenced
 * along a vertical rule, the breathing status mark. Same data contract —
 * records derive from the single authoritative status field; no dates, no
 * percentages, no phases.
 */
function OngoingArchive() {
  const search = Route.useSearch();
  const router = useRouter();
  const { data } = useSuspenseQuery(searchQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);

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
      to: "/projects/ongoing",
      search: (prev: Search) => ({ ...prev, ...patch }),
      replace: true,
    });

  const anyFilter = Boolean(search.practice || search.sector || search.state);

  const ongoing = useMemo(
    () => data.projects.filter((p) => p.status === "ongoing"),
    [data.projects],
  );

  const filtered = useMemo(
    () =>
      ongoing.filter(
        (p) =>
          (!search.practice || p.practice_slug === search.practice) &&
          (!search.sector || p.sectors.some((s) => s.slug === search.sector)) &&
          (!search.state ||
            p.state.toLowerCase().replace(/\s+/g, "-") === search.state.toLowerCase()),
      ),
    [ongoing, search],
  );

  const countBy = (pred: (p: ArchiveProject) => boolean) => ongoing.filter(pred).length;
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
      ].filter((o) => o.count > 0),
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
    <ProjectsExperience brandWordmark="CAPEX" corpus={corpus}>
      <ArchiveNav
        overDark={navOverDark}
        brandWordmark="CAPEX"
        state="ongoing"
        completedCount={data.completedCount}
        ongoingCount={data.ongoingCount}
        onOpenIndex={() => setIndexOpen(true)}
        indexActive={indexOpen}
        onOpenFilter={() => setFilterOpen(true)}
        filterActive={anyFilter}
      />
      <main id="main">
        <OngoingOpening total={filtered.length} onOpenIndex={() => setIndexOpen(true)} />

        {anyFilter && (
          <div className="mx-auto flex max-w-[1680px] flex-wrap items-baseline gap-6 px-6 pt-14 md:px-10 lg:px-12">
            <Reveal>
              <p className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/55">
                {filtered.length} programme{filtered.length === 1 ? "" : "s"} — filtered
              </p>
            </Reveal>
            <button
              onClick={() =>
                setFilter({ practice: undefined, sector: undefined, state: undefined })
              }
              className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/55 underline-offset-4 hover:text-white hover:underline"
            >
              Reset
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="mx-auto max-w-[1680px] bg-[var(--ink)] px-6 py-32 text-white md:px-10 lg:px-12">
            <p className="font-display text-2xl font-normal text-white/80">
              No ongoing projects match these filters.
            </p>
            <button
              onClick={() =>
                setFilter({ practice: undefined, sector: undefined, state: undefined })
              }
              className="mt-6 font-tech text-[11px] uppercase tracking-[0.24em] text-white underline-offset-4 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <OngoingField projects={filtered} />
        )}

        <OngoingClose completedCount={data.completedCount} />
      </main>
      <Closing />
      <RegisterOverlay
        open={indexOpen}
        onClose={() => setIndexOpen(false)}
        projects={filtered}
        stateLabel="Ongoing"
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
