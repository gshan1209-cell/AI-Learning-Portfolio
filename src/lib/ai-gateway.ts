import { randomUUID } from "node:crypto";
import { calculateAiCost, recordAiUsage } from "@/lib/ai-usage-ledger";
import { getActivePromptVersion, getPromptDefinition } from "@/lib/prompt-registry";
import type {
  AiAssistantState,
  AiConversationMessage,
  AiTokenUsage,
  MlTutorResponse,
  MlTutorStructuredReply,
} from "@/types/ai";
import type { MlAlgorithm } from "@/types/ml-algorithm";

const ML_TUTOR_PROMPT_ID = "ml-algorithm-tutor";
const EMPTY_USAGE: AiTokenUsage = {
  promptTokens: 0,
  candidateTokens: 0,
  thoughtsTokens: 0,
  totalTokens: 0,
};

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    thoughtsTokenCount?: number;
    totalTokenCount?: number;
  };
  modelVersion?: string;
}

function normalizeHistory(history: AiConversationMessage[] | undefined, maxItems: number, maxCharacters: number) {
  return (history || [])
    .slice(-maxItems)
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, maxCharacters),
    }))
    .filter((message) => message.content.length > 0);
}

function normalizeReply(value: unknown, maxSuggestedQuestions: number): MlTutorStructuredReply {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("AI response is not a JSON object.");
  }

  const candidate = value as Record<string, unknown>;
  const reply = typeof candidate.reply === "string" ? candidate.reply.trim() : "";
  const assistantState = candidate.assistant_state;
  const allowedStates: AiAssistantState[] = ["speaking", "encouraging", "confused"];
  const suggestedQuestions = Array.isArray(candidate.suggested_questions)
    ? candidate.suggested_questions
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, maxSuggestedQuestions)
    : [];

  if (!reply) throw new Error("AI response is missing reply.");

  return {
    reply: reply.slice(0, 4000),
    suggested_questions: suggestedQuestions,
    assistant_state: allowedStates.includes(assistantState as AiAssistantState)
      ? (assistantState as AiAssistantState)
      : "speaking",
  };
}

function fallbackReply(algorithm: MlAlgorithm, reason: "not_configured" | "provider_error"): MlTutorStructuredReply {
  return {
    reply: reason === "not_configured"
      ? `AI 助教尚未設定 GEMINI_API_KEY。你仍可先記住：${algorithm.name_zh}的核心是「${algorithm.one_liner}」；生活化理解可以想成「${algorithm.analogy}」` 
      : `AI 助教目前無法連線。先用教材複習：${algorithm.description}`,
    suggested_questions: [
      `${algorithm.name_zh}適合用在哪些情境？`,
      `${algorithm.name_zh}最常見的限制是什麼？`,
      `可以用更簡單的例子解釋${algorithm.name_zh}嗎？`,
    ],
    assistant_state: reason === "not_configured" ? "encouraging" : "confused",
  };
}

function extractText(response: GeminiGenerateContentResponse): string {
  return response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim() || "";
}

function parseJsonText(text: string): unknown {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

function toUsage(response: GeminiGenerateContentResponse): AiTokenUsage {
  return {
    promptTokens: response.usageMetadata?.promptTokenCount || 0,
    candidateTokens: response.usageMetadata?.candidatesTokenCount || 0,
    thoughtsTokens: response.usageMetadata?.thoughtsTokenCount || 0,
    totalTokens: response.usageMetadata?.totalTokenCount || 0,
  };
}

function buildAlgorithmContext(algorithm: MlAlgorithm): string {
  return [
    "目前學習主題：",
    `中文名稱：${algorithm.name_zh}`,
    `英文名稱：${algorithm.name_en}`,
    `核心說明：${algorithm.description}`,
    `生活比喻：${algorithm.analogy}`,
    `運作流程：${algorithm.how_it_works.join("；")}`,
    `常見應用：${algorithm.use_cases.join("、")}`,
    `優點：${algorithm.pros.join("、")}`,
    `限制：${algorithm.cons.join("、")}`,
    `常見錯誤：${algorithm.common_mistakes.join("、")}`,
    algorithm.editorial_note ? `教材校訂：${algorithm.editorial_note}` : "",
  ].filter(Boolean).join("\n");
}

export async function runMlTutor({
  algorithm,
  message,
  history,
}: {
  algorithm: MlAlgorithm;
  message: string;
  history?: AiConversationMessage[];
}): Promise<MlTutorResponse> {
  const definition = getPromptDefinition(ML_TUTOR_PROMPT_ID);
  const prompt = getActivePromptVersion(ML_TUTOR_PROMPT_ID);
  const requestId = randomUUID();
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || prompt.model;
  const normalizedHistory = normalizeHistory(
    history,
    prompt.limits.historyMessages,
    prompt.limits.historyMessageCharacters,
  );

  let mode: "live" | "fallback" = "fallback";
  let structuredReply: MlTutorStructuredReply;
  let usage = EMPTY_USAGE;
  let resolvedModel = model;

  if (!apiKey) {
    structuredReply = fallbackReply(algorithm, "not_configured");
  } else {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: `${prompt.systemPrompt}\n\n${buildAlgorithmContext(algorithm)}` }],
          },
          contents: [
            ...normalizedHistory.map((item) => ({
              role: item.role === "assistant" ? "model" : "user",
              parts: [{ text: item.content }],
            })),
            { role: "user", parts: [{ text: message }] },
          ],
          generationConfig: {
            temperature: prompt.temperature,
            maxOutputTokens: prompt.maxOutputTokens,
            responseMimeType: "application/json",
            responseSchema: prompt.responseSchema,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini request failed with status ${response.status}`);
      }

      const payload = await response.json() as GeminiGenerateContentResponse;
      if (payload.promptFeedback?.blockReason) {
        throw new Error(`Gemini prompt blocked: ${payload.promptFeedback.blockReason}`);
      }

      structuredReply = normalizeReply(
        parseJsonText(extractText(payload)),
        prompt.limits.suggestedQuestions,
      );
      usage = toUsage(payload);
      resolvedModel = payload.modelVersion || model;
      mode = "live";
    } catch (error) {
      console.error("ML tutor provider error", error);
      structuredReply = fallbackReply(algorithm, "provider_error");
    } finally {
      clearTimeout(timeout);
    }
  }

  const cost = calculateAiCost(usage);
  recordAiUsage({
    requestId,
    promptId: definition.promptId,
    promptVersion: prompt.version,
    provider: prompt.provider,
    model: resolvedModel,
    mode,
    algorithmSlug: algorithm.slug,
    usage,
    cost,
    createdAt: new Date().toISOString(),
  });

  return {
    ...structuredReply,
    mode,
    prompt: { id: definition.promptId, version: prompt.version },
    model: resolvedModel,
    usage,
    cost,
    requestId,
  };
}
