import { useEntrance } from "@/components/site/home/HeroVideo";
import { OPENING } from "@/lib/about-content";

/**
 * Opening (About): the first frame — deep earth, almost black, one idea.
 * Typographic and architectural, sparse by design: eyebrow, three lines,
 * one sentence of source-safe context, a hairline arrow down. No
 * statistics, no paragraph wall. Same language as the homepage hero but
 * About's own voice.
 */
export function Opening() {
  const enter = useEntrance();

  return (
    <section
      aria-label="About Capex — we build what keeps things moving"
      data-tone="dark"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55] survey-grid"
      />

      <div className="relative z-10 px-6 pb-28 md:pb-32 lg:px-12">
        <p className={`eyebrow-sans text-white/40 ${enter(0).className}`} style={enter(0).style}>
          {OPENING.eyebrow}
        </p>
        <h1 className="mt-10 max-w-[16ch] font-display text-[8.4vw] font-normal leading-[1.06] tracking-[-0.02em] sm:text-[6vw] lg:text-[min(5vw,88px)]">
          {OPENING.lines.map((line, i) => {
            const e = enter(i + 1);
            return (
              <span key={line} className={`block ${e.className}`} style={e.style}>
                {line}
              </span>
            );
          })}
        </h1>
        <p
          className={`mt-8 max-w-md text-sm leading-relaxed text-white/65 md:text-[15px] ${enter(4).className}`}
          style={enter(4).style}
        >
          {OPENING.support}
        </p>
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center pb-8 md:pb-10 lg:justify-end lg:pb-12 lg:pr-14 ${enter(5).className}`}
        style={enter(5).style}
      >
        <svg width="14" height="42" viewBox="0 0 14 42" fill="none" className="text-white/70">
          <path d="M7 0v38" stroke="currentColor" strokeWidth="1" />
          <path
            d="M1 33.5 7 41l6-7.5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
