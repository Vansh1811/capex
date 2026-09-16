import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { MANIFESTO } from "@/lib/about-content";

/**
 * Manifesto (About): the first idea, set in type on ivory — the typography
 * IS the visual. Two statements separated by a breath of scroll, then one
 * concise factual paragraph from the company description. The margin print
 * is a REAL Capex photograph (sub-station erection, from the profile's own
 * "About Capex" page) — documentary evidence placed the way a plate sits
 * in a book, not decoration.
 */
export function Manifesto() {
  const plate = MANIFESTO.marginPlate;
  return (
    <section
      aria-label="What we build"
      data-tone="light"
      className="paper relative text-foreground"
    >
      {/* statement one — what people see */}
      <div className="mx-auto max-w-[1680px] px-6 pt-28 md:px-10 md:pt-40 lg:px-12 lg:pt-48">
        <div className="grid items-end gap-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="eyebrow-sans text-muted-foreground">{MANIFESTO.eyebrow}</p>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-10 max-w-[14ch] text-balance font-display text-[42px] font-normal leading-[1.06] tracking-[-0.025em] md:text-[64px] lg:text-[80px]">
                {MANIFESTO.statementOne}
              </h2>
            </Reveal>
          </div>
          {/* the margin print — real Capex documentary plate */}
          <div className="lg:col-span-4 lg:pb-2">
            <Reveal delay={240}>
              <ClipReveal edge="right" ratio="4 / 5" delay={120}>
                <img
                  src={plate.src}
                  alt={plate.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </ClipReveal>
              <p className="mt-4 font-tech text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground/70">
                {plate.caption}
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* statement two — what we build, a breath below */}
      <div className="mx-auto max-w-[1680px] px-6 pb-28 pt-32 md:px-10 md:pb-40 md:pt-48 lg:px-12 lg:pb-48 lg:pt-56">
        <div className="lg:pl-[8.33%]">
          <Reveal>
            <h3 className="max-w-[15ch] text-balance font-display text-[42px] font-normal leading-[1.06] tracking-[-0.025em] md:text-[64px] lg:text-[80px]">
              {MANIFESTO.statementTwo}
            </h3>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-12 max-w-lg text-[15px] leading-[1.8] text-muted-foreground">
              {MANIFESTO.body}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
