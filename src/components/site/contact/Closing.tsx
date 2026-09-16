import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";

/**
 * Closing (Contact): the final dark frame — the natural conclusion of the
 * site journey. The conversation is open; what remains is to walk back
 * through what Capex has built. One quiet invitation pair (PROJECTS ·
 * STUDIO) and one statutory line — no link wall, no repeat form.
 */
export function Closing({ phone, email }: { phone: string; email: string }) {
  return (
    <footer
      aria-label="Continue through the site"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      <div
        aria-hidden="true"
        className="survey-grid pointer-events-none absolute inset-0 opacity-25"
      />
      <div className="relative mx-auto max-w-[1680px] px-6 pb-12 pt-28 md:px-10 md:pt-36 lg:px-12 lg:pt-44">
        <Reveal>
          <p className="eyebrow-sans text-white/40">The line is open</p>
        </Reveal>

        <Reveal delay={120}>
          <h2 className="mt-10 max-w-[17ch] font-display text-[11vw] font-normal leading-[1.04] tracking-[-0.025em] sm:text-[9vw] lg:text-[min(7vw,132px)]">
            The conversation starts here.
          </h2>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-8 max-w-md text-sm leading-[1.85] text-white/60 md:text-[15px]">
            Every engagement begins the same way — one open line, one conversation about the work.
            The archive is one click away.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-baseline sm:gap-16">
          <Reveal delay={320}>
            <Link
              to="/projects"
              className="group inline-flex items-center gap-4 border-b border-white/50 pb-3 transition-colors hover:border-white"
            >
              <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
                Projects
              </span>
              <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
                →
              </span>
            </Link>
          </Reveal>
          <Reveal delay={400}>
            <Link
              to="/about"
              className="group inline-flex items-center gap-4 border-b border-white/50 pb-3 transition-colors hover:border-white"
            >
              <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
                Studio
              </span>
              <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        {/* direct channels restated — the fallback that is always available */}
        <Reveal delay={460}>
          <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="group w-fit"
              aria-label={`Call Capex — ${phone}`}
            >
              <span className="block text-[10px] uppercase tracking-[0.28em] text-white/40">
                Call
              </span>
              <span className="relative mt-1 inline-block font-display text-lg font-medium tracking-[-0.01em] text-white/85 md:text-xl">
                {phone}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white/70 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                />
              </span>
            </a>
            <a
              href={`mailto:${email}`}
              className="group w-fit"
              aria-label={`Write Capex — ${email}`}
            >
              <span className="block text-[10px] uppercase tracking-[0.28em] text-white/40">
                Write
              </span>
              <span className="relative mt-1 inline-block font-display text-lg font-medium tracking-[-0.01em] text-white/85 md:text-xl">
                {email}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white/70 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                />
              </span>
            </a>
          </div>
        </Reveal>

        {/* one tiny legal line — then it ends */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/35">
            Capex Construction &amp; Engineering Pvt. Ltd. · Est. 2012
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/35">
            Noida, India
          </span>
        </div>
      </div>
    </footer>
  );
}
