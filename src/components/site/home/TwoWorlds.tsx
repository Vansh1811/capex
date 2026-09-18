import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { ClipReveal } from "./ClipReveal";
import homepagePage02 from "@/assets/Homepage-page-02.png";

/**
 * Two Worlds (final): imagery as substantial composed objects, asymmetric
 * by design. UNDERGROUND: the dark earth field holds the word and context
 * at left while a LARGE industrial detail — over half the viewport wide,
 * 70% of the scene tall — unblinds from the right, bleeding off the scene's
 * right edge, grounded low; the type column overlaps its edge so image and
 * typography share the field. BUILDING: the ivory gallery hangs a wide
 * 16:10 interior high-left while the word settles low-right — a diagonal
 * with a slower, wider rhythm, not a mirrored pair.
 */
export function TwoWorlds() {
  return (
    <section aria-label="Practices">
      {/* ---------- 01 · UNDERGROUND — dark earth, the image enters right ---------- */}
      <article data-tone="dark" className="relative overflow-hidden bg-[var(--brand)] text-white">
        {/* the image — substantial, over half the scene wide, unblinds
            from the right and bleeds off the composition edge; the type
            column overlaps it so the two share one field. Desktop-xl only:
            narrower screens keep the in-flow composition below. */}
        <div className="absolute inset-y-0 right-0 hidden w-[52%] xl:block" aria-hidden="true">
          <ClipReveal
            edge="right"
            ratio={undefined}
            delay={80}
            className="absolute bottom-0 right-0 h-[70%] w-full"
          >
            <img
              src="/uploads/service-ug.jpg"
              alt="Open utility trench and pipeline corridor — atmospheric reference imagery, not a documented Capex project"
              loading="lazy"
              className="h-full w-full object-cover [filter:saturate(0.78)_contrast(1.02)_brightness(0.92)]"
            />
          </ClipReveal>
          {/* tone veil so the image reads as part of the dark field */}
          <div
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[var(--brand)] to-transparent"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto max-w-[1680px] px-6 pb-28 pt-28 md:px-10 md:pb-36 md:pt-36 lg:px-12 lg:pb-44 lg:pt-44">
          <div className="relative grid items-end gap-10 lg:grid-cols-12">
            {/* the word + its context, left, layered over the image edge */}
            <div className="relative z-10 lg:col-span-7 lg:pr-16 xl:col-span-7">
              <Reveal>
                <p className="eyebrow-sans text-white/50">Two worlds · 01</p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="mt-8 font-display text-[16vw] font-normal leading-[0.94] tracking-[-0.025em] md:text-[96px] lg:text-[124px]">
                  Under<span className="text-white/50">ground</span>
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="eyebrow-sans mt-4 text-white/50">UG Utilities · Electrical · CGD</p>
              </Reveal>
              <Reveal delay={220}>
                <p className="mt-10 max-w-sm text-sm leading-[1.8] text-white/70">
                  HT/LT cable networks for smart-city and metro programmes · city gas distribution
                  in MDPE and steel · HDD trenchless crossings with an owned Drillto fleet.
                </p>
              </Reveal>
              <Reveal delay={280}>
                <Link
                  to="/services"
                  className="group mt-10 inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-white"
                >
                  <span className="border-b border-white/40 pb-1 transition-colors group-hover:border-white">
                    Practice One
                  </span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Reveal>
              <Reveal delay={260}>
                <p className="mt-12 font-tech text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Documented programmes — Patna · Banaras · Lucknow Metro
                </p>
              </Reveal>
            </div>

            {/* sub-xl: the image unblinds below the word, wide 4:3 in-flow */}
            <div className="xl:hidden">
              <ClipReveal edge="right" ratio="4 / 3" delay={80}>
                <img
                  src="/uploads/service-ug.jpg"
                  alt="Open utility trench and pipeline corridor — atmospheric reference imagery, not a documented Capex project"
                  loading="lazy"
                  className="h-full w-full object-cover [filter:saturate(0.78)_contrast(1.02)_brightness(0.92)]"
                />
              </ClipReveal>
            </div>

            {/* xl: empty right column — the anchored image owns that mass */}
            <div className="hidden xl:col-span-5 xl:block" aria-hidden="true" />
          </div>
        </div>
      </article>

      {/* ---------- 02 · BUILDING — the ivory gallery, image hung high-left ---------- */}
      <article data-tone="light" className="paper relative bg-background text-foreground">
        <div className="mx-auto max-w-[1440px] px-6 pb-28 pt-24 md:px-10 md:pb-36 md:pt-32 lg:px-12 lg:pb-44 lg:pt-40">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            {/* the image — wide 16:10 gallery frame, hung high on the left */}
            <div className="xl:col-span-8 xl:pt-16">
              <ClipReveal edge="left" ratio="16 / 10">
                <img
                  src={homepagePage02}
                  alt="Hospital clean room with HVAC plant, ducting and red fire-fighting pipework — atmospheric reference imagery, not a documented Capex project"
                  loading="lazy"
                  className="h-full w-full object-cover [filter:saturate(0.9)]"
                />
              </ClipReveal>
              <Reveal delay={200}>
                <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  54 HVAC installations on record · 22 fire protection records
                </p>
              </Reveal>
            </div>

            {/* the word — composed low-right of the image at xl; stacked
                below it on narrower desktops where a four-column slot is
                too tight for the full word */}
            <div className="xl:col-span-4 xl:flex xl:flex-col xl:justify-end xl:pl-8">
              <Reveal>
                <p className="eyebrow-sans text-muted-foreground">Two worlds · 02</p>
              </Reveal>
              <Reveal delay={90}>
                <h2 className="mt-8 font-display text-[16vw] font-normal leading-[0.94] tracking-[-0.025em] md:text-[88px] xl:text-[96px]">
                  Build<span className="text-foreground/25">ing</span>
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <p className="eyebrow-sans mt-4 text-muted-foreground">
                  MEP · HVAC · Fire Fighting · Fire Protection
                </p>
              </Reveal>
              <Reveal delay={210}>
                <p className="mt-10 max-w-sm text-[15px] leading-[1.8] text-muted-foreground">
                  HVAC and VRV plants. Hospital clean rooms. Hydrant and sprinkler systems.
                  Integrated mechanical, electrical and plumbing — engineered, installed and
                  commissioned by one accountable partner.
                </p>
              </Reveal>
              <Reveal delay={270}>
                <Link
                  to="/services"
                  className="group mt-10 inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-foreground"
                >
                  <span className="border-b border-border pb-1 transition-colors group-hover:border-foreground">
                    Practice Two
                  </span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
