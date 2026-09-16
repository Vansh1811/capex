import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/home/Reveal";

/**
 * THE ENGINEERING LINE — the delivery interruption. A dark room holds the
 * visual interruption (supply vs. delivery), then the verified turnkey
 * sequence draws itself along one continuous hairline as the visitor
 * scrolls: stages reveal progressively, the drawn portion of the line
 * carries a copper tone, and the stage nearest the reader gains contrast.
 * The composition stays fully readable without animation (the full line
 * renders; scroll only lights it). On small screens the line turns
 * vertical and draws downward. Reduced motion: everything renders lit.
 */

/** The verified delivery sequence — the documented turnkey scope of the
 *  Capex contract (engineering practice + supply, installation, testing &
 *  commissioning), compressed with the same wording the homepage's
 *  HowCapexDelivers carries. No invented stages. */
const STAGES = [
  { word: "Understand", note: "The brief, the site, the constraint" },
  { word: "Engineer", note: "Design & engineering" },
  { word: "Supply", note: "Procurement & supply" },
  { word: "Install", note: "Installation" },
  { word: "Test", note: "Testing" },
  { word: "Commission", note: "Commissioning & handover" },
] as const;

export function DeliveryLine() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = lineRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 when the line's top reaches the lower third; 1 once it clears it
        const p = (vh * 0.72 - rect.top) / Math.max(rect.height + vh * 0.28, 1);
        setProgress(Math.min(1, Math.max(0, p)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeStage = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length + 0.0001));

  return (
    <section
      ref={sectionRef}
      aria-label="The delivery line — the turnkey scope"
      data-tone="dark"
      className="relative bg-[var(--ink)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        {/* the interruption */}
        <Reveal>
          <p className="eyebrow-sans text-white/50">The engineering line</p>
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <Reveal delay={80} className="lg:col-span-6">
            <h2 className="font-display text-[10.5vw] font-normal leading-[1.04] tracking-[-0.025em] text-white/90 sm:text-[8vw] lg:text-[min(4.8vw,76px)]">
              We don&rsquo;t just supply systems.
            </h2>
          </Reveal>
          <Reveal delay={200} className="lg:col-span-6 lg:pt-4">
            <h2 className="font-display text-[10.5vw] font-normal leading-[1.04] tracking-[-0.025em] sm:text-[8vw] lg:text-[min(4.8vw,76px)]">
              <span className="text-white/90">We take them</span>{" "}
              <span className="text-[var(--accent-display)]">through delivery.</span>
            </h2>
          </Reveal>
        </div>

        {/* the line — horizontal at lg+, vertical on small screens */}
        <div ref={lineRef} className="relative mt-24 md:mt-32">
          {/* the ground hairline — always fully rendered (readable without
              animation); the lit portion overlays it as the visitor scrolls */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 hidden h-px w-full bg-white/15 lg:block"
          />
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 hidden h-[2px] bg-[var(--accent-display)] transition-[width] duration-700 ease-out lg:block"
            style={{ width: `${progress * 100}%` }}
          />
          <div
            aria-hidden="true"
            className="absolute left-[7px] top-[7px] bottom-7 w-px bg-white/15 lg:hidden"
          />
          <div
            aria-hidden="true"
            className="absolute left-[6px] top-[7px] w-[3px] bg-[var(--accent-display)] transition-[height] duration-700 ease-out lg:hidden"
            style={{ height: `calc(${progress * 100}% - ${(progress * 28) | 0}px)` }}
          />

          <ol className="relative grid gap-0 lg:grid-cols-6" aria-label="The delivery sequence">
            {STAGES.map((s, i) => {
              const lit = i <= activeStage;
              const current = i === activeStage;
              return (
                <li
                  key={s.word}
                  className="relative pl-10 pb-12 lg:pb-0 lg:pl-0 lg:pt-16"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {/* the node */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-[7px] h-[15px] w-[15px] rounded-full border transition-colors duration-500 lg:left-0 lg:-top-[8px] lg:translate-x-0 ${
                      lit
                        ? "border-[var(--accent-display)] bg-[var(--ink)]"
                        : "border-white/30 bg-[var(--ink)]"
                    }`}
                  >
                    <span
                      className={`absolute inset-[4px] rounded-full transition-colors duration-500 ${
                        current
                          ? "bg-[var(--accent-display)]"
                          : lit
                            ? "bg-white/40"
                            : "bg-transparent"
                      }`}
                    />
                  </span>
                  <div className="lg:pr-8">
                    <p
                      className={`font-tech text-[11px] tracking-[0.08em] transition-colors duration-500 ${
                        lit ? "text-white/70" : "text-white/45"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p
                      className={`mt-2 font-display text-[28px] font-normal leading-[1.02] tracking-[-0.02em] transition-colors duration-500 md:text-[34px] lg:text-[30px] xl:text-[34px] ${
                        lit ? "text-white" : "text-white/55"
                      }`}
                    >
                      {s.word}
                    </p>
                    <p
                      className={`mt-2 text-xs leading-relaxed transition-colors duration-500 ${
                        lit ? "text-white/55" : "text-white/40"
                      }`}
                    >
                      {s.note}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal delay={200}>
          <p className="mt-14 max-w-md text-sm leading-[1.8] text-white/55">
            The full scope under one accountable contract — each stage carried by the same partner,
            from the first site reading to the handover certificate.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
