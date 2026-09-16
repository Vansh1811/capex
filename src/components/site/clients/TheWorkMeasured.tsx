import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import type { SignatureMeasure } from "@/lib/site-data";

/**
 * THE WORK, MEASURED — the figures of record, as a register.
 *
 * Not a poster wall: one instrument strip. Each cell is a link to the
 * published record it measures, and the strip reads itself — the active
 * figure's sheet number and metric label sit in the header line and follow
 * the pointer or the keyboard; left alone, the register walks itself one
 * measure at a time and stops the moment a visitor takes over. Figures count
 * up as the strip arrives. Every value comes from the record it names, so a
 * measure can never drift from the archive (the corpus is the only source).
 * Reduced motion: no walk, no count — the register renders final and still.
 */

/** How long the register holds one measure while walking itself. */
const CYCLE_MS = 3600;
const COUNT_MS = 1200;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mql.matches);
    on();
    mql.addEventListener("change", on);
    return () => mql.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** True once, the first time the element has meaningfully entered the viewport. */
function useInView<T extends HTMLElement>(ratio: number) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: ratio },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ratio]);
  return { ref, inView };
}

/**
 * The figure, counted up once when the register arrives. The count is an
 * entrance, never a claim: the target is the record's own value, and a
 * non-numeric figure renders verbatim rather than being coerced into one.
 */
function Figure({ value, unit, run }: { value: string; unit: string; run: boolean }) {
  const numeric = /^[\d,]+$/.test(value.trim());
  const target = numeric ? Number(value.replace(/,/g, "")) : null;
  const [n, setN] = useState(target ?? 0);

  useEffect(() => {
    if (target === null) return;
    if (!run) {
      setN(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / COUNT_MS);
      // ease-out cubic — the figure settles rather than stops
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setN(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);

  return (
    <span className="font-display text-[clamp(28px,7.4vw,40px)] font-normal leading-[0.95] tracking-[-0.02em] tabular-nums sm:text-[clamp(30px,3.4vw,52px)]">
      {numeric ? n.toLocaleString("en-US") : value}
      {unit ? (
        <span className="ml-1 align-[0.12em] text-[0.52em] tracking-[0.02em] opacity-80">
          {unit}
        </span>
      ) : null}
    </span>
  );
}

export function TheWorkMeasured({ measures }: { measures: SignatureMeasure[] }) {
  const { ref, inView } = useInView<HTMLElement>(0.3);
  const reduced = useReducedMotion();
  /** The measure under the reader's attention — pointer, keyboard, or walk. */
  const [activeSlug, setActiveSlug] = useState<string | null>(measures[0]?.slug ?? null);
  /** Set the first time a visitor takes the register; the walk stops. */
  const [taken, setTaken] = useState(false);

  const activeIndex = Math.max(
    0,
    measures.findIndex((m) => m.slug === activeSlug),
  );
  const active = measures[activeIndex] ?? null;

  // The walk: advance one measure at a time until the visitor takes over.
  useEffect(() => {
    if (taken || reduced || !inView || measures.length < 2) return;
    const id = window.setInterval(() => {
      setActiveSlug((current) => {
        const i = measures.findIndex((m) => m.slug === current);
        return measures[(i + 1) % measures.length].slug;
      });
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [taken, reduced, inView, measures]);

  const take = (slug: string) => {
    setTaken(true);
    setActiveSlug(slug);
  };

  if (measures.length === 0) return null;

  return (
    <section
      ref={ref}
      aria-label="The Work, Measured"
      data-tone="dark"
      className="bg-[var(--brand-deep)] py-16 text-white md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1680px] px-6 md:px-10 lg:px-12">
        <Reveal>
          <div className="flex items-center gap-6">
            <h2 className="shrink-0 font-tech text-[10px] uppercase tracking-[0.2em] text-[var(--accent-display)]/90">
              A few measures of the work
            </h2>
            <div className="h-px flex-1 bg-white/10" aria-hidden="true" />
            {/* the readout — which figure the register is on, and what it
                measures. Decorative: every cell states its own record. */}
            {active ? (
              <p
                key={active.slug}
                aria-hidden="true"
                className="hidden shrink-0 items-center gap-3 font-tech text-[10px] uppercase tracking-[0.2em] text-white/45 animate-reveal sm:flex"
              >
                <span className="h-1 w-1 rounded-full bg-[var(--accent-display)]" />
                {active.ref}
                <span className="text-white/25">·</span>
                {active.metricLabel}
              </p>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ul
            aria-label="Figures of record — each opens its project record"
            className="mt-8 grid grid-cols-2 border-l border-t border-white/10 md:mt-10 lg:grid-cols-4"
          >
            {measures.map((m, i) => {
              const isActive = m.slug === activeSlug;
              const n = String(i + 1).padStart(2, "0");
              return (
                <li key={m.slug} className="flex">
                  <Link
                    to="/projects/$slug"
                    params={{ slug: m.slug }}
                    onMouseEnter={() => take(m.slug)}
                    onFocus={() => take(m.slug)}
                    className={`group relative flex w-full flex-col border-b border-r border-white/10 px-5 py-6 outline-none transition-colors duration-500 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--accent-display)] sm:px-6 sm:py-7 lg:px-7 lg:py-8 ${
                      isActive ? "bg-white/[0.045]" : "hover:bg-white/[0.025]"
                    }`}
                  >
                    {/* the marker — a copper hairline riding the active cell */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 top-0 h-px origin-left bg-[var(--accent-display)] transition-transform duration-500 ease-out ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                    <span className="flex items-baseline justify-between gap-2 font-tech text-[10px] uppercase tracking-[0.18em]">
                      <span
                        className={`transition-colors duration-500 ${
                          isActive ? "text-[var(--accent-display)]" : "text-white/40"
                        }`}
                      >
                        {n}
                      </span>
                      <span
                        className={`truncate transition-colors duration-500 ${
                          isActive ? "text-white/70" : "text-white/35"
                        }`}
                      >
                        {m.city}
                        <span className="text-white/20"> · </span>
                        {m.status === "ongoing" ? "Ongoing" : "Completed"}
                      </span>
                    </span>

                    <span
                      className={`mt-5 block transition-colors duration-500 sm:mt-6 ${
                        isActive ? "text-white" : "text-white/85"
                      }`}
                    >
                      <Figure value={m.value} unit={m.unit} run={inView} />
                    </span>

                    <span className="mt-3 block font-tech text-[10px] uppercase leading-[1.6] tracking-[0.18em] text-white/55">
                      {m.caption}
                      <br />
                      {m.context}
                    </span>

                    {/* the record line — the way into the source, always
                        present so a touch visit is never short of it */}
                    <span
                      className={`mt-5 flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 ${
                        isActive ? "text-[var(--accent-display)]" : "text-white/40"
                      }`}
                    >
                      Open the record
                      <span
                        aria-hidden="true"
                        className={`inline-block transition-transform duration-500 ease-out ${
                          isActive ? "translate-x-1" : "translate-x-0"
                        }`}
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-6 max-w-2xl font-tech text-[10px] uppercase leading-relaxed tracking-[0.16em] text-white/40">
            Each figure is the published record&rsquo;s own — {measures.length} measures of the work
            on the register.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
