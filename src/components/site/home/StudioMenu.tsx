import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { trapFocus } from "@/lib/focus-trap";

type Destination = { label: string; to: string };

/**
 * Only destinations that exist today. Careers is a redirect stub (307 →
 * /about#careers) so it is omitted rather than linked as a dead end.
 */
const DESTINATIONS: Destination[] = [
  { label: "About", to: "/about" },
  { label: "Capabilities", to: "/services" },
  { label: "Sectors", to: "/sectors" },
  { label: "People", to: "/team" },
  { label: "Clients", to: "/clients" },
  { label: "Credentials", to: "/credentials" },
  { label: "Contact", to: "/contact" },
];

/**
 * STUDIO (V3.1): a quiet information index, not a dashboard menu. The
 * homepage remains alive beneath — the hero video keeps playing, the scene
 * stays visible through a translucent charcoal wash with a breath of blur.
 * The index itself is pure typography: a centered vertical list of large
 * words with small ordinals, generous spacing, no descriptions, no cards.
 * Rows rise with a gentle stagger; hovering a word lets the others recede
 * (pure CSS). Escape closes; the layer fades out over the live page before
 * unmounting, so the homepage returns smoothly. Focus enters the dialog on
 * open, is trapped while open, and returns to the triggering control.
 */
export function StudioMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  // hold the layer mounted through the closing fade so the homepage
  // returns smoothly instead of snapping
  const [dissolving, setDissolving] = useState(false);
  const mounted = open || dissolving;

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>("a, button");
      first?.focus();
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

  // closing: keep the layer for one fade, then unmount
  useEffect(() => {
    if (open) return;
    if (!dissolving) return;
    const t = setTimeout(() => setDissolving(false), 360);
    return () => clearTimeout(t);
  }, [open, dissolving]);

  // when closing starts, mark the layer as dissolving once
  useEffect(() => {
    if (open) return;
    setDissolving((d) => (d ? d : true));
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Studio — Capex information index"
      aria-hidden={!open || undefined}
      className={`fixed inset-0 z-[80] flex flex-col text-white ${
        open
          ? "layer-in bg-[oklch(0.185_0.02_60/0.86)] opacity-100 backdrop-blur-[10px] backdrop-saturate-[0.9]"
          : "pointer-events-none bg-[oklch(0.185_0.02_60/0.86)] opacity-0 backdrop-blur-[10px] transition-opacity duration-[340ms]"
      }`}
    >
      {/* minimal top controls */}
      <div className="flex items-center justify-between px-6 py-5 lg:px-12">
        <span className="eyebrow-sans text-white/45">Studio</span>
        <button
          onClick={onClose}
          tabIndex={open ? undefined : -1}
          className="eyebrow-sans text-white/45 transition-colors hover:text-white"
        >
          Close · Esc
        </button>
      </div>

      {/* the index — centered, spacious, typographic.
          The list carries m-auto: centered when it fits, top-anchored and
          scrollable when the viewport is short — never clipped. */}
      <nav
        className="flex flex-1 flex-col items-center overflow-y-auto px-6 py-6 lg:py-10"
        aria-label="Studio destinations"
        {...(!open ? { inert: true as never } : {})}
      >
        <ul className="studio-list m-auto w-full max-w-[820px] py-2">
          {DESTINATIONS.map((d, i) => (
            <li
              key={d.label}
              style={{ transitionDelay: open ? `${90 + i * 55}ms` : "0ms" }}
              className={`transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-[10px] opacity-0"
              }`}
            >
              <Link
                to={d.to}
                onClick={onClose}
                tabIndex={open ? undefined : -1}
                className="group flex items-baseline gap-5 py-2.5 sm:py-3 md:gap-7 md:py-4"
              >
                <span
                  aria-hidden="true"
                  className="w-6 shrink-0 text-right font-tech text-[11px] tracking-[0.1em] text-white/30 transition-colors duration-300 group-hover:text-[var(--accent-display)] group-focus-visible:text-[var(--accent-display)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[9.5vw] font-normal leading-[1.08] tracking-[-0.015em] text-white/90 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white sm:text-[44px] lg:text-[58px]">
                  {d.label}
                </span>
                <span
                  aria-hidden="true"
                  className="ml-1 self-center font-tech text-sm text-transparent transition-colors duration-300 group-hover:text-white/50 group-focus-visible:text-white/50"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-6 py-4 lg:px-12">
        <p className="eyebrow-sans text-[10px] text-white/30">
          Capex Construction &amp; Engineering Pvt. Ltd. — Noida, India
        </p>
      </div>
    </div>
  );
}
