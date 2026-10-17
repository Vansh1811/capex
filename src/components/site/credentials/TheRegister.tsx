import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/home/Reveal";
import type { RegisterCredential } from "@/lib/site-data";
import { EvidenceSheet } from "./EvidenceSheet";

/**
 * THE REGISTER (Credentials): the primary archive — a typeset index in the
 * drawing-sheet grammar, not cards, not a spreadsheet. Each entry is one
 * keyboard-operable row on a stable four-column grid: the index mark, the
 * class of record (kind · jurisdiction · recorded year), the registration
 * itself with its identifier set beneath in IBM Plex Mono, and the VERIFY
 * affordance right-aligned. Hairline rules separate entries; the hover is
 * restrained — a faint ink tint, a copper tick at the margin, the action
 * advancing. Selecting a row opens the EvidenceSheet, a document panel
 * clipped up from the register (anchored right on desktop, full-width on
 * mobile), where the number is the largest fact in the room. Esc closes;
 * focus returns to the row. Identifiers stay verbatim, never restyled.
 */

/** The register's column rhythm — shared by the key row and every entry. */
const REGISTER_GRID = "md:grid-cols-[3.25rem_9.5rem_minmax(0,1fr)_auto]";
const REGISTER_GAP = "md:gap-x-6 lg:gap-x-10";

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
      <div className="mx-auto max-w-[1440px] px-6 pb-24 md:px-10 md:pb-32 lg:px-12 lg:pb-40">
        {/* the column key — the archive's index notation (desktop only) */}
        <Reveal>
          <div
            className={`hidden pb-3 font-tech text-[9px] uppercase tracking-[0.22em] text-muted-foreground/50 md:grid ${REGISTER_GRID} ${REGISTER_GAP}`}
          >
            <span>No.</span>
            <span>Class of record</span>
            <span>Registration of record</span>
            <span>Action</span>
          </div>
        </Reveal>

        {/* the index */}
        <div
          role="list"
          aria-label="Registrations of record"
          className="border-t border-foreground/15"
        >
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
 * One register row: an index entry on the shared column grid. The class of
 * record lines up in its own column on desktop and folds above the title
 * on mobile; the identifier sits beneath the name; VERIFY holds the right.
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
  <Reveal delay={delay}>
    <button
      type="button"
      ref={ref}
      role="listitem"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${c.title}, number ${c.number}, ${c.jurisdiction}. Open evidence view`}
      className={`group relative grid w-full grid-cols-[2.25rem_1fr] items-baseline gap-x-4 border-b border-foreground/15 py-7 text-left transition-colors duration-300 hover:bg-foreground/[0.035] focus-visible:bg-foreground/[0.035] md:py-8 lg:py-9 ${REGISTER_GRID} ${REGISTER_GAP}`}
    >
      {/* the margin tick — copper, metered, arrives on hover/focus */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1/2 hidden h-px w-3 -translate-y-1/2 bg-accent/0 transition-colors duration-300 group-hover:bg-accent md:block"
      />
      {/* index mark */}
      <span className="font-tech text-[11px] tracking-[0.15em] text-muted-foreground/60 transition-colors duration-300 group-hover:text-accent">
        {String(c.n).padStart(2, "0")}
      </span>

      {/* class of record — its own column on desktop */}
      <span className="hidden md:block md:self-center">
        <span className="block font-tech text-[10px] uppercase leading-[1.5] tracking-[0.2em] text-muted-foreground/70">
          {c.kind === "membership" ? "Membership" : "Registration"}
        </span>
        <span className="mt-1.5 block font-tech text-[10px] uppercase leading-[1.5] tracking-[0.14em] text-muted-foreground/50">
          {c.jurisdiction}
        </span>
        {c.issued_at ? (
          <span className="mt-1.5 block font-tech text-[10px] uppercase leading-[1.5] tracking-[0.14em] text-muted-foreground/50">
            Recorded {c.issued_at.slice(0, 4)}
          </span>
        ) : null}
      </span>

      {/* registration of record — name primary, identifier beneath */}
      <span className="min-w-0">
        <span className="mb-3 block font-tech text-[10px] uppercase leading-[1.6] tracking-[0.18em] text-muted-foreground/70 md:hidden">
          {c.kind === "membership" ? "Membership" : "Registration"} · {c.jurisdiction}
          {c.issued_at ? ` · recorded ${c.issued_at.slice(0, 4)}` : ""}
        </span>
        <span className="block font-display text-[1.4rem] font-normal leading-[1.15] tracking-[-0.015em] sm:text-[1.6rem] lg:text-[1.8rem]">
          {c.title}
        </span>
        <span className="mt-2.5 block break-all font-tech text-[13px] tracking-[0.05em] text-foreground/70 transition-colors duration-300 group-hover:text-foreground md:text-sm">
          {c.number}
        </span>
      </span>

      {/* the action — VERIFY, advancing on hover */}
      <span className="col-span-2 mt-5 flex items-center gap-3 font-tech text-[10px] uppercase tracking-[0.24em] text-muted-foreground/60 transition-colors duration-300 group-hover:text-accent md:col-span-1 md:mt-0 md:justify-self-end md:self-center">
        Verify
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
        >
          →
        </span>
      </span>
    </button>
  </Reveal>
);
