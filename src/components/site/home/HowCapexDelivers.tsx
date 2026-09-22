import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

/**
 * How Capex Delivers (V3.3): the original flowing line — five setting
 * words joined by copper hairlines — elevated, not replaced. The line
 * draws itself as it scrolls into view; then a slow auto-cycle walks the
 * five stages (word lights, connectors ignite behind it like progress),
 * pausing while the section is off-screen, while a stage is hovered /
 * focused, or under prefers-reduced-motion. A quiet mono readout names
 * the live stage; the scope notes stay screen-reader-side per word and
 * the closing line is verbatim. Copy unchanged — the verified delivery
 * verbs, nothing invented.
 */
const FLOW = [
  { word: "Engineering", note: "Engineering" },
  { word: "Supply", note: "Procurement & supply" },
  { word: "Install", note: "Installation" },
  { word: "Test", note: "Testing" },
  { word: "Commission", note: "Commissioning" },
] as const;

export function HowCapexDelivers() {
  const sectionRef = useRef<HTMLElement>(null);
  const hoveredRef = useRef<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  // Track the section: draw the line on first entry, pause the cycle off-screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEntered(true);
      setVisible(false);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setEntered(true);
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Slow auto-cycle through the five stages — paused while interacting.
  useEffect(() => {
    if (!visible || hovered !== null) return;
    const id = window.setInterval(() => {
      if (hoveredRef.current !== null) return;
      setActive((a) => (a === null ? 0 : (a + 1) % FLOW.length));
    }, 2400);
    return () => window.clearInterval(id);
  }, [visible, hovered]);

  const setHover = (i: number | null) => {
    hoveredRef.current = i;
    setHovered(i);
  };

  // Hover / focus wins over the cycle; otherwise the cycled stage leads.
  const current = hovered ?? active;

  return (
    <section
      ref={sectionRef}
      aria-label="How Capex delivers"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--ink)] text-white"
    >
      {/* copper atmosphere — a faint heat behind the line, never competing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 18% 0%, color-mix(in oklab, var(--accent-display) 13%, transparent), transparent 70%), radial-gradient(40% 35% at 90% 100%, color-mix(in oklab, var(--accent-display) 7%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <p className="eyebrow-sans text-white/50">How Capex delivers</p>
            <p className="eyebrow-sans text-[10px] text-white/35">The turnkey scope</p>
          </div>
        </Reveal>

        {/* the flow — one line of large words, drawing itself then walking its stages */}
        <ol className="mt-14 flex flex-wrap items-baseline gap-x-[0.55em] gap-y-4 md:mt-16 md:gap-x-[0.4em]">
          {FLOW.map((f, i) => {
            const isActive = current !== null && current === i;
            const isDimmed = current !== null && current !== i;
            return (
              <li key={f.word} className="contents">
                <span
                  tabIndex={0}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className={`cursor-default rounded-sm font-display text-[11vw] font-normal leading-[1.02] tracking-[-0.02em] outline-none transition-all duration-500 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--accent-display)] md:text-[72px] lg:text-[92px] ${
                    entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  } ${
                    isActive
                      ? "text-white [text-shadow:0_0_36px_rgba(255,255,255,0.28)]"
                      : isDimmed
                        ? "text-white/30"
                        : "text-white/90"
                  }`}
                  style={entered ? undefined : { transitionDelay: `${120 + i * 130}ms` }}
                >
                  {f.word}
                </span>
                <span className="sr-only">
                  {f.note}. Stage {i + 1} of {FLOW.length}.
                </span>
                {i < FLOW.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`inline-block h-px origin-left self-center transition-all duration-700 md:w-[1.4em] lg:w-[2em] ${
                      entered ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                    } ${
                      current === null
                        ? "bg-[var(--accent-display)]/70"
                        : i < (current ?? 0)
                          ? "bg-[var(--accent-display)] shadow-[0_0_12px_var(--accent-display)]"
                          : "bg-white/15"
                    } w-[0.9em]`}
                    style={entered ? undefined : { transitionDelay: `${240 + i * 130}ms` }}
                  />
                )}
              </li>
            );
          })}
        </ol>

        {/* live stage readout — decorative; the record lives in the copy around it */}
        <div
          aria-hidden="true"
          className={`mt-10 flex min-h-[1.75rem] flex-wrap items-center gap-x-5 gap-y-2 transition-opacity duration-700 ${
            entered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
              current !== null
                ? "bg-[var(--accent-display)] shadow-[0_0_10px_var(--accent-display)]"
                : "bg-white/25"
            }`}
          />
          <p className="font-tech text-[11px] uppercase tracking-[0.22em] text-white/55">
            {current !== null
              ? `Stage ${String(current + 1).padStart(2, "0")} / ${String(FLOW.length).padStart(2, "0")} — ${FLOW[current].word} · ${FLOW[current].note}`
              : "Five stages — one accountable contract"}
          </p>
        </div>

        <Reveal delay={120}>
          <p className="mt-8 max-w-md text-sm leading-[1.8] text-white/60">
            The full scope under one accountable contract — engineered, supplied, installed, tested
            and commissioned by a single partner.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
