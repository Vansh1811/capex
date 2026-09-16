import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { PHYSICAL } from "@/lib/about-content";

/**
 * PhysicalCapex (About): an editorial portrait of the plant behind the
 * company — proof that Capex builds with more than plans. The rig
 * photograph is now a REAL documented Capex HDD operation (DOC C p18), and
 * the tonnage figures from the equipment register sit quietly inside the
 * composition. The second moment pairs the boring-at-interface plate with
 * the owned-plant statement. No equipment catalogue — Capabilities owns
 * the detail.
 */
export function PhysicalCapex() {
  const rig = PHYSICAL.rigPlate;
  const detail = PHYSICAL.detailPlate;
  return (
    <section
      aria-label="The physical Capex"
      data-tone="dark"
      className="relative bg-[var(--ink)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-9">
            <p className="eyebrow-sans text-white/50">{PHYSICAL.eyebrow}</p>
            <h2 className="mt-10 max-w-[16ch] text-balance font-display text-[42px] font-normal leading-[1.04] tracking-[-0.025em] md:text-[64px] lg:text-[88px]">
              {PHYSICAL.headline.join(" ")}
            </h2>
          </Reveal>
          <Reveal delay={200} className="md:col-span-3">
            <p className="text-sm leading-[1.8] text-white/60">{PHYSICAL.body}</p>
          </Reveal>
        </div>

        {/* moment one — the documented rig, large, tonnage set into the frame */}
        <div className="relative mt-16 md:mt-24">
          <ClipReveal edge="left" ratio="16 / 9" innerClassName="relative">
            <img
              src={rig.src}
              alt={rig.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-6 pb-6 pt-24 md:px-10 md:pb-10">
              <span className="font-display text-[13vw] font-normal leading-none tracking-[-0.02em] text-white [text-shadow:0_1px_24px_rgb(0_0_0/45%)] md:text-[96px] lg:text-[128px]">
                {PHYSICAL.tonnage}
              </span>
              <span className="pb-2 font-tech text-[10px] uppercase tracking-[0.24em] text-white/90 md:pb-4">
                {PHYSICAL.tonnageLabel}
              </span>
            </div>
          </ClipReveal>
          <Reveal delay={300}>
            <p className="mt-4 max-w-xl font-tech text-[10px] uppercase leading-relaxed tracking-[0.16em] text-white/45">
              {PHYSICAL.register}
            </p>
          </Reveal>
        </div>

        {/* moment two — boring at the building interface beside the owned-plant statement */}
        <div className="mt-20 grid gap-10 md:mt-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 lg:pt-10">
            <Reveal>
              <p className="font-display text-[30px] font-normal leading-[1.12] tracking-[-0.02em] text-white/90 md:text-[40px]">
                {PHYSICAL.statement}
              </p>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-8 max-w-md text-sm leading-[1.8] text-white/60">
                {PHYSICAL.statementBody}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <ClipReveal edge="right" ratio="16 / 10" delay={100}>
              <img
                src={detail.src}
                alt={detail.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </ClipReveal>
            <Reveal delay={260}>
              <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-white/45">
                {detail.caption}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
