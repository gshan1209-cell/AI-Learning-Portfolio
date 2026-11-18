/** Parse pagination without allowing NaN, fractions or unsafe slice offsets. */
export function parseCoursePagination(params: URLSearchParams): {
  page: number;
  limit: number;
} | null {
  function positiveInteger(name: string, fallback: number): number | null {
    const raw = params.get(name);
    if (raw === null) return fallback;
    if (!/^\d+$/.test(raw)) return null;
    const value = Number(raw);
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }

  const page = positiveInteger("page", 1);
  const requestedLimit = positiveInteger("limit", 12);
  if (page === null || requestedLimit === null) return null;
  const limit = Math.min(50, requestedLimit);
  if (!Number.isSafeInteger(page * limit)) return null;
  return { page, limit };
}
