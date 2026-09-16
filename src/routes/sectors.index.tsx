import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getNavChrome, getSearchCorpus, getSectorsAtlas } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/SearchOverlay";
import { SectorsExperience } from "@/components/site/sectors/SectorsExperience";
import {
  AtlasOpening,
  AtlasIndex,
  TwoWorldsAtlas,
  AtlasClosing,
} from "@/components/site/sectors/AtlasScenes";

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

const atlasQuery = queryOptions({
  queryKey: ["public", "sectors-atlas"],
  queryFn: () => getSectorsAtlas(),
  ...PUBLIC_QUERY_DEFAULTS,
});

export const Route = createFileRoute("/sectors/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(chromeQuery),
      context.queryClient.ensureQueryData(searchCorpusQuery),
      context.queryClient.ensureQueryData(atlasQuery),
    ]),
  component: SectorsPage,
  head: () => ({
    meta: [
      { title: "Sectors — Capex Construction & Engineering" },
      {
        name: "description",
        content:
          "Where systems meet place — the Capex sector atlas: smart-city & metro infrastructure, oil, gas & CGD utilities, corporate & commercial real estate, industry, healthcare and more.",
      },
      { property: "og:title", content: "Capex Sectors — Where systems meet place" },
      { property: "og:type", content: "website" },
    ],
  }),
});

/**
 * THE FIELD — the Sectors page as an interactive atlas of the environments
 * Capex works in. DB-first data with the verified corpus as fallback (same
 * contract as Projects), so the index never renders an empty state while the
 * pre-migration database stands.
 */
function SectorsPage() {
  const { data: chromeData } = useSuspenseQuery(chromeQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const { data: atlas } = useSuspenseQuery(atlasQuery);
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
    <SectorsExperience brandWordmark={settings.brand_wordmark || "CAPEX"} corpus={corpus}>
      <AtlasOpening atlas={atlas} />
      <AtlasIndex atlas={atlas} />
      <TwoWorldsAtlas />
      <AtlasClosing />
    </SectorsExperience>
  );
}
