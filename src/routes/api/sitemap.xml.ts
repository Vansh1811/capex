import { createFileRoute } from "@tanstack/react-router";
import { PRACTICE_CORPUS, SERVICE_CORPUS } from "@/lib/services-corpus";
import { SECTOR_CORPUS } from "@/lib/sector-corpus";
import { PROJECT_CORPUS } from "@/lib/project-corpus";

/**
 * /api/sitemap.xml — the public route map, composed from the verified
 * corpora (the single source of which records are published). Static
 * generation-time content; no database involved.
 */
export const Route = createFileRoute("/api/sitemap/xml")({
  server: {
    handlers: {
      GET: async () => {
        const origin = process.env.SITE_URL ?? "https://capex.example.com";

        const urls: { loc: string }[] = [
          { loc: "/" },
          { loc: "/services" },
          { loc: "/projects" },
          { loc: "/projects/completed" },
          { loc: "/projects/ongoing" },
          { loc: "/sectors" },
          { loc: "/about" },
          { loc: "/team" },
          { loc: "/clients" },
          { loc: "/credentials" },
          { loc: "/contact" },
        ];

        for (const s of SERVICE_CORPUS) urls.push({ loc: `/services/${s.slug}` });
        for (const s of SECTOR_CORPUS) urls.push({ loc: `/sectors/${s.slug}` });
        for (const p of PROJECT_CORPUS) urls.push({ loc: `/projects/${p.slug}` });

        const xml =
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls.map((u) => `  <url><loc>${origin}${u.loc}</loc></url>`).join("\n") +
          "\n</urlset>";

        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
