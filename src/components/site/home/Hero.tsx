import { HeroVideo, useEntrance } from "./HeroVideo";

/**
 * Hero (V3.1): the film is the subject; typography supports it. The
 * headline is deliberately restrained — two short lines, set small
 * against the frame, font-normal so the display sits quiet against the
 * footage. One line of quiet context and a thin downward arrow complete
 * the opening frame. Nothing else. No SCROLL label, no UI.
 */
export function Hero() {
  const enter = useEntrance();

  return (
    <section
      aria-label="Capex — we build what keeps things moving"
      data-tone="dark"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-black text-white"
    >
      <HeroVideo poster="/media/capex-hero-poster.jpg" />

      {/* scrim — enough to seat the type, not to mute the film */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/25"
      />

      <div className="relative z-10 px-6 pb-24 md:pb-28 lg:px-12">
        <h1 className="max-w-[14ch] font-display text-[7.4vw] font-normal leading-[1.06] tracking-[-0.02em] sm:text-[5.6vw] lg:text-[min(4.6vw,84px)]">
          {["We build what keeps", "things moving."].map((line, i) => {
            const e = enter(i);
            return (
              <span key={line} className={`block ${e.className}`} style={e.style}>
                {line}
              </span>
            );
          })}
        </h1>
        <p
          className={`mt-6 max-w-md text-sm leading-relaxed text-white/70 md:text-[15px] ${enter(2).className}`}
          style={enter(2).style}
        >
          Underground utilities, electrical &amp; CGD · MEP, HVAC &amp; fire protection — turnkey,
          pan-India, since 2012.
        </p>
      </div>

      {/* thin downward arrow — quiet, bottom edge, no label */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center pb-8 md:pb-10 lg:justify-end lg:pb-12 lg:pr-14 ${enter(3).className}`}
        style={enter(3).style}
      >
        <svg
          width="14"
          height="42"
          viewBox="0 0 14 42"
          fill="none"
          className="text-white/70"
          aria-hidden="true"
        >
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
