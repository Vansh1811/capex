import { useEffect, useRef, useState } from "react";

/**
 * Hero video (V3): the real Capex pipeline film, full-bleed, looping for as
 * long as the hero is visible. autoplay · muted · playsInline · loop. The
 * crop is art-directed per viewport shape: the subject sits low in the
 * frame, so portrait screens anchor toward the bottom of the footage while
 * wide screens keep the full letterbox breathing. When the hero scrolls
 * out of view the video pauses; it resumes on return.
 */
export function HeroVideo({ poster }: { poster: string }) {
  const vref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = vref.current;
    const wrap = wrapRef.current;
    if (!v || !wrap) return;
    v.play().catch(() => {});
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      <video
        ref={vref}
        className="h-full w-full object-cover object-[50%_62%] md:object-[50%_50%] lg:object-[46%_50%]"
        poster={poster}
        autoPlay
        muted
        playsInline
        loop
        preload="metadata"
      >
        {/* Small screens get the 640px encode (~0.5MB); larger screens the
            720p encode (~1.8MB). No visual change — same film, same crop. */}
        <source src="/media/capex-hero-640.mp4" type="video/mp4" media="(max-width: 640px)" />
        <source src="/media/capex-hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

/** Lines of the headline that rise into place once, staggered, on load. */
export function useEntrance(delayStep = 140) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return (index: number) => ({
    className: `transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
      ready ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`,
    style: { transitionDelay: `${240 + index * delayStep}ms` },
  });
}

/**
 * Homepage hero entrance: the text is FULLY VISIBLE on first paint
 * (opacity-100 in the initial HTML — never opacity-0) and then performs only
 * a short, subtle positional settle once mounted. It waits for nothing: not
 * the video, not data, not hydration-delayed "ready" state beyond a single
 * frame. If the video loads slowly or fails entirely, the headline still
 * reads instantly.
 */
export function useInstantEntrance(delayStep = 70) {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return (index: number) => ({
    className: `transition-transform duration-[350ms] ease-out ${
      settled ? "translate-y-0" : "translate-y-[6px]"
    }`,
    style: { transitionDelay: `${index * delayStep}ms` },
  });
}
