import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

/* ============================================================
 * Drawing-sheet primitives (Phase 4 §3) — annotation, not theme.
 * ============================================================ */

/** [ NN · LABEL ] section eyebrow (Phase 4 §3.2) */
export function SectionEyebrow({ n, label }: { n?: string; label: string }) {
  return (
    <div className="section-eyebrow" aria-hidden="false">
      {n ? `[ ${n} · ${label} ]` : `[ ${label} ]`}
    </div>
  );
}

/** Section header: eyebrow + display headline (+ optional sub/CTA) */
export function SectionHeader({
  n,
  label,
  title,
  sub,
  cta,
  ctaTo = "/projects",
  tone = "light",
}: {
  n?: string;
  label: string;
  title: string;
  sub?: string;
  cta?: string;
  ctaTo?: string;
  tone?: "light" | "navy";
}) {
  const fg = tone === "navy" ? "text-white" : "text-foreground";
  const subCls = tone === "navy" ? "text-white/70" : "text-muted-foreground";
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <SectionEyebrow n={n} label={label} />
        <h2
          className={`mt-3 font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] md:text-4xl ${fg}`}
        >
          {title}
        </h2>
        {sub && <p className={`mt-3 text-base leading-relaxed ${subCls}`}>{sub}</p>}
      </div>
      {cta && (
        <Link
          to={ctaTo}
          className={`group inline-flex items-center gap-2 text-sm font-semibold ${tone === "navy" ? "text-white" : "text-primary"}`}
        >
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

/** Engineering title block (Phase 4 §3.1) — 2–4 LABEL: VALUE cells, square corners */
export function TitleBlock({ cells }: { cells: { label: string; value: string }[] }) {
  return (
    <dl
      className="title-block grid grid-cols-2 divide-border md:flex md:divide-x"
      aria-label="Project metadata"
    >
      {cells.map((c) => (
        <div key={c.label} className="border-border px-4 py-3 md:border-0">
          <dt className="font-tech text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
            {c.label}
          </dt>
          <dd className="mt-0.5 font-tech text-xs text-foreground">{c.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Metadata strip — single-row LABEL · VALUE pairs (Phase 4 §3.6) */
export function MetadataStrip({
  items,
  tone = "light",
}: {
  items: string[];
  tone?: "light" | "navy";
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-6 gap-y-2 border-y py-3 font-tech text-xs ${
        tone === "navy" ? "border-white/10 text-white/70" : "border-border text-muted-foreground"
      }`}
    >
      {items.filter(Boolean).map((i) => (
        <span key={i}>{i}</span>
      ))}
    </div>
  );
}

/** The designed no-photo treatment (Phase 4 §16.5) — honest absence */
export function NoPhotoPanel({
  ref: refCode,
  label,
  tone = "light",
}: {
  ref?: string | null;
  label?: string;
  tone?: "light" | "navy";
}) {
  return (
    <div
      role="img"
      aria-label={refCode ? `${refCode} — no photography on record` : "No photography on record"}
      className={`survey-grid relative grid min-h-[180px] place-items-center overflow-hidden rounded-lg border ${
        tone === "navy" ? "border-white/10 bg-white/[0.02]" : "border-border bg-[var(--surface)]"
      }`}
    >
      <span
        className={`font-tech text-[11px] uppercase tracking-[0.06em] ${tone === "navy" ? "text-white/50" : "text-muted-foreground"}`}
      >
        {refCode ? `${refCode} — ` : ""}NO PHOTOGRAPHY ON RECORD
        {label ? ` · ${label}` : ""}
      </span>
    </div>
  );
}

/** Metric: mono value + unit + label (Phase 4 §5.7) */
export function Metric({
  value,
  unit,
  label,
  tone = "light",
  size = "l",
}: {
  value: string;
  unit?: string;
  label: string;
  tone?: "light" | "navy";
  size?: "l" | "xl";
}) {
  const color = tone === "navy" ? "text-accent" : "text-foreground";
  return (
    <div>
      <div
        className={`font-tech font-medium leading-none ${size === "xl" ? "text-[40px] md:text-[64px]" : "text-[28px] md:text-[40px]"} ${color}`}
      >
        {value}
        {unit && <span className="ml-1 text-[0.5em]">{unit}</span>}
      </div>
      <div
        className={`mt-2 font-tech text-[11px] uppercase tracking-[0.06em] ${
          tone === "navy" ? "text-white/70" : "text-muted-foreground"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

/** Status chip — renders ONLY for confirmed statuses (Phase 4 §8.2) */
export function StatusChip({ status }: { status: string }) {
  if (status === "unconfirmed") return null;
  const ongoing = status === "ongoing";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-0.5 font-tech text-[10px] uppercase tracking-wide ${
        ongoing
          ? "border-accent/40 text-accent"
          : "border-[var(--status-verified)]/40 text-[var(--status-verified)]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${ongoing ? "bg-accent" : "bg-[var(--status-verified)]"}`}
      />
      {status}
    </span>
  );
}

/** Practice chip: [ PRACTICE 0N · label ] */
export function PracticeChip({
  number,
  label,
  tone = "light",
}: {
  number: number;
  label: string;
  tone?: "light" | "navy";
}) {
  return (
    <span
      className={`inline-block rounded-[4px] border px-2 py-0.5 font-tech text-[10px] uppercase tracking-[0.06em] ${
        tone === "navy" ? "border-white/20 text-white/80" : "border-border text-muted-foreground"
      }`}
    >
      Practice 0{number} · {label}
    </span>
  );
}

/** CTA band — shared closer (Phase 4 component 24) */
export function CTABand({ title, serviceTerm }: { title?: string; serviceTerm?: string }) {
  const heading =
    title ?? (serviceTerm ? `Discuss ${serviceTerm} for your project.` : "Start a project.");
  return (
    <section className="bg-[var(--brand-deep)] py-20 text-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6 px-6 lg:px-10">
        <div>
          <SectionEyebrow label="Start" />
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] md:text-4xl">
            {heading}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="inline-flex h-12 items-center rounded-[4px] bg-accent px-6 text-sm font-bold text-[var(--accent-foreground)] transition-transform hover:scale-[1.02]"
          >
            Start a Project
          </Link>
          <Link
            to="/projects"
            className="group inline-flex h-12 items-center gap-2 text-sm font-semibold text-white"
          >
            Explore Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Page hero for interior pages (Phase 4: light editorial heroes) */
export function PageHero({
  eyebrow,
  title,
  sub,
  strip,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  strip?: string[];
}) {
  return (
    <section className="border-b border-border bg-background pb-10 pt-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <SectionEyebrow label={eyebrow} />
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em] md:text-[56px]">
          {title}
        </h1>
        {sub && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{sub}</p>
        )}
        {strip && (
          <div className="mt-8">
            <MetadataStrip items={strip} />
          </div>
        )}
      </div>
    </section>
  );
}

/** Content band wrapper with consistent rhythm */
export function Band({
  tone = "light",
  children,
  className = "",
  id,
}: {
  tone?: "light" | "offwhite" | "navy";
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const bg =
    tone === "navy"
      ? "bg-[var(--brand)] text-white"
      : tone === "offwhite"
        ? "bg-[var(--surface)]"
        : "bg-background";
  return (
    <section id={id} className={`${bg} py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">{children}</div>
    </section>
  );
}
