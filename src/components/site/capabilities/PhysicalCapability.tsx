import { Reveal } from "@/components/site/home/Reveal";
import { SiteImage } from "@/components/site/SiteImage";
import { EQUIPMENT_RIG } from "@/lib/capability-media";

/**
 * PHYSICAL CAPABILITY — the fleet, stated in tonnage. One real frame of the
 * company's own HDD rig carries the section; beside it the documented
 * fleet gauge (32 / 28 / 20-tonne pullback classes, quantities read from
 * the equipment register itself), closed by the full documented register —
 * the same technical-index language as the testing & commissioning
 * register above. Every numeral comes from the company record; the
 * pictured machine is Capex works photography (DOC C p5).
 */

/** Class labels for the fleet gauge — the register's own classes. */
const FLEET_LABEL: Record<number, string> = {
  32: "Pullback class",
  28: "Mid fleet",
  20: "Compact fleet",
};

const num = (i: number) => String(i).padStart(2, "0");

export function PhysicalCapability({
  fleet,
  equipment,
}: {
  fleet: { tonnes: number }[];
  equipment: { item: string; spec: string | null; qty?: string }[];
}) {
  /** Quantity for a fleet class, read from the register it appears on. */
  const qtyFor = (tonnes: number) => {
    const row = equipment.find(
      (e) => e.item.startsWith("Drillto") && e.spec?.includes(`${tonnes}-tonne`),
    );
    return row?.qty;
  };

  return (
    <section
      id="equipment"
      aria-label="Physical capability — the trenchless fleet and the documented equipment register"
      data-tone="dark"
      className="relative scroll-mt-24 bg-[var(--brand)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-32 lg:px-12">
        {/* the statement */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow-sans text-white/50">Physical capability</p>
            <h2 className="mt-6 font-display text-[8vw] font-normal leading-[1.08] tracking-[-0.025em] text-white/90 sm:text-[6vw] lg:text-[min(4vw,60px)]">
              Built to deliver<span className="text-[var(--accent-display)]">.</span>
            </h2>
          </Reveal>
          <Reveal delay={140} className="lg:col-span-5">
            <p className="max-w-md text-sm leading-[1.8] text-white/55">
              Capability, stated in tonnage. The trenchless fleet drills crossings under roads, rail
              and rivers without opening the surface&nbsp;— owned, not rented, on the
              company&rsquo;s own register.
            </p>
          </Reveal>
        </div>

        {/* the rig + the fleet gauge */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
              <SiteImage
                src={EQUIPMENT_RIG.src}
                sizes="(max-width: 1024px) 100vw, 58vw"
                alt={EQUIPMENT_RIG.alt}
                className="absolute inset-0 h-full w-full object-cover object-[62%_52%]"
              />
            </div>
            <p className="mt-3 font-tech text-[10px] uppercase leading-[1.7] tracking-[0.2em] text-white/40">
              Capex works photograph — {EQUIPMENT_RIG.subject}
            </p>
          </Reveal>

          <Reveal delay={140} className="lg:col-span-5">
            <ul aria-label="Documented trenchless fleet — pullback classes">
              {fleet.map((f) => (
                <li
                  key={f.tonnes}
                  className="flex items-baseline justify-between gap-6 border-t border-white/15 py-6 first:border-t md:py-7"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="font-display text-[54px] font-normal leading-none tracking-[-0.02em] text-white md:text-[60px]">
                      {f.tonnes}
                      <span className="ml-1 align-super font-tech text-[12px] tracking-[0.08em] text-white/45">
                        T
                      </span>
                    </span>
                    <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-white/45">
                      {FLEET_LABEL[f.tonnes] ?? "Pullback class"}
                    </span>
                  </span>
                  {qtyFor(f.tonnes) && (
                    <span className="shrink-0 font-tech text-[11px] tracking-[0.1em] text-white/60">
                      × {qtyFor(f.tonnes)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-5 font-tech text-[10px] uppercase leading-[1.9] tracking-[0.18em] text-white/40">
              Drillto HDD fleet — 32, 28 and 20-tonne pullback machines on the documented register.
              Rig pictured is Capex works photography from the same records.
            </p>
          </Reveal>
        </div>

        {/* the documented equipment register — read verbatim from records */}
        <Reveal delay={200}>
          <div className="mt-14 border-t border-white/15 pt-8">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <p className="eyebrow-sans text-white/50">The documented register</p>
              <span aria-hidden="true" className="hidden h-px flex-1 bg-white/10 sm:block" />
              <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-white/40">
                {equipment.length} items
              </span>
            </div>
            <ul
              aria-label="Documented equipment register"
              className="mt-5 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4"
            >
              {equipment.map((e, i) => (
                <li key={`${e.item}-${e.spec ?? ""}`} className="border-b border-white/10 py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="flex min-w-0 items-baseline gap-3">
                      <span className="font-tech text-[10px] tracking-[0.1em] text-white/35">
                        {num(i + 1)}
                      </span>
                      <span className="min-w-0 text-[13px] leading-snug text-white/75">
                        {e.item}
                      </span>
                    </span>
                    {e.qty && (
                      <span className="shrink-0 font-tech text-[10px] tracking-[0.1em] text-white/50">
                        × {e.qty}
                      </span>
                    )}
                  </div>
                  {e.spec && (
                    <p className="mt-1 pl-[26px] text-[11px] leading-snug text-white/40">
                      {e.spec}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-tech text-[10px] uppercase leading-[1.8] tracking-[0.18em] text-white/35">
              Equipment register from company records — DOC C p5
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
