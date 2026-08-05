import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_COSMOS_MODEL,
  CosmosRequestError,
  aspectSize,
  buildCosmosPayload,
  normalizeProviderError,
  parseCosmosRequest,
  resolveCosmosConfig,
} from "../src/lib/cosmos-runtime";

const root = process.cwd();

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8")) as T;
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath: string): boolean {
  return fs.existsSync(path.join(root, relativePath));
}

type DemoRegistry = Record<string, { mode: string; url?: string; description?: string }>;

type StoryData = {
  title: string;
  sourceBlobSha: string;
  sourceRevision: string;
  rightsStatus: string;
  slides: Array<{
    id: string;
    imageUrl: string;
    alt: string;
    text: string;
    duration: number;
    transition: unknown;
  }>;
};

type EnsembleReport = {
  deployedModel: {
    modelVersion: string;
    algorithm: string;
    deployedModel: string;
    sourceRevision: string;
    modelSha256: string;
    metrics: { accuracy: number; precision: number; recall: number; f1: number; confusionMatrix: number[][] };
  };
  deploymentVerification: {
    status: string;
    datasetRecords: number;
    featureCount: number;
    datasetSha256: string;
    artifactZipSha256: string;
  };
  modelComparison: Record<string, { accuracy: number; precision: number; recall: number; f1: number }>;
  fairness: { sex: Record<string, unknown>; race: Record<string, unknown> };
  warning: string;
};

type ManimReport = {
  status: string;
  sceneCount: number;
  totalDurationSeconds: number;
  artifactZipSha256: string;
  scenes: Array<{ scene: string; duration: number; width: number; height: number; sha256: string }>;
};

function normalizedTransition(value: unknown): "fade" | "slide-in" | "zoom-in" {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "slide-in" || normalized === "zoom-in") return normalized;
  return "fade";
}

function testNativeVisualStory(registry: DemoRegistry): void {
  const story = readJson<StoryData>("src/data/ai-visual-story.json");
  const player = readText("src/components/visual-story-player.tsx");
  const route = readText("src/app/learning-labs/[slug]/page.tsx");

  assert.equal(story.title, "小王子與銀色之花");
  assert.equal(story.slides.length, 12);
  assert.equal(new Set(story.slides.map((slide) => slide.id)).size, 12);
  assert.match(story.sourceBlobSha, /^[0-9a-f]{40}$/);
  assert.match(story.sourceRevision, /^[0-9a-f]{40}$/);
  assert.ok(story.rightsStatus.length > 20);

  for (const slide of story.slides) {
    assert.ok(slide.alt.length > 8, `${slide.id} must have meaningful alt text`);
    assert.ok(slide.text.includes("幕："), `${slide.id} must preserve the source scene heading`);
    assert.ok(slide.duration > 0, `${slide.id} duration must be positive`);
    assert.ok(["fade", "slide-in", "zoom-in"].includes(normalizedTransition(slide.transition)));
    assert.ok(slide.imageUrl.includes(story.sourceRevision), `${slide.id} image must pin the source revision`);
  }

  assert.equal(registry["ai-visual-story"].mode, "native");
  assert.equal(registry["ai-visual-story"].url, "/learning-labs/ai-visual-story");
  assert.ok(!JSON.stringify(registry["ai-visual-story"]).includes("iframe"));
  assert.ok(route.includes('"ai-visual-story"'));
  assert.ok(route.includes("<VisualStoryPlayer />"));

  for (const contract of [
    "normalizeStoryTransition",
    'aria-label="上一幕"',
    'aria-label="下一幕"',
    "prefers-reduced-motion",
    'event.key === "ArrowLeft"',
    'event.key === "ArrowRight"',
    "sourceBlobSha",
  ]) {
    assert.ok(player.includes(contract), `visual story player missing contract: ${contract}`);
  }
}

function testCosmosRuntime(registry: DemoRegistry): void {
  const unconfigured = resolveCosmosConfig({});
  assert.equal(unconfigured.configured, false);
  assert.equal(unconfigured.model, DEFAULT_COSMOS_MODEL);
  assert.equal(unconfigured.provider, "huggingface-inference-router");

  const configured = resolveCosmosConfig({
    HF_TOKEN: "secret-test-token",
    COSMOS_ENDPOINT_URL: "https://gpu.example.test/generate",
    COSMOS_MODEL_ID: DEFAULT_COSMOS_MODEL,
    COSMOS_PROVIDER: "test-dedicated-gpu",
    COSMOS_TIMEOUT_MS: "120000",
  });
  assert.equal(configured.configured, true);
  assert.equal(configured.hasDedicatedEndpoint, true);
  assert.equal(configured.provider, "test-dedicated-gpu");
  assert.equal(configured.timeoutMs, 120000);
  assert.ok(!JSON.stringify(configured).includes("secret-test-token"));

  const input = parseCosmosRequest({
    prompt: "A physically plausible robot in a rice field",
    negativePrompt: "watermark",
    aspectRatio: "16:9",
    seed: 123,
    steps: 30,
    guidanceScale: 8,
  });
  assert.deepEqual(aspectSize(input.aspectRatio), { width: 1024, height: 576 });
  const payload = buildCosmosPayload(input) as { inputs: string; parameters: { width: number; height: number; seed: number } };
  assert.equal(payload.inputs, input.prompt);
  assert.deepEqual(
    { width: payload.parameters.width, height: payload.parameters.height, seed: payload.parameters.seed },
    { width: 1024, height: 576, seed: 123 },
  );
  assert.throws(
    () => parseCosmosRequest({ prompt: "x", aspectRatio: "21:9" }),
    (error: unknown) => error instanceof CosmosRequestError && error.code === "invalid_input",
  );
  assert.equal(normalizeProviderError(401).code, "auth_failed");
  assert.equal(normalizeProviderError(429).code, "rate_limited");
  assert.equal(normalizeProviderError(503).code, "provider_loading");

  assert.equal(registry["cosmos-text-to-image"].mode, "native");
  assert.equal(registry["cosmos-text-to-image"].url, "/learning-labs/cosmos-prompt-lab");
  assert.ok(readText("src/app/api/cosmos/generate/route.ts").includes("X-Cosmos-Model"));
  assert.ok(readText("src/app/api/cosmos/status/route.ts").includes("resolveCosmosConfig"));
  assert.ok(readText("src/components/runtime-labs/cosmos-runtime-lab.tsx").includes("沒有 Mock Mode、Unsplash 備援"));
}

function testEnsembleRuntime(registry: DemoRegistry): void {
  const report = readJson<EnsembleReport>("src/data/ensemble-runtime-report.json");
  const modelPath = "modules/ensemble-income-predictor/runtime-artifacts/adult_income_pipeline.joblib";
  const metadata = readJson<{ modelVersion: string; deployedModel: string; modelSha256: string; metrics: { f1: number } }>(
    "modules/ensemble-income-predictor/runtime-artifacts/deployed_model.json",
  );

  assert.equal(registry["ensemble-income-predictor"].mode, "native");
  assert.equal(registry["ensemble-income-predictor"].url, "/learning-labs/ensemble-fairness-lab");
  assert.ok(exists(modelPath));
  assert.ok(fs.statSync(path.join(root, modelPath)).size > 0);
  assert.equal(report.deployedModel.modelVersion, "adult-income-soft-voting-v1.1");
  assert.equal(report.deployedModel.deployedModel, "SoftVotingEnsemble");
  assert.equal(report.deployedModel.algorithm, "VotingClassifier(voting=soft)");
  assert.equal(metadata.modelVersion, report.deployedModel.modelVersion);
  assert.equal(metadata.deployedModel, report.deployedModel.deployedModel);
  assert.equal(metadata.modelSha256, report.deployedModel.modelSha256);
  assert.equal(metadata.metrics.f1, report.deployedModel.metrics.f1);
  assert.match(report.deployedModel.sourceRevision, /^[0-9a-f]{40}$/);
  assert.match(report.deployedModel.modelSha256, /^[0-9a-f]{64}$/);
  assert.equal(report.deploymentVerification.status, "verified");
  assert.equal(report.deploymentVerification.datasetRecords, 32561);
  assert.equal(report.deploymentVerification.featureCount, 14);
  assert.match(report.deploymentVerification.datasetSha256, /^[0-9a-f]{64}$/);
  assert.match(report.deploymentVerification.artifactZipSha256, /^[0-9a-f]{64}$/);
  assert.equal(report.deployedModel.metrics.f1, report.modelComparison.SoftVotingEnsemble.f1);
  assert.ok(Object.keys(report.fairness.sex).length >= 2);
  assert.ok(Object.keys(report.fairness.race).length >= 5);
  assert.ok(report.warning.includes("高風險"));

  const runtime = readText("api/_ensemble_runtime.py");
  const handler = readText("api/ensemble-predict.py");
  const workflow = readText(".github/workflows/ensemble-runtime.yml");
  const vercel = readText("vercel.json");
  assert.ok(runtime.includes("LOCAL_MODEL_PATH"));
  assert.ok(runtime.includes("predict_proba"));
  assert.ok(handler.includes("from api._ensemble_runtime"));
  assert.ok(workflow.includes("Vercel import semantics"));
  assert.ok(workflow.includes("Compare candidate with versioned deployment artifact"));
  assert.ok(!workflow.includes("git push origin"));
  assert.ok(vercel.includes("runtime-artifacts/**"));
}

function testManimRuntime(registry: DemoRegistry): void {
  const report = readJson<ManimReport>("src/data/stock-manim-runtime-report.json");
  assert.equal(registry["stock-manim-animation"].mode, "native");
  assert.equal(registry["stock-manim-animation"].url, "/learning-labs/stock-manim");
  assert.equal(report.status, "verified");
  assert.equal(report.sceneCount, 9);
  assert.equal(report.scenes.length, 9);
  assert.ok(report.totalDurationSeconds > 0);
  assert.match(report.artifactZipSha256, /^[0-9a-f]{64}$/);
  for (const scene of report.scenes) {
    assert.ok(scene.duration > 0);
    assert.ok(scene.width > 0 && scene.height > 0);
    assert.match(scene.sha256, /^[0-9a-f]{64}$/);
  }
  assert.ok(readText("modules/stock-manim-animation/python-manim/render_all.py").includes("probe_video"));
  assert.ok(readText(".github/workflows/manim-runtime.yml").includes("Render all nine scenes"));
}

function main(): void {
  const registry = readJson<DemoRegistry>("course_demo_registry/demo_registry.json");
  testNativeVisualStory(registry);
  testCosmosRuntime(registry);
  testEnsembleRuntime(registry);
  testManimRuntime(registry);
  console.log("Runtime contract tests passed: Manim, Cosmos adapter, Ensemble Soft Voting, native visual story");
}

main();
