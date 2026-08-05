import {
  CosmosRequestError,
  buildCosmosPayload,
  errorResponse,
  getCosmosToken,
  normalizeProviderError,
  parseCosmosRequest,
  resolveCosmosConfig,
} from "@/lib/cosmos-runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const config = resolveCosmosConfig();
    const token = getCosmosToken();
    if (!config.configured || !token) {
      throw new CosmosRequestError(
        "runtime_unconfigured",
        "Cosmos Runtime 尚未設定 HF_TOKEN；系統不會以示範圖片代替真實輸出。",
        503,
      );
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      throw new CosmosRequestError("invalid_json", "請提供有效的 JSON Request Body。", 400);
    }
    const input = parseCosmosRequest(raw);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    let providerResponse: Response;
    try {
      providerResponse = await fetch(config.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "image/*,application/json",
        },
        body: JSON.stringify(buildCosmosPayload(input)),
        signal: controller.signal,
        cache: "no-store",
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!providerResponse.ok) {
      const detail = await providerResponse.text().catch(() => "");
      throw normalizeProviderError(providerResponse.status, detail);
    }

    const contentType = providerResponse.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      const detail = await providerResponse.text().catch(() => "");
      throw new CosmosRequestError(
        "invalid_provider_response",
        `GPU Provider 未回傳圖片${detail ? `：${detail.slice(0, 500)}` : ""}`,
        502,
      );
    }

    const image = await providerResponse.arrayBuffer();
    if (image.byteLength === 0) {
      throw new CosmosRequestError("empty_image", "GPU Provider 回傳空白圖片。", 502);
    }

    return new Response(image, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(image.byteLength),
        "Cache-Control": "no-store",
        "X-Cosmos-Model": config.model,
        "X-Cosmos-Provider": config.provider,
        "X-Cosmos-Generated-At": new Date().toISOString(),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
