export type AiProvider = "gemini";
export type AiMessageRole = "user" | "assistant";
export type AiAssistantState = "speaking" | "encouraging" | "confused";

export interface AiConversationMessage {
  role: AiMessageRole;
  content: string;
}

export interface PromptLimits {
  messageCharacters: number;
  historyMessages: number;
  historyMessageCharacters: number;
  suggestedQuestions: number;
}

export interface PromptVersionDefinition {
  version: string;
  provider: AiProvider;
  model: string;
  temperature: number;
  maxOutputTokens: number;
  systemPrompt: string;
  responseSchema: Record<string, unknown>;
  limits: PromptLimits;
  status: "active" | "inactive";
  createdAt: string;
}

export interface PromptDefinition {
  promptId: string;
  name: string;
  activeVersion: string;
  versions: PromptVersionDefinition[];
}

export interface MlTutorRequest {
  algorithmSlug: string;
  message: string;
  history?: AiConversationMessage[];
}

export interface MlTutorStructuredReply {
  reply: string;
  suggested_questions: string[];
  assistant_state: AiAssistantState;
}

export interface AiTokenUsage {
  promptTokens: number;
  candidateTokens: number;
  thoughtsTokens: number;
  totalTokens: number;
}

export interface AiCostEstimate {
  currency: "USD";
  inputUsdPerMillionTokens: number | null;
  outputUsdPerMillionTokens: number | null;
  estimatedUsd: number | null;
}

export interface AiUsageLedgerEntry {
  requestId: string;
  promptId: string;
  promptVersion: string;
  provider: AiProvider;
  model: string;
  mode: "live" | "fallback";
  algorithmSlug: string;
  usage: AiTokenUsage;
  cost: AiCostEstimate;
  createdAt: string;
}

export interface MlTutorResponse extends MlTutorStructuredReply {
  mode: "live" | "fallback";
  prompt: {
    id: string;
    version: string;
  };
  model: string;
  usage: AiTokenUsage;
  cost: AiCostEstimate;
  requestId: string;
}
