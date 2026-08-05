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
    transition: string;
  }>;
};

type DemoRegistry = Record<string, {
  mode: string;
  url?: string;
  description?: string;
}>;

type EnsembleReport = {
  deployedModel: {
    modelVersion: string;
    algorithm: string;
    deployedModel: string;
    sourceRevision: string;
    modelSha256: string;
    metrics: {
      accuracy: number;
      precision: number;
      recall: number;
      f1: number;
      confusionMatrix: number[][];
    };
  };
  deploymentVerification: {
    status: string;
    workflowRunId: number;
    artifactId: number;
    artifactZipSha256: string;
    datasetRecords: number;
    featureCount: number;
    datasetSha256: string;
  };
  modelComparison: Record<string, {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
  }>;
  fairness: {
    method: string;
    sex: Record<string, { count: number; recall: number; falsePositiveRate: number; selectionRate: number }>;
    race: Record<string, { count: number; recall: number; falsePositiveRate: number; selectionRate: number }>;
  };
  warning: string;
};

function testNativeVisualStory(): void {
  const story = readJson<StoryData>("src/data/ai-visual-story.json");
  const registry = readJson<DemoRegistry>("course_demo_registry/demo_registry.json");
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
    assert.ok(["fade", "slide-in", "zoom-in"].includes(slide.transition));
    assert.ok(slide.imageUrl.includes(story.sourceRevision), `${slide.id} image must pin the source revision`);
  }

  assert.equal(registry["ai-visual-story"].mode, "native");
  assert.equal(registry["ai-visual-story"].url, "/learning-labs/ai-visual-story");
  assert.ok(!JSON.stringify(registry["ai-visual-story"]).includes("iframe"));
  assert.ok(route.includes('"ai-visual-story"'));
  assert.ok(route.includes("<VisualStoryPlayer />"));

  for (const contract of [
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

function testCosmosRuntimeContract(): void {
  const unconfigured = resolveCosmosConfig({});
  assert.equal(unconfigured.configured, false);
  assert.equal(unconfigured.model, DEFAULT_COSMOS_MODEL);
  assert.equal(unconfigured.provider, "huggingface-inference-router");
  assert.ok(!JSON.stringify(unconfigured).includes("Bearer"));

  const configured = resolveCosmosConfig({
    HF_TOKEN: "secret-test-token",
    COSMOS_ENDPOINT_URL: "https://gpu.example.test/generate",
    COSMOS_MODEL_ID: "nvidia/Cosmos3-Super-Text2Image",
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
  const payload = buildCosmosPayload(input) as {
    inputs: string;
    parameters: { width: number; height: number; seed: number };
  };
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

  const generateRoute = readText("src/app/api/cosmos/generate/route.ts");
  const statusRoute = readText("src/app/api/cosmos/status/route.ts");
  const lab = readText("src/components/runtime-labs/cosmos-runtime-lab.tsx");
  assert.ok(generateRoute.includes("getCosmosToken"));
  assert.ok(generateRoute.includes("X-Cosmos-Model"));
  assert.ok(generateRoute.includes("runtime_unconfigured"));
  assert.ok(!statusRoute.includes("getCosmosToken"));
  assert.ok(lab.includes("沒有 Mock Mode、Unsplash 備援"));
}

function testEnsembleRuntimeContract(): void {
  const report = readJson<EnsembleReport>("src/data/ensemble-runtime-report.json");
  const registry = readJson<DemoRegistry>("course_demo_registry/demo_registry.json");
  const runtime = readText("api/_ensemble_runtime.py");
  const handler = readText("api/ensemble-predict.py");
  const trainer = readText("modules/ensemble-income-predictor/scripts/train_model.py");
  const exporter = readText("modules/ensemble-income-predictor/scripts/export_soft_voting.py");
  const workflow = readText(".github/workflows/ensemble-runtime.yml");
  const lab = readText("src/components/runtime-labs/ensemble-runtime-lab.tsx");
  const vercel = readText("vercel.json");

  assert.equal(registry["ensemble-income-predictor"].mode, "native");
  assert.equal(registry["ensemble-income-predictor"].url, "/learning-labs/ensemble-fairness-lab");
  assert.equal(report.deployedModel.modelVersion, "adult-income-soft-voting-v1.1");
  assert.equal(report.deployedModel.deployedModel, "SoftVotingEnsemble");
  assert.equal(report.deployedModel.algorithm, "VotingClassifier(voting=soft)");
  assert.match(report.deployedModel.sourceRevision, /^[0-9a-f]{40}$/);
  assert.match(report.deployedModel.modelSha256, /^[0-9a-f]{64}$/);
  assert.equal(report.deploymentVerification.status, "verified");
  assert.match(report.deploymentVerification.artifactZipSha256, /^[0-9a-f]{64}$/);
  assert.equal(report.deploymentVerification.datasetRecords, 32561);
  assert.equal(report.deploymentVerification.featureCount, 14);
  assert.equal(report.deployedModel.metrics.f1, report.modelComparison.SoftVotingEnsemble.f1);
  assert.equal(report.deployedModel.metrics.confusionMatrix.length, 2);
  assert.deepEqual(
    new Set(Object.keys(report.modelComparison)),
    new Set(["LogisticRegression", "DecisionTree", "RandomForest", "GradientBoosting", "SoftVotingEnsemble"]),
  );
  assert.ok(Object.keys(report.fairness.sex).length >= 2);
  assert.ok(Object.keys(report.fairness.race).length >= 5);
  assert.ok(report.warning.includes("高風險"));

  for (const contract of [
    "LOCAL_MODEL_PATH",
    "modelSha256",
    "predict_proba",
    "loggingSensitiveInputs",
    "不得用於徵才",
  ]) {
    assert.ok(runtime.includes(contract), `ensemble runtime missing contract: ${contract}`);
  }
  assert.ok(handler.includes("BaseHTTPRequestHandler"));
  assert.ok(handler.includes("MAX_BODY_BYTES"));
  assert.ok(handler.includes("Do not log request bodies"));

  for (const model of Object.keys(report.modelComparison)) {
    assert.ok(trainer.includes(`\"${model}\"`), `trainer missing model: ${model}`);
  }
  assert.ok(exporter.includes('DEPLOYED_MODEL_NAME = "SoftVotingEnsemble"'));
  assert.ok(trainer.includes('"sex"'));
  assert.ok(trainer.includes('"race"'));
  assert.ok(trainer.includes("falsePositiveRate"));
  assert.ok(workflow.includes("Retrain five Adult Census classifiers"));
  assert.ok(workflow.includes("Compare candidate with versioned deployment artifact"));
  assert.ok(workflow.includes("Exercise versioned Soft Voting Runtime"));
  assert.ok(!workflow.includes("git push origin"));
  assert.ok(vercel.includes("runtime-artifacts/**"));
  assert.ok(lab.includes("predict_proba"));
  assert.ok(lab.includes("不使用預先寫死的機率"));
}

function main(): void {
  testNativeVisualStory();
  testCosmosRuntimeContract();
  testEnsembleRuntimeContract();
  console.log("Runtime contract tests passed: native visual story, Cosmos provider adapter, Ensemble Soft Voting runtime");
}

main();
