import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import type { RegisterCredential } from "@/lib/site-data";
import { EvidenceSheet } from "./EvidenceSheet";

/**
 * THE REGISTER (Credentials): the primary archive — large typographic
 * records, not cards, not a table. Each row is an index entry in an archival
 * document: registration number large enough to read, type and jurisdiction
 * in support, a VERIFY affordance, a rule beneath. Selecting a row opens the
 * EvidenceSheet — a document panel clipped up from the register, anchored
 * right on desktop and full-width on mobile — where the number is the
 * largest fact in the room and metadata reveals in sequence. Keyboard
 * visitors get the same interaction (Enter/Space), Esc closes, focus
 * returns to the row.
 */
export function TheRegister({
  credentials,
  sourceNote,
  onRequest,
}: {
  credentials: RegisterCredential[];
  sourceNote: string;
  /** Notified when a visitor asks to request a specific document (EvidenceSheet link). */
  onRequest?: (title: string) => void;
}) {
  const [open, setOpen] = useState<RegisterCredential | null>(null);
  const returnRef = useRef<HTMLButtonElement | null>(null);

  // the register's own row focus target for restoring focus after the sheet
  const rowRefs = useRef(new Map<number, HTMLButtonElement>());

  function openSheet(c: RegisterCredential) {
    returnRef.current = rowRefs.current.get(c.n) ?? null;
    setOpen(c);
  }

  function closeSheet() {
    setOpen(null);
    requestAnimationFrame(() => returnRef.current?.focus());
  }

  // Esc closes the sheet from anywhere in it
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section
      aria-label="The register — registrations of record"
      data-tone="light"
      className="paper relative text-foreground"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-12 lg:py-40">
        {/* the archival head — index notation, file mark, date line */}
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-foreground/15 pb-8">
            <h2 className="font-display text-[10.5vw] font-normal leading-[1.02] tracking-[-0.025em] sm:text-[8vw] lg:text-[min(5.4vw,84px)]">
              The register.
            </h2>
            <p className="eyebrow-sans text-muted-foreground/70">
              {credentials.length} entries of record
            </p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-6 font-tech text-[10px] uppercase leading-[1.7] tracking-[0.2em] text-muted-foreground/55">
            File ref CCEPL/REG · transcribed from certificates of record · verify any entry against
            the source
          </p>
        </Reveal>

        {/* the index */}
        <div role="list" aria-label="Registrations of record">
          {credentials.map((c, i) => (
            <RegisterRow
              key={c.n}
              ref={(el) => {
                if (el) rowRefs.current.set(c.n, el);
              }}
              c={c}
              delay={Math.min(i * 90, 720)}
              onOpen={() => openSheet(c)}
            />
          ))}
        </div>

        <Reveal delay={140}>
          <p className="mt-10 max-w-xl text-[12px] leading-[1.8] text-muted-foreground/80">
            {sourceNote}
          </p>
        </Reveal>
      </div>

      {/* the evidence panel — clipped up over the register */}
      <EvidenceSheet
        credential={open}
        onClose={closeSheet}
        onRequest={(title) => {
          onRequest?.(title);
          closeSheet();
        }}
      />
    </section>
  );
}

/**
 * One register row: an index entry. The number is the fact; the type and
 * jurisdiction support it. The whole row is one button — no nested
 * interactive dead ends — with a VERIFY caret that arrives on hover/focus.
 */
const RegisterRow = ({
  c,
  delay,
  onOpen,
  ref,
}: {
  c: RegisterCredential;
  delay: number;
  onOpen: () => void;
  ref?: React.RefCallback<HTMLButtonElement>;
}) => (
  <Reveal delay={delay} className="border-b border-foreground/15">
    <button
      type="button"
      ref={ref}
      role="listitem"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${c.title}, number ${c.number}, ${c.jurisdiction}. Open evidence view`}
      className="group relative grid w-full grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-8 text-left transition-colors duration-300 md:grid-cols-[4rem_minmax(0,1fr)_auto] md:gap-x-8 md:py-10 lg:py-12"
    >
      {/* the index mark — a registration tick that draws on hover/focus */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1/2 hidden h-px w-2 -translate-y-1/2 bg-accent/0 transition-colors duration-300 group-hover:bg-accent md:block"
      />
      {/* index number */}
      <span className="font-tech text-xs tracking-[0.15em] text-muted-foreground/60 transition-colors duration-300 group-hover:text-accent">
        {String(c.n).padStart(2, "0")}
      </span>

      {/* the record */}
      <span className="min-w-0">
        <span className="block font-tech text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
          {c.kind === "membership" ? "Membership" : "Registration"} · {c.jurisdiction}
          {c.issued_at ? ` · recorded ${c.issued_at.slice(0, 4)}` : ""}
        </span>
        <span className="mt-3 block font-display text-2xl font-normal leading-[1.12] tracking-[-0.015em] sm:text-3xl lg:text-[2.6rem]">
          {c.title}
        </span>
        <span className="mt-3 block break-all font-tech text-xl tracking-[0.04em] text-foreground/85 transition-colors duration-300 group-hover:text-foreground sm:text-2xl md:text-[1.75rem]">
          {c.number}
        </span>
      </span>

      {/* verify affordance */}
      <span className="col-span-2 mt-4 flex items-center gap-3 font-tech text-[10px] uppercase tracking-[0.24em] text-muted-foreground/60 transition-colors duration-300 group-hover:text-accent md:col-span-1 md:mt-0 md:justify-self-end md:self-center">
        Verify
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
        >
          →
        </span>
      </span>
    </button>
  </Reveal>
);

/** Grid columns: 24-48px index + fluid record + verify right. */
