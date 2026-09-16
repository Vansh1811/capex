import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { PEOPLE } from "@/lib/about-content";

/**
 * PeopleTeaser (About): the people behind the work — one large
 * documentary composition built from the real record: the management
 * boards photograph (DOC B p4) and a real site-crew frame (DOC C p5).
 * The organisational statement is verified (three directors across both
 * practices, patron, managers, site and design engineers; Noida planning;
 * resident project managers). No fake bios, no roster — /team owns the
 * people detail. The safety-regime line closes: one regime, every site.
 */
export function PeopleTeaser() {
  const board = PEOPLE.plate;
  const site = PEOPLE.sitePlate;
  return (
    <section
      aria-label="The people behind the work"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--brand)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <p className="eyebrow-sans text-white/50">{PEOPLE.eyebrow}</p>
            <h2 className="mt-10 max-w-[14ch] text-balance font-display text-[42px] font-normal leading-[1.05] tracking-[-0.025em] md:text-[64px] lg:text-[88px]">
              {PEOPLE.headline.join(" ")}
            </h2>
            <p className="mt-10 max-w-md text-[15px] leading-[1.8] text-white/65">{PEOPLE.body}</p>
            <p className="mt-6 font-tech text-[10px] uppercase tracking-[0.2em] text-white/40">
              {PEOPLE.boardNote}
            </p>
          </Reveal>

          {/* the boards portrait — hung high-right, the real management photograph */}
          <div className="lg:col-span-4 lg:pt-2">
            <ClipReveal edge="right" ratio="4 / 5" delay={120}>
              <img
                src={board.src}
                alt={board.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </ClipReveal>
            <Reveal delay={260}>
              <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-white/45">
                {board.caption}
              </p>
            </Reveal>
          </div>
        </div>

        {/* the wide site frame — the crew on the ground */}
        <div className="mt-16 md:mt-24">
          <ClipReveal edge="right" ratio="21 / 9">
            <img
              src={site.src}
              alt={site.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </ClipReveal>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Reveal delay={220}>
              <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-white/45">
                {site.caption}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <Link
                to="/team"
                className="group inline-flex items-center gap-4 border-b border-white/50 pb-3 transition-colors hover:border-white"
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
        </div>
      </div>
    </section>
  );
}
