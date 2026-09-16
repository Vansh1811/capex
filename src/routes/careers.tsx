import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * LEGACY CAREERS ROUTE — retired with the CMS.
 *
 * The admin-managed openings collection is gone; there are no verified
 * open positions on record, so the route redirects to the About page's
 * careers section — the same behavior the empty-collection check produced
 * on the live database. External/legacy URLs keep working.
 */
export const Route = createFileRoute("/careers")({
  beforeLoad: () => {
    throw redirect({ to: "/about", hash: "careers" });
  },
});
