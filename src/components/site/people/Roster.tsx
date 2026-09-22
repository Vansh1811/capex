import { useState } from "react";
import { Reveal } from "@/components/site/home/Reveal";
import { GROUP_LABELS, type PersonGroup } from "@/lib/people-corpus";
import type { RosterPerson } from "@/lib/site-data";

/**
 * THE ROSTER — the page's signature: a typographic people index, one hairline
 * per person, NO cards and NO photographs. Each row is a selection button:
 * small mono ordinal · large display name · role in the negative space right
 * · a quiet arrow-mark for the selected person.
 *
 * Selecting a person NEVER expands the row and NEVER moves the roster. The
 * person's PERSONNEL RECORD renders in ONE persistent panel pinned beside
 * the roster (desktop) / stacked below it (mobile):
 *
 *   01 / LEADERSHIP
 *   ANURAG PARASHAR
 *   DIRECTOR
 *   ─────────────────────────────────────────
 *   PROFILE  (verified paragraphs, joined)
 *   ─────────────────────────────────────────
 *   EXPERIENCE            FOCUS
 *   14+ Years             PROJECT EXECUTION · …
 *
 * Only supplied fields render — where no bio was provided the record shows
 * name + role (+ responsibility where supplied) and nothing else. Nothing is
 * invented. Desktop: hover previews, click locks. Mobile: tap selects.
 *
 * Group chapters (leadership / delivery / site & design) come from the
 * verified record. Between chapters, an interruption plate breaks the list so
 * the page reads as an essay, not a directory.
 */
export function Roster({
  people,
  onInterrupt,
}: {
  people: RosterPerson[];
  /** Section interrupt rendered inside the roster flow (React node per slot). */
  onInterrupt: (slot: number) => React.ReactNode;
}) {
  const fallbackDefault = "Anurag Parashar";
  const defaultName = people.some((p) => p.name === fallbackDefault)
    ? fallbackDefault
    : (people[0]?.name ?? null);

  // The locked selection (click / tap) + the transient hover preview.
  // The panel shows preview ?? locked ?? default — the roster never moves.
  const [lockedName, setLockedName] = useState<string | null>(defaultName);
  const [previewName, setPreviewName] = useState<string | null>(null);

  const shownName = previewName ?? lockedName ?? defaultName;
  const shown = people.find((p) => p.name === shownName) ?? null;

  // Ordinal + group per person, in roster order (continuous across chapters).
  const meta = new Map<string, { ordinal: string; group: PersonGroup }>();
  {
    let n = 0;
    for (const g of ["leadership", "delivery", "site_design"] as PersonGroup[]) {
      for (const p of people.filter((r) => r.group === g)) {
        meta.set(p.name, { ordinal: String(n + 1).padStart(2, "0"), group: g });
        n++;
      }
    }
  }

  const groups: PersonGroup[] = ["leadership", "delivery", "site_design"];
  let n = 0;

  return (
    <section
      aria-label="The roster — people of record"
      data-tone="light"
      className="paper relative py-24 md:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1680px] px-6 md:px-10 lg:px-12">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <h2 className="font-display text-[42px] font-normal leading-[1.05] tracking-[-0.02em] md:text-[64px]">
              The roster.
            </h2>
            <p className="max-w-sm text-sm leading-[1.8] text-muted-foreground">
              {people.length} people on the company record, by name and role — hover or select a
              name to read their record.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 md:mt-20">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
            {/* the roster — stable, never expands, never shifts */}
            <div className="lg:col-span-7 xl:col-span-8">
              {groups.map((g) => {
                const rows = people.filter((p) => p.group === g);
                if (rows.length === 0) return null;
                return (
                  <div key={g}>
                    {/* chapter head — the record's own grouping */}
                    <Reveal>
                      <div className="flex flex-wrap items-baseline justify-between gap-4 border-t-2 border-foreground/80 pt-6">
                        <h3 className="eyebrow-sans text-foreground/70">{GROUP_LABELS[g].label}</h3>
                        <p className="font-tech text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
                          {GROUP_LABELS[g].note}
                        </p>
                      </div>
                    </Reveal>
                    <ul
                      onMouseLeave={() => setPreviewName(null)}
                      onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                          setPreviewName(null);
                        }
                      }}
                    >
                      {rows.map((p) => {
                        const i = n++;
                        const ordinal = String(i + 1).padStart(2, "0");
                        const isActive = p.name === shownName;
                        return (
                          <li key={p.name} className="group">
                            <Reveal>
                              <div
                                className={`border-b border-foreground/15 ${
                                  g === "delivery" ? "md:py-2 lg:py-3" : "md:py-2 lg:py-2"
                                }`}
                              >
                                {/* the roster row — selects the record beside it */}
                                <button
                                  type="button"
                                  aria-current={isActive}
                                  onClick={() => {
                                    setLockedName(p.name);
                                    setPreviewName(null);
                                  }}
                                  onMouseEnter={() => setPreviewName(p.name)}
                                  onFocus={() => setPreviewName(p.name)}
                                  className="flex w-full cursor-pointer items-baseline gap-4 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] md:gap-8 md:py-8 lg:py-9"
                                >
                                  <span
                                    aria-hidden="true"
                                    className={`w-8 shrink-0 font-tech text-[11px] tracking-[0.1em] transition-colors duration-300 ${
                                      isActive
                                        ? "text-[var(--accent)]"
                                        : "text-muted-foreground/70 group-hover:text-[var(--accent)]"
                                    }`}
                                  >
                                    {ordinal}
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span
                                      className={`block font-display text-[28px] font-normal leading-[1.1] tracking-[-0.02em] transition-[letter-spacing,color] duration-300 sm:text-[36px] lg:text-[44px] ${
                                        isActive
                                          ? "text-foreground"
                                          : "text-foreground/85 group-hover:text-foreground"
                                      } group-hover:tracking-[-0.012em]`}
                                    >
                                      {p.name}
                                    </span>
                                    {/* mobile: role under the name so the roster
                                        stays scannable without a side column */}
                                    <span className="mt-2 block font-tech text-[11px] uppercase tracking-[0.14em] text-foreground/70 sm:hidden">
                                      {p.role}
                                    </span>
                                  </span>
                                  <span className="ml-auto hidden shrink-0 text-right sm:block">
                                    <span className="block font-tech text-[11px] uppercase tracking-[0.14em] text-foreground/75">
                                      {p.role}
                                    </span>
                                    {p.practice != null && (
                                      <span className="mt-1 block font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                                        {p.practice_label}
                                      </span>
                                    )}
                                  </span>
                                  {/* selection mark — a thin arrow that rests
                                      visible on the selected person only */}
                                  <span
                                    aria-hidden="true"
                                    className={`hidden shrink-0 font-tech text-sm transition-all duration-300 md:block ${
                                      isActive
                                        ? "translate-x-0 text-[var(--accent)] opacity-100"
                                        : "text-foreground/50 opacity-0"
                                    }`}
                                  >
                                    →
                                  </span>
                                </button>
                              </div>
                            </Reveal>
                          </li>
                        );
                      })}
                    </ul>
                    {g !== "site_design" && onInterrupt(g === "leadership" ? 0 : 1)}
                  </div>
                );
              })}
            </div>

            {/* the record — one persistent panel, content only changes */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-24" aria-live="polite">
                {shown && meta.get(shown.name) ? (
                  <ProfileRecord
                    key={shown.name}
                    person={shown}
                    ordinal={meta.get(shown.name)!.ordinal}
                    group={meta.get(shown.name)!.group}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <Reveal>
          <p className="mt-12 font-tech text-[10px] uppercase leading-[1.8] tracking-[0.16em] text-muted-foreground/60">
            Roster of record · names, roles and profiles as supplied — nothing invented
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * PROFILE RECORD — the personnel brief pinned beside the roster. A light
 * editorial object, not a card: square edges, no shadow, no photograph, warm
 * elevated-ivory ground with ink type, one copper rule up top, fine hairlines
 * within, and a quiet oversized ordinal ghosted behind the file head. The
 * panel is capped to the viewport with its own internal scroll, so the full
 * record is always reachable at normal zoom — the page itself never needs
 * to move for it; only this panel's contents crossfade.
 */
function ProfileRecord({
  person,
  ordinal,
  group,
}: {
  person: RosterPerson;
  ordinal: string;
  group: PersonGroup;
}) {
  const hasProfile = person.profile != null && person.profile.length > 0;
  const hasFocus = person.focus != null && person.focus.length > 0;
  const hasDetail =
    hasProfile || hasFocus || person.experience != null || person.responsibility != null;

  return (
    <div className="animate-reveal relative overflow-hidden border border-foreground/15 bg-[var(--surface-elevated)] text-foreground lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto lg:overscroll-contain">
      {/* copper file-rule */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]/70" />
      {/* ghost ordinal — the record number set large behind the file head */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-8 select-none font-display text-[118px] font-normal leading-none tracking-[-0.03em] text-foreground/[0.07]"
      >
        {ordinal}
      </div>
      <div className="relative px-6 py-9 md:px-9 md:py-11">
        {/* file head — identifier left, record kind right */}
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-tech text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
            {ordinal} / {GROUP_LABELS[group].label}
          </p>
          <p className="font-tech text-[10px] uppercase tracking-[0.24em] text-foreground/40">
            Personnel record
          </p>
        </div>

        <p className="mt-9 font-display text-[34px] font-normal leading-[1.04] tracking-[-0.025em] text-foreground md:text-[40px]">
          {person.name}
        </p>
        <p className="mt-3 flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.22em] text-foreground/60">
          <span aria-hidden="true" className="inline-block h-px w-6 bg-[var(--accent)]/70" />
          {person.role}
        </p>

        {hasProfile ? (
          <div className="mt-9 border-t border-foreground/15 pt-8">
            <p className="font-tech text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
              Profile
            </p>
            <p className="mt-4 max-w-[52ch] text-[14.5px] leading-[1.9] text-foreground/75">
              {person.profile!.join(" ")}
            </p>
          </div>
        ) : (
          !hasDetail && (
            <div className="mt-9 border-t border-foreground/15 pt-8">
              <p className="text-[13px] leading-[1.8] text-foreground/45">
                Name and role of record — no further detail supplied.
              </p>
            </div>
          )
        )}

        {(person.experience != null || hasFocus || person.responsibility != null) && (
          <div className="mt-9 border-t border-foreground/15 pt-8">
            <div className="grid gap-8 sm:grid-cols-2">
              {person.experience != null && (
                <div>
                  <p className="font-tech text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
                    Experience
                  </p>
                  <p className="mt-3 font-display text-[38px] font-normal leading-none tracking-[-0.02em] text-foreground">
                    {person.experience}
                  </p>
                  <p className="mt-2 font-tech text-[10px] uppercase tracking-[0.18em] text-foreground/40">
                    Of record
                  </p>
                </div>
              )}
              {hasFocus && (
                <div>
                  <p className="font-tech text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
                    Focus
                  </p>
                  <div className="mt-3 space-y-2">
                    {person.focus!.map((f) => (
                      <p
                        key={f}
                        className="flex items-baseline gap-2.5 font-tech text-[11px] uppercase leading-relaxed tracking-[0.14em] text-foreground/70"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-block h-1 w-1 shrink-0 translate-y-[-2px] bg-[var(--accent)]/70"
                        />
                        {f}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {person.responsibility != null && (
              <div className="mt-8 border-t border-foreground/10 pt-7">
                <p className="font-tech text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
                  Responsibility
                </p>
                <p className="mt-3 text-sm leading-[1.85] text-foreground/75">
                  {person.responsibility}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
