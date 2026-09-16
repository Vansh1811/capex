import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";

/**
 * Closing (Credentials): the final confirmation of trust — deep earth, the
 * register's promise restated. "Look closer. It's all on record." carries
 * the Capex tone (quiet, factual, an invitation to verify rather than a
 * sales push), so the suggested direction holds. Two onward paths only:
 * request verification through the desk, or walk the projects. The
 * statutory line (CIN) closes the page — the page's own evidence.
 */
export function Closing({ cin }: { cin: string }) {
  return (
    <footer
      aria-label="Continue — verification and projects"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      <div
        aria-hidden="true"
        className="survey-grid pointer-events-none absolute inset-0 opacity-25"
      />
      <div className="relative mx-auto max-w-[1680px] px-6 pb-12 pt-28 md:px-10 md:pt-36 lg:px-12 lg:pt-44">
        <Reveal>
          <p className="eyebrow-sans text-white/40">Proof of practice</p>
        </Reveal>

        <Reveal delay={120}>
          <h2 className="mt-10 max-w-[15ch] font-display text-[11vw] font-normal leading-[1.04] tracking-[-0.025em] sm:text-[9vw] lg:text-[min(7vw,132px)]">
            Look closer. It&rsquo;s all on record.
          </h2>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-8 max-w-md text-sm leading-[1.85] text-white/60 md:text-[15px]">
            Projects show what Capex has built. This page shows that the practice behind them is
            real, registered, accountable — and verifiable.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-baseline sm:gap-16">
          <Reveal delay={320}>
            <a
              href="#verification-desk"
              className="group inline-flex items-center gap-4 border-b border-white/50 pb-3 transition-colors hover:border-white"
            >
              <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
                Request verification
              </span>
              <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
                →
              </span>
            </a>
          </Reveal>
          <Reveal delay={400}>
            <Link
              to="/projects"
              className="group inline-flex items-center gap-4 border-b border-white/50 pb-3 transition-colors hover:border-white"
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

        {/* the statutory close — the page's own evidence */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <span className="font-tech text-[10px] uppercase tracking-[0.22em] text-white/35">
            Capex Construction &amp; Engineering Pvt. Ltd. · CIN {cin}
          </span>
          <span className="font-tech text-[10px] uppercase tracking-[0.22em] text-white/35">
            Noida, India
          </span>
        </div>
      </div>
    </footer>
  );
}
