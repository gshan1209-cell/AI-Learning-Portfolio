import { NextRequest, NextResponse } from "next/server";
import { getAllMlAlgorithms, getMlAlgorithmStats } from "@/lib/ml-algorithms";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "10")));

  const algorithms = getAllMlAlgorithms({
    query: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    difficulty: searchParams.get("difficulty") ?? undefined,
  });

  const start = (page - 1) * limit;
  return NextResponse.json({
    items: algorithms.slice(start, start + limit),
    stats: getMlAlgorithmStats(),
    pagination: {
      page,
      limit,
      total: algorithms.length,
      totalPages: Math.max(1, Math.ceil(algorithms.length / limit)),
    },
  });
}
