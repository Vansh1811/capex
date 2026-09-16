import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { PlateArrowLink } from "@/components/site/sectors/SectorsExperience";
import type { AtlasSector, AtlasProjectLink } from "@/lib/site-data";

/**
 * THE SECTOR PLATE — the sector detail page: a contextual bridge between the
 * catalogue (Capabilities) and the archive (Projects), never a duplicate of
 * either. Structure: sector → hero plate → why this environment matters →
 * capabilities → related projects (editorial typography, real routes) →
 * onward. Only verified fields render — a sector with no linked records
 * says so plainly instead of faking depth.
 */

const num = (i: number) => String(i).padStart(2, "0");

const TIER_WORD: Record<AtlasSector["evidence_tier"], string> = {
  hub: "Evidence hub",
  service_led: "Service-led",
  list_only: "On the record",
};

/** Why-this-environment copy — composed ONLY from the sector's own verified
 *  standfirst + the places/practices its records carry. No invented claims. */
function environmentLine(sector: AtlasSector): string {
  const parts: string[] = [];
  if (sector.standfirst) parts.push(sector.standfirst);
  if (sector.places.length > 0) parts.push(`Documented reach: ${sector.places.join(" · ")}.`);
  else parts.push("Environment on the company record; linked records pending publication.");
  return parts.join(" ");
}

export function SectorPlateScenes({
  sector,
  links,
  services,
}: {
  sector: AtlasSector;
  links: AtlasProjectLink[];
  services: { name: string; slug: string }[];
}) {
  const hasRecords = links.length > 0;
  const practiceWord =
    sector.practices.includes(1) && sector.practices.includes(2)
      ? "Both practices"
      : sector.practices.includes(1)
        ? "Practice One — UG Utilities, Electrical & CGD"
        : sector.practices.includes(2)
          ? "Practice Two — MEP, HVAC & Fire Protection"
          : null;

  return (
    <>
      {/* ---------- 01 · the sector states itself ---------- */}
      <section
        aria-label={sector.name}
        data-tone="dark"
        className="relative flex min-h-[88svh] flex-col overflow-hidden bg-[var(--brand-deep)] text-white"
      >
        <div
          aria-hidden="true"
          className="survey-grid pointer-events-none absolute inset-0 opacity-40"
        />
        {/* the environment beneath the title — the plate sits low and wide,
            atmosphere ahead of information */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[46%]">
          <img
            src={sector.plate}
            alt=""
            loading="eager"
            className="h-full w-full object-cover [filter:saturate(0.7)_contrast(1.03)_brightness(0.8)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-deep)] via-[var(--brand-deep)]/40 to-[var(--brand-deep)]/85" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-6 pb-24 pt-32 md:px-10 md:pt-40 lg:px-12">
          <Reveal>
            <nav aria-label="Breadcrumb" className="flex items-baseline justify-between gap-6">
              <Link
                to="/sectors"
                className="eyebrow-sans text-white/45 transition-colors hover:text-white"
              >
                Sectors
              </Link>
              <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/40">
                {num(sector.n)} / 09 · {TIER_WORD[sector.evidence_tier]}
              </span>
            </nav>
          </Reveal>

          <div className="mt-auto pt-24">
            <Reveal delay={140}>
              <h1 className="max-w-[16ch] font-display text-[10.5vw] font-normal leading-[0.98] tracking-[-0.025em] md:text-[72px] lg:text-[104px]">
                {sector.name}
              </h1>
            </Reveal>
            <Reveal delay={280}>
              <p className="mt-8 max-w-lg text-sm leading-[1.8] text-white/70 md:text-[15px]">
                {sector.standfirst ??
                  "An environment on the company record — linked records pending publication."}
              </p>
            </Reveal>
            <Reveal delay={380}>
              <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-3">
                {hasRecords && (
                  <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/55">
                    {num(links.length)} linked records
                  </span>
                )}
                {practiceWord && (
                  <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/55">
                    {practiceWord}
                  </span>
                )}
                <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Source — {sector.source_ref}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- 02 · the plate — the environment at full size ---------- */}
      <section
        aria-label="Sector environment"
        data-tone="light"
        className="paper relative bg-background"
      >
        <div className="mx-auto max-w-[1680px] px-6 pb-24 pt-20 md:px-10 md:pb-32 md:pt-28 lg:px-12">
          <ClipReveal edge="left" ratio="21 / 10" delay={80} className="w-full">
            <img
              src={sector.plate}
              alt="Atmospheric reference imagery — not a documented Capex project"
              loading="lazy"
              className="h-full w-full object-cover [filter:saturate(0.82)]"
            />
          </ClipReveal>
          <Reveal delay={200}>
            <p className="mt-3 font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Reference imagery — not a documented Capex project
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- 03 · why this environment matters + capabilities ---------- */}
      <section
        aria-label="Why this environment matters"
        data-tone="light"
        className="paper relative bg-background"
      >
        <div className="mx-auto max-w-[1680px] px-6 pb-24 md:px-10 md:pb-32 lg:px-12">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="eyebrow-sans text-muted-foreground">The environment · 01</p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="mt-8 max-w-[16ch] font-display text-[9vw] font-normal leading-[1.02] tracking-[-0.02em] md:text-[52px]">
                  Why this environment matters<span className="text-foreground/30">.</span>
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-8 max-w-xl text-[15px] leading-[1.85] text-muted-foreground">
                  {environmentLine(sector)}
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <Reveal delay={160}>
                <p className="eyebrow-sans text-muted-foreground">Capabilities in this field</p>
              </Reveal>
              <ul className="mt-8 studio-list">
                {services.length > 0
                  ? services.slice(0, 6).map((s, i) => (
                      <li key={s.slug}>
                        <Reveal delay={Math.min(200 + i * 60, 420)}>
                          <Link
                            to="/services/$slug"
                            params={{ slug: s.slug }}
                            className="group flex items-baseline justify-between gap-6 border-b border-border py-5 transition-colors hover:border-foreground/40"
                          >
                            <span className="font-display text-xl font-normal leading-[1.15] tracking-[-0.01em] text-foreground/85 transition-colors group-hover:text-foreground md:text-[24px]">
                              {s.name}
                            </span>
                            <span className="text-foreground/40 transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </Link>
                        </Reveal>
                      </li>
                    ))
                  : null}
                {services.length === 0 && (
                  <li className="text-sm leading-relaxed text-muted-foreground">
                    Capability framing for this environment lives under the two practices —
                    underground utilities, electrical &amp; CGD; and MEP, HVAC &amp; fire
                    protection.
                  </li>
                )}
              </ul>
              <Reveal delay={420}>
                <PlateArrowLink to="/services" tone="light">
                  All capabilities
                </PlateArrowLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 04 · related projects — editorial typography ---------- */}
      {hasRecords ? (
        <section
          aria-label="Related projects"
          data-tone="dark"
          className="relative overflow-hidden bg-[var(--ink)] text-white"
        >
          <div className="mx-auto max-w-[1680px] px-6 pb-28 pt-24 md:px-10 md:pt-32 lg:px-12">
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-6">
                <div>
                  <p className="eyebrow-sans text-white/45">The record · 02</p>
                  <h2 className="mt-6 font-display text-[9vw] font-normal leading-[1.02] tracking-[-0.02em] md:text-[56px]">
                    Related projects<span className="text-white/40">.</span>
                  </h2>
                </div>
                <p className="max-w-xs pb-2 text-sm leading-relaxed text-white/60">
                  {num(links.length)} published record{links.length === 1 ? "" : "s"} carry this
                  sector on their sheet — every link opens the archive.
                </p>
              </div>
            </Reveal>

            <ol className="studio-list mt-16">
              {links.slice(0, 8).map((p, i) => (
                <li key={p.slug}>
                  <Reveal delay={Math.min(i * 60, 300)}>
                    <Link
                      to="/projects/$slug"
                      params={{ slug: p.slug }}
                      className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 border-b border-white/10 py-6 transition-colors hover:border-white/30 md:grid-cols-[4rem_1fr_auto_auto] md:gap-x-8"
                    >
                      <span className="font-tech text-[11px] tracking-[0.08em] text-white/35 transition-colors group-hover:text-white">
                        {num(i + 1)}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-lg font-normal leading-[1.12] tracking-[-0.01em] text-white/85 transition-colors group-hover:text-white md:text-[26px]">
                          {p.title}
                        </span>
                        <span className="mt-1 block text-xs text-white/50 md:text-sm">
                          {p.city} · {p.state}
                          {p.figure ? ` · ${p.figure}` : ""}
                        </span>
                      </span>
                      <span className="hidden font-tech text-[11px] uppercase tracking-[0.14em] text-white/40 md:block">
                        {p.practice === 1 ? "Practice 01" : "Practice 02"}
                      </span>
                      <span className="text-right font-tech text-[11px] text-white/60 transition-colors group-hover:text-white">
                        {p.ref}
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal delay={200}>
              <div className="mt-12">
                <PlateArrowLink to="/projects" tone="dark" className="!mt-0">
                  Explore all projects
                </PlateArrowLink>
              </div>
            </Reveal>
          </div>
        </section>
      ) : (
        <section
          aria-label="Records pending"
          data-tone="dark"
          className="relative overflow-hidden bg-[var(--ink)] text-white"
        >
          <div className="mx-auto max-w-[1680px] px-6 pb-28 pt-24 md:px-10 md:pt-32 lg:px-12">
            <Reveal>
              <p className="eyebrow-sans text-white/45">The record · 02</p>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="mt-8 max-w-[20ch] font-display text-[9vw] font-normal leading-[1.05] tracking-[-0.02em] text-white/85 md:text-[48px]">
                On the record — links pending publication.
              </h2>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-8 max-w-md text-sm leading-[1.8] text-white/60">
                This environment appears in the company's sectors-served record. No published
                project sheet carries it yet — when verification completes, its records will list
                here. Nothing is inferred.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div className="mt-12">
                <PlateArrowLink to="/projects" tone="dark" className="!mt-0">
                  The project archive
                </PlateArrowLink>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
