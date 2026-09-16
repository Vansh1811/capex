import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ReferenceNote } from "@/components/site/capabilities/CapabilitiesExperience";
import type { CapabilityService } from "@/lib/site-data";

/**
 * THE DISCIPLINE INDEX — the centerpiece: a large editorial typographic
 * register, not 11 cards. Each discipline reads as one dominant name set
 * over a hairline rule, with its mono ordinal, practice affiliation and a
 * quiet record note. The signature interaction lives beside it on desktop:
 * a large exhibition plate that holds the selected discipline's
 * atmosphere frame and verified detail — hover/focus on a row drives the
 * plate; on touch layouts the row expands and the plate arrives in-flow.
 * Keyboard focus triggers exactly the same visual behaviour as hover.
 */
export function DisciplineIndex({
  services,
  activeSlug,
  onActive,
}: {
  services: CapabilityService[];
  activeSlug: string | null;
  onActive: (slug: string | null) => void;
}) {
  const active = services.find((s) => s.slug === activeSlug) ?? null;

  return (
    <section
      aria-label="The discipline index"
      data-tone="light"
      className="paper relative bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 pb-28 pt-28 md:px-10 md:pt-36 lg:px-12 lg:pb-40">
        <Reveal>
          <div className="flex items-baseline gap-6">
            <p className="eyebrow-sans text-muted-foreground">The disciplines</p>
            <span aria-hidden="true" className="h-px flex-1 border-t border-border" />
            <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              {services.length} on the register
            </span>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* the index proper */}
          <div className="lg:col-span-7 xl:col-span-8">
            <ol aria-label="All Capex disciplines">
              {services.map((s, i) => (
                <li key={s.slug}>
                  <Reveal delay={Math.min(i * 26, 180)}>
                    <DisciplineRow s={s} active={activeSlug === s.slug} onActive={onActive} />
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          {/* the exhibition plate — desktop: pinned beside the index; touch:
              hidden here (the row renders it expanded in-flow) */}
          <div className="hidden lg:col-span-5 lg:block xl:col-span-4">
            <div className="sticky top-28">
              <DisciplinePlate service={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One typographic register row. On touch layouts the row itself expands. */
function DisciplineRow({
  s,
  active,
  onActive,
}: {
  s: CapabilityService;
  active: boolean;
  onActive: (slug: string | null) => void;
}) {
  const [touchOpen, setTouchOpen] = useState(false);
  const rowActive = active || touchOpen;

  return (
    <div>
      <Link
        to="/services/$slug"
        params={{ slug: s.slug }}
        aria-expanded={rowActive}
        onClick={(e) => {
          // On touch layouts the first tap opens the row; the link follows on
          // the second (or on the arrow). Desktop clicks pass straight through.
          if (window.matchMedia("(hover: none)").matches && !touchOpen) {
            e.preventDefault();
            setTouchOpen(true);
          }
        }}
        onMouseEnter={() => onActive(s.slug)}
        onFocus={() => onActive(s.slug)}
        onMouseLeave={() => onActive(null)}
        onBlur={() => onActive(null)}
        className="group block border-b border-border py-5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/50 md:py-6"
      >
        <span className="flex items-baseline gap-5 md:gap-8">
          <span
            className={`font-tech text-[11px] tracking-[0.08em] transition-colors duration-300 ${
              rowActive ? "text-foreground" : "text-muted-foreground/60"
            }`}
          >
            {String(s.n).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={`block font-display text-[24px] font-normal leading-[1.06] tracking-[-0.02em] transition-all duration-500 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 sm:text-[30px] md:text-[38px] lg:text-[42px] xl:text-[48px] ${
                rowActive ? "text-foreground" : "text-foreground/85 group-hover:text-foreground"
              }`}
            >
              {s.name}
            </span>
            <span className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="eyebrow-sans text-muted-foreground/80">
                {s.practice === 1 ? "Below the street · P.01" : "Within the building · P.02"}
              </span>
              {s.projects.length > 0 ? (
                <span className="font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
                  {s.projects.length === 1
                    ? "1 published record"
                    : `${s.projects.length} published records`}
                </span>
              ) : (
                <span className="font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/40">
                  On the register
                </span>
              )}
              {s.tagline && (
                <span className="hidden text-xs text-muted-foreground/60 xl:inline">
                  {s.tagline}
                </span>
              )}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`hidden shrink-0 font-tech text-sm transition-all duration-300 md:block ${
              rowActive
                ? "translate-x-0 text-foreground/60 opacity-100"
                : "-translate-x-1 opacity-0"
            }`}
          >
            →
          </span>
        </span>
      </Link>

      {/* the touch expansion — the plate + scope, in-flow, under the name */}
      <div className="lg:hidden">
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            rowActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="pt-4">
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface)]">
                <img
                  key={s.slug}
                  src={s.plate}
                  alt={s.plateAlt}
                  loading="lazy"
                  decoding="async"
                  className={`plate-img absolute inset-0 h-full w-full object-cover ${s.platePosition} [filter:saturate(0.85)_contrast(1.0)]`}
                />
                <span className="absolute bottom-3 left-3 font-tech text-[10px] uppercase tracking-[0.18em] text-white/90 mix-blend-difference">
                  {String(s.n).padStart(2, "0")} — {s.practice === 1 ? "P.01" : "P.02"}
                </span>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-[1.8] text-muted-foreground">
                {s.standfirst}
              </p>
              {s.projects.length > 0 && (
                <p className="mt-3 font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                  {s.projects[0].ref} · {s.projects[0].title} —{" "}
                  {s.projects[0].figure ? `${s.projects[0].figure} · ` : ""}
                  {s.projects[0].city}
                </p>
              )}
              <ReferenceNote className="mt-3">{s.plateAlt}</ReferenceNote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * THE EXHIBITION PLATE — the signature element: a large editorial plate the
 * selected discipline's imagery enters like an image being placed into the
 * exhibition (clip/opacity/translate/scale via the plate-img placement
 * language, crop art-directed per discipline). When nothing is selected the
 * plate holds the register's open state — an instruction, not an empty box.
 */
function DisciplinePlate({ service }: { service: CapabilityService | null }) {
  const ref = useRef<HTMLDivElement>(null);

  if (!service) {
    return (
      <div className="flex min-h-[460px] flex-col justify-between border border-border/70 p-6">
        <p className="eyebrow-sans text-muted-foreground/60">Discipline plate</p>
        <p className="max-w-[26ch] font-display text-xl font-normal leading-[1.3] text-foreground/60">
          Move through the register — each discipline&rsquo;s atmosphere enters the plate here.
        </p>
        <ReferenceNote>
          Reference imagery throughout — never a documented Capex project
        </ReferenceNote>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex flex-col">
      {/* the plate image — the discipline's atmosphere, art-directed crop */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface)] lg:aspect-[4/5]">
        <img
          key={service.slug}
          src={service.plate}
          alt={service.plateAlt}
          loading="lazy"
          decoding="async"
          className={`plate-img absolute inset-0 h-full w-full object-cover ${service.platePosition} [filter:saturate(0.85)_contrast(1.0)]`}
        />
        <span className="absolute bottom-4 left-4 font-tech text-[10px] uppercase tracking-[0.18em] text-white/90 mix-blend-difference">
          {String(service.n).padStart(2, "0")} / {String(11).padStart(2, "0")}
        </span>
      </div>

      {/* the plate's information field */}
      <div className="mt-5">
        <p className="font-display text-xl font-normal leading-[1.12] tracking-[-0.015em] md:text-2xl">
          {service.name}
        </p>
        <p className="mt-1.5 eyebrow-sans text-muted-foreground">
          {service.tagline ?? `Discipline ${String(service.n).padStart(2, "0")}`} ·{" "}
          {service.practice === 1 ? "Below the street" : "Within the building"}
        </p>
        <p className="mt-4 text-sm leading-[1.75] text-muted-foreground">{service.standfirst}</p>

        {service.projects.length > 0 ? (
          <div className="mt-6">
            <p className="eyebrow-sans text-muted-foreground/70">Documented under</p>
            <ul className="mt-3">
              {service.projects.slice(0, 3).map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/projects/$slug"
                    params={{ slug: p.slug }}
                    className="group flex items-baseline justify-between gap-6 border-b border-border py-3 transition-colors hover:border-foreground/40"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium leading-snug text-foreground/85 transition-colors group-hover:text-foreground">
                        {p.title}
                      </span>
                      <span className="mt-0.5 block font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                        {p.ref} · {p.city}
                        {p.figure ? ` — ${p.figure}` : ""}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-tech text-xs text-foreground/50 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-6 border-t border-border pt-4 font-tech text-[10px] uppercase leading-[1.8] tracking-[0.14em] text-muted-foreground/60">
            On the verified register — linked project records pending publication
          </p>
        )}
      </div>
    </div>
  );
}
