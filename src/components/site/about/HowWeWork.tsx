import { Reveal } from "@/components/site/home/Reveal";
import { DELIVERY } from "@/lib/about-content";

/**
 * HowWeWork (About): the common operating model between the two
 * practices — a vertical editorial progression on ivory, each verb held
 * by a hairline. The six verbs merge the two source formulations (DOC A
 * p4 "engineering, procurement, execution, testing, commissioning and
 * final handover" + the SITC contract language "supply, installation,
 * testing & commissioning") without inventing a stage. Pure typography
 * and one line — no cards, no diagram.
 */
export function HowWeWork() {
  return (
    <section
      aria-label="How the work moves"
      data-tone="light"
      className="paper relative text-foreground"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <p className="eyebrow-sans text-muted-foreground">{DELIVERY.eyebrow}</p>
            <p className="eyebrow-sans text-[10px] text-muted-foreground/60">{DELIVERY.note}</p>
          </div>
        </Reveal>

        <ol className="relative mt-16 md:mt-24">
          {/* the connective hairline — one continuous line down the progression */}
          <div
            aria-hidden="true"
            className="absolute bottom-4 left-0 top-4 w-px bg-[var(--accent)]/40 md:bottom-8 md:top-8"
          />
          {DELIVERY.steps.map((s, i) => (
            <li
              key={s.word}
              className="relative grid gap-3 pl-8 md:grid-cols-12 md:gap-10 md:pl-12"
            >
              {/* the node — where the line and the word meet */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-[0.9em] hidden h-px w-6 bg-[var(--accent)] md:block"
              />
              <Reveal className="md:col-span-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-tech text-[11px] tracking-[0.1em] text-foreground/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[34px] font-normal leading-[1.02] tracking-[-0.02em] md:text-[48px]">
                    {s.word}
                  </h3>
                </div>
              </Reveal>
              <Reveal delay={120} className="md:col-span-6 md:col-start-6 md:pb-10 md:pt-3">
                <p className="max-w-md text-[15px] leading-[1.8] text-muted-foreground">{s.note}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
