import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";

/**
 * THE FILTER LINE — typographic controls, not a dashboard bar: the verified
 * relationship terms from the data, set as one row of small words. Active
 * state is an underline + full ink; inactive words recede. Words render only
 * for terms actually present in the registry.
 */
export function FilterLine({
  options,
  active,
  onChange,
}: {
  options: { value: string; label: string; count: number }[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter the index by relationship"
      className="flex flex-wrap items-baseline gap-x-8 gap-y-4 md:gap-x-10"
    >
      {options.map((o) => {
        const isActive = active === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(o.value)}
            className={`group relative pb-1.5 transition-colors duration-300 ${
              isActive ? "text-foreground" : "text-muted-foreground/70 hover:text-foreground"
            }`}
          >
            <span className="eyebrow-sans">{o.label}</span>
            <span className="ml-2 font-tech text-[10px] tracking-[0.08em] text-muted-foreground/50">
              {o.count}
            </span>
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 bottom-0 h-px transition-all duration-300 ${
                isActive ? "bg-foreground" : "bg-transparent group-hover:bg-border"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

/**
 * THE CLOSING — the final deep-earth frame. A restrained statement in the
 * site's established voice (the work precedes the relationship — never the
 * reverse), then the two invitations: START A PROJECT → and EXPLORE
 * PROJECTS →. One statutory line and it ends.
 */
export function ClientsClosing() {
  return (
    <footer
      aria-label="Continue through the site"
      data-tone="dark"
      className="relative overflow-hidden bg-black text-white"
    >
      <div className="relative mx-auto max-w-[1680px] px-6 pb-12 pt-32 md:px-10 md:pt-44 lg:px-12 lg:pt-52">
        <Reveal>
          <p className="eyebrow-sans text-white/40">The record, and what follows it</p>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-10 max-w-[16ch] text-balance font-display text-[11vw] font-normal leading-[1.04] tracking-[-0.025em] sm:text-[9vw] lg:text-[min(7vw,132px)]">
            The work comes first. The relationship follows.
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-8 max-w-md text-sm leading-[1.8] text-white/65 md:text-[15px]">
            Every name in this archive earned its place the same way — a scope delivered, tested and
            commissioned. That is the only kind of trust Capex keeps.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:gap-12">
          <Reveal delay={300}>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-4 border-b border-white/50 pb-3 transition-colors hover:border-white"
            >
              <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
                Start a project
              </span>
              <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
                →
              </span>
            </Link>
          </Reveal>
          <Reveal delay={380}>
            <Link
              to="/projects"
              className="group inline-flex items-center gap-4 border-b border-white/50 pb-3 transition-colors hover:border-white"
            >
              <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
                Explore projects
              </span>
              <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        {/* one tiny legal line — then it ends */}
        <div className="mt-24 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
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
