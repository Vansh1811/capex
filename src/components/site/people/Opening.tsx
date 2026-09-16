import { useEntrance } from "@/components/site/home/HeroVideo";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { Reveal } from "@/components/site/home/Reveal";
import { ReferenceNote } from "./PeopleExperience";

/**
 * Opening (People): the first frame of the human portrait — warm ivory,
 * editorial, photographic from the first scroll. PEOPLE eyebrow, the
 * two-line headline, verified supporting copy, then a large composed
 * image: an engineer with drawings, hung high-right and wide, bleeding to
 * the viewport edge. The scene is light (unlike About's deep-earth opening)
 * so the page immediately reads warmer and more human than the rest of the
 * ecosystem — the invitation to meet people, not to read a database.
 */
export function Opening() {
  const enter = useEntrance();

  return (
    <section
      aria-label="People — the people behind the work"
      data-tone="light"
      className="paper relative overflow-hidden pt-32 md:pt-40 lg:pt-44"
    >
      <div className="mx-auto max-w-[1680px] px-6 md:px-10 lg:px-12">
        <p
          className={`eyebrow-sans text-foreground/50 ${enter(0).className}`}
          style={enter(0).style}
        >
          People
        </p>
        <h1 className="mt-10 max-w-[13ch] font-display text-[9vw] font-normal leading-[1.04] tracking-[-0.025em] sm:text-[7vw] lg:text-[min(5.6vw,96px)]">
          {["The people", "behind the work."].map((line, i) => {
            const e = enter(i + 1);
            return (
              <span key={line} className={`block ${e.className}`} style={e.style}>
                {line}
              </span>
            );
          })}
        </h1>

        {/* supporting copy — verified facts only: the named roster, the
            corporate-office/site structure from the documented record. */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
          <p
            className={`max-w-xl text-[15px] leading-[1.85] text-foreground/70 lg:col-span-5 ${enter(3).className}`}
            style={enter(3).style}
          >
            Capex is a named, real organisation — directors, delivery managers, site and design
            engineers. Planning and coordination run from the corporate office; the work itself is
            held by the people at each site. This page is the company record, by name.
          </p>
          <p
            className={`font-tech text-[11px] uppercase leading-[1.9] tracking-[0.18em] text-muted-foreground lg:col-span-3 lg:col-start-10 ${enter(4).className}`}
            style={enter(4).style}
          >
            22 named people on record
            <br />
            17 verified &amp; published
            <br />2 practices · field &amp; office
          </p>
        </div>

        {/* the first human image — wide, high-right of the type, entering
            from the right like a plate being placed into the composition.
            Reference imagery: the atmosphere of engineering work, never a
            portrait of a Capex employee. */}
        <div className="relative mt-16 md:mt-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-0">
            <div className="hidden lg:col-span-2 lg:block" aria-hidden="true" />
            <div className="lg:col-span-10">
              <ClipReveal edge="right" ratio="16 / 9" delay={150}>
                <img
                  src="/uploads/people/planning.jpg"
                  alt="Engineer working with drawings on site — atmospheric reference imagery, not a Capex employee"
                  className="h-full w-full object-cover [filter:saturate(0.85)_contrast(1.03)_brightness(0.99)]"
                />
              </ClipReveal>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
            <ReferenceNote>
              Fig. 01 — engineering work · atmospheric reference imagery, not a documented Capex
              person
            </ReferenceNote>
            <Reveal delay={300}>
              <span className="font-tech text-[10px] tracking-[0.18em] text-muted-foreground/60">
                ROSTER OF RECORD — 01&ndash;16
              </span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
