import { createHash } from "node:crypto";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

function readPositiveInteger(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function cleanup(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of Array.from(buckets.entries())) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function getAnonymousClientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headers.get("x-real-ip")?.trim();
  const userAgent = headers.get("user-agent")?.slice(0, 160) || "unknown-agent";
  const raw = `${forwarded || realIp || "unknown-ip"}|${userAgent}`;
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}

export function checkAiRateLimit(clientKey: string) {
  const maxRequests = readPositiveInteger("AI_RATE_LIMIT_MAX", 10);
  const windowSeconds = readPositiveInteger("AI_RATE_LIMIT_WINDOW_SECONDS", 600);
  const now = Date.now();
  cleanup(now);

  const current = buckets.get(clientKey);
  if (!current || current.resetAt <= now) {
    const resetAt = now + windowSeconds * 1000;
    buckets.set(clientKey, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt, retryAfterSeconds: 0 };
  }

  if (current.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  buckets.set(clientKey, current);
  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - current.count),
    resetAt: current.resetAt,
    retryAfterSeconds: 0,
  };
}
