import { useEffect, useState, type ReactNode } from "react";
import { HomeNav } from "@/components/site/HomeNav";
import { StudioMenu } from "@/components/site/home/StudioMenu";
import {
  SearchOverlay,
  buildSearchCorpus,
  type SearchCorpus,
} from "@/components/site/home/SearchOverlay";

export type { SearchCorpus };

/**
 * ContactExperience: the Studio chrome for THE OPEN LINE — the same
 * architecture as the homepage, About and Sectors, so the global editorial
 * nav (CAPEX · PROJECTS · STUDIO · SEARCH) travels unchanged. Scenes mark
 * themselves data-tone dark|light; the topmost scene intersecting the nav
 * zone decides the nav's colour in place. The Contact page then diverges as
 * the quietest movement of the ecosystem: one continuous conversational
 * line from atmosphere to enquiry, no exhibition and no atlas — the page
 * a visitor ends their journey on.
 */
export function ContactExperience({
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

/** One scene of the conversation: a full-width frame with its ground tone. */
export function Scene({
  tone,
  children,
  label,
  className = "",
}: {
  tone: "dark" | "light" | "stone";
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  const ground =
    tone === "dark"
      ? "relative bg-[var(--brand-deep)] text-white"
      : tone === "stone"
        ? "relative bg-[var(--muted)] text-foreground"
        : "paper relative text-foreground";
  return (
    <section
      aria-label={label}
      data-tone={tone === "stone" ? "light" : tone}
      className={`${ground} ${className}`}
    >
      {children}
    </section>
  );
}
