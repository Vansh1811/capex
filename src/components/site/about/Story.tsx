import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { STORY } from "@/lib/about-content";

/**
 * Story (About): an editorial company archive, not a marketing timeline.
 * Large chapter marks, small factual notes, real whitespace between
 * chapters. Only the documented record: incorporation 26 December 2012 at
 * Kanpur; the two practices and the turnkey SITC model; the Noida base
 * with branches and the Rajasthan manufacturing unit; documented
 * programmes. No invented dates — milestones the PDFs do not date are
 * presented undated, as chapters. The final chapter closes with a
 * marginal documentary print from the site record.
 */
export function Story() {
  const plate = STORY.plate;
  return (
    <section aria-label="Our story" data-tone="light" className="paper relative text-foreground">
      <div className="mx-auto max-w-[1440px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <p className="eyebrow-sans text-muted-foreground">{STORY.eyebrow}</p>
            <p className="eyebrow-sans text-[10px] text-muted-foreground/60">{STORY.note}</p>
          </div>
        </Reveal>

        <div className="mt-16 md:mt-24">
          {STORY.chapters.map((c, i) => (
            <div
              key={c.mark}
              className={`grid gap-6 md:grid-cols-12 md:gap-10 ${i > 0 ? "mt-24 md:mt-32" : ""}`}
            >
              <Reveal className="md:col-span-4">
                <h3 className="font-display text-[38px] font-normal leading-[1.04] tracking-[-0.025em] text-foreground md:text-[52px] lg:text-[64px]">
                  {c.mark}
                </h3>
                <p className="mt-3 font-tech text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
                  {c.title}
                </p>
              </Reveal>
              <Reveal delay={120} className="md:col-span-7 md:col-start-6">
                <p className="max-w-xl text-[15px] leading-[1.85] text-muted-foreground">
                  {c.body}
                </p>
                {/* the last chapter closes with a marginal print from the
                    documented site record — an archival footnote, real Capex work */}
                {i === STORY.chapters.length - 1 && (
                  <figure className="mt-14 max-w-[320px] md:max-w-[380px]">
                    <ClipReveal edge="right" ratio="4 / 3" delay={260}>
                      <img
                        src={plate.src}
                        alt={plate.alt}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </ClipReveal>
                    <figcaption className="mt-4 font-tech text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground/70">
                      {plate.caption}
                    </figcaption>
                  </figure>
                )}
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal delay={160}>
          <p className="mt-20 border-t border-border pt-6 font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 md:mt-28">
            {STORY.statutory}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
