export const DEFAULT_COSMOS_MODEL = "nvidia/Cosmos3-Super-Text2Image";
export const DEFAULT_HF_ROUTER_BASE = "https://router.huggingface.co/hf-inference/models";

export type CosmosAspectRatio = "1:1" | "16:9" | "9:16" | "4:3";
export type RuntimeEnvironment = Readonly<Record<string, string | undefined>>;

export type CosmosRuntimeConfig = {
  configured: boolean;
  hasToken: boolean;
  hasDedicatedEndpoint: boolean;
  endpoint: string;
  model: string;
  provider: string;
  timeoutMs: number;
};

export type CosmosGenerateInput = {
  prompt: string;
  negativePrompt: string;
  aspectRatio: CosmosAspectRatio;
  seed: number;
  steps: number;
  guidanceScale: number;
};

export class CosmosRequestError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "CosmosRequestError";
  }
}

function readPositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function resolveCosmosConfig(
  env: RuntimeEnvironment = process.env,
): CosmosRuntimeConfig {
  const token = env.HF_TOKEN?.trim() || "";
  const model = env.COSMOS_MODEL_ID?.trim() || DEFAULT_COSMOS_MODEL;
  const dedicatedEndpoint = env.COSMOS_ENDPOINT_URL?.trim() || "";
  const endpoint = dedicatedEndpoint || `${DEFAULT_HF_ROUTER_BASE}/${model}`;
  const provider = env.COSMOS_PROVIDER?.trim()
    || (dedicatedEndpoint ? "dedicated-gpu-endpoint" : "huggingface-inference-router");

  return {
    configured: Boolean(token),
    hasToken: Boolean(token),
    hasDedicatedEndpoint: Boolean(dedicatedEndpoint),
    endpoint,
    model,
    provider,
    timeoutMs: readPositiveInt(env.COSMOS_TIMEOUT_MS, 90_000),
  };
}

export function getCosmosToken(env: RuntimeEnvironment = process.env): string {
  return env.HF_TOKEN?.trim() || "";
}

export function aspectSize(aspectRatio: CosmosAspectRatio): { width: number; height: number } {
  switch (aspectRatio) {
    case "16:9":
      return { width: 1024, height: 576 };
    case "9:16":
      return { width: 576, height: 1024 };
    case "4:3":
      return { width: 896, height: 672 };
    case "1:1":
      return { width: 768, height: 768 };
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new CosmosRequestError("invalid_json", "請提供 JSON 物件。", 400);
  }
  return value as Record<string, unknown>;
}

function readString(
  record: Record<string, unknown>,
  key: string,
  { min = 0, max = 2_000, fallback = "" }: { min?: number; max?: number; fallback?: string } = {},
): string {
  const raw = record[key];
  const value = typeof raw === "string" ? raw.trim() : fallback;
  if (value.length < min || value.length > max) {
    throw new CosmosRequestError(
      "invalid_input",
      `${key} 長度必須介於 ${min} 到 ${max} 個字元。`,
      422,
    );
  }
  return value;
}

function readNumber(
  record: Record<string, unknown>,
  key: string,
  { min, max, fallback, integer = false }: { min: number; max: number; fallback: number; integer?: boolean },
): number {
  const raw = record[key] ?? fallback;
  const value = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
    throw new CosmosRequestError(
      "invalid_input",
      `${key} 必須是 ${min} 到 ${max} 之間${integer ? "的整數" : "的數值"}。`,
      422,
    );
  }
  return value;
}

export function parseCosmosRequest(value: unknown): CosmosGenerateInput {
  const record = asRecord(value);
  const aspectRatio = readString(record, "aspectRatio", { fallback: "1:1", max: 5 });
  if (!["1:1", "16:9", "9:16", "4:3"].includes(aspectRatio)) {
    throw new CosmosRequestError("invalid_input", "aspectRatio 必須是 1:1、16:9、9:16 或 4:3。", 422);
  }

  return {
    prompt: readString(record, "prompt", { min: 3, max: 2_000 }),
    negativePrompt: readString(record, "negativePrompt", { max: 1_000 }),
    aspectRatio: aspectRatio as CosmosAspectRatio,
    seed: readNumber(record, "seed", { min: 0, max: 2_147_483_647, fallback: 42, integer: true }),
    steps: readNumber(record, "steps", { min: 1, max: 50, fallback: 28, integer: true }),
    guidanceScale: readNumber(record, "guidanceScale", { min: 0, max: 20, fallback: 7.5 }),
  };
}

export function buildCosmosPayload(input: CosmosGenerateInput): Record<string, unknown> {
  const { width, height } = aspectSize(input.aspectRatio);
  return {
    inputs: input.prompt,
    parameters: {
      negative_prompt: input.negativePrompt || undefined,
      width,
      height,
      seed: input.seed,
      num_inference_steps: input.steps,
      guidance_scale: input.guidanceScale,
    },
  };
}

export function normalizeProviderError(status: number, detail = ""): CosmosRequestError {
  const suffix = detail.trim() ? `：${detail.trim().slice(0, 500)}` : "";
  if (status === 401 || status === 403) {
    return new CosmosRequestError("auth_failed", `Provider 認證失敗，請檢查 HF_TOKEN 權限${suffix}`, 502);
  }
  if (status === 404) {
    return new CosmosRequestError("model_unavailable", `設定的模型或 Endpoint 不存在${suffix}`, 502);
  }
  if (status === 429) {
    return new CosmosRequestError("rate_limited", `Provider 已達速率或額度上限${suffix}`, 429);
  }
  if (status === 503) {
    return new CosmosRequestError("provider_loading", `GPU Provider 尚未就緒或正在載入模型${suffix}`, 503);
  }
  return new CosmosRequestError("provider_error", `GPU Provider 回傳 HTTP ${status}${suffix}`, 502);
}

export function errorResponse(error: unknown): Response {
  if (error instanceof CosmosRequestError) {
    return Response.json(
      { ok: false, error: error.code, message: error.message },
      { status: error.status, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (error instanceof Error && error.name === "AbortError") {
    return Response.json(
      { ok: false, error: "provider_timeout", message: "GPU Provider 回應逾時。" },
      { status: 504, headers: { "Cache-Control": "no-store" } },
    );
  }
  return Response.json(
    { ok: false, error: "internal_error", message: "Cosmos Runtime 發生未預期錯誤。" },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}
