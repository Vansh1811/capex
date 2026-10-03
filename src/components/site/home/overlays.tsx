import { Suspense, lazy } from "react";
import type { SearchCorpus } from "./search-corpus";

/**
 * Overlay entry points (performance): SearchOverlay and StudioMenu mount
 * closed and are only needed on user interaction, so their interactive code
 * (focus trapping, filtering, navigation) loads on demand instead of riding
 * inside every page's initial JS bundle. Same props, same visuals — the
 * Suspense boundary resolves to null while the chunk loads, and both layers
 * start closed so there is never a visible flash. `buildSearchCorpus` stays
 * a static import at call sites (tiny pure function, tree-shaken).
 */

const LazySearchOverlay = lazy(() =>
  import("./SearchOverlay").then((m) => ({ default: m.SearchOverlay })),
);

const LazyStudioMenu = lazy(() => import("./StudioMenu").then((m) => ({ default: m.StudioMenu })));

export function SearchOverlay({
  open,
  onClose,
  corpus,
}: {
  open: boolean;
  onClose: () => void;
  corpus: SearchCorpus;
}) {
  return (
    <Suspense fallback={null}>
      <LazySearchOverlay open={open} onClose={onClose} corpus={corpus} />
    </Suspense>
  );
}

export function StudioMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Suspense fallback={null}>
      <LazyStudioMenu open={open} onClose={onClose} />
    </Suspense>
  );
}
