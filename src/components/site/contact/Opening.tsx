import { ClipReveal } from "@/components/site/home/ClipReveal";
import { Reveal } from "@/components/site/home/Reveal";
import { useEntrance } from "@/components/site/home/HeroVideo";

/**
 * Opening (Contact): the first frame of THE OPEN LINE — deep earth, almost
 * black, the beginning of a relationship rather than a request for details.
 * A single large atmospheric frame (a common utility tunnel — reference
 * imagery, never Capex work) enters behind the type with a clip reveal,
 * resting in the lower field like the systems the company builds: quiet,
 * structural, already there. The statement continues the brand voice —
 * "START WITH A CONVERSATION." — no CTA cluster, no buttons. The enquiry
 * itself lives one scroll away, and the thin arrow at the floor says so.
 */
export function Opening({ phone, email }: { phone: string; email: string }) {
  const enter = useEntrance(160);

  return (
    <section
      aria-label="Contact Capex — start with a conversation"
      data-tone="dark"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[var(--brand-deep)] text-white"
    >
      {/* the atmosphere: a utility corridor, placed low and wide — the
          engineered ground the whole site journey has been standing on */}
      <div className="absolute inset-x-0 bottom-0 h-[58%] md:h-[62%]">
        <ClipReveal edge="left" delay={340} className="h-full w-full">
          <img
            src="/uploads/contact/hero-tunnel.jpg"
            alt="A common utility tunnel — reference imagery, not a Capex project"
            loading="eager"
            className="h-full w-full object-cover [filter:saturate(0.62)_contrast(1.06)_brightness(0.64)]"
          />
        </ClipReveal>
        {/* settle the plate into the ground + keep the channel strip readable
            (a soft scrim under the CALL/WRITE band, not a full overlay) */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--brand-deep)] to-transparent" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[oklch(0.185_0.02_60/0.72)] via-[oklch(0.185_0.02_60/0.38)] to-transparent"
        />
      </div>
      <div
        aria-hidden="true"
        className="survey-grid pointer-events-none absolute inset-0 opacity-25"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-6 pb-24 pt-32 md:px-10 md:pb-28 md:pt-40 lg:px-12">
        <Reveal delay={60}>
          <p className="eyebrow-sans text-white/45">Contact</p>
        </Reveal>

        <div className="mt-10 md:mt-14">
          <h1 className="max-w-[15ch] font-display text-[12.5vw] font-normal leading-[1.02] tracking-[-0.025em] md:text-[80px] lg:text-[min(7.6vw,124px)]">
            {["Start with", "a conversation."].map((line, i) => {
              const e = enter(i);
              return (
                <span key={line} className={`block ${e.className}`} style={e.style}>
                  {line}
                </span>
              );
            })}
          </h1>
          <p
            className={`mt-8 max-w-md text-sm leading-[1.85] text-white/65 md:text-[15px] ${enter(2).className}`}
            style={enter(2).style}
          >
            Tell us what you are planning, in your own words. The engineering can start with a phone
            call — a director or senior manager responds to every serious enquiry.
          </p>
        </div>

        {/* direct channels, quietly stated in the opening frame itself —
            discoverable within seconds, no digging */}
        <div className={`mt-16 md:mt-24 ${enter(3).className}`} style={enter(3).style}>
          <div className="flex flex-col gap-8 border-t border-white/15 pt-8 sm:flex-row sm:gap-16">
            {[
              { label: "Call", value: phone, href: `tel:${phone.replace(/[^+\d]/g, "")}` },
              { label: "Write", value: email, href: `mailto:${email}` },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group w-fit"
                aria-label={`${c.label} Capex — ${c.value}`}
              >
                <span className="block text-[10px] uppercase tracking-[0.28em] text-white/50 transition-colors group-hover:text-white/80">
                  {c.label}
                </span>
                <span className="relative mt-2 inline-block font-display text-xl font-medium tracking-[-0.01em] text-white transition-colors group-hover:text-white md:text-2xl">
                  {c.value}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white/70 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                  />
                  <span
                    aria-hidden="true"
                    className="ml-3 inline-block -translate-x-2 text-base opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-70"
                  >
                    →
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* the open line's first mark — a hairline pointing onward */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 flex h-16 items-end justify-end pb-6 pr-6 md:pr-10 lg:pr-12 ${enter(4).className}`}
        style={enter(4).style}
      >
        <svg width="14" height="42" viewBox="0 0 14 42" fill="none" className="text-white/60">
          <path d="M7 0v38" stroke="currentColor" strokeWidth="1" />
          <path
            d="M1 33.5 7 41l6-7.5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
