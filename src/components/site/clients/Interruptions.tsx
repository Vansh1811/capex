import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import type { ClientsPageClient } from "@/lib/site-data";

/**
 * Interruption I — THE LARGE RELATIONSHIP MOMENT: after the first block of
 * the index, one selected relationship is presented at large scale on warm
 * stone. The flagship relationship is chosen honestly — the client with the
 * most published associated work (ties broken by registry order); when data
 * changes, this composition changes with it. A large portrait plate hangs
 * the atmosphere; the relationship's verified facts set at large type.
 */
export function LargeRelationship({ client }: { client: ClientsPageClient }) {
  const first = client.projects[0];
  return (
    <section
      aria-label={`${client.name} — the relationship in scale`}
      data-tone="light"
      className="paper bg-[var(--surface)] text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-32 lg:px-12 lg:py-40">
        <Reveal>
          <div className="flex items-baseline gap-6">
            <p className="eyebrow-sans text-muted-foreground">The relationship, in scale</p>
            <span className="h-px flex-1 border-t border-border" aria-hidden="true" />
          </div>
        </Reveal>

        <div className="mt-14 grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
          {/* the type column — the client at its largest on the page */}
          <div className="lg:col-span-6">
            <Reveal delay={120}>
              <p className="eyebrow-sans text-muted-foreground">{client.terms[0]}</p>
            </Reveal>
            <Reveal delay={220}>
              <h2 className="mt-6 max-w-[14ch] text-balance font-display text-[11vw] font-normal leading-[1.02] tracking-[-0.025em] sm:text-[9vw] lg:text-[min(6.4vw,104px)]">
                {client.name}
              </h2>
            </Reveal>
            {client.note && (
              <Reveal delay={340}>
                <p className="mt-8 max-w-md text-[15px] leading-[1.8] text-muted-foreground">
                  {client.note}
                </p>
              </Reveal>
            )}

            {client.projects.length > 0 && (
              <Reveal delay={440}>
                <div className="mt-12">
                  <p className="eyebrow-sans text-muted-foreground/70">Associated work</p>
                  <ul className="mt-4">
                    {client.projects.slice(0, 3).map((p, pi) => (
                      <li key={p.slug} className="border-t border-border">
                        <Link
                          to="/projects/$slug"
                          params={{ slug: p.slug }}
                          className="group flex items-baseline gap-6 py-4 transition-colors hover:border-foreground/30"
                        >
                          <span className="font-tech text-[11px] tracking-[0.08em] text-muted-foreground/60">
                            {String(pi + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-lg font-normal leading-[1.15] tracking-[-0.01em] text-foreground/85 transition-colors group-hover:text-foreground md:text-xl">
                              {p.title}
                            </span>
                            <span className="mt-0.5 block font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                              {p.city} · {p.state}
                              {p.figure ? ` · ${p.figure}` : ""}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className="text-foreground/40 transition-transform duration-300 group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            {first && (
              <Reveal delay={540}>
                <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
                  <span className="font-tech text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {first.practice_label}
                  </span>
                  {first.sector && (
                    <span className="font-tech text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {first.sector}
                    </span>
                  )}
                </div>
              </Reveal>
            )}
          </div>

          {/* the plate — tall portrait, unblinds from the right */}
          <div className="lg:col-span-6">
            <Reveal delay={300}>
              <ClipReveal edge="right" ratio="3 / 4" delay={160} className="lg:ml-auto lg:w-[86%]">
                <img
                  src={client.image}
                  alt="Atmospheric reference imagery — not a documented Capex project"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-[55%_42%] [filter:saturate(0.85)_contrast(0.98)]"
                />
              </ClipReveal>
              <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                Reference imagery — not a documented Capex project
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Interruption II — THE PHOTOGRAPHIC FIELD: a deep-earth full-bleed break
 * between index blocks. Wide, quiet, nearly abstract — the material world
 * the relationships live in. No facts, no chrome; one line of type.
 */
export function PhotographicField({
  image,
  line,
  caption,
}: {
  image: string;
  line: string;
  caption: string;
}) {
  return (
    <section
      aria-label="Material field — a pause between the index"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--ink)] text-white"
    >
      <div className="relative h-[68vh] min-h-[420px] w-full md:h-[80vh]">
        <ClipReveal edge="bottom" className="h-full">
          <img
            src={image}
            alt="Material atmosphere — reference imagery"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-[50%_38%] [filter:saturate(0.72)_contrast(1.02)_brightness(0.9)]"
          />
        </ClipReveal>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--ink) 0%, transparent 22%, transparent 62%, var(--ink) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-14 md:px-10 md:pb-20 lg:px-12">
          <Reveal delay={200}>
            <p className="max-w-[22ch] font-display text-3xl font-normal leading-[1.15] tracking-[-0.02em] md:text-5xl lg:text-6xl">
              {line}
            </p>
          </Reveal>
        </div>
      </div>
      <p className="px-6 pb-8 font-tech text-[10px] uppercase tracking-[0.18em] text-white/25 md:px-10 lg:px-12">
        {caption}
      </p>
    </section>
  );
}
