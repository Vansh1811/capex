import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getNavChrome, getSearchCorpus, getCapabilityDetail } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { buildSearchCorpus, type SearchCorpus } from "@/components/site/home/SearchOverlay";
import { CapabilitiesExperience } from "@/components/site/capabilities/CapabilitiesExperience";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { ReferenceNote } from "@/components/site/capabilities/CapabilitiesExperience";

const chromeQuery = queryOptions({
  queryKey: ["public", "chrome"],
  queryFn: () => getNavChrome(),
  ...PUBLIC_QUERY_DEFAULTS,
});

const searchCorpusQuery = queryOptions({
  queryKey: ["public", "search-corpus"],
  queryFn: () => getSearchCorpus(),
  ...PUBLIC_QUERY_DEFAULTS,
});

const detailQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public", "capability", slug],
    queryFn: () => getCapabilityDetail({ data: { slug } }),
    ...PUBLIC_QUERY_DEFAULTS,
  });

export const Route = createFileRoute("/services/$slug")({
  loader: ({ context, params: { slug } }) =>
    Promise.all([
      context.queryClient.ensureQueryData(chromeQuery),
      context.queryClient.ensureQueryData(searchCorpusQuery),
      context.queryClient.ensureQueryData(detailQuery(slug)),
    ]),
  component: CapabilityDetailPage,
  notFoundComponent: () => (
    <CapabilitiesExperience brandWordmark="CAPEX" corpus={buildSearchCorpusEmpty()}>
      <div className="grid min-h-[70vh] place-items-center pt-24">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold">404</h1>
          <p className="mt-2 text-sm text-muted-foreground">This discipline does not exist.</p>
          <Link
            to="/services"
            className="mt-6 inline-block rounded-[4px] border border-border px-4 py-2 text-sm"
          >
            The register
          </Link>
        </div>
      </div>
    </CapabilitiesExperience>
  ),
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replace(/-/g, " ")} — Capex Capabilities` }],
  }),
});

function buildSearchCorpusEmpty(): SearchCorpus {
  return buildSearchCorpus({ services: [], sectors: [], projects: [] });
}

function CapabilityDetailPage() {
  const { slug } = Route.useParams();
  const { data: chromeData } = useSuspenseQuery(chromeQuery);
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const { data } = useSuspenseQuery(detailQuery(slug));
  if (!data) return null;
  const { service, practice, next } = data;
  const corpus: SearchCorpus = buildSearchCorpus({
    services: corpusData.services,
    sectors: corpusData.sectors,
    projects: corpusData.projects,
    people: corpusData.people,
    clients: corpusData.clients,
    credentials: corpusData.credentials,
  });

  const below = service.practice === 1;

  return (
    <CapabilitiesExperience
      brandWordmark={chromeData.settings.brand_wordmark || "CAPEX"}
      corpus={corpus}
    >
      {/* ---------- 01 · the discipline states itself — a dark threshold ---------- */}
      <section
        aria-label={service.name}
        data-tone="dark"
        className="relative flex min-h-[88svh] flex-col overflow-hidden bg-[var(--brand-deep)] text-white"
      >
        {/* the discipline's plate — hung low, its atmosphere ahead of information */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[44%]">
          <ClipReveal edge="bottom" delay={320} className="h-full">
            <img
              src={service.plate}
              alt=""
              loading="eager"
              className={`h-full w-full object-cover opacity-60 [filter:saturate(0.6)_contrast(1.02)_brightness(0.64)] ${service.platePosition}`}
            />
          </ClipReveal>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-deep)] via-[var(--brand-deep)]/45 to-[var(--brand-deep)]/85" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-6 pb-24 pt-32 md:px-10 md:pt-40 lg:px-12">
          <Reveal>
            <nav aria-label="Breadcrumb" className="flex items-baseline justify-between gap-6">
              <Link
                to="/services"
                className="group inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-white/70 transition-colors hover:text-white"
              >
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
                >
                  ←
                </span>
                <span className="border-b border-white/30 pb-1 transition-colors group-hover:border-white">
                  The register
                </span>
              </Link>
              <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-white/40">
                Discipline {String(service.n).padStart(2, "0")} / 11
              </p>
            </nav>
          </Reveal>

          <div className="mt-auto pt-24">
            <Reveal delay={80}>
              <p className="eyebrow-sans text-white/45">
                {service.tagline ?? "Discipline"} ·{" "}
                {below ? "Below the street — Practice 01" : "Within the building — Practice 02"}
              </p>
            </Reveal>
            <Reveal delay={140}>
              <h1 className="mt-8 max-w-[16ch] font-display text-[11vw] font-normal leading-[1.02] tracking-[-0.025em] sm:text-[8vw] lg:text-[min(5.6vw,96px)]">
                {service.name}
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 max-w-lg text-sm leading-[1.8] text-white/65 md:text-[15px]">
                {service.standfirst}
              </p>
            </Reveal>
            <Reveal delay={260}>
              <ReferenceNote dark className="mt-8">
                {service.plateAlt}
              </ReferenceNote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- 02 · the scope — ivory, the discipline's own register ---------- */}
      <section
        aria-label="Scope of this discipline"
        data-tone="light"
        className="paper text-foreground"
      >
        <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-36 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex items-baseline gap-6">
                  <p className="eyebrow-sans text-muted-foreground">The scope</p>
                  <span aria-hidden="true" className="h-px flex-1 border-t border-border" />
                  <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                    Verified register
                  </span>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <p className="mt-8 max-w-xl font-display text-[22px] font-normal leading-[1.4] tracking-[-0.01em] text-foreground/85 md:text-[26px]">
                  {service.overview}
                </p>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-10 max-w-md text-sm leading-[1.8] text-muted-foreground">
                  Delivered turnkey — supply, installation, testing &amp; commissioning — under one
                  accountable contract.
                </p>
              </Reveal>
              {practice && (
                <Reveal delay={200}>
                  <Link
                    to="/services"
                    className="group mt-10 inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-foreground"
                  >
                    <span className="border-b border-border pb-1 transition-colors group-hover:border-foreground">
                      {practice.short_label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </Reveal>
              )}
            </div>

            {service.included.length > 0 && (
              <div className="lg:col-span-4 lg:col-start-9">
                <Reveal delay={120}>
                  <p className="eyebrow-sans text-muted-foreground/70">In this discipline</p>
                  <ul className="mt-4">
                    {service.included.map((item) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-4 border-b border-border py-3 text-sm text-foreground/85"
                      >
                        <span
                          aria-hidden="true"
                          className="font-tech text-[10px] text-muted-foreground/50"
                        >
                          ·
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ReferenceNote className="mt-6">{service.source_ref}</ReferenceNote>
                </Reveal>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- 03 · the network — sectors & projects, only if documented ---------- */}
      {(service.projects.length > 0 || service.sectors.length > 0) && (
        <section
          aria-label="Where this discipline is documented"
          data-tone="light"
          className="bg-[var(--surface)] text-foreground"
        >
          <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-32 lg:px-12">
            <Reveal>
              <div className="flex items-baseline gap-6">
                <p className="eyebrow-sans text-muted-foreground">Where it is documented</p>
                <span aria-hidden="true" className="h-px flex-1 border-t border-border" />
                <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                  From the published archive
                </span>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-12 lg:grid-cols-12">
              {service.projects.length > 0 && (
                <div className="lg:col-span-7">
                  <Reveal>
                    <p className="eyebrow-sans text-muted-foreground/70">Projects</p>
                    <ul className="mt-4">
                      {service.projects.map((p) => (
                        <li key={p.slug}>
                          <Link
                            to="/projects/$slug"
                            params={{ slug: p.slug }}
                            className="group grid grid-cols-12 items-baseline gap-3 border-b border-border py-4 transition-colors hover:border-foreground/40"
                          >
                            <span className="col-span-2 font-tech text-[11px] text-muted-foreground/70 md:col-span-1">
                              {p.ref}
                            </span>
                            <span className="col-span-10 font-display text-lg font-normal leading-snug tracking-[-0.015em] text-foreground/85 transition-colors group-hover:text-foreground md:col-span-6 md:text-xl">
                              {p.title}
                            </span>
                            <span className="col-span-6 font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70 md:col-span-3">
                              {p.city}, {p.state}
                            </span>
                            <span className="col-span-6 text-right font-tech text-[10px] uppercase tracking-[0.14em] text-muted-foreground md:col-span-2">
                              {p.figure ?? ""}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              )}

              {service.sectors.length > 0 && (
                <div className="lg:col-span-5 lg:pl-8">
                  <Reveal delay={100}>
                    <p className="eyebrow-sans text-muted-foreground/70">Sectors</p>
                    <ul className="mt-4">
                      {service.sectors.map((s) => (
                        <li key={s.slug}>
                          <Link
                            to="/sectors/$slug"
                            params={{ slug: s.slug }}
                            className="group flex items-baseline justify-between gap-4 border-b border-border py-4 transition-colors hover:border-foreground/40"
                          >
                            <span className="font-display text-xl font-normal tracking-[-0.015em] text-foreground/85 transition-colors group-hover:text-foreground md:text-2xl">
                              {s.name}
                            </span>
                            <span
                              aria-hidden="true"
                              className="font-tech text-xs text-foreground/50 transition-transform duration-300 group-hover:translate-x-1"
                            >
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---------- 04 · the discipline with no published records — the honest state ---------- */}
      {service.projects.length === 0 && service.sectors.length === 0 && (
        <section
          aria-label="Publication state"
          data-tone="light"
          className="bg-[var(--surface)] text-foreground"
        >
          <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 lg:px-12">
            <Reveal>
              <div className="border-t border-border pt-10">
                <p className="font-tech text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-muted-foreground/60">
                  This discipline sits on the verified register; its linked sector and project
                  records are pending publication. The register never infers a relationship from a
                  name or a sector.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- 05 · onward — the next discipline, dark ---------- */}
      <section
        aria-label="Continue the register"
        data-tone="dark"
        className="relative overflow-hidden bg-[var(--brand-deep)] text-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 survey-grid"
        />
        <div className="relative mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-32 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-10">
            <div>
              <Reveal>
                <p className="eyebrow-sans text-white/40">Next in the register</p>
              </Reveal>
              {next && (
                <Reveal delay={100}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: next.slug }}
                    className="group mt-6 inline-block"
                  >
                    <span className="block font-display text-[9vw] font-normal leading-[1.04] tracking-[-0.025em] text-white/85 transition-colors group-hover:text-white sm:text-[6vw] lg:text-[min(4.4vw,72px)]">
                      {next.name}
                    </span>
                    <span className="mt-4 inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-white/60">
                      <span className="border-b border-white/30 pb-1 transition-colors group-hover:border-white">
                        Discipline {String(next.n).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </Reveal>
              )}
            </div>
            <Reveal delay={180}>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.24em] text-white"
              >
                <span className="border-b border-white/40 pb-1 transition-colors group-hover:border-white">
                  Start a conversation
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </CapabilitiesExperience>
  );
}
