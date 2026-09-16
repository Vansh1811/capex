import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import type { ClientsPageClient } from "@/lib/site-data";

/**
 * The Relationship Field: the page's central idea set as an editorial
 * composition — CAPEX → CLIENT → PROJECT → CAPABILITY → SECTOR, held by
 * thin rules, whitespace and typography (never a technical diagram). The
 * active client of the index (hover/focus/tap, whichever touched the page
 * last) fills the field with ONLY its verified relationships; the rows
 * recede and arrive with quiet transitions. No glowing nodes, no graph.
 */
const FIELD_LEVELS = ["Client", "Project", "Capability", "Sector"] as const;

export function RelationshipField({
  clients,
  active,
  onPick,
}: {
  clients: ClientsPageClient[];
  /** The client currently emphasized elsewhere on the page (or a default). */
  active: ClientsPageClient | null;
  /** Choosing a name here selects the relationship (used on touch layouts). */
  onPick: (slug: string) => void;
}) {
  const work = active?.projects ?? [];
  const first = work[0];

  return (
    <section
      aria-label="How a relationship reads"
      data-tone="light"
      className="paper bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 pb-24 pt-28 md:px-10 md:pb-32 md:pt-36 lg:px-12 lg:pb-40">
        <Reveal>
          <div className="flex items-baseline gap-6">
            <p className="eyebrow-sans text-muted-foreground">The relationship</p>
            <span className="h-px flex-1 border-t border-border" aria-hidden="true" />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* the field itself — the stack of levels, each holding what the
              active client's verified data actually says */}
          <div className="lg:col-span-7 xl:col-span-8">
            <Reveal delay={200}>
              <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-muted-foreground">
                A relationship here is not a logo on a wall. It reads downward — from Capex, to the
                organization, to the documented project, to the capability it took, in the sector it
                serves.
              </p>
            </Reveal>

            <div className="mt-16 md:mt-20">
              {/* CAPEX — the head of the field */}
              <Reveal delay={260}>
                <div className="flex items-baseline justify-between gap-6">
                  <span className="font-display text-xl font-medium tracking-[0.22em] md:text-2xl">
                    CAPEX
                  </span>
                  <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                    Engineering &amp; delivery
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4" aria-hidden="true">
                  <span className="h-10 w-px bg-border" />
                  <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                    ↓
                  </span>
                </div>
              </Reveal>

              {FIELD_LEVELS.map((level, li) => {
                const last = li === FIELD_LEVELS.length - 1;
                const value =
                  level === "Client"
                    ? (active?.name ?? "—")
                    : level === "Project"
                      ? work.length > 0
                        ? `${first.title}${work.length > 1 ? ` + ${work.length - 1} more` : ""}`
                        : "—"
                      : level === "Capability"
                        ? (first?.practice_label ?? "—")
                        : (first?.sector ?? "—");
                const empty = value === "—";
                return (
                  <Reveal key={level} delay={340 + li * 120}>
                    <div className="border-l border-border pl-6 md:pl-8">
                      <div className="grid grid-cols-[7rem_1fr] items-baseline gap-x-6 py-6 md:grid-cols-[10rem_1fr] md:py-7">
                        <span className="eyebrow-sans text-muted-foreground/70">{level}</span>
                        <span
                          className={`font-display leading-[1.15] transition-all duration-500 ease-out ${
                            level === "Client"
                              ? "text-[26px] font-normal tracking-[-0.015em] md:text-[40px] lg:text-[48px]"
                              : "text-base font-normal text-foreground/90 md:text-xl lg:text-[22px]"
                          } ${empty ? "text-muted-foreground/40" : ""}`}
                        >
                          {value}
                        </span>
                      </div>
                    </div>
                    {!last && (
                      <div className="border-l border-border pl-6 md:pl-8" aria-hidden="true">
                        <span className="block h-5 w-px bg-border" />
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* the quiet picker — names as controls, the field's counterpart.
              Typographic, unboxed; the active name is emphasized. */}
          <div className="lg:col-span-5 xl:col-span-4">
            <Reveal delay={160}>
              <p className="eyebrow-sans text-muted-foreground/70">Select a relationship</p>
              <ul className="mt-6 space-y-0">
                {clients.slice(0, 9).map((c) => {
                  const isActive = active?.slug === c.slug;
                  return (
                    <li key={c.slug}>
                      <button
                        type="button"
                        onClick={() => onPick(c.slug)}
                        aria-pressed={isActive}
                        className={`group flex w-full items-baseline justify-between gap-4 border-b border-border py-3.5 text-left transition-colors duration-300 hover:border-foreground/40 ${
                          isActive ? "" : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <span
                          className={`font-display text-base font-normal tracking-[-0.01em] transition-colors duration-300 md:text-lg ${
                            isActive
                              ? "text-foreground"
                              : "text-foreground/80 group-hover:text-foreground"
                          }`}
                        >
                          {c.name}
                        </span>
                        <span
                          className={`shrink-0 font-tech text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                            isActive ? "text-foreground" : "text-muted-foreground/60"
                          }`}
                        >
                          {c.projects.length > 0
                            ? `${c.projects.length} project${c.projects.length === 1 ? "" : "s"}`
                            : "Association"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {first && (
                <Link
                  to="/projects/$slug"
                  params={{ slug: first.slug }}
                  className="group mt-8 inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-foreground"
                >
                  <span className="border-b border-border pb-1 transition-colors group-hover:border-foreground">
                    View the project
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
