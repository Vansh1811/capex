import { Reveal } from "./Reveal";
import { ClipReveal } from "./ClipReveal";
import homepageAImg from "@/assets/homepage-a-img.png";

/**
 * Manifesto (final): the reveal of the idea, staged as a sequence — the
 * statement establishes first, large and quiet on ivory; then, on scroll,
 * a SUBSTANTIAL image (the full five-column field, portrait, tall enough
 * that its unblinding is unmistakable) enters from the right and settles
 * into its crop; its small metadata arrives alongside; the supporting
 * line closes the moment before the dark world begins. A print placed on
 * the page — never full-bleed, never a thumbnail.
 */
export function Manifesto() {
  return (
    <section
      aria-label="Positioning"
      data-tone="light"
      className="paper relative overflow-hidden text-foreground"
    >
      <div className="mx-auto grid max-w-[1680px] gap-14 px-6 py-28 md:px-10 md:py-40 lg:grid-cols-12 lg:gap-10 lg:py-56">
        {/* the statement — establishes first, owns the left column */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow-sans text-muted-foreground">
              Capex Construction &amp; Engineering
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="mt-10 max-w-[15ch] text-balance font-display text-[38px] font-normal leading-[1.1] tracking-[-0.02em] md:text-[56px] lg:text-[64px]">
              What keeps a place working is rarely{" "}
              <span className="italic text-foreground/45">what you see.</span>
            </h2>
          </Reveal>
          {/* the context line arrives last, after the image has settled */}
          <Reveal delay={480}>
            <p className="mt-10 max-w-md text-[15px] leading-[1.8] text-muted-foreground">
              Cable under the street. Gas through the network. Air through the plant. Water at
              pressure where a fire starts. Capex engineers the systems a building or a city runs
              on.
            </p>
          </Reveal>
        </div>

        {/* the image — the substantial visual object of the scene: the full
            five-column field in portrait, unblinding from the right */}
        <div className="lg:col-span-5">
          <figure>
            <ClipReveal edge="right" ratio="3 / 4" delay={160} className="w-full">
              <img
                src={homepageAImg}
                alt="Building plant room with HVAC ducting, fire-fighting pipework, electrical panels and pumps — atmospheric reference imagery, not a documented Capex project"
                loading="lazy"
                className="h-full w-full object-cover [filter:saturate(0.88)_contrast(0.98)]"
              />
            </ClipReveal>
            <Reveal delay={400}>
              <figcaption className="mt-4 flex items-baseline justify-between gap-6">
                <span className="text-[11px] leading-relaxed text-muted-foreground">
                  HT/LT networks · city gas · HVAC · fire — the layer beneath the visible.
                </span>
                <span className="shrink-0 font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                  Fig. 01
                </span>
              </figcaption>
            </Reveal>
          </figure>
        </div>
      </div>
    </section>
  );
}
