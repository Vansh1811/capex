import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { RANGE } from "@/lib/about-content";

/**
 * Range (About): the range of environments Capex serves — one concise
 * source-supported statement, one real field-work plate, then the handoff.
 * The sector catalogue belongs to the Sectors page; About only opens the
 * door. Split composition: the words set against a half-bleed image on
 * the left margin, the EXPLORE SECTORS line closing.
 */
export function Range() {
  const plate = RANGE.plate;
  return (
    <section
      aria-label="The range of work"
      data-tone="light"
      className="paper relative text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* the plate — half the frame, entering from the left */}
          <div className="lg:col-span-6">
            <ClipReveal edge="left" ratio="4 / 3">
              <img
                src={plate.src}
                alt={plate.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </ClipReveal>
            <Reveal delay={220}>
              <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                {plate.caption}
              </p>
            </Reveal>
          </div>

          {/* the words */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow-sans text-muted-foreground">{RANGE.eyebrow}</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-10 max-w-[14ch] text-balance font-display text-[42px] font-normal leading-[1.05] tracking-[-0.025em] md:text-[64px] lg:text-[80px]">
                {RANGE.headline}
              </h2>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-10 max-w-md text-[15px] leading-[1.8] text-muted-foreground">
                {RANGE.body}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <Link
                to="/sectors"
                className="group mt-12 inline-flex items-center gap-4 border-b border-border pb-3 transition-colors hover:border-foreground"
              >
                <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
                  Explore sectors
                </span>
                <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
                  →
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
