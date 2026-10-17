import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * RETIRED — the Sectors atlas is now part of the Capabilities page.
 *
 * The environments the work runs through live in the "Where our engineering
 * works" explorer at /services#where-we-work, beside the disciplines and the
 * delivery register they belong with. This stub keeps every old link and
 * bookmark working: /sectors lands on the living register instead of a dead
 * page. No separate Sectors UI remains.
 */
export const Route = createFileRoute("/sectors/")({
  beforeLoad: () => {
    throw redirect({ to: "/services" });
  },
});
