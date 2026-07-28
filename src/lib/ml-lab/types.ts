export type CrispDmStageId =
  | "business_understanding"
  | "data_understanding"
  | "data_preparation"
  | "modeling"
  | "evaluation"
  | "deployment";

export interface CrispDmStage {
  id: CrispDmStageId;
  title: string;
  titleZh: string;
  summary: string;
  details: string[];
  keyOutputs: string[];
}

export interface EvaluationMetrics {
  mae: number;
  mse: number;
  rmse: number;
  rSquared: number;
}

export interface OlsResult {
  slope: number;
  intercept: number;
  metrics: EvaluationMetrics;
  residuals: number[];
  fittedValues: number[];
}

export interface StartupPredictInput {
  rdSpend: number;
  administration: number;
  marketingSpend: number;
  state: "New York" | "California" | "Florida";
}

export interface StartupPredictOutput {
  predictedProfit: number;
  modelVersion: string;
  metrics: EvaluationMetrics;
  input: StartupPredictInput;
}

export type FeatureSelectionMethodKey =
  | "pearson"
  | "spearman"
  | "ftest"
  | "mutual_info"
  | "rfe"
  | "sfs"
  | "sbs"
  | "lasso"
  | "rf";

export interface FeatureRankingItem {
  feature: string;
  score: number;
  rank: number;
}

export interface FeatureSelectionResultItem {
  method: FeatureSelectionMethodKey;
  methodName: string;
  mode: "ethical" | "historical";
  k: number;
  selectedFeatures: string[];
  metrics: EvaluationMetrics;
  rankings: FeatureRankingItem[];
}

export interface StockDataPoint {
  date: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  ma5: number;
  ma20: number;
  dailyReturn: number;
}
