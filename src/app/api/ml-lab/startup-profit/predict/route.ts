import { NextRequest, NextResponse } from "next/server";
import { predictStartupProfit } from "@/lib/ml-lab/regression/random-forest-infer";

export const dynamic = "force-dynamic";

const VALID_STATES = new Set(["New York", "California", "Florida"]);
const ALLOWED_KEYS = new Set(["rdSpend", "administration", "marketingSpend", "state"]);
const MAX_BODY_BYTES = 16 * 1024; // 16 KB
const MAX_SPEND = 10_000_000;

function jsonError(message: string, status = 400) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

export async function POST(request: NextRequest) {
  // Check Content-Length header or read text buffer to enforce body size limit
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return jsonError("Request payload size exceeds maximum limit of 16 KB.");
  }

  let rawText: string;
  try {
    rawText = await request.text();
  } catch {
    return jsonError("Failed to read request body.");
  }

  if (Buffer.byteLength(rawText, "utf8") > MAX_BODY_BYTES) {
    return jsonError("Request payload size exceeds maximum limit of 16 KB.");
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    return jsonError("Request body must be valid JSON.");
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonError("Request body must be a JSON object.");
  }

  // Reject extra unknown keys
  const extraKeys = Object.keys(body).filter((key) => !ALLOWED_KEYS.has(key));
  if (extraKeys.length > 0) {
    return jsonError(`Unexpected fields in request payload: ${extraKeys.join(", ")}`);
  }

  const rdSpend = Number(body.rdSpend);
  const administration = Number(body.administration);
  const marketingSpend = Number(body.marketingSpend);
  const state = String(body.state || "").trim() as "New York" | "California" | "Florida";

  if (!Number.isFinite(rdSpend) || rdSpend < 0 || rdSpend > MAX_SPEND) {
    return jsonError("rdSpend must be a finite, non-negative number under 10,000,000.");
  }

  if (!Number.isFinite(administration) || administration < 0 || administration > MAX_SPEND) {
    return jsonError("administration must be a finite, non-negative number under 10,000,000.");
  }

  if (!Number.isFinite(marketingSpend) || marketingSpend < 0 || marketingSpend > MAX_SPEND) {
    return jsonError("marketingSpend must be a finite, non-negative number under 10,000,000.");
  }

  if (!VALID_STATES.has(state)) {
    return jsonError("state must be one of: New York, California, Florida.");
  }

  const result = predictStartupProfit({
    rdSpend,
    administration,
    marketingSpend,
    state,
  });

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
