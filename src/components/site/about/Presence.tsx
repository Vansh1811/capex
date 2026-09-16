import { Reveal } from "@/components/site/home/Reveal";
import { PRESENCE } from "@/lib/about-content";

/**
 * Presence (About): geography as typography, not a map embed. The four
 * documented locations and the Rajasthan manufacturing unit, composed as
 * one connected index, closed by the reach line (project reach across
 * India and Nepal — from the company record). No addresses; Contact owns
 * them. Gated details (full registered-office role wording) stay off the
 * page until confirmed.
 */
export function Presence() {
  return (
    <section
      aria-label="Where Capex works from"
      data-tone="light"
      className="paper relative text-foreground"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <p className="eyebrow-sans text-muted-foreground">Presence</p>
            <p className="eyebrow-sans text-[10px] text-muted-foreground/60">
              From the company record
            </p>
          </div>
        </Reveal>

        {/* the system of places — one connected index */}
        <div className="mt-16 md:mt-24">
          {PRESENCE.places.map((p, i) => (
            <Reveal key={p.name} delay={Math.min(i * 70, 280)}>
              <div className="grid grid-cols-12 items-baseline gap-4 border-b border-border py-6 md:py-8">
                <span className="col-span-2 font-tech text-[11px] tracking-[0.1em] text-foreground/35 md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="col-span-10 font-display text-[9vw] font-normal leading-[0.98] tracking-[-0.02em] md:col-span-6 md:text-[56px] lg:text-[72px]">
                  {p.name}
                </h3>
                <span className="col-span-10 col-start-3 font-tech text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:col-span-5 md:col-start-8 md:text-right">
                  {p.role}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-14 max-w-xl text-[15px] leading-[1.8] text-muted-foreground">
            {PRESENCE.reach}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
