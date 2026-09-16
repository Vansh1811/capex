import { useState } from "react";
import { Reveal } from "@/components/site/home/Reveal";
import { RequestForm } from "./RequestForm";
import type { RegisterCredential } from "@/lib/site-data";

/**
 * VERIFICATION DESK (Credentials): the request function elevated to a major
 * section — procurement and vendor-emablement teams requesting supporting
 * documentation against a registration. The desk states exactly what can be
 * requested (the document classes on file, verified) and carries the request
 * form itself — the second of the site's two dynamic flows. The records stay
 * static register content; only the REQUEST is persisted (CREQ reference),
 * by the same atomic RPC contract as the enquiry form.
 */
export function VerificationDesk({
  credentials,
  selectedCredential,
}: {
  /** The published register — the source of the requestable document classes. */
  credentials: RegisterCredential[];
  /** Title pre-selected from an EvidenceSheet request link, if any. */
  selectedCredential?: string;
}) {
  const [requestSent, setRequestSent] = useState(false);

  return (
    <section
      id="verification-desk"
      aria-label="Verification desk — request verification documents"
      data-tone="light"
      className="paper relative text-foreground"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-12 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* the desk statement + the request form */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <p className="eyebrow-sans text-muted-foreground/70">Verification desk</p>
                <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  On request
                </p>
              </div>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-8 max-w-md text-sm leading-[1.85] text-muted-foreground md:text-[15px]">
                Procurement and vendor-emablement teams can request supporting documentation against
                any registration in the register — certificates, GSTIN letters, the incorporation
                record — and receive the scans or certified copies on file.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className={requestSent ? "mt-10" : "mt-14"}>
                <RequestForm
                  documents={credentials.map((c) => ({ title: c.title, number: c.number }))}
                  initialCredential={selectedCredential}
                  onSentRef={() => setRequestSent(true)}
                />
              </div>
            </Reveal>
          </div>

          {/* what's on file — the document classes, verified */}
          <div className="lg:col-span-5 lg:pl-8">
            <Reveal delay={200}>
              <div className="border-t border-foreground/20">
                {[
                  "Certificate of Incorporation",
                  "GST REG-06 certificates — five states",
                  "Udyam (MSME) registration",
                  "ESI registration",
                ].map((d, i) => (
                  <div
                    key={d}
                    className="flex items-baseline justify-between gap-6 border-b border-foreground/15 py-5"
                  >
                    <p className="text-sm leading-relaxed text-foreground/90 md:text-[15px]">{d}</p>
                    <p className="font-tech text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                      {String(i + 1).padStart(2, "0")}
                    </p>
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
