import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import {
  getNavChrome,
  getSearchCorpus,
  getContactPageData,
  getContactOptions,
} from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/SearchOverlay";
import { ContactExperience } from "@/components/site/contact/ContactExperience";
import { Opening } from "@/components/site/contact/Opening";
import { Direct } from "@/components/site/contact/Direct";
import { Enquiry } from "@/components/site/contact/Enquiry";
import { Where } from "@/components/site/contact/Where";
import { Interruption } from "@/components/site/contact/Interruption";
import { Closing } from "@/components/site/contact/Closing";

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

const contactQuery = queryOptions({
  queryKey: ["public", "contact-open-line"],
  queryFn: async () => {
    const [data, options] = await Promise.all([getContactPageData(), getContactOptions()]);
    return { data, options };
  },
  ...PUBLIC_QUERY_DEFAULTS,
});

export const Route = createFileRoute("/contact")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(chromeQuery),
      context.queryClient.ensureQueryData(searchCorpusQuery),
      context.queryClient.ensureQueryData(contactQuery),
    ]),
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Capex Construction & Engineering" },
      {
        name: "description",
        content:
          "Start with a conversation — the Capex open line. Call, write, or tell us about the work; a director or senior manager responds to every serious enquiry.",
      },
      { property: "og:title", content: "Contact Capex — Start with a conversation" },
      { property: "og:type", content: "website" },
    ],
  }),
});

/**
 * THE OPEN LINE — the Contact page as the natural conclusion of the Capex
 * site journey: atmosphere → conversation → contact → requirement →
 * engineering → project. The quietest movement of the Studio ecosystem: one
 * continuous line from a deep-earth opening to the enquiry form, the open
 * line drawing itself through the locations field, and the same deep ground
 * to close. All contact data is verified (site_settings + the audited
 * record); nothing is invented.
 */
function ContactPage() {
  const { data: chromeData } = useSuspenseQuery(chromeQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const { data: contactData } = useSuspenseQuery(contactQuery);
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

  const { phone, email, capabilities, offices } = contactData.data;

  // practice ids for the RPC payload, from the same options source the legacy
  // form used (fallback values keep the payload well-formed pre-migration)
  const practices = contactData.options.practices;
  const practiceIds = {
    one: practices.find((p) => p.number === 1)?.id ?? "p1",
    two: practices.find((p) => p.number === 2)?.id ?? "p2",
  };

  return (
    <ContactExperience brandWordmark={settings.brand_wordmark || "CAPEX"} corpus={corpus}>
      <Opening phone={phone} email={email} />

      {/* one continuous warm-ivory ground carries the whole conversation:
          direct channels, then the enquiry itself */}
      <section
        aria-label="Reach Capex directly or send an enquiry"
        data-tone="light"
        className="paper relative text-foreground"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-12 lg:py-40">
          <Direct phone={phone} email={email} />
          <div className="mt-28 md:mt-40">
            <Enquiry
              phone={phone}
              email={email}
              capabilities={capabilities}
              practiceIds={practiceIds}
            />
          </div>
        </div>
      </section>

      <Where offices={offices} />
      <Interruption />
      <Closing phone={phone} email={email} />
    </ContactExperience>
  );
}
