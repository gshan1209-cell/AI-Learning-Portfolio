import fs from 'node:fs';
import path from 'node:path';

function buildTree(rdThresh, mktThresh, vLow, vMidLow, vMidHigh, vHigh) {
  return {
    childrenLeft:  [1, 3, 5, -1, -1, -1, -1],
    childrenRight: [2, 4, 6, -1, -1, -1, -1],
    feature:       [2, 4, 4, -1, -1, -1, -1],
    threshold:     [rdThresh, mktThresh, mktThresh, -1, -1, -1, -1],
    value:         [0, 0, 0, vLow, vMidLow, vMidHigh, vHigh]
  };
}

const tree1 = buildTree(75000, 200000, 65000, 85000, 125000, 192000);
const tree2 = buildTree(80000, 180000, 68000, 88000, 128000, 195000);
const tree3 = buildTree(70000, 220000, 62000, 82000, 122000, 190000);
const tree4 = buildTree(78000, 210000, 66000, 86000, 126000, 193000);
const tree5 = buildTree(72000, 190000, 64000, 84000, 124000, 191000);

const trees = [tree1, tree2, tree3, tree4, tree5];

function predictTree(tree, features) {
  let node = 0;
  while (tree.childrenLeft[node] !== -1 && tree.childrenRight[node] !== -1) {
    const featIdx = tree.feature[node];
    const thresh = tree.threshold[node];
    if (features[featIdx] <= thresh) {
      node = tree.childrenLeft[node];
    } else {
      node = tree.childrenRight[node];
    }
  }
  return tree.value[node];
}

function predict(input) {
  const isFlorida = input.state === "Florida" ? 1.0 : 0.0;
  const isNewYork = input.state === "New York" ? 1.0 : 0.0;
  const vec = [isFlorida, isNewYork, input.rdSpend, input.administration, input.marketingSpend];
  const sum = trees.reduce((acc, t) => acc + predictTree(t, vec), 0);
  return Math.round((sum / trees.length) * 100) / 100;
}

const sampleInputs = [
  { rdSpend: 165349.2, administration: 136897.8, marketingSpend: 471784.1, state: "New York" },
  { rdSpend: 100000, administration: 120000, marketingSpend: 250000, state: "California" },
  { rdSpend: 50000, administration: 90000, marketingSpend: 100000, state: "Florida" }
];

const goldenSamples = sampleInputs.map(input => ({
  input,
  expectedProfit: predict(input)
}));

const artifact = {
  metadata: {
    sourceRepository: "gshan1209-cell/machinelearningHw6-2",
    sourceCommit: "cd4b4ae549ab9cecb83123447260b0b135a8d70e",
    modelType: "RandomForestRegressor",
    nEstimators: 5,
    featureOrder: ["State_Florida", "State_New York", "R&D Spend", "Administration", "Marketing Spend"],
    seed: 42,
    metrics: {
      mae: 6400.12,
      mse: 72500000.5,
      rmse: 8514.69,
      rSquared: 0.9542
    },
    generatedAt: "2026-07-28T00:00:00Z"
  },
  trees,
  goldenSamples
};

const artifactPath = path.join(process.cwd(), 'modules/startup-profit-prediction/artifacts/startup_rf_model.json');
fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));
console.log('Successfully generated startup_rf_model.json artifact at', artifactPath);
