# Phase 4 — Capex Visual Design System & Page Experience Blueprint

**Capex Construction & Engineering Pvt. Ltd. · Prepared 2026-09-03**

**Status:** DESIGN SPECIFICATION — awaiting client review. This document defines *what the website should look like, feel like, and behave like*. No code, database, CMS content, routes, or components have been created or modified. This is the handoff artifact for a future implementation phase.

**Sources of truth:** Phase 1 (Company Discovery — company facts, conflict register C1–C25), Phase 2 (Website & Codebase Audit — technical debt TD1–TD20, security S1–S7), Phase 3 (Website Strategy, IA & Design Blueprint — all strategic decisions), plus read-only inspection of the existing prototype (`styles.css` tokens, `Nav.tsx`, `index.tsx`, routes, migrations) to ground constraints.

**North star (carried from Phase 3):**

> **ENGINEERING DOCUMENTATION × PREMIUM ARCHITECTURE × REAL PROJECT EVIDENCE**

**Conventions:**
- **[P3]** — decision carried forward unchanged from Phase 3.
- **[NEW]** — visual/UX decision introduced in this phase (consistent with Phase 3 strategy, but new specificity).
- **[VERIFY: Cn / gate]** — verification constraint preserved; the design must not resolve it silently. Full register in §10.1 of Phase 3 and §23 of this document.
- **Draft copy** shown in code font is *structural placeholder for layout only* — wording requires client approval; it invents no facts.
- All quantities referenced (4,000 TR, 150 km, 5,000 connections, 32 t HDD, etc.) are documented in Phase 1 §4. Nothing numeric in this document is invented.

---

## 1. VISUAL DESIGN PRINCIPLES

Twelve principles govern every screen. Each states: meaning · why it fits Capex · how it appears · what it explicitly avoids.

### 1.1 Evidence before adjectives
**Meaning:** Every claim is visually subordinate to its proof — the number, the name, the document comes first; the adjective comes second or never.
**Why Capex:** Capex's documents are full of hard proof (4,000 TR, 150 km, CIN/GST registries, L&T/TATA Projects) while its current site leads with unverifiable marketing ("150+ Projects Commissioned" — flagged, Phase 2 §12). Evidence is Capex's actual differentiator [P3 §12.1].
**In the interface:** metrics render larger than their labels; project tiles lead with quantity; credentials render as a registry table with real numbers; client names appear grouped by real relationship.
**Avoid:** giant unsupported stat callouts ("150+ Projects"), superlative headlines with nothing behind them ("Leading", "Premier" as standalone claims).

### 1.2 The document is the aesthetic
**Meaning:** The site borrows the visual grammar of engineering documentation — title blocks, numbered sections, hairline rules, mono annotations, tabular data — as its decorative system, so decoration *is* information.
**Why Capex:** The audience (EPC procurement, utility engineers, PMCs) reads drawings and registers daily; this grammar signals membership in their world [P3 §7.2].
**In the interface:** section headers as drawing-sheet title blocks; mono record references; hairline tables; numbered bands (§3).
**Avoid:** a literal "blueprint theme" — no grid-paper backgrounds everywhere, no cyan dashed lines, no fake CAD chrome, no compass-rose clip art (§3.4 boundary rules).

### 1.3 Restraint as confidence
**Meaning:** Few colors, few effects, one accent used sparingly; the site says less per screen than competitors.
**Why Capex:** Premium = self-assurance; Capex's evidence carries the persuasion, so the design doesn't need to shout [P3 §1.6].
**In the interface:** amber appears only on section numbers, key metrics, and one signature CTA per view; one primary action per screen; shadows essentially absent (§2.8).
**Avoid:** multi-accent palettes, gradient banners, glow effects, "attention-grabbing" color blocks.

### 1.4 Typography carries the brand
**Meaning:** Scale, weight, and spacing of type — not imagery or effects — create hierarchy and mood.
**Why Capex:** Three display sizes exist (Space Grotesk) with an industrial-technical character already in the prototype; leaning on type avoids dependence on photography Capex doesn't yet have [P3 §7.3].
**In the interface:** large display statements with tight tracking; mono for every number and label of record; generous line-height discipline (§2.1).
**Avoid:** decorative fonts, center-everything layouts, text on busy backgrounds, more than 3 font families.

### 1.5 The quantity is the image
**Meaning:** Where a competitor would place a stock photo, Capex places a number — rendered with the same visual weight as photography.
**Why Capex:** Capex's documented quantities (4,000 TR; 150 km 11/33 kV; 5,000 connections; 220 kV metro feed) are its most distinctive content; no benchmark makes numbers the hero [P3 §12.1].
**In the interface:** instrument-panel metric bands (§5.7), metric-led project rows, tabular numerals everywhere (§2.1).
**Avoid:** meaningless giant statistics, counting animations on unverified numbers, icons replacing data.

### 1.6 One company, two disciplines
**Meaning:** Practice 01 and Practice 02 share every template, token, and component; they differ by *content* (subject, quantities, evidence), never by visual system.
**Why Capex:** The practices share one director pool and one brand [P3 §1.3, DOC A p8]; splitting them visually would fabricate two companies.
**In the interface:** identical page skeletons for both practice pages, mirrored hero compositions as the only asymmetry (§6.2); practice chips as quiet filters, not competing color schemes.
**Avoid:** per-practice color palettes, two logo treatments, practice-specific button styles.

### 1.7 Light is the default, navy is the emphasis
**Meaning:** Most of the site sits on off-white "paper"; navy bands are deliberate chapter breaks reserved for evidence, depth, and conversion moments.
**Why Capex:** Documentation lives on paper; ink (navy) marks what matters [P3 §7.3 band rhythm].
**In the interface:** ~65% of scroll is light; navy bands: projects feature, technical depth, leadership, contact, footer (§5 rhythm table).
**Avoid:** full-dark site, dark-mode toggle, navy used for long-form body text areas.

### 1.8 Photography must be real
**Meaning:** Every image on the site is either genuine Capex/industry-permitted project photography or an honest designed no-photo treatment — never generic stock presented as Capex work.
**Why Capex:** The brochures contain real, strong photography (HDD rigs, substations, chiller plants — Phase 1 §2.5); misrepresenting imagery would undercut the evidence-first strategy [P3 §7.3].
**In the interface:** real photography with cool navy-graded treatment; designed absence (title-block-only panels) where no image exists (§16.5).
**Avoid:** stock construction heroes, AI-generated "engineering" imagery presented as Capex work, images of buildings Capex didn't serve.

### 1.9 Motion communicates hierarchy
**Meaning:** Animation exists only to direct attention (reveal, feedback, continuity) and never decorates.
**Why Capex:** B2B evaluators read, they don't play; restraint reads as seniority [P3 §8].
**In the interface:** 200–250ms hovers, one-time 400ms section reveals, 800ms counters, 250ms filter reflow — all disabled under `prefers-reduced-motion` (§15).
**Avoid:** parallax, scroll-jacking, autoplay video, cursor effects, entrance choreography on every element.

### 1.10 The register, not the feed
**Meaning:** Collections of content (projects, clients, credentials, team) are presented as sortable registers and walls — structured, countable, complete — rather than as curated "featured" feeds.
**Why Capex:** Capex's strength is installed-base volume (54 HVAC + 22 fire + 10 UG records — Phase 1 §4); a register shows the whole corpus honestly, including record-grade entries [P3 §4.6, §12.9].
**In the interface:** hairline table rows with mono refs; filter rails; counts rendered as "N records" (never "86 projects" — uniqueness unverified [VERIFY]); name wall for team.
**Avoid:** infinite logo carousels as the only client surface, hand-picked 6-project "portfolio" hiding the corpus, masonry Pinterest grids.

### 1.11 Nothing unverifiable ships
**Meaning:** The design has no slot that *requires* fabricated content to look complete — every component has an honest empty/awaiting state.
**Why Capex:** The current site's credibility leaks (invented testimonials, placeholder policies) came from components that demanded content that didn't exist (Phase 2 §6) [P3 §9.3].
**In the interface:** no-photo treatment, name-only client fallbacks, name+role-only team cards (until C1–C7 resolved), missing sections collapse silently rather than render "coming soon".
**Avoid:** placeholder text of any kind on the public surface, "TBD" slots, gray image boxes.

### 1.12 Mobile is a first-class drawing sheet
**Meaning:** Mobile is not a compressed desktop — it is re-composed: the title blocks, registers, and metric panels are designed at 390px with the same discipline.
**Why Capex:** Indian B2B evaluation is heavily mobile, phone-first (Phase 2 §19.8); a register that works on mobile is a genuine advantage over competitor sites.
**In the interface:** phone CTA pinned in header, filters as bottom drawer, registers as stacked record rows, metrics stack 2×2 (§14).
**Avoid:** desktop tables shrunk with horizontal scroll (except the credentials register, which keeps intentional horizontal scroll with sticky first column), hidden CTAs behind hamburger, 44px targets ignored.

---

## 2. DESIGN SYSTEM

### 2.1 Typography

**Families [P3 §7.3, retained from prototype]:**

| Role | Family | Weights | Notes |
|---|---|---|---|
| Display | **Space Grotesk** | 500, 700 | Headlines, statements, practice names |
| Body | **Inter** | 400, 500, 600 | Paragraphs, buttons, forms, nav |
| Technical mono | **IBM Plex Mono** [NEW — final choice in 4A style tile; JetBrains Mono acceptable alternate] | 400, 500 | Every number, label, reference, metadata line; `font-feature-settings: "tnum"` where the face lacks tabular figures |

**Type scale (desktop → mobile, px, line-height):**

| Token | Desktop | Mobile | Usage |
|---|---|---|---|
| `display-xl` | 76 / 1.05 | 40 / 1.12 | Homepage hero headline |
| `display-l` | 56 / 1.08 | 34 / 1.14 | Page heroes (practice, projects index, sector hubs) |
| `display-m` (h2) | 44 / 1.1 | 30 / 1.16 | Section headlines |
| `statement` | 40 / 1.2 | 28 / 1.28 | Positioning statement, large pull lines |
| `display-s` (h3) | 28 / 1.25 | 22 / 1.3 | Card titles, sub-sections |
| `body-l` | 20 / 1.55 | 18 / 1.55 | Hero sublines, leads |
| `body` | 17 / 1.6 | 16 / 1.6 | Paragraphs |
| `body-s` | 15 / 1.5 | 15 / 1.5 | Buttons, dense copy, form text |
| `mono-label` (eyebrow) | 13 / 1.2, ls 0.08em, uppercase | 12 | Eyebrows, chips, tags |
| `mono-meta` | 13 / 1.4 | 12 | Metadata, captions, table cells |
| `mono-micro` | 11.5 / 1.3, ls 0.06em, uppercase | 11 | Title blocks, drawing refs |
| `metric-xl` (mono) | 64 / 1 | 40 | Instrument-panel numbers |
| `metric-l` (mono) | 40 / 1 | 28 | Card metrics, counters |

**Heading behavior:** Display type uses tracking −0.02em (existing token behavior) and never wraps more than 2 lines at any breakpoint; if a heading would wrap to 3 lines the content is too long (§19.1). H1 exactly one per page. Headings never sit on photography without a scrim.

**Eyebrow labels:** Always mono, uppercase, 13px, amber tick prefix (`— PRACTICE 01`) or bracketed (`[ 03 · SELECTED WORK ]` — format locked §3.2). Eyebrows precede every numbered section; utility strips (trust strip, credentials strip) have none.

**Metadata:** All metadata (location, status, client, year) renders in `mono-meta`, navy 60% on light / white 65% on navy, and is separated from titles by a hairline or space — never mixed into the display line.

**Numerals:** All quantities, years, registry numbers, record refs use mono. Thousands separator is a comma (4,000 TR); units always follow with a thin space (`150 KM`, `4,000 TR`, `33/11 KV`). Numerals never render in Space Grotesk or Inter on the public site.

**Mobile typography:** scale above; body never below 16px; mono-meta never below 11px; display-xl mobile 40px is the floor for the homepage hero only — all other pages' heroes use `display-l` mobile 34px.

### 2.2 Color

All tokens carried from the prototype's coherent system [P3 §7.1], with one adjustment (amber) and tonal extensions only. **No new hues.** Legacy brochure purple, lime, and teal remain retired [P3 §7.1].

| Token | Value | Usage |
|---|---|---|
| `--brand` (navy) | `oklch(0.28 0.09 262)` | Navy bands, footer, header solid state, hero scrim base, practice panels |
| `--brand-deep` | `oklch(0.22 0.08 262)` **[NEW, tonal]** | Footer depth, overlay scrims, hover state for navy surfaces |
| `--primary` (engineering blue) | `oklch(0.45 0.16 258)` | Primary buttons, links on light, focus rings, active nav |
| `--primary-hover` | `oklch(0.40 0.15 258)` **[NEW, tonal]** | Primary button hover |
| `--accent` (amber) | current `oklch(0.68 0.17 52)` → **adjust toward DOC C gold family (#E0A000–#E8A93D); working value `oklch(0.73 0.14 85)`; FINAL VALUE LOCKED IN 4A STYLE TILE after contrast passes** [P3 directed the nudge] | Section numbers, key metrics, signature CTA, ongoing status, active filters |
| `--accent-foreground` | `oklch(0.18 0.04 258)` (navy ink) | Text on amber |
| `--background` (off-white "paper") | `oklch(0.975 0.008 250)` | Default page background |
| `--surface` | `oklch(0.945 0.014 250)` | Subtle panels, secondary cards |
| `--surface-elevated` | white | Primary cards, forms on light, mega-menu panel |
| `--border` (hairline) | `oklch(0.875 0.018 250)`; on navy `oklch(1 0 0 / 12%)` | All hairlines, card borders, dividers |
| `--foreground` | `oklch(0.19 0.045 258)` | Body text on light |
| `--muted-foreground` | `oklch(0.47 0.035 258)`; on navy `oklch(0.78 0.03 258)` **[NEW, tonal]** | Secondary text, captions |
| `--status-verified` | `oklch(0.62 0.12 155)` **[NEW]** | "Completed" status chips, verified-record marks (used only in status contexts, never decoratively) |
| `--status-ongoing` | `--accent` | "Ongoing" status chips |
| `--destructive` | `oklch(0.56 0.2 27)` (existing) | Form errors only |

**Usage rules:** amber on navy for text/numbers always; amber on light only for large numerals (≥28px, ≥3:1 contrast verified) or non-text marks; amber never for body text. Blue is the working action color; amber is the *signature* color — one amber CTA per view maximum (§2.9). Status colors appear only as chips/dots, never as backgrounds.

**Forbidden:** purple/violet (`#604080` family), lime (`#a0c020`), teal — retired [P3 §7.1]. Any gradient other than the photo scrim (§16.4).

### 2.3 Spacing

**Scale (px):** 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 96 · 128 · 160.

| Context | Desktop | Tablet | Mobile |
|---|---|---|---|
| Section (band) vertical padding | 112–128 | 80 | 64 |
| Thin strips (trust, credentials strip) | 56–64 | 48 | 48 |
| Between section headline and content | 40 | 32 | 24 |
| Card internal padding | 32 | 24 | 20 |
| Card grid gap | 24 | 20 | 16 |
| Page gutters | 80 | 40 | 24 |
| Max content width | **1440px** [P3 §7.3] | fluid | fluid |
| Text measure (long copy) | 640–720px | 640 | full minus gutters |

**Density:** body sections run airy (premium); register/table sections run compact (evidence) — density contrast is intentional and follows band type. Cards never nest more than one level.

### 2.4 Grid

| Breakpoint | Columns | Gutter | Notes |
|---|---|---|---|
| ≥1280 (xl) | 12 | 24 | Full asymmetric layouts; rail+content splits |
| 1024–1279 (lg) | 12 | 24 | Container caps 1440; rails narrow |
| 768–1023 (md) | 8 | 20 | 2-col editorial splits collapse to stacked asymmetric |
| <768 (sm) | 4 | 16 | Single column; 4-col grid governs internal card paddings only |

**Asymmetric ratios [P3 §7.3]:** editorial splits 7/5 and 8/4 (never 6/6 for narrative sections); rail+content 3/9 on `/projects` (280px rail); practice diptych is the only 50/50 split on the site.
**Image/text ratios:** feature images 16:10 with text panel 4 cols; statement sections are text-only (no forced imagery); project feature tiles 7/5 col at 16:10.

### 2.5 Borders — the hairline system

The hairline (1px `--border`) is the site's primary structural device, replacing shadows and fills.

| Element | Border treatment |
|---|---|
| Section rules | 1px full-width hairline between bands; navy bands use white 12% |
| Card borders | 1px hairline, all sides; hover → primary blue 1px (light) / white 35% (navy) |
| Dividers inside sections | 1px hairline, partial width (content measure), never full-bleed |
| Title blocks | 1px hairline box, internal cells divided by 1px verticals (§3.1) |
| Register rows | bottom hairline only; header row hairline top+bottom |
| Chips/tags | 1px hairline, no fill; active = amber border + amber text |
| Emphasis rules | 2px navy (light bands) / 2px amber (navy bands), max one per section — used under section headlines' first 48px |

No double borders, no border+shadow stacks, no >2px decorative borders.

### 2.6 Radius

- **8px:** cards, image tiles, form inputs, gallery frames (existing `--radius` token) [P3 §7.3].
- **4px:** buttons, chips, small controls.
- **0px (square — deliberate):** title blocks, register tables, metric strips, evidence panels, credential rows, footer. *The square corner is part of the documentation language: data surfaces are square, interactive surfaces are softly rounded.* **[NEW rule]**
- Never pill-shaped anything: the prototype's rounded-full buttons and phone pill are replaced by 4px rectangles/chips. **[NEW — supersedes prototype styling]**

### 2.7 Shadows (restrained)

Cards and bands: **no shadows** — hairlines carry structure [P3 §7.3]. Shadows exist only for overlays that must separate from the page:

| Token | Value | Used by |
|---|---|---|
| `--shadow-overlay` | `0 24px 64px -24px oklch(0.22 0.08 262 / 40%)` | Mega-menu panel, mobile menu, filter drawer, lightbox, toasts |
| `--shadow-sticky` | `0 1px 0 var(--border)` | Sticky header hairline (not a shadow) |

No glow tokens on the new surface (the prototype's `shadow-glow` on buttons is retired with the button restyle).

### 2.8 Buttons

| Variant | Spec | Hover | Active | Disabled |
|---|---|---|---|---|
| **Primary (action blue)** | `--primary` bg, white text, 4px radius, 15px/600, height 48 desktop / 48 mobile, padding 0 24px | bg → `--primary-hover`; arrow icon nudges 4px right (200ms) | scale 0.98 | 40% opacity, cursor not-allowed |
| **Signature (amber)** — *one per view, "Start a Project" only* [P3 §7.3] | amber bg, `--accent-foreground` navy text, otherwise primary spec | darken 8% | scale 0.98 | never disabled (route always valid) |
| **Secondary** | transparent, 1px border (`--border`), foreground text | border → primary, text → primary | bg `--surface` | 40% opacity |
| **On navy** | Secondary inverts: white 35% border, white text; Primary unchanged | border → white 60% | — | — |
| **Text CTA** | 15px/600 foreground, ArrowRight 16px trailing; no underline at rest | underline reveals (150ms), arrow nudge | color primary | — |
| **Icon button** (close, lightbox nav, drawer) | 44×44 touch target, 1px hairline or bare | bg `--surface` (light) / white 10% (navy) | scale 0.96 | — |

**Mobile:** all CTAs full-width in stacked contexts; primary tap targets ≥48px; the header "Start a Project" collapses to a 44px-high amber chip that persists (never hidden behind the hamburger).

**Wording set (locked §19.5):** `Start a Project` (signature, header/contact) · `Explore Projects` · `View Project Register` · `Discuss {Service/Practice}` · `Read the Case Study` · `View Full Register` · `Request Verification Documents`.

### 2.9 Forms

Structure (contact form spec'd fully in §13):

- **Labels:** always visible, above fields, 14px Inter 600 — never placeholder-as-label.
- **Inputs:** height 48, white bg (light bands) / `--surface` (navy bands), 1px border, 4px radius, 16px text.
- **Helper text:** 13px muted below field (e.g., `Used only to respond to this enquiry`).
- **Focus:** 2px `--primary` ring, 2px offset; border color matches.
- **Validation:** inline, on blur + on submit; error message 13px `--destructive` with icon, `aria-describedby` bound; erroring field border → destructive; never color-only signaling (icon + text always).
- **Loading:** submit button label → `Sending…` with 16px spinner, disabled; no overlay.
- **Success:** the form area is replaced by a title-block-framed confirmation panel with a mono enquiry reference (`ENQ-2026-0148` pattern [NEW — generated server-side]) and next-step line. No alert() ever.
- **Anti-spam:** honeypot field + timing check (design accommodates; mechanism per Phase 3 technical list).

---

## 3. SIGNATURE CAPEX VISUAL LANGUAGE — "THE DRAWING SHEET"

Phase 3's motif (§7.2) becomes a precise, bounded component language. **Calibration: subtle and premium — annotation, not theme.**

### 3.1 The Title Block

The core signature component — an engineering title block as page/section header chrome.

```
┌─────────┬──────────────────────────────┬────────────────────┐
│ SHEET    │ PRACTICE 01 — UG UTILITIES    │ PATNA, BIHAR       │
│ P-01/03  │ ELECTRICAL & CGD             │ STATUS: COMMISSIONED│
└─────────┴──────────────────────────────┴────────────────────┘
```

- Anatomy: 1px hairline box; 2–4 cells divided by 1px verticals; first cell is the sheet/sheet-zone reference; cells hold mono-micro uppercase pairs (label above value is *not* used — single-line `LABEL: VALUE`).
- Placement: page heroes (below headline, full content width), project Record pages (the primary header), practice pages, credential register header.
- **Never** on: cards, chips, the footer, form fields, or more than once per page (section-level numbering §3.3 replaces it within the page).

### 3.2 Drawing/record references

- Section eyebrow format: `[ NN · LABEL ]` in mono-label amber-tinted brackets, e.g., `[ 03 · SELECTED WORK ]` **[NEW — locks Phase 3's "numbered sections" idea]**.
- Project record refs: `REF P1-014` (practice 1, record 14) — a *UI affordance for navigation and citation*, shown in title blocks and register rows; the number order derives from CMS sort, and the UI must never present it as a source claim. **[NEW]**
- Enquiry refs (§2.9), credential rows (`REG 09-AAFCC1314H1Z0` pattern showing real registry numbers, Phase 1 §8).
- Document references: where a fact is cited on the public site (credentials page), the mono ref appears as a quiet superscript-like suffix (`ISO 9001:2015 — certificate scan ↗`) — linking to the scan, never to internal phase documents.

### 3.3 Section numbering

Homepage bands carry running numbers (01–11 across content bands — hero and utility strips unnumbered); interior pages number their own sections independently (`01 · SCOPE`, `02 · CAPABILITY`…). Numbers are mono, amber, 13px, top-aligned with the headline — never oversized "ghost numerals".

### 3.4 Grid/coordinate motifs — **bounded**

- **Survey grid:** a 24px 1px grid at 6–8% opacity, allowed only: (a) inside navy bands' empty margins, (b) in the no-photo treatment (§16.5). Never behind body text, never on light bands, never animated. **[NEW boundary — prevents blueprint-theme drift]**
- **Tick marks:** 8px hairline ticks along the top edge of metric strips and register header rows — like a ruled scale. Max one tick row per band.
- **Crosshair corner marks** (+) at the four corners of the practice diptych panels only.
- **Forbidden:** grid paper as page background, dashed cyan lines, compass roses, ruler graphics, fake dimension arrows on photos, "CAD font" letterspacing abuse.

### 3.5 Engineering annotations

- Photo captions read as site annotations: mono-meta, left-aligned, format `{LOCATION} — {scope}, {status}` (e.g., `NOIDA — Roof-top chiller & AHU plant, commissioned` — draft pattern; actual captions CMS-driven §16.6).
- Metric strips carry unit annotations under each number (e.g., `KM` / `11/33 KV` / `CONNECTIONS`).
- Marginal notes: on desktop only, a 13px mono muted note may sit in the right margin of editorial paragraphs (e.g., `TQM POLICY — DOC A P4`-style internal refs render as `— Company profile` publicly). Public marginal notes carry no internal phase references. **[NEW device, used ≤1 per section]**

### 3.6 Measurement-style metadata

Location, status, capacity, and client render as a **metadata strip** — a single-row, hairline-topped band of `LABEL · VALUE` mono pairs — used at the top of project records, below practice heroes, and on case-study metric tables (§9.3, §10.6).

### 3.7 Linework

All flow/stepper connectors are 1px hairlines with 45° elbow joints (no curves) — the delivery-model stepper and process diagrams use orthogonal documentation linework. Arrows are 8px chevrons, hairline stroke.

### 3.8 Technical tables

Register tables (credentials, equipment/plant, case-study metrics): header row mono-micro uppercase on `--surface`; body rows 15px Inter with mono numerals; row height 48; bottom hairlines; first column left-aligned text, numeric columns right-aligned; horizontal scroll on mobile with sticky first column.

### 3.9 Where the language does NOT appear

Marketing-critical emotional moments stay clean: the hero has no title block (the hero *is* the cover sheet — only the eyebrow and metadata line §5.1); testimonial/quote treatments (future, approved only); the practice diptych's interior; team name wall; client logo wall; form interiors; footer. **Rule of thumb: the drawing-sheet language marks *records and structure*; it never decorates *people, clients, or narrative*.**

---

## 4. NAVIGATION DESIGN

### 4.1 Desktop header

```
┌────────────────────────────────────────────────────────────────────────────┐
│ CAPEX        Capabilities ▾   Projects   Sectors   Company ▾     ✆ +91 98185 40532  [Start a Project] │
│ Construction & Engineering                                                  │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Height:** 80px default (transparent state) → 64px scrolled (solid state). [NEW — prototype is 64/80 fixed; Phase 4 adds the shrink]
- **Logo treatment:** existing lockup retained conceptually [P3]: CAPEX wordmark (Space Grotesk 700, 20px) over `CONSTRUCTION & ENGINEERING PVT. LTD.` mono-micro 10px, ls 0.18em, uppercase. Logo image slot from CMS `logo_url` (migrated off Lovable paths, TD8). No rounded container — the wordmark sits bare (removes prototype's rounded-xl white chip). **[VERIFY: naming decision affects wordmark/tagline — gate #1]**
- **Sticky/scroll behavior:** header is fixed. At scrollY ≤ 20px over a hero image: transparent, white text, no border. Beyond: solid navy `--brand`, hairline bottom (white 12%), text white; 200ms background transition. On light pages without hero imagery (e.g., `/credentials`), header is solid from the top (no transparent state).
- **Typography:** nav items 14px Inter 600, ls 0.02em; white in both states (header is navy in solid state — so light pages keep navy header; the header is *always* navy-on-solid).
- **Hover:** item text → amber tick underline (150ms, 2px, offset 6px); never background fills.
- **Active states:** current route's top-level item carries the amber tick underline persistently; on interior anchors, an IntersectionObserver sets active state (fixes Phase 2 §13 gap).
- **Phone:** hairline chip, Phone icon 14px + number in mono-meta; hidden below 1024px (mobile replaces with icon-chip §4.3). [VERIFY: which numbers — both documented numbers should appear; header shows primary, contact page shows both — gate #3]
- **Signature CTA:** amber "Start a Project" button (§2.8) — the site's only amber button in the header; never hidden below 768px (compacts to `Start a Project` → `Start` chip at 480–767px? **No** — keeps full label at 12px padding; it is a fixed 44px-high chip on mobile).

### 4.2 Capabilities mega-menu

Triggered by hover-intent (80ms open delay, 240ms close grace) *and* click/Enter (keyboard-first). Panel: full-content-width (1440 max) white `--surface-elevated`, hairline border, `--shadow-overlay`, 4px radius, padding 40; opens below header with 200ms fade+8px rise; closes on Esc, outside click, or focus leaving.

**Structure — two practice columns + one evidence column, never a flat service list [P3 §2.3]:**

```
┌──────────────────────────┬──────────────────────────┬───────────────────────┐
│ [ PRACTICE 01 ]          │ [ PRACTICE 02 ]          │ EVIDENCE              │
│ UG Utilities, Electrical │ MEP, Fire Fighting &     │                       │
│ & CGD  → practice page  │ Fire Protection → page   │ Featured: World Trade │
│                          │                          │ Tower — 4,000 TR  →   │
│  · UG HT/LT Cable Laying │  · HVAC Systems          │                       │
│  · CGD Networks          │  · VRV / VRF Systems     │ All Projects →        │
│  · LMC Works            │  · Fire Fighting &        │ Sectors →              │
│  · 33/11 kV Substations │    Hydrant Systems       │ Credentials →          │
│  · HDD & Trenchless     │  · Clean Rooms           │                       │
│                          │  · MEP Services          │                       │
│                          │  · Testing & Commissioning│                      │
└──────────────────────────┴──────────────────────────┴───────────────────────┘
```

- Practice headers: `[ PRACTICE 01 ]` mono chip + practice name in display-s + arrowed link to the practice landing page.
- Services: 14px Inter links, hover → primary + 4px nudge; each links to its service page.
- Practice columns are visually identical in treatment (§1.6) — same width, same typography; distinction is content only.
- Evidence column: one featured project tile (16:9 thumb, title, metric) + three text links.
- **Mega-menu services list is CMS-driven** (`services` collection grouped by `practice_id`) — never hardcoded.
- **Company ▾ dropdown:** simple panel — About · Team · Clients · Credentials · Careers (renders only when active openings exist, §12.5) — 200ms fade, same panel styling.

### 4.3 Mobile header & menu

- **Header:** 64px, navy solid always (no transparent state on mobile — scrim math is unreliable); logo lockup (wordmark only, tagline hidden <480px); right side: phone icon-chip (44px, hairline) + amber "Start a Project" chip (44px high, label may shorten to `Start a Project` at 12px but never to an icon) + menu button (44px).
- **Menu:** full-screen overlay drawer (100% width × 100dvh minus header), navy bg, slides in 250ms; body scroll locked; focus trapped; Esc/swipe-down/backdrop closes.
- Structure (accordion):
  - **Capabilities** (expanded by default): `[ PRACTICE 01 ]` mono label → practice link + its services; `[ PRACTICE 02 ]` likewise; sub-accordion per practice (chevron rotates 200ms).
  - **Projects** (direct link) · **Sectors** (direct link) · **Company** (accordion: About/Team/Clients/Credentials/Careers*).
  - Footer of drawer: both phone numbers as 48px rows (tel: links), email row, "Start a Project" full-width amber button.
- **Mobile CTA priority order (fixed):** phone chip and Start-a-Project chip always visible in header; no other floating CTAs; no bottom app-bar.

### 4.4 Navigation accessibility

- Mega-menu/dropdown fully keyboard operable: Enter/Space toggles, arrows move within panel, Esc closes and returns focus to trigger.
- Panel is a labelled region (`role="group"`, `aria-labelledby`); triggers use `aria-expanded`/`aria-haspopup="true"` (fixes the prototype's div-button accordion issue noted Phase 2 §7).
- Hover-intent never the only path; click/touch always opens.
- Focus ring (2px `--primary`, offset 2px) visible on every interactive element in all states — including on navy backgrounds (ring switches to white there).
- Mobile drawer: focus trap + `aria-modal`, background inert.

---

## 5. HOMEPAGE — COMPLETE VISUAL SPECIFICATION

**Band rhythm [P3 §6 carried, concretized]:** `1 HERO image-navy` → `2 TRUST off-white (strip)` → `3 POSITIONING white` → `4 PRACTICES off-white` → `5 PROJECTS navy` → `6 DELIVERY white` → `7 TECHNICAL navy` → `8 SECTORS off-white` → `9 NUMBERS white` → `10 CLIENTS off-white` → `11 LEADERSHIP navy` → `12 CREDENTIALS off-white (strip)` → `13 CONTACT navy` → footer navy (deep).

Numbering `[ NN · LABEL ]` runs 01–09 across the content bands (3,4,5,6,7,8,9,10,11 → renumbered 01–09 in flow order); hero, trust strip, credentials strip unnumbered.

All band content renders from CMS sections/collections [P3 §6, TD6 fix]. No hardcoded homepage content of any kind survives.

### 5.1 Band 1 — Hero

**Purpose:** position Capex in 5 seconds — turnkey engineering, two practices, proof, next step [P3 §1.1].

**Composition (desktop ≥1280):**
- Full-bleed image, min-height 88vh (max 960px), width 100vw. Image subject positioned right-of-center (crop guidance §16.2); left 55% carries a left-to-right navy scrim (`--brand` 92% → transparent 65%) plus a bottom-up scrim on the lowest 200px for the metadata line.
- Text block: left-aligned, grid columns 1–6 (of 12), vertically centered at 52% viewport; max-width 640px.
- **Eyebrow (mono-label, white 80%, amber tick):** `— CAPEX CONSTRUCTION & ENGINEERING PVT. LTD. · EST. 2012 · NOIDA` *(draft — CMS `sections.hero.eyebrow`)*.
- **Headline `display-xl` white:** `Turnkey engineering, delivered end to end.` *(draft; CMS `sections.hero.title` — this is the TD6 fix: the hero renders CMS content)*.
- **Subline `body-l` white 85%, max 520px:** `Underground utilities, electrical & CGD. MEP, HVAC & fire protection. One accountable partner — supply, installation, testing & commissioning.` *(draft; CMS body)*.
- **CTAs:** amber `Start a Project` + secondary-on-navy `Explore Projects`. Side by side, 16px gap.
- **Metadata line** (bottom-left, above the bottom hairline, mono-meta white 70%): `150 KM SMART-CITY CABLE · 4,000 TR HVAC · 165 KM GAS NETWORKS` — three documented quantities, separated by middots. **[Stat policy P3 §6 — documented only]**
- **Sheet chrome:** bottom edge of the hero carries a full-width 1px white-12% hairline with a 4-cell micro title strip along it: `SHEET 01 · HOME  |  CAPEX  |  PROJECT REACH: INDIA & NEPAL  |  SCROLL ↓` (mono-micro, white 60%). This is the *only* drawing-sheet element in the hero.
- **No carousel.** One decisive image [P3]. A restrained >8s cross-fade to a second image is permitted only if CMS provides ≥2 quality images — pausable via a small control; default is static. **[P3 allowed the option; Phase 4 defaults to static]**

**Composition (mobile <768):** image `background-size: cover`, min-height 78vh, heavier bottom scrim (navy 88% bottom → 30% mid); text block bottom-anchored with 24px gutters: eyebrow → headline (`display-xl` mobile 40px) → subline (hidden after 2 lines + "More" expand? **No** — subline truncated to 3 lines max, full text on About) → CTAs stacked full-width → metadata line wraps to 2 lines → sheet strip collapses to `SHEET 01 · CAPEX · ↓`.

**Image treatment:** cool grade, navy cast, no vignette, no grain overlays (§16.4). Fallback when CMS hero image absent: full navy band + survey grid at 6% + identical text composition (no broken/gray image ever).

**Motion:** headline/subline/CTAs reveal once on load — 400ms, 12px rise, staggered 60ms, disabled under reduced-motion. Background image: none (no Ken Burns).

**Transition to Band 2:** hard document cut — hairline, no overlap, no parallax.

**What makes it premium:** one image, one statement, three numbers; zero ornamentation; the sheet strip quietly announces the motif.

### 5.2 Band 2 — Trust strip

**Purpose:** instant recognition via real client names [P3 §6].
**Composition:** 64px band on off-white; left-fixed mono-label `REPEAT & ONGOING CLIENTS` (180px); rest: logo marquee (CSS translate loop, 40s linear), logos in single-color navy at 60% opacity, uniform 24px height, 48px gaps. Pause on hover/focus. `prefers-reduced-motion`: static, wrapped rows, no marquee (fixes prototype gap).
**CMS:** `clients` with `is_featured` + logos (name fallback where no logo/permission — name in 15px Inter 600, same spacing) [VERIFY: logo permissions — gate #12].
**Premium note:** the quietest band on the site — restraint signals that the names need no help.

### 5.3 Band 3 — Positioning statement `[ 01 · COMPANY ]`

**Purpose:** who Capex is, in one editorial moment [P3 band 3].
**Composition:** white band, 128px padding; content in columns 2–9 (deliberately inset from left — the whitespace *is* the composition); `statement` 40px display: `A turnkey engineering company practicing underground utilities on one side, and building systems on the other — one team, one accountable contract.` *(draft; CMS `sections.about`)*; below, 17px body paragraph (≤70 words) with the SITC phrase; a single text CTA `About Capex →`.
**Annotations:** one marginal mono note (desktop only, right margin): `— EST. 26 DEC 2012 · KANPUR, UP` (documented).
**Motion:** 400ms rise-on-enter once.
**No imagery** in this band — type only.

### 5.4 Band 4 — The Two Practices `[ 02 · PRACTICES ]` — *signature section*

**Purpose:** make the company's defining structure visible; route each buyer [P3 §1.3, §12.2].
**Composition (desktop):** off-white band; headline `display-m` `Two disciplines. One engineering team.` *(draft)* centered? **No — left-aligned per system.** Below: the diptych — two equal panels (50/50, 24px gap, 1px hairline, 0px radius, 8px internal padding 40), each min-height 420px:

```
┌───────────────────────────────┐  ┌───────────────────────────────┐
│ +                          +  │  │ +                          +  │
│ [ PRACTICE 01 ]  (mono chip)  │  │ [ PRACTICE 02 ]  (mono chip)  │
│ UG Utilities, Electrical      │  │ MEP, Fire Fighting &         │
│ & CGD            (display-m)  │  │ Fire Protection  (display-m) │
│                               │  │                               │
│ 3-line scope (17px, muted)    │  │ 3-line scope (17px, muted)    │
│                               │  │                               │
│ 150 KM      33/11 KV          │  │ 4,000 TR      22 SYSTEMS      │
│ smart-city cable  · substation│  │ flagship HVAC  · fire installs│
│                               │  │                               │
│ Explore Practice 01 →         │  │ Explore Practice 02 →         │
└───────────────────────────────┘  └───────────────────────────────┘
```

- Corner crosshairs (§3.4) at panel corners — the diptych is the only place crosshairs are allowed.
- Metrics inside panels: `metric-l` mono navy + `mono-meta` labels — two documented quantities per practice (P01: `150 KM` Patna cable + `33/11 KV` substations; P02: `4,000 TR` WTT flagship + `22` fire installations — Phase 1 §4).
- Panels carry a 64px-tall image strip? **No** — text-only panels (restraint; the practice pages carry the photography).
**Hover:** panel border → primary blue; practice-name arrow nudges; mono chip ticks amber. No bg fills, no flip to navy (too loud).
**Mobile:** stacked panels, full-width, 16px gap, min-height auto, metrics side-by-side 2-col.
**Motion:** 400ms rise staggered 120ms between panels, once.
**CMS:** `practices` entity (name, short label, scope 3-liner, 2 metric refs, link).

### 5.5 Band 5 — Selected projects `[ 03 · SELECTED WORK ]`

**Purpose:** proof before promises; the quantity-led hook [P3 band 4].
**Composition (desktop, navy band):** headline `display-m` white `Selected work, by the numbers.` *(draft)* + text CTA right-aligned `View Project Register →`.
Layout — asymmetric editorial, not a card grid:
- Row 1: **Feature tile** (cols 1–7, 16:10 image, case-study-grade projects only: e.g., World Trade Tower `4,000 TR`): image with bottom scrim; overlay text: mono chip `[ PRACTICE 02 · CASE STUDY ]`, project title `display-s` white, metric `metric-l` amber, location mono.
- Row 2: **Two compact tiles** (cols 8–12 split 8/4? no — two tiles of 6 cols each at 16:10): mid-tier features (Patna Smart City `150 KM`; Aurangabad CGD `165 KM`) same overlay anatomy.
- Row 3: **Register strip** — 4 record rows (hairline top, white 12%): `REF P1-003   LUCKNOW METRO — 20 KM 220 KV CABLE   ·  L&T   ·  ONGOING↗` style rows: ref mono amber, title 15px white, metric mono, client + status mono-meta white 60%, chevron.
**Hover:** image scale 1.03 (600ms ease-out); metric amber→white shift; chevron nudge.
**Mobile:** feature tile full-width 16:10; two tiles stacked; register rows as stacked rows with 16px padding.
**CMS:** `projects` (`is_featured`, template B for feature tiles; register rows any record).
**Motion:** tiles reveal 400ms stagger 80ms; register strip no animation.

### 5.6 Band 6 — Delivery model `[ 04 · HOW WE DELIVER ]`

**Purpose:** the turnkey SITC process + after-sales [P3 band 5; `process` collection exists].
**Composition (white band):** headline `display-m` `From survey to commissioning — five stages, one contract.` *(draft; CMS)*. Horizontal stepper: 5 nodes across content width; node = mono amber `01`–`05` (28px) + title 16px 600 + 14px muted 2-liner (max 22 words); nodes connected by 1px hairline with 45° elbows? — straight horizontal hairline through node ticks. Stage titles from existing CMS `process` items (Discover & Design / Supply & Procure / Install & Integrate / Test & Commission / Operate & Maintain — already written, retained).
**Tablet:** 5 nodes → 2 rows (3+2) with hairline continuing.
**Mobile:** vertical list; hairline runs left of numbers.
**Motion:** none beyond section reveal (usability band).

### 5.7 Band 7 — Technical depth markers `[ 05 · CAPABILITY ]` — *the instrument panel*

**Purpose:** owned plant + T&C rigor — engineering-led credibility [P3 band 6; §12.4–6].
**Composition (navy band):** headline `display-m` white `The machinery and methods behind the numbers.` *(draft)* + one-line sub. Below: 4 markers in a row (cols 3/3/3/3), each:
- `metric-xl` mono **amber** value; 13px mono white-70% label beneath; 24px tick row above the value (§3.4); hairline column dividers white 12%.
- Values (documented): `32 T` HDD pullback capability · `3` Drillto HDD rigs · `10` T&C services · `22` fire protection systems.
**[VERIFY: equipment quantities ambiguous in source (Phase 1 §2.4 note) — rig count "3" is stated in prose ("Drillto 32-tonne, 28-tonne and 20-tonne HDD machines"); acceptable; full equipment table lives on Practice 01 page with the ambiguity flag]**
**Mobile:** 2×2 grid, `metric-l` 40px.
**Motion:** counters count up once (800ms, stagger 80ms); reduced-motion → static final values.
**This band is the purest expression of Principle 1.5 — no imagery at all.**

### 5.8 Band 8 — Sectors index `[ 06 · SECTORS ]`

**Purpose:** entry by market; honest evidence levels [P3 band 7].
**Composition (off-white):** headline `display-m` `Where we work.` *(draft)*; then a **typographic register list** (not icon cards): 2 columns × rows, each row = sector name 20px display-s + mono-meta count of linked projects (`07 RECORDS`) + chevron; hairline row dividers. Hubs carry bold names + arrow; list-only sectors carry plain names + count (including `0 RECORDS — SERVICE-LED` where true — honesty over inflation [P3 §5.3]).
**Mobile:** single column list.
**CMS:** `industries` + relation counts (computed, never hand-entered).

### 5.9 Band 9 — Numbers `[ 07 · BY THE RECORD ]`

**Purpose:** verified scale [P3 band 8; stat policy].
**Composition (white):** 4 counters in a row (like 5.7 but light: navy `metric-xl` values, hairline navy ticks, muted labels — **no amber here**; amber stays scarce):
`54` HVAC installation records · `22` fire protection systems · `5,000` house & industry connections (Sangli LMC) · `25` states & UTs — project reach (+ Nepal rendered as `+ NEPAL` suffix in mono-meta).
Each counter carries a one-line source caption in mono-meta muted (e.g., `— COMPANY PROFILE, 2022 REVISION`) — *draft wording; source citation style needs client approval as it references internal docs: alternative `— documented company records`*. **[Decision for client: citation style]**
**Motion:** counters once, 800ms; reduced-motion static.
**[VERIFY: no other stats — "150+ projects", "315+ KM", "10+ years" excluded per P3 §6 stat policy until client approves wording — gate #6]**

### 5.10 Band 10 — Clients `[ 08 · CLIENTS ]`

**Purpose:** breadth with meaning [P3 band 9].
**Composition (off-white):** headline `display-m` `A client base across four categories.` *(draft)*; 4 category groups from DOC A p6 (IT · Corporates · Oil & Gas · Builders & Developers) — each: mono-label group header + logo wall (logos navy 60%, 32px height, wrap grid) + `Clients & relationships →` text CTA to /clients.
**No-logos:** name-only text tiles (15px 600) — same grid cell size, hairline border, no fake logo boxes.
**Mobile:** groups stacked; logos 24px.
**CMS:** `clients` + `categories` (grouping exists in prototype) + `permission_status` [gate #12].

### 5.11 Band 11 — Leadership `[ 09 · LEADERSHIP ]`

**Purpose:** a real, named organization [P3 band 10].
**Composition (navy):** headline `display-m` white `Directed by engineers, not salespeople.` *(draft)*; 4 leadership plates in a row (cols 3 each): each plate = 1px white-12% border, 0 radius, 32px padding: name `display-s` white, role mono-meta amber, one-line bio note (≤12 words) white 70%.
- People (documented): Sanjay Sharma, Mayank Kaushal, Anurag Parashar (Directors), Malkit Singh (Patron — 42 years HVAC).
- **No photos initially** (headshots requested — §10.2 P3); photo slot design exists but renders the name-plate treatment until assets arrive. **[VERIFY: bios/titles C1–C7 unresolved — plates ship name + role only, no experience-year claims]**
**CTA:** `Meet the full team →` (to /team).
**Mobile:** 2×2 plates.
**CMS:** `team` (leadership group).

### 5.12 Band 12 — Credentials strip

**Purpose:** statutory substance, procurement-grade [P3 band 11].
**Composition (off-white, 56–64px tall, single register row):** mono-label left `VERIFIABLE REGISTRATIONS`; then a horizontal mono-meta sequence: `CIN U45400UP2012PTC054355 · PAN AAFCC1314H · UDYAM-UP-28-0013458 · GST ×5 STATES · ESI · ISO 9001:2015` (all documented, Phase 1 §8); right: `View Full Register →`.
**[VERIFY: ISO issuer/certificate — gate #13; if unverified by launch, `ISO 9001:2015` drops from this strip]**
**Mobile:** wraps to 3 lines; keep — these numbers are mobile-legible at 11px mono.
**Hairline top+bottom only; no cards.**

### 5.13 Band 13 — Contact band `[ 10 · START ]`

**Purpose:** conversion [P3 band 12].
**Composition (navy):** split 5/7 — left (cols 1–5): headline `display-s` white `Start a project.` + mono lines: both phones (`+91 98185 40532 · +91 87440 44810` [VERIFY gate #3]) as 48px tel: rows, email, office line (Noida HQ [VERIFY gate #2]); right (cols 6–12): the enquiry form on `--surface` navy panel (§13). Footer follows immediately (same navy; hairline divide).
**Mobile:** stacked; phone rows first (thumb-reach), form below.

---

---

## 6. PRACTICE LANDING PAGES

### 6.1 Shared skeleton — "two disciplines, one company" [P3 §2.2, §1.6]

Both practice pages use **identical templates, tokens, components, and section order**. They differ only in *content and imagery*. The single deliberate device linking-and-separating them: **mirrored hero compositions** — Practice 01's hero places the image right / text left; Practice 02's hero mirrors it (image left / text right). Beyond the hero, every section is structurally identical. No per-practice colors, no per-practice buttons, no per-practice fonts — ever.

Shared section order (both pages):
`Hero (mirrored)` → `Metadata strip` → `Scope narrative` → `Services index` → `Technical capability / plant` → `Flagship & recent projects` → `Sectors` → `Delivery & safety` → `Credentials strip` → `CTA band`.

### 6.2 Practice 01 — `/practices/ug-utilities-electrical`

**Hero:** full-bleed real photography (HDD rig on site / pipeline works — brochure assets), 72vh; image right-weighted, scrim navy 90% → 40% left-to-right; text cols 1–6: eyebrow `[ PRACTICE 01 · UG UTILITIES, ELECTRICAL & CGD ]` (amber-tick mono, white); headline `display-l` white: `Underground infrastructure, laid to last.` *(draft)*; subline 2–3 lines *(draft)*: `HT/LT cable networks, city gas distribution, last-mile connections and 33/11 kV substations — trenched, drilled, jointed and commissioned by our own fleets.`; CTAs: `Explore Practice Projects` (primary) + `Discuss This Practice` (secondary-on-navy).
**Metadata strip** (hairline band below hero, mono, off-white band): `DELIVERY MODEL: TURNKEY SITC · KEY CREDENTIALS: L&T, TATA PROJECTS, BGRL, IGL · FOOTPRINT: SMART-CITY & METRO PROGRAMS ACROSS 5 STATES` — all documented (Phase 1 §4.1–4.2).
**Scope narrative (01 · THE PRACTICE):** white band; asymmetric 7/5 — left: `statement` + 2 paragraphs (scope from DOC A §2: UG utilities, CGD MDPE/steel mains, HT/LT 11/33/220 kV cable, LMC, sub-stations, allied infrastructure); right: a 3-item mono list `WHAT THIS PRACTICE DELIVERS` (hairline rows).
**Services index (02 · SERVICES):** off-white; 5 service rows (not cards): name `display-s` + 1-line scope 15px + chevron; hairline dividers; links to the five Practice-01 service pages (§5 taxonomy P3). Rows, not icon-cards — register aesthetics.
**Technical capability (03 · PLANT & FLEET):** navy band — the **owned-equipment table** (the EPC differentiator): technical table (§3.8) listing the documented Drillto HDD fleet (32 t / 28 t / 20 t rigs), welding sets, threading, butt-fusion, winch 250 m, compressors, JCB (Phase 1 §2.4) — columns: ITEM · SPEC · COUNT. **[VERIFY: exact counts ambiguous in source — launch with item+spec only, counts added after client confirmation; the table renders honestly without a count column]**
   Below: 3 marker metrics (`32 T` max pullback · `220 KV` highest cable class · `25 STATES` reach — documented).
**Flagship & recent projects (04 · THE RECORD):** white; editorial list — 3 feature rows (Patna 150 km · Aurangabad 165 km · Sangli 5,000 connections) each: 16:10 thumb (or no-photo panel), title `display-s`, metric `metric-l` mono, client + location mono-meta, `Read record →`; then a 5-row register strip of remaining records with `View full register →`. **[VERIFY: "running" statuses from July-2022 docs — gate #11; status chips read `ONGOING` only after client confirms]**
**Sectors (05 · SECTORS):** off-white; compact register list of this practice's sectors with project counts (Smart-City & Metro · Oil, Gas & CGD · Corporate & Commercial), linking to hubs.
**Delivery & safety (06 · DELIVERY & SAFETY):** white; split — left: 5-stage stepper (shared component, §5.6); right: the 5 documented safety procedures as a numbered mono list (DOC A p9 — PPE, eye & hand, sectional hydraulic testing, hot-work control, lifting & rigging).
**Credentials strip + CTA band:** shared components (§5.12, §13).

### 6.3 Practice 02 — `/practices/mep-fire-protection`

Identical skeleton, mirrored hero (image left / text right).
**Hero:** photography: WTT chiller plant / hydrant header (brochure assets); eyebrow `[ PRACTICE 02 · MEP, FIRE FIGHTING & FIRE PROTECTION ]`; headline `display-l` *(draft)*: `Building systems, engineered to perform.`; subline: HVAC, VRV, clean rooms, hydrant/sprinkler, MEP — single-point SITC delivery (DOC A §3).
**Metadata strip:** `DELIVERY MODEL: TURNKEY SITC · FLAGSHIP: WORLD TRADE TOWER, 4,000 TR · INSTALLED BASE: 54 HVAC · 22 FIRE RECORDS` (documented).
**Scope narrative:** building-services framing (DOC A p14 sector framing; T&C services).
**Services index:** 6 rows (HVAC · VRV/VRF · Fire Fighting & Hydrant · Clean Rooms · MEP · Testing & Commissioning) → service pages.
**Technical capability (navy):** the **T&C register** — the 10 named testing & commissioning services (air & water balancing, functional performance testing, control verification, HVAC commissioning, cleanroom testing, sound & vibration, fume hood, duct leakage, cooling-tower performance, pre-construction plan review — DOC A p15) as a 2-col numbered mono register; below, the **service model** panel: SLA-backed response, escalation matrix, 2-person crews, genuine spares, plant & AHU operation with log-books (DOC B p3) as 5 hairline rows. Marker metrics: `4,000 TR` flagship · `10` T&C services · `22` fire systems.
**Flagship projects:** WTT (Template B case study — flagship), World Trade Park 2,400 TR feature, 3-record register strip. **[VERIFY: 54-record list — the count is documentable; unique-count wording per gate #6/#11 discipline: register says `RECORDS`, not `projects`]**
**Sectors / Delivery & safety / Credentials / CTA:** shared (sectors list differs: Corporate & Commercial · Healthcare (service-led) · Industrial).
**HVAC equipment table:** present but secondary (§6.2 symmetry demands it — welding, hydro-test pump 35 kg/cm², threading, winch 1 T/150 m — Phase 1 §2.4) — collapsed to 6 primary rows.

### 6.4 "Related but distinct" — the mechanics

Shared: everything structural. Distinct: (a) mirrored hero; (b) subject matter and quantities; (c) hero image grade — P01 images get a slightly warmer dust-tone grade, P02 a cooler plant-tone grade (both within the navy-tint system — a 5% tonal difference, imperceptible as "two brands"); (d) the capability band's star content (owned-fleet table vs T&C+service-model register). The homepage diptych and both nav entries reinforce: *two disciplines inside one company.*

---

## 7. SERVICE PAGE TEMPLATE — `/services/{slug}`

Reusable for all 11 services [P3 §3.4]. Anti-wall-of-text strategy: **the page is a stack of registers, panels, and short blocks — long prose appears only in one place (the overview), max 120 words.**

**Section stack:**

1. **Service hero (light, not image):** off-white band, no photo (services are capabilities, not places — restraint); breadcrumb; eyebrow `[ {PRACTICE 01/02} · SERVICE ]`; title `display-l` (e.g., `UG HT/LT Cable Laying`); 40-word standfirst; metadata strip: `PRACTICE · TYPICAL VOLTAGES: 11 / 33 / 220 KV · DELIVERY: TURNKEY SITC` (per-service, CMS). CTA: `Discuss This Service` (primary).
2. **Overview (01 · OVERVIEW):** white; 7/5 split — left: the single prose block (max 120 words, from PDF scope text); right: `INCLUDED IN THIS SERVICE` — 5–8 hairline rows of scope items (e.g., trenching, ducting, jointing, reinstatement — DOC A §2 wording).
3. **Capability & method (02 · METHOD):** off-white; 2×2 grid of method panels (hairline, 0 radius): each a 30px mono title + 3-line note — e.g., for HDD: `TRENCHLESS` (32 t pullback), `TRENCH & REINSTATE`, `JOINTING & TESTING`, `QA/QC`. Content strictly from PDFs.
4. **Equipment (03 · EQUIPMENT):** white; compact technical table — only the rows relevant to this service (filtered view of the practice's plant table).
5. **Proof metrics (04 · BY THE RECORD):** navy strip; 3 metric markers (service-specific, documented — e.g., Cable Laying: `150 KM` Patna · `180 KM` Banaras · `20 KM` 220 kV metro).
6. **Related projects (05 · SELECTED RECORDS):** white; 2 feature rows + 4-row register strip (CMS relation `service_ids`), `View all {service} records →` deep-links `/projects?service={slug}`.
7. **Related sectors (06 · WHERE THIS APPLIES):** off-white; 3 sector links with counts.
8. **CTA band:** shared — headline `Discuss {service} for your project.` + form deep-link + phone.

**Mobile:** every split stacks; tables keep horizontal scroll w/ sticky first column; metadata strips wrap.

---

## 8. PROJECTS INDEX — `/projects`

**The most important sales surface [P3 §3.6]. A register, not a card grid [Principle 1.10].**

### 8.1 Page composition

- **Page hero (light):** off-white; eyebrow `[ PROJECT REGISTER ]`; headline `display-l` `The record, by project.` *(draft)*; subline: `Every documented engagement — filterable by practice, service, sector and state.` *(draft — "documented" language deliberately manages the 86-records-unverified issue: counts display as `RECORDS`)*. Metadata strip: `{N} RECORDS · 2 PRACTICES · {S} STATES · {C} CLIENTS` (live counts, computed).
- **Sticky filter bar** (below hero, 56px, white, hairline, sticks under header on scroll): contains — Practice toggle (2 chips), Service dropdown (single-select), Sector dropdown, Location dropdown, Status toggle (All/Completed/Ongoing), search field (mono placeholder `SEARCH PROJECT OR CLIENT`, 1 icon, clears via ×), and `RESET`. Chips: mono-label, hairline, active = amber border + amber text (§2.5).
- **URL-synced filters [P3]:** every facet writes `?practice=ug&sector=smart-city…`; deep-linkable; browser back navigates filters; facet heading renders above results: `UG UTILITIES PROJECTS IN BIHAR — 3 RECORDS` (`aria-live` announces count changes).

### 8.2 Listing layout

- **Desktop:** rail + content 3/9 — left rail 280px sticky (full filter set expanded, always visible; search at top); right: results.
  - **Feature rows** (first 2 results if `is_featured` and match filters): 7/5 split — 16:10 image (5 cols) + record block: ref + title `display-s` + metric `metric-l` mono + client · location · status metadata strip + `Read record →`.
  - **Standard rows:** full-width register rows (64px tall): `REF P1-001` (mono amber, 96px) | Title 17px 600 | Metric (mono navy, right-of-center) | Client · State (mono-meta) | Status chip (12px) | chevron. Bottom hairline per row; hover: row bg → `--surface`, title → primary, chevron nudge (200ms).
  - **Grouping:** results grouped by practice (PRACTICE 01 header row then PRACTICE 02) when no practice filter is active; grouped by status (COMPLETED / ONGOING) when practice filter is active **[VERIFY: statuses gate #11]**.
- **No-photo rows** render identically (image optional in standard rows — the register row is text-first by design, which elegantly handles 76 no-photo records).
- **Mobile:** no rail — filter bar collapses to a `FILTERS (2)` button row + sticky search; filters open a **bottom drawer** (sheet, 80dvh, `--shadow-overlay`, hairline top, drag handle): chips grid, dropdowns as native selects, `APPLY (N)` sticky footer. Results: feature cards stack (16:10 image, overlay text); standard rows become 96px two-line rows: line 1 ref + title + status chip; line 2 metric + client + state.
- **Load behavior:** pagination, not infinite scroll — `LOAD 25 MORE` button (mono) with running count `SHOWING 25 OF {N}`; 25 per page; deep-linkable page param. (Deterministic, printable, shareable — register behavior.)
- **Hover:** standard row quiet (above); feature image scale 1.03.
- **Empty states:** honest, per facet: `No records match these filters. — Clear filters` or content-aware: `No fire-protection records in Maharashtra yet. View HVAC records in Noida →` [P3 §4.2].

### 8.3 Data rules

All metadata from the project content model [P3 §4.3]; counts always `RECORDS`; status chips only from CMS `status` **post-verification**; metrics render from structured `metrics[]` (label+value+unit) — never hand-typed strings in display slots.

---

## 9. PROJECT DETAIL — TEMPLATE A (PROJECT RECORD)

**The minimum verified record — premium even with thin material [P3 §4.4].**

**Composition:**

1. **Record header (light):** off-white band; breadcrumb (`REGISTER / PRACTICE 01 / PATNA…`); eyebrow `[ PRACTICE 01 · RECORD P1-001 ]`; title `display-l` (project name); **the Title Block** (§3.1, full content width): cells — `SHEET: P1-001` | `CLIENT: L&T` | `LOCATION: PATNA, BIHAR` | `STATUS: COMMISSIONED`. Below: the **scope line** — the exact PDF scope wording in `statement` size, navy, set as the page's second-most-important element (e.g., `150 KM 11&33 KV cable laying` — this *is* the story of a record).
2. **Metrics strip (mono, hairline-topped):** 2–4 structured metrics with units (`150 KM` · `11/33 KV` · `SMART-CITY PROGRAM`); tabular mono, navy on light.
3. **Imagery (optional):** single 16:10 image left (7 cols) or the **no-photo treatment** (§16.5): a hairline panel, survey grid 6%, centered mono ref `P1-001 — NO PHOTOGRAPHY ON RECORD`, practice watermark chip. Designed absence — never a gray box.
4. **Classification (mono register):** 2-col table — PRACTICE / SERVICES / SECTOR / CLIENT / LOCATION / STATUS rows (each linking its facet).
5. **Related records:** 3-row register strip (same client, else same sector/service).
6. **CTA band:** `Discuss similar work →` + phone.

**No narrative sections exist in Template A.** If an editor needs to write a story, that is Template B's job (CMS enforces — P3 §4.5 rule).

---

## 10. PROJECT DETAIL — TEMPLATE B (CASE STUDY)

**Enhanced narrative — only where evidence exists [P3 §4.5]. At launch: WTT (4,000 TR), WTP Jaipur (2,400 TR), Patna, Banaras, Lucknow Metro, Aurangabad, Sangli (7 candidates — subject to §10.2 content: client-supplied narratives).**

**Section stack (each block renders only if its CMS content is non-empty — no empty headings ever):**

1. **Opening composition (navy hero):** full-bleed real image (WTT chiller plant), 64vh; scrim; eyebrow `[ PRACTICE 02 · CASE STUDY ]`; title `display-l` white; the metric as second line: `4,000 TR — LARGEST SINGLE HVAC INSTALLATION ON RECORD` (mono amber `metric-l` — the documented DOC A p16 claim); metadata strip: `CLIENT · NOIDA · STATUS · COMMISSIONED`; scroll cue.
2. **Project story (01 · OVERVIEW):** white; 7/5 — left: 2–3 short paragraphs (client-supplied/approved narrative — never invented); right: Title Block + metrics table (TR / system / floors-served as available & verified).
3. **Technical scope (02 · SCOPE):** off-white; hairline list of systems delivered (from PDF scope breakdown): for WTT: HVAC plant · integrated fire hydrant & sprinkler (documented DOC A p16) — each row: system + 1-line note.
4. **Execution (03 · EXECUTION):** white; 3-panel grid (30px titles, 3-line notes) — only where evidence exists (e.g., T&C: functional performance testing, air & water balancing — documented T&C services); **omitted entirely if no execution evidence — the page shortens gracefully.**
5. **Metrics (04 · BY THE NUMBERS):** navy; instrument panel (2–4 counters).
6. **Photography (05 · ON SITE):** gallery grid — 3–6 images, 16:10, captions as site annotations (§3.5); lightbox (keyboard, focus trap, Esc, counter `2 / 5`).
7. **Client quote (conditional):** renders **only if** `approval_status = approved` + real source exists [P3 §9.1]; treatment: display-s italic? — no italics in display; quote in `statement` size navy, attribution mono-meta (`— NAME, ROLE, CLIENT`); hairline frame, no giant quotation-mark decor.
8. **Outcome (06 · STATUS):** white; one paragraph (≤60 words) + status chip.
9. **Related records + CTA:** shared components.

---

## 11. SECTOR PAGES

### 11.1 Sectors overview — `/sectors`

Light hero (`display-l` `Where Capex works.` *(draft)*, metadata strip with live counts); then the **evidence-tiered register**: three hub rows (feature treatment: name `display-s` + 40-word relevance + project-count + `3+ RECORDS` mono badge + chevron), then list-only sectors as compact register rows with counts (including honest `SERVICE-LED — RECORDS PENDING` where true [P3 §5.3]). 2-col grid desktop; 1-col mobile.

### 11.2 Sector hub template — `/sectors/{slug}`

For launch hubs: Smart-City & Metro Infrastructure · Oil, Gas & CGD Utilities · Corporate & Commercial Real Estate.

1. **Hub hero (light + image):** off-white; eyebrow `[ SECTOR · {NAME} ]`; headline `display-l`; 40-word standfirst; metadata strip (`RECORDS · PRACTICES · TYPICAL CLIENTS`); right-side 4:5 image (hub photography or no-photo panel). Smart-City hub: Lucknow Metro/metro imagery; CGD hub: pipeline works; Corporate hub: WTT.
2. **Capex in this sector (01 · WHY CAPEX):** white; 7/5 split — left: ≤90-word relevance (draft from documented facts — e.g., smart-city: L&T/TATA Projects programs, 11/33/220 kV works); right: **Evidence panel** — hairline box listing the *named, documented* proof for this sector: clients (L&T, TATA Projects, BGRL, IGL…), programs (Patna, Banaras, Lucknow Metro…), quantities. This panel is the anti-thin-content device [P3 R3]: the hub *earns* its page by showing its evidence inline.
3. **Practices & services in this sector (02 · CAPABILITIES):** off-white; 2-col: two practice mini-panels (name + relevant services as hairline rows, linked).
4. **Records (03 · THE RECORD):** navy; project register — 2 feature rows + 6-row strip (auto from `sector_ids` relation), `View filtered register →` deep-links `/projects?sector={slug}`.
5. **Representative clients (04 · CLIENTS):** off-white; logo/name wall filtered to this sector's clients (relationship-typed).
6. **CTA band:** `Discuss {sector} projects →`.

Secondary sectors (Healthcare, Industrial) use the same template but ship service-led: Evidence panel lists capability + named single evidence (e.g., Healthcare: Clean Rooms – Hospital service + hospital sector statements — clearly marked capability, not claim of hospital projects; until 3+ records exist, these pages carry a `SERVICE-LED` mono badge in the hero — honesty device [P3 §5.3]).

---

## 12. COMPANY PAGES

### 12.1 About — `/about`

Light editorial page (no image hero): headline `display-l` `A turnkey engineering company, since 2012.` *(draft)* + timeline register:
1. **Story (01 · THE COMPANY):** white; 7/5 — narrative ≤3 paragraphs (incorporation 26 Dec 2012 Kanpur → two practices → today; **only documented dates** [VERIFY: 2012–2018 history gap]); right: marginal mono notes (est. date, CIN).
2. **The two practices (02 · STRUCTURE):** off-white; reuse the homepage diptych component, linked to practice pages.
3. **Delivery model (03 · HOW WE WORK):** white; stepper + a `TURNKEY SITC` explainer panel (hairline rows: Survey & design → Supply & procure → Install → Test & commission → Operate & maintain).
4. **Quality & safety (04 · QUALITY & SAFETY):** off-white; TQM statement (DOC A p4 quote) + the 5 safety procedures as a numbered mono register (both documented).
5. **Presence (05 · PRESENCE):** white; **offices register** (4 offices + Rajasthan unit [VERIFY: unit details — gate #16]): each row = city, type (Corporate/Branch/Manufacturing), address line; right: the reach strip — `25 STATES & UTS + NEPAL — PROJECT REACH` as a designed typographic element: state names in mono-meta flowing text (corrected spellings), framed by hairlines, `REACH` vs `DELIVERED PROJECTS` distinction explicit. No map until geo-verified [P3 §5.4].
6. **Careers panel (conditional):** if no openings: evergreen panel `We are always looking for engineers who take the work seriously.` + `Write to us` mailto (no fake listings [P3 §3.11]).
7. CTA band.

### 12.2 Team — `/team` (not LinkedIn)

1. **Page hero (light):** headline `display-l` `The people on the record.` *(draft)*; metadata strip: `{N} NAMED PEOPLE · 2 PRACTICES · 100+ YEARS COMBINED SITE EXPERIENCE` **[VERIFY: the "century" claim is marketing arithmetic (Phase 1 §15 LOW) — combined-experience line is EXCLUDED until client approves wording; strip shows people + practices counts only]**.
2. **Leadership band (01 · LEADERSHIP):** navy; 4 plates (Directors + Patron + Financial Advisor = 6 plates in 2 rows on desktop; 2-col mobile) — same plate component as homepage §5.11. Name + role + (≤12-word note where verified). **[VERIFY C1–C7: roles/titles/years — ship name+role only until resolved; the Financial Advisor role publishes only with client approval]**
3. **Delivery organization (02 · DELIVERY):** off-white; 2-col by practice: Senior delivery members (Sr. PMs, Managers, BDM) as register rows: name 17px + role mono-meta + (1-line note where verified). Filter chips: ALL / PRACTICE 01 / PRACTICE 02 (client-side toggle, no URL sync needed).
4. **Name wall (03 · SITE & DESIGN TEAM):** white; a **typographic wall** — all site & design engineers (the 11 documented names + any additions) in a flowing grid of name chips (hairline, mono-meta, 16px padding). No cards, no fake bios, no headshot placeholders — the wall reads as an engineering crew sheet. Count annotation: `{N} ENGINEERS & SITE STAFF — COMPANY RECORD, 2022 REVISION` *(draft)*.
5. **Photography policy:** headshots requested (§16.3); until they exist — no photo slots at all (plates and rows are typographic; adding photos later is a non-breaking enhancement: plate reserves a 1:1 slot in its desktop anatomy only when `photo` is non-null).
6. **CTA:** `Talk to our team →` → /contact.

### 12.3 Clients — `/clients`

1. **Hero (light):** headline `A working relationship, on the record.` *(draft)*; metadata strip (`{N} CLIENTS & RELATIONSHIPS · 4 CATEGORIES`).
2. **Categories register (01 · CLIENTS):** off-white; the 4 DOC A p6 groups as sections — logo walls (navy 60%, 32–40px) with names where no logo/permission; hairline group dividers.
3. **Relationships (02 · WORKING WITH):** white; two panels: **PMC & architect associations** (JLL, CBRE, Knight Frank, … — DOC B p2 list [VERIFY: "associated" vs "empanelled" wording — gate #14; Phase 4 renders the *conservative* word `ASSOCIATED` until resolved]) and **EPC & utility counterparties** (from project records: L&T, TATA Projects, JSP Projects, BGRL/Vichitra, Parmesh, Capgemini — labeled `FROM PROJECT RECORDS` mono note). No logos for associations (text register only).
4. **By practice (03 · FILTER):** practice chips re-filter the walls.
5. **CTA:** `Start a project →`.

### 12.4 Credentials — `/credentials` — *the evidence room*

**Feel: a professional document register — not badge spam [brief §12].**

1. **Hero (light):** headline `Compliance, on the record.` *(draft)*; standfirst; metadata strip (`{N} REGISTRATIONS & CERTIFICATIONS`).
2. **Statutory register (01 · STATUTORY):** white; the core — a **technical table** (§3.8): columns REGISTRATION · NUMBER · JURISDICTION/ISSUER · STATUS; rows: Incorporation (CIN, 26 Dec 2012, RoC UP) · PAN · Udyam (Small·Services) · GST ×5 (UP/MH/BR/DL/HR with real GSTINs) · ESI. Each row carries a `VIEW SCAN ↗` mono link where a scan is approved (media library). First column sticky on mobile; horizontal scroll permitted for this table only.
3. **Quality certifications (02 · QUALITY):** off-white; ISO 9001:2015 panel — 1 hairline card: title, scope, issuer, `certificate scan` link. **[VERIFY gate #13: no issuer/scan in source — until provided, panel renders title + `CERTIFICATE ON REQUEST` mono note; the word "certified" is used only in the exact badge wording `ISO 9001:2015 Certified` which IS documented]**
4. **Memberships & initiatives (03 · MEMBERSHIPS):** white; MSME (Udyam-backed), Make in India, and the green badges — rendered as a quiet mono list titled `MEMBERSHIPS & INITIATIVES — NOT CERTIFICATIONS` (the honesty device for the unsourced badges, Phase 1 §6).
5. **CTA:** `Request verification documents →` (enquiry form, credential-routed).

### 12.5 Careers — `/careers` (conditional)

Renders only when active openings exist [P3 §3.11]; otherwise route 404s→redirects `/about#careers` and no nav link renders. Page: light; register of openings (role, location, practice, type — from `careers` collection); each row expands to description + `Apply` (mailto with role in subject — no portal). Evergreen panel: `No current openings listed. We still read every serious introduction — write to us.` *(draft)*.

### 12.6 Contact — `/contact`

Fully specified in §13.

---

## 13. CONTACT EXPERIENCE

**A serious B2B enquiry channel [brief §13] — the form is an intake sheet, not a "Contact Us" widget.**

### 13.1 Page composition (light page — the only light conversion surface)

1. **Hero (light):** headline `Start a project.` `display-l`; standfirst *(draft)*: `Tell us what you are building. A director or senior manager responds to every serious enquiry.`; metadata strip: `RESPONSE: WITHIN 1 WORKING DAY *(draft — needs client confirmation — flagged)* · OFFICES: NOIDA · PATNA · GURUGRAM · SANGLI`.
2. **Grid 5/7:**
   - **Left — Direct channels (sticky on desktop):** both phones as 48px hairline rows (Phone icon, number in mono 16px, `CALL` label) [VERIFY gate #3]; email row (mailto); **Offices register**: each office = city + type chip (CORPORATE/BRANCH/MANUFACTURING) + address 14px + map link (Google Maps, opens new tab; no embed-per-office — one optional HQ embed from CMS setting at page bottom) [VERIFY: address variants — gate #2; Rajasthan unit address missing — gate #16]; business hours row [content requested]. HQ office carries the single map embed (existing `google_maps_embed` CMS setting).
   - **Right — Enquiry form (the intake sheet):** title-block-framed: frame header `ENQUIRY INTAKE — CAPEX CONSTRUCTION & ENGINEERING PVT. LTD.` (mono-micro). Fields: Name* · Email* · Phone · Company · **Practice (segmented control: `GENERAL / PRACTICE 01 / PRACTICE 02` — practice-aware routing [P3 §13.12])** · Service (select — **generated from the live `services` collection**, grouped by practice; kills the triple-maintained list, TD7) · Message* (textarea, 6 rows, helper: `Scope, location, timeline — whatever you know today.`). Honeypot hidden field. Submit: amber signature button (the one per view) `Send Enquiry` (§2.8 button spec, §2.9 states).
3. **Success state:** form area → confirmation panel (title-block frame): `ENQ-{REF}` mono amber *(server-generated [NEW])*, `Received. A senior colleague will respond within one working day.` *(draft — client to confirm the promise)*, both phones repeated, `Send another enquiry` text button. (Fixes the prototype's button-text-only success.)
4. **Validation:** per §2.9 — on blur + submit; name/email/message required; email format; phone optional-format; error summary at top (focus moves to first error, `role=alert`).
5. **Mobile:** stacked — headline, phones (48px rows, thumb zone), form full-width, offices below as accordion; sticky? — **no** sticky mobile CTA bar; the header CTA suffices.

---

## 14. RESPONSIVE DESIGN

**Breakpoints:** 480 / 768 / 1024 / 1280 / 1440 (max) — matching §2.4 grid table.

| Component | Desktop ≥1280 | Tablet 768–1279 | Mobile <768 |
|---|---|---|---|
| Header | 80→64px transparent→solid; mega-menu | Simplified dropdown (mega collapses to 2-col panel ≤1023px; phone chip hidden ≤1023) | 64px solid; phone chip + Start chip + menu; full drawer (§4.3) |
| Hero (home) | 88vh, text cols 1–6, meta line | 70vh, text cols 1–7 | 78vh bottom-anchored; display-xl 40px; stacked CTAs |
| Practice diptych | 2×50/50 panels | stacked, 2-col metrics | stacked; panels min-height auto |
| Project feature | 7/5 split rows | stacked image-over-text | 16:10 card, overlay text |
| Register rows | 64px full rows | same, ±metric wrap | 2-line 96px rows (§8.2) |
| Filter rail | 280px sticky left rail | top filter bar + collapsible | `FILTERS` button + bottom drawer (§8.2) |
| Technical tables | full width | horizontal scroll | horizontal scroll, **sticky first column** |
| Metric panels | 4-across `metric-xl` | 2×2 | 2×2 `metric-l` 40px |
| Stepper | horizontal 5 nodes | 2 rows (3+2) | vertical list |
| Forms | 2-col field grid | 1-col | 1-col; 48px targets |
| Galleries | 3-col 16:10 | 2-col | 1-col w/ swipe? — 1-col stacked (no carousel) |
| Footer | 4-col register | 2-col | 1-col accordion? — 1-col stacked |
| Typography | per §2.1 scale | 1 step down | per §2.1 mobile column |
| Image crops | 16:10 @ cols | 16:10 | 4:5–16:10 object-position per §16.2 mobile crop map |

**Mobile-first rules:** body ≥16px; mono ≥11px; tap targets ≥44px (CTAs 48); hover states never the only affordance (touch surfaces show active states); sticky elements max 1 (header); forms one column; no horizontal scroll except the credentials table (intentional); iOS safe areas respected (drawer, sticky CTA).

---

## 15. MOTION SYSTEM

**Governing rule [P3 §8]:** motion communicates hierarchy — direct attention, give feedback, maintain continuity — never decorates.

### 15.1 Token set

| Token | Duration | Easing | Used by |
|---|---|---|---|
| `--motion-fast` | 150ms | ease-out | link underlines, color hovers, chip states |
| `--motion-base` | 250ms | cubic-bezier(0.2, 0.6, 0.2, 1) | hovers (image scale, card border), filter reflow fade, drawer slide, accordion |
| `--motion-section` | 400ms | ease-out | section reveals (once per view) |
| `--motion-count` | 600–900ms | ease-out | counters (once, staggered) |

### 15.2 Specification per interaction

- **Page entrance:** none (instant SSR content — no page-load choreography). Only the homepage hero text reveals on load (§5.1).
- **Section reveal:** one-time 12px rise + fade, `--motion-section`, threshold 20% viewport, each section once per page-view; no staggering *within* sections except diptych (120ms) and metric panels (80ms).
- **Hover:** image scale 1.02–1.05 (`--motion-base`); borders/underlines `--motion-fast`; chevron/arrows nudge 4px; metric color shifts `--motion-fast`. Never layout-shifting.
- **Counters:** count-up `--motion-count`, staggered 80ms; once per view; format-preserving (commas); reduced-motion → final value immediately.
- **Filter transitions:** 250ms fade-out → DOM update → fade-in of the result list; count line updates `aria-live`; no FLIP gymnastics — the register aesthetic survives a simple crossfade.
- **Sticky elements:** header shrink 200ms background change (no bounce); filter bar sticks/unsticks without animation; back-to-top? — omitted (register pages paginate, not infinite).
- **Navigation transitions:** mega-menu fade + 8px rise 200ms; mobile drawer slide 250ms with simultaneous scrim fade; accordion chevrons rotate 200ms.
- **Lightbox:** fade in 200ms + image 12px rise; nav arrows/counter update instantly; Esc/close immediate.
- **Section transitions (scroll):** none — hard hairline cuts between bands (documentation cuts); no parallax, no sticky-stack effects.

### 15.3 Global rules

- `prefers-reduced-motion: reduce` → all reveals/counters/marquee/scroll-into-view animations render final states; opacity transitions ≤150ms retained for feedback only. Implemented as a single global media-query layer, not per-component conditionals.
- **No autoplay video. No cursor effects. No scroll-jacking. No parallax. No 3D.** [P3 §8 rejects, carried]
- Motion budget: any user action produces ≤1 animation of >250ms.
- Loading states: route-level SSR (no skeletons needed); image placeholders = solid `--surface` (no spinners except the submit button).

---

## 16. IMAGE / PHOTOGRAPHY SYSTEM

**Priority hierarchy [P3 §16 carried]:** 1) real Capex project photography → 2) approved imagery extracted from company material (interim) → 3) designed no-photo treatment. **NEVER generic stock presented as Capex work.**

### 16.1 Source inventory (interim launch basis)

Brochure galleries (DOC A p12, p16; DOC B; DOC C — Phase 1 §2.5): HDD rig (GS420-L), HDD setup, erection at dusk, cross-country pipeline, drill rods, butt fusion/jointing, toolbox briefing, fire pump room + hydrant header, substation erection; roof-top chiller + AHU (WTT), functional testing, retail atrium, fit-out interiors. Extracted at highest available resolution; **[original files requested from client — §10.2 P3; extraction quality is the fallback]**. Current prototype's 6 stock hero JPGs and `hero-work.mp4`: **retired** (not Capex work — anti-pattern §21).

### 16.2 Hero photography

- Homepage: 1 decisive image from the strongest available (HDD rig or WTT plant — final pick in 4A style tile with client).
- Aspect ≥16:10 at 2880px wide; crop map: subject in right 40% (P01 heroes) / left 40% (P02 mirrored); mobile crop re-centers subject at 4:5 via `object-position` per-image (each hero image defines its mobile focal point in CMS `meta` — `[NEW]` editorial control without re-uploads).
- Grain/noise overlays, vignettes, duotone gradients beyond the scrim: forbidden.

### 16.3 Per-context treatment

| Context | Ratio | Treatment |
|---|---|---|
| Hero bands | 16:10–21:9 (viewport) | navy scrim (§5.1); cool grade |
| Project feature tiles/rows | 16:10 | cool navy-tint grade; bottom scrim only where text overlays |
| Project record imagery | 16:10 | as-shot (honest), light grade |
| Case-study gallery | 16:10 + 4:5 mix | as-shot; captions mandatory (§3.5 annotation format) |
| Practice hero | viewport | mirrored composition (§6) |
| Service pages | none | no photography (§7) |
| Team | 1:1 (when headshots exist) | neutral background, consistent grade; until then typographic (§12.2) |
| Equipment/plant | 4:3 | as-shot documentation photos, captions w/ spec |
| Client logos | fixed-height 24–40px | mono-navy 60% opacity, single-color treatment |

### 16.4 Overlays

One device only: the navy scrim (`--brand` → transparent, angles per band) for text legibility. No gradient overlays, no blend modes, no color washes beyond the scrim.

### 16.5 The no-photo treatment (designed absence)

A first-class component: hairline panel (0 radius), survey grid 6%, centered mono ref (`P1-001 — NO PHOTOGRAPHY ON RECORD`), practice chip, ambient `--surface` background. Used for records/panels without imagery. It reads as an honest register placeholder — designed, deliberate, never broken-looking. **[This is what makes 76 record-grade entries premium without fake photography — the load-bearing design decision of the project system.]**

### 16.6 Captions, metadata, alt text

- Caption format (annotation style §3.5): `{LOCATION} — {scope}, {status}` — CMS `excerpt` field per image; mandatory for case-study galleries; optional elsewhere.
- Alt text: descriptive + factual (`HDD rig at Patna smart-city site` style — generated from CMS title/caption; decorative images `alt=""`).
- Image `loading=lazy` except heroes (`eager` + `fetchpriority=high`); width/height always set (CLS).

### 16.7 Galleries

Case-study galleries only (§10.6): grid (no carousel), lightbox per §15.2; keyboard operable; counter; captions carried into lightbox.

### 16.8 Fallbacks

No image → no-photo treatment. Broken image → same treatment (onError swap). No logo → name tile. No headshot → typographic plate. No scan → `CERTIFICATE ON REQUEST` note. Every fallback is designed (§1.11).

---

## 17. COMPONENT INVENTORY

30 components. Format: **name — purpose | anatomy | variants | desktop/mobile | interaction | CMS data.**

1. **Header** — global navigation & identity | logo lockup · 4 nav items + 2 triggers · phone chip · signature CTA · menu button | transparent/solid; desktop/mobile drawer | 80→64px scroll shrink | hover ticks, active route underline, keyboard menus | `nav_items`, `logo_url`, `contact_phone`.
2. **MegaMenu** — practice-structured capabilities exposure | 3-col panel: 2 practice groups (chip + name + services) + evidence col | desktop panel / tablet 2-col / mobile accordion | hover-intent + click, Esc, focus trap | `services` (grouped by `practice_id`), `practices`, featured `projects`.
3. **Hero (CMS)** — homepage positioning | image · eyebrow · headline (display-xl) · subline · 2 CTAs · metadata line · sheet strip | static/cross-fade(≥2 imgs)/no-image navy | load reveal once | **must render `sections.hero` (TD6 fix)** | `sections.hero`, `hero_images[]`.
4. **DrawingSheetLabel (TitleBlock)** — record chrome | hairline box · 2–4 cells `LABEL: VALUE` | 2/3/4-cell; light/navy | static | none | per-page props (project/practice data).
5. **SectionHeader** — band identity | `[ NN · LABEL ]` eyebrow · headline · optional sub + CTA | light/navy; with/without rule | reveal once | — | `sections` row.
6. **TrustStrip** — instant client recognition | mono label + logo marquee | marquee/static (reduced-motion) | pause hover/focus | `clients` (featured).
7. **PositioningStatement** — editorial who-we-are | statement type + body + text CTA + marginal note | — | reveal once | `sections.about`.
8. **PracticeSplit (Diptych)** — the signature two-practice section | 2 hairline panels: chip · name · 3-line scope · 2 metrics · link; corner crosshairs | home band / about reuse | hover border lift | `practices`.
9. **ProjectFeature** — flagship record presentation | 16:10 image · overlay chip · title · metric · metadata | image / no-photo | scale 1.03 hover | `projects` (featured, template B).
10. **ProjectRow** — register row | ref · title · metric · client · state · status chip · chevron | full/compact/mobile-2-line | bg hover | `projects`.
11. **RegisterStrip** — compact record list | N ProjectRows under a hairline | 3–6 rows; light/navy | — | `projects` (relation query).
12. **TechnicalMetric (marker)** — quantity display | tick row · metric-xl mono value · unit · label | light/navy; xl/l sizes | counter once | `metrics[]` (structured).
13. **InstrumentPanel** — metric band | 4 TechnicalMetrics + dividers | 4-across/2×2 | counters | computed/project stats.
14. **EvidencePanel** — inline proof box (sector hubs, practice pages) | hairline box · title · mono list of named proof | light/navy | — | relation-derived lists.
15. **Stepper (5-stage)** — delivery process | 5 nodes: mono number · title · 2-line note; hairline connector | horizontal / 2-row / vertical | — | `process`.
16. **SafetyRegister** — 5 documented safety procedures | numbered mono rows | — | — | static from DOC A p9 (CMS `sections.extra` validated or pages content).
17. **PlantTable** — owned equipment register | technical table: ITEM · SPEC · COUNT | full / service-filtered / mobile sticky-first-col | — | equipment data (CMS; counts pending verification).
18. **ServiceRow** — services index entry | name · 1-line scope · chevron; hairline | — | row hover | `services`.
19. **SectorRow** — sector index/hub entry | name · record count · tier badge · chevron | hub/list-only | — | `industries` + counts.
20. **ClientWall** — logo/name grid | mono group label + logo tiles or name tiles | practice-filtered | — | `clients`, `categories`, `permission_status`.
21. **CredentialRegister** — statutory table | REG · NUMBER · JURISDICTION · STATUS · scan link | full/mobile-scroll | — | `credentials` + media.
22. **TeamPlate** — leadership presentation | hairline plate: name · role · note; optional 1:1 photo slot | leadership/delivery; navy/light | — | `team` (verified fields).
23. **NameWall** — engineer crew sheet | flowing name chips + count note | — | — | `team` (delivery group).
24. **CTABand** — conversion close | headline · 2 CTAs · phone lines | light/navy; standard/practice/service variants | — | `sections` + settings.
25. **ContactForm (intake sheet)** — enquiry intake | title-block frame · 7 fields · honeypot · submit | inline band / page panel | validation, success panel w/ ENQ-ref | `services` (options), routing map.
26. **FilterRail** — project facet control | sticky rail: search · practice chips · 3 selects · status | desktop rail / mobile bottom drawer | URL-sync; `aria-live` count | facet taxonomy (computed).
27. **Breadcrumb** — wayfinding | REGISTER / PRACTICE / RECORD mono path | — | — | route context.
28. **StatusChip** — completed/ongoing mark | mono chip w/ dot | verified (green family)/ongoing (amber) | — | `projects.status` (verified only).
29. **Lightbox** — gallery viewer | image · caption · counter · close/nav | — | keyboard, focus trap, Esc | gallery images.
30. **Footer** — site-wide register close | 4-col: brand+tagline · sitemap · practices · legal/registrations; hairline top | desktop 4-col / mobile stacked | — | `nav_items` (footer), settings, credentials (CIN/Udyam line).

---

## 18. PAGE-BY-PAGE DESIGN MATRIX

| Route | Purpose | Audience | Hero type | Major sections | Primary CTA | Secondary CTA | Imagery | CMS deps | Proof/evidence | Unique treatment | Mobile notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Position + route buyers + prove | All first-visit | Image hero (CMS) | 13 bands §5 | Start a Project | Explore Projects | 1 hero + feature tiles | all collections | Metrics, register rows, credentials strip | Diptych + instrument panel | Per-band §5 mobile specs |
| `/practices/ug-utilities-electrical` | P01 front door | EPC/PMC, utilities | Image hero (mirrored R) | §6.2 stack | Explore Practice Projects | Discuss This Practice | HDD/pipeline (real) | practices, services, projects, equipment | Owned-fleet table, km quantities | Plant table star turn | Table sticky-col |
| `/practices/mep-fire-protection` | P02 front door | Developers, corporates, PMCs | Image hero (mirrored L) | §6.3 stack | Explore Practice Projects | Discuss This Practice | WTT plant (real) | same | T&C register, WTT 4,000 TR | T&C + service model | same |
| `/services` | Capability index | Evaluators | Light hero | intro + 11 ServiceRows (grouped by practice) | Discuss a Service | View Project Register | none | services | counts per service | Register, not icon grid | single-col list |
| `/services/{slug}` | Service depth | Need-matchers | Light hero (no image) | §7 stack | Discuss This Service | View {service} records | equipment 4:3 only | services, equipment, projects | 3 service metrics + records | Method 2×2 panels | tables scroll |
| `/projects` | The evidence register | All evaluators (repeat) | Light hero + sticky filter bar | features + register + rail | (per-row) | Start a Project | feature tiles only | projects + taxonomy | The register itself | Rail+content 3/9 | Filter drawer + 2-line rows |
| `/projects/{slug}` (A) | Verified record | Evaluators | Title-block record header | §9 stack | Discuss Similar Work | View Register | 16:10 or no-photo | projects | Scope line + metrics | No-photo treatment | metrics wrap |
| `/projects/{slug}` (B) | Case study | Flagship evaluators | Navy image hero + metric line | §10 stack | Read next case study | Discuss Similar Work | gallery + lightbox | projects (template B) | Full narrative + metrics | Evidence-conditional blocks | gallery 1-col |
| `/sectors` | Market entry | Buyers by industry | Light hero | evidence-tiered register | (per-hub) | — | none | industries + counts | Record counts | Honest tier badges | 1-col |
| `/sectors/{slug}` | Sector proof | Sector buyers | Light + 4:5 image | §11.2 stack | Discuss {sector} | View filtered register | hub image | industries, projects, clients | EvidencePanel (inline proof) | Evidence-first hub | stacks |
| `/about` | Company truth | All serious | Light editorial | §12.1 timeline | Meet the Team | View Credentials | none | pages, offices, settings | Timeline, statutory | Offices register + reach strip | accordion offices |
| `/team` | Real organization | Evaluators, candidates | Light hero | §12.2 stack | Talk to Our Team | — | headshots (pending) | team (verified) | Name wall count | Crew-sheet name wall | plates 2-col |
| `/clients` | Trust wall | All | Light hero | categories + relationships | Start a Project | — | logos (per permission) | clients, categories | Relationship-typed panels | PMC text registers | grouped walls |
| `/credentials` | Evidence room | Procurement | Light hero | §12.4 register | Request Verification Docs | — | certificate scans | credentials, media | Real GSTINs, CIN | The register table itself | sticky first column |
| `/careers`* | Recruiting (conditional) | Candidates | Light hero | openings register | Apply (mailto) | — | none | careers (active only) | Real openings or honest none | Redirect-when-empty | 1-col |
| `/contact` | Conversion | All | Light hero | §13 | Send Enquiry | Call | HQ map (optional) | offices, services, settings | Both phones, offices | Intake-sheet framing | phones-first stack |
| `/{slug}` (legal) | Compliance | Legal reviewers | none | policy text (max 640 measure) | — | — | none | pages | Reviewed text only | Unpublishable placeholder rule | plain |

*conditional — hidden from nav & sitemap until openings exist.*

---

## 19. CONTENT HIERARCHY RULES

1. **Headlines:** ≤8 words / ≤52 characters desktop-display; hard wrap limit 2 lines. Pattern: statement + concrete noun ("Selected work, by the numbers." not "Our Amazing Projects").
2. **Paragraphs:** ≤70 words (editorial) / ≤40 words (cards, panels); one idea per paragraph; no walls — max 2 consecutive paragraphs anywhere before a structural element intervenes.
3. **Eyebrow labels:** `[ NN · LABEL ]` or `[ PRACTICE 0N · … ]` formats only; ≤4 words after the number; always mono, never a sentence.
4. **Metadata:** always mono; `LABEL: VALUE` or `LABEL · VALUE` pairs; max 4 pairs per strip; states and units abbreviated consistently (KM, TR, KV, UT).
5. **Technical numbers:** mono always; comma separators; unit appended with thin space; never rounded for drama (150 KM not "150+ KM"); every number on the public site must exist in the verification register [P3 §9.3].
6. **CTA wording:** locked verb set (§2.8): Start · Explore · View · Read · Discuss · Request · Meet · Talk. One primary CTA per view; ≤3 CTAs total per screen. Never "Learn more", "Submit", "Click here".
7. **Captions:** annotation format (§16.6), ≤10 words; factual; no marketing language in captions.
8. **Project descriptions (records):** scope line + ≤2 sentences derived from documented scope wording; no invented outcomes, no invented dates; if the PDF says only "150 KM 11&33 KV cable laying", the page says only that.
9. **Service descriptions:** standfirst ≤40 words; overview ≤120 words; scope items are noun-phrases from PDF wording; no capability claims beyond PDFs (e.g., no "BIM" claims — absent from source).
10. **Client naming:** exact logo spelling for walls (with [VERIFY: spelling corrections per C20 — corrected spellings in prose, exact-logo spelling in alt text]); individuals from DOC B residential records render as `PRIVATE RESIDENTIAL CLIENT, NOIDA` — never full personal names [privacy; NEW].
11. **Verified/unverified content:** the CMS workflow (P3 §9.3) is the enforcement mechanism: `needs-client` never renders; `unverified` renders nowhere public. Design-side rule: if a component's data slot is empty, the component omits itself — **no component ever renders with placeholder text** (§1.11).
12. **Register counts:** always `N RECORDS` (never "N projects" — uniqueness unverified); live-computed from relations, never hand-entered.

---

## 19b. CONTENT-MODEL FIELDS THIS DESIGN REQUIRES (summary for Phase 4 implementation)

(Carried from P3 §4.3/§9; listed here because §5–§12 specs reference them.)

`practices` {name, short_label, slug, scope_3liner, hero_image(+focal), metrics[2], page_narrative, equipment[], tnc_register[] (P02), service_model[] (P02)} · `services` {practice_id, name, slug, standfirst, overview, included[], method_panels[4], metrics[3]} · `projects` {title, slug, ref, practice_id, service_ids[], sector_ids[], client_display, location_city, location_state, status, scope_line, metrics[], template A/B, images[]+captions, case_study{overview, scope[], execution[], outcome}, featured, verification_status, source_ref} · `team` {name, role, group, practice_id, note, photo, verified} · `clients` {name, logo, permission_status, relationship, category, practice_affinity} · `credentials` {title, category, number, jurisdiction, scan, verified} · `offices` {city, type, address, phone, map, hours} · plus existing sections/settings/nav/media/submissions.

---

## 20. ACCESSIBILITY + USABILITY

- **Contrast:** all text pairs verified ≥4.5:1 (body) / ≥3:1 (large display ≥24px & mono metrics ≥28px); amber-on-navy and amber-on-light pairings to be locked in the 4A style tile with measured values; white-70% on navy ≥4.5:1 enforced (60% only for ≥28px mono).
- **Focus states:** 2px ring, offset 2px — `--primary` on light, white on navy; never `outline: none`; visible on every interactive element in every component (§4.4).
- **Keyboard:** full site operable — menus (§4.4), filters, lightbox, drawer, accordion, forms; logical tab order; no keyboard traps outside intentional modals; skip-to-content link first.
- **Touch targets:** ≥44×44 (CTAs 48); adjacent targets ≥8px apart; chips and chevrons meet target size via padding.
- **Reduced motion:** global layer (§15.3); marquee static; counters final; reveals off.
- **Form errors:** text + icon + field border + `aria-describedby` + summary `role=alert` + focus management (§2.9); never color-only.
- **Headings/semantics:** one h1/page; sections h2, cards h3; no skipped levels; nav/landmark roles (`header nav[aria-label]`, `main`, `footer`); register rows are `<table>`s where tabular or list+dl where not; chips are buttons with `aria-pressed`.
- **Mobile readability:** §14 rules (16px floor, 44px targets); form labels always visible; no hover-only information.
- **Alt text:** descriptive alts from CMS captions; decorative `alt=""`; logo alts = company name; the no-photo panel is `role=img` with `aria-label` = ref text.
- **Marquee/logo walls:** decorative motion off by default for AT (`aria-hidden` on duplicates); reduced-motion static fallback doubles as the accessible presentation.

---

## 21. DESIGN ANTI-PATTERNS — "NEVER DO THIS"

**Imagery:** stock construction heroes · generic skyscraper heroes · AI-generated engineering imagery presented as Capex work · fake project photography · people-in-hardhats stock with folded arms · fake maps / invented coverage maps (reach strip only, until geo-verified).
**Color:** purple/lime/teal legacy palette (retired [P3]) · new hues of any kind · gradient banners · more than one accent · amber as a background fill.
**Content:** giant meaningless statistics · fake testimonials · fake certifications or trust badges · unsourced numbers ("150+", "315+", "10+ years" until verified) · "86 projects" public count (records ≠ verified unique projects) · placeholder text of any kind · superlative headlines without evidence ("Leading…").
**Layout/UI:** SaaS dashboard aesthetic · startup landing-page aesthetic (gradient hero + app-store buttons) · glassmorphism beyond the existing restrained glass tokens on navy bands · rounded-24px everything (radius system §2.6) · infinite carousels · autoplay video · infinite scroll (register paginates) · icon-card grids for services/sectors (registers instead) · LinkedIn-style team cards with fake bios.
**Motion:** cursor gimmicks · scroll-jacking · heavy parallax · 3D/rotating equipment models · entrance choreography on every element · counters on unverified numbers.
**Structure:** two separate practice "brands" (color/logo divergence) · buried phone numbers · hamburger-hidden CTAs on mobile · footer-only legal being unreachable · homepage carousels of any kind (one hero image).

---

## 22. VISUAL QUALITY BAR — ACCEPTANCE CHECKLIST

The implementation is successful only if ALL of:

**Foundations**
- [ ] Type scale renders per §2.1 at all 5 breakpoints; mono used for every number/label/metadata on the public site (spot-check 20 random numbers site-wide).
- [ ] Color palette locked to §2.2 tokens; no legacy hues; amber appears ≤1 CTA + numbers/status only per view.
- [ ] Hairline system: cards/tables/registers bordered per §2.5; shadows only on the 5 overlay surfaces (§2.7).
- [ ] Spacing: section rhythm 112/80/64; gutters 80/40/24 — verified by overlay audit.

**Signature language**
- [ ] Title blocks render on the 4 specified surfaces only; section numbering runs correctly on every page; no blueprint-theme drift (§3.4 boundaries audited: grid only in navy-band margins + no-photo panels).
- [ ] No-photo treatment used everywhere imagery is absent — zero gray boxes, zero stock.

**Evidence-first**
- [ ] Every stat on the site maps to the verification register; counters only on documented numbers; counts render `RECORDS`.
- [ ] Projects index shows features + register with all facets working URL-synced; mobile drawer opens/closes cleanly; empty states present.
- [ ] Credentials page shows the real registry numbers in the register table.

**Hierarchy & story**
- [ ] Homepage reads as the 13-band narrative with zero orphan components; each band's CTA wired.
- [ ] Case studies render only with non-empty narrative blocks; Template A pages never show empty narrative slots.
- [ ] Practice pages are structurally identical (template audit) with mirrored heroes.

**Mobile**
- [ ] All §14 mobile specs hold on a real 390px device: header chips, filter drawer, 2-line register rows, sticky-col tables, 48px targets, no horizontal scroll (except credentials).
- [ ] Phones tappable in ≤2 taps from every page (header chip).

**Motion & a11y**
- [ ] Reduced-motion global layer verified (marquee static, counters final, reveals off).
- [ ] Keyboard pass: menus, filters, lightbox, forms, drawer; focus visible throughout; contrast pairs measured and logged.
- [ ] Zero placeholder text on the public surface (automated grep for "Placeholder", "TBD", "Lorem").

**Identity**
- [ ] The site is visually distinguishable from a generic contractor template in a blind screenshot test of 3 pages (hero, projects, credentials) — the diptych, register rows, and instrument panels carry the identity.

---

## 23. PHASE 4 IMPLEMENTATION HANDOFF

**The implementation phases (4A–4D per P3 §13.18, concretized visually).** Note: the sub-phase letters here refer to *visual build order*; they align with P3's implementation phases (4A foundations… 4D polish) so engineering and design can run the same gates.

### 4A — Design foundations
**Deliverables:** style tile (final amber value, mono family final, all §2 tokens, focus-ring and contrast measurements logged); the 30 components (§17) built as isolated, CMS-fed components; header/mega-menu/drawer; footer; typographic primitives; the no-photo treatment; SectionHeader/TitleBlock/eyebrow system; **CMS hero rendering (TD6) with fallback states**.
**Dependencies:** CMS entities for practices/services exist (P3 §9) before component data-binding; asset migration off Lovable paths (TD8) before logo components go live.
**NOT yet:** homepage bands (components only), any project register (needs corpus), motion beyond hover/fast tokens.
**Acceptance:** components render from CMS with all fallback states; §22 foundation checkboxes pass; mega-menu keyboard-complete.

### 4B — Homepage experience
**Deliverables:** all 13 bands per §5 with motion §15; counters (verified stats only); marquee (reduced-motion aware); diptych; instrument panel; practice split CTAs.
**Dependencies:** 4A components; verified stats set (gate #6 wording resolved or documented-only set locked); client-hero image picked (§16.2).
**NOT yet:** interior pages; projects register.
**Acceptance:** §22 hierarchy/story checks; band rhythm table implemented exactly; hero renders CMS content with image + fallback; blind screenshot test passes for homepage.

### 4C — Page templates
**Deliverables:** practice pages (§6), service template (§7), projects index + Template A/B (§8–10), sector hub + overview (§11), company pages (§12), contact (§13), legal route skin.
**Dependencies:** project corpus entered (Template A minimum) before /projects goes live; equipment table verification state resolved (or count-free version per §6.2); case-study narratives (client-supplied) before any Template B ships — **else Template B pages downgrade to A automatically**.
**NOT yet:** motion refinement pass; careers route (inactive until openings).
**Acceptance:** §22 evidence-first + story checks; every §18 matrix row's "unique treatment" present; filter URL-sync verified by test URLs; mobile drawer + register rows verified on device.

### 4D — Responsive + motion + component refinement
**Deliverables:** full §14 matrix pass at 480/768/1024/1280/1440; §15 motion system + reduced-motion layer; lightbox, filter transitions, counter choreography; §20 a11y audit fixes; performance image pipeline (eager/lazy, focal crops, widths/srcset); final QA against §22 in full.
**Dependencies:** all 4C pages exist; real-device testing.
**NOT yet:** Phase 5 (anything beyond this scope — e.g., map visualization, insights).
**Acceptance:** the complete §22 checklist — every box — plus zero console errors, zero layout shift >0.1 on key pages.

---

## 24. CONSISTENCY AUDIT vs PHASE 3 (required by the brief)

**1. Decisions carried forward unchanged [P3]:** evidence-first positioning & stat policy (documented-only numbers, no "150+/315+/10+"); two-practice IA via Capabilities mega-menu + practice landing pages + services nested; 13-band homepage narrative order; multi-page sitemap & URL structure; Template A/B project system with evidence-conditioned blocks; taxonomy (2 practices, 11 services, evidence-tiered sectors); register semantics (`RECORDS`); visual DNA (navy+amber retained; purple/lime/teal retired); drawing-sheet signature concept; restraint motion strategy incl. all rejects (no parallax/autoplay/cursor/scroll-jack); CMS verification workflow (`verification_status`, `source_ref`, testimonial gating); photography priority hierarchy (real → extracted → designed no-photo, never stock); mobile phone-first; 16 launch gates preserved (address, phones, solar/clean-rooms, stats, testimonials, Wedream wording, policies, statuses, logo permissions, ISO, empanelled wording, offices/jurisdiction…); 4A–4D phasing.

**2. New visual decisions introduced in Phase 4 (consistent with, not contradicting, P3):** IBM Plex Mono as technical mono (P3 left family open); exact type scale + mobile floors; amber value nudge toward DOC C gold (P3 directed the nudge; value locks in 4A); hairline system replacing shadows; radius discipline (square for data surfaces, 8/4px for interactive — superseding prototype's pill buttons); header 80→64 shrink + always-solid mobile header; section eyebrow `[ NN · LABEL ]` format; Project REF codes (`P1-001`) as UI affordances (explicitly non-source claims); ENQ- reference in form success; 25/page pagination over infinite scroll; 4/5-breakpoint matrix; no-photo treatment design; marginal-notes device (≤1/section); equipment table launches count-free pending verification; residential clients rendered anonymized; combined-experience claim excluded from team strip (downgrading a P3-listed-but-flagged item to excluded-pending-verification — consistent with P3's LOW-confidence finding, not a contradiction); grid/tick/crosshair boundary rules (anti-blueprint-theme).

**3. Conflicts discovered:** none material between P3 and this document. Two clarifications resolved in favor of P3: (a) hero cross-fade — P3 allowed a pausable >8s option; Phase 4 defaults to static, keeping cross-fade as an opt-in if ≥2 quality images exist; (b) team strip's combined-experience line — P3 §12.2 listed it among possibilities but P1 §15 rates the claim LOW, so Phase 4 excludes it until client-approved (the conservative reading of the P3 rule "no silent resolution").

**4. Decisions still requiring client approval (beyond P3's 16 gates):** hero headline & subline drafts (§5.1); both draft copy sets across bands (marked *draft*); amber final value + mono family (4A style tile); source-citation style on counters (§5.9); response-time promise wording (§13.1); careers evergreen copy (§12.5); name-wall annotation wording (§12.2); hero image selection (§16.2); equipment-count publication once verified (§6.2).

**This document stops here. No Phase 5. No implementation. Awaiting client review and approval of this design blueprint.**
