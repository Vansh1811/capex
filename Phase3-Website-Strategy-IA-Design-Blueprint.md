# PHASE 3 — WEBSITE STRATEGY, INFORMATION ARCHITECTURE & DESIGN BLUEPRINT

**Capex Construction & Engineering Pvt. Ltd. ("Capex") · Prepared 2026-09-03**

**Status:** DECISION DOCUMENT — awaiting client review and approval. No code, database, or CMS content has been modified. Nothing in this document should be treated as approved until signed off.

**Inputs synthesized:**
- **Phase 1** — Company Discovery & Content Extraction (three company profile PDFs: DOC A combined profile, DOC B HVAC/Fire profile, DOC C UG/Electrical/CGD profile; incl. conflict register C1–C25)
- **Phase 2** — Existing Website, CMS & Codebase Audit (TanStack Start + Supabase one-pager; technical debt register TD1–TD20; security findings S1–S7)
- **Benchmark research** — Bechtel, Turner, DPR, Arup, AECOM, Jacobs, Fluor (patterns, not pixels)
- **Codebase verification** — routes, migrations, `styles.css` design tokens, `index.tsx` data-fetching (performed read-only for this phase)

**Conventions used in this document:**
- **FACT** — sourced from the Capex PDFs / Phase 1 / Phase 2. Citations like (DOC A p5), (Phase 1 §4.3), (Phase 2 TD1).
- **RECOMMENDATION** — our professional opinion, for approval. Not sourced fact.
- **[VERIFY: Cn]** — live conflict or gap from the Phase 1/2 registers that must NOT be silently resolved. Preserved, not decided, here.
- Draft copy marked **draft** requires client approval before use; it invents nothing factual.

---

## 0. DECISIONS AT A GLANCE (summary of the full document)

| # | Decision | Section |
|---|---|---|
| 1 | Positioning: **"turnkey engineering company, evidence-first"** — quantities and named proof over adjectives | §1 |
| 2 | The **two practices are the primary organizing axis** of the site: one "Capabilities" mega-menu, two practice landing pages, services nested under practices | §2 |
| 3 | Multi-page IA: ~24 URLs across 8 page types, max depth 2; no News/Insights, no Partners page, no subsidiaries, no per-person team pages, careers conditional | §3 |
| 4 | Project system with **two templates — "Project Record" (minimum)** and **"Case Study" (enhanced)** — so all ~86 documented projects can ship honestly; case-study format only where PDFs support it | §4 |
| 5 | Taxonomy strictly from PDFs: 2 practices → ~11 services → 5–9 sectors → 86 project records → clients with relationship types | §5 |
| 6 | Homepage narrative in 13 bands: hero statement → trust → practices diptych → selected projects (quantity-led) → delivery model → technical depth → sectors → verified numbers → clients → team → credentials → contact | §6 |
| 7 | Visual: keep navy+amber system, add "drawing sheet / title block" motif, retire purple and lime/teal brochure palettes, real project photography only | §7 |
| 8 | Motion: restrained (hover, filter reflow, counters, reveals) — all reduced-motion safe; reject cursor tricks, parallax, autoplay video | §8 |
| 9 | CMS: extend generic collections with relational entities (practices, project relations, credentials, offices) + verification workflow fields; kill raw-JSON editing | §9 |
| 10 | A structured Client Content & Verification Checklist gates launch | §10 |
| 11 | Implementation in 4 sub-phases (4A–4D), each gated on verification items | §13 |

---

## 1. DIGITAL POSITIONING

### 1.1 What Capex must communicate in the first 5–10 seconds

FACT: A first-time visitor currently sees an unlabeled photo carousel — the most valuable messaging slot on the site is empty (Phase 2 §7, §15.2). The company's own newest profile states the positioning plainly: "a leading turnkey engineering solutions provider specializing in UG Utilities, LMC, and allied infrastructure works" (DOC A p4), delivering "Supply, Installation, Testing & Commissioning" as a single accountable contract.

RECOMMENDATION — the first screen must answer, in this order:
1. **What Capex is:** a turnkey engineering company (not a broker, not a generic contractor).
2. **What it does, concretely:** underground utilities, electrical & CGD + MEP, HVAC & fire protection — the two practices, named, not merged.
3. **Proof:** named flagship work and quantities (4,000 TR at World Trade Tower; 150 km smart-city cable at Patna; 165 km gas pipeline at Aurangabad — all documented, Phase 1 §4).
4. **A next step:** "Explore projects" (evidence path) and "Start a conversation" (conversion path).

Hero copy direction (**draft, requires client approval**; deliberately free of the flagged "We dream" wording — [VERIFY: C12]):
- Eyebrow: `Capex Construction & Engineering Pvt. Ltd. · Est. 2012 · Noida · Project reach across India & Nepal`
- Headline: `Turnkey engineering, delivered end to end.` *(reuses the existing CMS About headline — already written, already coherent)*
- Alternative direction: `Under the city. Inside the building. One accountable partner.` — captures the two-practice structure in one line.
- Subline (all facts documented): `150 km smart-city cable networks. 165 km gas pipelines. 4,000 TR HVAC plants. Turnkey supply, installation, testing & commissioning since 2012.`

### 1.2 What makes Capex credible (and must therefore be visible)

FACT (from Phase 1, all source-backed):
- **Marquee, repeat clients:** L&T, TATA Projects, BGRL, IGL, BPCL, JSP Projects, Vichitra Constructions (DOC C p3, "long term association"; repeat orders claimed DOC C p3).
- **Named projects with engineering quantities:** 54 numbered HVAC installations, 22 fire installations, 10 UG utility records with km/kV/connection counts (Phase 1 §4).
- **Statutory substance:** incorporation 2012, CIN, PAN, Udyam, 5 state GST registrations, ESI (Phase 1 §8).
- **Owned plant:** 3 Drillto HDD rigs (32/28/20-tonne), welding/jointing fleets (Phase 1 §2.4).
- **A named, real team:** 3 directors, a 42-year HVAC patron, ~22 named people (Phase 1 §9, with conflicts C1–C7).

RECOMMENDATION: the site's credibility engine is **evidence, displayed raw** — project quantities, client names grouped by relationship, statutory numbers, equipment specs, named people. The current site *tells* ("Compliance you can verify") without *showing* (Phase 2 §13). Every credibility claim on the new site must link to a visible artifact within one click.

### 1.3 How the two practices differ — and how the site must reflect it

FACT (DOC A p5, p8): the two practices share one pool of directors, managers and engineers; they are internal structures, not legal entities.

| | Practice 01 — UG Utilities, Electrical & CGD | Practice 02 — MEP, Fire Fighting & Fire Protection |
|---|---|---|
| **Nature of work** | Public-infrastructure scale: km of cable and pipe, city programs | Building-services depth: TR of plant, system quality inside buildings |
| **Typical buyer** | EPC majors (L&T, TATA Projects), gas utilities (BGRL, IGL, BPCL, AG&P), PSU program owners | Developers, corporates, hospitals, hotels, malls + their architects/PMCs (JLL, CBRE…) |
| **Buying mode** | Tender/procurement-driven; evaluates capacity, plant, safety, statutory compliance, multi-state reach | Relationship/referral-driven; evaluates craft, testing rigor, after-sales SLAs |
| **Trust currency** | Quantities + owned equipment + statutory proof | Commissioning rigor + service model + installed-base references |
| **Signature proof** | 150/180/60/50 km cable programs; 165 km gas line; 5,000 connections; 220 kV metro feed | WTT 4,000 TR; WTP Jaipur 2,400 TR; 22 fire systems; 10 T&C services; SLA service model |

RECOMMENDATION: each practice gets its own **landing page with its own evidence, services, projects, and buyer-relevant proof** (§3.3), because the two buyer types evaluate different things. One shared brand shell communicates "one accountable partner" above both.

### 1.4 Audiences, priority order, and desired actions

| Priority | Audience | What they need | Primary action we want |
|---|---|---|---|
| 1 | EPC/PMC procurement & project managers (UG/CGD packages) | Capacity proof, plant list, statutory docs, project references | Enquire/RFQ; call |
| 2 | Gas utilities & PSU program owners | CGD/LMC track record, safety regime, registrations | Enquire; download/verify credentials |
| 3 | Developers, corporates & their architects/PMCs (MEP/HVAC/fire) | Installed base, T&C rigor, after-sales model | Enquire; call |
| 4 | Candidates | Real company, real team, openings | Apply/contact (secondary) |
| 5 | Suppliers/vendors | Procurement contact | Contact (tertiary) |

FACT: the only current conversion paths are one form and a header button (Phase 2 §4). RECOMMENDATION: phone-first CTAs (both documented numbers — [VERIFY: one number currently dropped, Phase 2 §12]), an enquiry form with practice-aware routing, and per-page contextual CTAs instead of dead-end cards (Phase 2 G8).

### 1.5 What the site must NOT be

- **Not** a generic construction template (stock collages, hero carousel of nothing, icon-grid clichés).
- **Not** a one-page brochure that hides its own best evidence (the current state — Phase 2 §1).
- **Not** "Bechtel but smaller": no borrowed corporate gloss, no fake global footprint, no invented thought-leadership.
- **Not** unverifiable: no invented testimonials (current site ships three — Phase 2 §6), no unsourced stats ("150+ Projects Commissioned", "315+ KM Utilities Laid" — [VERIFY: Phase 2 §12]), no Solar positioning ([VERIFY: C19, cover-only claim]) until the client confirms the service exists.

### 1.6 Desired brand feel (target adjectives → design implications)

PREMIUM / CLASSY → generous whitespace, hairline rules, restrained palette, large confident type.
ENGINEERING-LED / TECHNICAL → drawing-sheet motifs, tabular numbers, annotations, real specifications.
CONFIDENT → say less, prove more; quantities and names over adjectives.
ARCHITECTURAL / MODERN → asymmetric editorial grids, full-bleed real photography, precise motion.
CREDIBLE → statutory numbers visible, placeholders impossible to ship (CMS verification workflow, §9.6).

---

## 2. INFORMATION ARCHITECTURE — THE CORE DECISION

### 2.1 Critical evaluation of the previously proposed sitemap

The Phase 3 benchmark report proposed: Home, About, Practices (optional), Services + detail, Sectors + detail, Projects + detail, Team, Clients, Credentials, News/Insights, Careers, Contact, footer Legal. Evaluated against Capex's actual evidence:

| Proposal | Verdict | Reason |
|---|---|---|
| Practices as "optional grouping or combined with About" | **REJECT** | The two practices are the company's own organizing self-definition (DOC A p5) and the single biggest gap on the current site (Phase 2 G1). Optional-izing them repeats the current site's core failure. |
| Services detail pages for every service | **ADOPT** | Substantiated: ~11 services have scope descriptions, equipment, and project evidence in the PDFs (Phase 1 §2). |
| Sector detail pages (broad list) | **ADOPT WITH CONSTRAINT** | Only 3–5 sectors have multi-project evidence (§5.3). Launch hubs only where evidence exists; one overview page otherwise. 12 thin sector pages would dilute. |
| News / Insights | **REJECT (for now)** | Zero content, zero editorial capacity (Phase 2 §6: 0 blog rows). Defer 6–12 months. |
| Careers page | **CONDITIONAL** | 0 openings exist (Phase 2 §6). Ship an honest "we're always looking" panel inside About/Contact, or a careers page only when openings exist. |
| Team page | **ADOPT** | 22 named people documented (Phase 1 §9) — currently 0 on site (Phase 2 G4). |
| Clients page | **ADOPT, MERGED** | Merge "Partners/PMCs" into Clients as relationship types (client / PMC / architect / association) — separate pages would be thin and duplicate. |
| URL `/industries` | **USE `/sectors`** | Source vocabulary is "SECTORS SERVED" (DOC A p14, DOC B p2). One term, used consistently. |

### 2.2 How the two practices should be structured — decision + rationale

**Options considered:**

| Option | Assessment |
|---|---|
| (a) Two top-level nav items ("UG Utilities & Electrical", "MEP & Fire") | Fragments the brand into two quasi-companies; return visitors who only want Projects/Contact must scan past both; punishes the majority of journeys for the sake of the organizing metaphor. |
| (b) One flat "Services" list (current site) | Proven failure: flattens the practice narrative, merges distinct buyer paths, buries the company's defining structure (Phase 2 G1). |
| (c) Services as practice categories only (labels on cards) | Cheap, but still no room for each practice's distinct evidence, team, clients and story; the practices remain invisible as destinations. |
| (d) **One "Capabilities" mega-menu, two practice landing pages as primary destinations, services nested under practices** | **RECOMMENDED** — see rationale. |
| (e) DPR-style split ("What we build" vs "How we build") | Wrong axis for Capex: Capex's real structure is two practices, not build-types vs methods. Borrowing DPR's axis would fabricate a structure the company doesn't have. |

**Rationale for (d):**
1. **It matches the company's own newest profile** (DOC A is organized Section 2 = Practice One, Section 3 = Practice Two) — the site speaks the company's true structure.
2. **It matches the two buyer types** (§1.3): each practice page is a "front door" tuned to how that buyer evaluates (quantities+plant+statutory for UG; installed base+T&C+SLA for MEP).
3. **It keeps the nav honest and compact:** one Capabilities item instead of two competing top-level brands; Projects/Sectors/Company remain top-level because evidence-seeking (the dominant B2B journey — Phase 2 §19.1) is practice-agnostic.
4. **It preserves "one accountable partner"** — the shared-directors story (DOC A p8) is a genuine differentiator vs. two-practice competitors that are actually two firms; the homepage practices section (§6.4) tells this explicitly.
5. **Public labels drop internal jargon:** "Practice 01/02" stays as a *design motif* (numbered sections), but menu labels are plain: **"UG Utilities & Electrical"** / **"MEP, HVAC & Fire"** (short labels are drafts for client approval; the canonical names remain the DOC A p5 wordings).

### 2.3 Recommended top-level navigation

Desktop (sticky, hairline-bordered, translucent):

```
CAPEX wordmark
│ Capabilities ▾   Projects   Sectors   Company ▾        ✆ +91 98185 40532   [ Start a Project ]
```

- **Capabilities ▾ (mega-menu, 3 columns):**
  - Col 1 — `PRACTICE 01 · UG Utilities & Electrical` → practice page link + its 5–6 services
  - Col 2 — `PRACTICE 02 · MEP, HVAC & Fire` → practice page link + its 5–6 services
  - Col 3 — shortcuts: All Projects / Sectors / flagship project feature
- **Company ▾:** About · Team · Clients · Credentials · Careers (conditional)
- Mobile: accordion replicating the same structure; phone CTA pinned; no hamburger-hiding of the phone number (Indian B2B is phone-first — Phase 2 §19.8).

FACT: the current CMS nav mechanism (DB-driven `nav_items`) already supports this; only content and a mega-menu component are needed (Phase 2 §5).

### 2.4 URL structure & depth

```
/                            Homepage
/practices/{slug}            2 practice landing pages        (depth 1)
/services                    Services overview (grouped by practice)
/services/{slug}             ~11 service detail pages        (depth 2)
/projects                    Filterable project index
/projects/{slug}             Project Record / Case Study     (depth 2)
/sectors                     Sectors overview
/sectors/{slug}              3–5 evidence-backed sector hubs  (depth 2)
/about · /team · /clients · /credentials · /careers* · /contact   (depth 1)
/{slug}                      Generic CMS pages (privacy, terms, cookies, future landing pages)
```
- Max depth 2; breadcrumbs on detail templates; kebab-case slugs; no date-based URLs.
- *Careers route created but noindexed/linked only when active openings exist (else the route redirects to /about#careers).
- RECOMMENDATION: practice slugs short — `ug-utilities-electrical` and `mep-fire-protection` (draft).

### 2.5 Entity relationship model (the IA in one diagram)

```
                    PRACTICE (2)
                   /            \
              SERVICES (11)   (practice-scoped)
                   |            \
              PROJECTS (86 records) —— CLIENTS (relationship-typed)
                   |            \
              SECTORS (5–9)     CREDENTIALS / OFFICES / TEAM
```
A project is discoverable along every axis: Practice → Service → Sector → Location → Client. Full definitions in §5.

---

## 3. THE FUTURE SITEMAP — PAGE-BY-PAGE SPECIFICATION

Notation for each page: **Purpose · Audience · Primary content · Key sections · CTA · Related · CMS data required.**

### 3.1 Homepage — `/`
- **Purpose:** position Capex in 5 seconds; route the two buyer types; prove with evidence.
- **Audience:** all (first-visit dominant).
- **Content/sections:** the 13-band narrative in §6.
- **CTA:** "Explore projects" + "Start a project" (hero); phone header-wide.
- **Related:** both practice pages, /projects, /contact.
- **CMS:** `sections` (rendered from CMS — fixing the current hero-ignores-CMS defect, Phase 2 TD6), `content_items` for services/stats/why_us/process, projects (featured flag), clients, team (featured), settings.

### 3.2 About — `/about`
- **Purpose:** the company story, structure, and statutory identity in one credible page.
- **Audience:** all serious evaluators; candidates; journalists.
- **Content:** who Capex is (turnkey SITC model), incorporation 2012 → today timeline (only documented dates — [VERIFY: history 2012–2018 is a gap, Phase 1 §13.10]), the two-practices-one-team narrative (DOC A p8), delivery model, quality/safety commitments (the 5 documented safety procedures, DOC A p9), geographic presence (4 offices + Rajasthan unit [VERIFY: address missing, C-list] + 25 states/Nepal reach), leadership summary.
- **Sections:** story → practices summary → delivery model → safety & quality → presence → leadership teaser.
- **CTA:** "Meet the team" / "See credentials".
- **Related:** /team, /credentials, practice pages.
- **CMS:** `pages` (longform body) + `sections` + team/office items.

### 3.3 Practice landing pages — `/practices/{slug}` ×2
- **Purpose:** the front door for each practice; each is a complete mini-story tuned to its buyer (§1.3).
- **Audience:** practice-specific buyers and evaluators.
- **Content (Practice 01):** scope narrative (UG utilities, HT/LT cable laying, CGD, LMC, substations — DOC A §2/DOC C), owned plant & equipment (Drillto HDD fleet w/ tonnages, Phase 1 §2.4 — quantities [VERIFY: table pairing ambiguous]), smart-city/metro credentials, project highlights (Patna 150 km, Banaras 180 km, Lucknow Metro 220 kV, Aurugram 165 km, Sangli 5,000 connections), safety regime, statutory standing.
- **Content (Practice 02):** scope narrative (HVAC, VRV, clean rooms, fire fighting, MEP — DOC A §3/DOC B), installed base (54 HVAC / 22 fire), flagship WTT 4,000 TR story, the 10 testing & commissioning services, after-sales service model (SLAs, escalation matrix, 2-person crews — DOC B p3), sectors served.
- **CTA:** "Discuss a project" (practice-aware enquiry routing) + "Explore {practice} projects".
- **Related:** its services, /projects?practice=…, /team?practice=….
- **CMS:** new `practices` entity + related content_items + projects.

### 3.4 Services overview + Service detail — `/services`, `/services/{slug}` (~11 pages)
- **Purpose:** depth per capability — where technical credibility is earned (Phase 2 G6).
- **Audience:** evaluators matching a need to a capability.
- **Content per service:** overview (from PDF scope text), what's included (bullets from PDFs), equipment/standards where documented (e.g., NBC codes for fire — only where the current site copy already claims it and the client confirms [VERIFY]), related projects (auto-listed via relations), related sectors, enquiry CTA.
- **CTA:** "Enquire about {service}".
- **CMS:** `services` collection extended with `practice_id`, capability bullets, related links auto-derived.
- RECOMMENDATION — launch set (all PDF-substantiated): *Practice 01:* UG HT/LT Cable Laying · CGD Networks (MDPE/Steel) · LMC Works · 33/11 kV Substation Construction · HDD & Trenchless Works. *Practice 02:* HVAC Systems · VRV Systems · Fire Fighting & Hydrant Systems · Clean Rooms (Hospital) · MEP Services · Testing & Commissioning (10 services as one page or page section — draft).
- [VERIFY: Solar Power Generation & Open Access — cover-only (C19). Do NOT build service pages until the client confirms these are real offerings; the current site's Solar card is unsupported.]

### 3.5 Sectors overview + Sector hubs — `/sectors`, `/sectors/{slug}`
- **Purpose:** entry by industry — how B2B buyers search (Phase 2 §19.1); SEO surface.
- **Audience:** buyers framing need by market ("hospital MEP contractor", "smart city CGD").
- **Content:** overview page lists all sectors honestly (with "evidence level" implicit — substantiated hubs vs. plain list entries). Hub pages aggregate: sector narrative (short), capability fit, representative projects (auto), representative clients (auto), CTA.
- **RECOMMENDATION — launch hubs (multi-project evidence, Phase 1 §3–4):** Smart-City & Metro Infrastructure · Oil, Gas & CGD Utilities · Corporate & Commercial Real Estate. **Second wave (service-led, some named evidence):** Healthcare & Hospitals · Industrial & Manufacturing · Education. **List-only (no hub yet):** hospitality, residential townships, retail/malls (folded into Commercial hub copy), public sector.
- **CMS:** `industries` collection (public label "Sectors") + relations.
- **Guardrail:** a hub page never ships without ≥3 linked projects or an explicit service-led framing — thin-content risk is the top SEO risk here (§13.17).

### 3.6 Projects index — `/projects`
- **Purpose:** the evidence library — the strongest sales asset (Phase 2 G2).
- **Audience:** all evaluators; the single most important page for repeat visitors.
- **Content:** full §4 specification (listing, filters, search).
- **CTA:** per-tile view; persistent "Start a project".
- **CMS:** `projects` with structured relations/metrics.

### 3.7 Project detail — `/projects/{slug}` (~86 eventually)
- **Purpose:** proof at the individual level. Two templates (§4.4–4.5).
- **CMS:** `projects` (structured fields + gallery).

### 3.8 Team — `/team`
- **Purpose:** show the real organization (22 named people, Phase 1 §9) — currently zero on site (Phase 2 G4).
- **Audience:** evaluators, candidates.
- **Content:** directors (3) + patron + financial advisor (leadership band, larger treatment), senior delivery (practice-scoped groups), site & design engineers (name-wall treatment, not fake bios), with practice filter chips.
- **CTA:** "Talk to our team" → contact.
- **CMS:** `team` collection + `practice_id`.
- [VERIFY: all title/experience conflicts C1–C7 must be resolved by the client before publication; the site ships only client-confirmed bios. Photos: none exist in PDFs — request (§10.2).]

### 3.9 Clients & relationships — `/clients`
- **Purpose:** trust wall with meaning — grouped, relationship-typed, not a logo dump.
- **Audience:** all evaluators.
- **Content:** categories from DOC A p6 (IT · Corporates · Oil & Gas · Builders/Developers) + relationship types (client / PMC / architect association — merging the DOC B p2 PMC list, [VERIFY: "empanelled" wording vs "associated" — Phase 2 §12]); logos where permitted, name + linked projects where not.
- **CTA:** "Trusted on X projects" → /projects.
- **CMS:** `clients` + `relationship` + `permission_status` fields; logo migration off Lovable paths (Phase 2 TD8).
- [VERIFY: legal permission to display each logo — Phase 2 §19.6; logos shown without confirmed permission should render as text names (graceful fallback already exists, Phase 2 §6).]

### 3.10 Credentials — `/credentials`
- **Purpose:** make "compliance you can verify" literal (Phase 2 G3) — a page Indian PSU/utility buyers genuinely use.
- **Audience:** procurement, vendor-empanelment teams.
- **Content:** statutory register (CIN, PAN, Udyam, GST×5 with states, ESI — Phase 1 §8) each with registry number and certificate scan (media library); ISO 9001:2015 [VERIFY: issuing body/certificate absent — C-list]; memberships/badges shown as memberships only, not certifications, until substantiated (Phase 1 §6).
- **CTA:** "Request verification documents" (enquiry with credential routing).
- **CMS:** new `credentials` entity (category: statutory/quality/membership; scan via media).

### 3.11 Careers — `/careers` (conditional)
- **Purpose:** recruiting surface — only when real openings exist.
- **Content:** if openings: listings from `careers` collection. If none: honest evergreen panel on About instead ("We are always looking for site engineers…"), no fake listings, no "[Placeholder]" text (currently live — Phase 2 §3).
- **CMS:** `careers` items; page exists only when `count(active) > 0`.

### 3.12 Contact — `/contact`
- **Purpose:** conversion hub + offices.
- **Audience:** all.
- **Content:** enquiry form (practice/service-aware dropdown generated from the services collection — fixing the current three-way duplication, Phase 2 TD7), both documented phone numbers [VERIFY: active set — Phase 2 §18.7], email, corporate + branch offices + Rajasthan unit ([VERIFY: address, Phase 1 §13.7]), map embeds, business hours (currently missing — request, §10.2), named BD contact (Sachin Jamdhade, BDM — Phase 1 §9.1; only with client approval).
- **CMS:** `offices` entity + settings + form routing map.

### 3.13 Legal — `/{slug}` (footer only)
- Privacy, Terms, Cookies. RECOMMENDATION: keep footer-only, keep the generic `pages` route, and do not publish any policy containing "[Placeholder]" (currently live — Phase 2 §3). Legal review required before launch (§10.1). [VERIFY: jurisdiction disclaimer seat — C23.]

### 3.14 Pages that should NOT exist (and why)

| Page | Why not |
|---|---|
| News / Insights / Blog | No content, no editorial capacity (Phase 2 §6). Defer 6–12 months; reinstate as "Insights" only with a named owner. |
| Partners/PMCs (separate) | Merged into /clients as relationship types — separate page would be a thin re-list of DOC B p2. |
| Subsidiaries | Phase 1 §7: none exist. Current CMS collection stands empty (Phase 2 §6). Remove the concept. |
| Individual office/location pages | A contact-page offices module carries it; 5 locations don't justify 5 URLs. |
| Per-person team pages | Thin bios; one team page with expandable profiles. |
| Standalone FAQ page | FAQs live contextually (contact page, practice pages). |
| "Testimonials" section | Keep the CMS entity dormant; render nothing until real, approved quotes exist (Phase 2 §12 — current three are invented and must not relaunch). |
| Site-wide search | Project search first; site search deferred (P2). |
| Solar / Open Access service pages | [VERIFY: C19] — cover-only claims; do not build until confirmed. |

---

## 4. PROJECT EXPERIENCE — THE STRONGEST PART OF THE SITE

### 4.1 Inventory of what the evidence actually supports

FACT (Phase 1 §4): **86 documented project records** — 10 UG utility records (4 completed + 6 running, DOC C p8), 54 numbered HVAC entries (DOC B pp.8–9), 22 fire installations (DOC A p17). Caveats preserved: the HVAC and fire lists overlap heavily (e.g., WTT appears in both), so the unique-project count is lower and needs client confirmation [VERIFY: total count is a stated gap, Phase 1 §4.5]; Gurugram 60 km appears in both completed and running tables [VERIFY: C13]; ONE INDIA is double-listed [C14]; no project values, no dates, no durations exist anywhere [Phase 1 §4.5].

**Consequence (RECOMMENDATION):** the project system must be able to ship **all 86 records honestly** without pretending each is a rich case study. Hence two templates (§4.4–4.5) — this is the single most important content-model decision in this phase: *depth where evidence exists, record-grade honesty everywhere else, zero fabrication.*

### 4.2 Projects listing — `/projects`

**Layout:** an editorial index, not a card wall. Two interleaved tile sizes: featured (large, image-led) and standard (compact, data-led). Each tile shows: project name, client (where publishable), location (city, state), primary quantity metric (styled large — §7.3), practice tag, service tags, status (Completed/Ongoing).

**Filters (left rail desktop / sticky drawer mobile):**
- **Practice** (2) — the primary lens
- **Service** (from the §5.2 taxonomy)
- **Sector** (from §5.3)
- **Location** (state; evidence exists for UP, Bihar, Haryana, Maharashtra, Delhi, Rajasthan, Karnataka — Phase 1 §4)
- **Status** (Completed / Ongoing — matching DOC C's own split)
- **Search:** free-text over project name + client name.

**Behavior:** URL-synced filters (`?practice=ug&sector=smart-city`) for shareable/SEO-able facet views; result count via `aria-live`; each facet combination renders an honest heading ("UG Utilities projects in Bihar — 3 projects"); empty states explain what exists instead ("No fire-protection projects in Maharashtra yet — see HVAC work in Noida").

**Interaction:** 250ms fade/reflow on filter change; hover: image scale 1.03 + metric emphasis + arrow nudge (§8).

### 4.3 Project metadata model (content model, not DB spec)

| Field | Notes |
|---|---|
| title, slug | kebab-case, unique |
| practice_id | required — one of 2 |
| service_ids[] | 1+ from §5.2 |
| sector_ids[] | 0+ from §5.3 |
| client_id / client_display | nullable + publishable flag (some clients may not be nameable; residential individuals from DOC B should default to name-suppressed [client decision]) |
| location_city, location_state | from project tables |
| status | completed / ongoing (DOC C split; [VERIFY: "running" projects are from July-2022 documents — confirm current status]) |
| scope_summary | exact PDF wording (e.g., "150 KM 11&33 KV cable laying") |
| metrics[] | structured: {label, value, unit} e.g., {capacity, 4000, "TR"} — powers the quantity-led design and the stats aggregation |
| template | A (record) / B (case study) — §4.4–4.5 |
| images[] | gallery; brochure photography; graceful no-photo treatment |
| completion_year | optional — mostly MISSING [do not fabricate; Phase 1 §4.5] |
| featured | powers homepage/projects hero tiles |
| verification_status, source_ref | §9.6 workflow — every record cites its PDF page |

### 4.4 Template A — "Project Record" (minimum, fits all 86)

A deliberately-designed, database-grade page — honest and still premium:
- **Title block** (drawing-sheet style, §7.2): project no. / practice / location / status / client.
- **Primary image** (or an engineered no-photo treatment: faint survey-grid + title block only — designed absence, not broken images).
- **Scope line** (exact from PDFs).
- **Metrics strip** (structured quantities, tabular numerals).
- **Tags:** services, sector, practice.
- **Related:** same-client projects, same-sector projects.
- **CTA:** "Discuss similar work".

### 4.5 Template B — "Case Study" (enhanced, only where evidence supports)

FACT: the PDFs support deeper narrative for only a handful — WTT 4,000 TR (largest single HVAC installation, integrated hydrant/sprinkler — DOC A p16), World Trade Park 2,400 TR, Patna/Banaras/Lucknow Metro smart-city programs, Aurangabad 165 km, Sangli 5,000 connections. Everything else is record-grade.

Case study adds (only from documented material + client-supplied narrative in §10.2):
- Overview narrative (client-supplied or approved draft — **draft** structure: context → scope delivered → technical highlights → outcome status).
- Scope breakdown by system/service.
- Technical metrics table (TR / kV / KM / connections / tonnage).
- Image gallery (lightbox, keyboard-navigable, alt text from captions).
- Client quote **only if** a real, approved quote is collected (§10.2) — never invented.
- Related projects + related service/sector pages.

**Rule:** CMS enforces template B only when its required narrative blocks are non-empty; editors cannot half-publish a case study (§9.6).

### 4.6 Storytelling discipline

RECOMMENDATION: do NOT force challenge/solution/result onto 86 records. The PDFs' own language is scope-and-quantity ("150 KM 11&33 KV cable laying", "5000 House & Industries connection") — the site's distinctive voice is **the language of execution**: what was built, how much, for whom, where. The 5–10 flagship case studies can carry narrative depth; the rest carry precise records. This is both honest and, per the differentiation strategy (§12.1), a design signature rather than a compromise.

---

## 5. PRACTICE → SERVICE → SECTOR → PROJECT — THE TAXONOMY

### 5.1 The relationship model

```
PRACTICE (2)
 └── SERVICES (11)  [each belongs to one practice; MEP and T&C flagged as cross-practice]
      └── SECTORS (5–9)  [cross-cutting: sectors aggregate projects from both practices]
           └── PROJECTS (86)  [each: one practice, 1+ services, 0+ sectors, one client, one location]
                └── CLIENTS (~40, relationship-typed)
```
Example discovery path (all real): Practice 01 → Service "UG HT/LT Cable Laying" → Sector "Smart-City & Metro Infrastructure" → Location "Patna" → **Patna Smart City Electrical Work — 150 km 11/33 kV — L&T**.

### 5.2 Service taxonomy — strictly from the PDFs

**Practice 01 — UG Utilities, Electrical & CGD** (DOC A §2, DOC C):
1. UG HT/LT Cable Laying (11/33/220 kV; trenching, ducting, jointing, reinstatement)
2. CGD Networks — MDPE & steel mains (incl. HDPE/MDPE pipeline installation)
3. LMC Works — last-mile connectivity (house & industry connections)
4. 33/11 kV Substation Construction & Erection
5. HDD & Trenchless Works (Drillto fleet, 32 t pullback)

**Practice 02 — MEP, Fire Fighting & Fire Protection** (DOC A §3, DOC B):
6. HVAC Systems (chillers, AHU, ducting)
7. VRV / VRF Systems
8. Fire Fighting & Hydrant / Sprinkler Systems
9. Clean Rooms — Hospital
10. MEP Services *(FACT: MEP is listed under both practices in DOC A p5 — treat as shared; page states it serves both [no conflict to resolve, it's a stated dual membership])*
11. Testing & Commissioning (10 named services, DOC A p15) — cross-practice by nature

Supporting capabilities (not separate service pages, but content blocks within practice/service pages): Plant & AHU Operation (after-sales), CADD/Design, SLA service model.

[VERIFY: Solar Power Generation & Open Access Service — excluded from taxonomy until C19 is resolved.]

### 5.3 Sector taxonomy — evidence-led

| Sector | Evidence basis | Launch form |
|---|---|---|
| Smart-City & Metro Infrastructure | Patna, Banaras, Lucknow Metro, Gurugram, Dhanbad (DOC C p8) | **Hub (P0)** |
| Oil, Gas & CGD Utilities | Aurangabad, Sangli; BGRL, IGL, BPCL, AG&P, Purba Bharati (Phase 1 §3) | **Hub (P0)** |
| Corporate & Commercial Real Estate | 50+ HVAC/fire corporate clients; malls, offices (DOC B pp.8–9; DOC A p14) | **Hub (P0)** |
| Healthcare & Hospitals | Sector stated + clean-room service; no named hospital projects (Phase 1 §3) | Service-led page (P1) |
| Industrial & Manufacturing | Apollo Pipes, United Transformers, "Manufacturing Plants" sector | Hub (P1) |
| Education | Pearson (2 records), "Educational Institutions" sector | List entry (P2) |
| Hospitality, Residential, Retail, Public Sector | Sector lists only | List entries (P2) |

### 5.4 Location taxonomy

FACT-documented project locations only: Uttar Pradesh (Noida, Lucknow, Varanasi), Bihar (Patna, Dhanbad), Haryana (Gurugram), Maharashtra (Aurangabad, Sangli/Satara), New Delhi, Rajasthan (Jaipur), Karnataka (Bangalore). The 25-states + Nepal claim (DOC A p19) appears as a *reach* element (About presence strip) — RECOMMENDATION: worded as "project reach", with a pinned project map deferred until geo data is verified [VERIFY: most listed states have no shown project — Phase 1 §15; do not imply delivered projects in unproven states].

---

## 6. HOMEPAGE STRATEGY — THE NARRATIVE SEQUENCE

Not pixels — the argument, in order, tuned to how evaluators actually read (evidence-seeking first, services second). Every band states: why it exists · what it communicates · visual treatment · interaction · CMS data.

| # | Band | Why / what it communicates | Treatment & interaction | CMS data |
|---|---|---|---|---|
| 1 | **Hero** | Positioning in 5s (§1.1); kills the current empty-carousel failure | Full-bleed real photography (HDD rig / WTT plant — brochure assets), gradient scrim, large display type; **no carousel** — one decisive image (or restrained cross-fade at >8s, pausable) | `sections.hero` (**must render — current code ignores it**, TD6) + settings eyebrow |
| 2 | **Trust strip** | Instant credibility via recognized names | Quiet logo marquee (pause on hover/focus; reduced-motion → static row; fixed off-platform URLs, TD8) | `clients` (featured subset) |
| 3 | **Positioning statement** | Who Capex is: turnkey SITC, est. 2012, two practices, one team | Editorial statement, large type, generous whitespace; single "About →" text link | `sections.about` |
| 4 | **The Two Practices** — signature section | The company's defining structure, finally visible; routes each buyer type | Split diptych (two half-panels, numbered `01`/`02`), each with 3-line scope, 2 quantities, entry CTA; hover: subtle panel lift | `practices` entity |
| 5 | **Selected projects** | Proof before promises; the quantity-led hook | 4–6 flagship tiles (featured flag), metric as the typographic hero; link "All projects →" | `projects` (featured) |
| 6 | **Delivery model** | The 5-stage turnkey process (SITC + after-sales — traces to PDFs) | Compact horizontal stepper, numbered in mono; no card grid | `process` collection |
| 7 | **Technical depth markers** | Owned plant + T&C rigor = engineering-led credibility | "Instrument panel" band: 32 t HDD pullback · 33/11 kV substations · 10 T&C services · 22 fire systems; mono numerals, hairline rules | `sections` extras (validated schema) + `why_us` |
| 8 | **Sectors index** | Entry by market; SEO surface | Compact typographic index (not icon cards), each linking to hub/list | `industries` |
| 9 | **Numbers** | Verified scale, displayed honestly | Large animated counters (once, reduced-motion-safe); **only documented stats** — see stat policy below | `stats` (each row verification-gated, §9.6) |
| 10 | **Clients** | Breadth + categories with meaning | Grouped logo/name wall (4 categories from DOC A p6) → /clients | `clients` + `categories` |
| 11 | **Leadership** | A real, named organization | Directors + patron band (photos pending §10.2), one line each → /team | `team` (leadership) |
| 12 | **Credentials strip** | Statutory substance; procurement buyers scan for this | Registry-number strip (CIN · Udyam · GST×5 · ESI · ISO [pending verification]) → /credentials | `credentials` |
| 13 | **Contact band** | Conversion | Split: form (practice-aware) + phone-first panel with both numbers | `sections.contact`, `offices`, settings |

Newsletter remains footer-only (not a homepage band).

**Stat policy (RECOMMENDATION, resolves nothing silently):** the homepage band uses only documented figures, each with its caveat resolved or reworded before launch: `54 HVAC installations` (DOC B) · `22 fire protection systems` (DOC A p17) · `5,000+ gas connections` (DOC C p8) · `25 states & Nepal — project reach` (DOC A p19). "150+ projects", "315+ KM", and "10+ years" (C9) are **not** used until the client approves exact wording [VERIFY: Phase 2 §12; sum of documented scopes is ~625–685 km depending on the C13 dedup — any KM figure needs the client's own number].

---

## 7. VISUAL DIRECTION

### 7.1 What to retain as brand DNA vs. modernize

| Source | Disposition |
|---|---|
| Current site's navy + amber token system (`styles.css`: navy `oklch(0.28 0.09 262)`, engineering blue, warm accent) | **RETAIN** — coherent, premium-industrial; more consistent than any brochure (Phase 2 §7) |
| DOC C amber/gold accent (≈ #e0a000) | **RETAIN** — it's the brand's warm accent; nudge the current orange accent slightly warmer to align (direction, final values in Phase 4 style tile) |
| DOC A purple-violet | **RETIRE** — off-brand vs. both the site system and DOC C; keep out of the palette |
| DOC B lime-on-dark-teal | **RETIRE** — legacy profile identity; at most a distant echo inside Practice 02's page as a secondary data color (optional, P2) |
| "CAPEX" wordmark + "Construction & Engineering Pvt. Ltd." lockup | **RETAIN** ([VERIFY: final naming decision — CAPEX vs "Capex Engineering" vs "CCEPL", Phase 1 §1; the site must not use "CCEPL" unless the client adopts it]) |
| Space Grotesk + Inter pairing | **RETAIN** (add mono, below) |
| Drawing/blueprint sensibility of the brochures (numbered sections, technical captions, spec tables) | **RETAIN & ELEVATE** — becomes the signature motif (§7.2) |

### 7.2 The signature concept — "Drawing Sheet"

The one visual idea that makes the site feel *engineering-led* rather than *decorated*: page and section headers styled as **engineering drawing title blocks** — a hairline-boxed strip with mono-typed fields (`SECTION 02 / PRACTICE 01 / PATNA, BIHAR / STATUS: COMMISSIONED`), numbered sections (`01…13`), survey-grid background texture on bands, and tabular numerals everywhere quantities appear. It is native to the audience (procurement engineers read title blocks daily), cheap to build (pure CSS), and impossible for a template competitor to fake meaningfully. Applied to: section headers, project Record pages, filter rails, credentials table.

### 7.3 System specification (direction, finalized as a style tile in Phase 4A)

- **Typography:** Space Grotesk display (keep), Inter body (keep), + a technical mono (e.g., IBM Plex Mono / JetBrains Mono) reserved for metrics, coordinates, title blocks, section numbers. Display sizes larger and sparser than current (hero 64–96px desktop); tight tracking on display; tabular numerals for all data.
- **Color:** navy foundation, engineering-blue primary actions, **amber as the scarce signal color** (section numbers, key metrics, single primary CTA per view) — scarcity is what makes it read premium. Off-white surfaces, hairline borders (1px), no decorative gradients beyond photo scrims.
- **Grid:** 12-col, ~1440px max container; asymmetric splits (7/5, 8/4) on editorial pages; 96–160px vertical section rhythm; consistent gutter discipline.
- **Photography:** real project photography from the brochures (HDD rigs, substation erection, WTT chiller plant, hydrant headers — Phase 1 §2.5); cool/neutral grading with navy cast; duotone-navy for band backgrounds; technical captions with location/scope. **No stock imagery for capability claims** — current 6 stock hero images replaced (incl. solar imagery, [VERIFY: C19]); where no real photo exists, the designed no-photo treatment (§4.4) is used honestly.
- **Iconography:** 1.5px-stroke line icons from a curated Lucide subset (fixes the full-library import, TD11); one icon per service, none decorative.
- **Cards:** hairline border, white surface (light) / glass (navy bands), 8px radius (existing `--radius`), image-top, generous internal padding, minimal shadow.
- **Buttons:** solid engineering-blue primary; amber reserved for the single signature CTA per page ("Start a Project"); quiet secondary (hairline); text links with arrow nudge on hover.
- **Navigation:** translucent sticky header with hairline bottom border + backdrop blur; mega-menu per §2.3; active-section awareness; mobile accordion with pinned phone CTA.
- **Section transitions:** alternating light/navy bands (existing band rhythm retained); hairline rules + mono section numbers at each transition — rhythm without decoration.
- **Borders/surfaces:** hairlines everywhere, no drop-shadow layering; elevation reserved for overlays (menu, lightbox, filter drawer).
- **Data visualization:** no charts at launch — quantities as **instrument-panel typography** (large mono numerals + units + hairline rules + tick marks). If charts arrive later (e.g., TR mix), minimal single-axis style.
- **Project presentation:** quantity-led tiles and title blocks per §4; images support, never replace, the data.
- **Hover states:** image scale 1.02–1.05, arrow nudge, metric color-shift to amber — 200–250ms ease-out, uniform site-wide.
- **Scroll behavior:** native smooth scroll (existing), sticky elements only (nav, filter rail); no scroll-jacking.

---

## 8. INTERACTION & MOTION STRATEGY

Test applied to every candidate: *does it support hierarchy, storytelling, or usability? If only "it looks impressive," it's out.*

| Candidate | Verdict | Adaptation & rules |
|---|---|---|
| Project hover previews | **ADOPT (P0)** | Image scale ≤1.05, metric emphasis, arrow nudge; 250ms; never reflow layout |
| Filtering transitions | **ADOPT (P0)** | 250ms fade/slide reflow on /projects; `aria-live` count; URL-synced facets |
| Animated counters (metrics band) | **ADOPT (P0)** | Once per view, 600–900ms staggered; disabled under `prefers-reduced-motion`; values are documented stats only |
| Sticky section navigation | **ADOPT (P0)** | Sticky nav + active-section highlight (fixes Phase 2 §13 gap) |
| Subtle image reveals | **ADOPT (P1)** | Single 12px fade-rise on section entry, once; reduced-motion off |
| Gallery lightbox | **ADOPT (P1)** | Keyboard navigable, focus-trapped, alt text from captions (case-study template only) |
| Sticky practice filter rail | **ADOPT (P1)** | Desktop rail / mobile drawer on /projects and /team |
| Horizontal project gallery | **DEFER (P2)** | Only inside case-study heroes, simple, reduced-motion aware |
| Map/geographic visualization | **DEFER (P2→Phase 5)** | Needs verified geo data; ship the typographic reach strip first |
| Scroll-driven storytelling | **DEFER** | High production cost, low evidence volume; revisit after content depth grows |
| Page transitions | **OPTIONAL (P2)** | Light fade only if free; no slide/parallax |
| Cursor interactions | **REJECT** | Gimmicky for B2B evaluators; accessibility liability |
| Autoplay video hero | **REJECT (for launch)** | Perf + taste; the unused `hero-work.mp4` (TD5) is deleted or parked for a muted loop P2 test |
| 3D / heavy parallax | **REJECT** | Wrong register for a credibility-driven site |

Global rules: every animation honors `prefers-reduced-motion` (currently missing — Phase 2 §7 a11y gaps); marquee pauses on hover/focus and degrades to a static grid; FAQ accordion gets proper `aria-expanded`/`region` semantics; motion budget ≤400ms per interaction; no layout-shifting animation above the fold.

---

## 9. CMS / CONTENT ARCHITECTURE

Phase 2 established the platform is worth keeping (TanStack Start + Supabase generic-collections CMS, RLS-guarded). This section defines the **content model** — entities, relationships, editorial workflow — not the database implementation.

### 9.1 Entities — relational vs. flexible

| Entity | Model | Rationale |
|---|---|---|
| **Practice** (new) | Relational (2 rows) | First-class: name, short label, slug, narrative, key stats, hero image, related content auto-assembled |
| **Service** | Relational (evolve `services` collection) | + `practice_id`; overview, capabilities[], equipment refs; detail pages |
| **Sector** | Relational (evolve `industries`; public label "Sectors") | + evidence level; hub pages assemble from relations |
| **Project** | Relational (evolve `projects` with structured fields per §4.3) | The evidence core; relations to practice/services/sectors/client; template A/B |
| **Client** | Relational (evolve `clients`) | + relationship type (client/PMC/architect/association), category (DOC A p6 groups), practice affinity, `permission_status` for logo display |
| **Team member** | Relational (evolve `team`) | + `practice_id`, group (leadership/delivery/design), confirmed-bio flag |
| **Credential** (new) | Relational | category (statutory/quality/membership), issuer, registry no., scan (media), `verified` flag |
| **Office** (new) | Relational | type (corporate/branch/manufacturing), address, phone, map embed, primary flag |
| **Testimonial** | Keep, **dormant** | Renders nothing until `approval_status = approved` and a real source exists |
| **FAQ** | Keep | + context tags (contact / practice / service) for contextual placement |
| **Career opening** | Keep | Page/route renders only when active count > 0 |
| **Pages** (policies, longform) | Keep flexible | Generic `pages` route already works |
| **Sections** | Keep + schema-validated `extra` | Per-section-key Zod schemas shared by admin form and public renderer — kills the raw-JSON textarea (TD9) and the unvalidated-JSON risk (S3) |
| **Nav items, settings, categories, media, submissions, subscribers** | Keep | Working (Phase 2 §5) |
| **Subsidiaries** | **REMOVE concept** | None exist (Phase 1 §7); empty collection confuses editors |
| **Blogs/Articles** | **HOLD** | Entity retained in schema, no public surface, no nav, revisit in 6–12 months |
| **Process / why_us / stats** | Keep as validated section content | Presentation lists, not entities |

### 9.2 Relationship diagram (content model)

```
practices 1──n services            clients n──n projects (via project.client)
practices 1──n projects            sectors n──n projects
services  n──n projects            team    n──1 practices
credentials standalone (+media)    offices  standalone
media      referenced by all (images, logos, scans)
```

### 9.3 Editorial workflow (the operational fix for Phase 2's credibility leaks)

- Every project/credential/stat row carries **`verification_status`** (`verified` / `unverified` / `needs-client`) and **`source_ref`** (e.g., "DOC C p8").
- Public renderers **exclude** `needs-client` rows entirely; `unverified` rows render only in admin.
- Testimonials additionally require `approval_status` + source — the invented-testimonials failure (Phase 2 §6) becomes structurally impossible.
- This operationalizes the Phase 1 conflict register instead of leaving it in a document.

### 9.4 Admin UX implications (for Phase 4)

Structured per-section forms replace the JSON textarea; project editor gets metric rows, relation pickers, template A/B switch with required-field enforcement; client editor gets relationship/permission fields; icon picker constrained to the curated map; slug collision handling. Editors are likely non-technical (Phase 2 §19.10) — every field is a labeled input, never JSON.

### 9.5 Data-fetching architecture implication (content-level requirement)

The public site must move from one monolithic payload + 5s polling (TD1) to **per-route payloads with sane caching** (server-side cache on `getSiteData`-successors; client `staleTime` ≥ 5 minutes; explicit revalidation on admin publish). Exact mechanism is a Phase 4 technical decision; the content-model requirement is: *each page type can fetch only its own slice* (practice page does not download 56 clients).

### 9.6 Media pipeline requirement

All imagery (logos, project photos, certificate scans) migrates into the existing media library + proxy (currently built and unused — TD17), eliminating the `/__l5e/…` platform coupling (TD8) and enabling the credentials page's scans.

---

## 10. CONTENT REQUIREMENTS — CLIENT CONTENT & VERIFICATION CHECKLIST

### 10.1 REQUIRED BEFORE LAUNCH (hard gates)

| # | Item | Status / Conflict |
|---|---|---|
| 1 | **Brand naming decision:** CAPEX vs "Capex Engineering" vs "CCEPL" across site, wordmark, SEO titles | Phase 1 §1 — "CCEPL" appears in no source document |
| 2 | **Corporate address:** 3 variants exist (profile: Jaypee Kosmos Sector-134 201304; certificates: Jaypee Greens 201301; current site: Bhutani Alphathum Sector 90 — matches none) | C10 + Phase 2 §18.1 — site must ship one verified address |
| 3 | **Phone set:** two documented numbers; current site shows one | Phase 2 §18.7 |
| 4 | **Solar Power Generation & Open Access:** real offerings or remove everywhere (incl. hero imagery, contact options) | C19 + Phase 2 §12 |
| 5 | **Clean Rooms:** restore as service card (PDFs substantiate it; the current site replaced it with Solar) | Phase 2 §4/§6 |
| 6 | **Homepage stats:** approve exact figures + wording (documented-only set in §6; "150+/315+/10+ years" not usable as-is) | Phase 2 §12; C9 |
| 7 | **Testimonials:** confirm removal of all three invented items; approve any real replacements (with named sources) | Phase 2 §6 |
| 8 | **"Wedream" / "We dream, design & deliver":** confirm retirement of all "dream" wording | C12 + Phase 2 §12 |
| 9 | **Policy pages:** legal-reviewed privacy/terms/cookies (no "[Placeholder]" text at launch) | Phase 2 §3 |
| 10 | **Hero headline & positioning line:** approve draft copy (§1.1) | — |
| 11 | **Project statuses:** confirm current completed/ongoing status of the 6 "running" UG projects (documents are from July 2022) | Phase 1 §4.2; C13 |
| 12 | **Client logo permissions:** confirm display rights or fall back to name-only per client | Phase 2 §19.6 |
| 13 | **ISO 9001:2015:** provide issuing body + certificate scan, or present as "ISO 9001:2015 (certificate on request)" | Phase 1 §8 |
| 14 | **Empanelment wording:** "associated with" (DOC B) vs "empanelled with" (current site) — pick the legally accurate term | Phase 2 §12 |
| 15 | **Disclaimers:** brochure jurisdiction ("Jaipur Jurisdiction" — C23) — decide what, if anything, the website carries |
| 16 | **Branch offices & Rajasthan unit:** confirm current status of Patna/Gurugram/Sangli offices + manufacturing unit (address, activity) | Phase 2 §18.9; Phase 1 §13.7 |

### 10.2 REQUIRED FOR PREMIUM PRESENTATION (before or shortly after launch)

1. **High-resolution original photography** from the brochures (HDD fleet, substations, WTT/WTP plants, hydrant rooms) — request source files from the company (current PDFs are raster; re-extraction is a fallback).
2. **Team headshots** — directors + patron at minimum.
3. **Flagship case-study narratives** — short client-supplied or approved write-ups for WTT 4,000 TR; World Trade Park; Patna/Banaras/Lucknow Metro; Aurangabad; Sangli (feeds Template B, §4.5).
4. **Project completion years** where the client can supply them.
5. **Real client quotes** (if any client will provide one on record).
6. **Business hours + named enquiry contact** (BDM is documented — Phase 1 §9.1; publish only with approval).
7. **Commissioned photography of one active site per practice** (launch-adjacent; the single highest-value content investment).
8. **Vision/mission statements** if the company wants them (currently absent — Phase 1 §10; the site works without them, using documented commitments).

### 10.3 OPTIONAL FUTURE CONTENT

Workforce size · total client/project counts (if the company computes them) · project values (rare in Indian EPC marketing; only if policy changes) · awards/licenses/contractor registrations · CSR/sustainability substance (currently badge-only — Phase 1 §10) · Insights articles (with a named owner) · video (muted loop or facility tour) · social profile URLs (only "Facebook — Capex Engineering" exists, DOC B back cover — verify handle) · site-wide search.

### 10.4 CLAIMS REQUIRING VERIFICATION (consolidated register — no silent resolution)

All 25 Phase 1 conflicts (C1–C25) remain open until the client resolves them; the load-bearing ones for the website, with their blocks:

| Claim | Conflict | Website consequence if unresolved |
|---|---|---|
| Sanjay Sharma 25 vs 20 yrs; Anurag Parashar 14 vs 11 yrs; Malkit/Malkiyat Singh spelling; title variants (Director vs Director: Projects etc.) | C1–C7 | Team page cannot publish bios — ship name+role only |
| "10+ years" vs 2012 incorporation | C9 | Not used in stats band |
| Gurugram 60 km completed AND running | C13 | UG project list shows both entries marked "packages — status to confirm" or merges per client instruction |
| ONE INDIA double-listed | C14 | HVAC list shows one entry pending clarification |
| Fire "05 cities served" vs Bangalore HVAC job | C17 | Practice 02 page says "6 cities" only if client approves the recount, else quotes the documented claim with its original wording |
| States-served list incl. Nepal + non-standard spellings | C21 | Reach strip uses corrected spellings, "project reach across India & Nepal" framing |
| "Prestigious clients" logos with no stated relationship (Infosys, Cadence, THINK GAS, Eldeco, Paras…) | Phase 1 §5.6 | Logo wall shows only clients the company confirms; others move to name-list or are dropped |
| Stats "150+ projects", "315+ KM" | Phase 2 §12 | Replaced by documented stats (§6) |

---

## 11. BENCHMARK PATTERNS — DISTILLED & ADAPTED

Format: **pattern → why it works → adopt? → how Capex adapts it → priority.**

1. **Project-first navigation** (Turner "Our Projects", DPR "View Projects") → Evidence is what B2B buyers seek first → **ADOPT** → Projects is a top-level nav item and the homepage's proof band; all other pages cross-link into it → **P0**.
2. **Market/service taxonomy in nav** (AECOM Markets+Services; Arup Markets) → Mirrors how buyers frame needs → **ADOPT** → Capabilities mega-menu = practices + services; Sectors separate; taxonomy strictly PDF-derived (§5) → **P0**.
3. **Mega menus** (Bechtel, AECOM) → Expose depth without overwhelming the bar → **ADOPT** → 3-column practice-grouped menu (§2.3); mobile accordion equivalent → **P0**.
4. **Filterable project library** (Turner Find-a-Project; AECOM facet filters; DPR 929-project search) → Lets evaluators self-serve evidence → **ADOPT** → URL-synced facets (practice/service/sector/location/status) + search over 86 records; honest empty states → **P0**.
5. **Case-study storytelling** (DPR narratives; Bechtel project pages) → Depth converts → **ADOPT WITH DISCIPLINE** → Template B only for the 5–8 evidenced flagships (§4.5); no fabricated CSR structure → **P1**.
6. **Geographic exploration** (Fluor map toggle; Bechtel by-region) → Scale demonstration → **PARTIAL** → Typographic reach strip + state facet filters now; interactive map deferred until geo data is verified → **P2**.
7. **Editorial layouts** (Arup's typographic pages; Jacobs' card overlays) → Reads as premium, not template → **ADOPT** → Asymmetric grids, large type, drawing-sheet motif, bands (§7) → **P0/P1**.
8. **Technical credibility surfaces** (AECOM granular taxonomies; Turner project metadata) → Engineers trust specifics → **ADOPT, OWN IT** → Capex's advantage is *quantities + statutory proof* (§12.1, §12.4) — go further than benchmarks here → **P0**.
9. **Visual hierarchy: big type + big imagery** (Bechtel hero, WTT-scale statements) → Confidence reads as competence → **ADOPT** → One decisive hero (no carousel), full-bleed real photos, metric-scale numerals → **P0**.
10. **Conversion architecture** (persistent RFQ paths; DPR CTAs) → B2B journeys are multi-visit → **ADOPT** → Practice-aware enquiry routing, phone-first CTAs, contextual CTAs on every template, per-page "next step" → **P0**.
11. **Content depth governance** (Arup/AECOM publish only substantiated pages) → Thin pages damage SEO and trust → **ADOPT** → Evidence-gated hubs (§3.5), verification workflow (§9.3) → **P0**.
12. **Motion restraint** (Arup minimal; Jacobs subtle) → Premium ≠ animated → **ADOPT** → §8 rules; reduced-motion globally → **P0**.

Explicitly **not** borrowed: Bechtel's global mega-scale (false for an MSME), AECOM's giant taxonomy trees (unsupported), DPR's thought-leadership volume (no editorial capacity), Fluor's investor-grade content (not the audience).

---

## 12. DIFFERENTIATION — A DISTINCTLY CAPEX DIGITAL IDENTITY

Anti-goal: "Bechtel but smaller." Capex's identity is **an evidence-first Indian turnkey engineering firm whose own documents are full of quantities, statutory proof, and named work** — the site makes that its signature. All opportunities below are grounded in sourced material:

1. **Quantity-led project presentation.** Every project leads with its engineering quantity — 4,000 TR / 150 km / 220 kV / 5,000 connections — as large tabular numerals. No benchmark makes quantities the hero; Capex's PDFs are full of them. This is the site's single most distinctive idea. (§4, §7.3)
2. **The Two-Practices diptych.** Homepage split-panel: "Under the city / Inside the building — one team, one accountable partner" (the shared-directors fact, DOC A p8, is a real differentiator vs. two-firm competitors). (§6.4)
3. **Drawing-sheet title blocks.** Page/section headers as engineering title blocks + survey-grid texture + mono field annotations — an aesthetic native to procurement engineers, foreign to template sites. (§7.2)
4. **Statutory transparency page.** "Compliance you can verify" made literal: certificate scans, registry numbers (CIN/PAN/Udyam/GST×5/ESI), one click from every credibility claim. Indian PSU/utility vendor-empanelment workflows make this genuinely load-bearing — benchmarks don't do this. (§3.10)
5. **The owned-plant story.** A "we own our machines" section: Drillto HDD fleet with tonnages, welding/jointing fleet — EPC buyers evaluating subcontractors care about owned capacity; almost no small-firm sites show equipment tables. (§3.3, §7)
6. **Commissioning-led positioning.** The 10 named Testing & Commissioning services (DOC A p15) presented as a first-class capability band — most installation contractors bury commissioning; Capex's PDFs give it a full page. (§5.2, §6.7)
7. **Service-model transparency.** The after-sales model published as specifics — two-person crews, escalation matrix, SLAs on paper, genuine-spares guarantee, log-book AHU operation (DOC B p3) — turns "after-sales support" boilerplate into checkable claims. (§3.3)
8. **Honest reach visualization.** 25 states + Nepal as a designed typographic element framed as *project reach*, with real project pins where they exist — no invented coverage map. (§5.4)
9. **The record-wall.** All 86 projects visible as a browsable, filterable record set — even name-suppressed residential entries — communicating *installed-base volume* that a 6-project portfolio site cannot. Volume + honesty beats curated thinness. (§4.6)
10. **Practice-lens browsing.** /projects, /team, /clients all carry quiet practice filter chips — each buyer persona views the company through its own lens without the site splitting into two brands. (§2.2, §8)

---

## 13. FINAL STRATEGIC BLUEPRINT (the one definitive recommendation)

1. **Brand/positioning direction:** Evidence-first turnkey engineering company — "one accountable partner across two practices"; confident, technical, restrained; never generic-contractor, never fake-global. Hero copy per §1.1 (drafts pending approval).
2. **Website architecture:** Multi-page expansion of the existing TanStack Start + Supabase platform (Phase 2 verdict: keep the foundation). Public surface rebuilt around routes, not anchors; one-pager retired.
3. **Sitemap:** §3 — Home, 2 practice pages, services overview + ~11 details, sectors overview + 3–5 hubs, projects index + ~86 details (2 templates), about, team, clients, credentials, careers (conditional), contact, footer legal. No News/Partners/Subsidiaries/FAQ pages.
4. **Navigation model:** 5 top-level items + phone + CTA; Capabilities mega-menu (practice-grouped); Company dropdown; mobile accordion with pinned phone. CMS-driven via existing `nav_items`.
5. **Practice structure:** Two first-class practice landing pages under one brand shell; services nested by practice; practices are the homepage's signature section and the projects/team/clients filter axis — *not* two top-level nav brands, *not* a flat service list.
6. **Services taxonomy:** 11 PDF-substantiated services (§5.2); Solar/Open Access excluded pending C19; Clean Rooms restored; MEP and T&C marked cross-practice.
7. **Industry taxonomy:** "Sectors" (source vocabulary); 3 evidence-strong hubs at launch, 2–3 service-led second wave, list-only remainder (§5.3).
8. **Project system:** 86-record corpus; structured metadata (§4.3); quantity-led tiles; URL-synced filters; Template A (Record — all) + Template B (Case Study — evidenced flagships only); zero fabricated narrative.
9. **Homepage narrative:** 13 bands per §6; CMS-rendered hero (fixes TD6); documented-only stats band with verification gates.
10. **Page templates:** Home / Practice / Service / Sectors hub / Projects index / Project Record / Project Case Study / Team / Clients / Credentials / About / Contact / Generic page — all sharing the drawing-sheet system.
11. **CMS/content model:** §9 — practices, credentials, offices as new entities; projects/services/clients/team evolved with relations; verification workflow (`verification_status`, `source_ref`, testimonial approval) making placeholder leaks structurally impossible; sections get schema-validated extras; subsidiaries removed; blogs held.
12. **Visual direction:** §7 — retain navy+amber DNA, retire purple/lime; add technical mono; drawing-sheet title blocks; real brochure photography only; amber as scarce signal color; style tile finalized at the start of Phase 4A.
13. **Interaction/motion direction:** §8 — restrained, purposeful, reduced-motion safe; adopt hovers/filters/counters/reveals/sticky-nav; reject cursor tricks, parallax, autoplay video.
14. **Content requirements:** §10.2 — photography, headshots, case-study narratives, completion years, quotes, commissioned shoot.
15. **Client verification requirements:** §10.1 (16 launch gates) + §10.4 register; conflicts C1–C25 preserved, none silently resolved.
16. **Technical implications (Phase 4 scope, in priority order):** kill 5s polling + per-route cached payloads (TD1) · CMS-driven hero (TD6) · homepage monolith → section components (TD3) · asset migration to media library (TD8/TD17) · curated icon map (TD11) · remove unused deps/components (TD5) · structured admin forms (TD9/S3) · sitemap.xml + canonicals + Organization/LocalBusiness/Service JSON-LD + fixed OG image (TD10) · signup hardening (S1) + rate limiting/honeypot (S2) + lead email notifications (TD14) · roles grant fix (S5/TD12) · FAQ aria + reduced-motion + marquee pause (a11y) · h1 on homepage.
17. **Risks:** R1 verification delays (mitigate: documented-only stats, gates per phase) · R2 86-record entry burden (Template A + batch import from Phase 1 tables) · R3 thin sector/service pages (evidence-gated hubs) · R4 logo permissions (permission_status + name fallback) · R5 photography shortfall (brochure extraction + commissioned shoot before launch) · R6 platform asset coupling (media migration first in 4A) · R7 editor capacity (structured forms + workflow) · R8 visual scope creep (style tile lock in 4A) · R9 SEO thinness at launch (hubs + JSON-LD; 6-month horizon) · R10 security before any public launch (4A hardening) · R11 naming/positioning ambiguity (decision is verification item #1).
18. **Recommended implementation phases:**
   - **Phase 4A — Foundations & skeleton (≈2–3 wk):** verification sprint 1 (items 1–8 of §10.1); CMS migrations (practices, relations, credentials, offices, workflow fields); nav + routes + practice pages + CMS-driven hero; polling removal; asset migration; security hardening; style tile.
   - **Phase 4B — Project system (≈2–3 wk):** corpus entry (86 records, Template A); listing + filters + search; flagship Template B for 5–8 projects; verification sprint 2 (project statuses, logo permissions).
   - **Phase 4C — Depth pages (≈2 wk):** services, sectors hubs, team, clients, credentials, contact/offices, about, policies (legal-reviewed), careers conditional.
   - **Phase 4D — Polish & launch (≈1–2 wk):** visual pass, motion, SEO plumbing, perf/a11y, admin structured editors, QA against this document's acceptance criteria, launch checklist with §10.1 gates.

**Acceptance criteria for the whole build (carried into Phase 4):** two-practice IA live and navigable; CMS hero renders; all stats documented-only; zero placeholders on public surface; projects index with ≥20 records + filters + 5 Template-B case studies; credentials page with scans; testimonials absent or real; sitemap/canonicals/JSON-LD live; polling removed; reduced-motion respected; mobile-first verified; per-route cached data-fetching.

---

## COMPLIANCE NOTE

This phase produced **decisions and rationale only**. No code, database, CMS content, dependencies, or files were modified or deleted (the sole artifact is this document). All company facts trace to the three Capex PDFs or the Phase 1/2 research; all conflicts are preserved and flagged, none resolved; all draft copy is marked and requires approval. Implementation must not begin until this strategy is reviewed and approved by the client.

*— End of Phase 3 Strategy, IA & Design Blueprint.*
