import { NextRequest, NextResponse } from "next/server";
import { predictStartupProfit } from "@/lib/ml-lab/regression/random-forest-infer";
import type { StartupPredictInput } from "@/lib/ml-lab/types";

export const dynamic = "force-dynamic";

const VALID_STATES = new Set(["New York", "California", "Florida"]);
const MAX_SPEND = 10_000_000;

export async function POST(request: NextRequest) {
  let body: Partial<StartupPredictInput>;
  try {
    body = await request.json() as Partial<StartupPredictInput>;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const rdSpend = Number(body.rdSpend);
  const administration = Number(body.administration);
  const marketingSpend = Number(body.marketingSpend);
  const state = String(body.state || "").trim() as "New York" | "California" | "Florida";

  if (!Number.isFinite(rdSpend) || rdSpend < 0 || rdSpend > MAX_SPEND) {
    return NextResponse.json(
      { error: "rdSpend must be a non-negative number under 10,000,000." },
      { status: 400 },
    );
  }

  if (!Number.isFinite(administration) || administration < 0 || administration > MAX_SPEND) {
    return NextResponse.json(
      { error: "administration must be a non-negative number under 10,000,000." },
      { status: 400 },
    );
  }

  if (!Number.isFinite(marketingSpend) || marketingSpend < 0 || marketingSpend > MAX_SPEND) {
    return NextResponse.json(
      { error: "marketingSpend must be a non-negative number under 10,000,000." },
      { status: 400 },
    );
  }

  if (!VALID_STATES.has(state)) {
    return NextResponse.json(
      { error: "state must be one of: New York, California, Florida." },
      { status: 400 },
    );
  }

  const result = predictStartupProfit({
    rdSpend,
    administration,
    marketingSpend,
    state,
  });

  return NextResponse.json(result);
}
