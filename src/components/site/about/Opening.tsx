import { useEntrance } from "@/components/site/home/HeroVideo";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { OPENING } from "@/lib/about-content";

/**
 * Opening (About): the first frame, now two-sided — the headline holds the
 * left field on deep earth, and a real documentary plate (cross-country
 * pipeline works — the company record) carries the right. The image ends the
 * "empty right side" without competing with the Two Worlds field below:
 * it is framed and inset, not full-bleed; the full-bleed image field is
 * Two Worlds' opening move. Mobile: headline → copy → substantial image.
 * No statistics — the caption states only what the record states.
 */
export function Opening() {
  const enter = useEntrance();

  return (
    <section
      aria-label="About Capex — we build what keeps things moving"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--brand-deep)] text-white lg:flex lg:min-h-svh lg:flex-col lg:justify-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 survey-grid"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1680px] items-center gap-14 px-6 pb-20 pt-32 md:px-10 md:pb-24 md:pt-40 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:py-36">
        {/* the words */}
        <div className="lg:col-span-6">
          <p className={`eyebrow-sans text-white/40 ${enter(0).className}`} style={enter(0).style}>
            {OPENING.eyebrow}
          </p>
          <h1 className="mt-10 max-w-[16ch] font-display text-[11.5vw] font-normal leading-[1.06] tracking-[-0.02em] sm:text-[8vw] lg:text-[min(4.7vw,84px)]">
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
          <div
            aria-hidden="true"
            className={`mt-14 hidden lg:block ${enter(5).className}`}
            style={enter(5).style}
          >
            <svg width="14" height="42" viewBox="0 0 14 42" fill="none" className="text-white/60">
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
        </div>

        {/* the record — a real company photograph, framed, weighted right */}
        <div className="lg:col-span-5 lg:col-start-8">
          <ClipReveal edge="right" ratio="4 / 3" delay={260}>
            <img
              src={OPENING.plate.src}
              alt={OPENING.plate.alt}
              className="h-full w-full object-cover"
            />
          </ClipReveal>
          <p
            className={`mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-white/40 ${enter(5).className}`}
            style={enter(5).style}
          >
            {OPENING.plateCaption}
          </p>
        </div>
      </div>
    </section>
  );
}
