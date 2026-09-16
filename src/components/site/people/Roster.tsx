import { useRef, useState } from "react";
import { Reveal } from "@/components/site/home/Reveal";
import { GROUP_LABELS, type PersonGroup } from "@/lib/people-corpus";
import type { RosterPerson } from "@/lib/site-data";
import { ReferenceNote } from "./PeopleExperience";

/** The plate each roster row reveals — atmosphere frames, deterministically
 *  assigned per person so hover states are stable across sessions. NEVER a
 *  portrait of the named person: these are atmosphere plates about the work
 *  the role does, captioned as reference imagery. */
const PLATES = [
  { src: "/uploads/people/planning.jpg", pos: "object-[58%_46%]", scale: "scale-[1.02]" },
  { src: "/uploads/people/panel.jpg", pos: "object-[50%_38%]", scale: "scale-[1.04]" },
  { src: "/uploads/people/welder.jpg", pos: "object-[54%_50%]", scale: "scale-[1.02]" },
  { src: "/uploads/people/wide-crew.jpg", pos: "object-[46%_52%]", scale: "scale-[1.03]" },
  { src: "/uploads/people/hands-wrench.jpg", pos: "object-[52%_50%]", scale: "scale-[1.02]" },
  { src: "/uploads/people/workshop-portrait.jpg", pos: "object-[48%_44%]", scale: "scale-[1.04]" },
];

/** Deterministic per name (cropOf pattern from the Projects archive — no
 *  Math.random, no hydration mismatch). */
function plateOf(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PLATES[h % PLATES.length];
}

/**
 * THE ROSTER — the page's signature: a typographic people index, one hairline
 * per person, NO cards. Each row: small mono ordinal · large display name ·
 * role in the negative space right · practice mark where the record carries
 * one. Hovering (desktop) or focusing (keyboard) reveals a large editorial
 * plate floating to the right of the row — never a tooltip, never a
 * thumbnail: a 3:4 frame about a fifth of the viewport, crossfading and
 * shifting crop between people like slides on a light table. Plates are
 * atmosphere about the role's world (planning, panels, welding, crews,
 * tooling) — explicitly NOT portraits of the named person.
 *
 * Group chapters (leadership / delivery / site & design) come from the
 * verified record — they are the seed's own "group" field, not an invented
 * org chart. Between chapters, an interruption plate breaks the list so the
 * page reads as a photo essay, not a directory.
 */
export function Roster({
  people,
  onInterrupt,
}: {
  people: RosterPerson[];
  /** Section interrupt rendered inside the roster flow (React node per slot). */
  onInterrupt: (slot: number) => React.ReactNode;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [plateMounted, setPlateMounted] = useState(false); // keeps the plate from popping on first hover
  const plateLayerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const layerRef = useRef<HTMLDivElement>(null);

  // measure rows; place the plate vertically against the hovered row
  const place = (i: number | null) => {
    setActive(i);
    if (i != null) setPlateMounted(true);
    const list = layerRef.current;
    const plateBox = plateLayerRef.current?.firstElementChild as HTMLElement | null;
    if (!list || !plateBox) return;
    const row = i != null ? rowRefs.current[i] : null;
    if (!row) return;
    const walk = walkTo(list, row);
    const plateH = plateBox.offsetHeight;
    // center the plate on the row, then nudge up so the bottom stays in view
    const top = Math.max(walk - plateH / 2 + row.offsetHeight / 2, 8);
    const max = list.offsetHeight - plateH - 8;
    plateBox.style.top = `${Math.min(top, Math.max(max, 8))}px`;
  };

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
              {people.length} of the people on the company record, by name and role — the others
              await the client&rsquo;s own review before they are published.
            </p>
          </div>
        </Reveal>

        {/* two-zone composition (desktop): the typographic index owns the
            left, the plate margin owns the right — like a book folio with a
            plate hung in the outer margin. The plate NEVER covers a name or
            role; rows simply end where the plate column begins. */}
        <div className="mt-14 md:mt-20 lg:grid lg:grid-cols-[1fr_360px] lg:gap-12">
          {/* the plate layer — one persistent frame, crossfading between
              people, vertically tracked to the hovered row. Only desktop:
              hover does not exist on touch, where each row keeps its own
              inline image. */}
          <div
            ref={plateLayerRef}
            aria-hidden="true"
            className="pointer-events-none relative z-10 hidden h-0 overflow-visible lg:block"
            style={{ gridColumn: "2" }}
          >
            <div
              className="absolute right-0 aspect-[3/4] max-w-full overflow-hidden"
              style={{
                opacity: plateMounted ? 1 : 0,
                transition: "opacity 480ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {active != null && (
                <img
                  key={people[active].name}
                  src={plateOf(people[active].name).src}
                  alt=""
                  className={`h-full w-full object-cover ${plateOf(people[active].name).pos} [filter:saturate(0.85)_contrast(1.03)] plate-img`}
                />
              )}
              <span className="absolute bottom-3 left-3 bg-black/55 px-2 py-1 font-tech text-[9px] uppercase tracking-[0.2em] text-white/85">
                Reference imagery
              </span>
            </div>
          </div>

          {/* chapters as divs — a chapter wrapper must not be an <li> (the
              interruption slot renders a full <section>, and nested li-in-li
              is invalid HTML that breaks hydration) */}
          <div ref={layerRef} style={{ gridColumn: "1" }}>
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
                  <ul>
                    {rows.map((p) => {
                      const i = n++;
                      const plate = plateOf(p.name);
                      return (
                        <li
                          key={p.name}
                          ref={(el) => {
                            rowRefs.current[i] = el;
                          }}
                          onMouseEnter={() => place(i)}
                          onFocus={() => place(i)}
                          onMouseLeave={() => setActive(null)}
                          onBlur={() => setActive(null)}
                          className="group"
                        >
                          <Reveal>
                            {/* the delivery chapter carries four rows between two
                              heavy photographic scenes — its rows breathe a
                              little wider so the group reads with presence */}
                            <div
                              className={`flex items-baseline gap-4 border-b border-foreground/15 py-6 md:gap-8 ${
                                g === "delivery" ? "md:py-10 lg:py-12" : "md:py-8 lg:py-9"
                              }`}
                            >
                              <span className="w-8 shrink-0 font-tech text-[11px] tracking-[0.1em] text-muted-foreground/70 transition-colors duration-300 group-hover:text-[var(--accent)] group-focus-within:text-[var(--accent)]">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-display text-[28px] font-normal leading-[1.1] tracking-[-0.02em] transition-[letter-spacing,color] duration-300 group-hover:tracking-[-0.012em] sm:text-[36px] lg:text-[44px]">
                                  {p.name}
                                </span>
                                {/* touch + small-tablet: the person's inline
                                  plate, in flow under the name — mobile and
                                  tablets get a substantial image without
                                  hover. Alternating aspect keeps the roster
                                  editorial rather than a repeated card row;
                                  the plate sits under name+role so it never
                                  reads as the person's face. */}
                                <span className="mt-4 block lg:hidden">
                                  <span
                                    className={`block overflow-hidden ${
                                      i % 2 === 0 ? "aspect-[16/10]" : "aspect-[4/3]"
                                    }`}
                                  >
                                    <img
                                      src={plate.src}
                                      alt={`The world of the work — ${p.role} · atmospheric reference imagery, not a portrait of ${p.name}`}
                                      loading="lazy"
                                      className={`h-full w-full object-cover ${plate.pos} [filter:saturate(0.85)_contrast(1.03)]`}
                                    />
                                  </span>
                                </span>
                              </span>
                              <span className="ml-auto hidden shrink-0 text-right sm:block">
                                <span className="block font-tech text-[11px] uppercase tracking-[0.14em] text-foreground/75">
                                  {p.role}
                                </span>
                                {p.practice && (
                                  <span className="mt-1 block font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                                    {p.practice_label}
                                  </span>
                                )}
                              </span>
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
        </div>

        {/* the standing caption of the mobile roster — one note for all
            inline plates, instead of repeating under every person */}
        <Reveal>
          <p className="mt-10 font-tech text-[10px] uppercase leading-[1.8] tracking-[0.16em] text-muted-foreground/60 lg:hidden">
            Mobile roster imagery — atmospheric reference, not portraits of Capex people
          </p>
        </Reveal>

        <Reveal>
          <p className="mt-12 font-tech text-[10px] uppercase leading-[1.8] tracking-[0.16em] text-muted-foreground/60">
            Roster of record · names and roles as verified by the company audit · no biographical
            detail is published ahead of the client&rsquo;s own review
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** Vertical offset of a row relative to the list column, measured through
 *  getBoundingClientRect (offsetParent walks escape through the section's
 *  `relative` context — the grid column itself is static, so offsetTop
 *  chains through BODY and returns document-relative numbers). */
function walkTo(ancestor: HTMLElement, el: HTMLElement): number {
  return el.getBoundingClientRect().top - ancestor.getBoundingClientRect().top;
}
