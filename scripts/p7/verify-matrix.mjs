// PHASE 7 — API verification matrix probe (anon REST = the public site's path).
// Run AFTER migrations are applied:  node scripts/p7/verify-matrix.mjs
// Tests the full visibility matrix per Phase 7 §29 via the same anon-key
// PostgREST surface the site uses. Read-only. Exits 1 on any failure.

import fs from "node:fs";

const env = fs.readFileSync(".env", "utf8");
const URL = env.match(/SUPABASE_URL=([^\r\n]+)/)[1].trim().replace(/"/g, "");
const KEY = env.match(/SUPABASE_PUBLISHABLE_KEY=([^\r\n]+)/)[1].trim().replace(/"/g, "");

const TABLES = ["practices","services","sectors","clients","projects","team_members",
  "credentials","offices","equipment","content_items","site_settings","pages","review_queue"];

let failures = 0;
function check(name, cond, detail = "") {
  if (cond) console.log(`  PASS  ${name}`);
  else { failures++; console.error(`  FAIL  ${name}  ${detail}`); }
}

async function anonSelect(table, query = "select=*&limit=1000") {
  const r = await fetch(`${URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (r.status === 404) return { status: 404, rows: [] };
  if (!r.ok) return { status: r.status, rows: [], error: await r.text() };
  return { status: 200, rows: await r.json() };
}

console.log("PHASE 7 — VERIFICATION MATRIX (anon = public visibility)");

for (const t of TABLES) {
  const { status, rows, error } = await anonSelect(t);
  if (status === 404) { console.log(`  SKIP  ${t} (not applied yet)`); continue; }
  if (status !== 200) { failures++; console.error(`  FAIL  ${t} reachable: ${status} ${error ?? ""}`); continue; }

  // Matrix rule: any visible row must be verified + active.
  const violating = rows.filter(
    (r) => (r.is_active === true || r.is_active === undefined) && r.verification_status !== undefined && r.verification_status !== "verified",
  );
  // site_settings uses verification without is_active
  const visibleSettings = rows.filter((r) => r.verification_status !== undefined && r.verification_status !== "verified");
  if (t === "site_settings") {
    check(`${t}: only verified settings visible`, visibleSettings.length === 0,
      `visible unverified: ${visibleSettings.map((s) => s.key).join(",")}`);
  } else if (t === "review_queue") {
    // caller-rights view: anon should see only what RLS allows (verified+active rows)
    const bad = rows.filter((r) => r.is_active === true && r.verification_status !== "verified");
    check(`${t}: anon sees no active+unverified rows`, bad.length === 0);
  } else if (t === "content_items" || t === "pages") {
    const bad = rows.filter((r) => r.is_active && r.verification_status !== "verified");
    check(`${t}: only verified+active visible`, bad.length === 0,
      bad.map((b) => `${b.collection ?? ""}/${b.title}`).slice(0, 5).join(", "));
  } else {
    check(`${t}: only verified+active visible`, violating.length === 0,
      violating.map((b) => b.name ?? b.title ?? b.item ?? b.city).slice(0, 5).join(", "));
    const active = rows.filter((r) => r.is_active === true);
    console.log(`        ${t}: ${rows.length} visible (${active.length} active-verified)`);
  }
}

// Publish-guard negative tests are impossible via anon (no write access — good).
// Verify anon has NO write access:
(async () => {
  const r = await fetch(`${URL}/rest/v1/projects`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "content-type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ title: "probe", slug: "probe-should-fail", practice_id: "00000000-0000-0000-0000-000000000000", location_city: "x", location_state: "x" }),
  });
  check("anon CANNOT insert projects", r.status >= 400, `status ${r.status}`);
})();

// Specific spot checks (only meaningful when migrations are applied):
const projects = await anonSelect("projects");
if (projects.status === 200 && projects.rows.length) {
  const slugs = new Set(projects.rows.map((p) => p.slug));
  for (const hidden of ["gurugram-smart-city-electrical-06","one-india-hvac-30tr","aurangabad-cmdp-pipe-laying","dhanbad-smart-city-electrical"]) {
    check(`conflict row hidden: ${hidden}`, !slugs.has(hidden));
  }
  for (const visible of ["patna-smart-city-electrical","world-trade-tower-hvac-fire"]) {
    check(`verified row visible: ${visible}`, slugs.has(visible));
  }
  const residential = projects.rows.filter((p) => p.client_display && /Mr\.|Mrs\.|Khan|Gupta|Bhatia|Sharma/.test(p.client_display));
  check("no de-anonymized residential clients on public surface", residential.length === 0,
    residential.map((p) => p.client_display).join(", "));
  const bad86 = projects.rows.some((p) => /86 projects/i.test(p.title + (p.scope_line ?? "")));
  check(`no "86 projects" wording anywhere public`, !bad86);
}

const settings = await anonSelect("site_settings");
if (settings.status === 200) {
  const keys = new Set(settings.rows.map((s) => s.key));
  check("disputed address setting hidden from anon", !keys.has("contact_address"));
  check("phone setting hidden while gate #3 open", !keys.has("contact_phone"));
  // (verified settings like footer_note SHOULD appear)
  check("footer_note visible (verified)", keys.has("footer_note"));
}

const stats = await anonSelect("content_items", "select=*&collection=eq.stats&limit=50");
if (stats.status === 200) {
  const active = stats.rows.filter((s) => s.is_active).map((s) => `${s.title} ${s.subtitle}`);
  check("exactly 4 public stats", active.length === 4, active.join(" | "));
  check("no legacy 150+/315+/10+ stats", !active.some((s) => /150\+|315\+|10\+/.test(s)));
  check("24/7 stat not public", !active.some((s) => /24\/7/.test(s)));
}

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
