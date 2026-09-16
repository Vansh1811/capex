import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { submissionClient, requestHeaders } from "@/lib/submission-client";

/**
 * SUBMISSION BACKEND — the entire dynamic surface of the site.
 *
 * Two flows, one shape:
 *   • submitEnquiry           — the Contact page's open line
 *   • submitCredentialRequest — the Credentials page's verification desk
 *
 * All row work happens in atomic Postgres RPCs (submit_form_submission /
 * submit_credential_request): validation, duplicate screening, rate limiting
 * and reference allocation are the database's job — this module only
 * validates input, screens bots, hashes the request IP and calls the RPC.
 * Failures surface fixed generic messages — never internals (Phase 2 S7).
 *
 * Static site content never passes through here — see src/lib/site-data.ts.
 */

// ---------- shared screens ----------

const GENERIC_SUBMISSION_ERROR =
  "Could not send your request. Please try again or call +91 98185 40532.";

/** Honeypot/timing screen BEFORE any row work: silent success, no insert. */
function isBot(data: { website: string; elapsed_ms?: number | undefined }): boolean {
  if (data.website !== "") return true;
  const elapsed = data.elapsed_ms ?? 0;
  if (elapsed > 0 && elapsed < 2500) return true;
  return false;
}

/** SHA-256 hash with server salt — the raw value is never stored or logged. */
async function hashWithSalt(value: string, salt: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + value));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Caller + UA hashes for the RPC's rate-limit key. */
async function sourceHashes(headers: Headers) {
  const salt = process.env.RATE_LIMIT_SALT ?? "dev-unsalted";
  const [ipHash, uaHash] = await Promise.all([
    hashWithSalt(getIp(headers), salt),
    hashWithSalt(headers.get("user-agent") ?? "", salt),
  ]);
  return { ipHash, uaHash };
}

// ---------- contact / enquiry flow ----------

const enquirySchema = z.object({
  form_type: z.string().max(40).default("contact"),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(1).max(4000),
  data: z.record(z.string(), z.string()).optional().default({}),
  // anti-spam telemetry: honeypot + client elapsed time
  website: z.string().max(200).optional().default(""),
  elapsed_ms: z.number().int().nonnegative().optional().default(0),
  practice: z.string().max(90).optional().default(""),
  service_slug: z.string().max(90).optional().default(""),
});

/**
 * Enquiry intake. The RPC (submit_form_submission) enforces, inside one
 * transaction: advisory lock on ip_hash → duplicate check (identical
 * email+message within 10 min → flagged, never lost) → rate limit
 * (5 accepted per ip_hash per 10 minutes) → locked ENQ sequence allocation
 * + insert.
 */
export const submitEnquiry = createServerFn({ method: "POST" })
  .middleware([requestHeaders])
  .validator((data: unknown) => enquirySchema.parse(data))
  .handler(async ({ data, context }) => {
    if (isBot(data)) {
      console.info("submission screened: honeypot/timing");
      return { ok: true, ref: null as string | null };
    }

    const sb = submissionClient();
    const headers = (context as { requestHeaders?: Headers }).requestHeaders ?? new Headers();
    const { ipHash, uaHash } = await sourceHashes(headers);

    const { data: ref, error } = await sb.rpc("submit_form_submission", {
      p_form_type: data.form_type,
      p_name: data.name,
      p_email: data.email,
      p_phone: data.phone,
      p_subject: data.subject,
      p_message: data.message,
      p_data: { ...data.data, practice: data.practice, service_slug: data.service_slug },
      p_ip_hash: ipHash,
      p_user_agent_hash: uaHash,
      p_practice: data.practice || null,
      p_service_slug: data.service_slug || null,
    });

    if (error) {
      console.error("enquiry rpc rejected:", error.code ?? "unknown");
      throw new Error(GENERIC_SUBMISSION_ERROR);
    }
    return { ok: true, ref: (ref as string | null) ?? null };
  });

// ---------- credential request flow ----------

const credentialRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(160).optional().default(""),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  /** The register entry being requested — title + registry number of record. */
  credential: z.string().trim().min(1).max(200),
  message: z.string().trim().max(2000).optional().default(""),
  // anti-spam telemetry: honeypot + client elapsed time
  website: z.string().max(200).optional().default(""),
  elapsed_ms: z.number().int().nonnegative().optional().default(0),
});

/**
 * Credential/document request intake (the verification desk). Same contract
 * as the enquiry RPC: one atomic transaction, advisory lock → duplicate check
 * → rate limit (5 per ip_hash per 10 minutes) → locked CREQ sequence
 * allocation + insert. Returns the CREQ reference for the confirmation state.
 */
export const submitCredentialRequest = createServerFn({ method: "POST" })
  .middleware([requestHeaders])
  .validator((data: unknown) => credentialRequestSchema.parse(data))
  .handler(async ({ data, context }) => {
    if (isBot(data)) {
      console.info("credential request screened: honeypot/timing");
      return { ok: true, ref: null as string | null };
    }

    const sb = submissionClient();
    const headers = (context as { requestHeaders?: Headers }).requestHeaders ?? new Headers();
    const { ipHash, uaHash } = await sourceHashes(headers);

    const { data: ref, error } = await sb.rpc("submit_credential_request", {
      p_name: data.name,
      p_company: data.company || null,
      p_email: data.email,
      p_phone: data.phone || null,
      p_credential: data.credential,
      p_message: data.message || null,
      p_ip_hash: ipHash,
      p_user_agent_hash: uaHash,
    });

    if (error) {
      console.error("credential request rpc rejected:", error.code ?? "unknown");
      throw new Error(GENERIC_SUBMISSION_ERROR);
    }
    return { ok: true, ref: (ref as string | null) ?? null };
  });
