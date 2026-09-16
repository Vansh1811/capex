import { useSuspenseQuery, queryOptions, useQuery } from "@tanstack/react-query";
import { Header, type HeaderData } from "@/components/site/Header";
import { Footer, type FooterData } from "@/components/site/Footer";
import { getNavChrome } from "@/lib/site-data";

/**
 * Public query defaults (Phase 5 §9.2): 5-min staleTime, 30-min gcTime,
 * no polling, no focus/reconnect/mount refetch. Admin keeps its own defaults.
 */
export const PUBLIC_QUERY_DEFAULTS = {
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
} as const;

const chromeQuery = queryOptions({
  queryKey: ["public", "chrome"],
  queryFn: () => getNavChrome(),
  ...PUBLIC_QUERY_DEFAULTS,
});

export function navChromeQueryOptions() {
  return chromeQuery;
}

/** Shared public chrome: <Header/> + children + <Footer/>. Routes wrap content. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const { data } = useSuspenseQuery(chromeQuery);
  const s = data.settings;

  const headerData: HeaderData = {
    practices: data.practices,
    services: data.services,
    phone: s.contact_phone ?? "",
    brandWordmark: s.brand_wordmark || "CAPEX",
    brandTagline: s.logo_tagline || "Construction & Engineering",
    logoUrl: "",
    careersActive: data.careersActive,
  };

  const footerData: FooterData = {
    brandWordmark: headerData.brandWordmark,
    brandTagline: headerData.brandTagline,
    phone: s.contact_phone ?? "",
    email: s.contact_email ?? "",
    cin: data.cin,
    udyam: data.udyam,
    practices: data.practices.map((p) => ({
      number: p.number,
      short_label: p.short_label,
      slug: p.slug,
    })),
    services: data.services,
    careersActive: data.careersActive,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[var(--accent-foreground)]"
      >
        Skip to content
      </a>
      <Header data={headerData} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer data={footerData} />
    </div>
  );
}
