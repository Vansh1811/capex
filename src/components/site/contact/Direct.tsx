import { Reveal } from "@/components/site/home/Reveal";

/**
 * Direct (Contact): contact information as the primary visual element —
 * not buried in a footer. CALL and WRITE set very large on warm ivory, each
 * an interactive editorial object (underline expansion, arrow reveal on
 * hover/focus) with its verified value from site_settings. The enquiry form
 * continues in the same scene: the emotional progression CONTACT →
 * REQUIREMENT lives on one continuous ground, separated by a breath of
 * space instead of a section break.
 */
export function Direct({ phone, email }: { phone: string; email: string }) {
  return (
    <div className="mt-20 md:mt-28">
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="eyebrow-sans text-muted-foreground/70">Or skip the form</p>
          <p className="eyebrow-sans text-muted-foreground/50">Direct line</p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-2 lg:gap-16">
        {[
          {
            label: "Call",
            value: phone,
            href: `tel:${phone.replace(/[^+\d]/g, "")}`,
            note: "A director or senior manager answers every serious enquiry.",
          },
          {
            label: "Write",
            value: email,
            href: `mailto:${email}`,
            note: "Tell us about the work in writing — same people, same line.",
          },
        ].map((c, i) => (
          <Reveal key={c.label} delay={100 + i * 90}>
            <a href={c.href} className="group block" aria-label={`${c.label} Capex — ${c.value}`}>
              <span className="font-tech text-[11px] uppercase tracking-[0.28em] text-accent">
                {c.label}
              </span>
              <span className="relative mt-4 block overflow-visible">
                <span
                  className={`block break-all font-display font-normal leading-[1.08] tracking-[-0.02em] text-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 ${
                    c.label === "Call"
                      ? "text-[9.5vw] sm:text-6xl lg:text-[3.6rem]"
                      : "text-[6vw] sm:text-4xl lg:text-[2.9rem]"
                  }`}
                >
                  {c.value}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </span>
              <span className="mt-5 flex items-start justify-between gap-4">
                <span className="max-w-xs text-[13px] leading-[1.75] text-muted-foreground">
                  {c.note}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 inline-block shrink-0 text-xl text-foreground opacity-0 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 group-hover:opacity-70 group-focus-visible:translate-x-1.5 group-focus-visible:opacity-70"
                >
                  →
                </span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
