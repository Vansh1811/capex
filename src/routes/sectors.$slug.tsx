import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * RETIRED — /sectors/$slug has no public detail UI. The environments live
 * in the sector explorer on the Capabilities page
 * (/services#where-we-work); any legacy sector-detail URL redirects there
 * instead of landing on a broken page.
 */
export const Route = createFileRoute("/sectors/$slug")({
  beforeLoad: () => {
    throw redirect({ to: "/services" });
  },
});
