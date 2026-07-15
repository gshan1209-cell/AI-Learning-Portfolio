import fs from "node:fs";
import path from "node:path";
import { getPromptDefinitions } from "@/lib/prompt-registry";
import type { AiUsageLedgerEntry } from "@/types/ai";

function readPositiveInteger(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function readOptionalRate(name: string) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value >= 0 && process.env[name]?.trim() ? value : null;
}

function readRecentUsage(limit = 20): AiUsageLedgerEntry[] {
  const configuredPath = process.env.AI_USAGE_LOG_PATH?.trim();
  if (!configuredPath) return [];

  const absolutePath = path.isAbsolute(configuredPath)
    ? configuredPath
    : path.join(process.cwd(), configuredPath);
  if (!fs.existsSync(absolutePath)) return [];

  try {
    return fs.readFileSync(absolutePath, "utf8")
      .split("\n")
      .filter(Boolean)
      .slice(-limit)
      .map((line) => JSON.parse(line) as AiUsageLedgerEntry)
      .reverse();
  } catch (error) {
    console.error("Unable to read AI usage ledger", error);
    return [];
  }
}

export function getAiGovernanceSnapshot() {
  const prompts = getPromptDefinitions().map((definition) => {
    const active = definition.versions.find((version) => version.version === definition.activeVersion);
    return {
      promptId: definition.promptId,
      name: definition.name,
      activeVersion: definition.activeVersion,
      versions: definition.versions.map((version) => ({
        version: version.version,
        provider: version.provider,
        model: version.model,
        status: version.status,
        createdAt: version.createdAt,
      })),
      active: active ? {
        provider: active.provider,
        model: process.env.GEMINI_MODEL?.trim() || active.model,
        temperature: active.temperature,
        maxOutputTokens: active.maxOutputTokens,
        limits: active.limits,
      } : null,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    provider: {
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
      modelOverride: process.env.GEMINI_MODEL?.trim() || null,
    },
    rates: {
      currency: "USD" as const,
      inputUsdPerMillionTokens: readOptionalRate("AI_GEMINI_INPUT_USD_PER_1M"),
      outputUsdPerMillionTokens: readOptionalRate("AI_GEMINI_OUTPUT_USD_PER_1M"),
    },
    rateLimit: {
      maxRequests: readPositiveInteger("AI_RATE_LIMIT_MAX", 10),
      windowSeconds: readPositiveInteger("AI_RATE_LIMIT_WINDOW_SECONDS", 600),
      storage: "in-memory-best-effort",
    },
    ledger: {
      mode: process.env.AI_USAGE_LOG_PATH?.trim() ? "jsonl-local" : "console-only",
      pathConfigured: Boolean(process.env.AI_USAGE_LOG_PATH?.trim()),
      postgresSchemaReserved: true,
      databaseMigrationApplied: false,
      recentEntries: readRecentUsage(),
    },
    prompts,
  };
}
