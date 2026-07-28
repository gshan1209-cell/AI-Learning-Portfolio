import featureArtifact from "../../../../modules/feature-selection/artifacts/feature_selection_results.json";
import type { FeatureRankingItem, FeatureSelectionMethodKey, FeatureSelectionResultItem } from "../types";

interface SelectionArtifact {
  metadata: {
    sourceRepository: string;
    sourceCommit: string;
    dataset: string;
    totalRows: number;
    ethicalFeaturesCount: number;
    historicalFeaturesCount: number;
    generatedAt: string;
  };
  ethicalMode: Record<string, {
    methodKey: FeatureSelectionMethodKey;
    methodName: string;
    mode: "ethical" | "historical";
    rankings: FeatureRankingItem[];
    kResults: Array<{
      k: number;
      selectedFeatures: string[];
      metrics: { rSquared: number; mse: number; mae: number; rmse: number };
    }>;
  }>;
  historicalMode: Record<string, {
    methodKey: FeatureSelectionMethodKey;
    methodName: string;
    mode: "ethical" | "historical";
    rankings: FeatureRankingItem[];
    kResults: Array<{
      k: number;
      selectedFeatures: string[];
      metrics: { rSquared: number; mse: number; mae: number; rmse: number };
    }>;
  }>;
}

const artifact = featureArtifact as unknown as SelectionArtifact;

export function calculatePearson(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0 || n !== y.length) return 0;

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    num += diffX * diffY;
    denX += diffX * diffX;
    denY += diffY * diffY;
  }

  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : num / den;
}

export function getFeatureSelectionResults(
  method: FeatureSelectionMethodKey = "pearson",
  mode: "ethical" | "historical" = "ethical",
  k: number = 5
): FeatureSelectionResultItem {
  const modeData = mode === "ethical" ? artifact.ethicalMode : artifact.historicalMode;
  const methodData = modeData[method] || modeData["pearson"];

  const maxK = methodData.rankings.length;
  const validK = Math.max(1, Math.min(maxK, Math.round(k)));

  const kMatch = methodData.kResults.find((item) => item.k === validK) || methodData.kResults[0];

  return {
    method: methodData.methodKey,
    methodName: methodData.methodName,
    mode,
    k: validK,
    selectedFeatures: kMatch.selectedFeatures,
    metrics: kMatch.metrics,
    rankings: methodData.rankings,
  };
}

export function getFeatureSelectionMetadata() {
  return artifact.metadata;
}
