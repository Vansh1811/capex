import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { ReferenceNote } from "./PeopleExperience";

/**
 * INTERRUPTIONS — the human moments that break the roster so the page reads
 * as a photo essay rather than one long list. Each has its own composition:
 * A) a full-width wide crew frame crossing a boundary on warm stone;
 * B) a tall welder plate hung left of a quiet statement on deep earth.
 * Photography carries the warmth — the ground changes only twice in the
 * whole page, and never as a mechanical alternation.
 */

export function InterruptionWide() {
  return (
    <section
      aria-label="Field work — the crew"
      data-tone="light"
      className="relative overflow-hidden bg-[var(--surface)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1680px] px-6 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <h2 className="max-w-[15ch] text-balance font-display text-[36px] font-normal leading-[1.08] tracking-[-0.02em] md:text-[54px]">
              The site is where the company actually lives.
            </h2>
          </Reveal>
          <Reveal delay={140} className="lg:col-span-4">
            <p className="max-w-sm text-sm leading-[1.85] text-muted-foreground">
              Resident project managers hold the work at each site — the record&rsquo;s own
              structure, not a chart.
            </p>
          </Reveal>
        </div>

        {/* full-width plate, 21:9 — a wide scene of work, slight right bleed */}
        <div className="mt-14 md:mt-20 lg:-mr-10 xl:-mr-12">
          <ClipReveal edge="bottom" ratio="21 / 9">
            <img
              src="/uploads/people/wide-crew.jpg"
              alt="Crew working a pipeline slope — atmospheric reference imagery, not a documented Capex site"
              loading="lazy"
              className="h-full w-full object-cover [filter:saturate(0.85)_contrast(1.04)]"
            />
          </ClipReveal>
          <ReferenceNote className="mt-4">
            Fig. 02 — pipeline crew · atmospheric reference imagery, not a documented Capex site
          </ReferenceNote>
        </div>
      </div>
    </section>
  );
}

export function InterruptionTall() {
  return (
    <section
      aria-label="The hands of the work"
      data-tone="dark"
      className="relative bg-[var(--brand)] text-white"
    >
      <div className="mx-auto grid max-w-[1680px] gap-12 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-12 lg:items-center lg:px-12 lg:py-40">
        {/* tall plate hung left, entering from the left */}
        <div className="lg:col-span-4">
          <ClipReveal edge="left" ratio="3 / 4">
            <img
              src="/uploads/people/welder.jpg"
              alt="Welder at work, sparks in a dark workshop — atmospheric reference imagery, not a Capex employee"
              loading="lazy"
              className="h-full w-full object-cover [filter:saturate(0.9)_contrast(1.05)]"
            />
          </ClipReveal>
          <ReferenceNote dark className="mt-4">
            Fig. 03 — the trade · reference imagery
          </ReferenceNote>
        </div>
        <div className="lg:col-span-6 lg:col-start-6">
          <Reveal>
            <h2 className="max-w-[16ch] text-balance font-display text-[36px] font-normal leading-[1.1] tracking-[-0.02em] text-white md:text-[54px]">
              Drawings are finished by hands, not by offices.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-md text-sm leading-[1.85] text-white/60">
              Ten site engineers and a design engineer hold the work in the field — cable trenches,
              plant rooms, pipe joints — while the corporate office plans and coordinates. That
              split is the company&rsquo;s own documented shape.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * CLOSING — the deep-earth final frame. The statement keeps the verified
 * editorial tone: the work is carried by people, which About and Projects
 * both assert. Then two restrained destinations — no footer wall.
 */
export function PeopleClosing() {
  return (
    <footer
      aria-label="The people behind the work — closing"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 pb-14 pt-28 md:px-10 md:pt-40 lg:px-12 lg:pt-48">
        <Reveal>
          <p className="eyebrow-sans text-white/40">People</p>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="mt-10 max-w-[15ch] text-balance font-display text-[9vw] font-normal leading-[1.05] tracking-[-0.025em] sm:text-[7vw] lg:text-[min(5.6vw,96px)]">
            The work is never just the work.
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-8 max-w-md text-sm leading-[1.85] text-white/60">
            It is carried — planned in one room, finished in another, by people who sign their names
            to the record.
          </p>
        </Reveal>

        {/* two restrained destinations, then the statutory line — then it ends */}
        <nav aria-label="People closing destinations" className="mt-16 md:mt-24">
          <ul className="grid gap-10 md:grid-cols-2 md:gap-6">
            {[
              { to: "/contact", label: "Start a project", cta: true },
              { to: "/projects", label: "Explore projects" },
            ].map((d, i) => (
              <li key={d.label}>
                <Reveal delay={i * 90}>
                  <a
                    href={d.to}
                    className="group flex items-baseline justify-between gap-4 border-t border-white/15 pt-5"
                  >
                    <span className="font-display text-2xl font-medium tracking-[-0.01em] text-white/85 transition-colors group-hover:text-white md:text-[28px]">
                      {d.label}
                    </span>
                    <span
                      className="text-white/50 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
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
