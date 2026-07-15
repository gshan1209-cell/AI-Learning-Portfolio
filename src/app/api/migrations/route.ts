import { NextRequest, NextResponse } from "next/server";
import { getMigrations } from "@/lib/migration-registry";
import type { MigrationStatus } from "@/types/migration";

const validStatuses: MigrationStatus[] = [
  "planned",
  "inventory",
  "importing",
  "refactoring",
  "verifying",
  "ready_to_retire",
  "retired",
  "blocked",
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || undefined;
  const requestedStatus = searchParams.get("status") as MigrationStatus | null;
  const status = requestedStatus && validStatuses.includes(requestedStatus)
    ? requestedStatus
    : undefined;

  const items = getMigrations({ query, status });

  return NextResponse.json({
    items,
    total: items.length,
    filters: { query: query || null, status: status || null },
  });
}
