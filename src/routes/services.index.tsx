import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import {
  getNavChrome,
  getSearchCorpus,
  getCapabilitiesPage,
  getSectorsAtlas,
  getProjectsArchive,
} from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/search-corpus";
import { CapabilitiesExperience } from "@/components/site/capabilities/CapabilitiesExperience";
import { Opening } from "@/components/site/capabilities/Opening";
import { CapabilityDirectory } from "@/components/site/capabilities/CapabilityDirectory";
import { DeliveryLine } from "@/components/site/capabilities/DeliveryLine";
import { ProjectEvidence } from "@/components/site/capabilities/ProjectEvidence";
import { EnvironmentsRegister } from "@/components/site/capabilities/EnvironmentsRegister";
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

const sectorsQuery = queryOptions({
  queryKey: ["public", "sectors-atlas"],
  queryFn: () => getSectorsAtlas(),
  ...PUBLIC_QUERY_DEFAULTS,
});

const archiveQuery = queryOptions({
  queryKey: ["public", "projects-archive"],
  queryFn: () => getProjectsArchive(),
  ...PUBLIC_QUERY_DEFAULTS,
});

export const Route = createFileRoute("/services/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(chromeQuery),
      context.queryClient.ensureQueryData(searchCorpusQuery),
      context.queryClient.ensureQueryData(capabilitiesQuery),
      context.queryClient.ensureQueryData(sectorsQuery),
      context.queryClient.ensureQueryData(archiveQuery),
    ]),
  component: CapabilitiesPage,
  head: () => ({
    meta: [
      { title: "Capabilities — Capex Construction & Engineering Pvt. Ltd." },
      {
        name: "description",
        content:
          "What Capex engineers — nine disciplines across two integrated practices: UG utilities, electrical & CGD below the street; MEP, HVAC & fire protection within the building. Turnkey supply, installation, testing & commissioning — and the sectors where the work stands.",
      },
      { property: "og:title", content: "Capabilities Capex — What we engineer" },
      { property: "og:type", content: "website" },
    ],
  }),
});

function CapabilitiesPage() {
  const { data: chromeData } = useSuspenseQuery(chromeQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const { data } = useSuspenseQuery(capabilitiesQuery);
  const { data: atlasData } = useSuspenseQuery(sectorsQuery);
  const { data: archiveData } = useSuspenseQuery(archiveQuery);
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
    <CapabilitiesExperience brandWordmark={settings.brand_wordmark || "CAPEX"} corpus={corpus}>
      {/* A — compact opening */}
      <Opening />
      {/* B — the capability directory (centrepiece, interaction model) */}
      <CapabilityDirectory services={data.services} />
      {/* C — the engineering line + verified T&C register */}
      <DeliveryLine commissioning={data.commissioning} />
      {/* D — selected project evidence + the environments register */}
      <ProjectEvidence projects={archiveData.projects} published={archiveData.published} />
      <EnvironmentsRegister atlas={atlasData} />
      {/* F — deliberate closing */}
      <CapabilitiesClosing serviceCount={data.services.length} />
    </CapabilitiesExperience>
  );
}
