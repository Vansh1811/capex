import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { ReferenceNote } from "@/components/site/capabilities/CapabilitiesExperience";

/**
 * PHYSICAL CAPABILITY — BUILT TO DELIVER. The register's abstract
 * disciplines resolve into tonnage: the Drillto trenchless fleet's pullback
 * classes, oversized and architectural, set into the rig frame. The
 * fleet's three numerals run down the frame's quiet edge like a gauge;
 * the remaining register reads as a mono register column, not an
 * equipment table. Verified data only — DOC A p11 / DOC C p5; the rig
 * pictured is reference imagery.
 */
export function PhysicalCapability({
  fleet,
  equipment,
}: {
  fleet: { tonnes: number }[];
  equipment: { item: string; spec: string | null; qty?: string }[];
}) {
  return (
    <section
      aria-label="Physical capability — built to deliver"
      data-tone="dark"
      className="relative bg-[var(--brand)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <p className="eyebrow-sans text-white/50">Physical capability</p>
            <h2 className="mt-10 max-w-[14ch] text-balance font-display text-[11vw] font-normal leading-[1.02] tracking-[-0.025em] sm:text-[8vw] lg:text-[min(5.6vw,96px)]">
              Built to deliver.
            </h2>
          </Reveal>
          <Reveal delay={180} className="md:col-span-4">
            <p className="max-w-sm text-sm leading-[1.8] text-white/60">
              Capability, stated in tonnage. The trenchless fleet drills crossings under roads, rail
              and rivers without opening the surface — owned, not rented, on the company&rsquo;s own
              register.
            </p>
          </Reveal>
        </div>

        {/* the rig frame — the numeral set into the composition */}
        <div className="relative mt-16 md:mt-24">
          <ClipReveal edge="left" ratio="16 / 9" innerClassName="relative">
            <img
              src="/uploads/capabilities/hdd-rig-drillto.jpg"
              alt="Horizontal directional drilling rig at work — atmospheric reference imagery, not Capex-owned equipment"
              loading="lazy"
              className="h-full w-full object-cover object-[58%_46%] [filter:saturate(0.85)_contrast(1.05)]"
            />
            {/* the pullback numeral — quietly inside the frame, like the About page's tonnage */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-6 pb-6 pt-28 md:px-10 md:pb-10">
              <span className="font-display text-[22vw] font-normal leading-none tracking-[-0.02em] text-white [text-shadow:0_1px_24px_rgb(0_0_0/45%)] sm:text-[18vw] md:text-[150px] lg:text-[190px]">
                32
              </span>
              <span className="pb-3 font-tech text-[10px] uppercase tracking-[0.24em] text-white/90 md:pb-6">
                Tonnes · pullback class · trenchless
              </span>
            </div>
          </ClipReveal>

          {/* the fleet gauges — 32 / 28 / 20 down the frame's quiet edge */}
          <div className="mt-8 grid grid-cols-3 divide-x divide-white/15 border-y border-white/15 md:mt-10">
            {fleet.map((f, i) => (
              <div key={f.tonnes} className="px-4 py-5 first:pl-0 md:px-8 md:py-7">
                <span
                  className={`block font-display font-normal leading-none tracking-[-0.02em] md:leading-none ${
                    i === 0
                      ? "text-[44px] md:text-[72px] lg:text-[92px]"
                      : "text-[36px] text-white/60 md:text-[58px] lg:text-[72px]"
                  }`}
                >
                  {f.tonnes}
                  <span className="ml-1 align-top font-tech text-[11px] tracking-[0.1em] text-white/50">
                    T
                  </span>
                </span>
                <span className="mt-3 block eyebrow-sans text-white/40">
                  {i === 0 ? "Pullback class" : i === 1 ? "Mid fleet" : "Compact fleet"}
                </span>
              </div>
            ))}
          </div>
          <Reveal delay={220}>
            <ReferenceNote dark className="mt-5">
              Drillto HDD fleet on the documented register — 32, 28 and 20-tonne pullback machines.
              Rig pictured is reference imagery, not Capex-owned equipment.
            </ReferenceNote>
          </Reveal>
        </div>

        {/* the register — the owned plant, mono column, unit counts from the source rows */}
        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="font-display text-[26px] font-normal leading-[1.14] tracking-[-0.02em] text-white/90 md:text-[34px]">
              The register behind the fleet.
            </p>
            <p className="mt-6 max-w-md text-sm leading-[1.8] text-white/60">
              The wider plant list carried on the company&rsquo;s own equipment register — drilling,
              welding, jointing, fusion and measuring kit, held for deployment across the
              practice&rsquo;s UG, CGD and trenchless programmes, with the unit counts as documented
              on the source register.
            </p>
          </Reveal>
          <Reveal delay={140} className="lg:col-span-7">
            <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {equipment.map((e, i) => (
                <li
                  key={`${e.item}-${i}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-white/10 py-3"
                >
                  <span className="min-w-0 flex-1 text-[13px] leading-snug text-white/80">
                    {e.item}
                  </span>
                  {e.spec && (
                    <span className="font-tech text-[10px] uppercase leading-[1.6] tracking-[0.12em] text-white/40">
                      {e.spec}
                    </span>
                  )}
                  {e.qty && (
                    <span className="font-tech text-[10px] uppercase leading-[1.6] tracking-[0.12em] text-white/40">
                      {e.qty} Nos.
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <ReferenceNote dark className="mt-6">
              Equipment register — DOC A p11 / DOC C p5 · unit counts as printed on the source
              register
            </ReferenceNote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
