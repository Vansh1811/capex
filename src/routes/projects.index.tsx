import { useMemo } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getProjectsArchive, getSearchCorpus, type ArchiveProject } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { Closing } from "@/components/site/home/Closing";
import { ProjectsExperience } from "@/components/site/projects/ProjectsExperience";
import { buildSearchCorpus } from "@/components/site/home/search-corpus";
import {
  EmptyRegister,
  FilteredNotice,
  PanelField,
  RegisterOpening,
  RegisterSectionHeading,
  StateLinks,
  type ArchiveSearch,
} from "@/components/site/projects/RegisterPanels";

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

type Search = {
  practice?: string;
  sector?: string;
  state?: string;
};

export const Route = createFileRoute("/projects/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    practice: typeof s.practice === "string" ? s.practice : undefined,
    sector: typeof s.sector === "string" ? s.sector : undefined,
    state: typeof s.state === "string" ? s.state : undefined,
  }),
  component: ProjectsRegister,
  head: () => ({
    meta: [
      { title: "Projects — The Register | Capex Construction & Engineering" },
      {
        name: "description",
        content:
          "The Capex project register — documented completed work and ongoing programmes across underground utilities, electrical, CGD, HVAC and fire protection, each with its client, quantity and place.",
      },
      { property: "og:title", content: "Capex Projects — The Register" },
      { property: "og:type", content: "website" },
    ],
  }),
});

/**
 * THE REGISTER — /projects is the register itself. No gateway, no choice
 * screen: the completed records and the ongoing programmes sit as two
 * labelled sections of the one page, reachable on arrival. The state
 * links at the top scroll in place; the dedicated archives (where
 * filtering lives) are one link away in each section heading. Filter
 * params carried into the register keep working against both sections.
 */
function ProjectsRegister() {
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

  const completed = useMemo(
    () => data.projects.filter((p) => p.status === "completed"),
    [data.projects],
  );
  const ongoing = useMemo(
    () => data.projects.filter((p) => p.status === "ongoing"),
    [data.projects],
  );

  const byFilters = (p: ArchiveProject, s: Search) =>
    (!s.practice || p.practice_slug === s.practice) &&
    (!s.sector || p.sectors.some((x) => x.slug === s.sector)) &&
    (!s.state || p.state.toLowerCase().replace(/\s+/g, "-") === s.state.toLowerCase());

  const filteredCompleted = useMemo(
    () => completed.filter((p) => byFilters(p, search)),
    [completed, search],
  );
  const filteredOngoing = useMemo(
    () => ongoing.filter((p) => byFilters(p, search)),
    [ongoing, search],
  );

  const anyFilter = Boolean(search.practice || search.sector || search.state);
  const resetFilter = () =>
    router.navigate({
      to: "/projects",
      search: { practice: undefined, sector: undefined, state: undefined },
      replace: true,
    });
  return (
    <ProjectsExperience
      brandWordmark="CAPEX"
      corpus={corpus}
      initialTone="dark"
      footer={<Closing />}
    >
      {/* dark espresso introduction — cinematic, matching the homepage's
          dark scenes. Ivory headline, warm-gray copy, copper metadata. */}
      <RegisterOpening
        eyebrow="Capex · Project register"
        title="Projects"
        tone="dark"
        copy="The register documents completed work and the programmes now in progress across infrastructure and building systems — underground utilities, electrical, CGD, HVAC and fire protection — every record with its client, scope, quantity and place."
        meta={
          <StateLinks
            current={null}
            completedCount={data.completedCount}
            ongoingCount={data.ongoingCount}
            inPage
          />
        }
      />

      {/* warm-ivory completed archive */}
      <section
        id="completed"
        aria-label="Completed — work recorded as delivered"
        data-tone="light"
        className="paper scroll-mt-20 bg-background md:scroll-mt-24"
      >
        <div className="mx-auto max-w-[1680px] px-6 pb-20 pt-8 md:px-10 md:pt-10 lg:px-12">
          {anyFilter && (
            <div className="mb-10">
              <FilteredNotice
                count={filteredCompleted.length + filteredOngoing.length}
                noun="records"
                onReset={resetFilter}
              />
            </div>
          )}

          {filteredCompleted.length === 0 ? (
            <EmptyRegister label="completed" onClear={resetFilter} />
          ) : (
            <>
              <RegisterSectionHeading
                label="Completed"
                count={filteredCompleted.length}
                noun="records"
                description="Work recorded as delivered — commissioned and handed over across infrastructure and buildings."
                archiveTo="/projects/completed"
              />
              <div className="mt-10">
                <PanelField projects={filteredCompleted} />
              </div>
            </>
          )}
        </div>
      </section>

      {/* deep-espresso ongoing archive — the second state of the record */}
      <section
        id="ongoing"
        aria-label="Ongoing — programmes confirmed as in progress"
        data-tone="dark"
        className="band-espresso scroll-mt-20 md:scroll-mt-24"
      >
        <div className="mx-auto max-w-[1680px] px-6 pb-24 pt-10 md:px-10 md:pt-16 lg:pb-28">
          {filteredOngoing.length === 0 ? (
            <EmptyRegister label="ongoing" onClear={resetFilter} />
          ) : (
            <>
              <RegisterSectionHeading
                label="Ongoing"
                count={filteredOngoing.length}
                noun="programmes"
                description="Programmes confirmed as currently in progress — stated as the company record states it."
                archiveTo="/projects/ongoing"
              />
              <div className="mt-10">
                <PanelField projects={filteredOngoing} />
              </div>
            </>
          )}
        </div>
      </section>
    </ProjectsExperience>
  );
}
