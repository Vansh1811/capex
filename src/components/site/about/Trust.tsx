import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/home/Reveal";
import { ClipReveal } from "@/components/site/home/ClipReveal";
import { SiteImage } from "@/components/site/SiteImage";
import { TRUST } from "@/lib/about-content";
import trustImg from "@/assets/About-page/About-page-trust.jpg";
import trustImgWebp from "@/assets/About-page/About-page-trust.webp";
import trustImg640 from "@/assets/About-page/About-page-trust-640.jpg";
import trustImg640Webp from "@/assets/About-page/About-page-trust-640.webp";

/**
 * Trust (About): a restrained bridge — one statement, then the doors.
 * Client and credential detail belongs to those pages; About only claims
 * what the record shows (long-term associations with public-sector
 * undertakings, gas utilities, EPC majors — DOC C p3). No testimonials,
 * no awards, no logos. The statement holds the left field; a real
 * site-testing plate — the work itself, documented — carries the right.
 */
export function Trust() {
  return (
    <section
      aria-label="Trust and proof"
      data-tone="dark"
      className="relative overflow-hidden bg-[var(--brand)] text-white"
    >
      <div className="mx-auto max-w-[1680px] px-6 py-28 md:px-10 md:py-40 lg:px-12 lg:py-48">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* the statement */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow-sans text-white/50">{TRUST.eyebrow}</p>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-10 max-w-[16ch] text-balance font-display text-[42px] font-normal leading-[1.05] tracking-[-0.025em] md:text-[64px] lg:text-[80px]">
                {TRUST.headline}
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-10 max-w-lg text-[15px] leading-[1.8] text-white/65">
                {TRUST.body}
              </p>
            </Reveal>

            <div className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
              {TRUST.links.map((l, i) => (
                <Reveal key={l.to} delay={240 + i * 90}>
                  <Link
                    to={l.to}
                    className="group inline-flex items-center gap-4 border-b border-white/50 pb-3 transition-colors hover:border-white"
                  >
                    <span className="font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">
                      {l.label}
                    </span>
                    <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5 md:text-2xl">
                      →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>

          {/* the proof — site testing, documented, not claimed */}
          <div className="lg:col-span-5">
            <ClipReveal edge="right" ratio="4 / 5" delay={160}>
              <SiteImage
                src={trustImg}
                srcSet={`${trustImg640} 640w, ${trustImg} 1024w`}
                webpSrcSet={`${trustImg640Webp} 640w, ${trustImgWebp} 1024w`}
                sizes="(max-width: 1024px) 100vw, 42vw"
                width={1024}
                height={1536}
                alt="Engineer pressure-testing pipework with calibrated gauges and a digital test instrument during testing and commissioning"
                className="h-full w-full object-cover"
              />
            </ClipReveal>
            <Reveal delay={300}>
              <p className="mt-4 font-tech text-[10px] uppercase tracking-[0.2em] text-white/45">
                Testing and commissioning — calibrated pressure testing
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
