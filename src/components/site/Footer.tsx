import { Link } from "@tanstack/react-router";

export type FooterData = {
  brandWordmark: string;
  brandTagline: string;
  phone: string;
  email: string;
  cin: string;
  udyam: string;
  practices: { number: number; short_label: string; slug: string }[];
  services: { name: string; slug: string }[];
  careersActive: boolean;
};

/** Footer per Phase 4 component 30: 4-column register close on deep navy */
export function Footer({ data }: { data: FooterData }) {
  return (
    <footer className="border-t border-white/10 bg-[var(--brand-deep)] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-14 md:grid-cols-4 lg:px-10">
        <div>
          <div className="font-display text-2xl font-bold tracking-tight">{data.brandWordmark}</div>
          <div className="mt-1 font-tech text-[10px] uppercase tracking-[0.18em] text-white/60">
            {data.brandTagline}
          </div>
          <div className="mt-6 space-y-1 font-tech text-xs text-white/70">
            {data.phone && <div>{data.phone}</div>}
            {data.email && (
              <a href={`mailto:${data.email}`} className="hover:text-accent">
                {data.email}
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Practices">
          <div className="font-tech text-[10px] uppercase tracking-[0.08em] text-white/50">
            Practices
          </div>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {data.practices.map((p) => (
              <li key={p.slug}>
                <Link to="/practices/$slug" params={{ slug: p.slug }} className="hover:text-accent">
                  <span className="mr-2 font-tech text-[10px] text-accent">0{p.number}</span>
                  {p.short_label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/projects" className="hover:text-accent">
                Project Register
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Services">
          <div className="font-tech text-[10px] uppercase tracking-[0.08em] text-white/50">
            Services
          </div>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {data.services.slice(0, 8).map((s) => (
              <li key={s.slug}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-accent">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <div className="font-tech text-[10px] uppercase tracking-[0.08em] text-white/50">
            Company
          </div>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link to="/about" className="hover:text-accent">
                About Capex
              </Link>
            </li>
            <li>
              <Link to="/team" className="hover:text-accent">
                Team
              </Link>
            </li>
            <li>
              <Link to="/clients" className="hover:text-accent">
                Clients
              </Link>
            </li>
            <li>
              <Link to="/credentials" className="hover:text-accent">
                Credentials
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Contact
              </Link>
            </li>
            {data.careersActive && (
              <li>
                <Link to="/careers" className="hover:text-accent">
                  Careers
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <div className="font-tech text-[10px] uppercase tracking-wide text-white/50">
            {data.cin && <span>CIN {data.cin}</span>}
            {data.udyam && <span className="ml-4">UDYAM {data.udyam}</span>}
          </div>
          <div className="flex items-center gap-5 font-tech text-[10px] uppercase tracking-wide text-white/50">
            <a href="/privacy-policy" className="hover:text-accent">
              Privacy
            </a>
            <a href="/terms-and-conditions" className="hover:text-accent">
              Terms
            </a>
            <a href="/cookies-policy" className="hover:text-accent">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
