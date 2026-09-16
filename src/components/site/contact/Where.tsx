import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/home/Reveal";
import type { ContactOffice } from "@/lib/site-data";

/**
 * Where (Contact): the geographic field — locations as a quiet typographic
 * index on warm stone, not a map embed. Only verified office cities and
 * their documented roles render (addresses are gated pending client review,
 * so none are shown). Hovering/focusing a place lifts it; on wide screens a
 * hairline latitude-style rule marks the selected place — an architectural
 * drawing's table, not a UI diagram. The OPEN LINE itself (visitor →
 * conversation → engineering → project) runs beneath as the page's motif:
 * a thin rule that draws itself downward with scroll, carrying the words of
 * the journey in small type. Under reduced motion everything renders at rest.
 */
const LINE_STATIONS = [
  { word: "Visitor", note: "you, here" },
  { word: "Conversation", note: "the first call" },
  { word: "Practice", note: "the right people" },
  { word: "Engineering", note: "the work, planned" },
  { word: "Project", note: "delivered" },
];

export function Where({ offices }: { offices: ContactOffice[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(0); // 0..1 — how far the line has drawn

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // draw as the block travels from just-below-view to half-past-center
      const progress = (vh * 0.9 - rect.top) / (vh * 0.9);
      setDrawn(Math.min(1, Math.max(0, progress)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      aria-label="Where Capex works from"
      data-tone="stone"
      className="relative bg-[var(--muted)] text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-36 lg:px-12 lg:py-44">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-[10vw] font-normal leading-[1.02] tracking-[-0.02em] sm:text-[7vw] lg:text-[min(4.8vw,72px)]">
              Where we are.
            </h2>
            <p className="eyebrow-sans text-muted-foreground/70">From the company record</p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-12 lg:gap-10">
          {/* the index of places */}
          <div className="lg:col-span-7">
            {offices.map((o, i) => (
              <Reveal key={o.city} delay={Math.min(i * 60, 240)}>
                <button
                  type="button"
                  onMouseEnter={() => setSelected(o.city)}
                  onFocus={() => setSelected(o.city)}
                  onClick={() => setSelected(selected === o.city ? null : o.city)}
                  aria-pressed={selected === o.city}
                  className="group flex w-full items-baseline justify-between gap-4 border-b border-foreground/15 py-6 text-left transition-colors md:py-8"
                >
                  <span
                    className={`font-display text-[8.5vw] font-normal leading-[1] tracking-[-0.02em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:text-[52px] lg:text-[64px] ${
                      selected === o.city
                        ? "translate-x-2 text-foreground"
                        : "text-foreground/75 group-hover:text-foreground"
                    }`}
                  >
                    {o.city}
                  </span>
                  <span
                    className={`shrink-0 font-tech text-[10px] uppercase tracking-[0.22em] transition-colors duration-500 ${
                      selected === o.city ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {o.role}
                  </span>
                </button>
              </Reveal>
            ))}
            <Reveal delay={280}>
              <p className="mt-10 max-w-md text-[13px] leading-[1.8] text-muted-foreground">
                Project reach across India and Nepal. Office addresses are shared on request.
              </p>
            </Reveal>
          </div>

          {/* the open line — the motif, an architectural section drawing */}
          <Reveal delay={140} className="lg:col-span-5">
            <div ref={lineRef} className="relative mt-2 lg:mt-0 lg:pl-10">
              <p className="eyebrow-sans text-muted-foreground/70">The open line</p>
              {/* the rule that draws with scroll */}
              <div
                className="absolute bottom-6 left-0 top-14 w-px bg-foreground/12 md:left-2"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-6 left-0 top-14 w-px origin-top bg-foreground/60 md:left-2"
                style={{ transform: `scaleY(${drawn})` }}
                aria-hidden="true"
              />
              <ol className="relative mt-6 space-y-10 md:space-y-12 lg:space-y-14">
                {LINE_STATIONS.map((s, i) => {
                  const reached = drawn >= (i + 1) / (LINE_STATIONS.length + 1);
                  return (
                    <li key={s.word} className="relative pl-8 md:pl-10">
                      <span
                        aria-hidden="true"
                        className={`absolute -left-[4.5px] top-[7px] h-[9px] w-[9px] rounded-full border transition-colors duration-700 md:-left-[2.5px] ${
                          reached
                            ? "border-foreground bg-foreground"
                            : "border-foreground/40 bg-[var(--muted)]"
                        }`}
                      />
                      <p
                        className={`font-display text-xl font-normal tracking-[-0.01em] transition-opacity duration-700 md:text-2xl ${
                          reached ? "text-foreground opacity-100" : "text-foreground/45"
                        }`}
                      >
                        {s.word}
                      </p>
                      <p
                        className={`mt-1 font-tech text-[10px] tracking-[0.14em] text-muted-foreground transition-opacity duration-700 ${
                          reached ? "opacity-90" : "opacity-40"
                        }`}
                      >
                        {s.note}
                      </p>
                    </li>
                  );
                })}
              </ol>
              <p className="relative mt-10 max-w-[26ch] pl-8 text-[13px] leading-[1.8] text-muted-foreground md:pl-10">
                From a first conversation to a working system — how every Capex engagement travels.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
