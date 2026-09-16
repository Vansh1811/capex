import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import type { ArchiveProject } from "@/lib/site-data";
import {
  PrintFrame,
  MediaCaption,
  ViewProjectAffordance,
  ProjectPosition,
  StatusMark,
  ProjectCtaArrow,
  cropOf,
} from "@/components/site/projects/ArchiveVocabulary";

/**
 * THE RECORD — the Completed archive's editorial field (2026-09-10 redesign).
 *
 * Composition: a quiet typographic opening (THE RECORD — no hero photograph),
 * then a curated hang of varied compositions with a deliberate rhythm:
 *
 *   OPENING (typographic threshold)
 *   → 01  FEATURE            the flagship, large split record
 *   → 02–05 TWIN FIELD       two records, two scales, one row
 *   → 06  OFFSET IMAGE       small metadata left, controlled image right
 *   → 07–09 THE FIELD        a geography interlude (derived, clickable)
 *   → 10  FEATURE            second large moment
 *   → …  STRIP + SPLIT       horizontal strips and split records alternate
 *   → end THE REGISTER       invitation into the index
 *   → ONGOING →              the state switch as the natural close
 *
 * The hang is deterministic from archive position — never random, stable
 * across renders, and the composition types rotate with contrast so no two
 * adjacent records share a geometry. Records carry the real-Capex plates
 * from the media registry; captions follow the registry's sourceType.
 */

/* ------------------------------------------------------------------
 * THE OPENING — typographic, deep earth, full height
 * ------------------------------------------------------------------ */
export function CompletedOpening({
  total,
  practices,
  onOpenIndex,
}: {
  total: number;
  practices: number;
  onOpenIndex: () => void;
}) {
  return (
    <section
      aria-label="Completed projects — introduction"
      data-tone="dark"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[var(--brand)] text-white"
    >
      <div className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-6 pb-16 pt-36 md:px-10 md:pt-44 lg:px-12">
        <div>
          <Reveal delay={80}>
            <p className="eyebrow-sans text-white/45">Projects · State of record</p>
          </Reveal>
          <Reveal delay={160}>
            <h1 className="mt-8 font-display text-[16vw] font-normal leading-[0.94] tracking-[-0.025em] md:text-[104px] lg:text-[136px]">
              Completed<span className="text-white/40">.</span>
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-10 max-w-md text-sm leading-[1.8] text-white/70 md:text-[15px]">
              The record of systems built — delivered, commissioned and
              <br />
              handed over across infrastructure and buildings.
            </p>
          </Reveal>
        </div>

        {/* the metadata field — one line, the archive's whole state */}
        <div className="mt-auto pt-20">
          <Reveal delay={420}>
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3 border-t border-white/15 pt-6">
              <p className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/55">
                {total} projects
              </p>
              <p className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/35">
                {practices} practices
              </p>
              <p className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/35">
                Pan-India
              </p>
              <button
                onClick={onOpenIndex}
                className="group ml-auto flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-white"
              >
                <span className="border-b border-white/40 pb-1 transition-colors group-hover:border-white">
                  The register
                </span>
                <ProjectCtaArrow />
              </button>
            </div>
          </Reveal>
          <Reveal delay={520}>
            <p className="mt-8 max-w-[52ch] font-tech text-[10px] uppercase leading-[2] tracking-[0.16em] text-white/25">
              Every record on this page is a documented Capex engagement — client, quantity and
              location as stated in the company record
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * COMPOSITIONS — the record types of the completed hang
 * ------------------------------------------------------------------ */

/** The shared per-record meta block: scope, client, location — verified fields only. */
function RecordMeta({
  p,
  onDark,
  showStatus = true,
}: {
  p: ArchiveProject;
  onDark: boolean;
  showStatus?: boolean;
}) {
  const t = onDark
    ? { meta: "text-white/55", client: "text-white/70" }
    : { meta: "text-muted-foreground", client: "text-foreground/75" };
  return (
    <div className={`font-tech text-[13px] leading-[2.1] tracking-[0.02em] ${t.meta}`}>
      {showStatus && (
        <p className="mb-3">
          <StatusMark status={p.status} onDark={onDark} />
        </p>
      )}
      {p.client_display && (
        <p>
          <span className="text-muted-foreground/70">Client&nbsp;&nbsp;</span>
          <span className={t.client}>{p.client_display}</span>
        </p>
      )}
      <p>
        <span className="text-muted-foreground/70">Location&nbsp;&nbsp;</span>
        <span className={t.client}>
          {p.city}, {p.state}
        </span>
      </p>
      {p.practice_label && (
        <p>
          <span className="text-muted-foreground/70">Practice&nbsp;&nbsp;</span>
          <span className={t.client}>{p.practice_label}</span>
        </p>
      )}
    </div>
  );
}

/** FEATURE — the large split record: print right, full record left. */
export function FeatureRecord({
  p,
  n,
  total,
  onDark,
  eager = false,
}: {
  p: ArchiveProject;
  n: number;
  total: number;
  onDark: boolean;
  eager?: boolean;
}) {
  const title = p.title.replace(" — HVAC & Fire", "").replace(" — HVAC", "");
  const t = {
    title: onDark
      ? "text-white/90 transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:text-white"
      : "text-foreground/90 transition-all duration-500 ease-out group-hover:translate-x-1 group-hover:text-foreground",
    pos: onDark ? "text-white/40" : "text-muted-foreground/60",
  };
  return (
    <article className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-32 lg:px-12 lg:py-40">
      <Link
        to="/projects/$slug"
        params={{ slug: p.slug }}
        className="group block"
        aria-label={`${p.title} — ${p.city}, ${p.state}`}
      >
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:pr-8">
            <Reveal>
              <p className={`mb-8 font-tech text-[10px] uppercase tracking-[0.2em] ${t.pos}`}>
                <ProjectPosition index={n} total={total} />
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h2
                className={`font-display text-[9vw] font-normal leading-[1.02] tracking-[-0.025em] md:text-[52px] lg:text-[64px] ${t.title}`}
              >
                {title}
              </h2>
            </Reveal>
            <Reveal delay={220}>
              <p
                className={`mt-6 max-w-sm text-sm leading-[1.8] md:text-[15px] ${
                  onDark ? "text-white/60" : "text-muted-foreground"
                }`}
              >
                {p.scope_line}
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-8">
                <RecordMeta p={p} onDark={onDark} />
              </div>
            </Reveal>
            <Reveal delay={420}>
              <ViewProjectAffordance onDark={onDark} />
            </Reveal>
          </div>
          <div className="relative z-10 lg:col-span-7 lg:mr-[-theme(spacing.12)]">
            <ClipReveal edge="right" ratio="4 / 3">
              <PrintFrame
                p={p}
                ratio="4 / 3"
                eager={eager}
                tone={onDark ? "dark" : "light"}
                className="!aspect-auto h-full"
              />
            </ClipReveal>
          </div>
        </div>
      </Link>
      <Reveal delay={200}>
        <MediaCaption p={p} right={p.ref} onDark={onDark} />
      </Reveal>
    </article>
  );
}

/** TWIN FIELD — two records in one row, deliberately different scales. */
export function TwinField({
  pair,
  base,
  total,
  onDark,
}: {
  pair: { p: ArchiveProject; n: number }[];
  base: number;
  total: number;
  onDark: boolean;
}) {
  const scales = ["lg:col-span-5", "lg:col-span-6 lg:col-start-7 lg:mt-24"];
  const ratios = ["4 / 5", "3 / 4"];
  const edges = ["right", "left"] as const;
  const t = {
    title: onDark
      ? "text-white/90 transition-colors group-hover:text-white"
      : "text-foreground/90 transition-colors group-hover:text-foreground",
    meta: onDark ? "text-white/55" : "text-muted-foreground",
    ref: onDark ? "text-white/40" : "text-muted-foreground/60",
  };
  return (
    <div className="mx-auto max-w-[1680px] px-6 py-20 md:px-10 md:py-28 lg:px-12">
      <Reveal>
        <div className="mb-12 flex items-baseline gap-6">
          <p className={`eyebrow-sans ${onDark ? "text-white/40" : "text-muted-foreground"}`}>
            Field — {String(base).padStart(2, "0")}–{String(base + 1).padStart(2, "0")}
          </p>
          <span
            className={`h-px flex-1 border-t ${onDark ? "border-white/10" : "border-border"}`}
            aria-hidden="true"
          />
        </div>
      </Reveal>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        {pair.map(({ p, n }, idx) => (
          <Link
            key={p.slug}
            to="/projects/$slug"
            params={{ slug: p.slug }}
            className={`group block ${scales[idx % scales.length]}`}
            aria-label={`${p.title} — ${p.city}, ${p.state}`}
          >
            <Reveal delay={idx * 120}>
              <p className={`mb-4 font-tech text-[10px] tracking-[0.08em] ${t.ref}`}>
                {String(n).padStart(2, "0")} · {p.ref}
              </p>
              <ClipReveal edge={edges[idx % edges.length]} ratio={ratios[idx % ratios.length]}>
                <PrintFrame
                  p={p}
                  ratio={ratios[idx % ratios.length]}
                  tone={onDark ? "dark" : "light"}
                  className="!aspect-auto h-full"
                />
              </ClipReveal>
              <h3
                className={`mt-5 font-display text-xl font-normal leading-[1.12] tracking-[-0.015em] md:text-[24px] ${t.title}`}
              >
                {p.title.replace(" — HVAC & Fire", "").replace(" — HVAC", "")}
              </h3>
              <p className={`mt-2 text-xs leading-relaxed md:text-sm ${t.meta}`}>
                {p.metrics[0]
                  ? `${p.metrics[0].value}${p.metrics[0].unit ? ` ${p.metrics[0].unit}` : ""} · `
                  : ""}
                {p.city}
              </p>
            </Reveal>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** OFFSET — small metadata left, large controlled image right. */
export function OffsetRecord({ p, n, onDark }: { p: ArchiveProject; n: number; onDark: boolean }) {
  const t = {
    title: onDark
      ? "text-white/90 transition-colors group-hover:text-white"
      : "text-foreground/90 transition-colors group-hover:text-foreground",
    scope: onDark ? "text-white/60" : "text-muted-foreground",
  };
  return (
    <article className="mx-auto max-w-[1680px] px-6 py-20 md:px-10 md:py-28 lg:px-12">
      <Link
        to="/projects/$slug"
        params={{ slug: p.slug }}
        className="group grid items-center gap-10 lg:grid-cols-12"
        aria-label={`${p.title} — ${p.city}, ${p.state}`}
      >
        <div className="lg:col-span-4 lg:col-start-2">
          <Reveal>
            <p
              className={`font-tech text-[10px] tracking-[0.08em] ${onDark ? "text-white/40" : "text-muted-foreground/60"}`}
            >
              {String(n).padStart(2, "0")} · {p.ref}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h3
              className={`mt-4 font-display text-2xl font-normal leading-[1.1] tracking-[-0.02em] md:text-[32px] ${t.title}`}
            >
              {p.title.replace(" — HVAC & Fire", "").replace(" — HVAC", "")}
            </h3>
          </Reveal>
          <Reveal delay={200}>
            <p className={`mt-4 max-w-xs text-sm leading-[1.8] ${t.scope}`}>{p.scope_line}</p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-6">
              <RecordMeta p={p} onDark={onDark} />
            </div>
          </Reveal>
        </div>
        <div className="relative z-10 lg:col-span-6 lg:col-start-6 lg:mr-[-theme(spacing.12)]">
          <ClipReveal edge="right" ratio="16 / 10">
            <PrintFrame
              p={p}
              ratio="16 / 10"
              tone={onDark ? "dark" : "light"}
              className="!aspect-auto h-full"
            />
          </ClipReveal>
        </div>
      </Link>
      <Reveal delay={160}>
        <MediaCaption p={p} right={p.ref} onDark={onDark} />
      </Reveal>
    </article>
  );
}

/** STRIP — the horizontal record: full-width image band, facts beneath. */
export function StripRecord({ p, n, onDark }: { p: ArchiveProject; n: number; onDark: boolean }) {
  const t = {
    title: onDark
      ? "text-white/90 transition-colors group-hover:text-white"
      : "text-foreground/90 transition-colors group-hover:text-foreground",
    meta: onDark ? "text-white/55" : "text-muted-foreground",
  };
  return (
    <article className="mx-auto max-w-[1680px] px-6 py-20 md:px-10 md:py-28 lg:px-12">
      <Link
        to="/projects/$slug"
        params={{ slug: p.slug }}
        className="group block"
        aria-label={`${p.title} — ${p.city}, ${p.state}`}
      >
        <Reveal>
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
            <h3
              className={`max-w-[24ch] font-display text-[7vw] font-normal leading-[1.04] tracking-[-0.02em] md:text-[44px] ${t.title}`}
            >
              {p.title.replace(" — HVAC & Fire", "").replace(" — HVAC", "")}
            </h3>
            <p className={`text-right font-tech text-[13px] ${t.meta}`}>
              {String(n).padStart(2, "0")} · {p.city}, {p.state}
            </p>
          </div>
        </Reveal>
        <ClipReveal edge="right" ratio="21 / 9">
          <PrintFrame
            p={p}
            ratio="21 / 9"
            tone={onDark ? "dark" : "light"}
            className="!aspect-auto h-full"
          />
        </ClipReveal>
      </Link>
      <Reveal delay={140}>
        <div className="mt-5 grid gap-4 md:grid-cols-12">
          <p className={`font-tech text-[13px] md:col-span-5 ${t.meta}`}>
            {p.scope_line}
            {p.client_display ? ` — ${p.client_display}` : ""}
          </p>
          <div className="md:col-span-4 md:text-right">
            <MediaCaption p={p} right={p.ref} onDark={onDark} className="md:justify-end" />
          </div>
        </div>
      </Reveal>
    </article>
  );
}

/** TYPE-ONLY — the typographic record: no image; the sheet carries itself. */
export function TypographicRecord({
  p,
  n,
  onDark,
}: {
  p: ArchiveProject;
  n: number;
  onDark: boolean;
}) {
  const t = {
    title: onDark
      ? "text-white/85 transition-colors group-hover:text-white"
      : "text-foreground/85 transition-colors group-hover:text-foreground",
    meta: onDark ? "text-white/50" : "text-muted-foreground",
  };
  return (
    <article className="mx-auto max-w-[1680px] px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <Link
        to="/projects/$slug"
        params={{ slug: p.slug }}
        className="group block border-y py-10 md:py-14"
        aria-label={`${p.title} — ${p.city}, ${p.state}`}
      >
        <Reveal>
          <div className="grid items-baseline gap-6 lg:grid-cols-12">
            <p
              className={`font-tech text-[11px] tracking-[0.08em] ${
                onDark ? "text-white/40" : "text-muted-foreground/60"
              } lg:col-span-1`}
            >
              {String(n).padStart(2, "0")}
            </p>
            <h3
              className={`font-display text-3xl font-normal leading-[1.06] tracking-[-0.02em] md:text-[40px] ${t.title} lg:col-span-7`}
            >
              {p.title.replace(" — HVAC & Fire", "").replace(" — HVAC", "")}
            </h3>
            <p className={`font-tech text-[13px] ${t.meta} lg:col-span-4 lg:text-right`}>
              {p.metrics[0]
                ? `${p.metrics[0].value}${p.metrics[0].unit ? ` ${p.metrics[0].unit}` : ""} · `
                : ""}
              {p.city}
              <span className="mt-2 block text-[11px] uppercase tracking-[0.18em] opacity-70 transition-transform duration-300 group-hover:translate-x-1">
                View record →
              </span>
            </p>
          </div>
        </Reveal>
      </Link>
    </article>
  );
}

/* ------------------------------------------------------------------
 * THE FIELD — the geography interlude, derived from the records shown.
 * Each city filters the archive on click.
 * ------------------------------------------------------------------ */
export function TheField({
  places,
  onPlace,
  onDark = false,
}: {
  /** Derived: [city, count] in descending count order. */
  places: { city: string; state: string; count: number }[];
  onPlace: (state: string) => void;
  onDark?: boolean;
}) {
  const tone = onDark
    ? {
        city: "text-white/80 hover:text-white",
        count: "text-white/35",
        head: "text-white/45",
        rule: "border-white/10",
      }
    : {
        city: "text-foreground/80 hover:text-foreground",
        count: "text-muted-foreground/60",
        head: "text-muted-foreground",
        rule: "border-border",
      };
  return (
    <section
      aria-label="The field — where the work stands"
      data-tone={onDark ? "dark" : "light"}
      className={`relative ${onDark ? "bg-[var(--ink)] text-white" : "paper bg-background"}`}
    >
      <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-32 lg:px-12">
        <Reveal>
          <div className="flex items-baseline gap-6">
            <p className={`eyebrow-sans ${tone.head}`}>The field</p>
            <span className={`h-px flex-1 border-t ${tone.rule}`} aria-hidden="true" />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p
            className={`mt-10 max-w-md text-sm leading-[1.8] ${
              onDark ? "text-white/60" : "text-muted-foreground"
            }`}
          >
            Where the delivered work stands — every city named on a completed record. Choose a place
            to filter the archive.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-5 md:gap-x-14">
            {places.map((pl) => (
              <li key={`${pl.city}-${pl.state}`}>
                <button
                  onClick={() => onPlace(pl.state)}
                  className="group text-left"
                  aria-label={`Filter the archive by ${pl.state}`}
                >
                  <span
                    className={`block font-display text-2xl font-normal leading-none tracking-[-0.01em] transition-colors md:text-[30px] ${tone.city}`}
                  >
                    {pl.city}
                  </span>
                  <span
                    className={`mt-2 block font-tech text-[10px] uppercase tracking-[0.2em] ${tone.count}`}
                  >
                    {pl.count} record{pl.count === 1 ? "" : "s"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * THE HANG — the deterministic rhythm of the completed archive.
 * Position 1 = feature; then rotating pairs, offsets, strips, type-only
 * moments; a geography interlude after the 6th record; a second feature
 * at 10; the remaining records settle into a calm alternation.
 * ------------------------------------------------------------------ */
export function CompletedField({
  projects,
  total,
  onPlace,
}: {
  projects: ArchiveProject[];
  total: number;
  onPlace: (state: string) => void;
}) {
  // geography derived from the visible (filtered) set
  const places = useMemo(() => {
    const byPlace = new Map<string, { city: string; state: string; count: number }>();
    for (const p of projects) {
      const key = `${p.city}|${p.state}`;
      const cur = byPlace.get(key);
      if (cur) cur.count += 1;
      else byPlace.set(key, { city: p.city, state: p.state, count: 1 });
    }
    return [...byPlace.values()].sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
  }, [projects]);

  // The hang plan: slots over archive positions.
  type Slot =
    | { kind: "feature"; i: number }
    | { kind: "twin"; i: number }
    | { kind: "offset"; i: number }
    | { kind: "strip"; i: number }
    | { kind: "typographic"; i: number }
    | { kind: "field" };
  const slots: Slot[] = [];
  const n = projects.length;
  let i = 0;
  let step = 0;
  if (n === 0) return null;
  slots.push({ kind: "feature", i: 0 });
  i = 1;
  while (i < n) {
    const remain = n - i;
    if (step === 4 && remain > 2) {
      slots.push({ kind: "field" });
      step += 1;
      continue;
    }
    if (step === 8 && remain > 1) {
      slots.push({ kind: "feature", i });
      i += 1;
      step += 1;
      continue;
    }
    // rotate: twin → offset → typographic → strip → twin …
    const kind: Slot["kind"] = (["twin", "offset", "typographic", "strip"] as const)[
      step % 4 === 0 ? 0 : step % 4
    ];
    if (kind === "twin") {
      if (remain >= 2) slots.push({ kind: "twin", i });
      else slots.push({ kind: "typographic", i });
      i += Math.min(2, remain);
    } else {
      slots.push({ kind, i });
      i += 1;
    }
    step += 1;
  }

  const rooms: ("ivory" | "stone" | "ink" | "earth")[] = [
    "stone",
    "ivory",
    "earth",
    "ivory",
    "ink",
    "ivory",
  ];
  let roomIdx = 0;
  const roomFor = (kind: string) => {
    // features/twins prefer light rooms; strips/typographic alternate;
    // the ink room appears rarely — a dark pause in the hang.
    const room = rooms[roomIdx % rooms.length];
    roomIdx += kind === "feature" || kind === "twin" ? 2 : 1;
    return room;
  };

  const onDarkFor = (room: string) => room === "ink" || room === "earth";

  return (
    <section aria-label="The completed record" data-tone="light" className="paper bg-background">
      {slots.map((slot, si) => {
        if (slot.kind === "field" && projects.length > 8) {
          return <TheField key="field" places={places} onPlace={onPlace} />;
        }
        const room = roomFor(slot.kind);
        const onDark = onDarkFor(room);
        const roomCls =
          room === "ink"
            ? "bg-[var(--ink)] text-white"
            : room === "earth"
              ? "bg-[var(--brand)] text-white"
              : room === "stone"
                ? "bg-[var(--surface)] text-foreground"
                : "bg-background text-foreground";
        // light rooms carry the paper grain; dark rooms carry their own ground
        const wrap = onDark ? roomCls : `paper ${roomCls}`;
        const num = (idx: number) => idx + 1;
        if (slot.kind === "feature") {
          const p = projects[slot.i]!;
          return (
            <div key={`s${si}`} data-tone={onDark ? "dark" : "light"} className={wrap}>
              <FeatureRecord p={p} n={num(slot.i)} total={total} onDark={onDark} eager={si === 0} />
            </div>
          );
        }
        if (slot.kind === "twin") {
          const pair = projects
            .slice(slot.i, slot.i + 2)
            .map((p, k) => ({ p, n: num(slot.i + k) }));
          return (
            <div key={`s${si}`} data-tone={onDark ? "dark" : "light"} className={wrap}>
              <TwinField pair={pair} base={num(slot.i)} total={total} onDark={onDark} />
            </div>
          );
        }
        if (slot.kind === "offset") {
          const p = projects[slot.i]!;
          return (
            <div key={`s${si}`} data-tone={onDark ? "dark" : "light"} className={wrap}>
              <OffsetRecord p={p} n={num(slot.i)} onDark={onDark} />
            </div>
          );
        }
        if (slot.kind === "strip") {
          const p = projects[slot.i]!;
          return (
            <div key={`s${si}`} data-tone={onDark ? "dark" : "light"} className={wrap}>
              <StripRecord p={p} n={num(slot.i)} onDark={onDark} />
            </div>
          );
        }
        if (slot.kind === "typographic") {
          const p = projects[slot.i]!;
          return (
            <div key={`s${si}`} data-tone={onDark ? "dark" : "light"} className={wrap}>
              <TypographicRecord p={p} n={num(slot.i)} onDark={onDark} />
            </div>
          );
        }
        return null; // "field" handled above
      })}
    </section>
  );
}

/* ------------------------------------------------------------------
 * THE CLOSE — completed ends into ongoing, not a CTA banner
 * ------------------------------------------------------------------ */
export function CompletedClose({ ongoingCount }: { ongoingCount: number }) {
  return (
    <section
      aria-label="The record continues"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--ink)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-36 lg:px-12">
        <Reveal>
          <p className="eyebrow-sans text-white/40">The record continues</p>
        </Reveal>
        <Reveal delay={140}>
          <h2 className="mt-10 max-w-[22ch] font-display text-[10vw] font-normal leading-[1.02] tracking-[-0.025em] md:text-[64px]">
            What Capex has built.
            <br />
            <span className="text-white/40">What Capex is building.</span>
          </h2>
        </Reveal>
        <Reveal delay={280}>
          <div className="mt-14 flex flex-wrap gap-x-14 gap-y-8">
            <Link
              to="/projects/ongoing"
              className="group flex items-baseline gap-4 border-b border-white/40 pb-3 transition-colors hover:border-white"
            >
              <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
                Ongoing
              </span>
              <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/50">
                {ongoingCount} projects
              </span>
              <span
                aria-hidden="true"
                className="text-xl transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
            <Link
              to="/contact"
              className="group flex items-baseline gap-4 border-b border-white/40 pb-3 transition-colors hover:border-white"
            >
              <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
                Start a conversation
              </span>
              <span
                aria-hidden="true"
                className="text-xl transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * THE ONGOING FIELD — a distinct rhythm: the live-programme register.
 * Where Completed is a hang of finished prints, Ongoing is ONE vertical
 * programme line: a deep-earth opening, then record rows sequenced along
 * a vertical rule — each row a station on the line: number, status mark,
 * record, plate. Strong verticals, more open whitespace, one moving mark.
 * ------------------------------------------------------------------ */
export function OngoingOpening({ total, onOpenIndex }: { total: number; onOpenIndex: () => void }) {
  return (
    <section
      aria-label="Ongoing projects — introduction"
      data-tone="dark"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[var(--brand)] text-white"
    >
      <div className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-6 pb-16 pt-36 md:px-10 md:pt-44 lg:px-12">
        <div>
          <Reveal delay={80}>
            <p className="eyebrow-sans text-white/45">Projects · State of work</p>
          </Reveal>
          <Reveal delay={160}>
            <h1 className="mt-8 font-display text-[16vw] font-normal leading-[0.94] tracking-[-0.025em] md:text-[104px] lg:text-[136px]">
              Ongoing<span className="text-white/40">.</span>
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-10 max-w-md text-sm leading-[1.8] text-white/70 md:text-[15px]">
              Work currently taking shape — the live programme,
              <br />
              stated as the company record states it.
            </p>
          </Reveal>
        </div>
        <div className="mt-auto pt-20">
          <Reveal delay={420}>
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3 border-t border-white/15 pt-6">
              <p className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/55">
                {total} live programme{total === 1 ? "" : "s"}
              </p>
              <p className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/35">
                Practice One — UG Utilities, Electrical &amp; CGD
              </p>
              <button
                onClick={onOpenIndex}
                className="group ml-auto flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-white"
              >
                <span className="border-b border-white/40 pb-1 transition-colors group-hover:border-white">
                  The register
                </span>
                <ProjectCtaArrow />
              </button>
            </div>
          </Reveal>
          <Reveal delay={520}>
            <p className="mt-8 max-w-[52ch] font-tech text-[10px] uppercase leading-[2] tracking-[0.16em] text-white/25">
              No completion dates or progress percentages are published — the record carries scope,
              client and place only
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** One station on the programme line. */
export function OngoingStation({
  p,
  n,
  eager = false,
  flip = false,
}: {
  p: ArchiveProject;
  n: number;
  eager?: boolean;
  flip?: boolean;
}) {
  const t = {
    title: "text-white/90 transition-colors duration-500 group-hover:text-white",
    meta: "text-white/55",
    scope: "text-white/60",
  };
  return (
    <article className="relative mx-auto max-w-[1680px] px-6 py-16 md:px-10 md:py-20 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        {/* the station column — number above the pulse, on the line */}
        <div className={`lg:col-span-1 ${flip ? "lg:order-2 lg:col-start-12" : ""}`}>
          <Reveal>
            <p className="font-display text-4xl font-normal leading-none tracking-[-0.02em] text-white/25 md:text-5xl">
              {String(n).padStart(2, "0")}
            </p>
          </Reveal>
        </div>
        <div className={`lg:col-span-5 ${flip ? "lg:order-3 lg:col-start-7" : ""}`}>
          <Reveal delay={100}>
            <Link
              to="/projects/$slug"
              params={{ slug: p.slug }}
              className="group block"
              aria-label={`${p.title} — ${p.city}, ${p.state}`}
            >
              <h2
                className={`max-w-[18ch] font-display text-[7vw] font-normal leading-[1.04] tracking-[-0.02em] md:text-[44px] ${t.title}`}
              >
                {p.title}
              </h2>
            </Link>
          </Reveal>
          <Reveal delay={200}>
            <p className={`mt-5 max-w-sm text-sm leading-[1.8] ${t.scope}`}>{p.scope_line}</p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-7">
              <RecordMeta p={p} onDark={true} />
            </div>
          </Reveal>
          <Reveal delay={400}>
            <Link
              to="/projects/$slug"
              params={{ slug: p.slug }}
              className="group mt-6 inline-flex items-center gap-3"
            >
              <ViewProjectAffordance onDark />
            </Link>
          </Reveal>
        </div>
        <div
          className={`relative z-10 lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8 lg:mr-[-theme(spacing.12)]"}`}
        >
          <Reveal delay={160}>
            <ClipReveal edge={flip ? "left" : "right"} ratio={flip ? "4 / 3" : "3 / 4"}>
              <PrintFrame
                p={p}
                ratio={flip ? "4 / 3" : "3 / 4"}
                eager={eager}
                tone="dark"
                className="!aspect-auto h-full"
              />
            </ClipReveal>
          </Reveal>
          <Reveal delay={280}>
            <MediaCaption p={p} right={p.ref} onDark className="lg:mr-12" />
          </Reveal>
        </div>
      </div>
    </article>
  );
}

/** The programme line — the ongoing archive's whole body. */
export function OngoingField({ projects }: { projects: ArchiveProject[] }) {
  return (
    <section
      aria-label="The live programme"
      data-tone="dark"
      className="relative bg-[var(--ink)] text-white"
    >
      {/* the programme rule — one vertical line the stations hang on */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-6 top-0 hidden w-px bg-white/10 md:left-10 lg:left-12 xl:block"
      />
      <div className="divide-y divide-white/10">
        {projects.map((p, i) => (
          <OngoingStation key={p.slug} p={p} n={i + 1} eager={i === 0} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

/** Ongoing's close — the state switch back, plus the register invitation. */
export function OngoingClose({ completedCount }: { completedCount: number }) {
  return (
    <section
      aria-label="Delivered work"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--brand)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-36 lg:px-12">
        <Reveal>
          <p className="eyebrow-sans text-white/40">Before this work</p>
        </Reveal>
        <Reveal delay={140}>
          <h2 className="mt-10 max-w-[24ch] font-display text-[9vw] font-normal leading-[1.03] tracking-[-0.025em] md:text-[56px]">
            Every programme here was once a record there.
          </h2>
        </Reveal>
        <Reveal delay={280}>
          <Link
            to="/projects/completed"
            className="group mt-14 inline-flex items-baseline gap-4 border-b border-white/40 pb-3 transition-colors hover:border-white"
          >
            <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
              Completed
            </span>
            <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/50">
              {completedCount} projects
            </span>
            <span
              aria-hidden="true"
              className="text-xl transition-transform duration-300 group-hover:translate-x-1.5"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
