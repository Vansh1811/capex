import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getProjectCaseStudy, getProjectsArchive, type ArchiveProject } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { Closing } from "@/components/site/home/Closing";
import {
  ArchiveNav,
  MediaCaption,
  StatusMark,
  ProjectCtaArrow,
  cropOf,
} from "@/components/site/projects/ArchiveVocabulary";

const detailQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public", "project-case-study", slug],
    queryFn: () => getProjectCaseStudy({ data: { slug } }),
    ...PUBLIC_QUERY_DEFAULTS,
  });

const archiveQuery = queryOptions({
  queryKey: ["public", "projects-archive"],
  queryFn: () => getProjectsArchive(),
  ...PUBLIC_QUERY_DEFAULTS,
});

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ context, params: { slug } }) => {
    const data = await context.queryClient.ensureQueryData(detailQuery(slug));
    // loader returns null for unpublished/absent slugs → render notFoundComponent
    if (!data) throw notFound();
    return data;
  },
  component: ProjectCaseStudy,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div>
        <h1 className="font-display text-4xl font-normal">Record not found.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This sheet is not on the published record.
        </p>
        <Link
          to="/projects"
          className="mt-8 inline-block border-b border-border pb-1 font-tech text-[11px] uppercase tracking-[0.24em] hover:border-foreground"
        >
          The archive
        </Link>
      </div>
    </div>
  ),
  head: ({ loaderData, params }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.project.title} — ${loaderData.project.status === "ongoing" ? "Ongoing" : "Completed"} | Capex Projects`
          : `${params.slug.replace(/-/g, " ")} — Capex Projects`,
      },
    ],
  }),
});

/**
 * THE CASE STUDY — entering another layer of the archive. The journey the
 * page answers, in order: what is it → where is it → what did Capex do →
 * how large was it → what does the work look like → what else is related.
 * Sections breathe between compositions; only verified fields render — a
 * missing field is omitted, never faked. Ends in NEXT PROJECT, the archive's
 * own quiet way onward.
 */
function ProjectCaseStudy() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(detailQuery(slug));
  const { data: archive } = useSuspenseQuery(archiveQuery);
  const [navOverDark, setNavOverDark] = useState(true);

  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("#main [data-tone]"));
    if (scenes.length === 0) return;
    const visible = new Map<HTMLElement, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target as HTMLElement, e.isIntersecting);
        const live = scenes
          .filter((s) => visible.get(s))
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
        if (live) setNavOverDark(live.dataset.tone !== "light");
      },
      { rootMargin: "-72px 0px -35% 0px", threshold: 0 },
    );
    for (const s of scenes) io.observe(s);
    return () => io.disconnect();
  }, []);

  if (!data) return null;
  const { project: p, related, next, work } = data;
  const clientName = p.client_display;
  // the record's own register — Completed or Ongoing, never both
  const register = p.status === "ongoing" ? "ongoing" : "completed";
  const registerTo = register === "ongoing" ? "/projects/ongoing" : "/projects/completed";
  const registerLabel = register === "ongoing" ? "Ongoing" : "Completed";

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-black"
      >
        Skip to content
      </a>
      <ArchiveNav
        overDark={navOverDark}
        brandWordmark="CAPEX"
        state={register}
        completedCount={archive.completedCount}
        ongoingCount={archive.ongoingCount}
        onOpenIndex={() => {}}
        indexActive={false}
        onOpenFilter={() => {}}
        filterActive={false}
      />
      <main id="main">
        {/* ---------- 01 · the opening — the record states itself, then the print ---------- */}
        <section
          aria-label={p.title}
          data-tone="dark"
          className="relative overflow-hidden bg-[var(--brand)] text-white"
        >
          <div className="mx-auto max-w-[1680px] px-6 pb-20 pt-32 md:px-10 md:pt-40 lg:px-12">
            <Reveal>
              <nav aria-label="Breadcrumb" className="flex items-baseline justify-between gap-6">
                <Link
                  to={registerTo}
                  className="eyebrow-sans text-white/45 transition-colors hover:text-white"
                >
                  {registerLabel} projects
                </Link>
                <span className="flex items-baseline gap-6">
                  <StatusMark status={p.status} onDark />
                  <span className="font-tech text-[11px] uppercase tracking-[0.2em] text-white/40">
                    Sheet {p.ref}
                  </span>
                </span>
              </nav>
            </Reveal>
            {/* the title arrives as setting lines — each word-group rises */}
            <h1 className="mt-10 max-w-[16ch] font-display text-[9.5vw] font-normal leading-[1.02] tracking-[-0.025em] md:text-[68px] lg:text-[84px]">
              {p.title
                .split(" ")
                .reduce<string[][]>(
                  (lines, word, i) => {
                    const li = Math.min(Math.floor(i / 3), 2);
                    lines[li] = [...(lines[li] ?? []), word];
                    return lines;
                  },
                  [[], [], []],
                )
                .map((line, i) =>
                  line.length > 0 ? (
                    <span key={i} className="block overflow-hidden">
                      <span
                        className="rise-line block"
                        style={{ animationDelay: `${90 + i * 140}ms` }}
                      >
                        {line.join(" ")}
                      </span>
                    </span>
                  ) : null,
                )}
            </h1>
            <Reveal delay={340}>
              <p className="mt-6 max-w-xl text-sm leading-[1.8] text-white/70 md:text-[15px]">
                {p.scope_line}
              </p>
            </Reveal>
            <Reveal delay={420}>
              <p className="mt-8 font-tech text-[11px] uppercase tracking-[0.2em] text-white/45">
                {[p.city, p.state, p.sectors[0]?.name, p.practice_label]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </Reveal>
          </div>

          {/* the hero print — a wide frame entering the dark world.
              Records carrying a dedicated ultra-wide hero frame use it;
              every other record renders its principal frame, as before. */}
          <figure className="mx-auto max-w-[1680px] px-6 pb-24 md:px-10 lg:px-12">
            <ClipReveal edge="right" ratio="21 / 9" delay={240}>
              <img
                src={p.media.heroSrc ?? p.media.src}
                alt={p.media.heroAlt ?? p.media.alt}
                className={`h-full w-full object-cover ${cropOf(p)} [filter:saturate(0.85)_contrast(1.02)_brightness(0.94)]`}
              />
            </ClipReveal>
            <Reveal delay={380}>
              <MediaCaption p={p} right={`${p.ref} · record`} onDark />
            </Reveal>
          </figure>
        </section>

        {/* ---------- 02 · the work — the narrative + the quiet factual rail ---------- */}
        <section aria-label="The work" data-tone="light" className="paper bg-background">
          <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-36 lg:px-12 lg:py-44">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <Reveal>
                  <p className="eyebrow-sans text-muted-foreground">The work</p>
                </Reveal>
                <Reveal delay={110}>
                  <p className="mt-8 max-w-[34ch] text-balance font-display text-[26px] font-normal leading-[1.3] tracking-[-0.01em] text-foreground md:text-[34px]">
                    {work}
                  </p>
                </Reveal>
                {clientName && (
                  <Reveal delay={220}>
                    <p className="mt-10 max-w-md text-[15px] leading-[1.8] text-muted-foreground">
                      Record held for {clientName}, {p.city}. The published sheet carries the
                      quantities Capex contracted to deliver.
                    </p>
                  </Reveal>
                )}
              </div>
              {/* the factual rail — verified fields only, omitted when empty;
                  each row enters on its own as the rail scrolls into view */}
              <div className="lg:col-span-4 lg:col-start-9">
                <dl className="border-t border-border">
                  {[
                    ["Project", p.title],
                    ["Location", `${p.city}, ${p.state}`],
                    ["Practice", p.practice_label],
                    ["Sector", p.sectors.map((s) => s.name).join(" · ") || null],
                    ["Scope", p.scope_line],
                    clientName ? ["Client", clientName] : null,
                    p.status === "completed" ? ["Status", "Completed"] : ["Status", "Ongoing"],
                  ]
                    .filter((r): r is [string, string] => Array.isArray(r) && Boolean(r[1]))
                    .map(([k, v], i) => (
                      <Reveal key={k} delay={i * 90}>
                        <div className="border-b border-border py-4 transition-colors">
                          <dt className="font-tech text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                            {k}
                          </dt>
                          <dd className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                            {v}
                          </dd>
                        </div>
                      </Reveal>
                    ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 03 · scale — the figures of record, large and quiet ---------- */}
        {p.metrics.length > 0 && (
          <section
            aria-label="Scale"
            data-tone="dark"
            className="relative bg-[var(--ink)] text-white"
          >
            <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-36 lg:px-12">
              <Reveal>
                <p className="eyebrow-sans text-white/50">Scale · figures of record</p>
              </Reveal>
              <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-8">
                {p.metrics.map((m, i) => (
                  <Reveal key={m.label} delay={i * 140}>
                    <div className="border-t border-white/15 pt-6">
                      {/* the figure rises from its baseline like a setting line */}
                      <p className="rise-line font-tech text-[54px] font-medium leading-none tracking-[0.02em] text-white md:text-[72px]">
                        {m.value}
                        {m.unit && (
                          <span className="ml-3 text-[22px] tracking-[0.1em] text-white/55 md:text-[28px]">
                            {m.unit}
                          </span>
                        )}
                      </p>
                      <p className="mt-4 font-tech text-[11px] uppercase tracking-[0.2em] text-white/45">
                        {m.label}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={300}>
                <p className="mt-14 max-w-md text-sm leading-[1.8] text-white/50">
                  Quantities as documented in the company record — supply, installation, testing and
                  commissioning under one accountable contract.
                </p>
              </Reveal>
            </div>
          </section>
        )}

        {/* ---------- 04 · the discipline — an editorial image sequence: large
            print, then a smaller offset detail from the same reference frame
            (crop-shifted, never claimed as a different photograph) ---------- */}
        <section aria-label="The discipline" data-tone="light" className="paper bg-background">
          <div className="mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-36 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-12">
              <figure className="lg:col-span-8">
                <ClipReveal edge="left" ratio="16 / 10">
                  <img
                    src={p.media.src}
                    alt={p.media.alt}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full object-cover ${cropOf(p)} [filter:saturate(0.88)]`}
                  />
                </ClipReveal>
                <Reveal delay={140}>
                  <MediaCaption p={p} />
                </Reveal>
              </figure>
              <div className="lg:col-span-4 lg:flex lg:flex-col lg:justify-end">
                <Reveal>
                  <p className="eyebrow-sans text-muted-foreground">The discipline</p>
                </Reveal>
                <Reveal delay={110}>
                  <h2 className="mt-8 font-display text-3xl font-normal leading-[1.1] tracking-[-0.02em] md:text-[40px]">
                    {p.practice === 1 ? "Below the street." : "Within the building."}
                  </h2>
                </Reveal>
                <Reveal delay={210}>
                  <p className="mt-8 max-w-sm text-[15px] leading-[1.8] text-muted-foreground">
                    {p.practice === 1
                      ? "Trench, duct, cable, joint, reinstate — the connectivity layer of a city, engineered to disappear until it is needed."
                      : "Plant, ductwork, pipework, controls — the systems a building breathes through, engineered to be felt and never seen."}
                  </p>
                </Reveal>
                <Reveal delay={280}>
                  <p className="mt-8 font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                    {p.services.map((s) => s.name).join(" · ")}
                  </p>
                </Reveal>
              </div>
            </div>

            {/* the offset detail — the same frame, re-cropped; sits off the
                left margin like a study beside the principal print */}
            <div className="mt-20 grid gap-10 lg:mt-28 lg:grid-cols-12">
              <figure className="lg:col-span-4 lg:col-start-3">
                <ClipReveal edge="bottom" ratio="4 / 5">
                  <img
                    src={p.media.src}
                    alt={`${p.media.alt} — detail crop`}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full object-cover ${cropOf(p)} scale-125 [filter:saturate(0.9)_contrast(1.05)]`}
                  />
                </ClipReveal>
                <Reveal delay={180}>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-6">
                    <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                      {p.media.sourceType === "REFERENCE"
                        ? "Reference detail — same frame, re-cropped"
                        : "Works photograph — same frame, re-cropped"}
                    </span>
                    <span className="shrink-0 font-tech text-[10px] tracking-[0.2em] text-muted-foreground/70">
                      {p.ref}
                    </span>
                  </figcaption>
                </Reveal>
              </figure>
              <div className="lg:col-span-4 lg:col-start-8 lg:flex lg:flex-col lg:justify-end">
                <Reveal delay={120}>
                  <p className="max-w-sm text-[15px] leading-[1.9] text-muted-foreground/90">
                    {p.practice === 1
                      ? "Every metre is measured, jointed and tested before the trench closes — the street forgets the work, the network does not."
                      : "Balanced, charged, flow-verified and commissioned before handover — the plant runs quiet because the engineering was loud."}
                  </p>
                </Reveal>
              </div>
            </div>

            <Reveal delay={200}>
              <p className="mt-16 max-w-2xl text-[13px] leading-[1.9] text-muted-foreground/80">
                {p.media.sourceType === "REFERENCE"
                  ? "Site photography, installation evidence and commissioning documentation for this project are held in the Capex project file — published here as the media library comes online. Nothing on this page presents reference imagery as project photography."
                  : "Photography on this page comes from the Capex company record (the client-supplied profile documents). Full site photography, installation evidence and commissioning documentation are held in the Capex project file."}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------- 05 · related — the archive's own way onward ---------- */}
        {related.length > 0 && (
          <section aria-label="Related records" data-tone="light" className="paper bg-background">
            <div className="mx-auto max-w-[1680px] border-t border-border px-6 py-24 md:px-10 md:py-32 lg:px-12">
              <Reveal>
                <p className="eyebrow-sans text-muted-foreground">Related records</p>
              </Reveal>
              <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
                {related.map((r, i) => (
                  <Reveal key={r.slug} delay={i * 90}>
                    <Link
                      to="/projects/$slug"
                      params={{ slug: r.slug }}
                      className="group block"
                      aria-label={`${r.title} — ${r.city}`}
                    >
                      <ClipReveal edge={i % 2 === 0 ? "right" : "left"} ratio="4 / 5">
                        <img
                          src={r.media.src}
                          alt={r.media.alt}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-[filter] duration-700 [filter:saturate(0.88)] group-hover:[filter:saturate(1)]"
                        />
                      </ClipReveal>
                      <div className="mt-5">
                        <h3 className="font-display text-xl font-normal leading-[1.12] text-foreground/90 transition-colors group-hover:text-foreground md:text-[22px]">
                          {r.title.replace(" — HVAC", "").replace(" — HVAC & Fire", "")}
                        </h3>
                        <p className="mt-1.5 flex items-baseline gap-3 text-xs text-muted-foreground md:text-sm">
                          <span>
                            {r.metrics[0]
                              ? `${r.metrics[0].value}${r.metrics[0].unit ? ` ${r.metrics[0].unit}` : ""} · `
                              : ""}
                            {r.city}
                          </span>
                          <StatusMark status={r.status} className="!text-[10px]" />
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------- 06 · next project — the story's end is the next opening.
            The next project's reference frame waits under a veil; on hover it
            rises toward view, the title shifts, the arrow slides. ---------- */}
        {next && (
          <section
            aria-label="Next project"
            data-tone="dark"
            className="relative overflow-hidden bg-[var(--ink)] text-white"
          >
            <Link
              to="/projects/$slug"
              params={{ slug: next.slug }}
              className="group block"
              aria-label={`Next project — ${next.title}`}
            >
              {/* the quiet preview — the next project's frame, veiled */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden lg:block"
              >
                <img
                  src={next.media.src}
                  alt=""
                  loading="lazy"
                  className={`h-full w-full object-cover object-[60%_50%] opacity-0 transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] group-hover:opacity-[0.22] ${cropOf(next)}`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[var(--ink)]/60 to-[var(--ink)]/20" />
              </div>
              <div className="relative mx-auto max-w-[1680px] px-6 py-24 md:px-10 md:py-32 lg:px-12 lg:py-40">
                <p className="flex items-baseline gap-6">
                  <span className="eyebrow-sans text-white/40">Next project</span>
                  <StatusMark status={next.status} onDark />
                </p>
                <div className="mt-10 flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
                  <h2 className="max-w-[18ch] font-display text-[9vw] font-normal leading-[1.02] tracking-[-0.02em] text-white/85 transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:text-white md:text-[64px]">
                    {next.title.replace(" — HVAC", "").replace(" — HVAC & Fire", "")}
                  </h2>
                  <span className="inline-flex items-center gap-4 pb-2 font-tech text-[11px] uppercase tracking-[0.24em] text-white">
                    <span className="border-b border-white/40 pb-2 transition-colors group-hover:border-white">
                      {next.city}, {next.state}
                    </span>
                    <span className="text-2xl transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </span>
                </div>
                <p className="mt-8 max-w-md text-sm leading-[1.8] text-white/40 transition-colors duration-500 group-hover:text-white/60">
                  {next.scope_line}
                </p>
              </div>
            </Link>
          </section>
        )}
      </main>
      <Closing />
    </div>
  );
}
