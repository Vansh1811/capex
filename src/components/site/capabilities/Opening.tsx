import { Link } from "@tanstack/react-router";
import { useEntrance } from "@/components/site/home/HeroVideo";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { ReferenceNote } from "@/components/site/capabilities/CapabilitiesExperience";

/**
 * Opening (Capabilities): the threshold into the engine room — deep earth,
 * almost black, the survey grid of the underground, one strong idea. Where
 * About's opening is purely typographic, this one carries a real visual
 * element: the cable-tunnel plate hung low and wide under the headline, the
 * corridor you walk down to reach the machinery. The verified practice
 * scope and the turnkey contract language carry the supporting copy; the
 * lower field holds only restrained register markers on hairlines.
 */
export function Opening({
  serviceCount,
  practiceCount,
}: {
  serviceCount: number;
  practiceCount: number;
}) {
  const enter = useEntrance();

  return (
    <section
      aria-label="Capabilities — how the work gets built"
      data-tone="dark"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      {/* the survey field — the engineered grain of the underground */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55] survey-grid"
      />

      {/* the corridor plate — low and wide, entering from the bottom edge */}
      <div className="absolute inset-x-0 bottom-0 h-[42%] md:h-[46%]" aria-hidden="true">
        <ClipReveal edge="bottom" delay={520} className="h-full">
          <img
            src="/uploads/capabilities/cable-tunnel.jpg"
            alt=""
            loading="eager"
            className="h-full w-full object-cover object-[58%_82%] opacity-[0.75] [filter:saturate(0.68)_contrast(1.05)_brightness(0.8)]"
          />
        </ClipReveal>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            // blend only where the headline column sits (left); let the
            // corridor breathe across the right of the frame
            background:
              "linear-gradient(to bottom, var(--brand-deep) 0%, transparent 46%, var(--brand-deep) 96%), linear-gradient(to right, var(--brand-deep) 0%, transparent 34%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-6 pb-24 pt-32 md:px-10 md:pt-40 lg:px-12">
        <p className={`eyebrow-sans text-white/40 ${enter(0).className}`} style={enter(0).style}>
          Capabilities
        </p>

        <div className="mt-10">
          <h1 className="font-display text-[13.5vw] font-normal leading-[1.02] tracking-[-0.025em] sm:text-[10.5vw] lg:text-[min(7vw,120px)]">
            {["How the work", "gets built."].map((line, i) => {
              const e = enter(i + 1);
              return (
                <span key={line} className={`block ${e.className}`} style={e.style}>
                  {line}
                </span>
              );
            })}
          </h1>
          <p
            className={`mt-8 max-w-md text-sm leading-[1.8] text-white/65 md:text-[15px] ${enter(4).className}`}
            style={enter(4).style}
          >
            Two integrated practices — underground utilities, electrical &amp; CGD below the street;
            MEP, HVAC &amp; fire protection within the building — delivered as one turnkey scope:
            supply, installation, testing &amp; commissioning, under a single accountable contract.
          </p>
        </div>

        {/* the register markers — one quiet line on a hairline, not cards */}
        <div className="mt-auto pt-28 md:pt-36">
          <div
            aria-hidden="true"
            className={`mb-8 h-px w-24 bg-white/25 ${enter(5).className}`}
            style={enter(5).style}
          />
          <ul
            className={`flex flex-wrap items-baseline gap-x-0 gap-y-4 divide-x divide-white/15 ${enter(5).className}`}
            style={enter(5).style}
          >
            <li className="pr-6 md:pr-8">
              <span className="block font-tech text-3xl font-medium tracking-[0.02em] text-white md:text-4xl">
                {String(serviceCount).padStart(2, "0")}
              </span>
              <span className="mt-2 block eyebrow-sans text-white/45">Disciplines</span>
            </li>
            <li className="px-6 md:px-8">
              <span className="block font-tech text-3xl font-medium tracking-[0.02em] text-white md:text-4xl">
                {String(practiceCount).padStart(2, "0")}
              </span>
              <span className="mt-2 block eyebrow-sans text-white/45">Practices</span>
            </li>
            <li className="pl-6 md:pl-8">
              <span className="block font-tech text-2xl font-medium leading-[1.7] tracking-[0.02em] text-white/85 md:text-3xl md:leading-[1.75]">
                TURNKEY
              </span>
              <span className="mt-2 block eyebrow-sans text-white/45">Delivery</span>
            </li>
            <li className="ml-auto hidden md:block">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-white"
              >
                <span className="border-b border-white/40 pb-1 transition-colors group-hover:border-white">
                  See what this built
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          </ul>
          <div className={`mt-8 ${enter(6).className}`} style={enter(6).style}>
            <ReferenceNote dark>
              Cable corridor — reference imagery, not a documented Capex project
            </ReferenceNote>
          </div>
        </div>
      </div>
    </section>
  );
}
