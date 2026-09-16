import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { createPortal } from "react-dom";
import { Menu, X, Phone, ChevronDown, ArrowRight } from "lucide-react";
import { trapFocus } from "@/lib/focus-trap";

export type NavPractice = {
  id: string;
  number: number;
  name: string;
  short_label: string;
  slug: string;
};

export type NavService = { name: string; slug: string; practice_id: string };

export type HeaderData = {
  practices: NavPractice[];
  services: NavService[];
  phone: string;
  brandWordmark: string;
  brandTagline: string;
  logoUrl: string;
  careersActive: boolean;
};

/**
 * Header per Phase 4 §4: transparent→solid over hero, navy otherwise;
 * Capabilities mega-menu grouped by the two practices; mobile drawer with
 * pinned phone + signature CTA. Keyboard-complete (Esc/arrows/aria-expanded).
 */
export function Header({ data }: { data: HeaderData }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // capabilities
  const [companyOpen, setCompanyOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const capRef = useRef<HTMLDivElement>(null);
  const compRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setCompanyOpen(false);
    setDrawerOpen(false);
  }, [location.pathname]);

  // hover-intent for desktop menus
  useEffect(() => {
    const el = capRef.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const open = () => {
      clearTimeout(t);
      setMenuOpen(true);
      setCompanyOpen(false);
    };
    const close = () => {
      t = setTimeout(() => setMenuOpen(false), 240);
    };
    el.addEventListener("mouseenter", open);
    el.addEventListener("mouseleave", close);
    return () => {
      clearTimeout(t);
      el.removeEventListener("mouseenter", open);
      el.removeEventListener("mouseleave", close);
    };
  }, []);

  useEffect(() => {
    const el = compRef.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const open = () => {
      clearTimeout(t);
      setCompanyOpen(true);
      setMenuOpen(false);
    };
    const close = () => {
      t = setTimeout(() => setCompanyOpen(false), 240);
    };
    el.addEventListener("mouseenter", open);
    el.addEventListener("mouseleave", close);
    return () => {
      clearTimeout(t);
      el.removeEventListener("mouseenter", open);
      el.removeEventListener("mouseleave", close);
    };
  }, []);

  const solid = scrolled || !isHeroRoute(location.pathname);
  const servicesOf = (pid: string) => data.services.filter((s) => s.practice_id === pid);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
          solid
            ? "border-b border-white/10 bg-[var(--brand)] text-white"
            : "bg-transparent text-white"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between px-6 transition-all duration-200 lg:px-10 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          {/* wordmark */}
          <Link to="/" className="flex items-center gap-3" aria-label={data.brandWordmark}>
            {data.logoUrl ? <img src={data.logoUrl} alt="" className="h-9 w-auto" /> : null}
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold tracking-tight">
                {data.brandWordmark}
              </span>
              <span className="mt-0.5 hidden font-tech text-[10px] uppercase tracking-[0.18em] opacity-70 sm:block">
                {data.brandTagline}
              </span>
            </span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            <div ref={capRef} className="relative">
              <button
                aria-expanded={menuOpen}
                aria-haspopup="true"
                onClick={() => {
                  setMenuOpen((v) => !v);
                  setCompanyOpen(false);
                }}
                className="flex items-center gap-1.5 py-2 text-sm font-semibold text-white/85 transition-colors hover:text-white"
              >
                Capabilities
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {menuOpen && (
                <div
                  role="group"
                  aria-label="Capabilities"
                  className="absolute left-1/2 top-full w-[860px] -translate-x-1/2 rounded-[4px] border border-border bg-[var(--surface-elevated)] text-foreground shadow-[var(--shadow-overlay)]"
                >
                  <div className="grid grid-cols-3">
                    {data.practices.map((p) => (
                      <div key={p.id} className="border-r border-border p-6 last:border-r-0">
                        <div className="font-tech text-[10px] uppercase tracking-[0.08em] text-accent">
                          [ Practice 0{p.number} ]
                        </div>
                        <Link
                          to="/practices/$slug"
                          params={{ slug: p.slug }}
                          className="mt-2 block font-display text-base font-bold text-foreground hover:text-primary"
                        >
                          {p.short_label}
                        </Link>
                        <ul className="mt-4 space-y-2">
                          {servicesOf(p.id).map((s) => (
                            <li key={s.slug}>
                              <Link
                                to="/services/$slug"
                                params={{ slug: s.slug }}
                                className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                              >
                                {s.name}
                                <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {/* evidence column */}
                    <div className="p-6">
                      <div className="font-tech text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                        Evidence
                      </div>
                      <Link
                        to="/projects"
                        className="mt-3 block font-display text-base font-bold hover:text-primary"
                      >
                        Project Register
                      </Link>
                      <Link
                        to="/sectors"
                        className="mt-2 block text-sm text-muted-foreground hover:text-primary"
                      >
                        Sectors
                      </Link>
                      <Link
                        to="/credentials"
                        className="mt-2 block text-sm text-muted-foreground hover:text-primary"
                      >
                        Credentials
                      </Link>
                      <Link
                        to="/projects"
                        className="mt-6 block border-t border-border pt-4 font-tech text-[11px] uppercase tracking-wide text-muted-foreground hover:text-primary"
                      >
                        View the record →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/projects"
              className="py-2 text-sm font-semibold text-white/85 transition-colors hover:text-white"
              activeProps={{ className: "text-accent" }}
            >
              Projects
            </Link>
            <Link
              to="/sectors"
              className="py-2 text-sm font-semibold text-white/85 transition-colors hover:text-white"
              activeProps={{ className: "text-accent" }}
            >
              Sectors
            </Link>

            <div ref={compRef} className="relative">
              <button
                aria-expanded={companyOpen}
                aria-haspopup="true"
                onClick={() => {
                  setCompanyOpen((v) => !v);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-1.5 py-2 text-sm font-semibold text-white/85 transition-colors hover:text-white"
              >
                Company
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${companyOpen ? "rotate-180" : ""}`}
                />
              </button>
              {companyOpen && (
                <div
                  role="group"
                  aria-label="Company"
                  className="absolute right-0 top-full w-52 rounded-[4px] border border-border bg-[var(--surface-elevated)] py-2 text-foreground shadow-[var(--shadow-overlay)]"
                >
                  {[
                    { to: "/about", label: "About Capex" },
                    { to: "/team", label: "Team" },
                    { to: "/clients", label: "Clients" },
                    { to: "/credentials", label: "Credentials" },
                    ...(data.careersActive ? [{ to: "/careers", label: "Careers" }] : []),
                  ].map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:bg-[var(--surface)] hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* right actions */}
          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${data.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-2 rounded-[4px] border border-white/25 px-3.5 py-2 font-tech text-xs text-white/85 transition-colors hover:border-white/60 hover:text-white xl:flex"
            >
              <Phone className="h-3.5 w-3.5" />
              {data.phone}
            </a>
            <Link
              to="/contact"
              className="hidden rounded-[4px] bg-accent px-4 py-2.5 text-xs font-bold tracking-wide text-[var(--accent-foreground)] transition-transform hover:scale-[1.02] sm:block"
            >
              Start a Project
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              className="grid h-11 w-11 place-items-center rounded-[4px] border border-white/25 text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* mobile drawer */}
      {drawerOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
            <MobileDrawer data={data} onClose={() => setDrawerOpen(false)} />
          </div>,
          document.body,
        )}
    </>
  );
}

function isHeroRoute(path: string) {
  return path === "/" || path.startsWith("/practices/") || path === "/contact";
}

function MobileDrawer({ data, onClose }: { data: HeaderData; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [practiceOpen, setPracticeOpen] = useState<number | null>(1);
  const [companyOpen, setCompanyOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const release = trapFocus(el);
    el.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      release();
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-[var(--brand)] text-white slide-in-right"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <span className="font-display text-lg font-bold">{data.brandWordmark}</span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="grid h-11 w-11 place-items-center rounded-[4px] border border-white/25"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 px-6 py-4">
        {/* practices accordion */}
        {data.practices.map((p) => (
          <div key={p.id} className="border-b border-white/10">
            <div className="flex items-center justify-between py-3">
              <Link
                to="/practices/$slug"
                params={{ slug: p.slug }}
                className="font-display text-base font-bold"
                onClick={onClose}
              >
                <span className="mr-2 font-tech text-[10px] text-accent">0{p.number}</span>
                {p.short_label}
              </Link>
              <button
                onClick={() => setPracticeOpen((v) => (v === p.number ? null : p.number))}
                aria-expanded={practiceOpen === p.number}
                aria-label={`Toggle ${p.short_label} services`}
                className="grid h-11 w-11 place-items-center"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${practiceOpen === p.number ? "rotate-180" : ""}`}
                />
              </button>
            </div>
            {practiceOpen === p.number && (
              <ul className="pb-3 pl-4">
                {data.services
                  .filter((s) => s.practice_id === p.id)
                  .map((s) => (
                    <li key={s.slug}>
                      <Link
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        onClick={onClose}
                        className="block py-2 text-sm text-white/75"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}

        <Link
          to="/projects"
          onClick={onClose}
          className="block border-b border-white/10 py-3 font-display text-base font-bold"
        >
          Projects
        </Link>
        <Link
          to="/sectors"
          onClick={onClose}
          className="block border-b border-white/10 py-3 font-display text-base font-bold"
        >
          Sectors
        </Link>

        <button
          onClick={() => setCompanyOpen((v) => !v)}
          aria-expanded={companyOpen}
          className="flex w-full items-center justify-between border-b border-white/10 py-3 font-display text-base font-bold"
        >
          Company
          <ChevronDown
            className={`h-4 w-4 transition-transform ${companyOpen ? "rotate-180" : ""}`}
          />
        </button>
        {companyOpen && (
          <ul className="pl-4">
            {[
              { to: "/about", label: "About Capex" },
              { to: "/team", label: "Team" },
              { to: "/clients", label: "Clients" },
              { to: "/credentials", label: "Credentials" },
              ...(data.careersActive ? [{ to: "/careers", label: "Careers" }] : []),
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={onClose} className="block py-2 text-sm text-white/75">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-white/10 px-6 py-4">
        <a
          href={`tel:${data.phone.replace(/\s/g, "")}`}
          className="mb-3 flex h-12 items-center gap-3 rounded-[4px] border border-white/25 font-tech text-sm"
        >
          <Phone className="ml-3 h-4 w-4" />
          {data.phone}
        </a>
        <Link
          to="/contact"
          onClick={onClose}
          className="flex h-12 items-center justify-center rounded-[4px] bg-accent text-sm font-bold text-[var(--accent-foreground)]"
        >
          Start a Project
        </Link>
      </div>
    </div>
  );
}
