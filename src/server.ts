import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Static-asset caching (performance, 2026-09). HTML stays uncached so
 * project/client content updates publish immediately; only fingerprinted
 * or content-stable assets get long-lived caching:
 *  - /assets/* (Vite-hashed JS/CSS/fonts/images) → immutable, 1 year.
 *  - /uploads/*, /media/*, /favicon.*, /og.* → 1 hour + 24h
 *    stale-while-revalidate: short enough that replaced project/client
 *    media refreshes promptly, long enough to skip revalidation within
 *    a session.
 */
function withStaticCache(request: Request, response: Response): Response {
  if (request.method !== "GET" || response.status !== 200) return response;
  let pathname = "";
  try {
    pathname = new URL(request.url).pathname;
  } catch {
    return response;
  }
  let cache: string | null = null;
  if (pathname.startsWith("/assets/")) {
    cache = "public, max-age=31536000, immutable";
  } else if (
    pathname.startsWith("/uploads/") ||
    pathname.startsWith("/media/") ||
    pathname === "/favicon.png" ||
    pathname === "/og.png" ||
    pathname === "/robots.txt"
  ) {
    cache = "public, max-age=3600, stale-while-revalidate=86400";
  }
  if (!cache || response.headers.has("cache-control")) return response;
  const headers = new Headers(response.headers);
  headers.set("cache-control", cache);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withStaticCache(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
