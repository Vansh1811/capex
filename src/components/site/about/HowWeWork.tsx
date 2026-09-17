import { useRef, useState, type KeyboardEvent } from "react";
import { Reveal } from "@/components/site/home/Reveal";
import { DELIVERY } from "@/lib/about-content";

/**
 * HowWeWork (About): the common operating model as an engineered
 * interaction. The six verbs run down the left along a copper progress
 * rail; the live stage's description is held in a sticky panel on the
 * right. Hover, focus, click and arrow keys all advance the register —
 * the section remains fully usable with no interaction at all (stage 01
 * is live by default and the panel always shows it). On touch widths the
 * sticky panel yields to an inline disclosure: every stage expands in
 * place, nothing is hover-gated. The desktop panel is a stage sheet —
 * ghost numeral, register lines, progress measure — so the right column
 * carries as much composition as the left. Restrained motion only — the
 * rail fills, type re-weights, the sheet swaps via a 420ms rise; no
 * springs, no continuous animation.
 */
export function HowWeWork() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const rows = useRef<(HTMLButtonElement | null)[]>([]);
  const n = DELIVERY.steps.length;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    let next: number | null = null;
    if (e.key === "ArrowDown") next = (active + 1) % n;
    else if (e.key === "ArrowUp") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      setOpen(next);
      rows.current[next]?.focus();
    }
  };

  const select = (i: number) => {
    setActive(i);
    setOpen(open === i ? null : i);
  };

  return (
    <section
      aria-label="How the work moves"
      data-tone="light"
      className="paper relative text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-36 lg:px-12 lg:py-44">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <p className="eyebrow-sans text-muted-foreground">{DELIVERY.eyebrow}</p>
            <p className="eyebrow-sans text-[10px] text-muted-foreground/60">
              {DELIVERY.note} · {DELIVERY.source}
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12 lg:gap-10">
          {/* the sequence — verbs on the rail */}
          <div className="relative lg:col-span-5">
            {/* the rail: hairline base, copper fill tracking the live stage */}
            <div aria-hidden="true" className="absolute bottom-6 left-[3px] top-6 w-px bg-border">
              <div
                className="w-px bg-[var(--accent)] transition-[height] duration-500 ease-out"
                style={{ height: `${((active + 1) / n) * 100}%` }}
              />
            </div>

            <ol>
              {DELIVERY.steps.map((s, i) => {
                const live = i === active;
                return (
                  <li key={s.word}>
                    <button
                      ref={(el) => {
                        rows.current[i] = el;
                      }}
                      type="button"
                      onClick={() => select(i)}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onKeyDown={onKeyDown}
                      aria-expanded={open === i}
                      className="group flex w-full items-baseline gap-6 py-5 pl-8 text-left outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--surface)] md:py-6 md:pl-10"
                    >
                      {/* the node — where rail and word meet */}
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 h-[7px] w-[7px] -translate-x-[2.5px] rounded-full border transition-colors duration-300 ${
                          live
                            ? "border-[var(--accent)] bg-[var(--accent)]"
                            : "border-border bg-[var(--surface)] group-hover:border-[var(--accent)]/60"
                        }`}
                        style={{ top: "auto", marginTop: "0.95em" }}
                      />
                      <span
                        className={`font-tech text-[11px] tracking-[0.1em] transition-colors duration-300 ${
                          live ? "text-[var(--accent)]" : "text-foreground/30"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-display text-[36px] font-normal leading-[1.02] tracking-[-0.02em] transition-colors duration-300 md:text-[46px] ${
                          live
                            ? "text-foreground"
                            : "text-foreground/30 group-hover:text-foreground/60"
                        }`}
                      >
                        {s.word}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`hidden text-xl transition-all duration-300 lg:inline ${
                          live
                            ? "translate-x-0 text-[var(--accent)] opacity-100"
                            : "-translate-x-2 opacity-0"
                        }`}
                      >
                        →
                      </span>
                    </button>
                    {/* touch widths: the description expands in place */}
                    {open === i && (
                      <div className="pb-7 pl-8 pr-2 lg:hidden md:pl-10">
                        <p className="text-sm leading-[1.75] text-muted-foreground">{s.note}</p>
                        <p className="font-tech text-[9px] uppercase tracking-[0.18em] text-muted-foreground/50">
                          Output: {s.output} · Held by: {s.holder}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* desktop: the live stage's sheet, held sticky — a spec frame
           * with as much composition as the verb column: a stage strip
           * across its head, the ghost numeral behind, the description,
           * the output/holder/measure register, and the measure line. */}
          <div className="hidden lg:col-span-6 lg:col-start-7 lg:block">
            <div className="sticky top-28">
              {/* the frame — hairline shoulders mark it as one object */}
              <div aria-hidden="true" className="flex items-end justify-between">
                <span className="block h-px w-12 bg-border" />
                <span className="block h-2 w-px bg-border" />
              </div>
              <div className="border-x border-border px-10 pb-10 pt-6">
                {/* the stage strip — six station marks, live one lit */}
                <div aria-hidden="true" className="flex items-center gap-2">
                  {DELIVERY.steps.map((s, i) => (
                    <div key={s.word} className="flex flex-1 flex-col gap-1.5">
                      <span
                        className={`h-px transition-colors duration-500 ${
                          i === active ? "bg-[var(--accent)]" : "bg-border"
                        }`}
                      />
                      <span
                        className={`font-tech text-[9px] tracking-[0.12em] transition-colors duration-500 ${
                          i === active ? "text-[var(--accent)]" : "text-foreground/30"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* the stage body — ghost numeral behind, register beneath */}
                <div aria-hidden="true" className="relative mt-10">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-8 right-0 select-none font-display text-[168px] font-normal leading-none tracking-[-0.04em] text-foreground/[0.06]"
                  >
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  {/* key re-mounts on change so the sheet re-enters quietly */}
                  <div key={active} className="about-note-in relative">
                    <p className="font-tech text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
                      Stage {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                    </p>
                    <h3 className="mt-5 font-display text-[34px] font-normal tracking-[-0.025em] text-foreground">
                      {DELIVERY.steps[active].word}
                    </h3>
                    <p className="mt-5 max-w-md text-[15px] leading-[1.85] text-muted-foreground">
                      {DELIVERY.steps[active].note}
                    </p>
                    {/* the stage register — output · held by · measure */}
                    <dl className="mt-10 border-t border-border/70 pt-5">
                      {[
                        ["Output", DELIVERY.steps[active].output],
                        ["Held by", DELIVERY.steps[active].holder],
                        ["Measure", DELIVERY.steps[active].measure],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-baseline justify-between gap-6 py-2">
                          <dt className="font-tech text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
                            {k}
                          </dt>
                          <dd className="text-right font-tech text-[11px] uppercase tracking-[0.08em] text-foreground/80">
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="flex items-start justify-between">
                <span className="block h-2 w-px bg-border" />
                <span className="block h-px w-12 bg-border" />
              </div>
              {/* the progress measure — STG 03 · 50% OF LINE DRAWN */}
              <p className="mt-5 text-right font-tech text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
                STG {String(active + 1).padStart(2, "0")} · {Math.round(((active + 1) / n) * 100)}%
                of line drawn
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
