import { NextRequest, NextResponse } from "next/server";
import { runMlTutor } from "@/lib/ai-gateway";
import { getMlAlgorithm } from "@/lib/ml-algorithms";
import { getActivePromptVersion } from "@/lib/prompt-registry";
import { checkAiRateLimit, getAnonymousClientKey } from "@/lib/rate-limit";
import type { AiConversationMessage, MlTutorRequest } from "@/types/ai";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 16_384;

function normalizeHistory(value: unknown): AiConversationMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item))
    .filter((item) => item.role === "user" || item.role === "assistant")
    .filter((item) => typeof item.content === "string")
    .map((item) => ({
      role: item.role as "user" | "assistant",
      content: String(item.content),
    }));
}

export async function POST(request: NextRequest) {
  const rateLimit = checkAiRateLimit(getAnonymousClientKey(request.headers));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many AI tutor requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "X-RateLimit-Remaining": "0",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { error: "Request body is too large." },
      { status: 413, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: Partial<MlTutorRequest>;
  try {
    body = await request.json() as Partial<MlTutorRequest>;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const algorithmSlug = typeof body.algorithmSlug === "string" ? body.algorithmSlug.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const algorithm = getMlAlgorithm(algorithmSlug);
  const prompt = getActivePromptVersion("ml-algorithm-tutor");

  if (!algorithmSlug || !algorithm) {
    return NextResponse.json(
      { error: "Unknown algorithmSlug." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (!message) {
    return NextResponse.json(
      { error: "message is required." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (message.length > prompt.limits.messageCharacters) {
    return NextResponse.json(
      { error: `message must be ${prompt.limits.messageCharacters} characters or fewer.` },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const history = normalizeHistory(body.history)
    .slice(-prompt.limits.historyMessages)
    .map((item) => ({
      ...item,
      content: item.content.trim().slice(0, prompt.limits.historyMessageCharacters),
    }))
    .filter((item) => item.content.length > 0);

  try {
    const result = await runMlTutor({ algorithm, message, history });
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
        "X-AI-Prompt-Id": result.prompt.id,
        "X-AI-Prompt-Version": result.prompt.version,
        "X-RateLimit-Remaining": String(rateLimit.remaining),
      },
    });
  } catch (error) {
    console.error("ML tutor gateway error", error);
    return NextResponse.json(
      { error: "AI tutor gateway is temporarily unavailable." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
