import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { trapFocus } from "@/lib/focus-trap";

export type SearchDoc = {
  kind: "Project" | "Service" | "Practice" | "Sector" | "Person" | "Client" | "Credential";
  title: string;
  detail: string;
  href: string;
};

export type SearchCorpus = SearchDoc[];

/**
 * Build the searchable corpus from data that is actually live today.
 * Extensible: callers append more SearchDocs as entity tables come online.
 * The people / clients / credentials sets are optional — every published
 * surface passes them, but callers that predate the expanded index keep
 * working unchanged (the fields default to empty).
 */
export function buildSearchCorpus(input: {
  services: { name: string; slug: string; body?: string | null }[];
  sectors: { name: string }[];
  projects: { title: string; detail: string; slug?: string }[];
  people?: { name: string; role: string }[];
  clients?: { name: string; note: string | null }[];
  credentials?: { title: string; issuer: string }[];
}): SearchCorpus {
  const docs: SearchCorpus = [];
  for (const s of input.services)
    docs.push({
      kind: "Service",
      title: s.name,
      detail: s.body?.slice(0, 110) ?? "Service",
      href: "/services",
    });
  docs.push(
    {
      kind: "Practice",
      title: "UG Utilities, Electrical & CGD",
      detail: "Underground HT/LT cable networks, city gas distribution, HDD trenchless",
      href: "/services",
    },
    {
      kind: "Practice",
      title: "MEP, Fire Fighting & Fire Protection",
      detail: "HVAC, VRV, clean rooms, hydrant & sprinkler systems, integrated MEP",
      href: "/services",
    },
  );
  for (const p of input.projects)
    docs.push({
      kind: "Project",
      title: p.title,
      detail: p.detail,
      href: p.slug ? `/projects/${p.slug}` : "/projects",
    });
  for (const s of input.sectors)
    docs.push({ kind: "Sector", title: s.name, detail: "Sector", href: "/sectors" });
  for (const m of input.people ?? [])
    docs.push({ kind: "Person", title: m.name, detail: m.role, href: "/team" });
  for (const c of input.clients ?? [])
    docs.push({
      kind: "Client",
      title: c.name,
      detail: c.note ?? "Client of record",
      href: "/clients",
    });
  for (const r of input.credentials ?? [])
    docs.push({ kind: "Credential", title: r.title, detail: r.issuer, href: "/credentials" });
  return docs;
}

function score(doc: SearchDoc, q: string): number {
  const t = doc.title.toLowerCase();
  const d = doc.detail.toLowerCase();
  if (t.startsWith(q)) return 3;
  if (t.includes(q)) return 2;
  if (d.includes(q) || doc.kind.toLowerCase().includes(q)) return 1;
  return 0;
}

/**
 * SEARCH (final): the quiet sibling of the Studio index — a deep-earth
 * translucent layer over the living homepage (the video keeps playing
 * beneath), not a pale application panel. The composition is an editorial
 * page: a centered SEARCH eyebrow, the large ivory question above a short
 * rule that reacts to typing, and results as spacious unboxed typographic
 * stacks with a copper caret on the active row. No input box, no cards, no
 * chrome. Escape closes, focus is trapped and restored, arrow keys move,
 * Enter opens. Results only ever come from the live corpus.
 */
export function SearchOverlay({
  open,
  onClose,
  corpus,
}: {
  open: boolean;
  onClose: () => void;
  corpus: SearchCorpus;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  // hold the layer mounted through the closing fade (mirrors StudioMenu)
  const [dissolving, setDissolving] = useState(false);
  const mounted = open || dissolving;

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return corpus
      .map((doc) => ({ doc, s: score(doc, query) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((r) => r.doc);
  }, [q, corpus]);

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    document.documentElement.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
      restoreRef.current?.focus?.();
    };
  }, [open]);

  // closing: keep the layer for one fade, then unmount (mirrors StudioMenu)
  useEffect(() => {
    if (open) return;
    setDissolving((d) => (d ? d : true));
  }, [open]);
  useEffect(() => {
    if (open) return;
    if (!dissolving) return;
    const t = setTimeout(() => setDissolving(false), 360);
    return () => clearTimeout(t);
  }, [open, dissolving]);

  useEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    const release = el ? trapFocus(el) : () => {};
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[active]) {
        e.preventDefault();
        navigate({ to: results[active].href });
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      release();
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, results, active, navigate]);

  useEffect(() => setActive(0), [q]);

  if (!mounted) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search Capex"
      aria-hidden={!open || undefined}
      className={`fixed inset-0 z-[80] flex flex-col text-white ${
        open
          ? "layer-in bg-[oklch(0.185_0.02_60/0.9)] opacity-100 backdrop-blur-[10px] backdrop-saturate-[0.9]"
          : "pointer-events-none bg-[oklch(0.185_0.02_60/0.9)] opacity-0 backdrop-blur-[10px] transition-opacity duration-[340ms]"
      }`}
    >
      {/* minimal top controls */}
      <div className="flex items-center justify-between px-6 py-5 lg:px-12">
        <span className="eyebrow-sans text-white/45">Search</span>
        <button
          onClick={onClose}
          tabIndex={open ? undefined : -1}
          className="eyebrow-sans text-white/45 transition-colors hover:text-white"
        >
          Close · Esc
        </button>
      </div>

      {/* the question — centered, the whole "form": type above, rule beneath */}
      <div className="mx-auto flex w-full max-w-[860px] flex-1 flex-col items-center px-6 pt-4 md:pt-8">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What are you looking for?"
          aria-label="Search query"
          autoComplete="off"
          spellCheck={false}
          tabIndex={open ? undefined : -1}
          className="w-full bg-transparent text-center font-display text-[7.4vw] font-normal leading-[1.12] tracking-[-0.02em] text-white outline-none placeholder:text-white/30 focus:outline-none sm:text-[44px] lg:text-[56px]"
        />
        {/* the rule — a restrained underline that responds to presence */}
        <div
          aria-hidden="true"
          className={`mt-7 h-px transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            q.trim() ? "w-28 bg-[var(--accent-display)]" : "w-14 bg-white/30"
          }`}
        />

        {/* the answer — spacious unboxed typographic stacks */}
        <div
          className="mt-10 w-full flex-1 overflow-y-auto pb-16 md:mt-12"
          {...(!open ? { inert: true as never } : {})}
        >
          {q.trim() === "" ? (
            <p className="text-center font-tech text-[11px] uppercase leading-[2] tracking-[0.22em] text-white/40">
              Try — HVAC · Fire · Cable · Metro · Sectors
            </p>
          ) : results.length === 0 ? (
            <div className="text-center">
              <p className="font-display text-xl font-normal text-white/70">
                Nothing matches “{q}” yet.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/45">
                The register is still being populated — verified projects, services and sectors
                appear here as they are published.
              </p>
            </div>
          ) : (
            <ul aria-label="Results" className="mx-auto max-w-[640px]">
              {results.map((r, i) => (
                <li key={`${r.kind}-${r.title}`}>
                  <Link
                    to={r.href}
                    onClick={onClose}
                    onMouseEnter={() => setActive(i)}
                    tabIndex={open ? undefined : -1}
                    className={`group flex items-baseline gap-6 py-5 transition-opacity duration-300 ${
                      i === active ? "" : "opacity-60"
                    }`}
                  >
                    {/* copper caret marks the row the keyboard sits on */}
                    <span
                      aria-hidden="true"
                      className={`-ml-4 shrink-0 font-tech text-sm transition-all duration-300 ${
                        i === active
                          ? "translate-x-0 text-[var(--accent-display)] opacity-100"
                          : "-translate-x-2 text-transparent opacity-0"
                      }`}
                    >
                      →
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`eyebrow-sans block text-[10px] transition-colors duration-300 ${
                          i === active ? "text-white/70" : "text-white/40"
                        }`}
                      >
                        {r.kind}
                      </span>
                      <span
                        className={`mt-1 block font-display text-2xl font-normal leading-[1.1] tracking-[-0.015em] transition-colors duration-300 md:text-[28px] ${
                          i === active ? "text-white" : "text-white/85"
                        }`}
                      >
                        {r.title}
                      </span>
                      <span
                        className={`mt-1 block text-xs leading-relaxed transition-colors duration-300 md:text-sm ${
                          i === active ? "text-white/55" : "text-white/40"
                        }`}
                      >
                        {r.detail}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* footer of the overlay */}
      <div className="px-6 py-4 lg:px-12">
        <p className="eyebrow-sans text-[10px] text-white/30">
          Capex Construction &amp; Engineering — searching verified content
        </p>
      </div>
    </div>
  );
}
