import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";

/**
 * CLOSING (Capabilities): the engine room's exit — deep earth, near black,
 * deliberately minimal after the register's density. The capability
 * narrative completes: from disciplines and tonnage to the first
 * conversation. Two quiet onward lines (conversation / projects) instead
 * of a single CTA.
 */
export function CapabilitiesClosing({ serviceCount }: { serviceCount: number }) {
  return (
    <section
      aria-label="Know what you need?"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      {/* the survey field fades back in — the same grain as the opening */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 survey-grid"
      />
      <div className="relative mx-auto max-w-[1680px] px-6 pb-32 pt-28 md:px-10 md:pb-44 md:pt-40 lg:px-12">
        <Reveal>
          <p className="eyebrow-sans text-white/40">{`The register — ${serviceCount} disciplines, two practices, one contract`}</p>
        </Reveal>
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:items-end">
          <Reveal delay={100} className="lg:col-span-9">
            <h2 className="max-w-[15ch] font-display text-[12vw] font-normal leading-[1.02] tracking-[-0.025em] sm:text-[9vw] lg:text-[min(6vw,104px)]">
              Know what you need?
              <span className="block text-white/50">Let&rsquo;s build from there.</span>
            </h2>
          </Reveal>
          <Reveal delay={220} className="lg:col-span-3">
            <div className="flex flex-col gap-6">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-white"
              >
                <span className="border-b border-white/40 pb-1 transition-colors group-hover:border-white">
                  Start a conversation
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <Link
                to="/projects"
                className="group inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-white/70"
              >
                <span className="border-b border-white/25 pb-1 transition-colors group-hover:border-white/70">
                  Explore projects
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
