import { useEffect, useRef, useState } from "react";
import { trapFocus } from "@/lib/focus-trap";
import type { RegisterCredential } from "@/lib/site-data";

/**
 * EvidenceSheet (Credentials): the evidence view for a selected register
 * entry — not a modal card. An archival document sheet, clipped up from
 * the lower edge into the right margin (full-bleed bottom on mobile),
 * with the registration number as the largest fact in the room and the
 * supporting metadata revealing in sequence. Where a real certificate
 * scan exists it will sit in the document slot (scan === "approved");
 * today every entry reads "document available on request" and links to
 * the verification desk — a slot that never implies a file that isn't
 * there. Esc closes; focus is trapped while open and returns to the row.
 */
const SEQ = [420, 560, 700, 840];

export function EvidenceSheet({
  credential,
  onClose,
  onRequest,
}: {
  credential: RegisterCredential | null;
  onClose: () => void;
  /** Fired when the visitor asks for this document — the desk form pre-selects it. */
  onRequest?: (title: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [seq, setSeq] = useState(0);

  // mount/unmount with the credential; drive the entrance after paint
  useEffect(() => {
    if (!credential) {
      setMounted(false);
      setShown(false);
      setSeq(0);
      return;
    }
    setMounted(true);
    const raf1 = requestAnimationFrame(() => setShown(true));
    const timers = SEQ.map((ms, i) => window.setTimeout(() => setSeq(i + 1), ms));
    return () => {
      cancelAnimationFrame(raf1);
      timers.forEach(clearTimeout);
    };
  }, [credential]);

  // focus in, trap, restore on unmount
  useEffect(() => {
    if (!mounted) return;
    closeRef.current?.focus();
    const panel = panelRef.current;
    const release = panel ? trapFocus(panel) : null;
    const prev = document.activeElement as HTMLElement | null;
    return () => {
      release?.();
      prev?.focus?.();
    };
  }, [mounted]);

  if (!credential || !mounted) return null;
  const c = credential;

  return (
    <div className="fixed inset-0 z-[70]">
      {/* dim the register behind — subtle, warm, no blur */}
      <button
        type="button"
        aria-label="Close evidence view"
        onClick={onClose}
        className={`absolute inset-0 bg-[oklch(0.185_0.02_60/0.55)] transition-opacity duration-500 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* the sheet — clipped up from the lower edge */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Evidence — ${c.title}`}
        className={`fixed z-10 flex max-h-[92svh] w-full flex-col overflow-y-auto bg-[var(--background)] text-foreground shadow-[var(--shadow-overlay)] transition-[clip-path,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] bottom-0 inset-x-0 sm:left-auto sm:right-0 sm:top-auto sm:w-[min(92vw,600px)] sm:max-h-[94svh] ${
          shown
            ? "[clip-path:inset(0_0_0_0_round_0)] translate-y-0"
            : "[clip-path:inset(0_0_100%_0)] translate-y-[3%]"
        }`}
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {/* sheet head */}
        <div className="flex items-center justify-between border-b border-foreground/10 bg-[var(--surface)]/60 px-6 py-4 md:px-10">
          <p className="font-tech text-[10px] uppercase tracking-[0.26em] text-muted-foreground/70">
            Credential · {String(c.n).padStart(2, "0")}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="group flex items-center gap-2 font-tech text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Close
            <span
              aria-hidden="true"
              className="inline-block text-sm transition-transform duration-300 group-hover:rotate-90"
            >
              ✕
            </span>
          </button>
        </div>

        {/* the number — the fact of record */}
        <div className="px-6 pb-10 pt-10 md:px-10 md:pt-14">
          <RevealStep show={seq >= 1} delay={0}>
            <p className="font-tech text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
              Registration type
            </p>
            <h3 className="mt-4 max-w-[24ch] font-display text-3xl font-normal leading-[1.06] tracking-[-0.02em] sm:text-4xl">
              {c.title}
            </h3>
            <p className="mt-8 break-all font-tech text-[clamp(1.75rem,6.5vw,3rem)] leading-[1.05] tracking-[0.02em] text-foreground">
              {c.number}
            </p>
          </RevealStep>

          {/* metadata in sequence */}
          <dl className="mt-12 border-t border-foreground/15">
            <RevealStep show={seq >= 2} delay={0}>
              <MetaRow label="Jurisdiction" value={c.jurisdiction} />
            </RevealStep>
            <RevealStep show={seq >= 2} delay={90}>
              <MetaRow label="Issuing authority" value={c.issuer} />
            </RevealStep>
            <RevealStep show={seq >= 3} delay={0}>
              <MetaRow label="Status" value="Recorded · verifiable" />
            </RevealStep>
            <RevealStep show={seq >= 3} delay={90}>
              <MetaRow
                label="Recorded"
                value={c.issued_at ? formatDate(c.issued_at) : "As per certificate of record"}
              />
            </RevealStep>
          </dl>

          {/* document slot — real scans when they exist; never faked */}
          <RevealStep show={seq >= 4} delay={0}>
            {c.scan === "approved" ? (
              <a
                href="#document"
                className="group mt-10 block border border-foreground/20 bg-[var(--surface)]/40 p-6 transition-colors hover:border-foreground/45"
              >
                <p className="font-tech text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                  Document on file
                </p>
                <p className="mt-3 font-display text-xl font-normal tracking-[-0.01em]">
                  Open certificate scan
                  <span
                    aria-hidden="true"
                    className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </p>
              </a>
            ) : (
              <div className="mt-10 border border-dashed border-foreground/25 p-6">
                <p className="font-tech text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                  Document
                </p>
                <p className="mt-3 font-display text-xl font-normal tracking-[-0.01em]">
                  Available on request
                </p>
                <p className="mt-3 text-[13px] leading-[1.75] text-muted-foreground">
                  The certificate behind this entry is held on file. Procurement and
                  vendor-emablement teams can request it through the verification desk.
                </p>
              </div>
            )}
          </RevealStep>

          {/* the path onward */}
          <RevealStep show={seq >= 4} delay={120}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
              <a
                href="#verification-desk"
                onClick={() => onRequest?.(c.title)}
                className="group inline-flex w-fit items-center gap-3 border-b border-foreground/40 pb-2 transition-colors hover:border-foreground"
              >
                <span className="font-display text-lg font-medium tracking-[-0.01em]">
                  Request this document
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  →
                </span>
              </a>
              <p className="font-tech text-[10px] uppercase leading-[1.7] tracking-[0.14em] text-muted-foreground/60">
                Source of record · {c.source_ref}
              </p>
            </div>
          </RevealStep>
        </div>
      </div>
    </div>
  );
}

/** One metadata row: mono label left, value right, hairline beneath. */
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-foreground/15 py-4">
      <dt className="font-tech text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-foreground/90 md:text-[15px]">{value}</dd>
    </div>
  );
}

/** A step of the reveal sequence — opacity + small rise, per the sheet's choreography. */
function RevealStep({
  show,
  delay,
  children,
}: {
  show: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** "2012-12-26" → "26 December 2012" — display only; the record stays ISO. */
function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
