import fs from "node:fs";
import path from "node:path";
import type { PromptDefinition, PromptVersionDefinition } from "@/types/ai";

const PROMPT_REGISTRY_PATH = "prompt_registry/prompts.json";

type PromptRegistry = Record<string, PromptDefinition>;

function readPromptRegistry(): PromptRegistry {
  const filePath = path.join(process.cwd(), PROMPT_REGISTRY_PATH);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prompt Registry not found: ${filePath}`);
  }

  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Prompt Registry must be a JSON object.");
  }
  return parsed as PromptRegistry;
}

export function getPromptDefinition(promptId: string): PromptDefinition {
  const definition = readPromptRegistry()[promptId];
  if (!definition) throw new Error(`Prompt not found: ${promptId}`);
  return definition;
}

export function getActivePromptVersion(promptId: string): PromptVersionDefinition {
  const definition = getPromptDefinition(promptId);
  const version = definition.versions.find(
    (item) => item.version === definition.activeVersion && item.status === "active",
  );
  if (!version) {
    throw new Error(`Active prompt version not found: ${promptId}@${definition.activeVersion}`);
  }
  return version;
}
