import type { CSSProperties, Ref } from "react";

/**
 * SiteImage — the single optimized image primitive for the Capex site.
 *
 * What it does (no visual change — same crop, same object-fit/position):
 *  - Serves WebP first via <picture> with a JPEG/PNG fallback for older agents.
 *  - Emits a real `srcset` + `sizes` so phones never download desktop pixels.
 *  - Carries intrinsic width/height (or an aspect-ratio frame) so layout is
 *    stable before the bytes arrive (no CLS).
 *  - Lazy + async decode below the fold; eager + high fetch priority only
 *    where the caller marks the image above the fold.
 *
 * Callers preserve their existing className (object-cover, object-[…],
 * filters) — this component only changes delivery, never presentation.
 */

export function publicSrcSet(
  base: string,
  widths: number[],
  fullWidth: number,
  ext = "jpg",
): string {
  const parts = widths.filter((w) => w < fullWidth).map((w) => `${base}-${w}.${ext} ${w}w`);
  parts.push(`${base}.${ext} ${fullWidth}w`);
  return parts.join(", ");
}

/** "/uploads/x/plate.jpg" → "/uploads/x/plate.webp" (only for JPEG plates). */
export function webpFor(src: string): string | undefined {
  if (!src.endsWith(".jpg") || NO_WEBP.has(src)) return undefined;
  return `${src.slice(0, -4)}.webp`;
}

/**
 * Plates where the JPEG compresses better than WebP at indistinguishable
 * quality (verified 2026-09: high-frequency photographic noise). These
 * render JPEG-only — no <source>, no wasted 404.
 */
const NO_WEBP = new Set([
  "/uploads/about/substation.jpg",
  "/uploads/about/substation-2.jpg",
  "/uploads/about-capex/pipeline-work.jpg",
]);

/** Paired JPEG + WebP srcsets for a public asset following the `-640/-1024` convention. */
export function publicSets(base: string, widths: number[], fullWidth: number) {
  return {
    srcSet: publicSrcSet(base, widths, fullWidth, "jpg"),
    webpSrcSet: publicSrcSet(base, widths, fullWidth, "webp"),
  };
}

type SiteImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** e.g. "(max-width: 768px) 100vw, 40vw" — must reflect the real layout. */
  sizes?: string;
  srcSet?: string;
  webpSrcSet?: string;
  /** Intrinsic dimensions — stabilises layout before load (no CLS). */
  width?: number;
  height?: number;
  /** Above-the-fold only. Below-the-fold stays lazy (the default). */
  eager?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  ariaHidden?: boolean | "true" | "false";
  draggable?: boolean;
  imgRef?: Ref<HTMLImageElement>;
  onError?: () => void;
};

export function SiteImage({
  src,
  alt,
  className,
  style,
  sizes,
  srcSet,
  webpSrcSet,
  width,
  height,
  eager = false,
  fetchPriority,
  ariaHidden,
  draggable,
  imgRef,
  onError,
}: SiteImageProps) {
  const webp = webpSrcSet ?? (srcSet ? undefined : webpFor(src));
  return (
    // `contents` — the wrapper generates no box, so the <img> lays out
    // exactly as the raw <img> it replaces (aspect frames, absolute fills,
    // object-cover and reveal animations are unaffected).
    <picture className="contents">
      {webp ? <source type="image/webp" srcSet={webp} sizes={sizes} /> : null}
      <img
        ref={imgRef}
        src={src}
        srcSet={srcSet}
        sizes={srcSet || webp ? sizes : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={fetchPriority ?? (eager ? "high" : "auto")}
        aria-hidden={ariaHidden}
        draggable={draggable}
        onError={onError}
        className={className}
        style={style}
      />
    </picture>
  );
}
