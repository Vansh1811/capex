import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { FilterLine } from "@/components/site/clients/Vocabulary";
import type { ClientsPageClient } from "@/lib/site-data";

/**
 * THE CLIENT INDEX — the page's primary archive: a large typographic index,
 * not a card grid. Each organization reads as one dominant name set over a
 * hairline rule, with a small verified metadata line beneath (relationship
 * type, associated work count). The signature interaction lives beside it:
 * a large editorial plate that holds the selected client's imagery and
 * associated work — imagery fades between clients as the selection moves,
 * never a thumbnail, never a tooltip.
 *
 * Desktop: hover/focus on a name drives the plate. Touch: the name row
 * toggles the plate inline (the plate is rendered in-flow on small
 * screens). Selection is also driven from the RelationshipField above —
 * one shared source of emphasis.
 */
export function ClientIndex({
  clients,
  activeSlug,
  onActiveChange,
  filter,
}: {
  clients: ClientsPageClient[];
  activeSlug: string | null;
  onActiveChange: (slug: string | null) => void;
  /** The active relationship filter, when the page provides controls. */
  filter?: {
    options: { value: string; label: string; count: number }[];
    active: string;
    onChange: (v: string) => void;
  } | null;
}) {
  const active = clients.find((c) => c.slug === activeSlug) ?? null;
  const activeRef = useRef<HTMLDivElement>(null);

  return (
    <section
      aria-label="Client index"
      data-tone="light"
      className="paper bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 pb-28 pt-28 md:px-10 md:pt-36 lg:px-12 lg:pb-40">
        <Reveal>
          <div className="flex items-baseline gap-6">
            <p className="eyebrow-sans text-muted-foreground">The index</p>
            <span className="h-px flex-1 border-t border-border" aria-hidden="true" />
            <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              {clients.length} on the record
            </span>
          </div>
        </Reveal>

        {/* the relationship filter — typographic controls, one quiet line */}
        {filter && (
          <Reveal delay={100}>
            <div className="mt-8">
              <FilterLine
                options={filter.options}
                active={filter.active}
                onChange={filter.onChange}
              />
            </div>
          </Reveal>
        )}

        <div className="mt-10 grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* the index proper */}
          <div className="lg:col-span-7 xl:col-span-8">
            <ol aria-label="All clients and counterparties">
              {clients.map((c, i) => (
                <li key={c.slug}>
                  <Reveal delay={Math.min(i * 30, 200)}>
                    <ClientRow
                      c={c}
                      n={i + 1}
                      active={activeSlug === c.slug}
                      onEnter={(slug) => onActiveChange(slug)}
                      onLeave={() => onActiveChange(null)}
                    />
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          {/* the plate — desktop: pinned beside the index; touch: hidden here
              (ClientRow renders the expanded plate in-flow instead) */}
          <div className="hidden lg:col-span-5 xl:col-span-4 lg:block">
            <div className="sticky top-28" ref={activeRef}>
              <PreviewPlate client={active} forTouch={false} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One typographic index row. On touch layouts the row itself expands. */
function ClientRow({
  c,
  n,
  active,
  onEnter,
  onLeave,
}: {
  c: ClientsPageClient;
  n: number;
  active: boolean;
  onEnter: (slug: string) => void;
  onLeave: () => void;
}) {
  const [touchOpen, setTouchOpen] = useState(false);
  // Track that this row was opened by an explicit tap (not hover) so the
  // interaction converts honestly on touch layouts.
  const rowActive = active || touchOpen;

  return (
    <div>
      <button
        type="button"
        aria-expanded={rowActive}
        onClick={() => setTouchOpen((v) => !v)}
        onMouseEnter={() => onEnter(c.slug)}
        onFocus={() => onEnter(c.slug)}
        onMouseLeave={onLeave}
        onBlur={onLeave}
        className="group block w-full border-b border-border py-6 text-left transition-colors duration-300 hover:border-foreground/40 md:py-7"
      >
        <span className="flex items-baseline gap-5 md:gap-8">
          <span
            className={`font-tech text-[11px] tracking-[0.08em] transition-colors duration-300 ${
              rowActive ? "text-foreground" : "text-muted-foreground/60"
            }`}
          >
            {String(n).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={`block font-display text-[26px] font-normal leading-[1.08] tracking-[-0.02em] transition-all duration-500 ease-out group-hover:translate-x-1.5 sm:text-[32px] md:text-[40px] lg:text-[44px] xl:text-[52px] ${
                rowActive ? "text-foreground" : "text-foreground/85 group-hover:text-foreground"
              }`}
            >
              {c.name}
            </span>
            <span className="mt-2.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="eyebrow-sans text-muted-foreground/80">{c.terms[0]}</span>
              {c.projects.length > 0 && (
                <span className="font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
                  {c.projects.length} associated project{c.projects.length === 1 ? "" : "s"}
                </span>
              )}
              {c.note && (
                <span className="hidden text-xs leading-relaxed text-muted-foreground/70 sm:block">
                  {c.note}
                </span>
              )}
            </span>
          </span>
          {c.projects.length > 0 && (
            <span
              aria-hidden="true"
              className={`hidden shrink-0 font-tech text-xs text-foreground/50 transition-all duration-300 md:block ${
                rowActive ? "translate-x-0 opacity-100" : "opacity-0"
              }`}
            >
              →
            </span>
          )}
        </span>
      </button>

      {/* the touch expansion — the plate, in-flow, under the name */}
      <div className="lg:hidden">
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            rowActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="pt-2">
              <PreviewPlate client={c} forTouch={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * THE PREVIEW PLATE — the signature element: a large editorial plate holding
 * the selected client's atmosphere frame and associated work. Imagery is
 * implementation material (captioned); the associated-work list is the
 * verified gateway into the Projects archive.
 */
function PreviewPlate({
  client,
  forTouch,
}: {
  client: ClientsPageClient | null;
  forTouch: boolean;
}) {
  if (!client) {
    return (
      <div className="hidden h-full min-h-[420px] flex-col justify-between border border-border/70 p-6 lg:flex">
        <p className="eyebrow-sans text-muted-foreground/60">Selected relationship</p>
        <p className="max-w-[26ch] font-display text-xl font-normal leading-[1.3] text-foreground/60">
          Move through the index — the work each relationship stands on appears here.
        </p>
        <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
          {forTouch ? "" : "Reference imagery throughout"}
        </p>
      </div>
    );
  }

  const first = client.projects[0];

  return (
    <div className="flex h-full flex-col">
      {/* the plate image — atmosphere, crossfading between clients */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface)] lg:aspect-[4/5]">
        <img
          key={client.slug}
          src={client.image}
          alt="Atmospheric reference imagery — not a documented Capex project"
          loading="lazy"
          decoding="async"
          className="plate-img absolute inset-0 h-full w-full object-cover [filter:saturate(0.82)_contrast(0.98)]"
        />
        {client.projects.length > 1 && (
          <span className="absolute bottom-4 left-4 font-tech text-[10px] uppercase tracking-[0.18em] text-white/85 mix-blend-difference">
            {client.projects.length} projects
          </span>
        )}
      </div>

      {/* the plate's information field */}
      <div className="mt-5">
        <p className="font-display text-xl font-normal leading-[1.12] tracking-[-0.015em] md:text-2xl">
          {client.name}
        </p>
        <p className="mt-1.5 eyebrow-sans text-muted-foreground">{client.terms[0]}</p>

        {client.projects.length > 0 ? (
          <div className="mt-6">
            <p className="eyebrow-sans text-muted-foreground/70">Associated work</p>
            <ul className="mt-3">
              {client.projects.slice(0, 3).map((p, pi) => (
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
                        {p.city}
                        {p.figure ? ` · ${p.figure}` : ""}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-baseline gap-3">
                      {pi === 0 && first && (
                        <span className="font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/50">
                          {p.practice_label}
                        </span>
                      )}
                      <span
                        aria-hidden="true"
                        className="text-foreground/50 transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {client.projects.length > 3 && (
              <p className="mt-3 font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
                + {client.projects.length - 3} more
              </p>
            )}
          </div>
        ) : (
          client.note && (
            <p className="mt-5 max-w-xs text-sm leading-[1.7] text-muted-foreground">
              {client.note}
            </p>
          )
        )}
      </div>

      <p className="mt-5 font-tech text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground/60">
        Reference imagery — not a documented Capex project
      </p>
    </div>
  );
}
