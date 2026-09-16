import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { trapFocus } from "@/lib/focus-trap";
import { HomeNav } from "@/components/site/HomeNav";
import { StudioMenu } from "@/components/site/home/StudioMenu";
import {
  SearchOverlay,
  buildSearchCorpus,
  type SearchCorpus,
} from "@/components/site/home/SearchOverlay";

export type { SearchCorpus };

/**
 * PROJECTS EXPERIENCE CHROME — the Projects sibling of the homepage / atlas
 * chrome. The global editorial nav (CAPEX · PROJECTS · STUDIO · SEARCH)
 * travels unchanged; scenes marked data-tone dark|light drive the nav color.
 * The Projects gateway replaces the old "go straight to the archive" jump:
 * clicking PROJECTS in the nav opens the gateway (the two-worlds choice)
 * instead of navigating.
 */
export function ProjectsExperience({
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

/**
 * THE GATEWAY — the Projects overlay. The interaction language is the
 * Studio menu's (deep-earth translucency, numbered typographic rows,
 * Escape closes, focus trapped and restored) — but where Studio is an
 * index of seven words, the gateway is a choice between two STATES of
 * Capex's work. Each row expands to its own editorial line; hovering (or
 * focusing) one row transforms the background plate into imagery of that
 * state — completed work settling into still, graded records; ongoing
 * work holding a frame mid-execution. Two worlds, one gesture.
 */
export function ProjectsGateway({
  open,
  onClose,
  completedCount,
  ongoingCount,
  completedPlate,
  ongoingPlate,
}: {
  open: boolean;
  onClose: () => void;
  /** Derived from the corpus at render time — never hardcoded. */
  completedCount: number;
  ongoingCount: number;
  /** Background plates per state — the media registry's flagships. */
  completedPlate: string;
  ongoingPlate: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const [dissolving, setDissolving] = useState(false);
  const [world, setWorld] = useState<"completed" | "ongoing" | null>(null);
  const mounted = open || dissolving;

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    }, 60);
    const el = panelRef.current;
    const release = el ? trapFocus(el) : () => {};
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      release();
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      restoreRef.current?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    setDissolving((d) => (d ? d : true));
  }, [open]);
  useEffect(() => {
    if (open || !dissolving) return;
    const t = setTimeout(() => setDissolving(false), 360);
    return () => clearTimeout(t);
  }, [open, dissolving]);

  // leaving the layer releases the held world
  useEffect(() => {
    if (!open) setWorld(null);
  }, [open]);

  if (!mounted) return null;

  const states = [
    {
      key: "completed" as const,
      to: "/projects/completed",
      number: "01",
      label: "Completed",
      line: "Work delivered.",
      count: `${completedCount} project${completedCount === 1 ? "" : "s"}`,
      plate: completedPlate,
      alt: "Completed Capex works — roof-top chiller plant photography",
    },
    {
      key: "ongoing" as const,
      to: "/projects/ongoing",
      number: "02",
      label: "Ongoing",
      line: "Work currently taking shape.",
      count: `${ongoingCount} project${ongoingCount === 1 ? "" : "s"}`,
      plate: ongoingPlate,
      alt: "Ongoing Capex works — underground duct and cable work photography",
    },
  ];

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Projects — choose a state of work"
      aria-hidden={!open || undefined}
      className={`fixed inset-0 z-[80] flex flex-col text-white ${
        open
          ? "layer-in bg-[oklch(0.185_0.02_60/0.88)] opacity-100 backdrop-blur-[10px] backdrop-saturate-[0.9]"
          : "pointer-events-none bg-[oklch(0.185_0.02_60/0.88)] opacity-0 backdrop-blur-[10px] transition-opacity duration-[340ms]"
      }`}
    >
      {/* the state plate — the world's imagery, held low beneath the words.
          Nothing on hover; everything on HOVER of a row: the plate
          cross-fades + drifts a breath toward its own state. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {states.map((s) => (
          <div
            key={s.key}
            className={`absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              world === s.key ? "opacity-[0.32] scale-[1.03]" : "opacity-0 scale-[1]"
            }`}
          >
            <img
              src={s.plate}
              alt=""
              loading="lazy"
              className={`h-full w-full object-cover [filter:saturate(0.6)_brightness(0.72)] ${
                s.key === "completed" ? "object-[50%_42%]" : "object-[56%_58%]"
              }`}
            />
          </div>
        ))}
        {/* the veil keeps both states reading as ONE dark room */}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.185_0.02_60/0.95)] via-[oklch(0.185_0.02_60/0.55)] to-[oklch(0.185_0.02_60/0.75)]" />
      </div>

      {/* minimal top controls — Studio grammar */}
      <div className="relative flex items-center justify-between px-6 py-5 lg:px-12">
        <span className="eyebrow-sans text-white/45">Projects</span>
        <button
          onClick={onClose}
          tabIndex={open ? undefined : -1}
          className="eyebrow-sans text-white/45 transition-colors hover:text-white"
        >
          Close · Esc
        </button>
      </div>

      {/* the two states — centered, spacious, typographic. Each row is a
          destination; its quiet second line holds the state's meaning.
          Rows rise with the same stagger as Studio's index. */}
      <nav
        className="relative flex flex-1 flex-col items-center overflow-y-auto px-6 py-6 lg:py-10"
        aria-label="Project states"
        {...(!open ? { inert: true as never } : {})}
      >
        <ul className="studio-list m-auto w-full max-w-[860px] py-2">
          {states.map((s, i) => (
            <li
              key={s.key}
              style={{ transitionDelay: open ? `${90 + i * 90}ms` : "0ms" }}
              className={`transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-[10px] opacity-0"
              }`}
            >
              <Link
                to={s.to}
                onMouseEnter={() => setWorld(s.key)}
                onFocus={() => setWorld(s.key)}
                onMouseLeave={() => setWorld(null)}
                tabIndex={open ? undefined : -1}
                aria-label={`${s.label} — ${s.line} ${s.count}`}
                className="group flex items-baseline gap-5 py-3 sm:py-4 md:gap-7 md:py-5"
              >
                <span
                  aria-hidden="true"
                  className="w-6 shrink-0 text-right font-tech text-[11px] tracking-[0.1em] text-white/30 transition-colors duration-300 group-hover:text-[var(--accent-display)] group-focus-visible:text-[var(--accent-display)]"
                >
                  {s.number}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[12vw] font-normal leading-[1.04] tracking-[-0.02em] text-white/90 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white sm:text-[56px] lg:text-[72px]">
                    {s.label}
                  </span>
                  <span className="mt-2 block max-w-[46ch] text-sm leading-relaxed text-white/45 transition-colors duration-300 group-hover:text-white/65 md:text-[15px]">
                    {s.line}
                    <span className="mx-2 text-white/25" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-tech text-[11px] uppercase tracking-[0.18em]">
                      {s.count}
                    </span>
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="ml-1 self-center font-tech text-xl text-transparent transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-white/50 group-focus-visible:text-white/50 md:text-2xl"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative px-6 py-4 lg:px-12">
        <p className="eyebrow-sans text-[10px] text-white/30">
          Capex Construction &amp; Engineering Pvt. Ltd. — What Capex has built · What Capex is
          building
        </p>
      </div>
    </div>
  );
}
