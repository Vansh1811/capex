import { type ReactNode } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getProjectCaseStudy, getSearchCorpus, type ArchiveProject } from "@/lib/site-data";
import { PUBLIC_QUERY_DEFAULTS } from "@/components/site/SiteChrome";
import { Closing } from "@/components/site/home/Closing";
import { Reveal } from "@/components/site/home/Reveal";
import { ProjectsExperience } from "@/components/site/projects/ProjectsExperience";
import { StatusMark } from "@/components/site/projects/ArchiveVocabulary";
import { panelTitle } from "@/components/site/projects/RegisterPanels";
import { buildSearchCorpus } from "@/components/site/home/search-corpus";

const detailQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public", "project-case-study", slug],
    queryFn: () => getProjectCaseStudy({ data: { slug } }),
    ...PUBLIC_QUERY_DEFAULTS,
  });

const searchCorpusQuery = queryOptions({
  queryKey: ["public", "search-corpus"],
  queryFn: () => getSearchCorpus(),
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
          The register
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
 * THE PROJECT SHEET — a short, photographic-free record.
 *
 * Five movements and nothing more: an oversized typographic opening, the
 * figures of record as the page's visual centrepiece, one paragraph of
 * documented scope, the related records, then the locked black footer.
 * No hero photograph, no scope lists, no dashboards — the record is
 * carried entirely by type, verified figures and hairlines.
 *
 * Composition adapts to what each record actually holds: two figures
 * spread asymmetrically, a single figure anchored to a full-width rule,
 * or — where the source publishes no quantities — no figures section at
 * all. Nothing is invented to fill space.
 */
function ProjectCaseStudy() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(detailQuery(slug));
  const { data: corpusData } = useSuspenseQuery(searchCorpusQuery);
  const corpus = buildSearchCorpus({
    services: corpusData.services,
    sectors: corpusData.sectors,
    projects: corpusData.projects,
    people: corpusData.people,
    clients: corpusData.clients,
    credentials: corpusData.credentials,
  });

  if (!data) return null;
  const { project: p, related, next } = data;
  const register = p.status === "ongoing" ? "ongoing" : "completed";
  const registerTo = register === "ongoing" ? "/projects/ongoing" : "/projects/completed";
  const registerLabel = register === "ongoing" ? "Ongoing" : "Completed";

  return (
    <ProjectsExperience
      brandWordmark="CAPEX"
      corpus={corpus}
      initialTone="dark"
      footer={<Closing />}
    >
      <ProjectOpening
        p={p}
        registerTo={registerTo}
        registerLabel={registerLabel}
        brief={openingBrief(p)}
      />

      <FiguresOfRecord p={p} />

      <WorkBrief text={workParagraph(p)} />

      <RelatedWork
        related={related}
        next={next}
        register={register}
        registerLabel={registerLabel}
        registerTo={registerTo}
      />
    </ProjectsExperience>
  );
}

/* ==================================================================
 * 01 — THE OPENING. Oversized name, a two-line factual brief and the
 * compact metadata line. The layout is deliberately asymmetric — the
 * brief is set off-axis — so the composition reads composed rather
 * than as a missing image column.
 * ================================================================== */

function openingBrief(p: ArchiveProject): string {
  const verb = p.status === "ongoing" ? "In delivery" : "Delivered";
  const who = p.client_display ? ` for ${p.client_display}` : "";
  return `${verb}${who} — ${p.scope_line}.`;
}

function ProjectOpening({
  p,
  brief,
  registerTo,
  registerLabel,
}: {
  p: ArchiveProject;
  brief: string;
  registerTo: string;
  registerLabel: string;
}) {
  return (
    <section aria-label={p.title} data-tone="dark" className="band-espresso">
      <div className="mx-auto max-w-[1680px] px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40 lg:px-12">
        <Reveal>
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"
          >
            <Link
              to={registerTo}
              className="eyebrow-sans text-muted-foreground transition-colors hover:text-foreground"
            >
              {registerLabel} projects
            </Link>
            <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
              Capex project record
            </span>
          </nav>
        </Reveal>

        <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-x-12">
          <Reveal className="lg:col-span-12">
            <p className="font-tech text-[11px] uppercase tracking-[0.22em] text-[var(--accent)]">
              {registerLabel} project · Sheet {p.ref}
            </p>
          </Reveal>

          <Reveal delay={90} className="lg:col-span-11">
            <h1 className="mt-7 font-display text-[clamp(2.75rem,8.5vw,7rem)] font-normal leading-[0.98] tracking-[-0.03em]">
              {p.title}
            </h1>
          </Reveal>

          <Reveal delay={180} className="lg:col-span-7">
            <p className="mt-9 max-w-[46ch] text-balance font-display text-[21px] font-normal leading-[1.4] tracking-[-0.01em] text-foreground/85 md:text-[27px]">
              {brief}
            </p>
          </Reveal>
        </div>

        <Reveal delay={260}>
          <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-6 border-t border-border pt-7">
            <MetaItem k="Reference" v={p.ref} />
            <MetaItem k="Location" v={`${p.city}, ${p.state}`} />
            <MetaItem k="Practice" v={p.practice_label} />
            {p.client_display && <MetaItem k="Client" v={p.client_display} />}
            <MetaItem k="Completion" v={<StatusMark status={p.status} onDark />} />
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

function MetaItem({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/55">
        {k}
      </dt>
      <dd className="mt-2.5 text-sm leading-[1.6] text-foreground/90 md:text-[15px]">{v}</dd>
    </div>
  );
}

/* ==================================================================
 * 02 — FIGURES OF RECORD. The page's centrepiece: the record's verified
 * figures as architecture, not KPI cards. Two figures spread across an
 * asymmetric grid; a single figure anchored to a rule that runs to the
 * edge. Units stay in the mono register; every figure is labelled.
 * The section omits itself when the source publishes no quantities.
 * ================================================================== */

type Metric = { label: string; value: string; unit: string };

const FIG_LEAD = "text-[clamp(4.25rem,14vw,12.5rem)]";
const FIG_SECOND = "text-[clamp(2.5rem,7vw,6rem)]";

function FiguresOfRecord({ p }: { p: ArchiveProject }) {
  const metrics = p.metrics;
  if (metrics.length === 0) return null;
  const paired = metrics.length > 1;

  return (
    <section aria-label="Figures of record" data-tone="light" className="paper bg-background">
      <div className="mx-auto max-w-[1680px] px-6 py-20 md:px-10 md:py-28 lg:px-12 lg:py-36">
        <Reveal>
          <SectionRule
            label="Figures of record"
            right={
              <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/55">
                {p.practice_label}
              </span>
            }
          />
        </Reveal>

        {paired ? (
          <div className="mt-14 grid gap-y-16 lg:mt-20 lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-7">
              <Reveal>
                <Figure m={metrics[0]} size={FIG_LEAD} />
              </Reveal>
            </div>
            <div className="lg:col-span-5 lg:self-end lg:border-l lg:border-border lg:pl-16 lg:pb-2">
              <Reveal delay={120}>
                <Figure m={metrics[1]} size={FIG_SECOND} />
              </Reveal>
            </div>
          </div>
        ) : (
          <div className="mt-14 lg:mt-20">
            <Reveal>
              <Figure m={metrics[0]} size={FIG_LEAD} />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

function Figure({ m, size }: { m: Metric; size: string }) {
  return (
    <div>
      <p className={`font-display font-normal leading-[0.8] tracking-[-0.045em] ${size}`}>
        {m.value}
        {m.unit && (
          <span className="ml-[0.14em] align-baseline font-tech text-[0.17em] uppercase tracking-[0.1em] text-[var(--accent)]">
            {m.unit}
          </span>
        )}
      </p>
      <div className="mt-6 flex items-center gap-5">
        <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
          {m.label}
        </p>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}

/* ==================================================================
 * 03 — THE WORK, BRIEFLY. One paragraph, composed only from the
 * record's own scope, practice, sector and status fields. No lists.
 * ================================================================== */

function workParagraph(p: ArchiveProject): string {
  const svc = p.services.map((s) => s.name).join(", ");
  const scope = svc
    ? `The documented scope covers ${svc}.`
    : `The documented scope: ${p.scope_line}.`;
  const sector = p.sectors[0] ? `, within the ${p.sectors[0].name} sector` : "";
  const status =
    p.status === "ongoing"
      ? "The programme remains ongoing on the company record."
      : "The work stands complete on the company record.";
  return `${scope} The record is held under Capex's ${p.practice_name} practice${sector}. ${status}`;
}

function WorkBrief({ text }: { text: string }) {
  return (
    <section aria-label="The work" data-tone="dark" className="band-espresso">
      <div className="mx-auto max-w-[1680px] px-6 py-20 md:px-10 md:py-28 lg:px-12 lg:py-32">
        <Reveal>
          <SectionRule label="The work, briefly" />
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-10 max-w-[56ch] text-balance font-display text-[21px] font-normal leading-[1.5] tracking-[-0.01em] text-foreground md:text-[28px]">
            {text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ==================================================================
 * 04 — RELATED WORK. Two or three records as editorial rows: sheet ref,
 * name, location, a verified headline figure where one exists. Then a
 * quiet continuity line into the register.
 * ================================================================== */

function RelatedWork({
  related,
  next,
  register,
  registerLabel,
  registerTo,
}: {
  related: ArchiveProject[];
  next: ArchiveProject;
  register: string;
  registerLabel: string;
  registerTo: string;
}) {
  if (related.length === 0 && !next) return null;

  return (
    <section aria-label="Related work" data-tone="light" className="paper bg-background">
      <div className="mx-auto max-w-[1680px] px-6 pb-28 pt-20 md:px-10 md:pb-32 md:pt-28 lg:px-12 lg:pt-32">
        <Reveal>
          <SectionRule label="Related work" />
        </Reveal>

        {related.length > 0 && (
          <Reveal delay={100}>
            <ul className="mt-12">
              {related.map((r) => (
                <li key={r.slug}>
                  <RelatedRow p={r} />
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {next && (
          <Reveal delay={140}>
            <Link
              to="/projects/$slug"
              params={{ slug: next.slug }}
              className="group mt-14 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-foreground/20 pb-5 transition-colors duration-300 hover:border-foreground"
              aria-label={`Next project — ${panelTitle(next)}`}
            >
              <span className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                Next in the {register} register
              </span>
              <span className="flex items-baseline gap-5">
                <span className="max-w-[34ch] font-display text-[22px] font-normal leading-[1.15] tracking-[-0.015em] text-foreground/90 transition-colors duration-300 group-hover:text-foreground md:text-[28px]">
                  {panelTitle(next)}
                </span>
                <Arrow />
              </span>
            </Link>
          </Reveal>
        )}

        <Reveal delay={180}>
          <div className="mt-14 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 border-t border-border pt-6">
            <p className="font-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              The register
            </p>
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-2">
              <Link
                to={registerTo}
                className="eyebrow-sans text-muted-foreground transition-colors hover:text-foreground"
              >
                {registerLabel} archive →
              </Link>
              <Link
                to="/projects"
                className="eyebrow-sans text-muted-foreground transition-colors hover:text-foreground"
              >
                All projects →
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function RelatedRow({ p }: { p: ArchiveProject }) {
  const m = p.metrics[0];
  const figure = m ? `${m.value}${m.unit ? ` ${m.unit}` : ""}` : null;

  return (
    <Link
      to="/projects/$slug"
      params={{ slug: p.slug }}
      className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-border py-6 transition-colors duration-300 hover:border-foreground/50"
      aria-label={`${panelTitle(p)} — ${p.city}, ${p.state}`}
    >
      <span className="flex min-w-0 items-baseline gap-5 md:gap-7">
        <span className="shrink-0 font-tech text-[11px] tracking-[0.12em] text-muted-foreground/55 transition-colors duration-300 group-hover:text-foreground">
          {p.ref}
        </span>
        <span className="min-w-0 font-display text-[22px] font-normal leading-[1.12] tracking-[-0.02em] text-foreground/85 transition-colors duration-300 group-hover:text-foreground md:text-[30px]">
          {panelTitle(p)}
        </span>
      </span>
      <span className="flex flex-wrap items-baseline gap-x-7 gap-y-1">
        <span className="font-tech text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
          {p.city}, {p.state}
        </span>
        {figure && (
          <span className="font-tech text-[12px] uppercase tracking-[0.1em] text-[var(--accent)]">
            {figure}
          </span>
        )}
        <span className="hidden md:inline-flex">
          <Arrow />
        </span>
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */

function SectionRule({ label, right }: { label: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
      <p className="eyebrow-sans text-muted-foreground">{label}</p>
      <span aria-hidden="true" className="h-px flex-1 border-t border-border" />
      {right}
    </div>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`text-base text-foreground/70 transition-transform duration-300 group-hover:translate-x-1 ${className}`}
    >
      →
    </span>
  );
}
