import { useState } from "react";
import { Reveal } from "@/components/site/home/Reveal";
import type { RegisterState } from "@/lib/site-data";

/**
 * WHERE THE PRACTICE IS REGISTERED (Credentials): the GST geography as an
 * elegant typographic index — the states the GST REG-06 certificates
 * document, in certificate order, with each state's GSTIN prefix and office
 * city. Selecting a state reveals its GSTIN in a quiet expansion beneath
 * the row (keyboard + focus work identically to hover). A restrained
 * monochrome India silhouette sits behind at lowest contrast — a subtle
 * geographic anchor, never a dashboard map.
 */
export function Geography({ states }: { states: RegisterState[] }) {
  const [active, setActive] = useState<string | null>(null);
  const current = states.find((s) => s.state === active) ?? null;

  return (
    <section
      aria-label="Where the practice is registered"
      data-tone="light"
      className="relative overflow-hidden bg-[var(--muted)] text-foreground"
    >
      {/* the silhouette — lowest contrast, an anchor not a feature */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.055]"
      >
        <IndiaSilhouette className="h-[130%] max-h-none w-auto max-w-[160%] text-foreground" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-12 lg:py-40">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="eyebrow-sans text-muted-foreground/70">Registration geography</p>
            <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              GST REG-06 · {states.length} states of record
            </p>
          </div>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="mt-8 max-w-[18ch] font-display text-[10.5vw] font-normal leading-[1.02] tracking-[-0.025em] sm:text-[8vw] lg:text-[min(5.4vw,84px)]">
            Where the practice is registered.
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-8 max-w-md text-sm leading-[1.85] text-muted-foreground md:text-[15px]">
            The GST registrations below are held in the cities the certificates name — a statutory
            presence that follows the work: Noida headquarters, the Patna, Gurugram, New Delhi and
            Sangli branches.
          </p>
        </Reveal>

        {/* the index of states */}
        <div className="mt-16 md:mt-24">
          <ul role="list" className="border-t border-foreground/20">
            {states.map((s, i) => {
              const open = active === s.state;
              return (
                <li key={s.state} role="listitem">
                  <Reveal delay={Math.min(i * 80, 480)}>
                    <button
                      type="button"
                      onClick={() => setActive(open ? null : s.state)}
                      aria-expanded={open}
                      className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 border-b border-foreground/20 py-6 text-left md:grid-cols-[4rem_minmax(0,1fr)_auto_auto] md:gap-x-8 md:py-8"
                    >
                      <span className="font-tech text-xs tracking-[0.15em] text-muted-foreground/60 transition-colors duration-300 group-hover:text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-2xl font-normal tracking-[-0.015em] transition-colors duration-300 sm:text-3xl md:text-4xl">
                        {s.state}
                      </span>
                      <span className="hidden font-tech text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 md:block">
                        {s.place}
                      </span>
                      <span className="font-tech text-[11px] tracking-[0.14em] text-muted-foreground/60 md:text-xs">
                        {open ? "Close" : "GSTIN"}
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pb-7 pl-[2.75rem] md:pl-[5.5rem]">
                          <p className="break-all font-tech text-base tracking-[0.04em] text-foreground md:text-xl">
                            {s.number}
                          </p>
                          <p className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground/70">
                            {s.place}
                            {s.issued_at ? ` · recorded ${s.issued_at.slice(0, 4)}` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
          {/* live region for the reveal — screen readers hear the GSTIN */}
          <p aria-live="polite" className="sr-only">
            {current ? `${current.state} GSTIN ${current.number}, office ${current.place}` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * A simplified monochrome outline of India drawn as a single path — a
 * restrained geographic mark. Deliberately abstracted: it anchors the
 * composition without turning the section into a dashboard map.
 */
function IndiaSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 460" fill="none" className={className} aria-hidden="true">
      <path
        d="M168 18 C150 26, 138 44, 128 66 C112 74, 92 82, 76 98 C60 114, 52 136, 44 158 C36 180, 30 204, 34 228 C38 252, 48 274, 44 298 C40 322, 24 344, 22 368 C20 392, 32 414, 52 426 C72 438, 98 440, 122 448 C146 456, 170 460, 194 452 C218 444, 240 428, 262 434 C284 440, 306 452, 328 444 C350 436, 366 414, 372 392 C378 370, 372 348, 362 328 C352 308, 336 292, 330 270 C324 248, 328 224, 322 202 C316 180, 300 162, 296 140 C292 118, 298 96, 290 76 C282 56, 262 42, 242 34 C222 26, 200 22, 182 24 C177 21, 172 19, 168 18 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
