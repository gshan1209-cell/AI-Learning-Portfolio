import type { NormalizedErrorResponse, WebLabRequestPolicy } from "./types";

export const DEFAULT_REQUEST_POLICY: WebLabRequestPolicy = {
  allowlist: [
    "https://ssr1.scrape.center",
    "https://www.atmovies.com.tw",
    "https://opendata.cwa.gov.tw",
  ],
  timeoutMs: 8000,
  maxBodySizeBytes: 2 * 1024 * 1024, // 2MB limit
  cacheTtlSeconds: 300,
};

export function isUrlAllowed(targetUrl: string, allowlist: string[] = DEFAULT_REQUEST_POLICY.allowlist): boolean {
  try {
    const parsed = new URL(targetUrl);
    return allowlist.some((allowed) => {
      const allowedParsed = new URL(allowed);
      return parsed.origin === allowedParsed.origin;
    });
  } catch {
    return false;
  }
}

export function normalizeError(
  message: string,
  statusCode = 500,
  code = "INTERNAL_SERVER_ERROR"
): NormalizedErrorResponse {
  return {
    error: true,
    code,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };
}
