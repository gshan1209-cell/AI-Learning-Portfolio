import fs from "node:fs";
import path from "node:path";
import type { AiCostEstimate, AiTokenUsage, AiUsageLedgerEntry } from "@/types/ai";

function readRate(name: string): number | null {
  const raw = process.env[name];
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function calculateAiCost(usage: AiTokenUsage): AiCostEstimate {
  const inputRate = readRate("AI_GEMINI_INPUT_USD_PER_1M");
  const outputRate = readRate("AI_GEMINI_OUTPUT_USD_PER_1M");
  const estimatedUsd = inputRate === null || outputRate === null
    ? null
    : (usage.promptTokens / 1_000_000) * inputRate
      + (usage.candidateTokens / 1_000_000) * outputRate;

  return {
    currency: "USD",
    inputUsdPerMillionTokens: inputRate,
    outputUsdPerMillionTokens: outputRate,
    estimatedUsd: estimatedUsd === null ? null : Number(estimatedUsd.toFixed(8)),
  };
}

export function recordAiUsage(entry: AiUsageLedgerEntry): void {
  const logPath = process.env.AI_USAGE_LOG_PATH?.trim();
  if (!logPath) {
    console.info("AI_USAGE_LEDGER", JSON.stringify(entry));
    return;
  }

  try {
    const absolutePath = path.isAbsolute(logPath) ? logPath : path.join(process.cwd(), logPath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.appendFileSync(absolutePath, `${JSON.stringify(entry)}\n`, "utf8");
  } catch (error) {
    console.error("Unable to persist AI usage ledger entry", error);
  }
}
