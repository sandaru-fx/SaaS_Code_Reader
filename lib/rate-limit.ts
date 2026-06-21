/**
 * Simple in-memory rate limiter for the /api/analyze endpoint.
 *
 * This is a best-effort MVP solution. On Vercel each serverless function
 * invocation may run in a separate instance, so limits are per-instance, not
 * global. For stricter enforcement at scale, replace with Upstash Redis:
 *   https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

/** Requests allowed per IP per window. */
const MAX_REQUESTS = 10;

/** Window duration in milliseconds. */
const WINDOW_MS = 60_000; // 1 minute

/** Prune stale entries every N requests to keep memory bounded. */
const PRUNE_INTERVAL = 200;
let requestsSinceLastPrune = 0;

function pruneExpired() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  requestsSinceLastPrune++;
  if (requestsSinceLastPrune >= PRUNE_INTERVAL) {
    requestsSinceLastPrune = 0;
    pruneExpired();
  }

  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.count++;
  return { allowed: true };
}

/**
 * Extract the real client IP from a Next.js App Router request.
 * Vercel sets x-forwarded-for; fall back to a safe default.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // Fallback — unlikely in production on Vercel
  return "unknown";
}
