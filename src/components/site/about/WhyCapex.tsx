import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/home/Reveal";
import { WHY } from "@/lib/about-content";

/**
 * WhyCapex (About): the differentiation as a two-hand instrument on deep
 * espresso — the strongest dark moment of the page. LEFT, held sticky
 * beside the register: the claim "Built on rigor.", and beneath it a tick
 * rail — six numbered ticks, one per principle, the examined one filled —
 * with the live principle's short label reading out beneath. RIGHT: the
 * register itself — six hairline rows, claim and evidence side by side,
 * the examined row carrying a copper edge down its left. The register
 * settles itself as the reader scrolls (each fully-viewed row becomes the
 * examined one); pointer or keyboard takes over instantly; leaving hands
 * control back to scroll. The examined row is never de-selected while the
 * reader is inside the section — the instrument always has a hand on it.
 * Nothing is hover-gated: every entry is always visible and readable at
 * full contrast. Motion is opacity, one drawn hairline per row and a
 * ticking readout — no springs, no continuous animation. Every statement
 * is traceable to the company record; nothing is promised or counted.
 */
export function WhyCapex() {
  const principles = WHY.principles;
  const n = principles.length;
  const [active, setActive] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  // false once the reader's pointer or keyboard takes over; true again on
  // leave — scroll-driven settling only runs while the register owns itself
  const [auto, setAuto] = useState(true);

  // Settle: as the reader scrolls, the row occupying most of the viewport
  // becomes the examined one — the left rail ticks along in sync.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!auto) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(Number((entry.target as HTMLElement).dataset.index ?? 0));
        }
      },
      { threshold: 0.85 },
    );
    for (const li of Array.from(list.children)) io.observe(li);
    return () => io.disconnect();
  }, [auto]);

  // the row hairlines draw in as the register arrives
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(list);
    return () => io.disconnect();
  }, []);

  const live = principles[active] ?? principles[0];

  return (
    <section
      aria-label="Why Capex"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--ink)] text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 survey-grid"
      />
      <div className="relative mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-36 lg:px-12 lg:py-44">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* the claim + the tick rail — held beside the register */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="eyebrow-sans text-white/40">{WHY.eyebrow}</p>
              </Reveal>
              <Reveal delay={90}>
                <h2 className="mt-10 font-display text-[13vw] font-normal leading-[0.98] tracking-[-0.03em] sm:text-[8vw] lg:text-[min(4.8vw,84px)]">
                  {WHY.headline[0]}
                  <br />
                  <span className="text-white/35">{WHY.headline[1]}</span>
                </h2>
              </Reveal>
              <Reveal delay={180}>
                <p className="mt-10 max-w-sm text-[15px] leading-[1.8] text-white/60">{WHY.note}</p>
              </Reveal>

              {/* the tick rail — one tick per principle, the examined one
               * filled; the live short label reads out beneath (desktop). */}
              <Reveal delay={240}>
                <div aria-hidden="true" className="mt-14 hidden lg:block">
                  <div className="flex items-center gap-2">
                    {principles.map((p, i) => (
                      <button
                        key={p.short}
                        type="button"
                        tabIndex={-1}
                        onClick={() => setActive(i)}
                        className="group/tick flex h-8 flex-1 items-center"
                      >
                        <span
                          className={`h-[3px] w-full transition-all duration-500 ease-out ${
                            i === active
                              ? "bg-[var(--accent)]"
                              : i < active
                                ? "bg-[var(--accent)]/40 group-hover/tick:bg-[var(--accent)]/70"
                                : "bg-white/12 group-hover/tick:bg-white/25"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div key={active} className="about-note-in mt-4 flex items-baseline gap-4">
                    <span className="font-tech text-[11px] tracking-[0.1em] text-[var(--accent-display)]">
                      {String(active + 1).padStart(2, "0")}
                    </span>
                    <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/45">
                      {live.short}
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* the register — six verified principles, two-cell rows */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="font-tech text-[10px] uppercase tracking-[0.22em] text-white/35">
                {WHY.register}
              </p>
            </Reveal>
            <ol
              ref={listRef}
              className="mt-6"
              onPointerEnter={() => setAuto(false)}
              onPointerLeave={() => setAuto(true)}
            >
              {principles.map((p, i) => {
                const on = i === active;
                return (
                  <li
                    key={p.title}
                    data-index={i}
                    onPointerEnter={() => setActive(i)}
                    onFocusCapture={() => {
                      setAuto(false);
                      setActive(i);
                    }}
                    onBlurCapture={() => setAuto(true)}
                    className="group"
                  >
                    {/* the row hairline — drawn as the register arrives */}
                    <div
                      aria-hidden="true"
                      className={`h-px origin-left bg-white/15 transition-transform duration-[1100ms] ease-out ${
                        drawn ? "scale-x-100" : "scale-x-0"
                      }`}
                      style={{ transitionDelay: `${i * 130 + 200}ms` }}
                    />
                    <div className="relative grid md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                      {/* the copper edge — the examined row's left spine */}
                      <div
                        aria-hidden="true"
                        className={`absolute bottom-3 left-0 top-3 w-px origin-top bg-[var(--accent)] transition-transform duration-500 ease-out ${
                          on ? "scale-y-100" : "scale-y-0"
                        }`}
                      />
                      {/* the claim cell */}
                      <button
                        type="button"
                        onClick={() => setActive(i)}
                        aria-pressed={on}
                        className="flex items-baseline gap-5 py-6 pl-6 text-left outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--ink)] md:py-8"
                      >
                        <span
                          className={`font-tech text-[11px] tracking-[0.1em] transition-colors duration-300 ${
                            on ? "text-[var(--accent-display)]" : "text-white/30"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-display text-[23px] font-normal leading-[1.12] tracking-[-0.02em] transition-colors duration-300 md:text-[26px] ${
                            on
                              ? "text-[var(--accent-display)]"
                              : "text-white/80 group-hover:text-white"
                          }`}
                        >
                          {p.title}
                        </span>
                      </button>
                      {/* the evidence cell — always readable, warmed when examined */}
                      <div
                        className={`py-1 pb-6 pl-6 pr-1 transition-opacity duration-500 md:py-8 md:pb-8 md:pl-8 ${
                          on ? "opacity-100" : "opacity-70 group-hover:opacity-90"
                        }`}
                      >
                        <p className="max-w-lg text-sm leading-[1.75] text-white/65">{p.body}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
              <div
                aria-hidden="true"
                className={`h-px origin-left bg-white/15 transition-transform duration-[1100ms] ease-out ${
                  drawn ? "scale-x-100" : "scale-x-0"
                }`}
                style={{ transitionDelay: `${n * 130 + 200}ms` }}
              />
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
