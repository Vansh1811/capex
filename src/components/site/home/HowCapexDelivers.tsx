import { Reveal } from "./Reveal";

/**
 * How Capex Delivers (V3.1): one typographic proof moment — not a process
 * diagram, not six cards. The five verbs of the verified delivery scope
 * (engineering; supply, installation, testing, commissioning — the
 * company's documented turnkey contract language) rise progressively as
 * the scene enters, held together by "under one accountable contract."
 * Charcoal ground, copper only as the connective hairline; the words set
 * font-normal so the flow reads as one engineered line, not a headline.
 */
const FLOW = [
  { word: "Engineer", note: "Design & engineering" },
  { word: "Supply", note: "Procurement & supply" },
  { word: "Install", note: "Installation" },
  { word: "Test", note: "Testing" },
  { word: "Commission", note: "Commissioning" },
] as const;

export function HowCapexDelivers() {
  return (
    <section
      aria-label="How Capex delivers"
      data-tone="dark"
      className="relative bg-[var(--ink)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <p className="eyebrow-sans text-white/50">How Capex delivers</p>
            <p className="eyebrow-sans text-[10px] text-white/35">The turnkey scope</p>
          </div>
        </Reveal>

        {/* the flow — one line of large words, arriving left to right */}
        <Reveal delay={100}>
          <ol className="mt-14 flex flex-wrap items-baseline gap-x-[0.55em] gap-y-4 md:mt-16 md:gap-x-[0.4em]">
            {FLOW.map((f, i) => (
              <li key={f.word} className="flex items-baseline">
                <span
                  className="rise-line font-display text-[11vw] font-normal leading-[1.02] tracking-[-0.02em] text-white/90 md:text-[72px] lg:text-[92px]"
                  style={{ animationDelay: `${140 + i * 130}ms` }}
                >
                  {f.word}
                </span>
                {i < FLOW.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="mx-[0.45em] inline-block h-px w-[0.9em] self-center bg-[var(--accent-display)]/70 md:w-[1.4em] lg:w-[2em]"
                  />
                )}
                <span className="sr-only">{f.note}.</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={380}>
          <p className="mt-12 max-w-md text-sm leading-[1.8] text-white/60">
            The full scope under one accountable contract — engineered, supplied, installed, tested
            and commissioned by a single partner.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
