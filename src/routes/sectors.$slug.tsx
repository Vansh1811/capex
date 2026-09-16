import { useMemo } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getNavChrome, getSearchCorpus, getSectorPlate } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/SearchOverlay";
import { SectorsExperience } from "@/components/site/sectors/SectorsExperience";
import { SectorPlateScenes } from "@/components/site/sectors/SectorPlateScenes";

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

const plateQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public", "sector-plate", slug],
    queryFn: () => getSectorPlate({ data: { slug } }),
    ...PUBLIC_QUERY_DEFAULTS,
  });

export const Route = createFileRoute("/sectors/$slug")({
  loader: async ({ context, params: { slug } }) => {
    const data = await context.queryClient.ensureQueryData(plateQuery(slug));
    // loader returns null for unknown slugs → render notFoundComponent
    if (!data) throw notFound();
    return data;
  },
  component: SectorPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div>
        <h1 className="font-display text-4xl font-normal">Sector not found.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This environment is not on the company record.
        </p>
        <Link
          to="/sectors"
          className="mt-8 inline-block border-b border-border pb-1 font-tech text-[11px] uppercase tracking-[0.24em] hover:border-foreground"
        >
          The atlas
        </Link>
      </div>
    </div>
  ),
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replace(/-/g, " ")} — Capex Sectors` }],
  }),
});

/**
 * THE SECTOR PLATE — one environment from the atlas, as a contextual bridge
 * between Capabilities and Projects: the plate, why the environment matters,
 * the capabilities that serve it, and its verified records. Never a duplicate
 * of either sibling page.
 */
function SectorPage() {
  const { slug } = Route.useParams();
  const { data: chromeData } = useSuspenseQuery(chromeQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const { data } = useSuspenseQuery(plateQuery(slug));
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

  if (!data) return null;

  return (
    <SectorsExperience brandWordmark={settings.brand_wordmark || "CAPEX"} corpus={corpus}>
      <SectorPlateScenes sector={data.sector} links={data.links} services={data.services} />
    </SectorsExperience>
  );
}
