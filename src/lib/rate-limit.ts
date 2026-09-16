import { NextResponse } from "next/server";

/**
 * Fixed-window rate limiter for the Gemini-backed routes.
 *
 * LIMITATION: the counters live in the memory of a single server instance.
 * On a platform that runs several serverless instances (Vercel) a determined
 * caller can still exceed the limit by spreading requests across instances,
 * and the counters reset on every cold start. It is a meaningful speed bump
 * against a runaway client or a naive script, not a hard quota. A shared
 * store (Redis) is required for an enforceable limit.
 */
type Window = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Window>();

// Bound the map so a long-lived instance cannot grow without limit.
const MAX_TRACKED_KEYS = 10_000;

function sweep(now: number) {
  for (const [key, window] of buckets) {
    if (window.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitRule = {
  /** Maximum requests allowed inside the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
};

export const AI_RATE_LIMIT: RateLimitRule = {
  limit: 10,
  windowMs: 60_000,
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(
  key: string,
  rule: RateLimitRule = AI_RATE_LIMIT,
): RateLimitResult {
  const now = Date.now();

  if (buckets.size > MAX_TRACKED_KEYS) sweep(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + rule.windowMs });

    return {
      allowed: true,
      remaining: rule.limit - 1,
      retryAfterSeconds: 0,
    };
  }

  existing.count += 1;

  const allowed = existing.count <= rule.limit;

  return {
    allowed,
    remaining: Math.max(0, rule.limit - existing.count),
    retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}

/**
 * Returns a 429 response when the caller is over the limit, otherwise null.
 * Scope the key per route so a quiz burst does not consume the chat budget.
 */
export function rateLimitResponse(
  scope: string,
  userId: string,
  rule: RateLimitRule = AI_RATE_LIMIT,
): NextResponse | null {
  const result = checkRateLimit(`${scope}:${userId}`, rule);

  if (result.allowed) return null;

  return NextResponse.json(
    {
      error: `Too many requests. Please wait ${result.retryAfterSeconds} seconds and try again.`,
    },
    {
      status: 429,
      headers: { "Retry-After": String(result.retryAfterSeconds) },
    },
  );
}
