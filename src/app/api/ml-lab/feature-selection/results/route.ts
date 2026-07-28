import { NextRequest, NextResponse } from "next/server";
import { getFeatureSelectionResults } from "@/lib/ml-lab/feature-selection/live-select";
import type { FeatureSelectionMethodKey } from "@/lib/ml-lab/types";

export const dynamic = "force-dynamic";

const VALID_METHODS = new Set<FeatureSelectionMethodKey>([
  "pearson",
  "spearman",
  "ftest",
  "mutual_info",
  "rfe",
  "sfs",
  "sbs",
  "lasso",
  "rf",
]);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawMethod = (searchParams.get("method") || "pearson").toLowerCase() as FeatureSelectionMethodKey;
  const rawMode = (searchParams.get("mode") || "ethical").toLowerCase();
  const rawK = Number(searchParams.get("k") || "5");

  const method = VALID_METHODS.has(rawMethod) ? rawMethod : "pearson";
  const mode = rawMode === "historical" ? "historical" : "ethical";
  const k = Number.isFinite(rawK) ? Math.max(1, Math.min(13, rawK)) : 5;

  const result = getFeatureSelectionResults(method, mode, k);

  return NextResponse.json(result);
}
