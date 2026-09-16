import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { THE_RECORD } from "@/lib/about-content";

/**
 * TheRecord (About): the bridge into the Projects experience — NOT a
 * second archive. One WTT flagship plate (the strongest documented
 * photograph, captioned in the profile), then a restrained typographic
 * index of six verified records with their documented scope figures,
 * each row linking to its project detail. Completed/ongoing status comes
 * from the authoritative project corpus via the content file.
 */
export function TheRecord() {
  const plate = THE_RECORD.plate;
  return (
    <section
      aria-label="The record"
      data-tone="dark"
      className="relative bg-[var(--ink)] text-white"
    >
      {/* the flagship plate — wide, quiet */}
      <div className="mx-auto max-w-[1680px] px-6 pt-28 md:px-10 md:pt-40 lg:px-12 lg:pt-48">
        <Reveal>
          <p className="eyebrow-sans text-white/50">{THE_RECORD.eyebrow}</p>
        </Reveal>
        <div className="relative mt-14 md:mt-16">
          <ClipReveal edge="left" ratio="21 / 9" innerClassName="relative">
            <img
              src={plate.src}
              alt={plate.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-6 pb-6 pt-24 md:px-10 md:pb-10">
              <span className="font-display text-[7vw] font-normal leading-[1.05] tracking-[-0.015em] md:text-[48px] lg:text-[72px]">
                4,000 TR
              </span>
              <span className="pb-1 font-tech text-[10px] uppercase tracking-[0.24em] text-white/90 md:pb-3">
                World Trade Tower, Noida · largest single HVAC installation
              </span>
            </div>
          </ClipReveal>
          <Reveal delay={300}>
            <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-white/45">
              {plate.caption}
            </p>
          </Reveal>
        </div>
      </div>

      {/* the restrained index — six verified records, handoff to Projects */}
      <div className="mx-auto max-w-[1680px] px-6 pb-28 pt-20 md:px-10 md:pb-40 lg:px-12 lg:pt-28">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <h2 className="max-w-[16ch] text-balance font-display text-[42px] font-normal leading-[1.05] tracking-[-0.025em] md:text-[64px] lg:text-[80px]">
              {THE_RECORD.headline}
            </h2>
            <p className="max-w-xs text-sm leading-[1.8] text-white/55">{THE_RECORD.intro}</p>
          </div>
        </Reveal>

        <div className="mt-14 md:mt-20">
          {THE_RECORD.entries.map((e, i) => (
            <Reveal key={e.slug} delay={Math.min(i * 60, 300)}>
              <Link
                to="/projects/$slug"
                params={{ slug: e.slug }}
                className="group grid grid-cols-12 items-baseline gap-4 border-b border-white/10 py-5 transition-colors hover:border-white/30 md:py-6"
              >
                <span className="col-span-2 font-tech text-[11px] tracking-[0.1em] text-white/35 md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-10 font-display text-[22px] font-normal leading-[1.1] tracking-[-0.01em] text-white/90 transition-colors group-hover:text-white md:col-span-5 md:text-[30px]">
                  {e.name}
                </span>
                <span className="col-span-10 col-start-3 font-tech text-[10px] uppercase tracking-[0.18em] text-white/50 md:col-span-4 md:col-start-7 md:text-right">
                  {e.detail}
                </span>
                <span
                  aria-hidden="true"
                  className="col-span-1 hidden text-lg text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white md:block"
                >
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={260}>
          <Link
            to="/projects"
            className="group mt-14 inline-flex items-center gap-4 border-b border-white/50 pb-3 transition-colors hover:border-white"
          >
            <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
              Explore projects
            </span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
