import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { TWO_WORLDS } from "@/lib/about-content";

/**
 * TwoWorlds (About): the two practices staged as two ENVIRONMENTS, not a
 * mirrored pair. World one is a dark earth field with a wide real HDD site
 * photograph entering from the right; world two is an ivory gallery with
 * the roof-top chiller plate — the asymmetric diagonal reversed. Between
 * them, the connection line: one delivery model, one pool of people.
 * Real Capex photography only; short factual descriptions; the detailed
 * taxonomy belongs to Capabilities.
 */
function PracticeLink({ label, tone }: { label: string; tone: "dark" | "light" }) {
  const cls =
    tone === "dark"
      ? "group mt-10 inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-white"
      : "group mt-10 inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-foreground";
  const underline =
    tone === "dark"
      ? "border-b pb-1 transition-colors border-white/40 group-hover:border-white"
      : "border-b pb-1 transition-colors border-border group-hover:border-foreground";
  return (
    <Link to="/services" className={cls}>
      <span className={underline}>{label}</span>
      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

export function TwoWorlds() {
  const one = TWO_WORLDS.one;
  const two = TWO_WORLDS.two;
  return (
    <section aria-label="The two Capex worlds">
      {/* ---------- 01 · BELOW THE STREET — dark earth, image enters right ---------- */}
      <article data-tone="dark" className="relative overflow-hidden bg-[var(--brand)] text-white">
        <div className="absolute inset-y-0 right-0 hidden w-[52%] xl:block" aria-hidden="true">
          <ClipReveal edge="right" delay={80} className="absolute bottom-0 right-0 h-[72%] w-full">
            <img
              src={one.plate.src}
              alt={one.plate.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </ClipReveal>
          <div
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[var(--brand)] to-transparent"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto max-w-[1680px] px-6 pb-28 pt-28 md:px-10 md:pb-36 md:pt-36 lg:px-12 lg:pb-44 lg:pt-44">
          <div className="relative grid items-end gap-10 lg:grid-cols-12">
            <div className="relative z-10 lg:col-span-7 lg:pr-16">
              <Reveal>
                <p className="eyebrow-sans text-white/50">Two worlds · {one.index}</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="mt-8 font-display text-[16vw] font-normal leading-[0.94] tracking-[-0.025em] md:text-[96px] lg:text-[124px]">
                  {one.title}
                  <span className="text-white/50">{one.titleTail}</span>
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="eyebrow-sans mt-4 text-white/50">{one.sub}</p>
              </Reveal>
              <Reveal delay={220}>
                <p className="mt-10 max-w-sm text-sm leading-[1.8] text-white/70">{one.body}</p>
              </Reveal>
              <Reveal delay={280}>
                <PracticeLink label={one.linkLabel} tone="dark" />
              </Reveal>
              <Reveal delay={260}>
                <p className="mt-12 font-tech text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Documented programmes — Patna · Banaras · Lucknow Metro
                </p>
              </Reveal>
            </div>

            {/* sub-xl: the image below the word, wide in-flow */}
            <div className="xl:hidden">
              <ClipReveal edge="right" ratio="4 / 3" delay={80}>
                <img
                  src={one.plate.src}
                  alt={one.plate.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </ClipReveal>
            </div>
            <div className="hidden xl:col-span-5 xl:block" aria-hidden="true" />
          </div>
        </div>
      </article>

      {/* ---------- 02 · WITHIN THE BUILDING — ivory gallery, portrait hung high-right ---------- */}
      <article data-tone="light" className="paper relative text-foreground">
        <div className="mx-auto max-w-[1440px] px-6 pb-28 pt-24 md:px-10 md:pb-36 md:pt-32 lg:px-12 lg:pb-44 lg:pt-40">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            {/* the word — low-left at xl; the diagonal reversed from World 01 */}
            <div className="order-2 xl:order-1 xl:col-span-5 xl:flex xl:flex-col xl:justify-end">
              <Reveal>
                <p className="eyebrow-sans text-muted-foreground">Two worlds · {two.index}</p>
              </Reveal>
              <Reveal delay={90}>
                <h2 className="mt-8 font-display text-[16vw] font-normal leading-[0.94] tracking-[-0.025em] md:text-[88px] xl:text-[96px]">
                  {two.title}
                  <span className="text-foreground/25">{two.titleTail}</span>
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <p className="eyebrow-sans mt-4 text-muted-foreground">{two.sub}</p>
              </Reveal>
              <Reveal delay={210}>
                <p className="mt-10 max-w-sm text-[15px] leading-[1.8] text-muted-foreground">
                  {two.body}
                </p>
              </Reveal>
              <Reveal delay={270}>
                <PracticeLink label={two.linkLabel} tone="light" />
              </Reveal>
            </div>

            {/* the portrait — roof-top chiller plate, hung high on the right */}
            <div className="order-1 xl:order-2 xl:col-span-7 xl:pt-4">
              <ClipReveal edge="left" ratio="3 / 4" delay={60}>
                <img
                  src={two.plate.src}
                  alt={two.plate.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </ClipReveal>
              <Reveal delay={200}>
                <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {two.plate.caption}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </article>

      {/* ---------- the connection — one line between the two worlds ---------- */}
      <div data-tone="light" className="paper border-t border-border text-foreground">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20 lg:px-12">
          <Reveal>
            <p className="mx-auto max-w-2xl text-center font-display text-[22px] font-normal leading-[1.4] tracking-[-0.01em] text-foreground/85 md:text-[28px]">
              {TWO_WORLDS.connection}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
