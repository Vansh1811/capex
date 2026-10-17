import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import {
  getClientsPage,
  getNavChrome,
  getSearchCorpus,
  getSignatureMeasures,
} from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/search-corpus";
import { ClientsExperience } from "@/components/site/clients/ClientsExperience";
import { ClientsClosing } from "@/components/site/clients/Vocabulary";
import {
  ExhibitionHero,
  LogoShowcase,
  ClientExhibition,
  type IndexCategory,
} from "@/components/site/clients/ExhibitionSections";
import { TheWorkMeasured } from "@/components/site/clients/TheWorkMeasured";
import { ClientVoices } from "@/components/site/clients/ClientVoices";
import { EXHIBITION_CATEGORIES, exhibitionLogo } from "@/components/site/clients/exhibition";

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

const clientsQuery = queryOptions({
  queryKey: ["public", "clients"],
  queryFn: () => getClientsPage(),
  ...PUBLIC_QUERY_DEFAULTS,
});

const measuresQuery = queryOptions({
  queryKey: ["public", "signature-measures"],
  queryFn: () => getSignatureMeasures(),
  ...PUBLIC_QUERY_DEFAULTS,
});

export const Route = createFileRoute("/clients")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(clientsQuery),
      context.queryClient.ensureQueryData(measuresQuery),
      context.queryClient.ensureQueryData(chromeQuery),
      context.queryClient.ensureQueryData(searchCorpusQuery),
    ]),
  component: ClientsPage,
  head: () => ({
    meta: [
      { title: "Clients — Capex Construction & Engineering" },
      {
        name: "description",
        content:
          "Trust, in practice — the Capex clientele across IT & technology, corporates, oil & gas industries, and builders & developers.",
      },
    ],
  }),
});

/**
 * CLIENT EXHIBITION — the Clients page as a premium editorial exhibition.
 * Hero → the logo rail → the measures register → the four-panel index →
 * client voices → closing. Only verified direct clients appear; only
 * verified logo assets ride the rail; only verified project imagery
 * appears, joined through the corpus record.
 */
function ClientsPage() {
  const { data: chromeData } = useSuspenseQuery(chromeQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const { data } = useSuspenseQuery(clientsQuery);
  const { data: measures } = useSuspenseQuery(measuresQuery);

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

  // Verified direct clients only — the exhibition is about CLIENTS.
  // The moving rail carries the clients whose official mark is verified;
  // a client without an asset stays indexed below and does not ride.
  const bySlug = useMemo(() => new Map(data.clients.map((c) => [c.slug, c])), [data]);
  const ribbonClients = useMemo(
    () =>
      EXHIBITION_CATEGORIES.flatMap((cat) =>
        cat.slugs.flatMap((s) => {
          const c = bySlug.get(s);
          return c && exhibitionLogo(c.slug) !== null ? [c] : [];
        }),
      ),
    [bySlug],
  );

  // The index and the panels read the same resolved set: the verified
  // direct clients the registry actually carries, per category — never a
  // slug that resolves to nothing.
  const indexCategories: IndexCategory[] = useMemo(
    () =>
      EXHIBITION_CATEGORIES.map((c) => ({
        id: c.id,
        n: c.n,
        label: c.label,
        clients: c.slugs.flatMap((s) => {
          const client = bySlug.get(s);
          return client ? [client] : [];
        }),
      })),
    [bySlug],
  );

  const footerData = {
    brandWordmark: settings.brand_wordmark || "CAPEX",
    brandTagline: settings.logo_tagline || "Construction & Engineering",
    phone: settings.contact_phone ?? "",
    email: settings.contact_email ?? "",
    cin: chromeData.cin,
    udyam: chromeData.udyam,
    practices: chromeData.practices.map((p) => ({
      number: p.number,
      short_label: p.short_label,
      slug: p.slug,
    })),
    services: chromeData.services,
    careersActive: chromeData.careersActive,
  };

  return (
    <ClientsExperience brandWordmark={settings.brand_wordmark || "CAPEX"} corpus={corpus}>
      <ExhibitionHero />
      <LogoShowcase clients={ribbonClients} />
      <TheWorkMeasured measures={measures} />
      <ClientExhibition categories={indexCategories} />
      <ClientVoices />
      <ClientsClosing />
    </ClientsExperience>
  );
}
