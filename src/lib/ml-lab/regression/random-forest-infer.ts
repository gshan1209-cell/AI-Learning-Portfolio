import rfModelArtifact from "../../../../modules/startup-profit-prediction/artifacts/startup_rf_model.json";
import type { StartupPredictInput, StartupPredictOutput } from "../types";

interface TreeNode {
  childrenLeft: number[];
  childrenRight: number[];
  feature: number[];
  threshold: number[];
  value: number[];
}

interface RfArtifact {
  metadata: {
    sourceRepository: string;
    sourceCommit: string;
    generator: string;
    scikitLearnVersion: string;
    modelType: string;
    nEstimators: number;
    seed: number;
    featureOrder: string[];
    datasetHash: string;
    datasetRows: number;
    datasetNote?: string;
    categoricalEncoding: string;
    modelParameters: Record<string, unknown>;
    trainingScript: string;
    trainingMetrics: { mae: number; mse: number; rmse: number; rSquared: number };
    metrics?: { mae: number; mse: number; rmse: number; rSquared: number };
    generatedAt: string;
  };
  trees: TreeNode[];
  goldenSamples: Array<{
    input: StartupPredictInput;
    expectedProfit: number;
  }>;
}

const artifact = rfModelArtifact as unknown as RfArtifact;

function getNormalizedMetadata(): RfArtifact["metadata"] {
  return {
    ...artifact.metadata,
    datasetNote: `來源檔 50_Startups.csv 實際包含 ${artifact.metadata.datasetRows} 筆紀錄`,
  };
}

export function predictTree(tree: TreeNode, features: number[]): number {
  let node = 0;
  while (tree.childrenLeft[node] !== -1 && tree.childrenRight[node] !== -1) {
    const featureIndex = tree.feature[node];
    const threshold = tree.threshold[node];
    if (features[featureIndex] <= threshold) {
      node = tree.childrenLeft[node];
    } else {
      node = tree.childrenRight[node];
    }
  }
  return tree.value[node];
}

export function predictStartupProfit(input: StartupPredictInput): StartupPredictOutput {
  // Feature order: State_Florida, State_New York, R&D Spend,
  // Administration, Marketing Spend.
  const isFlorida = input.state === "Florida" ? 1.0 : 0.0;
  const isNewYork = input.state === "New York" ? 1.0 : 0.0;
  const rdSpend = Math.max(0, Number(input.rdSpend) || 0);
  const administration = Math.max(0, Number(input.administration) || 0);
  const marketingSpend = Math.max(0, Number(input.marketingSpend) || 0);

  const featureVector = [
    isFlorida,
    isNewYork,
    rdSpend,
    administration,
    marketingSpend,
  ];

  const predictions = artifact.trees.map((tree) => predictTree(tree, featureVector));
  const averageProfit = predictions.reduce((sum, value) => sum + value, 0) / predictions.length;

  return {
    predictedProfit: Math.round(averageProfit * 100) / 100,
    modelVersion: `RF-${artifact.metadata.nEstimators}Trees-v1`,
    metrics: artifact.metadata.trainingMetrics || artifact.metadata.metrics!,
    input: {
      rdSpend,
      administration,
      marketingSpend,
      state: input.state,
    },
  };
}

export function getRfArtifactMetadata() {
  return getNormalizedMetadata();
}

export function getRfGoldenSamples() {
  return artifact.goldenSamples;
}
