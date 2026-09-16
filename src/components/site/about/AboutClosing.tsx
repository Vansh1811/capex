import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { CLOSING } from "@/lib/about-content";

/**
 * AboutClosing (About): the final dark frame — deep earth returns, the
 * company story hands the visitor onward. The closing invitation is the
 * conversation (Contact), with Projects one line above it. One statutory
 * line and it ends — no link wall.
 */
export function AboutClosing() {
  return (
    <footer
      aria-label="Continue through the site"
      data-tone="dark"
      className="relative overflow-hidden bg-black text-white"
    >
      <div className="relative mx-auto max-w-[1680px] px-6 pb-12 pt-32 md:px-10 md:pt-44 lg:px-12 lg:pt-52">
        <Reveal>
          <p className="eyebrow-sans text-white/40">{CLOSING.eyebrow}</p>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-10 max-w-[16ch] text-balance font-display text-[11vw] font-normal leading-[1.04] tracking-[-0.025em] sm:text-[9vw] lg:text-[min(7vw,132px)]">
            {CLOSING.headline.join(" ")}
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col items-start">
          {CLOSING.links.map((l, i) => (
            <Reveal key={l.to} delay={220 + i * 100}>
              <Link
                to={l.to}
                className="group mb-6 inline-flex items-center gap-4 border-b border-white/50 pb-3 transition-colors hover:border-white"
              >
                <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
                  {l.label}
                </span>
                <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* one tiny legal line — then it ends */}
        <div className="mt-24 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/35">
            {CLOSING.legal}
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/35">
            {CLOSING.place}
          </span>
        </div>
      </div>
    </footer>
  );
}
