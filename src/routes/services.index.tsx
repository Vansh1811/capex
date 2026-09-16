import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getNavChrome, getSearchCorpus, getCapabilitiesPage } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/SearchOverlay";
import { CapabilitiesExperience } from "@/components/site/capabilities/CapabilitiesExperience";
import { Opening } from "@/components/site/capabilities/Opening";
import { TwoPractices } from "@/components/site/capabilities/TwoPractices";
import { DisciplineIndex } from "@/components/site/capabilities/DisciplineIndex";
import { CapabilityNetwork } from "@/components/site/capabilities/CapabilityNetwork";
import { DeliveryLine } from "@/components/site/capabilities/DeliveryLine";
import { PhysicalCapability } from "@/components/site/capabilities/PhysicalCapability";
import { CapabilitiesClosing } from "@/components/site/capabilities/CapabilitiesClosing";

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

const capabilitiesQuery = queryOptions({
  queryKey: ["public", "capabilities"],
  queryFn: () => getCapabilitiesPage(),
  ...PUBLIC_QUERY_DEFAULTS,
});

export const Route = createFileRoute("/services/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(chromeQuery),
      context.queryClient.ensureQueryData(searchCorpusQuery),
      context.queryClient.ensureQueryData(capabilitiesQuery),
    ]),
  component: CapabilitiesPage,
  head: () => ({
    meta: [
      { title: "Capabilities — Capex Construction & Engineering Pvt. Ltd." },
      {
        name: "description",
        content:
          "How the work gets built — eleven disciplines across two integrated practices: UG utilities, electrical & CGD below the street; MEP, HVAC & fire protection within the building. Turnkey supply, installation, testing & commissioning.",
      },
      { property: "og:title", content: "Capabilities Capex — How the work gets built" },
      { property: "og:type", content: "website" },
    ],
  }),
});

function CapabilitiesPage() {
  const { data: chromeData } = useSuspenseQuery(chromeQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const { data } = useSuspenseQuery(capabilitiesQuery);
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

  // The register's shared emphasis — one source for the practice rooms and
  // the discipline index so hover states never fight each other.
  const [activePractice, setActivePractice] = useState<1 | 2 | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <CapabilitiesExperience brandWordmark={settings.brand_wordmark || "CAPEX"} corpus={corpus}>
      <Opening serviceCount={data.services.length} practiceCount={data.practices.length} />
      <TwoPractices
        practices={data.practices}
        activeNumber={activePractice}
        onActive={setActivePractice}
      />
      <DisciplineIndex services={data.services} activeSlug={activeSlug} onActive={setActiveSlug} />
      <CapabilityNetwork services={data.services} />
      <DeliveryLine />
      <PhysicalCapability fleet={data.fleet} equipment={data.equipment} />
      <CapabilitiesClosing serviceCount={data.services.length} />
    </CapabilitiesExperience>
  );
}
