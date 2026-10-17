import { Reveal } from "@/components/site/home/Reveal";

/**
 * Direct (Contact): the compact verified contact alternative — a quiet band
 * beneath the enquiry panel, not a competing headline. CALL and WRITE carry
 * their verified values from site_settings with the same underline/arrow
 * behaviour as the rest of the line, at a reading scale that invites but
 * does not shout. The enquiry form remains the page's primary action.
 */
export function Direct({ phone, email }: { phone: string; email: string }) {
  return (
    <div className="mt-14 md:mt-16">
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="eyebrow-sans text-muted-foreground/70">Or skip the form</p>
          <p className="eyebrow-sans text-muted-foreground/50">Direct line</p>
        </div>

        <div className="mt-8 grid gap-x-16 gap-y-8 border-t border-border pt-8 sm:grid-cols-2 md:mt-10 md:pt-10">
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
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="group block"
              aria-label={`${c.label} Capex — ${c.value}`}
            >
              <span className="font-tech text-[11px] uppercase tracking-[0.28em] text-accent">
                {c.label}
              </span>
              <span className="mt-3 relative block">
                <span className="relative block break-all font-display font-medium tracking-[-0.01em] text-foreground text-xl md:text-2xl">
                  {c.value}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </span>
              </span>
              <span className="mt-3 flex items-start justify-between gap-4">
                <span className="max-w-xs text-[13px] leading-[1.75] text-muted-foreground">
                  {c.note}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-block shrink-0 text-lg text-foreground opacity-0 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 group-hover:opacity-70 group-focus-visible:translate-x-1.5 group-focus-visible:opacity-70"
                >
                  →
                </span>
              </span>
            </a>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
