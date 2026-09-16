import { Link } from "@tanstack/react-router";
import { useEntrance } from "@/components/site/home/HeroVideo";
import { ClipReveal } from "@/components/site/home/ClipReveal";

/**
 * Opening (Clients): the deep-earth editorial opening — near black, one
 * idea, one atmospheric plate. TRUST, IN PRACTICE. sets the register the
 * whole page answers to: organizations, counterparties and associated
 * parties connected to documented Capex work. The plate is atmosphere, not
 * evidence — it is never presented as a client's project. The lower field
 * carries only verified counts (computed by the data layer from the same
 * registry the page renders), set as restrained typographic metadata.
 */
export function Opening({
  counts,
}: {
  counts: { clientsOfRecord: number; counterparties: number; associations: number };
}) {
  const enter = useEntrance();

  return (
    <section
      aria-label="Clients — trust, in practice"
      data-tone="dark"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      {/* faint engineered grain — the same survey field as the About opening */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55] survey-grid"
      />

      {/* the atmospheric plate — hung high right, unblinding from the right
          edge; editorial atmosphere, never a client's documented project */}
      <div className="absolute inset-x-0 top-0 hidden h-[62%] md:block">
        <ClipReveal edge="right" delay={620} className="h-full">
          <img
            src="/uploads/about/plant-room.jpg"
            alt="Plant room atmosphere — reference imagery, not a documented Capex project"
            loading="eager"
            className="h-full w-full object-cover object-[62%_46%] opacity-60 [filter:saturate(0.55)_contrast(0.98)_brightness(0.66)]"
          />
        </ClipReveal>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 46%, var(--brand-deep) 100%), linear-gradient(to right, var(--brand-deep) 0%, transparent 55%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-6 pb-24 pt-32 md:px-10 md:pt-40 lg:px-12">
        <p className={`eyebrow-sans text-white/40 ${enter(0).className}`} style={enter(0).style}>
          Clients
        </p>

        <div className="mt-10">
          <h1 className="font-display text-[13.5vw] font-normal leading-[1.02] tracking-[-0.025em] sm:text-[11vw] lg:text-[min(7.2vw,124px)]">
            {["Trust,", "in practice."].map((line, i) => {
              const e = enter(i + 1);
              return (
                <span key={line} className={`block ${e.className}`} style={e.style}>
                  {line}
                </span>
              );
            })}
          </h1>
          <p
            className={`mt-8 max-w-md text-sm leading-[1.8] text-white/65 md:text-[15px] ${enter(4).className}`}
            style={enter(4).style}
          >
            The organizations, counterparties and associated parties connected to Capex&rsquo;s
            documented work — stated conservatively, on the record.
          </p>
        </div>

        {/* the lower field — verified counts, one quiet line, no KPI wall.
            The hairline rule ties the field to the composition above so the
            deep-earth zone between statement and counts reads as intentional
            space, not emptiness. */}
        <div className="mt-auto pt-24">
          <div
            aria-hidden="true"
            className={`mb-10 h-px w-24 bg-white/25 ${enter(5).className}`}
            style={enter(5).style}
          />
          <ul
            className={`flex flex-wrap items-baseline gap-x-12 gap-y-4 ${enter(5).className}`}
            style={enter(5).style}
          >
            <li>
              <span className="block font-tech text-3xl font-medium tracking-[0.02em] text-white md:text-4xl">
                {counts.clientsOfRecord}
              </span>
              <span className="mt-2 block eyebrow-sans text-white/45">
                Clients &amp; counterparties
              </span>
            </li>
            <li>
              <span className="block font-tech text-3xl font-medium tracking-[0.02em] text-white md:text-4xl">
                {counts.associations}
              </span>
              <span className="mt-2 block eyebrow-sans text-white/45">Associations</span>
            </li>
            <li className="ml-auto">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-white"
              >
                <span className="border-b border-white/40 pb-1 transition-colors group-hover:border-white">
                  See the work
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          </ul>
          <p
            className={`mt-8 font-tech text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/25 ${enter(6).className}`}
            style={enter(6).style}
          >
            Plant room reference imagery — not a documented Capex project
          </p>
        </div>
      </div>
    </section>
  );
}
