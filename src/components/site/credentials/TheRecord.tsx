import { Reveal } from "@/components/site/home/Reveal";
import type { RegisterMilestone } from "@/lib/site-data";

/**
 * THE RECORD (Credentials): a restrained timeline built only from the
 * register's own documented dates — incorporation 2012, the 2018 GST
 * registrations and ESI, the 2021 Udyam and Maharashtra GST. A vertical
 * hairline with mono year markers; each milestone a note on the record.
 * No invented milestones; where dates cluster (2018, 2021) the entries
 * share their year honestly.
 */
export function TheRecord({ milestones }: { milestones: RegisterMilestone[] }) {
  return (
    <section
      aria-label="The record — dated milestones"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--brand)] text-white"
    >
      <div
        aria-hidden="true"
        className="survey-grid pointer-events-none absolute inset-0 opacity-[0.18]"
      />
      <div className="relative mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-12 lg:py-40">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="eyebrow-sans text-white/45">The record</p>
            <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-white/35">
              Dates as documented
            </p>
          </div>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="mt-8 max-w-[16ch] font-display text-[10.5vw] font-normal leading-[1.02] tracking-[-0.025em] text-white sm:text-[8vw] lg:text-[min(5.4vw,84px)]">
            The record.
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-8 max-w-md text-sm leading-[1.85] text-white/60 md:text-[15px]">
            Fourteen years of registrations, each dated by the certificates that establish it.
          </p>
        </Reveal>

        <div className="relative mt-16 md:mt-24">
          {/* the vertical rule */}
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-[3px] top-2 w-px bg-white/20 md:left-[calc(8rem+3px)]"
          />
          <ol role="list" className="space-y-0">
            {milestones.map((m, i) => (
              <li key={`${m.year}-${m.label}`} role="listitem">
                <Reveal delay={Math.min(i * 110, 550)}>
                  <div className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-6 border-b border-white/12 py-8 pl-6 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-x-10 md:py-10 md:pl-14">
                    {/* node */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-11 flex h-[7px] w-[7px] items-center justify-center md:left-[calc(8rem-2px)]"
                    >
                      <span className="h-[7px] w-[7px] rotate-45 border border-white/50 bg-[var(--brand)]" />
                    </span>
                    <p className="font-tech text-sm tracking-[0.1em] text-white/70 md:text-base">
                      {m.year}
                    </p>
                    <div className="max-w-xl">
                      <h3 className="font-display text-2xl font-normal tracking-[-0.015em] text-white md:text-3xl">
                        {m.label}
                      </h3>
                      <p className="mt-3 text-sm leading-[1.8] text-white/60 md:text-[15px]">
                        {m.note}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
