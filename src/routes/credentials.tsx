import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getNavChrome, getSearchCorpus, getCredentialsPage } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/SearchOverlay";
import {
  CredentialsExperience,
  Opening,
  TheRegister,
  Geography,
  TheRecord,
  VerificationDesk,
  Closing,
} from "@/components/site/credentials";

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

const credentialsQuery = queryOptions({
  queryKey: ["public", "credentials-register"],
  queryFn: () => getCredentialsPage(),
  ...PUBLIC_QUERY_DEFAULTS,
});

export const Route = createFileRoute("/credentials")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(chromeQuery),
      context.queryClient.ensureQueryData(searchCorpusQuery),
      context.queryClient.ensureQueryData(credentialsQuery),
    ]),
  component: CredentialsPage,
  head: () => ({
    meta: [
      { title: "Credentials — Capex Construction & Engineering" },
      {
        name: "description",
        content:
          "Proof, not promises — the Capex register of statutory registrations and certifications: incorporation, PAN, Udyam, GST across five states and ESI, each with its registry number of record and available for verification on request.",
      },
      { property: "og:title", content: "Credentials — Proof, not promises" },
      { property: "og:type", content: "website" },
    ],
  }),
});

/**
 * PROOF OF PRACTICE — the Credentials page as the evidentiary movement of
 * the Studio ecosystem: the register (typographic, interactive — select an
 * entry for its evidence sheet), the registration geography, the record's
 * dated milestones, the verification desk, and the confirming close. Every
 * figure is the verified company record — DB-first with the audited corpus
 * fallback; nothing is invented, and gated rows (ISO 9001, Make in India)
 * can never render.
 */
function CredentialsPage() {
  const { data: chromeData } = useSuspenseQuery(chromeQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const { data: register } = useSuspenseQuery(credentialsQuery);
  const settings = chromeData.settings;

  // document pre-selected from an EvidenceSheet request link (#verification-desk)
  const [selectedCredential, setSelectedCredential] = useState<string>("");

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

  const statutory = register.credentials.filter((c) => c.kind === "statutory");
  const certifications = register.credentials.length - statutory.length;
  const cin = statutory.find((c) => c.title === "Certificate of Incorporation")?.number ?? "";

  return (
    <CredentialsExperience brandWordmark={settings.brand_wordmark || "CAPEX"} corpus={corpus}>
      <Opening
        registrations={statutory.length}
        certifications={certifications}
        gstStates={register.gstStates.length}
      />
      <TheRegister
        credentials={register.credentials}
        sourceNote={register.sourceNote}
        onRequest={(title) => setSelectedCredential(title)}
      />
      <Geography states={register.gstStates} />
      <TheRecord milestones={register.milestones} />
      <VerificationDesk
        credentials={register.credentials}
        key={selectedCredential || "desk"}
        selectedCredential={selectedCredential}
      />
      <Closing cin={cin} />
    </CredentialsExperience>
  );
}
