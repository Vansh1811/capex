import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export type HomeNavProps = {
  /** True while the nav sits over a dark scene — nav renders light text. */
  overDark: boolean;
  brandWordmark: string;
  onOpenSearch: () => void;
  onOpenStudio: () => void;
};

/**
 * Homepage editorial navigation (V3): CAPEX · PROJECTS · STUDIO · SEARCH.
 * Two of the words open designed experiences instead of navigating. The
 * bar stays transparent over dark scenes, and condenses to a paper
 * hairline bar over light ones — color adapts to the scene beneath it
 * without ever becoming a heavy UI element.
 */
export function HomeNav({ overDark, brandWordmark, onOpenSearch, onOpenStudio }: HomeNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Esc closes the mobile menu — same contract as Studio/Search.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const tone = overDark
    ? { base: "text-white/60", hover: "hover:text-white", brand: "text-white" }
    : { base: "text-muted-foreground", hover: "hover:text-foreground", brand: "text-foreground" };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          overDark
            ? "bg-transparent"
            : "border-b border-border bg-background/92 backdrop-blur-[6px]"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1680px] items-center justify-between px-6 lg:px-12">
          <Link
            to="/"
            aria-label={`${brandWordmark} — home`}
            className={`font-display text-[15px] font-bold tracking-[0.3em] transition-colors duration-300 ${tone.brand}`}
          >
            {brandWordmark}
          </Link>

          {/* desktop — four floating words */}
          <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
            <Link
              to="/projects"
              className={`eyebrow-sans transition-colors duration-300 ${tone.base} ${tone.hover}`}
            >
              Projects
            </Link>
            <button
              onClick={onOpenStudio}
              className={`eyebrow-sans transition-colors duration-300 ${tone.base} ${tone.hover}`}
            >
              Studio
            </button>
            <button
              onClick={onOpenSearch}
              className={`eyebrow-sans transition-colors duration-300 ${tone.base} ${tone.hover}`}
            >
              Search
            </button>
          </nav>

          {/* mobile — opens the same studio index (search included within) */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className={`eyebrow-sans transition-colors lg:hidden ${tone.brand}`}
          >
            Menu
          </button>
        </div>
      </header>

      {/* mobile menu — mirrors the desktop's designed interactions */}
      {open && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-[var(--ink)] text-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="flex h-20 items-center justify-between px-6">
            <span className="font-display text-[15px] font-bold tracking-[0.3em]">
              {brandWordmark}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="eyebrow-sans text-white/70 hover:text-white"
              aria-label="Close menu"
            >
              Close
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-7 px-6" aria-label="Primary">
            {[
              { label: "Home", to: "/" },
              { label: "Projects", to: "/projects" },
            ].map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display text-4xl font-medium tracking-tight text-white/90 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                onOpenStudio();
              }}
              className="text-left font-display text-4xl font-medium tracking-tight text-white/90 hover:text-white"
            >
              Studio
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onOpenSearch();
              }}
              className="text-left font-display text-4xl font-medium tracking-tight text-white/90 hover:text-white"
            >
              Search
            </button>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="font-display text-4xl font-medium tracking-tight text-white/90 hover:text-white"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
