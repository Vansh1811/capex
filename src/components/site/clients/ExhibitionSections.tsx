import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useEntrance } from "@/components/site/home/HeroVideo";
import { Reveal } from "@/components/site/home/Reveal";
import type { ClientsPageClient } from "@/lib/site-data";
import {
  EXHIBITION_CATEGORIES,
  exhibitionLogo,
  type ExhibitionCategoryId,
} from "@/components/site/clients/exhibition";

/* ============================================================
 * 01 — CINEMATIC HERO (dark deep-earth, existing Capex image)
 * ============================================================ */

import clientHeroImg from "@/assets/client-page-hero-section.png";

export function ExhibitionHero() {
  const enter = useEntrance();
  // The plate settles once on load — a quiet opacity/scale arrival, no gimmicks.
  const [placed, setPlaced] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setPlaced(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <section
      aria-label="Clients — trust, in practice"
      data-tone="dark"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      {/* Full-bleed photograph — the hero's visual field, not a backdrop hint.
          The image naturally provides left negative space and right architectural detail. */}
      <div className="absolute inset-0">
        <img
          src={clientHeroImg}
          alt=""
          aria-hidden="true"
          loading="eager"
          className={`h-full w-full object-cover object-[65%_50%] transition-[opacity,transform] duration-[2000ms] ease-out md:object-[50%_50%] ${
            placed ? "scale-100 opacity-100" : "scale-[1.045] opacity-0"
          }`}
        />
        {/* subtle warm earth tint — unifies the frame without burying the photograph */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, color-mix(in oklab, var(--brand-deep) 15%, transparent) 0%, transparent 60%, color-mix(in oklab, var(--brand-deep) 20%, transparent) 100%)",
          }}
        />
        {/* restrained left darkening — the image is naturally dark, this just ensures contrast for the headline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, color-mix(in oklab, var(--brand-deep) 35%, transparent) 0%, transparent 40%)",
          }}
        />
        {/* bottom darkening — ensures the lower field scroll text is readable */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--brand-deep) 0%, color-mix(in oklab, var(--brand-deep) 55%, transparent) 15%, transparent 35%)",
          }}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] survey-grid"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-6 pb-14 pt-28 md:px-10 md:pb-16 md:pt-36 lg:px-12">
        <p className={`eyebrow-sans text-white/50 ${enter(0).className}`} style={enter(0).style}>
          Clients
        </p>
        <h1 className="mt-8 font-display text-[13.5vw] font-normal leading-[1.02] tracking-[-0.025em] sm:text-[11vw] md:mt-10 lg:text-[min(7.2vw,124px)]">
          {["Trust,", "in practice."].map((line, i) => {
            const e = enter(i + 1);
            return (
              <span key={line} className={`block ${e.className}`} style={e.style}>
                {line}
              </span>
            );
          })}
        </h1>
        <p
          className={`mt-8 max-w-md text-sm leading-[1.8] text-white/65 md:text-[15px] ${enter(3).className}`}
          style={enter(3).style}
        >
          The organizations, counterparties and associated parties connected to Capex&rsquo;s
          documented work — stated conservatively, on the record.
        </p>
        {/* Lower field — rule and one supporting line. The
            flexible space above is photograph, not emptiness. */}
        <div className="mt-auto pt-16">
          <div
            aria-hidden="true"
            className={`h-px w-24 bg-white/30 ${enter(4).className}`}
            style={enter(4).style}
          />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <p
              className={`max-w-md text-sm leading-[1.8] text-white/70 ${enter(4).className}`}
              style={enter(4).style}
            >
              The clientele, set as an exhibition — one category at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * 02 — LOGO SHOWCASE (quiet moving ribbon, warm beige)
 * ============================================================ */

/**
 * A logo image that can never render as a broken-image icon. Two guards:
 * `onError` covers failures after hydration; the mount check covers images
 * that already failed before hydration attached the listener (fast 404s,
 * slow networks — the error event never refires for those, so without the
 * check they would strand a broken glyph permanently).
 */
function useLogoFallback() {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);
  return { failed, onFail: () => setFailed(true), ref };
}

function LogoMark({
  slug,
  name,
  className = "",
  eager = true,
}: {
  slug: string;
  name: string;
  className?: string;
  eager?: boolean;
}) {
  const src = exhibitionLogo(slug);
  const { failed, onFail, ref } = useLogoFallback();
  if (!src || failed) return null;
  return (
    <img
      ref={ref}
      src={src}
      alt={name}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      onError={onFail}
      className={`object-contain ${className}`}
    />
  );
}

export function LogoShowcase({ clients }: { clients: ClientsPageClient[] }) {
  // Ribbon order follows the registry; only logo-bearing verified clients.
  const ribbon = clients.filter((c) => exhibitionLogo(c.slug));

  return (
    <section
      aria-label="Client logos"
      data-tone="light"
      className="relative overflow-hidden bg-[var(--surface)] text-foreground"
    >
      {/* Precise architectural tonal transition from the dark hero (16-20px band) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-4 md:h-5"
        style={{
          background:
            "linear-gradient(to bottom, var(--brand-deep) 0%, color-mix(in oklab, var(--brand-deep) 50%, var(--surface)) 50%, var(--surface) 100%)",
        }}
      />
      {/* Precise architectural tonal transition into the dark section below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-4 md:h-5"
        style={{
          background:
            "linear-gradient(to top, var(--brand-deep) 0%, color-mix(in oklab, var(--brand-deep) 50%, var(--surface)) 50%, var(--surface) 100%)",
        }}
      />

      <div className="group relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 md:w-16"
          style={{
            background:
              "linear-gradient(to right, var(--surface) 0%, color-mix(in oklab, var(--surface) 0%, transparent) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 md:w-16"
          style={{
            background:
              "linear-gradient(to left, var(--surface) 0%, color-mix(in oklab, var(--surface) 0%, transparent) 100%)",
          }}
        />
        <div
          tabIndex={0}
          role="region"
          aria-label="Client logo showcase"
          className="overflow-hidden py-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset md:py-9 motion-reduce:overflow-x-auto"
        >
          <div
            className="animate-marquee flex w-max items-center hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            style={{ animationDuration: `${ribbon.length * 2}s` }}
          >
            {[0, 1].map((half) => (
              <div
                key={half}
                aria-hidden={half === 1}
                className={`flex shrink-0 items-center ${half === 1 ? "motion-reduce:hidden" : ""}`}
              >
                {ribbon.map((c) => (
                  <span key={c.slug} className="flex shrink-0 items-center">
                    <span className="flex h-14 w-[214px] items-center justify-center px-8 md:h-16 md:w-[266px] md:px-12">
                      <LogoMark
                        slug={c.slug}
                        name={c.name}
                        className="h-auto max-h-9 w-auto max-w-[150px] opacity-70 grayscale transition-opacity duration-300 hover:opacity-100 hover:grayscale-0 md:max-h-11 md:max-w-[170px]"
                      />
                    </span>
                    <span aria-hidden="true" className="h-8 w-px shrink-0 bg-foreground/10" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="sr-only">
        {ribbon.length} client logos in a moving showcase. Motion pauses on hover and is disabled
        under reduced-motion settings.
      </p>
    </section>
  );
}

/* ============================================================
 * 03 — THE INDEX (four categories, one active at a time)
 * ============================================================ */

export type IndexCategory = {
  id: ExhibitionCategoryId;
  n: string;
  label: string;
  /** The verified direct clients this category actually holds. */
  clients: ClientsPageClient[];
};

/**
 * THE INDEX — a drawer of four catalogues, read as a register.
 *
 * The selection is marked by a copper cursor that slides between positions
 * rather than blinking in and out, and the register line beneath the row says
 * what the set under the reader's attention holds — counted names, taken from
 * the resolved clients themselves. Resting on a category previews it; the
 * click (or an arrow, or Home/End) opens it in the exhibition below. Nothing
 * is hidden behind the preview and no number is asserted: a count is a count
 * of the rows that will render.
 */
export function CategoryIndex({
  active,
  onChange,
  categories,
}: {
  active: ExhibitionCategoryId;
  onChange: (id: ExhibitionCategoryId) => void;
  categories: IndexCategory[];
}) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /** The set the reader is looking into — hover or focus previews it. */
  const [peek, setPeek] = useState<ExhibitionCategoryId | null>(null);
  const [cursor, setCursor] = useState<{ left: number; width: number; top: number } | null>(null);

  const activeIndex = Math.max(
    0,
    categories.findIndex((c) => c.id === active),
  );
  const shown = categories.find((c) => c.id === (peek ?? active)) ?? categories[activeIndex];

  // The cursor is measured, never assumed: the four labels have different
  // widths, and on small screens the row scrolls underneath it.
  useLayoutEffect(() => {
    let live = true;
    const measure = () => {
      const el = itemRefs.current[activeIndex];
      if (!live || !el) return;
      // The row wraps between md and lg — the cursor rides the item's own
      // baseline rather than the container's, so it stays under the label.
      setCursor({
        left: el.offsetLeft,
        width: el.offsetWidth,
        top: el.offsetTop + el.offsetHeight,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    // The web fonts land after first paint and change every width in the row.
    void document.fonts?.ready.then(measure);
    return () => {
      live = false;
      window.removeEventListener("resize", measure);
    };
  }, [activeIndex, categories]);

  const open = (index: number) => {
    const next = categories[(index + categories.length) % categories.length];
    if (!next) return;
    onChange(next.id);
    setPeek(null);
    itemRefs.current[index]?.focus();
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number | "first" | "last"> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
      Home: "first",
      End: "last",
    };
    const move = moves[event.key];
    if (move === undefined) return;
    event.preventDefault();
    open(move === "first" ? 0 : move === "last" ? categories.length - 1 : activeIndex + move);
  };

  const names = shown ? shown.clients.slice(0, 4).map((c) => c.name) : [];
  const rest = (shown?.clients.length ?? 0) - names.length;

  return (
    <section
      aria-label="Client categories"
      data-tone="light"
      className="paper bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 pb-4 pt-24 md:px-10 md:pt-32 lg:px-12">
        <Reveal>
          <div className="flex items-baseline gap-6">
            <p className="eyebrow-sans text-muted-foreground">The index</p>
            <span className="h-px flex-1 border-t border-border" aria-hidden="true" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          {/* Horizontal on desktop; clean horizontal scroll on small screens.
              The page itself never overflows — only this strip scrolls. */}
          <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-visible md:px-0">
            <div
              role="group"
              aria-label="Select a client category"
              onKeyDown={onKeyDown}
              onMouseLeave={() => setPeek(null)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setPeek(null);
                }
              }}
              className="relative mt-8 flex min-w-max items-stretch gap-x-10 gap-y-4 pb-2 md:min-w-0 md:flex-wrap md:pb-0 lg:gap-x-14"
            >
              {/* The cursor — the copper mark of the catalogue now open. */}
              {cursor ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 h-px bg-[var(--accent)] transition-[transform,width,top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    transform: `translateX(${cursor.left}px)`,
                    width: `${cursor.width}px`,
                    top: `${cursor.top}px`,
                  }}
                />
              ) : null}
              {categories.map((c, i) => {
                const isActive = c.id === active;
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    type="button"
                    aria-pressed={isActive}
                    onMouseEnter={() => setPeek(c.id)}
                    onFocus={() => setPeek(c.id)}
                    onClick={() => {
                      onChange(c.id);
                      setPeek(null);
                    }}
                    className={`group relative min-h-[44px] py-2 text-left transition-colors duration-300 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground/65 hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-baseline gap-3">
                      <span
                        className={`font-tech text-[11px] tracking-[0.1em] transition-colors duration-300 ${
                          isActive ? "text-foreground" : "text-muted-foreground/50"
                        }`}
                      >
                        {c.n}
                      </span>
                      <span className="eyebrow-sans">{c.label}</span>
                    </span>
                    {/* The target line — a hairline under whichever catalogue
                        the pointer or keyboard is considering; the cursor above
                        marks the one actually open. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px bg-transparent transition-colors duration-300 group-hover:bg-border group-focus-visible:bg-border/70"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* The register line — what the set under attention holds. The count
              is a count of the rows that will render, not a claim beside them. */}
          <div className="mt-5 flex min-h-[16px] items-baseline gap-3">
            {shown ? (
              <p key={shown.id} className="animate-reveal flex min-w-0 items-baseline gap-3">
                <span className="shrink-0 font-tech text-[10px] uppercase tracking-[0.18em] text-foreground/70">
                  {shown.clients.length} {shown.clients.length === 1 ? "name" : "names"}
                </span>
                <span className="min-w-0 truncate font-tech text-[11px] tracking-[0.02em] text-muted-foreground">
                  {names.length > 0 ? names.join(" · ") : "No verified names in this set"}
                  {rest > 0 ? ` +${rest}` : ""}
                </span>
              </p>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
 * 04 — ACTIVE CLIENT EXHIBITION (editorial list, no image plate)
 * ============================================================ */

export function ClientExhibition({
  clients,
  categoryLabel,
  categoryN,
}: {
  clients: ClientsPageClient[];
  categoryLabel: string;
  categoryN: string;
}) {
  return (
    <section
      aria-label={`${categoryLabel} — client exhibition`}
      data-tone="light"
      className="paper bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 pb-28 pt-10 md:px-10 md:pt-14 lg:px-12 lg:pb-40">
        <div className="mt-10">
          <ul aria-label={`${categoryLabel} clients`}>
            {clients.map((c) => {
              return (
                <li key={c.slug} className="border-b border-border py-6 text-left md:py-7">
                  <span className="block font-display text-[26px] font-normal leading-[1.08] tracking-[-0.02em] text-foreground sm:text-[32px] md:text-[40px] lg:text-[44px] xl:text-[52px]">
                    {c.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
