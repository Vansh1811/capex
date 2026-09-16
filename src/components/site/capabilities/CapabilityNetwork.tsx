import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import type { CapabilityService } from "@/lib/site-data";

/**
 * THE CAPABILITY NETWORK — the section that connects the service layer to
 * the rest of the site: CAPABILITY → SECTOR → PROJECT. Selecting a
 * discipline from the control line reveals where it is documented — the
 * sectors its records carry, and the project case studies naming it. Only
 * document-backed relationships render; a discipline without published
 * records states that plainly rather than faking depth. Editorial
 * typography on a warm stone ground — never a graph, never a dashboard.
 *
 * The control list is the four disciplines that carry published records
 * (computed from the data); the others are listed below it as the honest
 * register note so no capability disappears from the section.
 */
export function CapabilityNetwork({ services }: { services: CapabilityService[] }) {
  const documented = services.filter((s) => s.projects.length > 0);
  const [slug, setSlug] = useState<string | null>(documented[0]?.slug ?? null);
  const active = services.find((s) => s.slug === slug) ?? documented[0] ?? null;

  return (
    <section
      aria-label="The capability network"
      data-tone="light"
      className="relative bg-[var(--surface)] text-foreground"
      style={{
        // warm stone ground — a distinct room between the ivory index and
        // the dark engineering line, felt as a change not a colored box.
        // Softer entry: the room opens from the ivory above instead of
        // hard-cutting between backgrounds.
        backgroundImage:
          "linear-gradient(180deg, var(--background) 0%, oklch(0.915 0.032 72) 18%, oklch(0.9 0.034 70) 100%)",
      }}
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-44">
        <Reveal>
          <div className="flex items-baseline gap-6">
            <p className="eyebrow-sans text-muted-foreground">The capability network</p>
            <span aria-hidden="true" className="h-px flex-1 border-t border-border" />
            <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              Documented relationships only
            </span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-12 max-w-[14ch] font-display text-[11vw] font-normal leading-[1.04] tracking-[-0.025em] text-foreground sm:text-[8vw] lg:text-[min(5.4vw,92px)]">
            A capability is never isolated.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-md text-sm leading-[1.8] text-muted-foreground md:text-[15px]">
            Every discipline in the register connects to the sectors and projects where it is
            documented — the same records the Projects archive carries. Choose a discipline; the
            network answers from the published archive, never from inference.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* the control line — the documented disciplines */}
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow-sans text-muted-foreground/70">Start from a capability</p>
              <ul className="mt-4" role="tablist" aria-label="Disciplines with published records">
                {documented.map((s) => {
                  const selected = active?.slug === s.slug;
                  return (
                    <li key={s.slug} role="presentation">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setSlug(s.slug)}
                        onFocus={() => setSlug(s.slug)}
                        onMouseEnter={() => setSlug(s.slug)}
                        className={`group flex w-full items-baseline gap-4 border-b border-border py-4 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/50 ${
                          selected
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="font-tech text-[11px] tracking-[0.08em] text-muted-foreground/60">
                          {String(s.n).padStart(2, "0")}
                        </span>
                        <span className="flex-1 text-[15px] font-normal leading-snug md:text-base">
                          {s.name}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`font-tech text-xs transition-all duration-300 ${
                            selected ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                          }`}
                        >
                          →
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>

          {/* the network answer — sector → project, editorial */}
          <div className="lg:col-span-8 lg:pl-8">
            {active ? (
              <div key={active.slug} className="animate-reveal">
                {/* capability */}
                <div className="flex items-baseline gap-6">
                  <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                    Capability
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 border-t border-border" />
                </div>
                <p className="mt-3 font-display text-3xl font-normal leading-[1.06] tracking-[-0.02em] md:text-4xl lg:text-[44px]">
                  {active.name}
                </p>
                <p className="mt-3 max-w-xl text-sm leading-[1.8] text-muted-foreground">
                  {active.standfirst}
                </p>

                {/* sectors */}
                {active.sectors.length > 0 && (
                  <>
                    <div className="mt-10 flex items-baseline gap-6">
                      <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                        Where it exists — sectors
                      </span>
                      <span aria-hidden="true" className="h-px flex-1 border-t border-border" />
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                      {active.sectors.map((sec) => (
                        <li key={sec.slug}>
                          <Link
                            to="/sectors/$slug"
                            params={{ slug: sec.slug }}
                            className="group inline-flex items-baseline gap-2 border-b border-border pb-0.5 font-display text-xl font-normal tracking-[-0.015em] transition-colors hover:border-foreground md:text-2xl"
                          >
                            {sec.name}
                            <span
                              aria-hidden="true"
                              className="font-tech text-[10px] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                            >
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* projects */}
                {active.projects.length > 0 && (
                  <>
                    <div className="mt-10 flex items-baseline gap-6">
                      <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                        Where it is documented — projects
                      </span>
                      <span aria-hidden="true" className="h-px flex-1 border-t border-border" />
                    </div>
                    <ul className="mt-2">
                      {active.projects.slice(0, 4).map((p) => (
                        <li key={p.slug}>
                          <Link
                            to="/projects/$slug"
                            params={{ slug: p.slug }}
                            className="group grid grid-cols-12 items-baseline gap-3 border-b border-border py-4 transition-colors hover:border-foreground/40"
                          >
                            <span className="col-span-2 font-tech text-[11px] text-muted-foreground/70 md:col-span-1">
                              {p.ref}
                            </span>
                            <span className="col-span-10 font-display text-lg font-normal leading-snug tracking-[-0.015em] text-foreground/85 transition-colors group-hover:text-foreground md:col-span-6 md:text-xl">
                              {p.title}
                            </span>
                            <span className="col-span-6 font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70 md:col-span-3">
                              {p.city}, {p.state}
                            </span>
                            <span className="col-span-6 text-right font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground md:col-span-2">
                              {p.figure ?? ""}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* the honest floor */}
                {active.sectors.length === 0 && active.projects.length === 0 && (
                  <p className="mt-10 border-t border-border pt-6 font-tech text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-muted-foreground/60">
                    This discipline sits on the verified register; its linked sector and project
                    records are pending publication.
                  </p>
                )}
              </div>
            ) : (
              <p className="font-tech text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-muted-foreground/60">
                No published relationships yet — the network renders only what the archive
                documents.
              </p>
            )}

            <Reveal delay={140}>
              <p className="mt-10 max-w-xl font-tech text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-muted-foreground/50">
                Also on the register — {services.filter((s) => s.projects.length === 0).length}{" "}
                further disciplines with linked records pending publication. The network never
                infers a relationship from a name or a sector.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
