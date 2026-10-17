import { Link } from "@tanstack/react-router";
import { useEntrance } from "@/components/site/home/HeroVideo";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { SiteImage } from "@/components/site/SiteImage";
import infosysHero from "@/assets/Projects/infosys-underground/Infosys-1-1600.jpg";

/**
 * OPENING (Capabilities): a compact threshold, not a hero room. Deep earth
 * holds the one idea — what Capex engineers — beside a real Capex frame
 * (the Infosys 33 kV underground works, a documented record, captioned to
 * it). A single quiet cue walks the visitor into the capability directory
 * directly beneath. No oversized empty space, no anchor menu: the page's
 * own structure is the navigation.
 */
export function Opening() {
  const enter = useEntrance();

  return (
    <section
      aria-label="Capabilities — what Capex engineers"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      {/* the survey field — the engineered grain of the underground */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 survey-grid"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-12">
          {/* the words */}
          <div className="lg:col-span-7">
            <p
              className={`eyebrow-sans text-white/40 ${enter(0).className}`}
              style={enter(0).style}
            >
              Capabilities
            </p>

            <h1 className="mt-8 font-display text-[14vw] font-normal leading-[1.02] tracking-[-0.025em] sm:text-[10vw] lg:text-[min(6.2vw,96px)]">
              <span className={`block ${enter(1).className}`} style={enter(1).style}>
                What we engineer.
              </span>
            </h1>

            <p
              className={`mt-7 max-w-xl text-sm leading-[1.8] text-white/65 md:text-[15px] ${enter(2).className}`}
              style={enter(2).style}
            >
              Underground utility, electrical and city-gas networks beneath the street; MEP, HVAC
              and fire-protection systems within the building — engineered, supplied, installed,
              tested and commissioned under one accountable contract.
            </p>

            <div className={`mt-10 ${enter(3).className}`} style={enter(3).style}>
              <a
                href="#directory"
                className="group inline-flex items-baseline gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-white/80 transition-colors hover:text-white"
              >
                <span className="border-b border-white/30 pb-1 transition-colors group-hover:border-white/70">
                  The capability directory — nine disciplines, two practices
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </a>
            </div>
          </div>

          {/* the frame — real Capex photography, captioned to its record */}
          <div className="lg:col-span-5">
            <ClipReveal edge="right" ratio="16 / 10" delay={320}>
              <SiteImage
                src={infosysHero}
                sizes="(max-width: 1024px) 100vw, 42vw"
                width={1600}
                height={900}
                eager
                fetchPriority="high"
                alt="Crew laying HT cables in concrete troughs along a city street, chamber and excavator works behind — Capex works photograph"
                className="h-full w-full object-cover object-[52%_58%] [filter:saturate(0.82)_contrast(1.04)_brightness(0.88)]"
              />
            </ClipReveal>
            <div
              className={`mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 ${enter(4).className}`}
              style={enter(4).style}
            >
              <p className="font-tech text-[10px] uppercase leading-[1.7] tracking-[0.2em] text-white/40">
                Infosys campus, Noida — 33 kV underground HT network · Capex works photograph
              </p>
              <Link
                to="/projects/$slug"
                params={{ slug: "infosys-33kv-electrical" }}
                className="group inline-flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
              >
                <span className="border-b border-white/25 pb-0.5 transition-colors group-hover:border-white/60">
                  Record P1-112
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
