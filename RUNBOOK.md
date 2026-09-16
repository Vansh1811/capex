# Capex Website — Operations Runbook

Operational procedures for the Capex Construction & Engineering website
(TanStack Start + Supabase on Lovable Cloud).

**Architecture (2026-09, minimal backend reduction):** the website is a
premium STATIC frontend — all public content renders from the verified
corpora in `src/lib/*-corpus.ts` (projects, services, practices, sectors,
people, clients, credentials) plus `src/lib/site-settings.ts` and
`src/lib/static-pages.ts` (policy pages). No CMS, no admin panel, no
content database. The ONLY dynamic surface is two submission flows:

- **Contact / enquiry** — `/contact` → `submitEnquiry` → `submit_form_submission` RPC → `form_submissions`
- **Credential requests** — `/credentials` → `submitCredentialRequest` → `submit_credential_request` RPC → `credential_requests`

---

## 1. The one migration to apply

`supabase/migrations/20260908120000_minimal_backend_reduction.sql` — apply
via Supabase Dashboard → SQL Editor (the environment has no service-role key
or CLI token; this is the documented path for every migration in this repo).

The migration:

1. Creates `ref_sequence` + `credential_requests` and the two SECURITY DEFINER RPCs
   (the enquiry RPC was previously designed but never applied — both forms fail with
   the graceful generic message until this migration runs).
2. Hardens the database: revokes ALL anon/authenticated table grants — the two RPCs
   are the entire public surface.
3. Retires the CMS tables (`content_items`, `sections`, `pages`, `categories`,
   `nav_items`, `media`, `newsletter_subscribers`, `site_settings`, `profiles`,
   `user_roles`) — content now lives in the repo corpora.

**Verify after applying** (anon-key REST):

- `POST /rest/v1/rpc/submit_form_submission` and `.../submit_credential_request`
  appear in the OpenAPI spec (`GET /rest/v1/`).
- `GET /rest/v1/form_submissions` and `GET /rest/v1/credential_requests` return
  **404/42501** with the anon key (no table surface).
- One enquiry + one credential request submitted through the site forms return
  `ENQ-YYYY-NNNN` / `CREQ-YYYY-NNNN` references.

Until the migration is applied, both forms render their failure states on submit
("could not be sent just now…") — by design; no data is lost, nothing else breaks.

## 2. Environment variables

Host-runtime (Lovable Cloud / deployment platform) — never in repo, logs, or client:

| Variable                   | Required    | Purpose                                                                              |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| `SUPABASE_URL`             | yes         | submissions backend                                                                  |
| `SUPABASE_PUBLISHABLE_KEY` | yes         | anon key — execute-only on the two RPCs                                              |
| `RATE_LIMIT_SALT`          | recommended | random string for ip_hash (`openssl rand -hex 32`); without it a dev default is used |
| `SITE_URL`                 | recommended | production origin for the sitemap URL set                                            |

No longer required (CMS/admin retired): `VITE_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`,
`RESEND_API_KEY`, `ENQUIRY_NOTIFY_EMAIL`, admin/auth configuration. `.env` in-repo
contains only the publishable URL/key.

## 3. Reading submissions (the inbox)

Supabase Dashboard → Table Editor → `form_submissions` / `credential_requests`
(service-role surface; no public read exists by policy). Enquiries carry
`ref` (ENQ-…), credential requests `ref` (CREQ-…). `flagged=true` rows are
duplicates-by-content within 10 minutes — kept, never lost, reviewed by hand.
Rate-limited submissions are rejected with error code `P0002` before insert.

## 4. Content changes (no admin panel)

All public content is code, in the verified corpora:

- Projects: `src/lib/project-corpus.ts` (49 published records)
- Services/practices/equipment: `src/lib/services-corpus.ts` (11 + 2)
- Sectors: `src/lib/sector-corpus.ts` (9)
- People: `src/lib/people-corpus.ts` (16 published, 22 named)
- Clients: `src/lib/client-corpus.ts` (66 names)
- Credentials: `src/lib/credentials-corpus.ts` (10)
- Site settings (phone/email/wordmark), offices, footer registrations:
  `src/lib/site-settings.ts`
- Policy pages: `src/lib/static-pages.ts`

Change a file, ship a deploy. Nothing is database-managed; do not invent data —
the corpora are transcribed from the audited Phase 6/7 record (see the source_ref
fields and `scripts/p7/expected-counts.md`).

## 5. Security posture

- The anon key can do exactly two things: execute the two submission RPCs. All
  table grants are revoked; RLS is enabled on `credential_requests` with no
  policies (deny-all) and `form_submissions` retains its insert-only history
  minus grants.
- Raw IPs are never stored — SHA-256 with `RATE_LIMIT_SALT` (server-side only).
- Honeypot + <2.5s timing screen in both forms; silent success for bots.
- Rate limits (enforced in the RPC transaction): 5 accepted submissions per
  ip_hash per rolling 10 minutes for each flow.
- Duplicate content within 10 minutes is flagged, not rejected — leads are never lost.
- Users see fixed generic error strings; internals never leak to the browser.

## 6. Backups & restore

- Supabase automatic daily backups + PITR (verify plan tier).
- Pre-migration manual dump: Dashboard → Database → Backups (before §1's migration).

## 7. Launch checklist

- [ ] `20260908120000_minimal_backend_reduction.sql` applied; §1 verification green
- [ ] `RATE_LIMIT_SALT` set in host env
- [ ] `SITE_URL` set to the production origin
- [ ] One test enquiry + one test credential request submitted and visible in the
      Table Editor with ENQ/CREQ references
- [ ] sitemap.xml validates; robots.txt allows public routes (admin/auth dirs are gone)
- [ ] Policy page placeholders reviewed with legal counsel when convenient (P2)
