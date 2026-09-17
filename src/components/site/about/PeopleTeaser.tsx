import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { PEOPLE } from "@/lib/about-content";

/**
 * PeopleTeaser (About): the gateway to /team, on deep earth — the dark
 * register returning before the page closes. Left: the organisational
 * statement, verified; the boards note carries the only collective
 * experience claim the record supports. Right: the site-crew plate
 * (DOC C p5) — the people shown as the work, not as a posed lineup.
 * No roster, no bios, no portraits: /team owns the people detail.
 */
export function PeopleTeaser() {
  const site = PEOPLE.plate;
  return (
    <section
      aria-label="The people behind the work"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--brand)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-36 lg:px-12 lg:py-44">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6 lg:pr-10">
            <Reveal>
              <p className="eyebrow-sans text-white/50">{PEOPLE.eyebrow}</p>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-10 max-w-[15ch] font-display text-[9.5vw] font-normal leading-[1.04] tracking-[-0.028em] sm:text-[6.5vw] lg:text-[min(3.9vw,68px)]">
                {PEOPLE.headline[0]}
                <br />
                <span className="text-white/45">{PEOPLE.headline[1]}</span>
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-10 max-w-md text-[15px] leading-[1.8] text-white/65">
                {PEOPLE.body}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-6 font-tech text-[10px] uppercase tracking-[0.2em] text-white/40">
                {PEOPLE.boardNote}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <Link
                to="/team"
                className="group mt-12 inline-flex items-center gap-4 border-b border-white/50 pb-3 transition-colors hover:border-white"
              >
                <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
                  {PEOPLE.linkLabel}
                </span>
                <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
                  →
                </span>
              </Link>
            </Reveal>
          </div>

          {/* the crew — the people as the work */}
          <div className="lg:col-span-5 lg:col-start-8">
            <ClipReveal edge="right" ratio="4 / 5" delay={120}>
              <img
                src={site.src}
                alt={site.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </ClipReveal>
            <Reveal delay={280}>
              <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-white/45">
                {site.caption}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
