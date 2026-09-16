# Phase 5 — Capex Technical, CMS & Implementation Architecture

**Capex Construction & Engineering Pvt. Ltd. · Prepared 2026-09-03**

**Status:** TECHNICAL ARCHITECTURE & IMPLEMENTATION PLAN — for Phase 6 execution. Nothing in this phase has been implemented. No code, database, migration, dependency, route, or content has been modified. All repository inspection was read-only.

**Sources of truth:** Phase 1 (company discovery + conflict register C1–C25), Phase 2 (codebase audit; debt TD1–TD20, security S1–S7), Phase 3 (strategy/IA — treated as approved), Phase 4 (visual design system — treated as approved), plus read-only inspection of: `package.json`, `src/routes/*`, `src/lib/cms.functions.ts`, `src/lib/admin.ts`, `src/components/*`, `src/integrations/*`, `src/start.ts`/`src/server.ts`/`src/router.tsx`, `__root.tsx`, `styles.css`, all 12 `supabase/migrations/*.sql`, `.env` (names only).

**Stack position (decision):** The existing stack is **retained in full** — TanStack Start (SSR + server functions), React 19, TypeScript, Vite 8, Tailwind CSS 4, TanStack Query v5, Supabase (Postgres/RLS/Auth/Storage), Zod. This matches Phase 2's "KEEP" verdicts and Phase 3's platform decision. **No new runtime dependencies are required.** The only additions are dev/test tooling (Vitest, Testing Library, Playwright, axe-core — justified in §22) and one Google Font (IBM Plex Mono, per Phase 4 §2.1). Every proposed mechanism below uses what's already installed or platform-free primitives (fetch, browser canvas, Postgres triggers).

**Verification-first principle (carried from Phase 3 §9.3, hardened here):** the database *policies* — not application queries — are the enforcement layer for unverified content. This is the single most important architectural decision in this document (§3).

---

## 1. CURRENT SYSTEM → TARGET SYSTEM — GAP MAP

Legend: CHANGE = what Phase 6 must build; RISK = highest-level risk; ORDER = sub-phase (§23).

| Subsystem | CURRENT (verified) | TARGET | CHANGE REQUIRED | RISK | DEPENDENCIES | ORDER |
|---|---|---|---|---|---|---|
| **Routing** | 1 public page + `/$slug` generic pages + `/admin/*` (client-only) + `/auth` | 16 public route files + `/$slug` legal + sitemap route | New file routes per §8; `/$slug` demoted to reserved legal slugs | Route/shadowing collisions (`$slug` vs static routes) | none | 6C |
| **Homepage** | 1,097-line monolith `index.tsx`; hero hardcoded (CMS hero row ignored); 5s polling | ≤200-line composition of 13 band components; CMS-driven hero; cached slices | Full decomposition per §11; delete hardcoded hero imports | Content regressions during refactor | components (§10), data fns (§9) | 6D |
| **Components** | Nav.tsx + 15 inline section fns; 46 unused shadcn/ui; `import * as Icons` | ~30 owned components in 5 groups; curated icon map; shadcn/ui deleted | New `src/components/site/*` tree; icon map; delete `components/ui/*` | None (additive, then swap) | Phase 4 spec | 6A–6D |
| **CMS** | Generic `content_items` × 16 collections; raw-JSON `extra` editor; 10 admin screens | Hybrid: 9 relational entity editors + generic editor for 8 flat collections; structured section forms; verification UI | New admin screens per entity; schema-validated sections; JSON editor removed | Editor retraining (small); regression in admin CRUD | DB entities (§2) | 6B–6C |
| **Database** | `content_items` (discriminated), `sections`, `pages`, `settings`, `nav`, `categories`, `media`, submissions, `user_roles` | + **9 new content/entity tables** (`practices`, `services`, `sectors`, `projects`, `clients`, `team_members`, `credentials`, `offices`, `equipment`) **+ `audit_log` (infrastructure) + 3 junction tables**; verification columns everywhere | Forward-only migrations per §2 | Data migration correctness (§18 mitigates) | none | 6B |
| **Projects** | 13 rows in `content_items`, section OFF, no detail pages | `projects` table w/ Template A/B, relations, filters, 86-record corpus | New table + migration of 13 + import path for corpus | Biggest content effort; conflict register handling | verification arch (§3) | 6F, 6I |
| **Practices** | Absent (merged into flat services) | `practices` table (2 rows) + landing pages + nav grouping | New entity, pages, mega-menu | Low | services/projects FKs | 6B, 6E |
| **Services** | 6 cards in `content_items`; duplicated in contact JSON + about JSON + (orphan) `data.ts` | `services` table (11) as **single canonical source** consumed by nav/home/contact/practice pages | New table; 3 duplicate stores deleted | Dedup completeness (any missed sync point) | practices | 6B, 6E |
| **Sectors** | 12 flat `industries` chips | `sectors` table w/ evidence tiers; 3 hub pages + overview | New table; evidence-tier mapping from P3 §5.3 | Thin-content guard (hub gating) | projects junction | 6G |
| **Clients** | 56 `content_items`; 29 logos on `/__l5e/` Lovable paths (404 off-platform); partners as separate collection | `clients` table w/ relationship type + logo permission + category; logos migrated to media library | New table; logo migration from `src/assets/clients/*` (local files exist); partners merged | Logo rights (gate #12); off-platform asset loss | media arch (§7) | 6B, 6G, 6I |
| **Team** | 0 items, hidden | `team_members` table (3 groups), team page, leadership plates | New table + page | Bio conflicts C1–C7 (ship name+role only) | practices FK | 6G, 6I |
| **Credentials** | 4 `certifications` cards, no scans/numbers | `credentials` table w/ registry numbers + scans + scan_status | New table + page | ISO gate #13 | media library | 6G |
| **Offices** | One address in settings (conflicting) | `offices` table (4 offices + Rajasthan unit) | New table; contact/about presence | Address gate #2, unit gate #16 | verification pattern | 6G |
| **Media** | `media` table + storage bucket + proxy built, 0 rows used; all assets in git `/uploads`, `src/assets`, or Lovable R2 | Media library as mandatory source; caption/focal/variants; client-side optimized upload; all imagery migrated | Extend media table; upgrade `uploadMedia`; migration script | Asset loss during migration (backup first) | — | 6A, 6I |
| **Forms** | `submitEnquiry` Zod-valid, anon insert, no throttle, no notify, no ref | Practice-aware intake; ENQ ref; honeypot+timing+DB rate-limit; email notify via Resend REST (fetch, no dep); sanitized errors | Extend server fn + trigger + optional notify | Spam (S2); silent leads (TD14) | audit settings | 6H |
| **Auth** | Open signup; first-user-admin trigger; role toggle writes blocked by grants (S5) | Signup disabled; trigger dropped; admin-only service-fn role management; onboarding runbook | Migration + server fn + ops checklist | Lockout during onboarding transition | runbook (§21) | 6A |
| **Admin** | 10 screens; raw JSON section editor; sequential settings saves | Entity editors + verification UI + batched saves + import tools | New screens (§6) | Scope creep (guardrail: small-company CMS) | DB entities | 6B–6C |
| **SEO** | No canonical/sitemap/JSON-LD; broken hardcoded R2 OG; homepage lacks h1 | Per-route head w/ canonical; sitemap.xml route; OG from settings via media; Organization/Service/Breadcrumb JSON-LD; robots update | Head plumbing + routes + schema | Facet indexing mistakes (guardrail §8.5) | routes | 6H |
| **Performance** | 5s background polling of whole site; full lucide import; ~39 unused heavy deps | staleTime ≥5min public queries (client freshness — §9.2 taxonomy); curated icons; dep purge; image variants | Query config, icon map, package.json cleanup | Behavioral change (editors lose 5s live preview — accepted, §9.4) | — | 6A, 6H |
| **Caching** | None server-side; `staleTime 0` | Route-sliced queries; 5-min staleTime + 30-min gcTime as **client query-freshness config** (not HTTP/CDN caching — taxonomy in §9.2); admin/public key separation | Query architecture per §9 | Stale content ≤5 min after admin edits (accepted) | — | 6A |
| **Analytics** | GA/GTM settings empty placeholders | Keep placeholders; wire GA only if client supplies ID (gate) | None (defer) | None | client ID | 6J (opt) |
| **Legal pages** | 4 pages w/ "[Placeholder]" text, live | Unpublished until legal review; published w/ real content | is_active=false on placeholder pages | Launching with placeholders (must not happen) | legal gate #9 | 6I |

---

## 2. TARGET DATABASE ARCHITECTURE

### 2.1 Design decision: hybrid relational + generic model

Phase 3 §9.1 decided the entity split. Phase 5 makes it concrete:

- **Promoted to dedicated relational tables — the 9 new content/entity tables** (the entity graph needs FKs, junctions, verification, structured fields): `practices`, `services`, `sectors`, `projects` (+junctions), `clients`, `team_members`, `credentials`, `offices`, `equipment`. Plus **`audit_log`** (§14.6 — infrastructure, not a content entity) and **3 junction tables** (§2.4).
- **Remain in `content_items`** (flat, presentational, no cross-relations): `process`, `why_us`, `stats`, `faqs`, `testimonials` (dormant, approval-gated), `gallery`, `blogs` (held), `careers`.
- **Retained as-is:** `site_settings`, `nav_items`, `sections` (extras become schema-validated, §6.4), `pages`, `categories`, `media` (extended), `form_submissions`, `newsletter_subscribers`, `profiles`/`user_roles`.
- **Removed:** `subsidiaries` concept (collection row + admin entry deleted — no data, Phase 1 §7); `partners` collection (rows transformed into `clients` with relationship types).

Rationale: dedicated tables give real FK integrity for the graph that filters/related-content/counts depend on, while the generic table continues to serve simple lists — no enterprise CMS, no over-modeling, editable by a small company (Phase 3 §9 constraint).

### 2.2 Shared column conventions (all new tables)

Every public-capable entity table carries:

```sql
-- verification axis (factual accuracy) — see §3
verification_status text not null default 'unverified'
  check (verification_status in ('unverified','needs_client_review','verified')),
source_ref text,                       -- e.g. 'DOC C p8', 'client-confirmed 2026-09-10', 'gate #4'
verification_note text,               -- internal only; never rendered publicly
-- publication axis (visibility)
is_active boolean not null default false,
sort_order int not null default 0,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()  -- touch_updated_at() trigger (existing)
```

`content_items` and `site_settings` gain the same three verification columns (settings are key-value; flagged rows: `contact_address`, `contact_phone`, etc. per §19).

### 2.3 Entity definitions

**`practices`** — the two-practice axis. 2 rows, seeded.
- PK `id uuid`. `number int not null unique check (number in (1,2))` (Practice 01/02). `name text not null` (canonical DOC A p5 wording). `short_label text not null` (nav label, draft per P4 §2.3). `slug text not null unique` (`ug-utilities-electrical`, `mep-fire-protection` — draft). `scope_line text` (3-liner), `narrative text` (page body), `hero_media_id → media(id)`, `hero_focal jsonb` `{x,y}`, `metrics jsonb` (2 documented refs). Ordering: `number`. Publication: seeded `is_active=true, verification_status='verified', source_ref='DOC A p5'`.

**`services`** — canonical service list (kills 3-way duplication).
- PK `id uuid`. `practice_id uuid not null → practices(id) on delete restrict`. `name text not null`; `slug text not null unique`. `standfirst text` (≤40 words); `overview text` (≤120 words); `included jsonb default '[]'` (string[]); `method_panels jsonb default '[]'` (`[{title,note}]`, ≤4); `icon text` (from curated map). Index: `(practice_id, sort_order)`. Uniqueness: slug global (not per-practice — simpler URLs). 11 rows seeded per P3 §5.2 taxonomy.

**`sectors`** — industries renamed (public label "Sectors").
- PK `id uuid`. `name`, `slug unique`. `evidence_tier text not null check (evidence_tier in ('hub','service_led','list_only'))`. `standfirst`, `relevance text` (hub narrative). Seeded per P3 §5.3: 3 hubs, 2–3 service_led, remainder list_only. `is_active` governs listing; hubs render hub pages only when linked verified records ≥3 OR service_led badge (guardrail from P3 R3 — enforced in query layer + admin badge, not a DB constraint, since evidence changes as records are entered).

**`clients`** — relationship-typed trust register.
- PK `id uuid`. `name text not null`; `slug` (nullable, auto). `category_id → categories(id)` (existing client categories: IT/Corporates/Oil & Gas/Builders & Developers). `relationship text not null check (relationship in ('client','pmc','architect','epc_counterparty'))`. `logo_media_id → media(id)` nullable. `logo_permission text not null default 'pending' check (in 'granted','pending','denied','n_a')` — `denied`/`pending` ⇒ name-only rendering (never a missing image). `practice_affinity uuid → practices(id)` nullable (null = both). Index `(relationship)`, `(category_id)`.

**`projects`** — see §4 (full model).

**`team_members`**
- PK `id uuid`. `name text not null`; `role text`; `group text not null check (group in ('leadership','delivery','site_design'))`; `practice_id → practices(id)` nullable; `note text` (≤12 words, only when verified); `photo_media_id → media(id)` nullable. Index `(group, sort_order)`.

**`credentials`**
- PK `id uuid`. `title text not null` (e.g., "Certificate of Incorporation"). `category text not null check (category in ('statutory','quality','membership'))`. `number text` (real registry numbers — CIN, PAN, GSTIN×5, Udyam, ESI). `jurisdiction text` (issuer/state). `issued_at date`, `expires_at date` nullable. `scan_media_id → media(id)` nullable. `scan_status text not null default 'on_request' check (in 'approved','on_request','pending'))` — drives `VIEW SCAN ↗` vs `CERTIFICATE ON REQUEST` per P4 §12.4. Seeded from Phase 1 §8 (statutory rows `verified` — certificate-backed; ISO row `needs_client_review` pending gate #13; memberships per Phase 1 §6 honesty note).

**`offices`**
- PK `id uuid`. `city text not null`; `type text not null check (type in ('corporate','branch','manufacturing'))`; `address text`; `phone text`; `map_url text`; `hours text`; `is_primary boolean default false`. Seeded 4 offices + Rajasthan unit — **all rows `needs_client_review`** (gates #2/#16); the corporate office row carries `verification_note` documenting the 3-way address conflict (C10 + site variant).

**`equipment`** — plant register (Practice 01 star content).
- PK `id uuid`. `practice_id → practices(id)`. `item text not null`; `spec text`; `quantity int` **nullable — null renders the count-free row** per P4 §6.2; seeded from Phase 1 §2.4 with `needs_client_review` where the source pairing is ambiguous.

**`audit_log`** (§14.6): `id, actor uuid, action text, entity text, entity_id uuid, diff jsonb, at timestamptz` — insert-only, staff writes via triggers.

### 2.4 Junction tables (canonical graph, §5)

```sql
project_services (project_id → projects(id) on delete cascade,
                  service_id → services(id) on delete cascade,
                  primary_key (project_id, service_id))
project_sectors   (project_id, sector_id, primary_key both)
project_clients   (project_id, client_id,
                   role text not null check (role in ('principal','contractor','pmc','owner')),
                   primary_key (project_id, client_id))
```

`project_clients` (not a single FK) supports the documented reality: Aurangabad = BGRL (principal) + Vichitra Construction (contractor) — DOC C p8. `services.practice_id` is 1:1 (a service belongs to one practice; MEP + T&C carry the "cross-practice" note in content, not a second FK — per P3 §5.2 decision).

### 2.5 Evolutions of existing tables

| Table | Change |
|---|---|
| `content_items` | + `verification_status`, `source_ref`, `verification_note` columns. Rows in promoted collections are migrated out (§18); flat collections remain. `categories` continues to serve clients (and legacy groups). |
| `site_settings` | + verification columns. `contact_address`/`contact_phone`/`seo_og_image` flagged per §19. |
| `sections` | No schema change; `extra` jsonb stays but is **schema-validated per key** (§6.4) and its role shrinks (capabilities/sectors/association-groups/services duplicates move to real tables). |
| `media` | + `caption text`, `focal_point jsonb`, `width int`, `height int`, `variants jsonb default '[]'` (`[{url,width}]`), `kind` extended check to include `document`. |
| `form_submissions` | + `ref text unique` (ENQ-YYYY-NNNN), `practice text`, `service_slug text`, `ip_hash text`, `user_agent_hash text`, `flagged boolean default false` (timing/honeypot telemetry). |
| `pages` | + `verification_status`/`source_ref` (policies blocked from publication until legal gate). |
| `user_roles` | grants fixed for the admin service-fn path (§14.3); auto-admin trigger dropped. |

### 2.6 Indexes & constraints (summary)

- All FKs indexed (Postgres does not auto-index FK columns). Junction PKs cover (project_id) lookups; add reverse indexes on (service_id), (sector_id), (client_id) for reverse queries ("all projects for service X").
- `projects`: index `(practice_id, sort_order)`, `(slug) unique`, `(ref) unique`, `(location_state)`, `(status)`, partial index `(is_active, verification_status)` — the public read path.
- Unique slugs are global per table (services, sectors, projects, clients) — collision surfaces as a friendly admin error (§6.6), not a raw PG error (fixes Phase 2 §15.6).
- Referential integrity: `on delete restrict` for practices→services (never orphan silently); `on delete cascade` only for junction rows; `set null` for media refs (media deletion keeps the entity, drops the image → no-photo fallback renders — ties to §7.5).

---

## 3. VERIFICATION ARCHITECTURE

The load-bearing subsystem. Phase 3 §9.3 defined the workflow; Phase 5 makes it airtight at the database layer.

### 3.1 State model — two independent axes (and why the brief's five states are reduced)

The brief asks whether draft/needs_client_review/verified/published/archived are all necessary. **Decision: no.** "Draft" and "published" are *publication* states (already modeled by `is_active`); "archived" is publication too. Verification is a separate factual axis. Collapsing to two axes keeps a small CMS honest and simple:

**Axis 1 — `verification_status` (factual accuracy):**
- `unverified` — entered, not yet checked against a source. **Never public.**
- `needs_client_review` — flagged conflict/gap requiring a client decision (the Phase 1 register items). **Never public.** Carries `verification_note` citing the conflict (e.g., "C13: 60 KM scope appears in both Completed and Running tables — package numbers unexplained").
- `verified` — checked against `source_ref` (a document citation, a statutory certificate, or a recorded client confirmation) with no open conflict. **Only this state can be public.**

**Axis 2 — publication:** `is_active` (public) / inactive (draft or archived; `archived` rows additionally move sort_order to 9999 and can be filtered in admin). A row must be `verified AND is_active` to render publicly.

**Special case — `status='unconfirmed'` on projects:** project completion status (Completed/Ongoing) is *content*, not row-verification; the check constraint includes `unconfirmed` so running-project records (DOC C, July 2022) can be public with honest status handling per gate #11 — the record itself is verified (transcribed faithfully), its *status field* is flagged. Rendering rule in P4 §8.2: status chip renders only for confirmed values; `unconfirmed` renders no chip (not "TBD" text).

### 3.2 Enforcement — RLS policies, not queries

Current public read policies are `using (true)` or `using (is_active)`. **All public read policies on verification-capable tables become:**

```sql
create policy "<table> public read" on public.<table>
  for select to anon, authenticated
  using (is_active and verification_status = 'verified');
```

Consequences:
- The anon-key'd server functions (existing pattern) *cannot* leak unverified content even with a buggy query — the filter is in the policy.
- Staff read via a separate policy: `to authenticated using (public.is_staff(auth.uid()))` — admins/editors see everything in the admin (matches existing pattern in migration 1).
- **Publication trigger (the accidental-publication guard):**
```sql
-- before insert or update: is_active requires verified
if new.is_active and new.verification_status <> 'verified' then
  raise exception 'Cannot publish: verification_status must be verified';
end if;
-- de-verification unpublishes immediately
if new.verification_status <> 'verified' and old.is_active then
  new.is_active := false;
end if;
```
  Applied to every verification-capable table. This makes the Phase 2 credibility-leak failure mode (invented testimonials rendering publicly) **structurally impossible**: an unverified row cannot be published, and demoting it unpublishes it in the same statement.
- `site_settings`: public policy reads `key,value` only where `is_active`-equivalent… settings have no is_active; add `verification_status` with public policy `using (verification_status in ('verified','needs_client_review'))`? No — cleaner: **public policy filters `verification_status = 'verified'`**; flagged settings (address, phone) remain admin-visible but public reads fall back to… nothing. That would break the contact page. Resolution: flagged settings ship their **conservative documented value** as a separate row (e.g., `contact_phone_secondary` stays hidden; `contact_address` shows the Phase-1 profile value marked `needs_client_review`?). Decision: settings used by public templates must be `verified` at launch (they're part of gates #2/#3/#4); the public policy enforces this — the launch checklist (§19) makes resolving those gates a hard precondition. This is intentional pressure, not a bug.

### 3.3 Permissions

| Action | Editor | Admin |
|---|---|---|
| Create rows / edit content fields | ✓ | ✓ |
| Set `verification_status` → `needs_client_review` / `unverified` | ✓ | ✓ |
| Set `verification_status` → `verified` | ✗ | ✓ |
| Toggle `is_active` (publish/unpublish) | ✓ (but trigger requires verified — editors can publish only verified rows; in practice admin verifies first) | ✓ |
| Edit `source_ref`/`verification_note` | ✓ | ✓ |
| Manage users/roles, settings, delete media | ✗ | ✓ |

Enforcement: all writes go through RLS `is_staff` (existing); the verified-transition is additionally guarded by a **DB trigger checking `public.has_role(auth.uid(),'admin')`** — not just UI (the site never depends on client-side authorization, per brief §14). `source_ref` non-null is required for the verified transition (trigger check).

### 3.4 How admins see state

List views carry a status rail per row: verification chip (UNVERIFIED gray / NEEDS REVIEW amber / VERIFIED green-family) + publication dot + `source_ref` in a mono subline. A "Needs review" admin dashboard card groups every `needs_client_review` row across tables with jump links — the conflict register becomes a work queue (the operational fix Phase 3 called for).

### 3.5 What happens when verified content becomes disputed

Editor sets `needs_client_review` + note → trigger unpublishes instantly → public page 404s (project) or renders without the row (list) → admin dashboard surfaces it. No content is ever deleted to resolve a conflict (§19 rule: preserve, don't resolve by guessing).

---

## 4. PROJECT DATA MODEL

One table, two templates, conditional fields (per brief: do not create two unrelated schemas).

```sql
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  ref text unique,                          -- 'P1-001' UI affordance, admin-generated on create
  title text not null,
  slug text not null unique,
  practice_id uuid not null references practices(id) on delete restrict,
  -- location
  location_city text not null,
  location_state text not null,
  country text not null default 'India',
  -- status (content axis — see §3.1)
  status text not null default 'unconfirmed'
    check (status in ('completed','ongoing','unconfirmed')),
  status_note text,                          -- internal, e.g. 'C13 package ambiguity'
  -- record content (Template A)
  scope_line text,                           -- exact PDF wording, the record's headline
  metrics jsonb not null default '[]',       -- [{label, value, unit}] — powers quantity-led design
  client_display text,                       -- override label, e.g. 'Private residential client, Noida'
  hero_media_id uuid references media(id),    -- single record image (set null on media delete)
  completion_year int,                       -- mostly null (do not fabricate)
  featured boolean not null default false,
  -- case-study content (Template B; all nullable)
  template text not null default 'a' check (template in ('a','b')),
  summary text,                              -- B: overview narrative
  scope_breakdown jsonb not null default '[]',-- B: [{system, note}]
  execution_notes jsonb not null default '[]', -- B: [{title, note}] (renders only if non-empty)
  outcome text,                              -- B: ≤60 words
  -- SEO
  seo_title text, seo_description text,
  -- shared conventions (§2.2)
  verification_status text not null default 'unverified',
  source_ref text, verification_note text,
  is_active boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

**Client link:** via `project_clients` junction (role-tagged) — `client_display` overrides the rendered name (residential individuals always render as `Private residential client, {city}` — P4 §19.10 privacy rule; the underlying person's name stays in the admin note field, never public).

**Case-study quote:** lives in the dormant `testimonials` collection (`content_items`, collection='testimonials') with `meta: {project_id, approval_status}` — a quote renders on a Template B page only when `approval_status='approved'` AND the row itself is verified+active. One quote entity, no duplication (P3 §9.1).

### 4.1 Template A behavior (the default)

A record with only scope + metrics + location + relations renders the full P4 §9 layout. Every B-only field is nullable and simply absent. **Template A is the schema's natural state** — 76+ records will never populate B fields, and nothing about the layout suffers (the no-photo treatment and title block are designed for exactly this).

### 4.2 Template B — never requires fabricated narrative

- **Downgrade rule (enforced, not hoped-for):** the public query/server layer computes `effective_template = (template='b' AND summary IS NOT NULL AND jsonb_array_length(scope_breakdown) > 0) ? 'b' : 'a'`. A half-filled B silently renders as A. Additionally the publish trigger (§3.2) rejects publishing `template='b'` without summary+scope_breakdown — so an incomplete B cannot ship even before the query layer runs.
- **Narrative sources:** `summary`/`execution_notes`/`outcome` are populated ONLY from client-supplied material (§10.2 P3) or approved drafts. The corpus import (§18) seeds **no B content** — the 7 flagship candidates start as A records with `needs_client_review` notes "case-study narrative requested (gate: §10.2 content)" and are upgraded when narratives arrive.
- **Related projects:** computed at query time (same principal client → same sector → same service, first 3 by sort) — no stored relation, no staleness.

### 4.3 Ref codes

`P{practice_number}-{sequence}` assigned at admin creation (sequence = count of existing rows in that practice + 1, retried on collision; unique constraint catches races). Pure UI affordance — rendered in title blocks/register rows, explicitly **not** a source citation (P4 §3.2); the admin shows a hint to this effect so editors don't treat it as an authority.

---

## 5. CONTENT RELATIONSHIPS — CANONICAL GRAPH

```
practices 1──n services            (services.practice_id)
practices 1──n projects            (projects.practice_id)
practices 1──n team_members        (team_members.practice_id, nullable)
services  n──n projects            (project_services)
sectors   n──n projects            (project_sectors)
clients   n──n projects            (project_clients, role-tagged)
clients   n──1 categories          (existing categories table)
credentials 1──n media             (scan_media_id)
all entities ── media              (hero/photo/logo media_id refs → set null)
sections/settings/nav/pages        (shared page chrome & copy)
```

### 5.1 Canonical-source map (kills every duplication Phase 2 found)

| Data | ONE canonical source | Consumers | Deleted duplicates |
|---|---|---|---|
| Services | `services` table | mega-menu, homepage band 4→(practices/services), practice pages, service pages, **contact form select** (queried, grouped by practice), sector hub capability lists | `sections.contact.extra.services` JSON; `sections.about.extra.capabilities`; orphaned `src/components/site/data.ts` (delete file); hardcoded anythings |
| Clients | `clients` table (+categories) | trust marquee, homepage wall, clients page, sector hub walls, project records | `sections.about.extra.association_groups`; `partners` collection |
| Stats/numbers | computed counts (projects/practices) + curated verified `stats` rows | homepage numbers band, hero metadata line, sector counts | hardcoded stat arrays |
| Hero | `sections` row `hero` | homepage hero (TD6 fix) | hardcoded `src/assets/hero/*` imports in index.tsx (assets remain in repo until media migration, then removed) |
| Process | `content_items.process` | homepage band, practice pages, about | — |
| PMC/architect list | `clients` (relationship pmc/architect) | clients page, practice 02 page | `partners` collection rows |

### 5.2 Efficient relation querying

- PostgREST embedded resources via the anon client: `select("*, practices(short_label), project_services(services(name,slug)), project_sectors(sectors(name,slug)), project_clients(clients(name, relationship))")` — single round-trip per project page; junctions are FK-indexed (§2.6).
- Facet counts: computed views `project_counts_by_service/sector/state` (or one group-by query per facet on the projects index — 86 rows makes either trivial; prefer queries over views so counts always reflect verification filters without view maintenance).
- Reverse queries ("projects for service X") use the junction reverse indexes.
- No denormalized copy of any relation is stored (no "client_name" text column on projects) — display names come from the join; `client_display` is the only override, for anonymization.

---

## 6. CMS ARCHITECTURE

Constraint from Phase 3: keep it usable by a small company; no enterprise CMS.

### 6.1 Screen map

| Admin screen | Disposition |
|---|---|
| Dashboard | **EXTEND** — + "Needs review" verification queue card (§3.4) |
| Site Settings | **KEEP, improve** — batched save (single upsert loop wrapped in one mutation; fixes TD18); verification chips on flagged keys |
| Navigation | **KEEP** (nav_items already supports the P4 IA; seed new tree) |
| Media Library | **KEEP, extend** — caption/focal/variants fields; usage lookup (§7.5) |
| Pages & Policies | **KEEP** — + verification state; placeholder pages blocked from publish |
| Enquiries / Newsletter | **KEEP** — + ref column, flags |
| Users & Roles | **REBUILD** — via admin-only server fn (§14.3) |
| Content: **Projects** | **NEW dedicated editor** — the richest form (below) |
| Content: **Services / Clients / Team / Credentials / Offices / Equipment / Practices / Sectors** | **NEW dedicated editors** — small structured forms per §2.3 fields |
| Content: process, why_us, stats, faqs, testimonials, gallery, blogs, careers | **KEEP generic editor** (existing `content.$collection` pattern, minus deleted collections) |
| Raw JSON "Advanced content" textarea | **DELETE** (see 6.4) |

### 6.2 Project editor (the exemplar for entity editors)

Structured form with sections: Identity (title, slug auto-gen, ref auto, practice select) · Location (city, state) · Status (radio + note) · Record content (scope_line, metrics repeater `[{label,value,unit}]`, client_display) · Relations (client combobox w/ role picker; services multi-select; sectors multi-select) · Template (A/B radio; B panel reveals summary/scope_breakdown repeater/execution repeater/outcome; publish blocked until B fields valid — mirrors the trigger) · Media (hero image picker from media library w/ focal point) · Verification (status select, source_ref, note — editor role sees verified option disabled) · Publication (is_active toggle, disabled unless verified) · SEO (title/description with SERP preview).

All entity editors share the same `Field` primitives (existing `components/admin/fields.tsx` extended) — one form kit, no per-screen bespoke styling.

### 6.3 Validation

- Client: Zod schemas shared with the server (single source in `src/lib/schemas/` — the same schemas the public server functions validate `extra` with, per S3 fix).
- Server: DB check constraints + triggers (§2–3) are the final authority; admin forms render friendly errors for unique-violations (map PG error codes → field-level messages; fixes raw-error surfacing, Phase 2 §15.6).
- Slug validation: reserved-word list (practices, services, projects, sectors, about, team, clients, credentials, contact, careers, admin, auth, api) enforced on `pages.slug` and entity slugs.

### 6.4 The raw-JSON editor: explicitly removed

- `sections.extra` remains a jsonb column, but the admin replaces the textarea with **per-key structured sub-forms** driven by a schema registry (`src/lib/section-schemas.ts`): each section key gets a Zod schema; the admin renders typed fields (lists of strings, card arrays, etc.); saves parse through the schema and reject invalid payloads before write; the public renderer **also** parses `extra` through the same schema at query time and drops invalid sections to defaults — S3's stored-XSS/integrity risk is closed at both ends.
- Content that currently lives in `extra` and has a canonical home (capabilities, sectors, association groups, contact services) **migrates out** (§5.1); only genuinely sectional extras remain (about highlights, why-us JSON already migrated to content_items, hero metadata line fields).

### 6.5 Draft/publish, preview, ordering, filtering, search, bulk

- **Draft/publish:** is_active toggle per above; "View on site" link opens the public URL with `?preview=1` (no auth bypass — preview shows only what's publishable; unpublished drafts are previewed in-admin via a read-only render panel for projects/services — lightweight: reuses public components in a route `/admin/preview/$collection/$id` rendered server-side. NEW, small).
- **Ordering:** up/down arrows per row (keyboard accessible, no drag-lib); writes sort_order ±1 with swap; ties impossible by construction (fixes Phase 2 §15.6 collisions).
- **Filtering/search:** admin list views get a single ilike search box + verification-status filter tabs (ALL / NEEDS REVIEW / VERIFIED / UNPUBLISHED). Small data volumes — client-side after fetch.
- **Relationship selectors:** searchable combobox (native `<input list>` pattern or small custom listbox — no new dep) querying the target table.
- **Bulk actions (projects only):** verification-flag actions ("mark needs_client_review" for selected), activate/deactivate selected. Plus the **corpus import** (§18.3): a CSV/JSON paste importer → admin-only server fn `importProjects` with per-row Zod validation, inserting all rows as `unverified, is_active=false`, reporting per-row errors. This is the practical path to 86 records without 86 form sessions.

---

## 7. MEDIA ARCHITECTURE

### 7.1 Principles

The existing pipeline (storage bucket `media` + `media` table + `/api/public/media/*` proxy with service-role server-side download) is sound and unused — Phase 6 makes it the **mandatory** source for all imagery. No public URL ever points at `/__l5e/…` or a git path again (guardrail).

### 7.2 Extended media table

`media` gains: `caption text` (P4 §3.5 annotation format), `focal_point jsonb {x,y}` (0–1; drives `object-position` crops incl. mobile), `width int, height int` (CLS + aspect containers), `variants jsonb [{url,width}]` (srcset), `kind` check extended: `image|video|document` (credential scans are PDFs — the proxy already sets content-type; scans open in a new tab, not `<img>`).

### 7.3 Upload pipeline (no new dependencies)

`uploadMedia` (in `src/lib/admin.ts`) is upgraded:
1. Client-side canvas optimization (browser `Canvas` API — dependency-free): decode image → resize to long-edge max 2560px → encode JPEG q82 (or WebP q80 where `canvas.toBlob` supports it) → record width/height.
2. Generate responsive variants at 480/960/1600/2400px long edge (same canvas pass) → upload as `{folder}/{uuid}-480w.jpg` etc. → single `media` row with `variants`.
3. Path scheme: `media/{folder}/{uuid}.{ext}` where folder ∈ `hero | projects | team | clients | credentials | site` (usage domain at a glance).
4. PDFs/documents: no canvas path — size cap 10 MB, stored as-is, `kind='document'`.
5. Cache: proxy route sets long-lived immutable cache for hashed names (uuid never changes; edits replace the row) — upgrade `cache-control` to `public, max-age=31536000, immutable`.

### 7.4 Public serving

Keep the proxy (`/api/public/media/{path}`) as the only public URL shape: private bucket + service-role server read (correct per Phase 2 S4) + free future CDN-agnostic. Add HTTP `Accept`-based format negotiation? **No** — premature; variants/srcset cover responsiveness (§16).

### 7.5 Usage tracking & deletion

No enforced reference table (over-engineering for this scale). On delete, the admin media screen calls an admin-only server fn `checkMediaUsage(id)` that greps the known ref columns (`projects.hero_media_id`, `team_members.photo_media_id`, `clients.logo_media_id`, `credentials.scan_media_id`, `practices.hero_media_id`, `sections.image_url` text match, `content_items.image_url/images` text match) and warns with a linked list before allowing delete. DB-level: entity media FKs are `on delete set null` → deleting a referenced image degrades gracefully to the designed no-photo/no-logo fallback (P4 §16.8) rather than breaking pages. Replacement: upload new + repoint (media rows are immutable; no in-place overwrite).

### 7.6 Migration of existing assets (order matters — 6A)

1. **Client logos (29 Lovable-path rows):** source bytes already exist locally as `src/assets/clients/*.png|webp|avif` (verified in repo — ~40 files). Script (dev-only, run through the existing Node/npm project toolchain — e.g. a `scripts/` TypeScript file executed via the project's existing Vite/tsx-compatible path or compiled with `tsc`; **Bun is NOT a prerequisite and must not be added**): for each clients row with `/__l5e/` URL → map by filename → upload to `media/clients/` via the storage API (service key, dev-run) → update rows → write media row. **Lovable-path URLs are dead to us off-platform; local assets are the recovery source.**
2. **Seeded public/uploads images + hero JPGs still in use:** upload originals into the library; update `sections.image_url`/hero settings; remove files from `public/uploads` and `src/assets` once nothing references them (guardrail: verify via grep before delete).
3. **Brochure photography (interim launch imagery per P4 §16.1):** extracted from the PDFs at max available resolution → `media/hero` & `media/projects` with captions; flagged `source_ref='DOC A p12'` etc. Original files requested from client (P3 §10.2) replace these when supplied.
4. **OG image:** one branded static 1200×630 PNG into `media/site` → `seo_og_image` setting (replacing the broken R2 URL in `__root.tsx` — S/SEO fix).

### 7.7 No-photo fallback

Not a media feature — a component guarantee (P4 §16.5): every image slot renders the designed no-photo treatment when its media ref is null. The system never *needs* an image to look complete.

---

## 8. ROUTING ARCHITECTURE

### 8.1 Route tree (TanStack Start file conventions)

```
src/routes/
  __root.tsx                     head defaults, fonts, error/404 shell
  index.tsx                      /                      (Home)
  practices.$slug.tsx            /practices/$slug       (2 practice pages)
  services.index.tsx             /services
  services.$slug.tsx             /services/$slug        (~11)
  projects.index.tsx             /projects              (register + filters)
  projects.$slug.tsx             /projects/$slug        (Template A/B)
  sectors.index.tsx              /sectors
  sectors.$slug.tsx              /sectors/$slug         (hubs + service-led)
  about.tsx · team.tsx · clients.tsx · credentials.tsx · contact.tsx
  careers.tsx                     /careers              (guarded, §8.4)
  $slug.tsx                       /$slug                 (pages: legal + future landing)
  _authenticated/…                /admin/*               (ssr:false, unchanged pattern)
  auth.tsx                        /auth                   (noindex)
  api/public/media/$.tsx          media proxy             (exists)
  sitemap.xml.tsx (or api route)  /sitemap.xml            (NEW server route)
  robots.txt                      static (updated)
```

Static segments outrank the dynamic `$slug` in TanStack's ranking — `/services` can never be captured by `/$slug`. The reserved-slug DB constraint (§6.3) prevents `pages` from claiming a route word anyway.

### 8.2 Route ownership & data requirements

Each route owns: its loader (`ensureQueryData` on its server fn), its `head()` (title/canonical/OG/JSON-LD per §15), its section composition, `notFoundComponent`. Data slices in §9.1. Route files stay ≤ ~200 lines — composition only (guardrail).

### 8.3 Dynamic validation & 404s

- `$slug` routes validate: entity exists, `is_active && verified` (policy-enforced anyway), else `throw notFound()` → styled 404 (drawing-sheet framed, per P4 language).
- Slug format validation: kebab-case regex (Zod) in the server fn input (extends the existing `getPage` pattern).

### 8.4 Redirects & conditional routes

- `/careers` `beforeLoad`: if no active-verified careers rows → `redirect({ to: '/about', hash: 'careers' })` (P3 §3.11). Nav link for Careers is seeded but `is_active=false` until openings exist.
- Legacy anchors from the one-pager (`#services`, `#projects`…) die with the one-pager; no redirect table needed (site was never public per Phase 2 §1.4 — no index equity to preserve). `/careers` is the only redirect.

### 8.5 Canonicalization, sitemap, robots, indexability (the SEO guardrail)

- **Filtered project views are NOT indexable:** `/projects?{any facet param}` renders `canonical → /projects` **and** `robots: noindex` when any facet param is present. Only the clean `/projects` is indexed. This implements the brief's rule: arbitrary filter combos never enter the index.
- **Curated facet pages ARE the indexable facets** — they already exist as real routes: sector hubs (`/sectors/{slug}`) and service pages (`/services/{slug}`) are the SEO facet surface (P4 §18). Optionally (6H, decision point): practice-scoped project views (`/projects?practice=…`) could be promoted to indexable landing sections on the practice pages instead — the practice pages already list their projects, so **no additional indexable facet URLs are created**. This is the conservative choice; revisit only with SEO evidence.
- **Sitemap.xml** (server route, `cache-control: max-age=3600`): `/`, 2 practices, services index + 11 services, `/projects`, sectors index + hubs (evidence_tier hub/service_led only), about/team/clients/credentials/contact, careers (only when active), active-verified project + sector/service slugs, legal pages (when published). Lastmod from `updated_at`.
- **robots.txt:** allow all; `Disallow: /admin`, `/auth`; `Sitemap: {origin}/sitemap.xml` (origin from a new `site_url` setting — required for canonicals too, resolved in 6A).

---

## 9. DATA FETCHING ARCHITECTURE

### 9.1 Server functions per route slice (replaces monolithic getSiteData for pages)

| Server fn (all GET, anon-key client, policy-guarded) | Returns |
|---|---|
| `getSiteChrome` | settings (verified), nav (header/footer), footer data — used by root layout |
| `getHomeData` | hero section, featured clients, practices+metrics, featured projects + register preview, process, why_us, sectors w/ counts, verified stats, client walls, leadership, credentials summary |
| `getPracticePage(slug)` | practice + services + equipment/tnc + flagship records + sectors + safety copy |
| `getServicesIndex` / `getServicePage(slug)` | services grouped by practice / service + related records + equipment subset |
| `getProjectsIndex(params)` | facet options + filtered/page records (25) + exact count |
| `getProjectPage(slug)` | project + joins + related + (if B) gallery/quote |
| `getSectorsIndex` / `getSectorPage(slug)` | tiers + counts / hub assembly (evidence panel from real relations) |
| `getCompanyPages` slices | about/team/clients/credentials/contact bundles |
| `getPage(slug)` | retained as-is (+ verification filter via policy) |

`getSiteData` is retained during migration, then deleted in 6I once all consumers are sliced (it stays the admin's problem only — admin queries go direct-client, not via this fn).

### 9.2 TanStack Query configuration (the polling fix — TD1)

```ts
// PUBLIC queries — one shared config
staleTime: 5 * 60_000,   // ≥5 min per brief
gcTime: 30 * 60_000,
refetchOnWindowFocus: false,
refetchOnReconnect: false,
refetchOnMount: false,
// NO refetchInterval anywhere on public keys
queryKey prefix: ["public", ...]
```

- **Admin queries** keep `staleTime: 0` (live editing), separate `["admin", …]` keys, and the admin provider sets these defaults scoped to `/_authenticated` (two QueryClient configs — public router vs admin router — cleanest separation).
- **Server loaders:** `ensureQueryData` on the same query options (request-level dedup during SSR). **Caching taxonomy — four distinct layers, deliberately not conflated:** (1) **TanStack Query client cache** — the 5-min `staleTime`/30-min `gcTime` govern *client-side query freshness* (when the browser refetches); (2) **SSR/request-level memoization** — `ensureQueryData` dedups within a single request/instance; serverless instances start cold, so this is dedup, not a durable cache; (3) **HTTP/CDN caching** — applies only where explicitly set: sitemap (`max-age=3600`) and media proxy (immutable hashed assets); HTML pages are **not** CDN-cached at launch; (4) **database/query execution** — uncached PostgREST calls per (cold) instance. The "5-minute staleTime" is therefore a **public-query freshness behavior**, not a claim that every HTTP response is cached at a CDN for five minutes. No caching platform is introduced.
- **Invalidation & admin revalidation:** admin mutations call `queryClient.invalidateQueries({ queryKey: ["public"] })` for the editing admin's own session; **other visitors converge within ≤5 min** (staleTime). This matches the brief's "≥5 minute stale data" target and Phase 3's accepted propagation window. Exceptions (fresher): none at launch; if a client later wants instant propagation, the upgrade path is `updated_at`-keyed `Cache-Control`/CDN tags — documented, not built (no premature complexity).
- **Loading states:** SSR + `ensureQueryData` means no public skeletons; client-side filter changes use `isPlaceholderData`/keep-previous-data for the 250ms crossfade (P4 §15).
- **Errors:** every route has `errorComponent` (existing pattern) rendering the generic styled error; **raw `error.message` never renders** (S7 fix — error components show a fixed message; detail goes to server logs/`reportLovableError`). **Fallbacks:** data-empty states are designed states (P4 §8.2 empty states; §16.8 fallbacks) — a missing slice renders an honest empty band, never a spinner-forever or crash.

### 9.3 Public vs admin query separation (security)

Public = server functions with anon key → RLS policies enforce verified+active (§3.2). Admin = direct client SDK with user session → staff policies. The public site holds no session authority of any kind (client-side auth checks exist only as admin UX; RLS is the authority — unchanged from Phase 2's good pattern, now with verification in the policy).

---

## 10. COMPONENT ARCHITECTURE

Directory contract (maps P4 §17's 30 components):

```
src/components/site/
  foundation/   Container, Section(band), Type(Display/Statement/Eyebrow/Mono), Button(+variants),
                SmartImage(variants/srcset/focal/lazy), IconMap, Hairline primitives, NoPhotoPanel
  navigation/   Header, MegaMenu, MobileDrawer, Breadcrumb, Footer
  drawing/      SectionHeader([NN·LABEL]), TitleBlock, RecordRef, MetadataStrip, TechnicalTable
  content/      Hero, TrustStrip(marquee), PositioningStatement, PracticeSplit, ProjectFeature,
                ProjectRow, RegisterStrip, MetricPanel/TechnicalMetric, EvidencePanel, Stepper,
                ServiceList(ServiceRow), SectorRegister, ClientWall, CredentialRegister,
                TeamPlate, NameWall, CTABand, SafetyRegister, PlantTable, StatusChip
  interaction/  FilterRail, FilterDrawer, Lightbox, IntakeForm, Toast(admin), Modal(admin)
```

**Contracts:**
- Every component receives **typed DTOs from the server functions** (no `any`, no inline fetching) — the query layer owns data; components are pure presentation + local interaction state. Filters are the exception (URL state → route → loader).
- Reusable across pages (P4 requires): PracticeSplit (home + about), RegisterStrip (home + practice + service + sector), MetricPanel (home + practice + service + case study), Stepper (home + practice + about), TitleBlock (all detail templates), StatusChip (everywhere).
- Page-specific: only composition order and per-page copy live in route files.
- **Icons:** `IconMap` = a hand-written record of ~30 statically-imported lucide icons keyed by name; admin icon field is a dropdown of valid keys (kills `import * as Icons` full-bundle — TD11 — and validates icon names, TD9).
- **SmartImage** owns the P4 §16 rules: fixed aspect (CLS), `variants`→srcset, `focal_point`→object-position, `loading=lazy` default / `eager+fetchpriority=high` via prop for heroes, onError → NoPhotoPanel swap.
- **A11y requirements are component-level contracts** (§17): MegaMenu (keyboard + aria-expanded + Esc), FilterDrawer (focus trap, aria-modal), Lightbox (focus trap, counter, Esc), IntakeForm (labels, describedby, role=alert), TechnicalTable (real `<table>`, scope attrs).

No component exceeds ~150 lines; nothing recreates the monolith (guardrail §24).

---

## 11. HOMEPAGE ARCHITECTURE (decomposition of the 1,097-line monolith)

`src/routes/index.tsx` becomes: route definition + `getHomeData` loader + head + a 13-item composition. Each band maps to component + data slice + CMS source:

| # | Band (P4 §5) | Component | Data slice | CMS source |
|---|---|---|---|---|
| 1 | Hero | `Hero` | hero slice + hero images | `sections.hero` (renders — TD6 fixed) + `media` via settings/section images; metadata line from `extra.metrics` (schema-validated) |
| 2 | Trust strip | `TrustStrip` | clients featured | `clients` (featured, permission-aware) |
| 3 | Positioning | `PositioningStatement` | about copy | `sections.about` (text fields only; extras gone) |
| 4 | Two Practices | `PracticeSplit` | practices + metrics | `practices` |
| 5 | Selected work | `ProjectFeature` ×3 + `RegisterStrip` | featured + preview | `projects` (featured, template-agnostic) |
| 6 | Delivery model | `Stepper` | 5 steps | `content_items.process` |
| 7 | Technical depth | `MetricPanel` | 4 markers | `sections` extras (validated) + computed/equipment refs — values `source_ref`-backed |
| 8 | Sectors | `SectorRegister` | sectors + counts | `sectors` + junction counts |
| 9 | Numbers | `MetricPanel (light)` | 4 counters | computed counts (records/practices) + `content_items.stats` (verified rows only) |
| 10 | Clients | `ClientWall` ×4 groups | clients by category | `clients` + `categories` |
| 11 | Leadership | `TeamPlate` ×4 | leadership group | `team_members` (group=leadership) |
| 12 | Credentials strip | `MetadataStrip` | registry summary | `credentials` (statutory, verified) |
| 13 | Contact band | `CTABand` + `IntakeForm` | settings + offices | `sections.contact`, `offices`, settings |

Hard fixes baked into this map: hero renders CMS (TD6); services/clients/stats never hardcoded (§5.1 canonical sources); the `HeroSlider` component, hardcoded imports, and in-file section functions are deleted; `src/components/site/data.ts` (orphaned duplicate — verified unimported) is deleted in 6A.

---

## 12. PROJECT FILTER ARCHITECTURE (`/projects`)

### 12.1 Query parameters (single-select facets per P4 §8.1)

```
?practice=ug-utilities-electrical   # practice slug (toggle chips: ALL/P01/P02)
&service=ug-ht-lt-cable-laying      # service slug
&sector=smart-city-metro            # sector slug
&state=bihar                        # location_state slug (state list precomputed)
&status=completed|ongoing           # 'unconfirmed' never a filter value
&client=l-t                         # OPTIONAL: not surfaced in rail; used by deep links from client/sector pages
&q=lucknow+metro                    # free text: title + client name ilike
&page=2                             # pagination
```

- **Serialization:** params are slugs, lowercase kebab; empty/default facets omitted from the URL; unknown values → 404-with-reset (invalid facet state renders the register unfiltered with a notice, never an error page).
- **Reset:** `RESET` clears all params (link to `/projects`).
- **Multi-select:** deliberately not offered in v1 (P4 designed single-select rail; 86 records don't need boolean queries). The param schema supports future comma-lists (`service=a,b`) without redesign — documented, not built.

### 12.2 Server/client responsibilities

- **Server (loader):** parse params (Zod: slugs + page int 1–500) → build PostgREST query: base filter `is_active+verified` (policy anyway) + `practice_id`/`status`/`state` eq + junction `.or` filters (`project_services.service_id.eq.…`) + `q` ilike → `.range((page-1)*25, page*25-1)` with `count: 'exact'` → return records + count + facet option lists (with per-facet counts for the rail).
- **Client:** URL is the single source of truth; every control writes via `router.navigate({ search, replace: true })`; loader re-runs SSR-equivalent via the server fn; `isPlaceholderData` drives the 250ms crossfade (P4 §15); result count `aria-live="polite"`.

### 12.3 Pagination (explicit — no infinite scroll)

25/page (P4 §8.2). `LOAD 25 MORE` increments `page` and appends (client state), with `SHOWING 25 OF {N}` mono counter; deep-linkable `page` param renders paged lists server-side (register behavior: shareable, printable). Prev/next links for a11y (real anchors, not buttons).

### 12.4 Canonicalization & indexing

Any non-default facet state: `canonical → /projects` + `noindex` (§8.5). Clean `/projects` and its SSR `h1` ("The record, by project.") are the indexable surface; facet SEO lives on service/sector/practice pages.

### 12.5 Empty states & mobile drawer

Designed empty states per P4 §8.2 (content-aware suggestions); mobile: `FILTERS (n)` button → `FilterDrawer` (bottom sheet, focus-trapped, APPLY writes params + closes; count preview live-updates in the drawer).

---

## 13. FORMS + LEAD PIPELINE

### 13.1 Contact form (the intake sheet, P4 §13)

Fields: `name*` · `email*` · `phone` · `company` · `practice` (segmented: general | p01 | p02 — stored as slug) · `service` (select, **generated from `services` query**, grouped by practice — the canonical-source fix) · `message*` · honeypot (`data.website` — must stay empty) · timing (elapsed ms captured client-side, sent in `data`). Newsletter subscription retained (footer) unchanged except rate limiting.

### 13.2 Server-side flow (`submitEnquiry` — evolved)

1. **Zod validation** (extended schema: practice enum, service_slug max 90, elapsed_ms int, honeypot string). Client-side validates the same schema for UX (shared `src/lib/schemas`).
2. **Honeypot:** non-empty `website` → return `{ok:true}` silently, insert nothing, log flagged attempt.
3. **Timing:** `elapsed_ms < 2500` → same silent-success, no insert (bots don't need error signals).
4. **Rate limiting + insert — one atomic Postgres RPC (S2 fix — no platform dependency):** the server function calls a single transactional Postgres function (`submit_form_submission(...)`, SECURITY DEFINER, argument-validated) that performs the rate-limit check **and** the row insert inside **one PostgreSQL transaction** — never a check-then-insert split across application code, and never relying on sequential JavaScript/server-function calls being implicitly transactional (they are not).
   - **Concurrency mechanism:** the RPC acquires a **PostgreSQL advisory lock keyed to the `ip_hash`** (`pg_advisory_xact_lock(hashtext(ip_hash || ':' || form_type))`), then COUNTs that hash's accepted rows in the window, then inserts or raises. The advisory lock serializes concurrent submissions from the same source; count + decision + insert all execute under the lock within the same transaction, so the check-then-insert race cannot occur. (An equivalent atomic primitive — e.g., a transactionally locked window-row function — is acceptable; the requirement is atomicity, not the specific primitive. An external rate-limit service is explicitly NOT introduced.)
   - **Exact invariants (unchanged thresholds):** **enquiry — maximum 5 accepted rows per `ip_hash` per rolling 10-minute window; newsletter — maximum 3 accepted rows per `ip_hash` per rolling 1-hour window.** Rejected submissions consume no ENQ reference and leave no row.
   - `ip_hash` = SHA-256(client IP + `RATE_LIMIT_SALT` server env), computed in the server fn (IP from the request context — TanStack server fns have access); only the hash, never the raw IP, crosses the RPC boundary. DB-as-shared-state works across serverless instances. Residual risk: IP rotation — accepted for this threat model; a CF WAF rule is an optional later addition, never an architecture dependency.
5. **ENQ reference (allocated inside the same transaction):** within the same RPC transaction, `seq` is taken from the `ref_sequence` row via `SELECT … FOR UPDATE`, the enquiry row is inserted with `ref = 'ENQ-{YYYY}-{seq}'`, and the generated reference is returned to the server fn. **Invariants: no duplicate ENQ references (locked sequence + unique constraint); no race conditions; failed transactions roll back atomically — no partially-created enquiry ever exists, and the enquiry row and its reference are always created together; rate-limit rejections never consume a sequence value.** The reference renders in the success panel (P4 §13.3). Newsletter takes the same RPC path minus the sequence/reference.
6. **Telemetry & duplicates:** `data` jsonb (practice/service/timing) is inserted by the RPC; an accidental double-click is blocked client-side (submit disabled while pending); an identical message+email within 10 minutes → the RPC inserts with `flagged=true` instead of rejecting — this dedup check also runs under the advisory lock, so it is race-free, and leads are never lost to over-strict dedup.
8. **Email notification (TD14 fix — no new dependency):** if `RESEND_API_KEY` + `ENQUIRY_NOTIFY_EMAIL` env vars exist, the server fn POSTs to `https://api.resend.com/emails` via **plain `fetch`** with a small HTML email (enquiry ref, practice routing, reply-to = submitter). Failure to send must not fail the enquiry (log + continue — the row in the admin is the source of truth). No key configured → current behavior (dashboard only), zero code paths change.
9. **Errors:** all failure paths return the same fixed message ("Could not send your enquiry. Please try again or call us." + both phones); Supabase/Resend error details → server log only (S7 fix — no internal info to the client, ever).

### 13.3 Admin visibility

Enquiries screen gains: ref column, practice chip, flagged filter, read/unread (existing). Dashboard unread card unchanged.

---

## 14. AUTH + SECURITY (resolves S1, S2, S3, S5, S7)

### 14.1 Onboarding & signup hardening (S1 — HIGH)

- **Migration (6A):** `drop trigger on_auth_user_created` + drop `handle_new_user()` auto-admin function. After this, new signups create role-less users.
- **Ops checklist (must be done in Supabase dashboard, documented in §21 runbook):** disable public sign-ups ("Allow new users to sign up" OFF) after the admin accounts exist; SSO invite-only if desired.
- **Onboarding runbook:** initial admin = created via Supabase dashboard (Authentication → Add user) → role granted via one-time SQL in the dashboard SQL editor (`insert into user_roles …`) executed by the project owner → subsequent users managed by the admin screen. The runbook is a §21 deliverable; Phase 6 cannot "code" it, only document + verify.

### 14.2 Authentication & route protection

Unchanged pattern (correct): Supabase email/password; `_authenticated` layout `beforeLoad` redirect; admin layout staff check (UX only). Session middleware `attachSupabaseAuth` continues to broker bearer tokens to server fns.

### 14.3 Authorization — role toggles fixed (S5)

- New server fn `setUserRole({userId, role|null})`: **admin-only** — validates the calling session server-side via the existing `requireSupabaseAuth` middleware pattern + `has_role(auth,'admin')` check, then writes `user_roles` using the **service-role client** (env `SUPABASE_SERVICE_ROLE_KEY` — host runtime env, never in repo/VITE — the media proxy already establishes this env's availability). RLS on `user_roles` stays as-is (the service client legitimately bypasses it).
- The admin Users screen switches from client-SDK writes to this fn. Grant cleanup migration removes the now-unneeded direct grants (defense in depth: no `authenticated` path writes roles at all).

### 14.4 Database RLS

- All new tables: public read policy = `is_active AND verification_status='verified'` (§3.2); staff read/write via `is_staff()` (existing helper); junctions: public read follows projects' policy via join? — junctions get their own public read policy with the same verified-join condition (simplest: policies on junctions check the parent project's state via an exists-subquery; staff-write via is_staff).
- `audit_log`: staff-read only, no public policy.
- Public write policy: **only** `form_submissions`/`newsletter_subscribers` anon-insert (existing) — inserts flow through the atomic rate-limit RPC (§13.2.4) and no `update/delete` for anon (unchanged).

### 14.5 Raw JSON / error passthrough (S3, S7)

- S3: schema-validated `sections.extra` (§6.4) — both ends.
- S7: fixed-message error components; `error.message` from any upstream never renders publicly (§9.2); the two public errorComponents currently printing it are corrected in 6C.

### 14.6 Audit trail

DB triggers on `projects, services, sectors, clients, team_members, credentials, offices, equipment, practices, content_items, sections, site_settings, pages` write `audit_log` (actor from `auth.uid()`, action I/U/D, entity, id, `diff` = changed columns' before/after — jsonb). Admin "Audit" screen (admin-only): filterable list. Small, queryable, no external service.

### 14.7 CSRF, CORS, secrets

CSRF middleware (existing — the `createCsrfMiddleware` in `src/start.ts`, verified present and scoped to serverFn handlers) continues to cover server fns; CORS remains Supabase default; `.env`/VITE exposure unchanged (publishable only); service-role + Resend + salt keys are host-runtime only — **never** in repo, never printed (guardrail).

**CSRF is verified by behavior, not by existence (6H acceptance):** Phase 6 must demonstrate — (a) a valid same-origin server-function request (form submit from the running site) is **accepted**; (b) a request with a missing/invalid CSRF context (e.g., stripped cookies/token header, forged origin) is **rejected** by the middleware; (c) the public form/newsletter remain fully usable under the intended legitimate request path (no false positives on the real flow); (d) CSRF failure responses expose **no internal implementation details** (fixed generic message, no stack/middleware names). These are Playwright/manual checks in the §22 P0/P2 suites — the middleware is not redesigned (repository inspection confirmed it is present and correctly scoped; only its *testing* is added).

---

## 15. SEO ARCHITECTURE

| Mechanism | Design |
|---|---|
| **Title template** | `__root` default: `{page} — Capex Construction & Engineering Pvt. Ltd.`; each route's `head()` supplies the page title (project: `{title} — Capex Project Register`; service: `{name} — Capex Services`; sector hub: `{name} — Capex Sectors`; practice: `{name} — Capex`). Home: custom brand title from `seo_title` setting. [Naming gate #1 affects wording.] |
| **Meta descriptions** | From entity `seo_description`/standfirst (fallback rules per template; ≤160 chars enforced in admin with counter). |
| **Canonical** | Every route emits `rel=canonical` to its clean self via `site_url` setting; filtered `/projects` canonicals to `/projects` + noindex (§8.5). |
| **OG / Twitter** | Route head inherits root defaults, overridden per entity; `og:image` from `seo_og_image` setting (migrated branded asset, §7.6.4) — **the broken hardcoded R2 URL in `__root.tsx` is deleted** (verified present today, line ~97). `og:url` per route. |
| **JSON-LD** | `Organization` + `WebSite` on home (from settings: name, logo, phones, address — verified settings only); `Service` on each service page; `BreadcrumbList` on practices/services/projects/sectors detail; `ContactPoint` in Organization. **No `LocalBusiness`** — B2B engineering contractor, not a walk-in premises (the "only where justified" rule: not justified for 4 branch offices either — branches render as Organization `address` entries only if client confirms them public). |
| **Sitemap** | §8.5 server route; XML from live verified content; 1h cache. |
| **Robots** | Updated static file: disallow `/admin`, `/auth`; sitemap ref. `/auth` already noindex via meta. |
| **H1 discipline** | One `h1` per route — homepage hero finally provides it (TD/SEO fix: current homepage has none, Phase 2 §10). |
| **OG image pipeline** | Static branded image at launch (media library); dynamic per-project OG generation is explicitly deferred (no premature complexity — documented as a 6J+ option via a server route). |

---

## 16. PERFORMANCE ARCHITECTURE

**Targets (4G mid-tier device):** LCP ≤ 2.5s (home hero image), CLS ≤ 0.05, INP ≤ 200ms, TTFB ≤ 800ms, home JS ≤ 250KB gz (excluding fonts).

| Mechanism | Design |
|---|---|
| **Polling removal** | §9.2 — the single biggest win (TD1): from 5 queries/5s/visitor to ≤3 queries/route-load. |
| **Icons** | Static icon map (§10) removes the entire lucide namespace from the client graph (TD11). |
| **Dependencies** | **Remove (6A):** 29 unused `@radix-ui/*` (all — none imported by app code; the 46 shadcn/ui components that import them are deleted with the ui library), `recharts`, `embla-carousel-react`, `react-day-picker`, `date-fns`, `cmdk`, `vaul`, `input-otp`, `react-resizable-panels`, `react-hook-form`, `@hookform/resolvers`, `class-variance-authority`. **Keep:** everything the app actually imports — `@supabase/supabase-js`, TanStack stack, `tailwind-merge` + `clsx` (cn util), `sonner` (admin toasts), `lucide-react`, `tw-animate-css`, `zod`, `tailwindcss`/`@tailwindcss/vite`, `vite-tsconfig-paths`. (TD5) |
| **Images** | SmartImage (§10): width/height always (CLS), srcset from upload variants (§7.3), lazy below fold, hero eager+fetchpriority, focal crops via object-position (no server transform dependency). |
| **Fonts** | Existing Google Fonts link (Space Grotesk/Inter) + IBM Plex Mono added, all `display=swap`; `preconnect` already present. No self-hosting complexity at this scale (revisit if INP/LCP misses targets — documented option). |
| **Code splitting** | Route-level by TanStack defaults; admin `ssr:false` lazy chunks (existing); no manual chunking. |
| **Server caching** | Request-level query dedup (§9.2 layer 2) + explicit HTTP cache only where set: sitemap 1h + media immutable (§9.2 layer 3). HTML not CDN-cached at launch; no premature CDN layer. |
| **CLS discipline** | Fixed aspect containers everywhere (P4 ratios); marquee height fixed; filters use keep-previous-data (no collapse-reflow). |
| **Monitoring** | Lighthouse CI in the 6H acceptance run (manual, documented thresholds); no ongoing RUM at launch (GA placeholder wired only if client supplies ID — gate). |

---

## 17. ACCESSIBILITY ARCHITECTURE (P4 §20 → implementation rules)

| Requirement | Implementation |
|---|---|
| Semantics | Landmarks: `header/nav[aria-label]` per nav, `main`, `footer`; registers are real `<table>`s where tabular (TechnicalTable/CredentialRegister/PlantTable) or `<ul>`+`dl` where not; StatusChip/FilterChips are `<button aria-pressed>`; drawer/dialog use `role=dialog aria-modal` + focus trap util (`src/lib/focus-trap.ts`, ~40 lines, no dep). |
| Headings | One h1 per route (route file owns it); SectionHeader renders h2; cards h3; eslint `jsx-a11y` plugin (new dev dep — justified: enforces the rules CI can check) with heading-order, anchor-content, label rules on. |
| Keyboard | Full operability per component contract (§10); skip-link in root; visible focus rings per P4 §20 (2px primary/white); no hover-only affordances anywhere (touch parity). |
| Menus | MegaMenu: trigger `button[aria-expanded][aria-haspopup]`, panel labelled group, Esc closes + restores focus, arrows navigate items (§4.4 P4). |
| Forms | Visible labels (never placeholder-as-label), `aria-describedby` helpers/errors, error summary `role=alert` + focus management, inline on-blur validation (§2.9 P4). |
| Reduced motion | ONE global CSS layer (`@media (prefers-reduced-motion: reduce)`): counters→final values, reveals→none, marquee→static wrapped rows, transitions→≤150ms opacity only. Components don't self-check — the layer overrides (P4 §15.3). |
| Contrast | 4.5:1 body / 3:1 large-display+metrics; token pairs (incl. amber on navy & on light) measured and locked in 6A style tile with values recorded in the doc (P4 §20); `axe` run in 6H acceptance confirms. |
| Touch | 44px targets (48 CTAs) enforced by component contracts; adjacent-gap rule in FilterRail. |
| Alt text | From CMS caption/title (annotation format); decorative `alt=""`; NoPhotoPanel `role=img` + aria-label = ref text. |
| Screen reader counts | Result-count `aria-live=polite`; facet announcements; drawer state changes announced. |

---

## 18. CONTENT MIGRATION STRATEGY

### 18.1 Disposition per collection (KEEP / MIGRATE / TRANSFORM / ARCHIVE / DELETE)

| Current data | Disposition | Detail |
|---|---|---|
| `services` (6 cards) | **TRANSFORM** | → `services` table rows. Clean Rooms restored (gate #5 default); Solar row **NOT migrated** (gate #4 — archived `is_active=false, needs_client_review, source_ref='gate #4 — DOC A cover only'`); seed to 11 per P3 §5.2 requires new rows (drafts until verified). |
| `industries` (12 chips) | **TRANSFORM** | → `sectors` (evidence tiers per P3 §5.3; renames: "IT / SEZ Parks"→Corporate & Commercial scope etc. — wording drafts, verified rows only go public). |
| `projects` (13 rows, hidden) | **MIGRATE as drafts** | → `projects` table, `unverified, is_active=false` (no source refs exist on current rows); the corpus import (§18.3) supersedes and reconciles them (dedupe by title+client). |
| `clients` (56) + `partners` (13) | **TRANSFORM** | → `clients` table; logo rows get `logo_media_id` from the §7.6.1 migration; `logo_permission='pending'` default (name-only rendering until granted — gate #12); partners → relationship `pmc`/`architect`; certification-only logos (Infosys, Cadence, THINK GAS, Eldeco, Paras…) get `verification_note='logo-wall-only, no project record (P1 §5.6)'` + `needs_client_review`. |
| `certifications` (4 cards) | **TRANSFORM** | → `credentials` (statutory/quality/membership mapping; ISO → `needs_client_review` gate #13). |
| `team` (0) / `gallery` (0) / `blogs` (0) / `careers` (0) | — | Nothing to migrate; entities ready for content. |
| `faqs` (5) | **KEEP** (content_items) | Answers referencing branch-office/phone/address facts flagged `needs_client_review` where they touch gates #2/#3. |
| `process` (5) / `why_us` (6) | **KEEP** | Already good, traced copy (P2 §12). |
| `stats` (4) | **KEEP w/ purge** | "150+ Projects", "315+ KM" → `archived` (`needs_client_review`, note: unsourced — P2 §12); "10+ Years" → archived (C9); "24/7" → needs_client_review (service claim — P3 §10.2 note). Numbers band uses computed/verified replacements (P4 §5.9). |
| `testimonials` (3, invented) | **ARCHIVE — do NOT survive** | `is_active=false` + `needs_client_review` + note "invented placeholder (P2 §6) — real quotes only per gate #7". The public renderer never sees them (policy). Component stays dormant. |
| `subsidiaries` (0) | **DELETE** | Collection config row + concept removed. |
| `hero` section row | **REWRITE** | DB row updated to P4 §5.1 draft copy (approval pending — draft fields marked); **rendered** for the first time (TD6). "We dream…" wording removed (gate #8 / C12). |
| `contact` section (incl. `extra.services`) | **MIGRATE** | `extra.services` JSON deleted — form select queries `services` (canonical). Contact copy updated for practice-aware intro. |
| `about` section extras (capabilities/sectors/associations/vision cards) | **MIGRATE** | capabilities→services table; sectors→sectors; association groups→clients; vision cards → about body content (needs_client_review — no formal vision/mission exists, P1 §10). |
| `pages` (4, placeholder text) | **KEEP, unpublish** | `is_active=false` + `needs_client_review` until legal review (gate #9). Policy prevents republishing placeholder text accidentally. |
| `site_settings` | **KEEP w/ flags** | `contact_address` → the P1 profile value? **No guessing**: current site value (Bhutani Alphathum) ≠ documents; settings row set `needs_client_review` with the 3-way conflict documented in note; public policy means address-dependent templates launch only after gate #2 resolves (or the client confirms any one value in writing → verified). Same for `contact_phone` (gate #3). `seo_og_image` → migrated asset (verified). |
| `nav_items` | **RESEED** | New tree per P4 §2.3 (Capabilities/Projects/Sectors/Company + footer); Careers nav `is_active=false`. |
| `sections` (18 rows) | **KEEP w/ cleanup** | Deactivate `projects` toggle trap (section is_active=true + nav consistent); `subsidiaries` row deleted; `team/gallery/blog` sections stay active-but-empty (guards render nothing — fine); `vision_mission` merged row archived. |
| `src/components/site/data.ts` | **DELETE** | Verified unimported orphan (P2 §7 / Phase 5 check) — contains hardcoded duplicate stats/clients incl. unsourced numbers. |
| Stock hero JPGs / `hero-work.mp4` / solar.jpg | **RETIRE** | Removed from `src/assets` once media migration + new hero are live (P4 §21 anti-pattern; C19). `public/uploads/*` service images → media library where still referenced, then files removed. |

### 18.2 Migration principles

1. **Nothing unverifiable crosses into public** — every migrated row starts unverified/inactive; publication is a deliberate act on verified rows only (§3).
2. **No destructive migration:** old `content_items` rows for promoted collections are retained in place, deactivated, with a `migrated_to` note in `meta` until 6I sign-off, then purged in a final cleanup migration (rollback window).
3. **Order:** schema (6B) → seeds (6B) → reference data (practices/services/sectors/clients/credentials/offices — 6B) → content corpus (projects import — 6I) → retire old rows (6I).

### 18.3 Project corpus import (the 86 records)

- Source: Phase 1 §4 tables (DOC B pp.8–9 54 HVAC; DOC A/B p17 22 fire; DOC C p8 10 UG) — compiled as a structured JSON/CSV fixture in-repo (`scripts/corpus/*.json`, reviewed against Phase 1 line-by-line; it's transcription, not invention).
- Import via admin server fn (§6.6) → all rows `unverified, is_active=false, source_ref='DOC B p8 #12'` style.
- Then: batch verification pass (editor marks transcribed-faithful rows `verified` — no open conflicts on those; the 14 conflict-flagged items stay `needs_client_review` with Cn notes per §19).
- Flagships (7 Template-B candidates) get `verification_note='narrative requested (P3 §10.2)'` and remain A until client material arrives.

---

## 19. DATA CLEANUP / CONTENT INTEGRITY CHECKLIST

The technical system supports unresolved states; nothing below is resolved by guessing. (Gates = P3 §10.1 numbering.)

| Issue | Technical handling | Renders publicly as |
|---|---|---|
| Solar vs Clean Rooms | Solar: archived service row w/ gate #4 note. Clean Rooms: seeded service (verified, DOC B p3). | Clean Rooms public; Solar absent until client confirms |
| "Wedream" / "We dream, design & deliver" | Hero row rewritten (draft); copy grep in 6I asserts zero "dream"/"Wedream" strings in public content | New hero copy (approval gate #8) |
| Project duplicates (Gurugram 60 km ×2) | Two records `P1-004/P1-005`, both `status='unconfirmed'`, notes citing C13 | Both records listed, no status chip, until client clarifies packages |
| ONE INDIA double-listed | Two records (30 TR #41, 20 TR #44), `needs_client_review`, note C14 | Both hidden until resolved (or client approves showing both) |
| Phone conflict (1 vs 2 numbers) | `contact_phone` + `contact_phone_secondary` settings; secondary `needs_client_review` (gate #3); header shows primary | One number until gate resolves |
| Address conflict (3 variants) | `offices` corporate row `needs_client_review`, note documents all three variants (gate #2) | Contact page address = verified value only (launch blocker) |
| Team conflicts C1–C7 | All team rows: name + role only; `note`/experience claims stay empty; `verification_note` cites Cn | Name+role plates (P4 §12.2) — no bios until resolved |
| ISO issuer | credentials row `scan_status='on_request'`, `needs_client_review` (gate #13) | "ISO 9001:2015 — certificate on request" wording only |
| "Empanelled" wording | `clients` PMC/architect rows carry conservative label `ASSOCIATED` (gate #14) | "Associated architects & PMCs" register |
| Project statuses (July-2022 docs) | `status='unconfirmed'` on all DOC C "running" rows (gate #11) | No status chip (P4 §8.2) until client confirms |
| Client logo permissions | `logo_permission='pending'` default (gate #12) | Name-only tiles until granted |
| Residential client names | `client_display='Private residential client'` + city; personal names never public | Anonymized records in the register |
| "86 projects" uniqueness | Counts always `RECORDS`; computed; never "projects" (P4 §19.12) | "N records" everywhere |
| Stats 150+/315+/10+ | archived stats rows (P2 §12 / C9) | Computed documented numbers only (P4 §5.9) |

**Launch precondition:** gates #1–#16 (P3 §10.1) — Phase 6 acceptance includes a "gates resolved or explicitly deferred-with-conservative-rendering" review; the DB verification architecture makes "deferred" safe (content simply doesn't render).

---

## 20. ADMIN WORKFLOW (practical, small-company)

**Roles:** Editor (content staff) · Admin (owner/director). No third role, no approval chains beyond verification.

```
CREATE (editor) → draft row [is_active=false]
   → EDIT (editor) — fill fields, relations, media
   → SUBMIT (editor) — set needs_client_review if flagged / request verification
   → VERIFY (admin) — checks vs source_ref → sets 'verified'   [the one human gate]
   → PUBLISH (editor/admin) — is_active=true (trigger requires verified)
   → UPDATE — edits re-verify if factual fields changed (admin re-confirms)
   → ARCHIVE — is_active=false (+sort 9999); reversible
```

- Practical rules: verification is a checkbox-and-note action (30 seconds for a transcribed record); the dashboard "Needs review" queue is the daily work list; the audit log answers "who changed what"; no scheduled publishing, no comments, no notifications beyond enquiry email.
- Editor cannot verify (§3.3) — one deliberate separation of duties, everything else is shared. If the company runs single-user, one admin does both (workflow degenerates gracefully).

---

## 21. ENVIRONMENT + DEPLOYMENT

### 21.1 Environment variables

| Var | Scope | Purpose | Exists today |
|---|---|---|---|
| `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` (+ `VITE_` mirrors) | server+client | anon DB/API access | ✓ |
| `SUPABASE_SERVICE_ROLE_KEY` | **host runtime only** (never repo/VITE) | media proxy, `setUserRole`, importer | ✓ (host — verify present; never print) |
| `RESEND_API_KEY` · `ENQUIRY_NOTIFY_EMAIL` | host runtime, optional | enquiry email (§13.2.8) | ✗ (add when email enabled) |
| `RATE_LIMIT_SALT` | host runtime | ip_hash salt (§13.2.4) | ✗ (generate random; never print) |
| `SITE_URL` (or `site_url` setting) | setting preferred | canonical/sitemap/OG origin | ✗ (new, 6A) |

Secrets rule: nothing secret is ever committed, logged, or echoed; `.env` stays publishable-only (current state is correct).

### 21.2 Local development

`npm run dev` (existing scripts unchanged; the repository is Node/npm-based — bun.lock is a platform artifact and Bun is not a build prerequisite). DB caveat: the repo points at the live Supabase project — **local schema/migration development happens against a separate dev Supabase project** (created once; `.env.local` overrides) so experiments never touch production CMS data. Content/migration dry-runs run against dev first, then apply to prod via migrations (forward-only files, existing Lovable flow).

### 21.3 Environments

- **Dev:** dev Supabase project + local Vite.
- **Staging:** the Lovable preview deployment (its URL is private — fine for review) pointed at… decision: staging uses the **dev Supabase project** (preview deploys from branches sync there), so staging never mutates prod content; the preview validates rendering, not live data.
- **Production:** Lovable Cloud deployment + the production Supabase project. (Platform per AGENTS/Lovable connection; nitro `cloudflare` target retained — no hosting change.)

### 21.4 Migrations

Forward-only SQL files in `supabase/migrations/` (existing convention, timestamped). Phase 6's migration set is enumerated per sub-phase in §23. Every migration is idempotent-where-cheap (`if exists` guards on drops) and runs first on dev. **Pre-migration backup:** Supabase dashboard `pg_dump` download before each prod-applying session (runbook step; PITR is the safety net).

### 21.5 Seed data

A `scripts/seed/*.sql` set (practices 2, services 11, sectors w/ tiers, credentials statutory, offices, equipment, nav tree, hero copy) — reviewed against Phase 1 sources line-by-line; runs on dev first, prod at 6B. Seeds carry `source_ref` values; nothing invented.

### 21.6 Build & deployment

Existing pipeline (Lovable git sync → preview → publish). No CI change required by this architecture; §22's tests run locally/in CI if the client adds Actions (optional — documented, not assumed).

### 21.7 Rollback

- Code: git revert (Lovable syncs; never rewrite published history per AGENTS.md).
- DB: forward-only means rollbacks are **revert-migrations** (new files reversing the change) for schema; for data, PITR restore point (Supabase) — pre-migration dumps make this last-resort-only.
- The 6I "old rows deactivated, not deleted" window (§18.2.2) is itself a rollback for content.

### 21.8 Backups & observability

Supabase automatic daily backups + PITR (verify plan tier in runbook); pre-migration manual dumps; error reporting via existing `reportLovableError` path; admin audit log (§14.6) for content change history; enquiry email + dashboard for lead visibility. No APM at this scale.

### 21.9 Runbook deliverable (6A)

A `RUNBOOK.md` (repo): admin onboarding (per §14.1), signup-disable checklist, env var setup (names + where, no values), backup/restore steps, migration apply procedure, gate-resolution procedure (how a client answer becomes a `verified` row). This is a first-class Phase 6 deliverable, not an afterthought.

---

## 22. TESTING STRATEGY (risk-prioritized)

**Tooling (devDependencies only — the single justified addition set):** `vitest` (unit/integration — zero-config with Vite), `@testing-library/react` + `jsdom` (components/forms), `playwright` (e2e/route/a11y/responsive), `@axe-core/playwright` (a11e), `eslint-plugin-jsx-a11y` (static a11y). No visual-regression service — Playwright screenshot diffs cover the 3 flagship pages manually at 6J.

| Priority | Suite | What / how | Why this priority |
|---|---|---|---|
| **P0** | **Verification & RLS tests** | Against dev Supabase: script asserts (a) anon select on each table returns only `verified+active` rows, (b) publishing an unverified row raises, (c) de-verification unpublishes, (d) editor cannot set verified, (e) anon cannot write content tables, (f) rate-limit thresholds enforced under concurrency (§13.2.4) | The credibility guarantee is the product's core promise |
| **P0** | **Filter/serialization tests** | Vitest unit: param ⇄ query serialization, page math, empty/invalid facet handling, canonical URL generation | The register is the main sales surface; URL bugs = SEO bugs |
| **P0** | **Form pipeline tests** | submitEnquiry: Zod acceptance/rejection, honeypot silent path, timing path, ENQ ref format + uniqueness, **rate-limit RPC invariant (5/10-min, 3/1-hr) including a concurrent-submission race test asserting the thresholds hold under parallel inserts**, email-optional path, error responses contain no internals | Public write surface + anti-spam; the concurrency guarantee is testable, not aspirational |
| **P1** | **Route/e2e (Playwright)** | The 16 public routes render + 404s + careers redirect; mega-menu keyboard; filter drawer; lightbox; mobile viewport (390px) spot-checks per P4 §14 | Catch composition regressions |
| **P1** | **A11y** | axe scan per route (zero criticals); manual keyboard pass checklist (§17); contrast token values asserted in a unit test against WCAG math | P4 §20 is contractual |
| **P1** | **SEO tests** | Unit: per-route head() output (title/canonical/noindex rules incl. facet noindex); sitemap route includes/excludes correctly (verified-only); `__root` has no R2 URL (grep) | The brief's indexing guardrail |
| **P1** | **CMS tests** | Admin flows: project editor validation (B-field gating), import row errors, ordering swaps, users fn authorization | Editors are non-technical; silent failures hurt |
| **P2** | **Component/unit** | SmartImage srcset/focal/CLS attributes, NoPhotoPanel fallback, icon map completeness (no `undefined` icons), section-extra schema rejection | UI integrity |
| **P2** | **Performance** | Lighthouse (home, projects, one detail) thresholds §16; bundle-size assertion (icons map keeps lucide namespace out — check chunk manifest) | Targets documented, enforced at acceptance |
| **P2** | **Security checklist (manual)** | Signup disabled, trigger dropped, service keys absent from client bundle (grep build output), rate limit active **under concurrency**, CSRF behavior verified per §14.7 (accept valid same-origin; reject missing/invalid context; legit form path usable; no internals in failure responses) | Operational verifications |

Definition of done for Phase 6 includes every P0 green, P1 green or explicitly waived with reason, P2 recorded.

---

## 23. PHASE 6 IMPLEMENTATION ORDER

(Recommends the brief's 6A–6J; dependency-driven adjustments noted.)

### 6A — Foundation + infrastructure
**Prereqs:** Approved Phase 4 style tile values (amber/mono/contrast locks) + gates #1 (naming) resolution or explicit deferral.
**Tasks:** dep purge (§16 list) + shadcn/ui deletion + icon map; SmartImage/focus-trap/util primitives; tokens finalization in `styles.css` (P4 §2); `SITE_URL`/origin setting; **security migrations** (drop auto-admin trigger, grants, rate-limit RPC + advisory-lock mechanism on submissions + salt env); audit_log table + triggers; media table extension + uploadMedia upgrade; RUNBOOK.md; delete `src/components/site/data.ts`; fix OG URL in `__root`.
**Files:** `package.json`, `src/components/ui/*` (delete), `src/components/site/*` (new), `src/lib/*`, `src/styles.css`, `__root.tsx`, migrations 6A-1..3.
**Acceptance:** build green, bundle audit shows lucide-namespace gone, P0 security checklist passes, style tile values recorded.
**Rollback:** pure additive — git revert.

### 6B — CMS/database migration
**Prereqs:** 6A.
**Tasks:** all entity tables + junctions + verification columns on content_items/settings/pages + policies + publish/de-verify triggers (§2–3); seeds (§21.5); admin: verification UI, entity editors (projects/services/clients/team/credentials/offices/equipment/practices/sectors), dashboard queue, batched settings, JSON editor removal + section schemas (§6).
**Migrations:** 6B-1..4 (schema, policies, seeds, grants).
**Acceptance:** P0 verification/RLS suite green on dev; editors can create→verify→publish a test record end-to-end.
**Rollback:** revert-migrations; seeds are additive rows.

### 6C — Navigation + routing
**Tasks:** new route files (§8.1) with loaders/head/notFound; header/mega-menu/drawer/footer components; nav_items reseed; breadcrumbs; careers guard; error-component fixes (no `error.message`); SEO head plumbing + robots + sitemap route.
**Acceptance:** all routes render (even if thin), keyboard nav complete, sitemap validates, facet-noindex rule unit-tested.
**Rollback:** routes are additive; old index.tsx still live until 6D swap.

### 6D — Homepage
**Tasks:** `getHomeData` + 13 band components + composition (§11); hero renders CMS; polling config replaced (§9.2 defaults); delete HeroSlider + hardcoded imports; public QueryClient config.
**Acceptance:** P4 §5 spec implemented exactly; quality-bar home checks (P4 §22) pass; LCP target met.

### 6E — Practices + services
**Tasks:** practice pages (mirrored heroes, plant table, T&C register, safety register); services index + detail template (§6–7 P4); equipment/tnc content.
**Acceptance:** template-parity audit (P4 §6.4) passes; canonical source consumers all query `services`.

### 6F — Project system
**Tasks:** projects index (rail/drawer/pagination/URL sync — §12); Template A + B routes (downgrade rule); Lightbox; StatusChip; related-records logic.
**Acceptance:** filter P0 suite green; B-downgrade unit test; 390px drawer verification.

### 6G — Sectors/company/contact
**Tasks:** sectors overview + hubs (evidence gating); about/team/clients/credentials pages; contact page + practice-aware form + ENQ ref + email hook (§13); offices register.
**Acceptance:** no thin hub without evidence badge; forms P0 suite green; credentials register shows real numbers.

### 6H — SEO/performance/security finalization
**Tasks:** JSON-LD; sitemap full population; canonical audit; Lighthouse pass + fixes; email enablement (if env provided); final security checklist (signup off, etc.).
**Acceptance:** SEO tests green; thresholds met; checklist signed.

### 6I — Content migration
**Prereqs:** gates review (resolved or deferred-conservative per §19).
**Tasks:** run §18 dispositions (clients/logos, credentials, offices, testimonials-archive, stats-archive, hero rewrite, settings flags); corpus import + verification pass; old content_items deactivation + `migrated_to` notes; legacy asset retirement; final content grep (no "dream"/"placeholder"/unsourced stats).
**Acceptance:** every public row verified+active or intentionally deferred; register counts render; P1 e2e green on real content.

### 6J — Final polish
**Tasks:** P4 §22 full quality-bar audit; responsive matrix pass at all breakpoints; motion + reduced-motion audit; a11e/axe pass; visual screenshot review (hero/projects/credentials); RUNBOOK finalization.
**Acceptance:** Phase 4 quality bar — every box — plus §22 test definitions of done.

**Cross-cutting rule:** each sub-phase ends deployable (Lovable branch in working state per AGENTS.md) — no long-lived broken branches.

---

## 24. WHAT MUST NOT HAPPEN IN PHASE 6 (guardrails)

1. No redesigning Phase 4 while coding — visual deviations require logging a conflict, not improvising.
2. No inventing content — every public fact carries `source_ref`; drafts need client approval.
3. No stock photography; no AI-generated "Capex" imagery; no fake maps.
4. No fake testimonials; no fabricated statistics; "RECORDS" wording everywhere counts appear.
5. No silent conflict resolution — §19 items stay flagged until client answers.
6. No giant page components — routes ≤ ~200 lines composing components; no new monoliths.
7. No polling — no `refetchInterval` on public queries; ≥5-min staleTime.
8. No raw-JSON editing dependency — schemas at both ends; JSON textarea never returns.
9. No open admin signup — trigger dropped + dashboard signups disabled before launch.
10. No arbitrary facet indexing — filters canonical+noindex; sitemap = curated routes only.
11. No permanent Lovable asset coupling — all imagery via the media library proxy.
12. No unnecessary dependencies — additions require a written reason (this doc's list is the budget: test tooling only).
13. No UI-library rewrite — no shadcn/radix reintroduction; owned components only.
14. No feature creep — no insights/blog/news/CRM/multilingual in Phase 6 scope.
15. No client-side authorization assumptions — RLS/policies are the authority.
16. No secrets in repo/logs/build output.
17. No history rewriting on the Lovable-connected branch (per AGENTS.md).
18. No skipping the verification workflow "just to launch" — the architecture makes that impossible; do not route around it.

---

## 25. PHASE 5 ACCEPTANCE CRITERIA (self-check)

- [x] Target database architecture (§2 — **9 new content/entity tables + `audit_log` + 3 junction tables**, plus evolutions of existing tables; entity-by-entity definitions in §2.3; `audit_log` is infrastructure, not a content entity)
- [x] CMS architecture (§6 — screen map, editors, validation, JSON removal, import)
- [x] Verification workflow (§3 — two-axis state, RLS-enforced, triggers, permissions, queue)
- [x] Project architecture (§4 — single schema, A/B, downgrade rule, refs)
- [x] Content relationships (§5 — canonical graph, dedup map, query strategy)
- [x] Media architecture (§7 — extension, upload pipeline, proxy, migration, fallbacks)
- [x] Routing (§8 — tree, validation, redirects, facet indexing rules)
- [x] Data fetching (§9 — slices, query config, admin revalidation, errors)
- [x] Caching (§9.2 — four-layer taxonomy: client query cache 5-min staleTime / 30-min gcTime, request-level dedup, explicit HTTP cache on sitemap+media only, uncached DB per instance)
- [x] Component architecture (§10 — groups, contracts, ownership)
- [x] Forms (§13 — validation, anti-spam, refs, email, errors)
- [x] Auth/security (§14 — S1/S2/S3/S5/S7 resolutions, audit)
- [x] SEO (§15 — templates, canonical, JSON-LD, OG fix, sitemap)
- [x] Performance (§16 — targets + mechanisms + dep purge)
- [x] Accessibility (§17 — mapped to implementation rules)
- [x] Migration (§18 — per-collection dispositions + corpus import)
- [x] Admin workflow (§20 — practical roles/gates)
- [x] Deployment (§21 — envs, dev/proj separation, runbook, rollback)
- [x] Testing (§22 — risk-prioritized suites + tooling)
- [x] Exact Phase 6 order (§23 — 6A–6J with tasks/files/migrations/acceptance/rollback)

---

## 26. FINAL CONSISTENCY AUDIT vs PHASES 1–4

**1. Carried forward unchanged:** platform retention (P2 §16); verification-first content ops (P3 §9.3 → hardened into RLS policies); two-practice IA and all P3 entity decisions; P3 §4 project model incl. A/B templates and no-fabrication rule; P3 §5.1 canonical-source dedup; P4's 30-component inventory, token system, band map, filter design (single-select rail, 25/page, drawer), form spec, media priority hierarchy + no-photo treatment; P3 §10.1 gates #1–16 as launch blockers; P3 §13.18 phasing (mapped to §23); Phase 2 TD/S fixes as enumerated.

**2. Newly introduced (technical, consistent with P3/P4):** RLS-policy-level verification enforcement + publish/de-verify triggers (P3 left the enforcement point open; this is the strongest reading); two-axis state model (publication vs verification) replacing the brief's five-state suggestion (documented rationale §3.1); `project_clients` junction with roles (supports the BGRL/Vichitra reality P1 documented); DB-based rate limiting via ip_hash triggers (no platform dep); Resend via plain fetch (no new dependency); client-side canvas image variant pipeline (no sharp/transform dependency); `setUserRole` service fn; audit_log; corpus import fn; local `src/assets/clients/*` as the logo migration source (discovered in repo inspection — resolves TD8 without re-extraction); dev/staging Supabase-project separation; test tooling as the only dependency additions.

**3. Conflicts discovered:** none material. Two clarifications: (a) P4 §5.9 counter source-citation style (`— Company profile, 2022 revision`) vs public-source discipline — resolved: public captions may cite "company profile documents" generically but never internal phase refs; final wording is a client gate (already in P4 §24 list). (b) P4 allowed an optional >8s hero cross-fade; Phase 5 builds the static hero with the cross-fade as a CMS-conditional (≥2 images) — no contradiction, just an explicit build order.

**4. Unresolved client gates (unchanged, now technically enforced):** P3 §10.1 #1–16; P4 draft copy set (hero, band headlines, response-time promise, citation style); amber final value + mono family (6A style tile); careers evergreen copy; equipment counts publication (once verified); hero image selection.

**5. Technical risks:** R1 — Lovable-path logo bytes may not match local assets 1:1 (mitigate: filename mapping + manual review of 40 logos, fallback to name-only). R2 — dev/prod Supabase divergence (mitigate: forward-only migrations applied to both, dev first). R3 — serverless cold-cache per-instance (accepted: bounded query count; documented upgrade path). R4 — editor capacity for 86-record verification pass (mitigate: bulk actions + the queue; the pass is checkbox-fast for transcribed rows). R5 — email deliverability unproven (optional feature; failure doesn't lose leads — DB is source of truth). R6 — route/generation regressions during the monolith swap (mitigate: 6C adds routes before 6D swaps home; e2e in 6D acceptance). R7 — name unknown: the media proxy's current service-role sourcing should be verified at 6A (its env availability is assumed per Phase 2's description; runbook step).

**6. Assumptions:** (a) Supabase project tier supports PITR/backups per runbook verification; (b) Lovable Cloud remains the host (no platform migration in scope); (c) IBM Plex Mono passes the 6A contrast/style review (JetetBrains Mono fallback named in P4); (d) client supplies hero/photography source files in reasonable time (brochure extraction is the bounded fallback); (e) the single-admin reality (workflow degenerates gracefully, §20).

**7. Phase 6 must NOT infer on its own:** any gate #1–16 answer; hero/band final copy; amber/mono final values; facet-page indexability beyond §8.5's conservative rule; any project/client/team "cleanup" beyond §19's conservative renderings; any new dependency; any schema deviation from §2 without logging a conflict against this document. Where this document and a Phase 3/4 decision appear to conflict, **stop and log the conflict** — do not resolve silently (the rule that has governed every phase).

---

---

## 27. FINAL CORRECTION PASS & ARCHITECTURE LOCK (2026-09-03)

This section records the final correction + consistency pass performed after the architecture was approved in principle. Six corrections were applied; no settled strategic decision from Phases 3–4 was reopened.

### 27.1 Corrections applied

1. **Table-count terminology normalized.** All references now read "**9 new content/entity tables + `audit_log` + junction tables**" (§1 Database row, §2.1, §25). `audit_log` is explicitly infrastructure, never counted as a content entity.
2. **Rate-limit concurrency made atomic.** §13.2.4 rewritten: the rate-limit check and the insert now execute inside **one transactional Postgres RPC** guarded by a **PostgreSQL advisory lock keyed to `ip_hash`** — eliminating the check-then-insert race. Exact invariants restated: **enquiry ≤5 accepted rows per ip_hash per rolling 10-minute window; newsletter ≤3 per ip_hash per rolling 1-hour window** (thresholds unchanged). No external rate-limit service introduced.
3. **ENQ reference generation made explicitly transactional.** §13.2.5 rewritten: sequence allocation (`SELECT … FOR UPDATE`) **and** enquiry insertion happen inside the same single transactional Postgres function, returning the reference atomically. Invariants: no duplicate references, no races, no partially-created enquiries, rate-limit rejections consume no sequence. No ORM/dependency added.
4. **Bun prerequisite removed.** §7.6.1 and §21.2 rewritten: scripts run through the **existing Node/npm project toolchain**; Bun is not a prerequisite and must not be added (`bun.lock` is a platform artifact).
5. **CSRF made behavior-testable.** §14.7 and §22 strengthened: Phase 6 must verify (a) valid same-origin requests accepted, (b) missing/invalid CSRF context rejected, (c) the legitimate form path remains usable, (d) failures expose no internals. The existing middleware is retained (inspection confirmed present and scoped); only its testing was added.
6. **Caching taxonomy disambiguated.** §9.2, §1, §16, §25 updated: four distinct layers — TanStack Query **client cache** (5-min staleTime / 30-min gcTime = client query freshness, *not* HTTP/CDN caching), **request-level SSR dedup**, **explicit HTTP/CDN cache** (sitemap 1h + immutable media only; HTML not CDN-cached at launch), and **uncached DB execution**. No caching platform introduced.

### 27.2 Post-correction consistency verification (Phases 1–4)

- **Strategy:** two-practice IA intact (§2.3 practices, §8.1 routes, §11 band 4); practice→service→project graph intact (§5); project-first architecture intact (§1, §12); no generic-contractor redesign introduced anywhere.
- **Projects:** Template A remains the minimum truthful record (§4.1); Template B remains evidence-gated with the enforced downgrade rule and publish-trigger gate (§4.2); no fabricated/incomplete evidence can become public (§3.2 policy + trigger).
- **Verification:** enforced at DB/RLS layer (§3.2); application queries are never the boundary; unverified rows cannot leak (policy-level filter); editors cannot self-verify (admin-only transition, trigger-checked).
- **CMS:** raw-JSON editor removed with schemas at both ends (§6.4); relational entities canonical; **services canonical in one table** (§5.1), **clients canonical in one table**, **projects canonical in one table**, **media library the sole public imagery source** (§7).
- **Media:** no permanent Lovable R2 dependency (migration §7.6); no stock photography, no AI-generated fake Capex imagery, no fake project photography (guardrails §24.2–3; P4 §21); NoPhotoPanel fallback remains (§7.7).
- **Security:** open signup removed + auto-admin trigger dropped (§14.1); role management admin-only via service-fn (§14.3); service-role credentials host-runtime only (§21.1); no secrets in bundles/logs; CSRF enforced + now behavior-tested (§14.7); public writes limited to the two intended forms via the atomic RPC (§13.2, §14.4); rate limiting concurrency-safe (§13.2.4 as corrected).
- **SEO:** canonical URLs per route (§15); sitemap = curated public routes only (§8.5); arbitrary filters noindex/canonicalized (§12.4); verified-only content enters sitemap; Organization/Service/Breadcrumb JSON-LD retained (no LocalBusiness — justified in §15); broken Lovable OG URL deleted (§7.6.4, §15).
- **Performance:** no public polling (§9.2); staleTime ≥5 min; route-sliced queries; dependency purge (§16); curated icon map; image variants (§7.3); no unnecessary runtime dependencies (only test tooling + one font).
- **Accessibility:** keyboard navigation, focus management/traps, visible focus, 44px targets, labelled forms with error semantics, global reduced-motion layer, WCAG contrast locks, `aria-live` result announcements (§17).
- **Architecture:** route files ≤ ~200 lines compositional (§8.2); no new monolith (§11); component ownership explicit (§10); no shadcn/radix reintroduction (§16 dep purge is definitive); no unnecessary abstraction (hybrid CMS, §2.1).
- **Scope:** Phase 6 adds no blog, news, insights, CRM, multilingual, client portal, site-wide search, subsidiaries, partner portal, individual team pages, or dashboards (§24.14; P3 §3.14).

### 27.3 Inconsistencies found during the audit (beyond the six corrections)

- **"Gate wording internal to the client-gate list":** P3 §10.1 lists "Clean Rooms wording" as part of gate #5; the current Phase 5 §18.1/§19 handling (Clean Rooms restored as a seeded *service* per PDF evidence; wording of its description is draft-copy, not factual) is consistent — no change needed, recorded for traceability.
- **"Server caching" naming:** §16's performance table originally implied a durable server cache ("per-instance query cache") — corrected in pass item 6 to "request-level query dedup" (serverless instances are cold; durability was never designed or claimed elsewhere). No behavior change — documentation-only fix.
- **No other material inconsistencies found.** All cross-references (§ numbering, gate numbering, template names, table names, sub-phase mapping) verified consistent across §1–26.

### 27.4 Items deliberately left unchanged

- All Phase 3 strategic decisions and Phase 4 visual decisions (none reopened; zero conflicts).
- Rate-limit thresholds (5/10-min, 3/1-hr) — explicitly preserved.
- CSRF mechanism, Resend-via-fetch, DB-based rate limiting, platform retention, hybrid CMS model, verification state model, dependency purge list, implementation order 6A–6J, all guardrails.
- The conservative renderings in §19 (Gurugram dual records, ONE INDIA hidden, statuses unconfirmed, etc.).

### 27.5 Client gates — remaining unresolved (never inferred)

Per §19 and P3 §10.1, the following remain **client decisions**, preserved as verification gates for Phase 6 content work (they do not block architecture): official naming (g1); corporate address (g2); phone set (g3); Solar + Open Access (g4); Clean Rooms wording (g5); statistics wording (g6); testimonials (g7); hero/dream wording (g8); policies/legal (g9); hero copy set (g10); project statuses (g11); logo permissions (g12); ISO issuer/scan (g13); empanelled wording (g14); jurisdiction (g15); branch/unit confirmation (g16) — plus P4's copy approvals (band headlines, response-time promise, counter citation style, careers copy, amber final value, mono family, hero image selection, equipment-count publication). The verification architecture renders every one of these safely deferrable: unresolved content simply does not render.

### 27.6 Architecture lock

**PHASE 5 STATUS: LOCKED**

The architecture is internally consistent, technically defensible, and explicitly locked for implementation. Phase 6 executes §23's sequence (6A–6J) against §24's guardrails; any deviation from this document must be logged as a conflict, not silently resolved.

**PHASE 6 READINESS: READY**

Phase 6 can begin. All remaining client gates are preserved as verification gates within the CMS workflow — they gate *content publication*, not *architecture or build*, and the system is designed so no gate can force a redesign. Technical prerequisites are met: the platform, schema design, enforcement mechanisms, migration plan, test strategy, and runbook deliverable are fully specified with no open architectural decisions.

**Recommended next step:** Commence Phase 6, sub-phase 6A (Foundation + infrastructure) per §23 — beginning with the style-tile lock (amber value, mono family, contrast measurements) and the security migrations, exactly as sequenced.

---

**Phase 5 is complete and locked. No implementation, no Phase 6 work, no code/database/migration/dependency changes were made in this pass — this was an architecture/documentation lock pass only.**
