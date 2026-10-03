import { useEffect, useState, type ReactNode } from "react";
import { HomeNav } from "@/components/site/HomeNav";
import { SearchOverlay, StudioMenu } from "@/components/site/home/overlays";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/search-corpus";

export type { SearchCorpus };

/**
 * PROJECTS EXPERIENCE CHROME — the Projects sibling of the homepage / atlas
 * chrome. The global editorial nav (CAPEX · PROJECTS · STUDIO · SEARCH)
 * travels unchanged; scenes marked data-tone dark|light drive the nav color.
 * PROJECTS goes straight to the archive (/projects redirects to
 * /projects/completed) — there is no intermediate gateway screen.
 */
export function ProjectsExperience({
  brandWordmark,
  corpus,
  hideNav,
  children,
}: {
  brandWordmark: string;
  corpus: SearchCorpus;
  hideNav?: boolean;
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
    const openSearch = () => setSearchOpen(true);
    const openStudio = () => setStudioOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("open-search", openSearch);
    window.addEventListener("open-studio", openStudio);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("open-search", openSearch);
      window.removeEventListener("open-studio", openStudio);
    };
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
        hideDesktopNav={hideNav}
      />
      <main id="main">{children}</main>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} corpus={corpus} />
      <StudioMenu open={studioOpen} onClose={() => setStudioOpen(false)} />
    </div>
  );
}
