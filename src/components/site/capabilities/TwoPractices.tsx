import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { ReferenceNote } from "@/components/site/capabilities/CapabilitiesExperience";
import type { CapabilityPractice } from "@/lib/site-data";

/**
 * THE TWO PRACTICES — two rooms inside one practice, not a mirrored pair
 * and not cards. Below the Street is the dark earth room (the tunnel
 * plate, the survey grain); Within the Building is the ivory plant room.
 * Alternating full-width scenes: each practice occupies its own
 * environment. The plate is static — hover/focus never alters opacity,
 * scale or position so no edge line ever appears and hover looks exactly
 * like the resting state. On small screens the rooms become deliberate
 * vertical scenes with tap/focus behaviour; the service list always renders
 * (it is the room's register), with hover only adding emphasis.
 */
export function TwoPractices({
  practices,
  activeNumber,
  onActive,
}: {
  practices: CapabilityPractice[];
  activeNumber: 1 | 2 | null;
  onActive: (n: 1 | 2 | null) => void;
}) {
  return (
    <section aria-label="The two Capex practices" className="relative">
      {practices.map((p) => (
        <PracticeRoom
          key={p.number}
          practice={p}
          active={activeNumber === p.number}
          otherActive={activeNumber !== null && activeNumber !== p.number}
          onActive={onActive}
        />
      ))}
    </section>
  );
}

function PracticeRoom({
  practice,
  active,
  otherActive,
  onActive,
}: {
  practice: CapabilityPractice;
  active: boolean;
  otherActive: boolean;
  onActive: (n: 1 | 2 | null) => void;
}) {
  const [touchOpen, setTouchOpen] = useState(false);
  const below = practice.number === 1;
  // Hover must not change the room at all — the plate stays exactly as it is
  // before hovering (no opacity / scale / object-position shift, no edge line).
  // Only the explicit mobile "Hold the room" toggle may add emphasis to text.
  const emphasis = touchOpen;
  const ordinal = below ? "01" : "02";
  const title = below ? "Below the street" : "Within the building";
  const subtitle = below
    ? "UG Utilities, Electrical & CGD"
    : "MEP, Fire Fighting & Fire Protection";

  return (
    <article
      data-tone={below ? "dark" : "light"}
      aria-label={`Practice ${ordinal} — ${subtitle}`}
      className={`group relative overflow-hidden transition-opacity duration-500 ${
        below ? "bg-[var(--brand)] text-white" : "paper text-foreground"
      }`}
    >
      {/* the room's plate — full-height at xl on the quiet side of the room.
          Static: never shifts on hover/focus so no edge line ever appears. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 hidden w-[46%] opacity-45 xl:block ${
          below ? "right-0" : "left-0"
        }`}
      >
        <div className="h-full w-full scale-100">
          <img
            src={practice.plate}
            alt=""
            loading="lazy"
            className={`h-full w-full object-cover ${
              below ? "object-[62%_54%]" : "object-[38%_48%]"
            } ${
              below
                ? "[filter:saturate(0.66)_contrast(1.03)_brightness(0.78)]"
                : "[filter:saturate(0.85)_contrast(1.0)]"
            }`}
          />
        </div>
        <div
          aria-hidden="true"
          className={`absolute inset-0 ${below ? "bg-gradient-to-l from-transparent via-[var(--brand)]/30 to-[var(--brand)]" : "bg-gradient-to-r from-transparent via-transparent to-[var(--background)]"}`}
        />
      </div>

      <div
        className={`relative mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-36 lg:px-12 lg:py-44 ${
          below ? "xl:pr-[48%]" : "xl:pl-[48%]"
        }`}
      >
        {/* the ordinal — oversized, set into the room's corner */}
        <div className="flex items-start justify-between gap-6">
          <Reveal>
            <p className={`eyebrow-sans ${below ? "text-white/50" : "text-muted-foreground"}`}>
              The two practices · {ordinal}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <span
              aria-hidden="true"
              className={`font-display text-[64px] font-normal leading-[0.8] tracking-[-0.03em] transition-colors duration-500 md:text-[96px] ${
                below
                  ? emphasis
                    ? "text-white/25"
                    : "text-white/10"
                  : emphasis
                    ? "text-foreground/20"
                    : "text-foreground/10"
              }`}
            >
              {ordinal}
            </span>
          </Reveal>
        </div>

        <div className="mt-8">
          <Reveal delay={80}>
            <h2
              className={`max-w-[12ch] font-display text-[15vw] font-normal leading-[0.98] tracking-[-0.025em] transition-all duration-500 sm:text-[11vw] xl:text-[min(6.4vw,104px)] ${
                below
                  ? emphasis
                    ? "text-white"
                    : "text-white/75"
                  : emphasis
                    ? "text-foreground"
                    : "text-foreground/70"
              }`}
            >
              {title
                .split(" ")
                .slice(0, below ? 2 : 1)
                .join(" ")}
              <span className={below ? "text-white/40" : "text-foreground/25"}>
                {" "}
                {title
                  .split(" ")
                  .slice(below ? 2 : 1)
                  .join(" ")}
              </span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p
              className={`mt-4 eyebrow-sans transition-colors duration-500 ${
                below ? "text-white/55" : "text-muted-foreground"
              }`}
            >
              {subtitle}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p
              className={`mt-10 max-w-md text-sm leading-[1.8] transition-colors duration-500 md:text-[15px] ${
                below ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              {practice.scope_line}
            </p>
          </Reveal>
        </div>

        {/* the room's register — its disciplines, revealed with the room */}
        <div className="mt-14">
          <Reveal delay={240}>
            <div className="flex items-baseline gap-6">
              <p
                className={`eyebrow-sans ${below ? "text-white/50" : "text-muted-foreground"}`}
              >{`Disciplines — ${String(practice.services.length).padStart(2, "0")}`}</p>
              <span
                aria-hidden="true"
                className={`h-px flex-1 ${below ? "bg-white/15" : "bg-border"}`}
              />
              <span
                className={`font-tech text-[10px] uppercase tracking-[0.2em] ${
                  below ? "text-white/40" : "text-muted-foreground/60"
                }`}
              >
                {practice.projectCount} published records
              </span>
            </div>
          </Reveal>
          <Reveal delay={280}>
            <ul
              className={`mt-4 grid transition-all duration-500 md:grid-cols-2 ${
                emphasis ? "opacity-100" : "opacity-80"
              }`}
            >
              {practice.services.map((s) => (
                <li key={s.slug} className="border-b border-current/10 md:border-b-0">
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className={`group flex items-baseline gap-4 py-3.5 transition-colors duration-300 ${
                      below ? "hover:text-white" : "hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`font-tech text-[11px] tracking-[0.08em] ${
                        below ? "text-white/40" : "text-muted-foreground/60"
                      }`}
                    >
                      {String(s.n).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-[15px] font-normal leading-snug ${
                          below ? "text-white/85" : "text-foreground/85"
                        }`}
                      >
                        {s.name}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 font-tech text-xs opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
                        below ? "text-white/60" : "text-foreground/50"
                      } -translate-x-1`}
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={320}>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              to="/services/$slug"
              params={{ slug: practice.services[0]?.slug ?? "ug-ht-lt-cable-laying" }}
              className={`group inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] ${
                below ? "text-white" : "text-foreground"
              }`}
            >
              <span
                className={`border-b pb-1 transition-colors ${
                  below
                    ? "border-white/40 group-hover:border-white"
                    : "border-border group-hover:border-foreground"
                }`}
              >{`Practice ${practice.number === 1 ? "One" : "Two"}`}</span>
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setTouchOpen((v) => !v)}
              aria-expanded={touchOpen}
              className={`font-tech text-[11px] uppercase tracking-[0.24em] underline-offset-4 hover:underline xl:hidden ${
                below ? "text-white/60" : "text-muted-foreground"
              }`}
            >
              {touchOpen ? "Rest the room" : "Hold the room"}
            </button>
          </div>
        </Reveal>
      </div>

      {/* sub-xl: the room's plate in-flow, wide */}
      <div className="relative z-10 px-6 pb-16 md:px-10 lg:px-12 xl:hidden">
        <ClipReveal edge={below ? "left" : "right"} ratio="16 / 9" delay={60}>
          <img
            src={practice.plate}
            alt={practice.plateAlt}
            loading="lazy"
            className={`h-full w-full object-cover ${
              below
                ? "object-[56%_50%] [filter:saturate(0.7)_contrast(1.03)_brightness(0.85)]"
                : "object-[42%_46%] [filter:saturate(0.88)]"
            }`}
          />
        </ClipReveal>
        <ReferenceNote dark={!below ? false : true} className="mt-4">
          {practice.plateAlt}
        </ReferenceNote>
      </div>
    </article>
  );
}
