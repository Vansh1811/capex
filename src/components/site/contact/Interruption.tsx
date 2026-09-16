import { ClipReveal } from "@/components/site/home/ClipReveal";

/**
 * Interruption (Contact): the visual breath between the functional content
 * and the close — pipework at full bleed (reference imagery, not Capex
 * work). A wide 2:1 frame with edge bleed and negative space; the same
 * clip-reveal language as the hero, entered from the opposite edge so the
 * two images speak to each other across the page.
 */
export function Interruption() {
  return (
    <section
      aria-label="Engineered systems — reference imagery"
      data-tone="dark"
      className="relative bg-[var(--brand-deep)] text-white"
    >
      <div className="relative">
        <ClipReveal edge="right" ratio="21 / 9" className="w-full">
          <img
            src="/uploads/contact/plant-pipes.jpg"
            alt="Boiler-room pipework — reference imagery, not a Capex installation"
            loading="lazy"
            className="h-full w-full object-cover [filter:saturate(0.6)_contrast(1.05)_brightness(0.72)]"
          />
        </ClipReveal>
        {/* edge bleed into the deep ground above and below */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--brand-deep)] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--brand-deep)] to-transparent" />
      </div>
    </section>
  );
}
