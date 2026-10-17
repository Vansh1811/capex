import { useEffect, useRef, useState, type KeyboardEvent as RKeyboardEvent } from "react";
import { useEntrance } from "@/components/site/home/HeroVideo";
import { Reveal } from "@/components/site/home/Reveal";
import type { ClientsPageClient } from "@/lib/site-data";
import { exhibitionLogo, type ExhibitionCategoryId } from "@/components/site/clients/exhibition";

/* ============================================================
 * 01 — CINEMATIC HERO (dark deep-earth, existing Capex image)
 * ============================================================ */

import clientHeroImg from "@/assets/client-page-hero-section.jpg";
import clientHeroImgWebp from "@/assets/client-page-hero-section.webp";
import clientHeroImg1024 from "@/assets/client-page-hero-section-1024.jpg";
import clientHeroImg1024Webp from "@/assets/client-page-hero-section-1024.webp";
import clientHeroImg640 from "@/assets/client-page-hero-section-640.jpg";
import clientHeroImg640Webp from "@/assets/client-page-hero-section-640.webp";
import { SiteImage } from "@/components/site/SiteImage";

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
        <SiteImage
          src={clientHeroImg}
          srcSet={`${clientHeroImg640} 640w, ${clientHeroImg1024} 1024w, ${clientHeroImg} 1344w`}
          webpSrcSet={`${clientHeroImg640Webp} 640w, ${clientHeroImg1024Webp} 1024w, ${clientHeroImgWebp} 1344w`}
          sizes="100vw"
          width={1344}
          height={768}
          eager
          fetchPriority="high"
          alt=""
          ariaHidden="true"
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
 * 02 — LOGO EXHIBITION (one dark field; a defined ivory rail)
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

function RibbonMark({
  slug,
  name,
  className = "",
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const src = exhibitionLogo(slug);
  const { failed, onFail, ref } = useLogoFallback();
  // Fade each mark in the moment its file arrives instead of popping a blank
  // slot mid-scroll. The slot keeps a fixed box so the strip never reflows
  // while images stream in.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth > 0) setReady(true);
  }, [src, ref]);
  if (src && !failed) {
    // Intrinsic raster dimensions stabilise layout; SVGs scale freely.
    const dims = LOGO_DIMS[slug];
    return (
      <img
        ref={ref}
        src={src}
        alt={name}
        width={dims?.[0]}
        height={dims?.[1]}
        loading="eager"
        decoding="async"
        draggable={false}
        onError={onFail}
        onLoad={() => setReady(true)}
        className={`object-contain transition-[opacity,filter] duration-500 grayscale hover:grayscale-0 ${
          ready ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    );
  }
  // No verified logo file (or the file failed) — elegant typography instead
  // of a gap. Never a fabricated logo; the real mark replaces this text the
  // moment an official asset is verified in exhibition.ts.
  return (
    <span
      title={name}
      className="text-center font-display text-[14px] font-medium leading-[1.15] tracking-[-0.01em] text-foreground/70"
    >
      {name}
    </span>
  );
}

/**
 * Intrinsic dimensions of the raster logo assets. The marquee slots are
 * fixed-size flex boxes, but explicit dimensions let the browser reserve
 * the right aspect before each file arrives (no shift when logos pop in).
 */
const LOGO_DIMS: Record<string, [number, number]> = {
  acquisory: [640, 183],
  "aditya-birla": [640, 376],
  agp: [288, 50],
  aon: [640, 242],
  "apl-apollo-steel": [195, 77],
  "apollo-pipes": [180, 90],
  "bhutani-infra": [166, 88],
  "bl-agro": [102, 102],
  bpcl: [640, 94],
  bptp: [170, 68],
  commscope: [360, 205],
  eldeco: [640, 112],
  "icici-lombard": [640, 694],
  igl: [640, 638],
  imgc: [80, 80],
  jcpenney: [640, 285],
  lakhani: [179, 93],
  "paras-buildtech": [336, 91],
  "pearson-education": [312, 96],
  "purba-bharati-gas": [640, 109],
  regus: [300, 127],
  "tata-advanced-systems": [301, 101],
  ultratech: [580, 320],
};

/**
 * THE LOGO EXHIBITION — the marks ride a single ivory rail that runs
 * edge-to-edge between the two dark fields. Nothing is blended: the deep
 * earth above and below is the same --brand-deep as the hero and the
 * measures register, the rail is one clearly bordered surface, and the
 * marks sit at one consistent height with air between them. The rail only
 * carries clients whose official mark is verified; a client without an
 * asset stays in the index below and does not ride.
 */
export function LogoShowcase({ clients }: { clients: ClientsPageClient[] }) {
  const ribbon = clients;

  return (
    <>
      {/* The label row — the exhibition states itself, on the deep earth. */}
      <section
        aria-label="The clientele — official client marks"
        data-tone="dark"
        className="bg-[var(--brand-deep)] text-white"
      >
        <div className="mx-auto max-w-[1680px] px-6 pb-10 pt-16 md:px-10 md:pb-12 md:pt-20 lg:px-12">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
              <p className="eyebrow-sans text-white/50">The clientele</p>
              <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-white/40">
                {ribbon.length} official marks
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The rail — geometry, not gradient: one bordered exhibition region,
          continuous with the dark fields holding it. Judged light for the
          chrome so the nav inverts while the rail is beneath it. */}
      <section
        aria-label="Official client marks"
        data-tone="light"
        className="border-y border-white/10 bg-[var(--surface-elevated)] text-foreground"
      >
        <div className="group relative">
          <div
            tabIndex={0}
            role="region"
            aria-label="Client logo exhibition"
            className="overflow-hidden py-6 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[var(--accent)] md:py-7 motion-reduce:overflow-x-auto"
          >
            <div
              className="animate-marquee flex w-max items-center hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
              style={{ animationDuration: `${ribbon.length * 4.4}s` }}
            >
              {[0, 1].map((half) => (
                <div
                  key={half}
                  aria-hidden={half === 1}
                  className={`flex shrink-0 items-center ${half === 1 ? "motion-reduce:hidden" : ""}`}
                >
                  {ribbon.map((c) => (
                    <span key={c.slug} className="flex shrink-0 items-center">
                      <span className="flex h-10 w-[188px] items-center justify-center px-7 md:h-14 md:w-[236px] md:px-9">
                        <RibbonMark
                          slug={c.slug}
                          name={c.name}
                          className="h-auto max-h-7 w-auto max-w-[118px] md:max-h-9 md:max-w-[148px]"
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-6 w-px shrink-0 bg-foreground/10 md:h-8"
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="sr-only">
          {ribbon.length} official client marks in a continuous exhibition. Motion pauses on hover
          and is disabled under reduced-motion settings.
        </p>
      </section>
    </>
  );
}

/* ============================================================
 * 03 — THE CLIENT EXHIBITION (editorial selector + shared register)
 * ============================================================ */

export type IndexCategory = {
  id: ExhibitionCategoryId;
  n: string;
  label: string;
  /** The verified direct clients this category actually holds. */
  clients: ClientsPageClient[];
};

/**
 * One grounded line per category — it describes the composition of the
 * verified name set this category actually holds. Never a separate claim.
 */
const CATEGORY_LINES: Record<ExhibitionCategoryId, string> = {
  "it-technology": "Global consultancies, product engineering and enterprise technology occupiers.",
  corporates:
    "The broadest sweep of the register — aviation, insurance, finance, logistics, publishing and consumer names.",
  "oil-gas-industries":
    "Hydrocarbons and allied industry — city gas distribution, pipelines, refining and the manufacturers around them.",
  "builders-developers":
    "The built environment — project houses, developers and landmark commercial towers.",
};

/**
 * THE CLIENT EXHIBITION — the index as a curated register, not four boxes.
 * A spine of four selectable categories (number, name, verified count, a
 * one-line whisper of its first names) holds the left column behind one
 * architectural rule; the field on the right carries one category at a
 * time at full size — the ghost numeral from the drawing sheets, the
 * category title, its grounded line, and the complete verified list set
 * as wall text over hairline rules. Tabs pattern: roving focus, arrow
 * keys, activation on click or Enter; every list stays in the DOM, so no
 * name is ever out of reach of the page or a screen reader.
 */
export function ClientExhibition({ categories }: { categories: IndexCategory[] }) {
  const [active, setActive] = useState<ExhibitionCategoryId>(categories[0]?.id ?? "it-technology");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const total = categories.reduce((n, c) => n + c.clients.length, 0);

  /** Roving focus across the spine; activation stays deliberate. */
  const onTabKey = (e: RKeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = categories.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      aria-label="Client categories"
      data-tone="light"
      className="paper bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 pb-28 pt-24 md:px-10 md:pb-36 md:pt-32 lg:px-12">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
            <p className="eyebrow-sans text-muted-foreground">The index</p>
            <p className="font-tech text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {total} direct clients
              <span className="hidden sm:inline">
                {" "}
                <span className="text-muted-foreground/50">·</span> counted from the records
              </span>
            </p>
          </div>
          <div aria-hidden="true" className="mt-6 h-px bg-border md:mt-8" />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-0">
            {/* The spine — four categories as selectable register lines.
                Extended to full column height on desktop, the drawn rule
                splits the composition and holds the reading order. */}
            <div
              role="tablist"
              aria-label="Client categories — select a category to open its register"
              className="border-b border-border lg:col-span-4 lg:border-b-0 lg:border-r lg:pr-10 xl:pr-14"
            >
              {categories.map((c, i) => {
                const on = c.id === active;
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    type="button"
                    id={`tab-${c.id}`}
                    aria-selected={on}
                    aria-controls={`panel-${c.id}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(c.id)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={`group relative block w-full border-t border-border py-4 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[var(--accent)] md:py-5 ${
                      on ? "bg-[var(--surface)]" : "hover:bg-[var(--surface)]/60"
                    }`}
                  >
                    {/* the register's copper marker — the same hairline the
                        figures strip rides, here on the active category */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -top-px h-px origin-left bg-[var(--accent)] transition-transform duration-500 ease-out ${
                        on ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                    <span className="flex items-baseline justify-between gap-x-4">
                      <span className="flex min-w-0 items-baseline gap-3 md:gap-4">
                        <span
                          className={`font-tech text-[11px] tracking-[0.14em] transition-colors duration-300 ${
                            on ? "text-[var(--accent)]" : "text-muted-foreground/60"
                          }`}
                        >
                          {c.n}
                        </span>
                        <span
                          className={`min-w-0 font-display text-[18px] leading-[1.18] tracking-[-0.02em] transition-colors duration-300 md:text-[22px] ${
                            on
                              ? "text-foreground"
                              : "text-foreground/40 group-hover:text-foreground/75"
                          }`}
                        >
                          {c.label}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 font-tech text-[10px] tabular-nums tracking-[0.08em] transition-colors duration-300 ${
                          on ? "text-muted-foreground" : "text-muted-foreground/50"
                        }`}
                      >
                        {c.clients.length}
                        <span className="sr-only"> clients</span>
                      </span>
                    </span>
                    {/* a whisper of the category's own names — the preview
                        the selection will open in full */}
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 block truncate text-[12px] leading-snug transition-colors duration-300 ${
                        on ? "text-muted-foreground/80" : "text-muted-foreground/55"
                      }`}
                    >
                      {c.clients
                        .slice(0, 3)
                        .map((cl) => cl.name)
                        .join(" · ")}{" "}
                      …
                    </span>
                  </button>
                );
              })}
            </div>

            {/* The register field — one category at a time, set large. */}
            <div className="relative lg:col-span-8 lg:pl-10 xl:pl-14">
              {categories.map((c) => {
                const on = c.id === active;
                return (
                  <div
                    key={c.id}
                    role="tabpanel"
                    id={`panel-${c.id}`}
                    aria-labelledby={`tab-${c.id}`}
                    tabIndex={0}
                    hidden={!on}
                    className="lg:min-h-[520px]"
                  >
                    <div key={on ? "on" : "off"} className={on ? "index-in" : undefined}>
                      {/* the ghost numeral — a drawing-sheet echo, stating
                          which register is open, behind the field's type */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 top-0 -z-10 hidden select-none font-display text-[clamp(88px,16vw,216px)] leading-none tracking-[-0.045em] text-foreground/[0.055] lg:block"
                      >
                        {c.n}
                      </span>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                        <h3 className="font-display text-[24px] font-normal leading-[1.08] tracking-[-0.02em] text-foreground md:text-[30px] lg:text-[34px]">
                          {c.label}
                        </h3>
                        <p className="font-tech text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          {c.clients.length} {c.clients.length === 1 ? "name" : "names"}
                        </p>
                      </div>
                      <p className="mt-3 max-w-[58ch] text-[13px] leading-[1.7] text-muted-foreground md:text-sm">
                        {CATEGORY_LINES[c.id]}
                      </p>
                      <div aria-hidden="true" className="mt-7 h-px bg-border md:mt-8" />
                      {/* the names, as wall text — hairline rules under
                          each set row, hairline rules between the columns */}
                      <ul
                        aria-label={`${c.label} clients`}
                        className="mt-2 columns-1 gap-x-10 [column-rule:1px_solid_var(--border)] sm:columns-2 xl:columns-3"
                      >
                        {c.clients.map((cl) => (
                          <li
                            key={cl.slug}
                            className="break-inside-avoid border-b border-border/60 py-2.5 font-display text-[15.5px] leading-[1.35] tracking-[-0.012em] text-foreground/90 md:py-3 md:text-[17px]"
                          >
                            {cl.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
