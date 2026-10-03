import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * RETIRED — /sectors/$slug is no longer part of the public architecture.
 * The Sectors section is a single-page atlas at /sectors. This stub keeps
 * old sector-detail URLs graceful: any visit redirects to the atlas instead
 * of landing on a broken page. No detail UI remains.
 */
export const Route = createFileRoute("/sectors/$slug")({
  beforeLoad: () => {
    throw redirect({ to: "/sectors" });
  },
  component: () => null,
});
