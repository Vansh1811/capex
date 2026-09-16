import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { PlateArrowLink } from "@/components/site/sectors/SectorsExperience";
import type { AtlasSector, AtlasProjectLink, SectorAtlas } from "@/lib/site-data";

/**
 * THE FIELD — the Sectors atlas.
 *
 * Projects is an exhibition; About is a portrait; Capabilities is a catalogue.
 * Sectors is a FIELD GUIDE: where Capex's engineering operates. The dominant
 * movement is IMAGE → TYPE → IMAGE → TYPE — plates interrupt and interrupt
 * again — so the page reads as a map of environments, never as cards, stripes
 * or a database. Every word and count is verified; plates are reference
 * imagery and say so.
 *
 * Scenes: 01 the opening (deep earth, the statement, the archive line, the
 * first plate) → 02 THE INDEX — the large typographic atlas with its
 * floating plate field → 03-04 TWO WORLDS (below the street / within the
 * building, split by a threshold) → 05 the closing field (EVERY PLACE HAS A
 * SYSTEM. + two onward routes).
 */

/* ============================================================
 * 01 · THE OPENING
 * ============================================================ */

const num = (i: number) => String(i).padStart(2, "0");

export function AtlasOpening({ atlas }: { atlas: SectorAtlas }) {
  const sectors = atlas.sectors;
  const hubs = sectors.filter((s) => s.evidence_tier === "hub").length;
  const linked = sectors.filter((s) => s.projectCount > 0);
  const linkedTotal = linked.reduce((a, s) => a + s.projectCount, 0);

  return (
    <section
      aria-label="Sectors — where systems meet place"
      data-tone="dark"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      {/* a faint engineered grain — the survey field of the atlas */}
      <div
        aria-hidden="true"
        className="survey-grid pointer-events-none absolute inset-0 opacity-40"
      />
      {/* the first plate — enters from the right, low, at xl: the atlas'
          atmosphere ahead of the words; never a banner, never full-bleed */}
      <div aria-hidden="true" className="absolute bottom-0 right-0 hidden h-[58%] w-[42%] xl:block">
        <ClipReveal edge="right" delay={620} className="absolute bottom-0 right-0 h-full w-full">
          <img
            src="/uploads/sectors/atlas-opening.jpg"
            alt=""
            loading="eager"
            className="h-full w-full object-cover [filter:saturate(0.72)_contrast(1.04)_brightness(0.86)]"
          />
        </ClipReveal>
        <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[var(--brand-deep)] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--brand-deep)] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-6 pb-16 pt-32 md:px-10 md:pt-40 lg:px-12">
        <Reveal delay={80}>
          <p className="eyebrow-sans text-white/45">Sectors</p>
        </Reveal>

        <Reveal delay={200}>
          <h1 className="mt-10 font-display text-[13vw] font-normal leading-[0.96] tracking-[-0.025em] md:text-[88px] lg:text-[124px]">
            Where systems
            <br />
            <span className="text-white/55">meet place.</span>
          </h1>
        </Reveal>

        <Reveal delay={320}>
          <p className="mt-10 max-w-md text-sm leading-[1.8] text-white/65 md:text-[15px]">
            Capex builds the systems beneath infrastructure and within buildings — turnkey
            engineering, pan-India, since 2012. This is the atlas of the environments that work runs
            through.
          </p>
        </Reveal>

        {/* the lower field — verified archive metadata, no KPI wall */}
        <div className="mt-auto pb-14 pt-24 md:pb-20">
          <Reveal delay={440}>
            <ul className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
              <li>
                <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/55">
                  {num(sectors.length)} environments
                </span>
              </li>
              <li className="flex items-baseline before:mr-10 before:inline-block before:h-px before:w-8 before:bg-white/25 before:align-middle">
                <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/55">
                  {num(hubs)} evidence hubs
                </span>
              </li>
              <li className="flex items-baseline before:mr-10 before:inline-block before:h-px before:w-8 before:bg-white/25 before:align-middle">
                <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/55">
                  {num(linkedTotal)} linked records
                </span>
              </li>
              <li className="ml-auto hidden xl:block">
                <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/55">
                  Source — company records
                </span>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={560}>
            <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-white/30">
              Corpus transcribed from company records — publication states per the verification
              matrix
            </p>
          </Reveal>
        </div>
      </div>

      {/* the plate, in-flow below the words at sub-xl — at xl+ the absolute
          plate (above) owns the image, so this copy is hidden to avoid
          rendering the same frame twice */}
      <div className="relative z-10 -mt-2 px-6 pb-16 md:px-10 xl:hidden lg:px-12">
        <ClipReveal edge="right" ratio="16 / 9" delay={620} className="w-full">
          <img
            src="/uploads/sectors/atlas-opening.jpg"
            alt="City on a river at dusk — atmospheric reference imagery, not a documented Capex project"
            loading="eager"
            className="h-full w-full object-cover [filter:saturate(0.72)_contrast(1.04)_brightness(0.92)]"
          />
        </ClipReveal>
        <Reveal delay={760}>
          <p className="mt-3 font-tech text-[10px] uppercase tracking-[0.2em] text-white/30">
            Reference imagery — not a documented Capex project
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
 * 02 · THE INDEX — the large typographic sector list with its
 *       floating plate field. No cards. No grid of blocks.
 * ============================================================ */

/** Per-sector preview geometry: the plate field re-weights itself so the
 *  atlas never reads as nine identical rows. Deterministic by position. */
const PREVIEW_GEO: {
  ratio: string;
  /** object-position of the plate image inside its frame */
  crop: string;
  /** row's typographic alignment */
  align: "left" | "right";
  /** vertical offset of the row's number column */
  shift: string;
}[] = [
  { ratio: "4 / 5", crop: "object-[50%_50%]", align: "left", shift: "md:mt-0" },
  { ratio: "1 / 1", crop: "object-[50%_38%]", align: "right", shift: "md:mt-6" },
  { ratio: "3 / 4", crop: "object-[46%_55%]", align: "left", shift: "md:mt-0" },
  { ratio: "4 / 5", crop: "object-[54%_46%]", align: "right", shift: "md:mt-10" },
  { ratio: "1 / 1", crop: "object-[50%_60%]", align: "left", shift: "md:mt-4" },
  { ratio: "3 / 4", crop: "object-[48%_42%]", align: "right", shift: "md:mt-0" },
  { ratio: "4 / 5", crop: "object-[52%_52%]", align: "left", shift: "md:mt-8" },
  { ratio: "1 / 1", crop: "object-[50%_46%]", align: "right", shift: "md:mt-0" },
  { ratio: "3 / 4", crop: "object-[46%_58%]", align: "left", shift: "md:mt-6" },
];

const TIER_WORD: Record<AtlasSector["evidence_tier"], string> = {
  hub: "Evidence hub",
  service_led: "Service-led",
  list_only: "On the record",
};

export function AtlasIndex({ atlas }: { atlas: SectorAtlas }) {
  const sectors = atlas.sectors;
  const [active, setActive] = useState(0);
  // track hover capability: hover interactions only on true-hover devices
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);
  const current = canHover ? active : -1;
  const activeGeo = PREVIEW_GEO[(current >= 0 ? current : 0) % PREVIEW_GEO.length];

  const linksFor = (slug: string): AtlasProjectLink[] => atlas.linksBySector[slug] ?? [];

  return (
    <section
      aria-label="The sector atlas"
      data-tone="light"
      className="paper relative bg-background"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-36 lg:px-12 lg:py-44">
        {/* the field's header */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow-sans text-muted-foreground">The field · 01</p>
              <h2 className="mt-6 font-display text-[11vw] font-normal leading-[0.98] tracking-[-0.025em] md:text-[72px] lg:text-[96px]">
                The atlas<span className="text-foreground/30">.</span>
              </h2>
            </div>
            <p className="max-w-xs pb-2 text-sm leading-relaxed text-muted-foreground">
              Nine environments from the company record.{" "}
              {canHover
                ? "Move through the index — the plates answer."
                : "Tap an environment to see its plate."}
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          {/* ---------- the typographic index ---------- */}
          <ol
            aria-label="Sector index"
            className="studio-list lg:col-span-7 xl:col-span-7"
            onMouseLeave={() => setActive(0)}
          >
            {sectors.map((s, i) => {
              const geo = PREVIEW_GEO[i % PREVIEW_GEO.length];
              const links = linksFor(s.slug);
              const isActive = i === current;
              return (
                <li key={s.slug} className={geo.shift}>
                  <Reveal delay={Math.min(i * 60, 300)}>
                    <Link
                      to="/sectors/$slug"
                      params={{ slug: s.slug }}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      aria-label={`${s.name} — ${TIER_WORD[s.evidence_tier]}${links.length > 0 ? `, ${links.length} linked records` : ""}`}
                      className="group block border-b border-border py-8 transition-colors hover:border-foreground/40 md:py-10"
                    >
                      <div
                        className={`flex items-baseline gap-5 md:gap-8 ${
                          geo.align === "right" ? "md:flex-row-reverse md:text-right" : ""
                        }`}
                      >
                        {/* the atlas number — always visible, always mono */}
                        <span
                          className={`shrink-0 font-tech text-[13px] tracking-[0.12em] transition-colors duration-300 md:text-[15px] ${
                            isActive
                              ? "text-[var(--accent)]"
                              : "text-foreground/40 group-hover:text-foreground"
                          }`}
                        >
                          {num(s.n)}
                        </span>
                        {/* the environment's name — visually dominant */}
                        <span
                          className={`min-w-0 flex-1 font-display text-[7.2vw] font-normal leading-[1.02] tracking-[-0.02em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-[34px] md:text-[44px] lg:text-[52px] ${
                            isActive
                              ? "translate-x-0 text-foreground"
                              : "text-foreground/80 group-hover:translate-x-1 group-hover:text-foreground"
                          } ${geo.align === "right" ? "md:group-hover:-translate-x-1" : ""}`}
                        >
                          {s.name}
                        </span>
                        {/* the verified count / tier mark */}
                        <span
                          className={`hidden shrink-0 font-tech text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 sm:block ${
                            isActive ? "text-foreground" : "text-muted-foreground/70"
                          }`}
                        >
                          {links.length > 0
                            ? `${num(links.length)} records`
                            : TIER_WORD[s.evidence_tier]}
                        </span>
                      </div>
                      {/* the environment's standfirst — quiet, under the name */}
                      {s.standfirst && (
                        <p
                          className={`mt-3 max-w-xl text-[13px] leading-[1.7] text-muted-foreground transition-opacity duration-500 md:text-sm ${
                            geo.align === "right" ? "md:ml-auto md:text-right" : ""
                          } ${isActive ? "opacity-100" : "opacity-80"}`}
                        >
                          {s.standfirst}
                        </p>
                      )}
                      {/* the plate, in-flow on touch/small screens — a deliberate
                          tap-index: the number stays, the image stays prominent */}
                      <div className="mt-6 lg:hidden">
                        <div
                          className="relative overflow-hidden bg-[var(--surface)]"
                          style={{ aspectRatio: "16 / 10" }}
                        >
                          <img
                            src={s.plate}
                            alt="Atmospheric reference imagery — not a documented Capex project"
                            loading="lazy"
                            className={`h-full w-full object-cover ${geo.crop} [filter:saturate(0.82)]`}
                          />
                        </div>
                        <div className="mt-3 flex items-baseline justify-between gap-4">
                          <span className="font-tech text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                            {links.length > 0
                              ? `${num(links.length)} linked records`
                              : TIER_WORD[s.evidence_tier]}
                          </span>
                          <span className="inline-flex items-center gap-2 font-tech text-[11px] uppercase tracking-[0.2em] text-foreground">
                            View sector
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ol>

          {/* ---------- the plate field — the atlas' visual answer.
              One sticky frame with ALL plates absolutely stacked inside it;
              plates crossfade + crop-shift between sectors; the frame itself
              re-weights per position (aspect, anchor, weight) so it never
              reads as a widget or a tooltip. */}
          <div className="hidden lg:col-span-5 lg:block" aria-hidden="true">
            <div className="sticky top-28">
              {/* the frame — its aspect follows the active sector's geometry */}
              <div
                className="relative overflow-hidden bg-[var(--surface)] transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  aspectRatio: activeGeo.ratio,
                  width: activeGeo.align === "right" ? "86%" : "94%",
                  marginLeft: activeGeo.align === "right" ? "14%" : "auto",
                  marginRight: activeGeo.align === "right" ? "auto" : "6%",
                }}
              >
                {sectors.map((s, i) => {
                  const geo = PREVIEW_GEO[i % PREVIEW_GEO.length];
                  const isActive = i === current;
                  return (
                    <img
                      key={s.slug}
                      src={s.plate}
                      alt=""
                      loading="lazy"
                      className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${geo.crop} ${
                        isActive
                          ? "scale-[1.03] opacity-100 [filter:saturate(0.9)]"
                          : "scale-100 opacity-0 [filter:saturate(0.7)_brightness(0.96)]"
                      }`}
                    />
                  );
                })}
                {/* the frame's atlas mark — the active environment's number,
                    printed into the plate like the archive's ghost numerals */}
                <span className="pointer-events-none absolute bottom-3 left-4 z-10 select-none font-display text-[64px] font-normal leading-none tracking-[-0.04em] text-white/[0.55] mix-blend-difference">
                  {num(sectors[current >= 0 ? current : 0]?.n ?? 1)}
                </span>
              </div>
              {/* the plate's typographic companion — concise, verified */}
              <div className="mt-6 grid gap-3">
                {sectors.map((s, i) => {
                  const links = linksFor(s.slug);
                  const services = s.services.slice(0, 3).map((x) => x.name);
                  const isActive = i === current;
                  if (!isActive) return null;
                  return (
                    <div key={s.slug} className="animate-fade-up">
                      <p className="font-tech text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {num(s.n)} · {TIER_WORD[s.evidence_tier]}
                      </p>
                      <p className="mt-2 font-display text-[26px] font-normal leading-[1.1] tracking-[-0.015em]">
                        {s.name}
                      </p>
                      {services.length > 0 && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {services.join(" · ")}
                        </p>
                      )}
                      <p className="mt-2 font-tech text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {links.length > 0
                          ? `${num(links.length)} linked records`
                          : s.places.length > 0
                            ? s.places.join(" · ")
                            : TIER_WORD[s.evidence_tier]}
                      </p>
                      <p className="mt-4 inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-foreground">
                        <span className="border-b border-border pb-1">View sector</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                Reference imagery — not a documented Capex project
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * 03 · TWO WORLDS — below the street / within the building,
 *       split by a threshold. New spatial composition: a single
 *       dark field crossed by one light band — the ground line —
 *       with the two worlds hanging either side of it.
 * ============================================================ */

export function TwoWorldsAtlas() {
  return (
    <section
      aria-label="Two worlds — below the street and within the building"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--ink)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 pb-28 pt-24 md:px-10 md:pb-36 md:pt-32 lg:px-12 lg:pb-44">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <p className="eyebrow-sans text-white/45">The field · 02 — two worlds, one system</p>
            <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-white/30">
              Every sector sits on one side of the threshold or the other
            </p>
          </div>
        </Reveal>

        {/* ---------- BELOW THE STREET ---------- */}
        <div className="relative mt-14 grid gap-10 md:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:flex lg:flex-col lg:justify-end">
            <Reveal>
              <p className="font-tech text-[11px] uppercase tracking-[0.22em] text-white/40">
                World 01 · Underground
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="mt-6 font-display text-[12vw] font-normal leading-[0.98] tracking-[-0.025em] md:text-[64px] lg:text-[84px]">
                Below
                <br />
                <span className="text-white/50">the street</span>
              </h3>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-8 max-w-sm text-sm leading-[1.8] text-white/65">
                The sectors that live under the surface: smart-city grids, metro connectivity, city
                gas distribution. Capex lays the HT/LT cable, MDPE and steel mains, and the
                trenchless crossings that never open the road above.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                {[
                  { label: "UG HT/LT Cable Laying", slug: "ug-ht-lt-cable-laying" },
                  { label: "City Gas Distribution", slug: "city-gas-distribution-cgd" },
                  { label: "Substation & Electrical Works", slug: "substation-construction" },
                ].map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group inline-flex items-baseline gap-2 border-b border-white/25 pb-1 font-tech text-[11px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-white hover:text-white"
                  >
                    {s.label}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <ClipReveal edge="left" ratio="4 / 3" delay={120}>
              <img
                src="/uploads/sectors/world-below.jpg"
                alt="City gas installation — atmospheric reference imagery, not a documented Capex project"
                loading="lazy"
                className="h-full w-full object-cover [filter:saturate(0.75)_contrast(1.03)_brightness(0.95)]"
              />
            </ClipReveal>
            <Reveal delay={260}>
              <p className="mt-3 font-tech text-[10px] uppercase tracking-[0.2em] text-white/30">
                Reference imagery — not a documented Capex project
              </p>
            </Reveal>
          </div>
        </div>

        {/* ---------- THE THRESHOLD — the ground line ---------- */}
        <div className="relative my-20 md:my-28" aria-hidden="true">
          <Reveal>
            <div className="flex items-center gap-6">
              <span className="h-px flex-1 bg-white/25" />
              <span className="font-tech text-[10px] uppercase tracking-[0.3em] text-white/40">
                Ground level
              </span>
              <span className="h-px flex-1 bg-white/25" />
            </div>
          </Reveal>
        </div>

        {/* ---------- WITHIN THE BUILDING ---------- */}
        <div className="relative grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ClipReveal edge="right" ratio="4 / 3" delay={120}>
              <img
                src="/uploads/sectors/world-within.jpg"
                alt="Building interior atrium — atmospheric reference imagery, not a documented Capex project"
                loading="lazy"
                className="h-full w-full object-cover [filter:saturate(0.8)_brightness(0.97)]"
              />
            </ClipReveal>
            <Reveal delay={260}>
              <p className="mt-3 font-tech text-[10px] uppercase tracking-[0.2em] text-white/30">
                Reference imagery — not a documented Capex project
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5 lg:flex lg:flex-col lg:justify-end">
            <Reveal>
              <p className="font-tech text-[11px] uppercase tracking-[0.22em] text-white/40">
                World 02 · Interior
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="mt-6 font-display text-[12vw] font-normal leading-[0.98] tracking-[-0.025em] md:text-[64px] lg:text-[84px]">
                Within
                <br />
                <span className="text-white/50">the building</span>
              </h3>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-8 max-w-sm text-sm leading-[1.8] text-white/65">
                The sectors that live inside the envelope: offices, industry, hospitals,
                hospitality, campuses, homes. Air through the plant, water at pressure where a fire
                starts — MEP, HVAC and fire protection as one accountable scope.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                {[
                  { label: "HVAC Systems", slug: "hvac-systems" },
                  { label: "Fire Fighting & Hydrant Systems", slug: "fire-fighting-hydrant" },
                  { label: "MEP Services", slug: "mep-services" },
                ].map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group inline-flex items-baseline gap-2 border-b border-white/25 pb-1 font-tech text-[11px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-white hover:text-white"
                  >
                    {s.label}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * 04 · THE CLOSING FIELD
 * ============================================================ */

export function AtlasClosing() {
  return (
    <section
      aria-label="Every place has a system"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      <div
        aria-hidden="true"
        className="survey-grid pointer-events-none absolute inset-0 opacity-30"
      />
      <div className="relative mx-auto max-w-[1680px] px-6 pb-32 pt-28 md:px-10 md:pt-40 lg:px-12 lg:pb-44 lg:pt-52">
        <Reveal>
          <p className="eyebrow-sans text-white/45">The field · 03</p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-10 max-w-[18ch] font-display text-[11vw] font-normal leading-[1.0] tracking-[-0.025em] md:text-[80px] lg:text-[110px]">
            Every place
            <br />
            <span className="text-white/55">has a system.</span>
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-10 max-w-md text-sm leading-[1.8] text-white/65 md:text-[15px]">
            The environments change; the engineering discipline does not. Follow it into the
            catalogue, or into the archive.
          </p>
        </Reveal>
        <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-baseline sm:gap-16">
          <Reveal delay={320}>
            <PlateArrowLink to="/services" tone="dark">
              Explore capabilities
            </PlateArrowLink>
          </Reveal>
          <Reveal delay={400}>
            <PlateArrowLink to="/projects" tone="dark">
              Explore projects
            </PlateArrowLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
