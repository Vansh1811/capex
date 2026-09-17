import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { trapFocus } from "@/lib/focus-trap";
import type { ArchiveProject } from "@/lib/site-data";

/**
 * PROJECTS SCENE VOCABULARY (2026-09 gateway redesign).
 *
 * Shared by the Completed and Ongoing archives and the case study. The
 * experience inherits the locked homepage's world — ivory paper, deep-earth
 * scenes, eyebrow-sans labels, mono figures of record, the Studio overlay
 * grammar for the Register and Filter layers — and adds the record language
 * of an engineering archive: sheet numbers, hairline rules, one figure of
 * record per project.
 *
 * Imagery comes from the central media registry (project-media.ts). Records
 * with real Capex photography carry "Capex works photograph" captions; only
 * REFERENCE frames carry the "not a documented Capex project" caption — the
 * registry's sourceType decides, never the component.
 */

/* ------------------------------------------------------------------
 * CROP VARIANCE — records sharing a plate get different object-positions.
 * Deterministic per slug; no Math.random, no hydration mismatch.
 * ------------------------------------------------------------------ */
const CROP_POSITIONS = [
  "object-[30%_24%]",
  "object-[58%_56%]",
  "object-[46%_70%]",
  "object-[68%_32%]",
  "object-[34%_58%]",
  "object-[54%_40%]",
];

export function cropOf(p: { slug: string }): string {
  let h = 0;
  for (const c of p.slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return CROP_POSITIONS[h % CROP_POSITIONS.length];
}

/* ------------------------------------------------------------------
 * STATUS — the single editorial mark. Never a progress percentage.
 * ------------------------------------------------------------------ */
export function StatusMark({
  status,
  onDark = false,
  pulse = false,
  className = "",
}: {
  status: "completed" | "ongoing" | "unconfirmed";
  onDark?: boolean;
  /** Ongoing rooms only — a slow breath, the only moving mark on the page. */
  pulse?: boolean;
  className?: string;
}) {
  if (status === "ongoing") {
    return (
      <span
        className={`inline-flex items-center gap-2.5 font-tech text-[11px] uppercase tracking-[0.22em] ${
          onDark ? "text-white" : "text-foreground"
        } ${className}`}
      >
        <span aria-hidden="true" className="relative flex h-2 w-2">
          {pulse && (
            <span
              aria-hidden="true"
              className="absolute inline-flex h-full w-full rounded-full bg-current opacity-40 motion-safe:animate-ping"
            />
          )}
          <span
            aria-hidden="true"
            className={`relative inline-flex h-2 w-2 rounded-full ${
              onDark ? "bg-[var(--accent-display)]" : "bg-[var(--accent)]"
            }`}
          />
        </span>
        Ongoing
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-tech text-[11px] uppercase tracking-[0.22em] ${
        onDark ? "text-white/55" : "text-muted-foreground"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 rounded-full ${onDark ? "bg-white/55" : "bg-muted-foreground/70"}`}
      />
      Completed
    </span>
  );
}

/* ------------------------------------------------------------------
 * THE PRINT — every project image frame, one hover language.
 * ------------------------------------------------------------------ */
export function PrintFrame({
  p,
  ratio,
  className = "",
  imgClassName = "",
  eager = false,
  tone = "light",
}: {
  p: ArchiveProject;
  ratio: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  tone?: "light" | "dark";
}) {
  const real = p.media.sourceType !== "REFERENCE";
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`pointer-events-none overflow-hidden bg-[var(--surface)] ${className}`}
    >
      <img
        src={p.media.src}
        alt={p.media.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${cropOf(p)} transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03] ${
          tone === "dark"
            ? "[filter:saturate(0.85)_brightness(0.94)] group-hover:[filter:saturate(1)]"
            : "[filter:saturate(0.88)] group-hover:[filter:saturate(1)]"
        } ${imgClassName}`}
      />
    </div>
  );
}

/** The caption every frame carries — wording follows the registry's sourceType. */
export function MediaCaption({
  p,
  right,
  onDark = false,
  className = "",
}: {
  p: ArchiveProject;
  right?: string;
  onDark?: boolean;
  className?: string;
}) {
  const real = p.media.sourceType !== "REFERENCE";
  return (
    <figcaption
      className={`mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 ${className}`}
    >
      <span
        className={`font-tech text-[10px] uppercase tracking-[0.2em] ${
          onDark ? "text-white/30" : "text-muted-foreground/70"
        }`}
      >
        {real
          ? "Capex works photograph — company record"
          : "Reference imagery — not a documented Capex project"}
      </span>
      {right && (
        <span
          className={`shrink-0 font-tech text-[10px] tracking-[0.2em] ${
            onDark ? "text-white/30" : "text-muted-foreground/70"
          }`}
        >
          {right}
        </span>
      )}
    </figcaption>
  );
}

/** The "View project →" affordance shared by all compositions. */
export function ViewProjectAffordance({
  onDark = false,
  className = "",
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`mt-8 inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] transition-colors ${className} ${
        onDark ? "text-white" : "text-foreground"
      }`}
    >
      <span
        className={`border-b pb-1 transition-colors duration-300 ${
          onDark
            ? "border-white/30 group-hover:border-white"
            : "border-border group-hover:border-foreground"
        }`}
      >
        View project
      </span>
      <ProjectCtaArrow />
    </span>
  );
}

/** A quiet archive position mark: RECORD 07 / 49. */
export function ProjectPosition({
  index,
  total,
  onDark = false,
}: {
  index: number;
  total: number;
  onDark?: boolean;
}) {
  return (
    <span
      className={`font-tech text-[10px] uppercase tracking-[0.2em] ${
        onDark ? "text-white/40" : "text-muted-foreground/60"
      }`}
    >
      Record {String(index).padStart(2, "0")} / {total}
    </span>
  );
}

export function ProjectCtaArrow({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 ${className}`}
    >
      →
    </span>
  );
}

/* ------------------------------------------------------------------
 * ARCHIVE NAV — Projects' own bar: brand, the two-state register switch,
 * INDEX + FILTER controls. Tone-adapting like every site nav.
 * ------------------------------------------------------------------ */
export function ArchiveNav({
  overDark,
  brandWordmark,
  state,
  completedCount,
  ongoingCount,
  onOpenIndex,
  indexActive,
  onOpenFilter,
  filterActive,
}: {
  overDark: boolean;
  brandWordmark: string;
  /** The archive this nav currently serves. */
  state: "completed" | "ongoing";
  completedCount: number;
  ongoingCount: number;
  onOpenIndex: () => void;
  indexActive: boolean;
  onOpenFilter: () => void;
  filterActive: boolean;
}) {
  const tone = overDark
    ? {
        base: "text-white/60",
        hover: "hover:text-white",
        brand: "text-white",
        line: "border-white/15",
        active: "text-white",
        inactive: "text-white/40",
      }
    : {
        base: "text-muted-foreground",
        hover: "hover:text-foreground",
        brand: "text-foreground",
        line: "border-border",
        active: "text-foreground",
        inactive: "text-muted-foreground/60",
      };

  const destinations = [
    {
      key: "completed" as const,
      label: "Completed",
      count: completedCount,
      to: "/projects/completed" as const,
    },
    {
      key: "ongoing" as const,
      label: "Ongoing",
      count: ongoingCount,
      to: "/projects/ongoing" as const,
    },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        overDark ? "bg-transparent" : "border-b border-border bg-background/92 backdrop-blur-[6px]"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1680px] items-center justify-between gap-8 px-6 lg:px-12">
        <Link
          to="/"
          aria-label={`${brandWordmark} — home`}
          className={`font-display text-[15px] font-bold tracking-[0.3em] transition-colors duration-300 ${tone.brand}`}
        >
          {brandWordmark}
        </Link>

        {/* the two-state switch — editorial words, not a tab bar. The current
            state carries its count and full presence; the other waits. */}
        <nav className="hidden items-center gap-6 lg:flex lg:gap-10" aria-label="Project states">
          {destinations.map((d) => (
            <Link
              key={d.key}
              to={d.to}
              className={`eyebrow-sans flex items-baseline gap-2 transition-colors duration-300 ${
                state === d.key ? tone.active : `${tone.inactive} ${tone.hover}`
              }`}
              aria-current={state === d.key ? "page" : undefined}
            >
              {d.label}
              <span className={`font-tech text-[10px] tracking-[0.1em] ${tone.inactive}`}>
                {d.count}
              </span>
            </Link>
          ))}
        </nav>

        <nav className="hidden items-center gap-6 lg:flex lg:gap-10" aria-label="Archive controls">
          <Link
            to="/projects"
            className={`eyebrow-sans transition-colors duration-300 ${tone.base} ${tone.hover}`}
          >
            Projects
          </Link>
          <button
            onClick={onOpenIndex}
            aria-pressed={indexActive}
            className={`eyebrow-sans transition-colors duration-300 ${
              indexActive || filterActive ? tone.active : `${tone.base} ${tone.hover}`
            }`}
          >
            Index {indexActive ? "·" : "→"}
          </button>
          <button
            onClick={onOpenFilter}
            className={`eyebrow-sans transition-colors duration-300 ${tone.hover} ${
              filterActive ? tone.active : tone.base
            }`}
          >
            Filter {filterActive ? "·" : "+"}
          </button>
          <button
            onClick={() => window.dispatchEvent(new Event("open-search"))}
            className={`eyebrow-sans transition-colors duration-300 ${tone.base} ${tone.hover}`}
          >
            Search
          </button>
        </nav>

        {/* mobile — the switch collapses to the count pair; controls live under the opening */}
        <div className="mr-14 flex items-center gap-5 lg:hidden">
          {destinations.map((d) => (
            <Link
              key={d.key}
              to={d.to}
              className={`eyebrow-sans flex items-baseline gap-1.5 ${
                state === d.key ? tone.active : tone.inactive
              }`}
              aria-current={state === d.key ? "page" : undefined}
            >
              {d.label}
              <span className={`font-tech text-[10px] ${tone.inactive}`}>{d.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------
 * THE REGISTER — the complete-project index, the archive's other mode.
 * A precise typographic register: row per record, sheet ref, client, city,
 * figure. Desktop rows hold a floating plate preview; mobile rows expand.
 * Escape closes; focus trapped and restored.
 * ------------------------------------------------------------------ */
export function RegisterOverlay({
  open,
  onClose,
  projects,
  stateLabel,
  count,
}: {
  open: boolean;
  onClose: () => void;
  projects: ArchiveProject[];
  stateLabel: "Completed" | "Ongoing";
  count: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const [dissolving, setDissolving] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const mounted = open || dissolving;
  const hoveredProject = projects.find((p) => p.slug === hovered) ?? null;

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
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

  if (!mounted) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${stateLabel} projects — the register`}
      aria-hidden={!open || undefined}
      className={`fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-background text-foreground ${
        open
          ? "layer-in opacity-100"
          : "pointer-events-none opacity-0 transition-opacity duration-[340ms]"
      }`}
    >
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-6 py-5 backdrop-blur-[6px] lg:px-12">
        <div className="mx-auto flex max-w-[1680px] items-baseline justify-between gap-6">
          <p className="eyebrow-sans text-muted-foreground">
            {stateLabel} — the register
            <span className="ml-4 font-tech text-[10px] tracking-[0.1em] text-muted-foreground/60">
              {count} records
            </span>
          </p>
          <button
            onClick={onClose}
            tabIndex={open ? undefined : -1}
            className="eyebrow-sans text-muted-foreground transition-colors hover:text-foreground"
          >
            Close · Esc
          </button>
        </div>
      </div>

      <div
        className="mx-auto w-full max-w-[1680px] px-6 pb-24 pt-10 md:pt-16 lg:px-12"
        {...(!open ? { inert: true as never } : {})}
      >
        <div className="grid gap-14 lg:grid-cols-12">
          {/* the register rows */}
          <ol className="studio-list lg:col-span-8" aria-label={`${stateLabel} project register`}>
            {projects.map((p, i) => {
              const row = (
                <span
                  className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 border-b border-border py-5 transition-colors hover:border-foreground/40 md:grid-cols-[4.5rem_1fr_auto_auto] md:gap-x-8"
                  onMouseEnter={() => setHovered(p.slug)}
                  onFocus={() => setHovered(p.slug)}
                >
                  <span className="font-tech text-[11px] tracking-[0.08em] text-muted-foreground/60 transition-colors group-hover:text-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg font-normal leading-[1.12] tracking-[-0.01em] text-foreground/85 transition-colors group-hover:text-foreground md:text-[24px]">
                      {p.title.replace(" — HVAC & Fire", "").replace(" — HVAC", "")}
                    </span>
                    {/* mobile: tap a row to expand its facts */}
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground md:hidden">
                      {p.client_display ?? p.practice_label} · {p.city}
                      <span className="font-tech text-[10px] uppercase tracking-[0.18em] text-foreground/60">
                        {" "}
                        · {p.status === "ongoing" ? "Ongoing" : "Completed"}
                      </span>
                    </span>
                    {expanded === p.slug && (
                      <span className="mt-3 block max-w-[52ch] border-l border-border pl-4 text-xs leading-relaxed text-muted-foreground">
                        {p.scope_line}
                        {p.sectors[0] && <> — {p.sectors[0].name}</>}
                        {p.client_display && <> · Client: {p.client_display}</>}
                        <span className="mt-2 block font-tech text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                          Sheet {p.ref} · {p.practice_label}
                        </span>
                      </span>
                    )}
                  </span>
                  <span className="hidden text-right text-xs text-muted-foreground md:block md:text-sm">
                    {p.city} · {p.state}
                  </span>
                  <span className="text-right font-tech text-xs text-foreground/70 transition-colors group-hover:text-foreground md:text-sm">
                    {p.metrics[0]
                      ? `${p.metrics[0].value}${p.metrics[0].unit ? ` ${p.metrics[0].unit}` : ""}`
                      : p.status === "ongoing"
                        ? "—"
                        : ""}
                  </span>
                </span>
              );

              return (
                <li key={p.slug}>
                  {/* desktop: the row IS the link; mobile: the row expands facts
                      first — navigation sits in the row's own action button. */}
                  <Link
                    to="/projects/$slug"
                    params={{ slug: p.slug }}
                    onMouseEnter={() => setHovered(p.slug)}
                    onFocus={() => setHovered(p.slug)}
                    className="hidden md:block"
                    aria-label={`${p.title} — ${p.city}, ${p.state}`}
                  >
                    {row}
                  </Link>
                  <button
                    className="block w-full text-left md:hidden"
                    tabIndex={open ? undefined : -1}
                    aria-expanded={expanded === p.slug}
                    onClick={() => setExpanded((cur) => (cur === p.slug ? null : p.slug))}
                  >
                    {row}
                  </button>
                  {expanded === p.slug && (
                    <Link
                      to="/projects/$slug"
                      params={{ slug: p.slug }}
                      tabIndex={open ? undefined : -1}
                      className="mt-3 inline-block font-tech text-[11px] uppercase tracking-[0.24em] text-foreground underline-offset-4 hover:underline"
                    >
                      View record →
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>

          {/* the register's preview plate — desktop */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-32 pt-2">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface)]">
                {projects.slice(0, 24).map((p) => (
                  <img
                    key={p.slug}
                    src={p.media.src}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out [filter:saturate(0.88)] ${cropOf(p)} ${
                      hovered === p.slug ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
              {hoveredProject && (
                <p className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                    {hoveredProject.ref} · {hoveredProject.city}
                  </span>
                  <StatusMark status={hoveredProject.status} />
                </p>
              )}
              <p className="mt-6 font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                {hoveredProject && hoveredProject.media.sourceType !== "REFERENCE"
                  ? "Capex works photograph — company record"
                  : "Reference imagery — not a documented Capex project"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * FILTER — same Studio-grammar layer as before, now with live counts.
 * ------------------------------------------------------------------ */
export function FilterOverlay({
  open,
  onClose,
  facets,
  active,
  onApply,
  onClear,
}: {
  open: boolean;
  onClose: () => void;
  facets: {
    key: "practice" | "sector" | "state";
    label: string;
    options: { value: string; label: string; count: number }[];
  }[];
  active: { practice?: string; sector?: string; state?: string };
  onApply: (patch: { practice?: string; sector?: string; state?: string }) => void;
  onClear: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const [dissolving, setDissolving] = useState(false);
  const mounted = open || dissolving;
  const anyActive = Boolean(active.practice || active.sector || active.state);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button")?.focus();
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

  if (!mounted) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Filter projects"
      aria-hidden={!open || undefined}
      className={`fixed inset-0 z-[80] flex flex-col overflow-y-auto text-white ${
        open
          ? "layer-in bg-[oklch(0.185_0.02_60/0.9)] opacity-100 backdrop-blur-[10px] backdrop-saturate-[0.9]"
          : "pointer-events-none bg-[oklch(0.185_0.02_60/0.9)] opacity-0 backdrop-blur-[10px] transition-opacity duration-[340ms]"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 lg:px-12">
        <span className="eyebrow-sans text-white/45">Filter</span>
        <button
          onClick={onClose}
          tabIndex={open ? undefined : -1}
          className="eyebrow-sans text-white/45 transition-colors hover:text-white"
        >
          Close · Esc
        </button>
      </div>

      <div
        className="mx-auto w-full max-w-[820px] flex-1 px-6 pb-20 pt-6 md:pt-12"
        {...(!open ? { inert: true as never } : {})}
      >
        {facets.map((f, fi) => (
          <section
            key={f.key}
            className={fi > 0 ? "mt-14" : ""}
            aria-label={`Filter by ${f.label}`}
          >
            <p className="eyebrow-sans text-[10px] text-white/35">{f.label}</p>
            <ul className="studio-list mt-6">
              {f.options.map((o) => {
                const isActive = active[f.key] === o.value;
                return (
                  <li key={o.value}>
                    <button
                      onClick={() => onApply({ [f.key]: isActive ? undefined : o.value })}
                      tabIndex={open ? undefined : -1}
                      aria-pressed={isActive}
                      className="group flex w-full items-baseline justify-between gap-6 border-b border-white/10 py-5 text-left"
                    >
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-display text-xl font-normal leading-[1.15] tracking-[-0.01em] transition-colors duration-300 md:text-[26px] ${
                            isActive ? "text-white" : "text-white/85 group-hover:text-white"
                          }`}
                        >
                          {o.label}
                        </span>
                      </span>
                      <span className="shrink-0 font-tech text-sm text-white/35 group-hover:text-white/60">
                        {o.count}
                      </span>
                      {isActive && (
                        <span className="shrink-0 font-tech text-sm text-[var(--accent-display)]">
                          ●
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        {anyActive && (
          <button
            onClick={onClear}
            tabIndex={open ? undefined : -1}
            className="mt-14 font-tech text-[11px] uppercase tracking-[0.24em] text-white/60 underline-offset-4 hover:text-white hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
