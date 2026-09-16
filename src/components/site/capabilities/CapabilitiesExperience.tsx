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
 * CapabilitiesExperience: the scene-tone chrome for THE ENGINE ROOM — the
 * same shared chassis as the homepage, About, Sectors, People, Clients,
 * Credentials and Contact (HomeNav, scene data-tone marks driving the
 * nav's colour in place, the approved Studio + Search overlays reused
 * unchanged). The page arrives from STUDIO → CAPABILITIES (destination 02)
 * and keeps that grammar intact. Where the Sectors atlas is plate-led and
 * People is roster-led, Capabilities is REGISTER-led: its dominant surface
 * is the typographic discipline index, with rooms, lines and numerals
 * changing environment around it.
 */
export function CapabilitiesExperience({
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

  // Same nav-tone logic as every Studio page: the topmost scene intersecting
  // the nav's zone decides the nav's colour. No scroll-position heuristics.
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

/**
 * PLATE VOCABULARY — the reference-imagery honesty note. Every atmospheric
 * frame on this page is implementation material and says so.
 */
export function ReferenceNote({
  className = "",
  dark = false,
  children,
}: {
  className?: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`font-tech text-[10px] uppercase leading-[1.7] tracking-[0.18em] ${
        dark ? "text-white/40" : "text-muted-foreground/70"
      } ${className}`}
    >
      {children}
    </p>
  );
}
