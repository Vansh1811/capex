import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getNavChrome, getProjectsArchive, getSearchCorpus } from "@/lib/site-data";
import { resolveProjectMedia } from "@/lib/project-media";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/SearchOverlay";
import { Reveal } from "@/components/site/home/Reveal";
import { Closing } from "@/components/site/home/Closing";
import { ProjectsExperience, ProjectsGateway } from "@/components/site/projects/ProjectsExperience";

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

const archiveQuery = queryOptions({
  queryKey: ["public", "projects-archive"],
  queryFn: () => getProjectsArchive(),
  ...PUBLIC_QUERY_DEFAULTS,
});

export const Route = createFileRoute("/projects/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(chromeQuery),
      context.queryClient.ensureQueryData(searchCorpusQuery),
      context.queryClient.ensureQueryData(archiveQuery),
    ]),
  component: ProjectsGatewayPage,
  head: () => ({
    meta: [
      { title: "Projects — Capex Construction & Engineering" },
      {
        name: "description",
        content:
          "The Capex project record — two states of work: completed, delivered and commissioned systems; and the ongoing live programme. Underground utilities, electrical, CGD, HVAC and fire protection across India.",
      },
      {
        property: "og:title",
        content: "Capex Projects — What Capex has built · What Capex is building",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

/**
 * THE PROJECTS GATEWAY — /projects is the choice, not the archive. The page
 * beneath the gateway is a quiet typographic statement (What Capex has built ·
 * What Capex is building) with the two states as its only navigation; the
 * gateway opens on arrival for the Studio-style immersive choice, Esc closes
 * it to reveal the quiet page beneath. /projects/completed and /projects/ongoing
 * are the two archives; /projects/<slug> remains the detail route.
 */
function ProjectsGatewayPage() {
  const { data: chromeData } = useSuspenseQuery(chromeQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const { data: archive } = useSuspenseQuery(archiveQuery);
  const [gatewayOpen, setGatewayOpen] = useState(true);

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

  // Gateway plates: each state's flagship frame, from the media registry.
  const completedPlate = resolveProjectMedia("world-trade-tower-hvac-fire").src;
  const ongoingPlate = resolveProjectMedia("gurugram-smart-city-electrical-08").src;

  const settings = chromeData.settings;

  return (
    <ProjectsExperience brandWordmark={settings.brand_wordmark || "CAPEX"} corpus={corpus}>
      {/* the quiet page beneath the gateway */}
      <section
        aria-label="Projects — the two states of Capex work"
        data-tone="dark"
        className="relative flex min-h-svh flex-col overflow-hidden bg-[var(--brand)] text-white"
      >
        <div className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-6 pb-16 pt-36 md:px-10 md:pt-44 lg:px-12">
          <div>
            <Reveal delay={80}>
              <p className="eyebrow-sans text-white/45">Capex projects</p>
            </Reveal>
            <Reveal delay={200}>
              <h1 className="mt-10 font-display text-[13vw] font-normal leading-[0.96] tracking-[-0.025em] md:text-[88px] lg:text-[116px]">
                What Capex has built<span className="text-white/40">.</span>
                <br />
                What Capex is building<span className="text-white/40">.</span>
              </h1>
            </Reveal>
          </div>

          <div className="mt-auto pt-24">
            <Reveal delay={380}>
              <div className="grid gap-10 border-t border-white/15 pt-10 md:grid-cols-2 md:gap-8">
                <Link
                  to="/projects/completed"
                  className="group block"
                  aria-label={`Completed work — ${archive.completedCount} projects`}
                >
                  <p className="font-tech text-[11px] tracking-[0.1em] text-white/35">01</p>
                  <p className="mt-4 font-display text-3xl font-normal tracking-[-0.02em] text-white/90 transition-colors group-hover:text-white md:text-4xl">
                    Completed
                  </p>
                  <p className="mt-3 max-w-xs text-sm leading-[1.8] text-white/55">
                    Work delivered — the record of systems built across infrastructure and
                    buildings.
                  </p>
                  <p className="mt-5 font-tech text-[11px] uppercase tracking-[0.22em] text-white/45">
                    {archive.completedCount} projects →
                  </p>
                </Link>
                <Link
                  to="/projects/ongoing"
                  className="group block"
                  aria-label={`Ongoing work — ${archive.ongoingCount} live programmes`}
                >
                  <p className="font-tech text-[11px] tracking-[0.1em] text-white/35">02</p>
                  <p className="mt-4 font-display text-3xl font-normal tracking-[-0.02em] text-white/90 transition-colors group-hover:text-white md:text-4xl">
                    Ongoing
                  </p>
                  <p className="mt-3 max-w-xs text-sm leading-[1.8] text-white/55">
                    Work currently taking shape — the live programme as the record states it.
                  </p>
                  <p className="mt-5 font-tech text-[11px] uppercase tracking-[0.22em] text-white/45">
                    {archive.ongoingCount} live programmes →
                  </p>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <Closing />
      <ProjectsGateway
        open={gatewayOpen}
        onClose={() => setGatewayOpen(false)}
        completedCount={archive.completedCount}
        ongoingCount={archive.ongoingCount}
        completedPlate={completedPlate}
        ongoingPlate={ongoingPlate}
      />
    </ProjectsExperience>
  );
}
