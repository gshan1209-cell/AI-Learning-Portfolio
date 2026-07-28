import "server-only";

const DATASET_PATTERN = /^[A-Z0-9-]{3,40}$/;
const CWA_REST_BASE_URL = "https://opendata.cwa.gov.tw/api/v1/rest/datastore";
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;

export class CwaClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
    this.name = "CwaClientError";
  }
}

export function getCwaApiKey(): string | null {
  const value = process.env.CWA_API_KEY?.trim();
  return value || null;
}

export async function fetchCwaJson(
  dataset: string,
  query: Record<string, string> = {},
): Promise<Record<string, unknown>> {
  if (!DATASET_PATTERN.test(dataset)) {
    throw new CwaClientError("Invalid CWA dataset identifier.", 400, "INVALID_DATASET");
  }

  const apiKey = getCwaApiKey();
  if (!apiKey) {
    throw new CwaClientError("CWA_API_KEY is not configured on the server.", 503, "CWA_KEY_MISSING");
  }

  const endpoint = new URL(`${CWA_REST_BASE_URL}/${dataset}`);
  endpoint.searchParams.set("Authorization", apiKey);
  endpoint.searchParams.set("format", "JSON");
  for (const [key, value] of Object.entries(query)) {
    endpoint.searchParams.set(key, value);
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
      headers: {
        Accept: "application/json",
        "User-Agent": "AI-Learning-Portfolio-CWA-Client/1.0",
      },
    });
  } catch {
    throw new CwaClientError("Unable to reach CWA OpenData.", 502, "CWA_UNREACHABLE");
  }

  if (!response.ok) {
    const status = response.status === 404 ? 404 : 502;
    const code = response.status === 401 ? "CWA_AUTH_FAILED" : "CWA_UPSTREAM_ERROR";
    throw new CwaClientError(`CWA request failed with status ${response.status}.`, status, code);
  }

  const contentLength = Number(response.headers.get("content-length") || "0");
  if (contentLength > MAX_RESPONSE_BYTES) {
    throw new CwaClientError("CWA response exceeded the 2 MB limit.", 502, "CWA_RESPONSE_TOO_LARGE");
  }

  const raw = await response.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_RESPONSE_BYTES) {
    throw new CwaClientError("CWA response exceeded the 2 MB limit.", 502, "CWA_RESPONSE_TOO_LARGE");
  }

  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new CwaClientError("CWA returned invalid JSON.", 502, "CWA_INVALID_JSON");
  }
}
