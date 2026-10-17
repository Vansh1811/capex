import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { SiteImage } from "@/components/site/SiteImage";
import { EVIDENCE_SELECTION } from "@/lib/capability-media";
import type { ArchiveProject } from "@/lib/site-data";

/**
 * SELECTED PROJECT EVIDENCE (Section E) — a small curated set from the
 * published archive, not a second Projects page: a handful of records
 * spanning both practices and both statuses, every field read from the
 * record's own sheet (ref, title, client, place, scope line, figure,
 * status) and linked to its full entry. Photography is company works
 * photography only; the six frames are all distinct files across the
 * page (see src/lib/capability-media.ts).
 */
export function ProjectEvidence({
  projects,
  published,
}: {
  projects: ArchiveProject[];
  published: number;
}) {
  const items = EVIDENCE_SELECTION.map((sel) => ({
    sel,
    record: projects.find((p) => p.slug === sel.slug) ?? null,
  })).flatMap(({ sel, record }) => (record ? [{ sel, record }] : []));

  if (items.length === 0) return null;

  return (
    <section
      id="evidence"
      aria-label="Selected project evidence"
      data-tone="light"
      className="paper relative scroll-mt-24 bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 pb-20 pt-24 md:px-10 md:pt-28 lg:px-12">
        <Reveal>
          <div className="flex items-baseline gap-6">
            <p className="eyebrow-sans text-muted-foreground">Selected evidence</p>
            <span aria-hidden="true" className="h-px flex-1 border-t border-border" />
            <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              {published} published records · both statuses
            </span>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <div>
              <h2 className="max-w-[26ch] font-display text-[24px] font-normal leading-[1.15] tracking-[-0.015em] md:text-[30px] lg:text-[32px]">
                The capability, on the record.
              </h2>
              <p className="mt-3 max-w-2xl text-[13px] leading-[1.75] text-muted-foreground">
                {items.length} records from the published archive — every figure, client and place
                read from its own sheet. Each one opens its full entry.
              </p>
            </div>
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground"
            >
              <span className="border-b border-border pb-0.5 transition-colors group-hover:border-foreground/60">
                The full archive
              </span>
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ sel, record }, i) => {
            const photo = sel.photo ?? {
              src: record.media.src,
              subject: record.media.alt,
              alt: record.media.alt,
            };
            const metric = record.metrics[0];
            return (
              <li key={record.slug}>
                <Reveal delay={Math.min(i * 60, 240)}>
                  <Link
                    to="/projects/$slug"
                    params={{ slug: record.slug }}
                    className="group block border-t border-border pt-5"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface)]">
                      <SiteImage
                        src={photo.src}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        alt={photo.alt}
                        className="absolute inset-0 h-full w-full object-cover [filter:saturate(0.88)_contrast(1.02)] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-6">
                      <p className="font-tech text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                        {record.ref} · {record.client_display ?? record.practice_label}
                      </p>
                      <p
                        className={`shrink-0 font-tech text-[10px] uppercase tracking-[0.18em] ${
                          record.status === "ongoing"
                            ? "text-[var(--accent)]"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        {record.status === "ongoing" ? "Ongoing" : "Completed"}
                      </p>
                    </div>
                    <h3 className="mt-2 font-display text-[20px] font-normal leading-[1.2] tracking-[-0.01em] text-foreground/90 transition-colors group-hover:text-foreground md:text-[22px]">
                      {record.title}
                    </h3>
                    <p className="mt-1.5 font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                      {record.city}, {record.state}
                    </p>
                    <p className="mt-3 line-clamp-2 text-[13px] leading-[1.7] text-muted-foreground">
                      {record.scope_line}
                    </p>
                    <div className="mt-3 flex items-baseline justify-between gap-6 border-t border-border pt-3">
                      <span className="font-tech text-[11px] tracking-[0.08em] text-foreground/70">
                        {metric
                          ? `${metric.value}${metric.unit ? ` ${metric.unit}` : ""} ${metric.label.toLowerCase()}`
                          : record.source_ref}
                      </span>
                      <span
                        aria-hidden="true"
                        className="font-tech text-xs text-foreground/50 transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal delay={200}>
          <p className="mt-10 font-tech text-[10px] uppercase leading-[1.8] tracking-[0.18em] text-muted-foreground/60">
            Photography from company works records — Capex works photographs
          </p>
        </Reveal>
      </div>
    </section>
  );
}
