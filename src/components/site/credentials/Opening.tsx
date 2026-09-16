import { Reveal } from "@/components/site/home/Reveal";
import { useEntrance } from "@/components/site/home/HeroVideo";

/**
 * Opening (Credentials): the first frame of PROOF OF PRACTICE — deep earth,
 * almost black, no imagery at all. Where every sibling page opens on an
 * atmosphere plate, this page opens on the record itself: a registration
 * mark, the statement, and three figures of record. The material is the
 * survey grid at quarter strength — the room the paperwork sits in. The
 * three metadata figures are the only verified counts (registrations,
    certifications of record, GST states) — certifications read as 01 because
 * the published register carries the MSME membership; nothing counted here
 * is invented.
 */
export function Opening({
  registrations,
  certifications,
  gstStates,
}: {
  registrations: number;
  certifications: number;
  gstStates: number;
}) {
  const enter = useEntrance(150);

  return (
    <section
      aria-label="Credentials — proof, not promises"
      data-tone="dark"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      <div
        aria-hidden="true"
        className="survey-grid pointer-events-none absolute inset-0 opacity-25"
      />
      {/* registration mark, top right — the record stamp */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute right-6 top-24 hidden select-none font-tech text-[10px] uppercase tracking-[0.3em] text-white/25 md:block md:right-10 lg:right-12 ${enter(4).className}`}
        style={enter(4).style}
      >
        Reg. record · 2012 —
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-6 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40 lg:px-12">
        <Reveal delay={60}>
          <p className="eyebrow-sans text-white/45">Credentials</p>
        </Reveal>

        <div className="mt-10 md:mt-14">
          <h1 className="max-w-[14ch] font-display text-[12.5vw] font-normal leading-[1.02] tracking-[-0.025em] md:text-[80px] lg:text-[min(7.6vw,124px)]">
            {["Proof,", "not promises."].map((line, i) => {
              const e = enter(i);
              return (
                <span key={line} className={`block ${e.className}`} style={e.style}>
                  {line}
                </span>
              );
            })}
          </h1>
          <p
            className={`mt-8 max-w-md text-sm leading-[1.85] text-white/65 md:text-[15px] ${enter(2).className}`}
            style={enter(2).style}
          >
            Registrations, statutory records and certifications establish the verifiable foundation
            of the practice — numbers you can check, not claims you must take on trust. Every entry
            in the register below is transcribed from the company record.
          </p>
        </div>

        {/* figures of record — verified counts only, quiet editorial scale */}
        <div className={`mt-auto pt-20 md:pt-28 ${enter(3).className}`} style={enter(3).style}>
          <div className="grid grid-cols-3 gap-6 border-t border-white/15 pt-8 sm:max-w-2xl sm:gap-12 md:pt-10">
            {[
              { label: "Registrations", value: registrations },
              { label: "Certifications of record", value: certifications },
              { label: "GST states", value: gstStates },
            ].map((f) => (
              <div key={f.label}>
                <p className="font-tech text-3xl font-normal leading-none text-white md:text-4xl">
                  {String(f.value).padStart(2, "0")}
                </p>
                <p className="mt-3 text-[10px] uppercase leading-[1.6] tracking-[0.18em] text-white/45 sm:text-[11px]">
                  {f.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
