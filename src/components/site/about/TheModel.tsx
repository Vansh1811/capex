import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { THE_MODEL } from "@/lib/about-content";

/**
 * TheModel (About): what the company actually IS — the nature of Capex,
 * stated in the profile's own scope language: engineering, procurement,
 * execution, testing, commissioning (DOC A p4). A wide cinematic band: the
 * five words set as one engineered line across a real sub-station
 * construction plate, the positioning sentence beneath. Deliberately NOT
 * a service list — the taxonomy belongs to Capabilities.
 */
export function TheModel() {
  const plate = THE_MODEL.plate;
  return (
    <section
      aria-label="The Capex model"
      data-tone="dark"
      className="relative bg-[var(--ink)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <p className="eyebrow-sans text-white/50">{THE_MODEL.eyebrow}</p>
            <p className="eyebrow-sans text-[10px] text-white/35">The turnkey scope</p>
          </div>
        </Reveal>

        {/* the wide documentary band — real sub-station construction */}
        <div className="relative mt-16 md:mt-20">
          <ClipReveal edge="left" ratio="21 / 9" innerClassName="relative">
            <img
              src={plate.src}
              alt={plate.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            {/* the five words, set into the frame on the engineered ground */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-6 pb-6 pt-24 md:px-10 md:pb-10">
              <ol className="flex flex-wrap items-baseline gap-x-[0.5em] gap-y-2">
                {THE_MODEL.words.map((w, i) => (
                  <li key={w} className="flex items-baseline">
                    <span className="font-display text-[7vw] font-normal leading-[1.05] tracking-[-0.015em] text-white md:text-[44px] lg:text-[64px]">
                      {w}
                    </span>
                    {i < THE_MODEL.words.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="mx-[0.4em] inline-block h-px w-[0.8em] self-center bg-[var(--accent-display)]/80"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </ClipReveal>
          <Reveal delay={300}>
            <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-white/45">
              {plate.caption}
            </p>
          </Reveal>
        </div>

        {/* the positioning sentence — what Capex is and is not */}
        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-6 lg:col-start-4">
            <p className="max-w-xl text-[15px] leading-[1.85] text-white/65 md:text-base">
              {THE_MODEL.body}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
