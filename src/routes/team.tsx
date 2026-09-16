import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getNavChrome, getSearchCorpus, getPeopleRoster } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/SearchOverlay";
import {
  PeopleExperience,
  Opening,
  Roster,
  InterruptionWide,
  InterruptionTall,
  PeopleClosing,
} from "@/components/site/people";

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

const rosterQuery = queryOptions({
  queryKey: ["public", "people-roster"],
  queryFn: () => getPeopleRoster(),
  ...PUBLIC_QUERY_DEFAULTS,
});

export const Route = createFileRoute("/team")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(chromeQuery),
      context.queryClient.ensureQueryData(searchCorpusQuery),
      context.queryClient.ensureQueryData(rosterQuery),
    ]),
  component: PeoplePage,
  head: () => ({
    meta: [
      { title: "People — Capex Construction & Engineering" },
      {
        name: "description",
        content:
          "The people behind the work — the named record of Capex: directors, delivery managers, and the site and design engineers who hold the work in the field.",
      },
    ],
  }),
});

/**
 * THE PEOPLE PAGE — a human portrait of the company record. The roster is
 * the verified data (DB-first, audited-corpus fallback); the experience
 * around it is editorial: a warm opening, a typographic index with a
 * hover-plate reveal, photographic interruptions between the chapters,
 * and a deep-earth close. No employee cards, no invented biographies —
 * names and roles of record only.
 */
function PeoplePage() {
  const { data: chromeData } = useSuspenseQuery(chromeQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const { data: roster } = useSuspenseQuery(rosterQuery);
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
    <PeopleExperience brandWordmark={settings.brand_wordmark || "CAPEX"} corpus={corpus}>
      <Opening />
      <Roster
        people={roster.people}
        onInterrupt={(slot) => (slot === 0 ? <InterruptionWide /> : <InterruptionTall />)}
      />
      <PeopleClosing />
    </PeopleExperience>
  );
}
