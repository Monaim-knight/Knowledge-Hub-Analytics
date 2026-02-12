/**
 * Simple in-memory rate limiter.
 * Use for auth/upload endpoints to prevent brute force and abuse.
 * Note: On serverless (Vercel), each instance has its own cache - for stricter
 * global limits, use Redis (e.g. @upstash/ratelimit).
 */
const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

function getKey(identifier: string, prefix: string): string {
  return `${prefix}:${identifier}`;
}

function cleanup() {
  const now = Date.now();
  for (const [key, data] of store.entries()) {
    if (data.resetAt < now) store.delete(key);
  }
}

export function rateLimit(
  identifier: string,
  options: { windowMs?: number; max?: number; prefix?: string } = {}
): { success: boolean; remaining: number } {
  const { windowMs = WINDOW_MS, max = MAX_REQUESTS, prefix = "rl" } = options;
  const key = getKey(identifier, prefix);
  const now = Date.now();

  if (store.size > 1000) cleanup();

  let data = store.get(key);
  if (!data || data.resetAt < now) {
    data = { count: 0, resetAt: now + windowMs };
    store.set(key, data);
  }

  data.count += 1;
  const remaining = Math.max(0, max - data.count);
  const success = data.count <= max;

  return { success, remaining };
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : null;
  return ip ?? "unknown";
}
