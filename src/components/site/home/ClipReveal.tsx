import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * ClipReveal (final): an image (or framed content) that unblinds from one
 * edge as it enters the viewport — a physical reveal, not a fade.
 *
 * The clip is applied to an INNER layer while the IntersectionObserver
 * watches the OUTER, unclipped frame. (Observing the clipped element
 * itself is a self-blocking loop: a fully clipped element reports zero
 * visible pixels, so the observer never fires and the blind never opens —
 * the bug that made homepage imagery invisible in real scrolling.)
 *
 * The inner media also slides and slightly scales toward its final crop
 * while the blind opens, so the reveal is unmistakably an image being
 * placed into the composition. Under prefers-reduced-motion the frame
 * renders fully open, instantly (global motion layer collapses the
 * transition).
 */
export function ClipReveal({
  children,
  edge = "left",
  className = "",
  innerClassName = "",
  delay = 0,
  ratio,
}: {
  children: ReactNode;
  /** Which edge the blind retreats toward; the image appears to enter from the opposite side. */
  edge?: "left" | "right" | "bottom";
  className?: string;
  /** Classes for the inner wrapper that carries the settle motion. */
  innerClassName?: string;
  delay?: number;
  /** Optional aspect ratio for the frame (e.g. "4 / 3"). */
  ratio?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      // fire when a meaningful part of the frame is genuinely on screen,
      // slightly before it settles fully into the viewport
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden: Record<string, string> = {
    left: "inset(0 100% 0 0)", // blind covers from the right; image enters from the left
    right: "inset(0 0 0 100%)", // image enters from the right
    bottom: "inset(0 0 100% 0)", // rises from below
  };
  const settle: Record<string, string> = {
    left: "translateX(4%) scale(1.06)",
    right: "translateX(-4%) scale(1.06)",
    bottom: "translateY(4%) scale(1.06)",
  };

  const outerStyle: CSSProperties = ratio ? { aspectRatio: ratio } : {};
  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const innerStyle: CSSProperties = {
    clipPath: shown ? "inset(0 0 0 0)" : hidden[edge],
    transform: shown ? "none" : settle[edge],
    transitionProperty: "clip-path, transform",
    transitionDuration: shown ? "1300ms" : "0ms",
    transitionTimingFunction: ease,
    transitionDelay: shown ? `${delay}ms` : "0ms",
  };

  return (
    <div ref={ref} style={outerStyle} className={`overflow-hidden ${className}`}>
      <div aria-hidden="true" style={innerStyle} className={`h-full w-full ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}
