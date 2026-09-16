import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

/**
 * Closing (V3.1): the final frame, not a footer. The word CAPEX sits
 * alone as the last act's mark; below it, the question — set font-normal
 * so the ending reads calm rather than loud — and a single invitation,
 * START A CONVERSATION →. Three quiet destinations and one statutory
 * line close the site. No link wall, no columns, no giant black
 * emptiness — the composition is deliberate, and then it ends.
 */
export function Closing() {
  return (
    <footer
      aria-label="Site footer"
      data-tone="dark"
      className="relative overflow-hidden bg-black text-white"
    >
      <div className="relative mx-auto max-w-[1680px] px-6 pb-12 pt-32 md:px-10 md:pt-44 lg:px-12 lg:pt-52">
        <Reveal>
          <p className="font-display text-[15px] font-bold tracking-[0.3em] text-white/80">CAPEX</p>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-10 max-w-[16ch] text-balance font-display text-[10vw] font-normal leading-[1.04] tracking-[-0.025em] sm:text-[8vw] lg:text-[min(6.5vw,120px)]">
            Have something that needs to work?
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <Link
            to="/contact"
            className="group mt-12 inline-flex items-center gap-4 border-b border-white/50 pb-3 transition-colors hover:border-white"
          >
            <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
              Start a conversation
            </span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
              →
            </span>
          </Link>
        </Reveal>

        {/* three quiet destinations — the whole of the "footer" navigation */}
        <nav aria-label="Closing destinations" className="mt-24 md:mt-32">
          <ul className="grid gap-10 md:grid-cols-3 md:gap-6">
            {[
              { to: "/projects", label: "Projects" },
              { to: "/about", label: "Studio" },
              { to: "/contact", label: "Contact" },
            ].map((d, i) => (
              <li key={d.label}>
                <Reveal delay={i * 90}>
                  <Link
                    to={d.to}
                    className="group flex items-baseline justify-between gap-4 border-t border-white/15 pt-5"
                  >
                    <span className="font-display text-2xl font-medium tracking-[-0.01em] text-white/85 transition-colors group-hover:text-white md:text-[28px]">
                      {d.label}
                    </span>
                    <span
                      className="text-white/50 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </nav>

        {/* one tiny legal line — then it ends */}
        <div className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
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
