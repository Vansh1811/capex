import { Reveal } from "@/components/site/home/Reveal";

/**
 * Opening (Credentials): the register's typeset head — where the page now
 * begins. A compact editorial introduction on the warm ivory paper rather
 * than a tall dark hero: the company-records eyebrow and the official-
 * records metadata sit a baseline apart, the headline stays dominant, and
 * the record's supporting copy holds the left of a two-column composition
 * with the count and file reference secondary on the right. The hairline
 * beneath hands off cleanly to the register rows that follow.
 */
export function Opening({ entries }: { entries: number }) {
  return (
    <section
      aria-label="The register — company records"
      data-tone="light"
      className="paper relative text-foreground"
    >
      <div className="mx-auto max-w-[1440px] px-6 pb-14 pt-28 md:px-10 md:pb-20 md:pt-36 lg:px-12 lg:pt-44">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
            <p className="eyebrow-sans text-muted-foreground/70">
              Capex <span className="text-accent">/</span> Company records
            </p>
            <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              Official records · verification available
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-8 font-display text-[12.5vw] font-normal leading-[1.0] tracking-[-0.03em] md:mt-10 md:text-[9vw] lg:text-[min(6.5vw,100px)]">
            The register.
          </h1>
        </Reveal>

        {/* the supporting composition — copy primary, record metadata secondary */}
        <Reveal delay={160}>
          <div className="mt-10 grid items-baseline gap-8 border-t border-foreground/15 pt-8 md:mt-12 lg:grid-cols-12 lg:gap-12">
            <p className="max-w-[46ch] text-sm leading-[1.85] text-muted-foreground md:text-[15px] lg:col-span-7">
              A record of Capex&rsquo;s registrations and statutory documentation, presented for
              reference and verification.
            </p>
            <div className="lg:col-span-5 lg:text-right">
              <p className="font-tech text-[11px] uppercase tracking-[0.16em] text-foreground/75">
                {String(entries).padStart(2, "0")} entries of record
              </p>
              <p className="mt-1.5 font-tech text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                File ref CCEPL/REG · from the certificates of record
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
