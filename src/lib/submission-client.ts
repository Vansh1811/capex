import { createClient } from "@supabase/supabase-js";
import { createMiddleware } from "@tanstack/react-start";
import type { SubmissionDatabase } from "@/integrations/supabase/types";

/**
 * Server-side anon-key client for the two submission RPCs — the only
 * Supabase dependency the public site has. RLS means this key can do
 * exactly one thing: execute the submission functions. No table access.
 */
export function submissionClient() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const url = process.env.SUPABASE_URL!;
  return createClient<SubmissionDatabase>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/**
 * Request middleware that surfaces the incoming request headers to server-fn
 * handlers via context — the submission fns need the client IP to hash for
 * rate limiting; TanStack Start exposes request data only through middleware.
 */
export const requestHeaders = createMiddleware({ type: "request" }).server(
  async ({ request, next }) => {
    return next({
      context: { requestHeaders: request.headers },
    });
  },
);
