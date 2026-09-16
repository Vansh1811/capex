import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * LEGACY PRACTICE ROUTE — retired.
 *
 * The old practice detail pages (Phase 4 engineering-documentation UI) are
 * superseded by THE ENGINE ROOM at /services, whose Two Practices rooms carry
 * the same two-worlds content in the approved editorial direction. On the
 * pre-migration database this route also rendered a permanently blank page
 * (getPracticePage resolves null — the entity tables are not applied), so it
 * is redirected rather than kept as a dead end. Any external/legacy URL keeps
 * working and lands on the living register.
 */
export const Route = createFileRoute("/practices/$slug")({
  beforeLoad: () => {
    throw redirect({ to: "/services" });
  },
});
