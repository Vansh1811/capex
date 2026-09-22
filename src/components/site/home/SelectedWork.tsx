import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

type Entry = {
  index: string;
  title: string;
  slug: string;
  discipline: string;
  place: string;
  figure: string; // documented quantity — one per entry, where it says something
  image: string; // atmospheric reference only — never labeled as the project
};

/**
 * Selected Work (V3 brief §SELECTED WORK): an editorial archive — three
 * strong documented programmes, large titles, quiet metadata, one figure
 * of record each. The image is a fixed preview panel (not wallpaper, not
 * a card): hovering or focusing an entry cross-fades the preview; on
 * touch the first entry's preview is visible and tappable rows navigate
 * directly. Ends with a restrained VIEW ALL PROJECTS →.
 */
const ENTRIES: Entry[] = [
  {
    index: "01",
    title: "Lucknow Metro",
    slug: "lucknow-metro-electrical",
    discipline: "Connectivity electrical · metro programme",
    place: "Uttar Pradesh",
    figure: "20 KM · 220 KV",
    image: "/uploads/service-electrical.jpg",
  },
  {
    index: "02",
    title: "Patna Smart City",
    slug: "patna-smart-city-electrical",
    discipline: "Underground HT/LT cable programme",
    place: "Bihar",
    figure: "150 KM · 11/33 KV",
    image: "/uploads/service-ug.jpg",
  },
  {
    index: "03",
    title: "World Trade Tower",
    slug: "world-trade-tower-hvac-fire",
    discipline: "HVAC plant with integrated fire protection",
    place: "Noida, Uttar Pradesh",
    figure: "4,000 TR",
    image: "/uploads/service-cleanroom.jpg",
  },
];

export function SelectedWork() {
  const [active, setActive] = useState(0);

  return (
    <section
      aria-label="Selected work"
      data-tone="light"
      className="paper relative bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-36 lg:px-12 lg:py-44">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-balance font-display text-[34px] font-normal leading-[1.05] tracking-[-0.02em] md:text-[52px]">
              Selected
              <br />
              work.
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Three programmes from the record — the full archive lives under Projects.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-8">
          {/* the index — the primary object on small screens */}
          <div className="lg:col-span-7">
            <ol>
              {ENTRIES.map((e, i) => (
                <li key={e.index}>
                  <Reveal delay={Math.min(i * 60, 160)}>
                    <Link
                      to="/projects/$slug"
                      params={{ slug: e.slug }}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onTouchStart={() => setActive(i)}
                      className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 border-b border-border py-7 transition-colors hover:border-foreground/40 focus-visible:border-foreground/40 focus-visible:outline-none md:grid-cols-[3.5rem_1fr_auto_auto] md:gap-x-10 md:py-9"
                    >
                      <span className="font-display text-sm font-medium tracking-[0.08em] text-foreground/35 transition-colors group-hover:text-foreground group-focus-visible:text-foreground md:text-base">
                        {e.index}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-[26px] font-normal leading-[1.08] tracking-[-0.02em] text-foreground/90 transition-colors group-hover:text-foreground md:text-[40px]">
                          {e.title}
                        </span>
                        <span className="mt-1.5 block text-xs text-muted-foreground md:text-sm">
                          {e.discipline}
                        </span>
                      </span>
                      <span className="hidden text-right font-tech text-sm text-muted-foreground md:block">
                        {e.place}
                      </span>
                      <span className="text-right font-tech text-sm font-medium tracking-[0.04em] text-foreground/80 transition-colors group-hover:text-foreground md:text-base">
                        {e.figure}
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal delay={160}>
              <div className="mt-10">
                <Link
                  to="/projects"
                  className="group inline-flex items-center gap-3 py-2 font-tech text-[11px] uppercase tracking-[0.24em] text-foreground"
                >
                  <span className="border-b border-border pb-1 transition-colors group-hover:border-foreground">
                    View all projects
                  </span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* the preview — a single frame that cross-fades with the index.
              Hidden below lg: rows navigate directly on touch. */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-32">
              <Reveal delay={80}>
                <figure className="relative aspect-[4/5] overflow-hidden bg-surface">
                  {ENTRIES.map((e, i) => (
                    <img
                      key={e.index}
                      src={e.image}
                      alt="Atmospheric reference imagery — not a documented Capex project"
                      loading={i === 0 ? "eager" : "lazy"}
                      aria-hidden={i !== active}
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out [filter:saturate(0.82)] ${
                        i === active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </figure>
              </Reveal>
              <Reveal delay={140}>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                    Reference imagery — see project records for documentation
                  </span>
                  <span className="shrink-0 font-tech text-[10px] tracking-[0.2em] text-muted-foreground/70">
                    {ENTRIES[active].index} / 03
                  </span>
                </figcaption>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
