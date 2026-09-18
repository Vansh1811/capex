import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { TRUST } from "@/lib/about-content";
import { aboutPlate } from "@/lib/about-media";

/**
 * Trust (About): a restrained bridge — one statement, then the doors.
 * Client and credential detail belongs to those pages; About only claims
 * what the record shows (long-term associations with public-sector
 * undertakings, gas utilities, EPC majors — DOC C p3). No testimonials,
 * no awards, no logos. The statement holds the left field; a real
 * site-testing plate — the work itself, documented — carries the right.
 */
export function Trust() {
  const plate = aboutPlate("safety-site");
  return (
    <section
      aria-label="Trust and proof"
      data-tone="light"
      className="paper relative text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* the statement */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow-sans text-muted-foreground">{TRUST.eyebrow}</p>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-10 max-w-[16ch] text-balance font-display text-[42px] font-normal leading-[1.05] tracking-[-0.025em] md:text-[64px] lg:text-[80px]">
                {TRUST.headline}
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-10 max-w-lg text-[15px] leading-[1.8] text-muted-foreground">
                {TRUST.body}
              </p>
            </Reveal>

            <div className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
              {TRUST.links.map((l, i) => (
                <Reveal key={l.to} delay={240 + i * 90}>
                  <Link
                    to={l.to}
                    className="group inline-flex items-center gap-4 border-b border-border pb-3 transition-colors hover:border-foreground"
                  >
                    <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
                      {l.label}
                    </span>
                    <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
                      →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>

          {/* the proof — site testing, documented, not claimed */}
          <div className="lg:col-span-5">
            <ClipReveal edge="right" ratio="4 / 5" delay={160}>
              <img
                src={plate.src}
                alt={plate.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </ClipReveal>
            <Reveal delay={300}>
              <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                {plate.caption}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
