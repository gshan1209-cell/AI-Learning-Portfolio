import { fitOls, calculateMae, calculateMse, calculateRmse, calculateRSquared } from "../src/lib/ml-lab/metrics/regression-metrics";
import { predictStartupProfit, getRfGoldenSamples } from "../src/lib/ml-lab/regression/random-forest-infer";
import { getFeatureSelectionResults, calculatePearson } from "../src/lib/ml-lab/feature-selection/live-select";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed++;
    throw new Error(message);
  } else {
    console.log(`✅ PASS: ${message}`);
    passed++;
  }
}

async function runAllTests() {
  console.log("=== Running Regression Lab Automated Tests ===\n");

  // 1. Metrics & OLS Test
  console.log("--- 1. Regression Metrics & OLS Math ---");
  const yTrue = [10, 20, 30, 40, 50];
  const yPred = [12, 18, 31, 39, 52];

  const mae = calculateMae(yTrue, yPred);
  assert(Math.abs(mae - 1.6) < 0.001, `MAE calculation (expected 1.6, got ${mae})`);

  const mse = calculateMse(yTrue, yPred);
  assert(Math.abs(mse - 2.8) < 0.001, `MSE calculation (expected 2.8, got ${mse})`);

  const rmse = calculateRmse(yTrue, yPred);
  assert(Math.abs(rmse - Math.sqrt(2.8)) < 0.001, `RMSE calculation`);

  const r2 = calculateRSquared(yTrue, yPred);
  assert(r2 > 0.95, `R² calculation (got ${r2})`);

  const ols = fitOls([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  assert(Math.abs(ols.slope - 2.0) < 0.001, `OLS slope = 2.0`);
  assert(Math.abs(ols.intercept - 0.0) < 0.001, `OLS intercept = 0.0`);
  assert(Math.abs(ols.metrics.rSquared - 1.0) < 0.001, `OLS perfect fit R² = 1.0`);

  // 2. Startup Random Forest Golden Samples Test
  console.log("\n--- 2. Random Forest Inference & Golden Samples ---");
  const goldenSamples = getRfGoldenSamples();
  for (const sample of goldenSamples) {
    const output = predictStartupProfit(sample.input);
    const diff = Math.abs(output.predictedProfit - sample.expectedProfit);
    assert(diff < 1.0, `RF Golden Sample (${sample.input.state}) expected ${sample.expectedProfit}, got ${output.predictedProfit}`);
  }

  // 3. Feature Selection & Ethical Governance Test
  console.log("\n--- 3. Feature Selection & Ethical Governance ---");
  const ethicalRes = getFeatureSelectionResults("pearson", "ethical", 5);
  assert(ethicalRes.selectedFeatures.length === 5, `Ethical Mode k=5 returns 5 features`);
  assert(!ethicalRes.selectedFeatures.includes("B"), `Ethical Mode excludes column B`);

  const histRes = getFeatureSelectionResults("pearson", "historical", 5);
  assert(histRes.selectedFeatures.length === 5, `Historical Mode k=5 returns 5 features`);

  const pearsonVal = calculatePearson([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  assert(Math.abs(pearsonVal - 1.0) < 0.001, `Live Pearson calculation = 1.0`);

  console.log(`\n=== Test Summary: ${passed} Passed, ${failed} Failed ===`);
  if (failed > 0) process.exit(1);
}

runAllTests().catch((err) => {
  console.error("Test suite failed:", err);
  process.exit(1);
});
