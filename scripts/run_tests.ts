import { NextRequest } from "next/server";
import {
  fitOls,
  calculateMae,
  calculateMse,
  calculateRmse,
  calculateRSquared,
} from "../src/lib/ml-lab/metrics/regression-metrics";
import {
  predictStartupProfit,
  getRfGoldenSamples,
  getRfArtifactMetadata,
} from "../src/lib/ml-lab/regression/random-forest-infer";
import {
  getFeatureSelectionResults,
  calculatePearson,
  getFeatureSelectionMetadata,
} from "../src/lib/ml-lab/feature-selection/live-select";
import { POST as predictProfitPost } from "../src/app/api/ml-lab/startup-profit/predict/route";
import { GET as datasetGet } from "../src/app/api/ml-lab/datasets/[dataset]/route";
import { GET as featureResultsGet } from "../src/app/api/ml-lab/feature-selection/results/route";
import rfArtifact from "../modules/startup-profit-prediction/artifacts/startup_rf_model.json";
import featureArtifact from "../modules/feature-selection/artifacts/feature_selection_results.json";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    failed += 1;
    throw new Error(`FAIL: ${message}`);
  }
  console.log(`PASS: ${message}`);
  passed += 1;
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  return await response.json() as Record<string, unknown>;
}

function createJsonRequest(url: string, body: unknown, contentLength?: number) {
  const rawBody = typeof body === "string" ? body : JSON.stringify(body);
  const headers = new Headers({ "Content-Type": "application/json" });
  if (contentLength !== undefined) {
    headers.set("Content-Length", String(contentLength));
  }
  return new NextRequest(url, {
    method: "POST",
    body: rawBody,
    headers,
  });
}

async function runAllTests() {
  console.log("=== Regression Lab Master Test Suite (Wave 002) ===\n");

  console.log("--- 1. Regression Metrics & OLS Math ---");
  const yTrue = [10, 20, 30, 40, 50];
  const yPred = [12, 18, 31, 39, 52];

  const mae = calculateMae(yTrue, yPred);
  assert(Math.abs(mae - 1.6) < 0.001, `MAE calculation = ${mae}`);

  const mse = calculateMse(yTrue, yPred);
  assert(Math.abs(mse - 2.8) < 0.001, `MSE calculation = ${mse}`);

  const rmse = calculateRmse(yTrue, yPred);
  assert(Math.abs(rmse - Math.sqrt(2.8)) < 0.001, `RMSE calculation = ${rmse}`);

  const rSquared = calculateRSquared(yTrue, yPred);
  assert(rSquared > 0.95, `R² calculation = ${rSquared}`);

  const ols = fitOls([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  assert(Math.abs(ols.slope - 2) < 0.001, "OLS slope = 2");
  assert(Math.abs(ols.intercept) < 0.001, "OLS intercept = 0");
  assert(Math.abs(ols.metrics.rSquared - 1) < 0.001, "OLS perfect fit R² = 1");

  console.log("\n--- 2. Random Forest Export & Golden Samples ---");
  const rfMetadata = getRfArtifactMetadata();
  assert(rfMetadata.generator === "scikit-learn RandomForestRegressor", "RF generator is scikit-learn");
  assert(Boolean(rfMetadata.scikitLearnVersion), `RF scikit-learn version = ${rfMetadata.scikitLearnVersion}`);
  assert(rfMetadata.datasetRows === 21, `RF dataset row count is exact (${rfMetadata.datasetRows})`);
  assert(rfMetadata.datasetNote.includes("21"), "RF dataset note reports 21 records");
  assert(Boolean(rfMetadata.datasetHash), "RF dataset hash exists");
  assert(rfMetadata.featureOrder.length === 5, "RF feature order contains five entries");
  assert(rfArtifact.trees.length === rfMetadata.nEstimators, "RF tree count matches metadata");

  for (let index = 0; index < rfArtifact.trees.length; index += 1) {
    const tree = rfArtifact.trees[index];
    const nodeCount = tree.childrenLeft.length;
    assert(
      tree.childrenRight.length === nodeCount
        && tree.feature.length === nodeCount
        && tree.threshold.length === nodeCount
        && tree.value.length === nodeCount,
      `RF tree ${index + 1} node arrays are consistent (${nodeCount} nodes)`,
    );
  }

  const goldenSamples = getRfGoldenSamples();
  assert(goldenSamples.length >= 6, `Golden samples count = ${goldenSamples.length}`);
  assert(new Set(goldenSamples.map((sample) => sample.input.state)).size === 3, "Golden samples cover all three states");
  for (const sample of goldenSamples) {
    const output = predictStartupProfit(sample.input);
    const difference = Math.abs(output.predictedProfit - sample.expectedProfit);
    assert(
      difference < 0.01,
      `TS/Python prediction difference < 0.01 for ${sample.input.state} (${difference.toFixed(4)})`,
    );
  }

  console.log("\n--- 3. Feature Selection & Ethical Governance ---");
  const featureMetadata = getFeatureSelectionMetadata();
  assert(Boolean(featureMetadata.generator), "Feature-selection generator exists");
  assert(Boolean(featureMetadata.datasetHash), "Feature-selection dataset hash exists");
  assert(featureMetadata.totalRows === 506, "Boston Housing contains 506 rows");
  assert(featureMetadata.ethicalFeaturesCount === 12, "Ethical Mode contains 12 features");
  assert(featureMetadata.historicalFeaturesCount === 13, "Historical Mode contains 13 features");

  const methods = [
    "pearson",
    "spearman",
    "ftest",
    "mutual_info",
    "rfe",
    "sfs",
    "sbs",
    "lasso",
    "rf",
  ] as const;

  assert(Object.keys(featureArtifact.ethicalMode).length === methods.length, "Ethical Mode contains all nine methods");
  assert(Object.keys(featureArtifact.historicalMode).length === methods.length, "Historical Mode contains all nine methods");

  for (const method of methods) {
    for (let k = 1; k <= featureMetadata.ethicalFeaturesCount; k += 1) {
      const result = getFeatureSelectionResults(method, "ethical", k);
      assert(result.selectedFeatures.length === k, `Ethical ${method} k=${k} returns ${k} features`);
      assert(!result.selectedFeatures.includes("B"), `Ethical ${method} k=${k} excludes B`);
    }
  }

  for (const method of methods) {
    for (let k = 1; k <= featureMetadata.historicalFeaturesCount; k += 1) {
      const result = getFeatureSelectionResults(method, "historical", k);
      assert(result.selectedFeatures.length === k, `Historical ${method} k=${k} returns ${k} features`);
    }
  }

  const livePearson = calculatePearson([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  assert(Math.abs(livePearson - 1) < 0.001, "Live Pearson calculation = 1");

  console.log("\n--- 4. Dataset API ---");
  for (const dataset of ["tsmc-stock", "startup-50", "boston-housing"]) {
    const response = await datasetGet(
      new NextRequest(`http://localhost/api/ml-lab/datasets/${dataset}`),
      { params: { dataset } },
    );
    const payload = await readJson(response);
    assert(response.status === 200, `Dataset API ${dataset} returns 200`);
    assert(response.headers.get("cache-control") === "no-store", `Dataset API ${dataset} uses no-store`);
    assert(typeof payload.sha256 === "string" && payload.sha256.length === 64, `Dataset API ${dataset} exposes SHA-256`);
    assert(Number(payload.rowCount) > 0, `Dataset API ${dataset} exposes row count`);
    assert(Array.isArray(payload.schema) && payload.schema.length > 0, `Dataset API ${dataset} exposes schema`);
  }

  const startupDatasetResponse = await datasetGet(
    new NextRequest("http://localhost/api/ml-lab/datasets/startup-50"),
    { params: { dataset: "startup-50" } },
  );
  const startupDatasetPayload = await readJson(startupDatasetResponse);
  assert(startupDatasetPayload.rowCount === 21, "Startup dataset API reports exactly 21 rows");
  assert(String(startupDatasetPayload.version).includes("21rows"), "Startup dataset version includes actual row count");

  const unknownDatasetResponse = await datasetGet(
    new NextRequest("http://localhost/api/ml-lab/datasets/../../secret"),
    { params: { dataset: "../../secret" } },
  );
  assert(unknownDatasetResponse.status === 404, "Dataset API rejects non-whitelisted path");
  assert(unknownDatasetResponse.headers.get("cache-control") === "no-store", "Dataset API errors use no-store");

  console.log("\n--- 5. Feature Selection API ---");
  const ethicalResponse = await featureResultsGet(
    new NextRequest("http://localhost/api/ml-lab/feature-selection/results?method=rf&mode=ethical&k=12"),
  );
  const ethicalPayload = await readJson(ethicalResponse);
  assert(ethicalResponse.status === 200, "Feature Selection API returns 200");
  assert(ethicalResponse.headers.get("cache-control") === "no-store", "Feature Selection API uses no-store");
  assert(!((ethicalPayload.selectedFeatures as string[]) || []).includes("B"), "Feature Selection API Ethical Mode excludes B");

  const clampedResponse = await featureResultsGet(
    new NextRequest("http://localhost/api/ml-lab/feature-selection/results?method=unknown&mode=ethical&k=999"),
  );
  const clampedPayload = await readJson(clampedResponse);
  assert((clampedPayload.selectedFeatures as string[]).length === 12, "Feature Selection API clamps Ethical k to 12");

  console.log("\n--- 6. Startup Prediction API ---");
  const validInput = {
    rdSpend: 100000,
    administration: 120000,
    marketingSpend: 250000,
    state: "California",
  };

  const successResponse = await predictProfitPost(
    createJsonRequest("http://localhost/api/ml-lab/startup-profit/predict", validInput),
  );
  const successPayload = await readJson(successResponse);
  assert(successResponse.status === 200, "Startup Prediction API returns 200 for valid input");
  assert(successResponse.headers.get("cache-control") === "no-store", "Startup Prediction API success uses no-store");
  assert(Number.isFinite(Number(successPayload.predictedProfit)), "Startup Prediction API returns finite prediction");

  const invalidJsonResponse = await predictProfitPost(
    createJsonRequest("http://localhost/api/ml-lab/startup-profit/predict", "{invalid-json"),
  );
  assert(invalidJsonResponse.status === 400, "Startup Prediction API rejects invalid JSON");

  for (const [field, value] of [
    ["rdSpend", -1],
    ["administration", 10_000_001],
    ["marketingSpend", "Infinity"],
  ] as const) {
    const response = await predictProfitPost(
      createJsonRequest(
        "http://localhost/api/ml-lab/startup-profit/predict",
        { ...validInput, [field]: value },
      ),
    );
    assert(response.status === 400, `Startup Prediction API rejects invalid ${field}`);
  }

  const invalidStateResponse = await predictProfitPost(
    createJsonRequest(
      "http://localhost/api/ml-lab/startup-profit/predict",
      { ...validInput, state: "Texas" },
    ),
  );
  assert(invalidStateResponse.status === 400, "Startup Prediction API rejects invalid state");

  const extraFieldResponse = await predictProfitPost(
    createJsonRequest(
      "http://localhost/api/ml-lab/startup-profit/predict",
      { ...validInput, debugPayload: "x".repeat(100) },
    ),
  );
  assert(extraFieldResponse.status === 400, "Startup Prediction API rejects unexpected fields");

  const oversizedResponse = await predictProfitPost(
    createJsonRequest(
      "http://localhost/api/ml-lab/startup-profit/predict",
      validInput,
      16 * 1024 + 1,
    ),
  );
  assert(oversizedResponse.status === 413, "Startup Prediction API rejects oversized Content-Length with 413");
  assert(oversizedResponse.headers.get("cache-control") === "no-store", "Startup Prediction API errors use no-store");

  console.log(`\n=== Test Summary: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

runAllTests().catch((error) => {
  console.error("Test suite failed:", error);
  process.exit(1);
});
