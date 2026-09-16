import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { HomeNav } from "@/components/site/HomeNav";
import { StudioMenu } from "@/components/site/home/StudioMenu";
import {
  SearchOverlay,
  buildSearchCorpus,
  type SearchCorpus,
} from "@/components/site/home/SearchOverlay";

export type { SearchCorpus };

/**
 * AboutExperience: the scene-tone chrome for the About page — the same
 * architecture as the homepage, so the global editorial nav (CAPEX ·
 * PROJECTS · STUDIO · SEARCH) travels across pages unchanged. Scenes are
 * marked data-tone dark|light; the topmost scene intersecting the nav zone
 * decides the nav's colour in place. Each chapter composes itself inside
 * <Scene>. The STUDIO and SEARCH overlays are the approved homepage
 * components, reused as-is.
 */
export function AboutExperience({
  brandWordmark,
  corpus,
  children,
}: {
  brandWordmark: string;
  corpus: SearchCorpus;
  children: ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);

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

  // Same nav-tone logic as the homepage: the topmost scene intersecting the
  // nav's zone decides the nav's colour. No scroll-position heuristics.
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
        brandWordmark={brandWordmark}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenStudio={() => setStudioOpen(true)}
      />
      <main id="main">{children}</main>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} corpus={corpus} />
      <StudioMenu open={studioOpen} onClose={() => setStudioOpen(false)} />
    </div>
  );
}

/** One scene of the story: a full-width frame with its ground tone. */
export function Scene({
  tone,
  children,
  label,
  className = "",
}: {
  tone: "dark" | "light";
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <section
      aria-label={label}
      data-tone={tone}
      className={
        tone === "dark" ? `relative bg-[var(--ink)] text-white ${className}` : `paper ${className}`
      }
    >
      {children}
    </section>
  );
}

/** Quiet-arrow link used across the page's typographic compositions. */
export function ArrowLink({
  to,
  params,
  children,
  tone,
}: {
  to: string;
  params?: Record<string, string>;
  children: string;
  tone: "dark" | "light";
}) {
  return (
    <Link
      to={to as "/projects"}
      params={params as never}
      className={`group mt-12 inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] ${
        tone === "dark" ? "text-white" : "text-foreground"
      }`}
    >
      <span
        className={`border-b pb-1 transition-colors ${
          tone === "dark"
            ? "border-white/40 group-hover:border-white"
            : "border-border group-hover:border-foreground"
        }`}
      >
        {children}
      </span>
      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
