import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/home/Reveal";

/**
 * THE ENGINEERING LINE — compact. The verified turnkey sequence draws
 * itself along one continuous hairline as the visitor scrolls:
 * Engineer → Procure → Execute → Test → Commission → Handover, each
 * stage carried by wording the company record already uses. Beneath the
 * line sits the testing & commissioning register — the 10 verified T&C
 * scopes (DOC A p15 / DOC B p6), a compact technical index rather than
 * marketing copy. The composition stays fully readable without
 * animation (the full line renders; scroll only lights it). On small
 * screens the line turns vertical and draws downward. Reduced motion:
 * everything renders lit.
 */

/** The verified delivery sequence — design & engineering, procurement &
 *  supply, installation, testing, commissioning, final handover: the
 *  documented turnkey scope of the Capex contract (DOC A §2-3 / DOC B),
 *  compressed with the same wording the homepage's HowCapexDelivers
 *  carries. No invented stages. */
const STAGES = [
  { word: "Engineer", note: "Design & engineering" },
  { word: "Procure", note: "Procurement & supply" },
  { word: "Execute", note: "Installation" },
  { word: "Test", note: "Testing" },
  { word: "Commission", note: "Commissioning" },
  { word: "Handover", note: "Final handover" },
] as const;

export function DeliveryLine({ commissioning }: { commissioning: string[] }) {
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
      id="delivery"
      aria-label="The delivery line — the turnkey scope and its testing & commissioning register"
      data-tone="dark"
      className="relative scroll-mt-24 bg-[var(--ink)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-32 lg:px-12">
        {/* the interruption — one compact statement */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow-sans text-white/50">The engineering line</p>
            <h2 className="mt-6 font-display text-[8vw] font-normal leading-[1.08] tracking-[-0.025em] text-white/90 sm:text-[6vw] lg:text-[min(4vw,60px)]">
              We don&rsquo;t just supply systems.{" "}
              <span className="text-[var(--accent-display)]">We take them through delivery.</span>
            </h2>
          </Reveal>
          <Reveal delay={140} className="lg:col-span-5">
            <p className="max-w-md text-sm leading-[1.8] text-white/55">
              The full scope under one accountable contract — each stage carried by the same
              partner, from the first site reading to the handover certificate.
            </p>
          </Reveal>
        </div>

        {/* the line — horizontal at lg+, vertical on small screens */}
        <div ref={lineRef} className="relative mt-16 md:mt-20">
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
                  className="relative pl-10 pb-10 lg:pb-0 lg:pl-0 lg:pt-14"
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
                      className={`mt-2 font-display text-[24px] font-normal leading-[1.02] tracking-[-0.02em] transition-colors duration-500 md:text-[28px] lg:text-[24px] xl:text-[28px] ${
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

        {/* the testing & commissioning register — the verified scopes,
            rendered as a technical index, never paraphrased */}
        <Reveal delay={200}>
          <div className="mt-14 border-t border-white/15 pt-8">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <p className="eyebrow-sans text-white/50">Testing &amp; commissioning register</p>
              <span aria-hidden="true" className="hidden h-px flex-1 bg-white/10 sm:block" />
              <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-white/40">
                {commissioning.length} scopes
              </span>
            </div>
            <ul
              aria-label="Verified testing & commissioning scopes"
              className="mt-5 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            >
              {commissioning.map((c, i) => (
                <li key={c} className="flex items-baseline gap-3 border-b border-white/10 py-3">
                  <span className="font-tech text-[10px] tracking-[0.1em] text-white/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[13px] leading-snug text-white/75">{c}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-tech text-[10px] uppercase leading-[1.8] tracking-[0.18em] text-white/35">
              T&amp;C scope from company records — DOC A p15 / DOC B p6
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
