import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { findStaticPage } from "@/lib/static-pages";

/**
 * Static policy pages (Privacy / Terms / Cookies) — content transcribed
 * verbatim from the retired CMS's pages table (src/lib/static-pages.ts).
 * No database involved; the route keeps its legacy URL shape.
 */
export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const page = findStaticPage(params.slug);
    if (!page) throw notFound();
    return page;
  },
  component: PageView,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-8 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold">Page not found</h1>
        <Link to="/" className="mt-4 inline-block text-sm text-brand">
          Back to homepage
        </Link>
      </div>
    </div>
  ),
  head: ({ loaderData }) => {
    const p = loaderData;
    const title = p?.seo_title || p?.title || "Capex Engineering";
    const description = p?.seo_description || "Capex Construction & Engineering Pvt. Ltd.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
});

function PageView() {
  const { slug } = Route.useParams();
  const page = findStaticPage(slug);
  if (!page) return null;

  return (
    <main className="min-h-screen bg-background pb-24 pt-24">
      <article className="container-x max-w-3xl">
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-brand"
        >
          ← Back to website
        </Link>
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-5xl">
          {page.title}
        </h1>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
          {page.content
            .split("\n\n")
            .filter(Boolean)
            .map((p, i) => (
              <p key={i} className="whitespace-pre-line">
                {p}
              </p>
            ))}
        </div>
      </article>
    </main>
  );
}
