import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { TWO_WORLDS } from "@/lib/about-content";

/**
 * TwoWorlds (About): the narrative the page turns on. The words carry the
 * section — what people see, then, quieter, what we actually build — and
 * the large image field opens HERE, on the right: the city-gas works at a
 * street cut. The hero's inset plate above deliberately does not
 * compete (framed vs. full-height field). No practice taxonomy, no
 * capability links — that content lives on Capabilities; this section is
 * the idea, not the catalogue.
 */
export function TwoWorlds() {
  const plate = TWO_WORLDS.plate;
  return (
    <section
      aria-label="The engineered world"
      data-tone="light"
      className="paper relative text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-36 lg:px-12 lg:py-44">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* the words */}
          <div className="order-2 lg:order-1 lg:col-span-6 lg:pr-10">
            <Reveal>
              <p className="eyebrow-sans text-muted-foreground">{TWO_WORLDS.eyebrow}</p>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-12 max-w-[13ch] font-display text-[10.5vw] font-normal leading-[1.02] tracking-[-0.028em] sm:text-[7.5vw] lg:text-[min(4.3vw,74px)]">
                {TWO_WORLDS.statementOne}
              </h2>
            </Reveal>
            <Reveal delay={170}>
              <p className="mt-3 max-w-[18ch] font-display text-[10.5vw] font-normal leading-[1.02] tracking-[-0.028em] text-foreground/35 sm:text-[7.5vw] lg:text-[min(4.3vw,74px)]">
                {TWO_WORLDS.statementTwo}
              </p>
            </Reveal>
            <Reveal delay={250}>
              <p className="mt-12 max-w-md text-[15px] leading-[1.8] text-muted-foreground">
                {TWO_WORLDS.body}
              </p>
            </Reveal>
          </div>

          {/* the image field — the visual record begins at this section */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <ClipReveal edge="left" ratio="4 / 5" delay={120}>
              <img
                src={plate.src}
                alt={plate.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </ClipReveal>
            <Reveal delay={280}>
              <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                {plate.caption}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
