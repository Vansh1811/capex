/**
 * STATIC POLICY PAGES — the retired CMS's `pages` rows, transcribed verbatim
 * from the live database (Phase 6A/7 seeds). These are the three policy pages
 * the Footer links to; they render through the same /$slug route as before.
 * Content is unchanged from what the live site serves today, including the
 * review notes the client has not yet replaced.
 */

export type StaticPage = {
  slug: string;
  title: string;
  content: string;
  seo_title: string | null;
  seo_description: string | null;
};

export const STATIC_PAGES: StaticPage[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content:
      "This Privacy Policy explains how Capex Construction & Engineering Pvt. Ltd. collects and uses information submitted through this website.\n\nWe collect only the details you provide through our enquiry and newsletter forms — name, company, email, phone and your project brief. We use this information solely to respond to your enquiry and to share relevant updates where you have opted in.\n\nWe do not sell or rent your personal information. Data is retained only as long as necessary to serve your enquiry or as required by law.\n\nTo request access to, correction of, or deletion of your data, contact us at the email address published on this website.\n\n[Placeholder — please review with your legal advisor before publishing.]",
    seo_title: "Privacy Policy — Capex Engineering",
    seo_description:
      "How Capex Construction & Engineering Pvt. Ltd. collects, uses and protects information submitted through this website.",
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    content:
      "These Terms govern your use of the Capex Construction & Engineering Pvt. Ltd. website.\n\nContent on this website is provided for general information about our engineering services. Specifications, capacities and project references are indicative and subject to confirmation in a written contract.\n\nAll trademarks, project photographs and content remain the property of Capex Construction & Engineering Pvt. Ltd. unless stated otherwise.\n\n[Placeholder — please review with your legal advisor before publishing.]",
    seo_title: "Terms & Conditions — Capex Engineering",
    seo_description:
      "Terms governing the use of the Capex Construction & Engineering Pvt. Ltd. website.",
  },
  {
    slug: "cookies-policy",
    title: "Cookies Policy",
    content:
      "This website uses cookies to keep the site working correctly and, where enabled, to understand how visitors use our pages.\n\nEssential cookies are required for basic site functionality. Analytics cookies are only set if analytics has been enabled in our website settings.\n\nYou can control or delete cookies through your browser settings at any time.\n\n[Placeholder — please review with your legal advisor before publishing.]",
    seo_title: "Cookies Policy — Capex Engineering",
    seo_description: "How this website uses cookies and how you can control them.",
  },
];

export function findStaticPage(slug: string): StaticPage | null {
  return STATIC_PAGES.find((p) => p.slug === slug) ?? null;
}
