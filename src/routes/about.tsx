import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getNavChrome, getSearchCorpus } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/SearchOverlay";
import { AboutExperience } from "@/components/site/about/AboutExperience";
import { Opening } from "@/components/site/about/Opening";
import { TwoWorlds } from "@/components/site/about/TwoWorlds";
import { WhyCapex } from "@/components/site/about/WhyCapex";
import { HowWeWork } from "@/components/site/about/HowWeWork";
import { Story } from "@/components/site/about/Story";
import { Range } from "@/components/site/about/Range";
import { PeopleTeaser } from "@/components/site/about/PeopleTeaser";
import { Presence } from "@/components/site/about/Presence";
import { Trust } from "@/components/site/about/Trust";
import { AboutClosing } from "@/components/site/about/AboutClosing";

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

const aboutQuery = queryOptions({
  queryKey: ["public", "about"],
  queryFn: () => Promise.all([getNavChrome(), getSearchCorpus()]),
  ...PUBLIC_QUERY_DEFAULTS,
});

export const Route = createFileRoute("/about")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(chromeQuery),
      context.queryClient.ensureQueryData(searchCorpusQuery),
      context.queryClient.ensureQueryData(aboutQuery),
    ]),
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Capex Construction & Engineering Pvt. Ltd." },
      {
        name: "description",
        content:
          "Who Capex is — a turnkey engineering company since 2012, building the systems beneath infrastructure and within buildings: underground utilities, electrical & CGD, and MEP, HVAC & fire protection.",
      },
      { property: "og:title", content: "About Capex — We build what keeps things moving" },
    ],
  }),
});

function AboutPage() {
  const { data: chromeData } = useSuspenseQuery(chromeQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
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

  return (
    <AboutExperience brandWordmark={settings.brand_wordmark || "CAPEX"} corpus={corpus}>
      <Opening />
      <TwoWorlds />
      <WhyCapex />
      <HowWeWork />
      <Story />
      <Range />
      <PeopleTeaser />
      <Presence />
      <Trust />
      <AboutClosing />
    </AboutExperience>
  );
}
