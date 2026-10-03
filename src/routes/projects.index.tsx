import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * RETIRED GATEWAY — /projects no longer renders the Completed/Ongoing
 * choice screen. PROJECTS goes straight to the archive: this route
 * redirects to /projects/completed (the primary destination), which
 * already carries the subtle Completed/Ongoing switch. /projects/ongoing
 * and all project detail routes are untouched.
 */
export const Route = createFileRoute("/projects/")({
  beforeLoad: () => {
    throw redirect({ to: "/projects/completed" });
  },
  component: () => null,
});
