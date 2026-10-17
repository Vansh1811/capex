import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import type { ArchiveProject } from "@/lib/site-data";
import { StatusMark, ProjectCtaArrow } from "@/components/site/projects/ArchiveVocabulary";

/**
 * PROJECT REGISTER PANELS (2026-10 redesign).
 *
 * One shared kit for the register (/projects) and the Completed and Ongoing
 * archives. The visual language is an information-led editorial register:
 * panels on hairlines, small letter-spaced uppercase metadata, the project
 * title as the strongest element. No hero photographs, no alternating
 * composition types — every record takes the same panel, so the register
 * stays calm at any length.
 *
 * Tone: the kit's components are token-driven, so a wrapping scene decides
 * their ground — `paper` ivory on the register/Completed, `band-espresso`
 * on the register's dark introduction and the Ongoing archive. No second
 * component set, no per-field restyling.
 *
 * Every panel renders only fields its record actually carries; a missing
 * field is omitted, never labelled empty.
 */

export type ArchiveSearch = { practice?: string; sector?: string; state?: string };

/** The corpus titles carry practice suffixes; panels read the project name. */
export function panelTitle(p: ArchiveProject): string {
  return p.title.replace(" — HVAC & Fire", "").replace(" — HVAC", "");
}

/* ------------------------------------------------------------------
 * STATE LINKS — the Completed (/ Ongoing) pair. On the main register the
 * pair scrolls to each state's section in place; on an archive the
 * current state is a mark and the sibling state is the link across.
 * Plain links/buttons — no widget chrome, natural keyboard focus.
 * ------------------------------------------------------------------ */
export function StateLinks({
  current,
  completedCount,
  ongoingCount,
  inPage = false,
  search = {},
}: {
  /** The archive this page serves; null on the combined register. */
  current: "completed" | "ongoing" | null;
  completedCount: number;
  ongoingCount: number;
  /** True on /projects — the pair becomes in-page anchors. */
  inPage?: boolean;
  /** Carried across archive navigation so filters persist. */
  search?: ArchiveSearch;
}) {
  const defs = [
    {
      key: "completed" as const,
      label: "Completed",
      count: completedCount,
      noun: "records",
      to: "/projects/completed" as const,
    },
    {
      key: "ongoing" as const,
      label: "Ongoing",
      count: ongoingCount,
      noun: "programmes",
      to: "/projects/ongoing" as const,
    },
  ];

  const figure = (noun: string, count: number) => (
    <span className="font-tech text-[10px] tracking-[0.1em] text-muted-foreground/60">
      {count} {noun}
    </span>
  );

  const labelClass = (isCurrent: boolean) =>
    `inline-flex items-baseline gap-2.5 font-tech text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
      isCurrent ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <>
      {defs.map((d) => {
        const isCurrent = current === d.key;
        if (inPage) {
          return (
            <a
              key={d.key}
              href={`#${d.key}`}
              className={`${labelClass(false)} underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-offset-6`}
            >
              {d.label}
              {figure(d.noun, d.count)}
            </a>
          );
        }
        if (isCurrent) {
          return (
            <span key={d.key} className={labelClass(true)} aria-current="true">
              {d.label}
              {figure(d.noun, d.count)}
            </span>
          );
        }
        return (
          <Link
            key={d.key}
            to={d.to}
            search={{ ...search } as never}
            className={`${labelClass(false)} underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-offset-6`}
          >
            {d.label}
            {figure(d.noun, d.count)}
          </Link>
        );
      })}
    </>
  );
}

/** The quiet filter trigger for the archives' meta row. */
export function FilterTrigger({ active, onOpen }: { active: boolean; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      aria-haspopup="dialog"
      className={`font-tech text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      } underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-offset-6`}
    >
      Filter {active ? "· on" : "+"}
    </button>
  );
}

/* ------------------------------------------------------------------
 * THE OPENING — compact, typographic. The register states itself,
 * nothing more. No hero image, no full-screen scene. On the main
 * register and the Ongoing archive the opening is a deep-espresso
 * scene (band-espresso re-maps the tokens so everything beneath
 * adapts); Completed keeps its ivory paper.
 * ------------------------------------------------------------------ */
export function RegisterOpening({
  eyebrow,
  title,
  copy,
  note,
  meta,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  copy: string;
  /** An honest qualifier line, in small register type (used by Ongoing). */
  note?: string;
  meta?: ReactNode;
  /** light = warm-ivory paper (default) · dark = deep espresso scene. */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <section
      aria-label={`${title} — introduction`}
      data-tone={dark ? "dark" : "light"}
      className={dark ? "band-espresso" : "paper bg-background"}
    >
      <div
        className={
          dark
            ? "mx-auto max-w-[1680px] px-6 pb-12 pt-32 md:px-10 md:pb-16 md:pt-40 lg:px-12"
            : "mx-auto max-w-[1680px] px-6 pb-8 pt-32 md:px-10 md:pb-10 md:pt-40 lg:px-12"
        }
      >
        <Reveal>
          <p
            className={
              dark
                ? "eyebrow-sans text-[var(--accent-display)]"
                : "eyebrow-sans text-muted-foreground"
            }
          >
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 font-display text-[15vw] font-normal leading-[0.96] tracking-[-0.025em] text-foreground md:text-[80px] lg:text-[100px]">
            {title}
            {dark ? (
              <span className="text-[var(--accent-display)]">.</span>
            ) : (
              <span className="text-muted-foreground/40">.</span>
            )}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-7 max-w-[56ch] text-sm leading-[1.8] text-muted-foreground md:text-[15px]">
            {copy}
          </p>
        </Reveal>
        {meta && (
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-border pt-6">
              {meta}
            </div>
          </Reveal>
        )}
        {note && (
          <Reveal delay={280}>
            <p className="mt-6 max-w-[60ch] font-tech text-[10px] uppercase leading-[2] tracking-[0.16em] text-muted-foreground/70">
              {note}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * THE PANEL — one record, one composition. Fine hairline border on a
 * warm-ivory surface; small uppercase metadata; the title carries the
 * weight. The whole panel is the link — no nested links inside.
 * ------------------------------------------------------------------ */
export function ProjectPanel({ p }: { p: ArchiveProject }) {
  return (
    <Link
      to="/projects/$slug"
      params={{ slug: p.slug }}
      aria-label={`${panelTitle(p)} — ${p.city}, ${p.state}. View the project record.`}
      className="group flex h-full flex-col rounded-sm border border-border bg-[var(--surface-elevated)] p-6 transition-colors duration-300 hover:border-foreground/30 hover:bg-[var(--surface)] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-foreground md:p-7"
    >
      <div className="flex items-baseline justify-between gap-x-4 gap-y-1">
        <span className="font-tech text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          Sheet {p.ref}
        </span>
        <StatusMark status={p.status} />
      </div>

      <h3 className="mt-4 font-display text-[21px] font-normal leading-[1.15] tracking-[-0.015em] text-foreground/90 transition-colors duration-300 group-hover:text-foreground md:text-[22px]">
        {panelTitle(p)}
      </h3>

      <p className="mt-2.5 max-w-[46ch] text-[13px] leading-[1.7] text-muted-foreground">
        {p.scope_line}
      </p>

      <div className="mt-auto pt-6">
        <dl className="border-t border-border/80 pt-4">
          {p.client_display && (
            <div className="flex items-baseline justify-between gap-4 py-0.5">
              <dt className="shrink-0 font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
                Client
              </dt>
              <dd className="truncate text-right text-[13px] leading-[1.6] text-foreground/80 transition-colors duration-300 group-hover:text-foreground/95">
                {p.client_display}
              </dd>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-4 py-0.5">
            <dt className="shrink-0 font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
              Location
            </dt>
            <dd className="truncate text-right text-[13px] leading-[1.6] text-foreground/80 transition-colors duration-300 group-hover:text-foreground/95">
              {p.city}, {p.state}
            </dd>
          </div>
          {p.practice_label && (
            <div className="flex items-baseline justify-between gap-4 py-0.5">
              <dt className="shrink-0 font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
                Practice
              </dt>
              <dd className="truncate text-right text-[13px] leading-[1.6] text-foreground/80 transition-colors duration-300 group-hover:text-foreground/95">
                {p.practice_label}
              </dd>
            </div>
          )}
        </dl>

        <p className="mt-5 flex items-center gap-2.5 font-tech text-[11px] uppercase tracking-[0.2em] text-foreground">
          <span className="border-b border-border/70 pb-1 transition-colors duration-300 group-hover:border-foreground group-focus-visible:border-foreground">
            View project
          </span>
          <ProjectCtaArrow />
        </p>
      </div>
    </Link>
  );
}

/** The steady grid — two balanced columns on desktop, one on smaller screens. */
export function PanelField({ projects }: { projects: ArchiveProject[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
      {projects.map((p) => (
        <ProjectPanel key={p.slug} p={p} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
 * SECTION HEADING — used on the main register, where Completed and
 * Ongoing sit as two labelled sections of the one page.
 * ------------------------------------------------------------------ */
export function RegisterSectionHeading({
  label,
  count,
  noun,
  description,
  archiveTo,
}: {
  label: string;
  count: number;
  noun: string;
  description: string;
  archiveTo: "/projects/completed" | "/projects/ongoing";
}) {
  return (
    <div className="border-t border-border pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <h2 className="font-display text-[30px] font-normal leading-none tracking-[-0.02em] text-foreground md:text-[36px]">
          {label}
        </h2>
        <div className="flex items-baseline gap-6">
          <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80">
            {count} {noun}
          </span>
          <Link
            to={archiveTo}
            className="group inline-flex items-center gap-2.5 font-tech text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
            aria-label={`Search and filter the ${label.toLowerCase()} archive`}
          >
            <span className="border-b border-border/70 pb-1 transition-colors duration-300 group-hover:border-foreground">
              Search &amp; filter
            </span>
            <ProjectCtaArrow />
          </Link>
        </div>
      </div>
      <p className="mt-4 max-w-[56ch] text-[13px] leading-[1.8] text-muted-foreground md:text-sm">
        {description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------
 * FILTERED NOTICE — the archive's quiet state line when filters apply.
 * ------------------------------------------------------------------ */
export function FilteredNotice({
  count,
  noun,
  onReset,
}: {
  count: number;
  noun: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-6">
      <p className="font-tech text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {count} {count === 1 ? noun.replace(/s$/, "") : noun} — filtered
      </p>
      <button
        onClick={onReset}
        className="font-tech text-[11px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 outline-offset-4 hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline"
      >
        Reset
      </button>
    </div>
  );
}

/** The empty state — same restraint as the rest of the register. */
export function EmptyRegister({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <div className="paper bg-background">
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 lg:px-12">
        <p className="font-display text-2xl font-normal text-foreground/80">
          No {label.toLowerCase()} projects match these filters.
        </p>
        <button
          onClick={onClear}
          className="mt-6 font-tech text-[11px] uppercase tracking-[0.24em] text-foreground underline-offset-4 outline-offset-4 hover:underline focus-visible:underline"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * THE CLOSE — one hairline band that hands off to the other state.
 * Reuses the copy the previous close already carried. Tone follows
 * the page around it: light on the register/Completed, dark at the
 * end of the Ongoing archive.
 * ------------------------------------------------------------------ */
export function RegisterClose({
  heading,
  eyebrow,
  label,
  note,
  to,
  tone = "light",
}: {
  heading: string;
  eyebrow: string;
  label: string;
  note: string;
  to: "/projects/completed" | "/projects/ongoing";
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <section
      aria-label="Continue the record"
      data-tone={dark ? "dark" : "light"}
      className={dark ? "band-espresso" : "paper bg-background"}
    >
      <div
        className={
          dark
            ? "mx-auto max-w-[1680px] px-6 pb-28 pt-10 md:px-10 lg:px-12"
            : "mx-auto max-w-[1680px] px-6 pb-24 pt-4 md:px-10 lg:px-12"
        }
      >
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t border-border pt-10">
          <div>
            <p className="eyebrow-sans text-muted-foreground">{eyebrow}</p>
            <h2 className="mt-4 max-w-[26ch] font-display text-[30px] font-normal leading-[1.1] tracking-[-0.02em] text-foreground md:text-[40px]">
              {heading}
            </h2>
          </div>
          <Link
            to={to}
            className="group mb-1 inline-flex items-baseline gap-4 border-b border-foreground/30 pb-3 transition-colors duration-300 hover:border-foreground"
          >
            <span className="font-display text-lg font-medium tracking-[-0.01em] md:text-xl">
              {label}
            </span>
            <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {note}
            </span>
            <span
              aria-hidden="true"
              className="text-lg transition-transform duration-300 group-hover:translate-x-1.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
