import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getNavChrome, getSearchCorpus } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { HomeNav } from "@/components/site/HomeNav";
import { Hero } from "@/components/site/home/Hero";
import { Manifesto } from "@/components/site/home/Manifesto";
import { TwoWorlds } from "@/components/site/home/TwoWorlds";
import { HowCapexDelivers } from "@/components/site/home/HowCapexDelivers";
import { SelectedWork } from "@/components/site/home/SelectedWork";
import { Closing } from "@/components/site/home/Closing";
import {
  SearchOverlay,
  buildSearchCorpus,
  type SearchCorpus,
} from "@/components/site/home/SearchOverlay";
import { StudioMenu } from "@/components/site/home/StudioMenu";

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

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(chromeQuery),
      context.queryClient.ensureQueryData(searchCorpusQuery),
    ]),
  component: HomePage,
  errorComponent: () => (
    <div
      role="alert"
      className="grid min-h-screen place-items-center bg-background p-8 text-center"
    >
      <div>
        <h1 className="font-display text-2xl font-bold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Please refresh, or use the contact page.
        </p>
        <Link
          to="/contact"
          className="mt-6 inline-block rounded-[4px] border border-border px-4 py-2 text-sm"
        >
          Contact Capex
        </Link>
      </div>
    </div>
  ),
  head: () => ({
    meta: [
      {
        title: "Capex Construction & Engineering — We Build What Keeps Things Moving",
      },
      {
        name: "description",
        content:
          "Capex Construction & Engineering Pvt. Ltd. — turnkey underground utilities, electrical & CGD, and MEP, HVAC & fire protection. Supply, installation, testing & commissioning since 2012.",
      },
      { property: "og:title", content: "Capex — We Build What Keeps Things Moving" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/media/capex-hero-poster.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function HomePage() {
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

  const [searchOpen, setSearchOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);

  // Global shortcuts: "/" or cmd/ctrl+k opens search (Escape is handled inside the overlay).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !searchOpen)) {
        const el = document.activeElement;
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  // The nav adapts to the scene beneath it: each homepage scene carries a
  // data-tone mark ("dark" | "light"); the topmost scene intersecting the
  // nav's zone decides the nav's color. No scroll-position heuristics.
  const [navOverDark, setNavOverDark] = useState(true);
  useEffect(() => {
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>("#main [data-tone], footer[data-tone]"),
    );
    if (scenes.length === 0) return;
    const visible = new Map<HTMLElement, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target as HTMLElement, e.isIntersecting);
        // topmost scene currently intersecting the viewport's top zone wins
        const live = scenes
          .filter((s) => visible.get(s))
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
        if (live) setNavOverDark(live.dataset.tone !== "light");
      },
      { rootMargin: "-72px 0px -35% 0px", threshold: 0 },
    );
    for (const s of scenes) io.observe(s);
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-black"
      >
        Skip to content
      </a>
      <HomeNav
        overDark={navOverDark}
        brandWordmark={settings.brand_wordmark || "CAPEX"}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenStudio={() => setStudioOpen(true)}
      />
      <main id="main">
        <Hero />
        <Manifesto />
        <TwoWorlds />
        <HowCapexDelivers />
        <SelectedWork />
      </main>
      <Closing />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} corpus={corpus} />
      <StudioMenu open={studioOpen} onClose={() => setStudioOpen(false)} />
    </div>
  );
}
