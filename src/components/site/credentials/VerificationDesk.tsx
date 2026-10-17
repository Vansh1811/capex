import { Reveal } from "@/components/site/home/Reveal";
import { RequestForm } from "./RequestForm";
import type { RegisterCredential } from "@/lib/site-data";

/**
 * VERIFICATION DESK (Credentials): the desk as the register's counterpart —
 * left, the request itself (the headline, the procurement line, and the
 * form inside a bordered panel on the same warm ivory); right, the index
 * of what the desk can actually release: numbered rows on hairlines with
 * the record's own dates and authorities. Nothing is invented — every row
 * is a document class the verified register holds, and the note repeats
 * the disposition: released against specific request only. Requests are
 * persisted by the same atomic RPC contract as the enquiry (duplicate
 * screen, rate limit, CREQ reference).
 */

/** The document classes on file — dates and authorities from the register itself. */
const REQUESTABLE: { title: string; note: string }[] = [
  {
    title: "Certificate of Incorporation",
    note: "Registrar of Companies, Uttar Pradesh — recorded 26 December 2012",
  },
  {
    title: "GST REG-06 certificates",
    note: "Five registrations of record — Uttar Pradesh, Maharashtra, Bihar, Delhi, Haryana",
  },
  {
    title: "Udyam (MSME) registration",
    note: "Ministry of MSME — recorded 17 February 2021",
  },
  {
    title: "ESI registration",
    note: "Employees' State Insurance Corporation — recorded 1 May 2018",
  },
];

export function VerificationDesk({
  credentials,
  selectedCredential,
}: {
  /** The published register — the source of the requestable document classes. */
  credentials: RegisterCredential[];
  /** Title pre-selected from an EvidenceSheet request link, if any. */
  selectedCredential?: string;
}) {
  return (
    <section
      id="verification-desk"
      aria-label="Verification desk — request verification documents"
      data-tone="light"
      className="paper relative text-foreground"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-28 lg:px-12 lg:py-32">
        {/* the seam — the desk labeled as the register's next movement */}
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2 border-b border-foreground/15 pb-6">
            <p className="eyebrow-sans text-muted-foreground/70">Verification desk</p>
            <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              Documents released on request only
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-14 md:mt-14 lg:grid-cols-12 lg:gap-12">
          {/* the request — statement + the form in its panel */}
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <h2 className="max-w-[16ch] font-display text-3xl font-normal leading-[1.06] tracking-[-0.02em] md:text-4xl lg:text-[2.8rem]">
                Ask for the paperwork.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-[1.85] text-muted-foreground md:text-[15px]">
                Procurement and vendor-enablement teams can request supporting documentation against
                a specific registration in the register.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-10 border border-foreground/20 bg-[var(--surface)]/50 p-6 md:p-10">
                <RequestForm
                  documents={credentials.map((c) => ({ title: c.title, number: c.number }))}
                  initialCredential={selectedCredential}
                />
              </div>
            </Reveal>
          </div>

          {/* what the desk holds — the document classes of record */}
          <div className="lg:col-span-5 lg:pl-6">
            <Reveal delay={160}>
              <p className="font-tech text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
                What can be requested
              </p>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-6 border-t border-foreground/15">
                {REQUESTABLE.map((d, i) => (
                  <div
                    key={d.title}
                    className="flex items-baseline gap-5 border-b border-foreground/15 py-5"
                  >
                    <span
                      aria-hidden="true"
                      className="font-tech text-[11px] tracking-[0.12em] text-accent"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] leading-snug text-foreground/90 md:text-base">
                        {d.title}
                      </p>
                      <p className="mt-1.5 text-[12px] leading-[1.7] text-muted-foreground/85">
                        {d.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[12px] leading-[1.8] text-muted-foreground/80">
                Documents are released against specific request only — nothing is published
                unrequested, nothing is fabricated for publication.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
