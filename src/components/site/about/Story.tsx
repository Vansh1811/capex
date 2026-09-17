import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { STORY } from "@/lib/about-content";

/**
 * Story (About): the company as an archive, held on deep espresso — the
 * dark register between the light process section and the sectors
 * transition. Chapters read as record entries: the mark (the date where
 * the record dates it — 2012, set in copper as the one dated fact; an
 * archival label where it does not — "Two practices"), a small label,
 * then the factual entry. On wide screens the plate column is held
 * sticky beside the register — the documented site record accompanying
 * the chapters as they scroll. No invented milestones, no invented
 * dates — the statutory line closes.
 */
export function Story() {
  const plate = STORY.plate;
  return (
    <section
      aria-label="Our story"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--ink)] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] survey-grid"
      />
      <div className="relative mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-36 lg:px-12 lg:py-44">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <p className="eyebrow-sans text-white/40">{STORY.eyebrow}</p>
            <p className="eyebrow-sans text-[10px] text-white/25">{STORY.note}</p>
          </div>
        </Reveal>

        {/* the register and the plate — record left, evidence held right */}
        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-9">
            {/* the register head — what this file holds */}
            <Reveal>
              <p className="font-tech text-[10px] uppercase tracking-[0.22em] text-white/30">
                The record · four entries
              </p>
            </Reveal>
            <div aria-hidden="true" className="mt-6 border-t border-white/10" />
            {STORY.chapters.map((c, i) => (
              <article
                key={c.mark}
                className="grid gap-6 border-b border-white/10 py-12 md:grid-cols-9 md:gap-10 md:py-16"
              >
                {/* the mark — dated where the record dates it */}
                <Reveal className="md:col-span-4">
                  <div className="flex items-baseline gap-5">
                    <span className="font-tech text-[11px] tracking-[0.1em] text-white/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`font-display text-[34px] font-normal leading-[1.04] tracking-[-0.025em] md:text-[44px] lg:text-[52px] ${
                        i === 0 ? "text-[var(--accent-display)]" : "text-white"
                      }`}
                    >
                      {c.mark}
                    </h3>
                  </div>
                  <p className="mt-3 pl-[38px] font-tech text-[10px] uppercase tracking-[0.22em] text-white/35">
                    {c.label}
                  </p>
                </Reveal>

                {/* the entry */}
                <Reveal delay={120} className="md:col-span-5">
                  <h4 className="font-display text-lg font-medium tracking-[-0.01em] text-white/85">
                    {c.title}
                  </h4>
                  <p className="mt-4 max-w-xl text-[15px] leading-[1.85] text-white/55">{c.body}</p>
                </Reveal>
              </article>
            ))}

            <Reveal delay={160}>
              <p className="mt-12 border-t border-white/10 pt-6 font-tech text-[10px] uppercase tracking-[0.2em] text-white/40 md:mt-16">
                {STORY.statutory}
              </p>
              <p
                aria-hidden="true"
                className="mt-2 font-tech text-[9px] uppercase tracking-[0.22em] text-white/20"
              >
                · · End of file · ·
              </p>
            </Reveal>
          </div>

          {/* the plate — the documented site record, held beside the register */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <ClipReveal edge="right" ratio="4 / 5" delay={200}>
                <img
                  src={plate.src}
                  alt={plate.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </ClipReveal>
              <Reveal delay={280}>
                <p className="mt-4 font-tech text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/40">
                  {plate.caption}
                </p>
                <div
                  aria-hidden="true"
                  className="mt-6 hidden h-px w-16 bg-[var(--accent)]/50 lg:block"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
