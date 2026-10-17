import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import type { AtlasSector, SectorAtlas } from "@/lib/site-data";

/**
 * ENVIRONMENTS REGISTER — "Where the work stands." The nine verified
 * environments from the company record, as a compact typographic register
 * beside the project evidence: no plates, no giant numerals, no repeated
 * heroes. One row opens at a time; each open row answers with the
 * environment's own verified facts — its standfirst, the places and scopes
 * its records actually carry, and up to three published record links.
 * Environments without published records say so; the register never infers
 * a relationship. Keeps the #where-we-work anchor all inbound links use.
 */

const num = (i: number) => String(i).padStart(2, "0");

const TIER_LABEL: Record<AtlasSector["evidence_tier"], string> = {
  hub: "Evidence hub",
  service_led: "Service-led",
  list_only: "On the register",
};

export function EnvironmentsRegister({ atlas }: { atlas: SectorAtlas }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section
      id="where-we-work"
      aria-label="Where the work stands — the environments register"
      data-tone="light"
      className="paper relative scroll-mt-24 bg-background"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-20 md:px-10 md:py-28 lg:px-12 lg:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow-sans text-muted-foreground">
                Environments · where the work stands
              </p>
              <h2 className="mt-5 font-display text-[9vw] font-normal leading-[1.02] tracking-[-0.025em] sm:text-[6.5vw] lg:text-[52px]">
                Where the work stands<span className="text-foreground/30">.</span>
              </h2>
            </div>
            <p className="max-w-sm pb-2 text-sm leading-relaxed text-muted-foreground">
              Nine environments from the company record — {atlas.documented} verified projects are
              the evidence. Environments without published records say so.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 border-t border-border xl:mt-20">
          {atlas.sectors.map((s) => (
            <RegisterRow
              key={s.slug}
              sector={s}
              links={atlas.linksBySector[s.slug] ?? []}
              open={open === s.slug}
              onToggle={() => setOpen((v) => (v === s.slug ? null : s.slug))}
            />
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-8 max-w-md text-sm leading-[1.8] text-muted-foreground">
            The register never infers a relationship from a name —{" "}
            <Link
              to="/projects"
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              the published archive is the evidence
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function RegisterRow({
  sector: s,
  links,
  open,
  onToggle,
}: {
  sector: AtlasSector;
  links: SectorAtlas["linksBySector"][string];
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `environment-panel-${s.slug}`;
  const count =
    s.projectCount > 0
      ? `${s.projectCount} record${s.projectCount === 1 ? "" : "s"}`
      : "No records yet";

  return (
    <div className="border-b border-border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={`group flex w-full items-baseline gap-4 py-6 text-left outline-none transition-colors focus-visible:border-foreground/40 md:gap-7 md:py-7 ${
          open ? "border-foreground/25" : "hover:border-foreground/30"
        }`}
      >
        <span
          className={`w-6 shrink-0 font-tech text-[12px] tracking-[0.12em] transition-colors duration-300 ${
            open ? "text-[var(--accent)]" : "text-foreground/30 group-hover:text-foreground"
          }`}
        >
          {num(s.n)}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block font-display text-[22px] font-normal leading-[1.08] tracking-[-0.02em] transition-colors duration-300 md:text-[26px] ${
              open ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
            }`}
          >
            {s.name}
          </span>
          <span className="mt-1.5 block font-tech text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">
            {TIER_LABEL[s.evidence_tier]}
            <span aria-hidden="true"> · </span>
            {count}
          </span>
        </span>
        <span className="hidden shrink-0 pb-1 font-tech text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60 sm:block">
          {s.places.length > 0 ? s.places.slice(0, 2).join(" · ") : "—"}
        </span>
        <span
          aria-hidden="true"
          className={`shrink-0 pb-1 font-tech text-xs text-foreground/45 transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
        >
          →
        </span>
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        {...(!open ? { inert: true as never } : {})}
      >
        <div className="overflow-hidden">
          <div className="pb-10 pt-2 lg:grid lg:grid-cols-12 lg:gap-10 lg:pl-[52px]">
            <div className="lg:col-span-7">
              {s.standfirst ? (
                <p className="max-w-lg text-sm leading-[1.75] text-muted-foreground">
                  {s.standfirst}
                </p>
              ) : (
                <p className="max-w-lg text-sm leading-[1.75] text-muted-foreground">
                  Listed from the company record — no project records published under this
                  environment yet.
                </p>
              )}
              {s.services.length > 0 && (
                <p className="mt-5 font-tech text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-muted-foreground/70">
                  Scopes on record — {s.services.map((v) => v.name).join(" · ")}
                </p>
              )}
              {s.places.length > 0 && (
                <p className="mt-2 font-tech text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-muted-foreground/70">
                  Places — {s.places.join(" · ")}
                </p>
              )}
            </div>

            <div className="mt-6 lg:col-span-5 lg:mt-0">
              {links.length > 0 ? (
                <div>
                  <div className="flex items-baseline gap-4">
                    <p className="eyebrow-sans text-muted-foreground/70">Documented under</p>
                    <span aria-hidden="true" className="h-px flex-1 border-t border-border" />
                  </div>
                  <ul className="mt-2">
                    {links.slice(0, 3).map((p) => (
                      <li key={p.slug}>
                        <Link
                          to="/projects/$slug"
                          params={{ slug: p.slug }}
                          className="group flex items-baseline justify-between gap-5 border-b border-border py-3 transition-colors hover:border-foreground/40"
                        >
                          <span className="min-w-0">
                            <span className="block text-sm font-medium leading-snug text-foreground/85 transition-colors group-hover:text-foreground">
                              {p.title}
                            </span>
                            <span className="mt-0.5 block font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
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
                <p className="border-t border-border pt-4 font-tech text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-muted-foreground/60">
                  On the environment register — no project records published under this environment
                  yet. The register never infers a relationship from a name.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
