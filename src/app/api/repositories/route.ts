import { NextRequest, NextResponse } from "next/server";
import { getRepositories } from "@/lib/repository-registry";
import type { RepositoryConversionStatus } from "@/types/repository";

const VALID_STATUSES = new Set<RepositoryConversionStatus>([
  "published",
  "in_progress",
  "planned",
  "excluded",
]);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || undefined;
  const rawStatus = searchParams.get("status") as RepositoryConversionStatus | null;
  const status = rawStatus && VALID_STATUSES.has(rawStatus) ? rawStatus : undefined;
  const repositories = getRepositories({ query, status });

  return NextResponse.json({
    data: repositories,
    meta: {
      total: repositories.length,
      query: query || null,
      status: status || null,
      syncedAt: repositories[0]?.lastSyncedAt || null,
    },
  });
}
