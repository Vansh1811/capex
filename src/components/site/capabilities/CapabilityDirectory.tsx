import { Fragment, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import type { CapabilityService } from "@/lib/site-data";

/**
 * CAPABILITIES — the unified capability directory (the page's
 * centrepiece). Nine verified disciplines in one continuous numbered
 * index, no practice split — the same editorial register grammar as the
 * People page's roster. The first discipline is selected on load;
 * clicking or keyboard-activating a row selects it and the capability
 * record updates in place — no navigation, no empty panel, no details
 * hidden behind hover. Arrow keys walk the index. Desktop: register
 * left, sticky capability record right. Below lg: the record opens
 * directly beneath the selected row. Everything shown is corpus copy
 * and published record links; nothing is inferred.
 */

export function CapabilityDirectory({ services }: { services: CapabilityService[] }) {
  const ordered = [...services].sort((a, b) => a.n - b.n);
  const [selectedSlug, setSelectedSlug] = useState<string>(ordered[0]?.slug ?? "");
  const [swapping, setSwapping] = useState(false);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swapTimer = useRef<number | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      if (swapTimer.current) window.clearTimeout(swapTimer.current);
    };
  }, []);

  const selected = ordered.find((s) => s.slug === selectedSlug) ?? ordered[0];
  const selectedIndex = ordered.findIndex((s) => s.slug === selected?.slug);
  const publishedRecords = new Set(ordered.flatMap((s) => s.projects.map((p) => p.slug))).size;

  const select = (slug: string) => {
    if (slug === selectedSlug) return;
    if (reduced.current) {
      setSelectedSlug(slug);
      return;
    }
    if (swapTimer.current) window.clearTimeout(swapTimer.current);
    setSwapping(true);
    swapTimer.current = window.setTimeout(() => {
      setSelectedSlug(slug);
      setSwapping(false);
    }, 170);
  };

  const moveFocus = (index: number, e: KeyboardEvent<HTMLButtonElement>) => {
    let next: number | null = null;
    if (e.key === "ArrowDown") next = Math.min(index + 1, ordered.length - 1);
    else if (e.key === "ArrowUp") next = Math.max(index - 1, 0);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ordered.length - 1;
    if (next === null) return;
    e.preventDefault();
    rowRefs.current[next]?.focus();
  };

  const swap = swapping ? "translate-y-[4px] opacity-0" : "translate-y-0 opacity-100";

  return (
    <section
      id="directory"
      aria-label="Capabilities"
      data-tone="light"
      className="paper relative scroll-mt-24 bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-32 lg:px-12 lg:py-40">
        <Reveal>
          <div className="flex items-baseline gap-6">
            <p className="eyebrow-sans text-muted-foreground">Capabilities</p>
            <span aria-hidden="true" className="h-px flex-1 border-t border-foreground/15" />
            <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              {String(ordered.length).padStart(2, "0")} disciplines · {publishedRecords} published
              records
            </span>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-12 gap-y-6 md:mt-12">
            <h2 className="max-w-[24ch] font-display text-[42px] font-normal leading-[1.05] tracking-[-0.02em] md:text-[64px]">
              Disciplines, defined by the work.
            </h2>
            <p className="ml-auto max-w-sm text-sm leading-[1.8] text-muted-foreground">
              Select a discipline to read its verified scope of work and the project records it
              stands on.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 md:mt-20">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
            {/* the register — one continuous numbered directory */}
            <div className="lg:col-span-7 xl:col-span-8">
              <ul aria-label="Capabilities directory">
                {ordered.map((s, index) => {
                  const isSelected = selected?.slug === s.slug;
                  return (
                    <Fragment key={s.slug}>
                      <li>
                        <Reveal>
                          <DirectoryRow
                            service={s}
                            selected={isSelected}
                            onSelect={() => select(s.slug)}
                            onKeyNav={(e) => moveFocus(index, e)}
                            ref={(el) => {
                              rowRefs.current[index] = el;
                            }}
                          />
                        </Reveal>
                      </li>
                      {isSelected && (
                        <li className="lg:hidden">
                          <div
                            className={`transition-[opacity,transform] duration-200 ease-out ${swap}`}
                          >
                            <DirectoryRecord service={s} index={index} total={ordered.length} />
                          </div>
                        </li>
                      )}
                    </Fragment>
                  );
                })}
              </ul>
            </div>

            {/* the record — beside the register at lg+, opened beneath the selected row below */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div
                id="directory-detail"
                aria-live="polite"
                className="hidden lg:sticky lg:top-24 lg:block"
              >
                {selected && (
                  <div className={`transition-[opacity,transform] duration-200 ease-out ${swap}`}>
                    <DirectoryRecord
                      service={selected}
                      index={selectedIndex}
                      total={ordered.length}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One register row — a button: click/Enter selects the discipline. */
function DirectoryRow({
  service,
  selected,
  onSelect,
  onKeyNav,
  ref,
}: {
  service: CapabilityService;
  selected: boolean;
  onSelect: () => void;
  onKeyNav: (e: KeyboardEvent<HTMLButtonElement>) => void;
  ref: (el: HTMLButtonElement | null) => void;
}) {
  const records = service.projects.length;
  const meta =
    records > 0 ? (records === 1 ? "1 record" : `${records} records`) : "On the register";
  return (
    <button
      ref={ref}
      type="button"
      aria-current={selected}
      aria-controls="directory-detail"
      onClick={onSelect}
      onKeyDown={onKeyNav}
      className={`group relative flex w-full cursor-pointer items-baseline gap-4 border-b border-foreground/15 py-6 pl-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] md:gap-8 md:py-8 lg:py-9 ${
        selected ? "max-lg:border-b-transparent" : ""
      }`}
    >
      {/* selection mark — a thin copper leading rule that rests on the selected row */}
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 top-0 w-[2px] bg-[var(--accent)]/70 transition-opacity duration-300 ${
          selected ? "opacity-100" : "opacity-0"
        }`}
      />
      <span
        aria-hidden="true"
        className={`w-8 shrink-0 font-tech text-[11px] tracking-[0.1em] transition-colors duration-300 ${
          selected
            ? "text-[var(--accent)]"
            : "text-muted-foreground/70 group-hover:text-[var(--accent)]"
        }`}
      >
        {String(service.n).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block font-display text-[26px] font-normal leading-[1.1] tracking-[-0.02em] transition-[letter-spacing,color] duration-300 sm:text-[30px] md:text-[34px] xl:text-[40px] ${
            selected ? "text-foreground" : "text-foreground/85 group-hover:text-foreground"
          } group-hover:tracking-[-0.012em]`}
        >
          {service.name}
        </span>
        {/* mobile: meta under the name so the register stays scannable */}
        <span className="mt-2 block font-tech text-[11px] uppercase tracking-[0.14em] text-foreground/60 sm:hidden">
          {meta}
        </span>
      </span>
      <span className="ml-auto hidden shrink-0 text-right sm:block">
        <span className="block font-tech text-[11px] uppercase tracking-[0.14em] text-foreground/70">
          {meta}
        </span>
      </span>
      {/* selection mark — a thin arrow that rests visible on the selected row only */}
      <span
        aria-hidden="true"
        className={`hidden shrink-0 font-tech text-sm transition-all duration-300 md:block ${
          selected
            ? "translate-x-0 text-[var(--accent)] opacity-100"
            : "text-foreground/50 opacity-0 group-hover:opacity-50"
        }`}
      >
        →
      </span>
    </button>
  );
}

/**
 * The capability record — the register's answering half, in the People
 * page's personnel-record grammar: warm elevated ivory ground, square
 * edges, one copper file-rule, a ghosted ordinal, copper section labels
 * and fine internal hairlines. A compact engineering sheet: descriptor,
 * description, verified scope of work and the published records the
 * discipline stands on. No imagery, no invented content: absent
 * sections are omitted.
 */
function DirectoryRecord({
  service,
  index,
  total,
}: {
  service: CapabilityService;
  index: number;
  total: number;
}) {
  const ordinal = String(index + 1).padStart(2, "0");
  const overview =
    service.overview && service.overview !== service.standfirst ? service.overview : null;

  return (
    <div className="animate-reveal relative overflow-hidden border border-foreground/15 bg-[var(--surface-elevated)] text-foreground lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto lg:overscroll-contain">
      {/* copper file-rule */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]/70" />
      {/* ghost ordinal — the discipline number set large behind the file head */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-8 select-none font-display text-[118px] font-normal leading-none tracking-[-0.03em] text-foreground/[0.07]"
      >
        {ordinal}
      </div>
      <div className="relative px-6 py-9 md:px-9 md:py-11">
        {/* file head — identifier left, record kind right */}
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-tech text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
            Discipline {ordinal} / {String(total).padStart(2, "0")}
          </p>
          <p className="font-tech text-[10px] uppercase tracking-[0.24em] text-foreground/40">
            Capability record
          </p>
        </div>

        <p className="mt-9 font-display text-[30px] font-normal leading-[1.06] tracking-[-0.025em] text-foreground md:text-[36px]">
          {service.name}
        </p>
        {service.tagline && (
          <p className="mt-3 flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.22em] text-foreground/60">
            <span aria-hidden="true" className="inline-block h-px w-6 bg-[var(--accent)]/70" />
            {service.tagline}
          </p>
        )}

        {/* the description — corpus copy, comfortable measure */}
        <div className="mt-9 border-t border-foreground/15 pt-8">
          <p className="max-w-[52ch] text-[14.5px] leading-[1.9] text-foreground/75">
            {service.standfirst}
          </p>
          {overview && (
            <p className="mt-4 max-w-[52ch] text-[13.5px] leading-[1.8] text-foreground/55">
              {overview}
            </p>
          )}
        </div>

        {service.included.length > 0 && (
          <div className="mt-9 border-t border-foreground/15 pt-8">
            <p className="font-tech text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
              Scope of work
            </p>
            <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {service.included.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[13px] leading-[1.75] text-foreground/75"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[9px] inline-block h-1 w-1 shrink-0 bg-[var(--accent)]/70"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {service.projects.length > 0 ? (
          <div className="mt-9 border-t border-foreground/15 pt-8">
            <p className="font-tech text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
              Documented under
            </p>
            <ul className="mt-4">
              {service.projects.slice(0, 3).map((p) => (
                <li key={p.slug} className="border-b border-foreground/15 last:border-b-0">
                  <Link
                    to="/projects/$slug"
                    params={{ slug: p.slug }}
                    className="group flex items-baseline justify-between gap-6 py-3.5 transition-colors"
                  >
                    <span className="min-w-0">
                      <span className="block text-[13.5px] font-medium leading-snug text-foreground/85 transition-colors group-hover:text-foreground">
                        {p.title}
                      </span>
                      <span className="mt-1 block font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                        {p.ref} · {p.city}
                        {p.figure ? ` — ${p.figure}` : ""}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-tech text-xs text-foreground/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--accent)]"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-9 border-t border-foreground/15 pt-8">
            <p className="text-[13px] leading-[1.8] text-foreground/45">
              On the verified register — linked project records pending publication.
            </p>
          </div>
        )}

        <div className="mt-9 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 border-t border-foreground/15 pt-8">
          <Link
            to="/services/$slug"
            params={{ slug: service.slug }}
            className="group inline-flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.24em] text-foreground/70 transition-colors hover:text-foreground"
          >
            <span className="border-b border-foreground/40 pb-0.5 transition-colors group-hover:border-foreground/70">
              The full discipline page
            </span>
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <p className="font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/50">
            Scope per records — {service.source_ref}
          </p>
        </div>
      </div>
    </div>
  );
}
