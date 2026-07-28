import type { EvaluationMetrics, OlsResult } from "../types";

export function calculateMae(yTrue: number[], yPred: number[]): number {
  if (yTrue.length === 0 || yTrue.length !== yPred.length) return 0;
  const sum = yTrue.reduce((acc, val, i) => acc + Math.abs(val - yPred[i]), 0);
  return sum / yTrue.length;
}

export function calculateMse(yTrue: number[], yPred: number[]): number {
  if (yTrue.length === 0 || yTrue.length !== yPred.length) return 0;
  const sum = yTrue.reduce((acc, val, i) => acc + Math.pow(val - yPred[i], 2), 0);
  return sum / yTrue.length;
}

export function calculateRmse(yTrue: number[], yPred: number[]): number {
  return Math.sqrt(calculateMse(yTrue, yPred));
}

export function calculateRSquared(yTrue: number[], yPred: number[]): number {
  if (yTrue.length === 0 || yTrue.length !== yPred.length) return 0;
  const meanY = yTrue.reduce((acc, val) => acc + val, 0) / yTrue.length;
  const ssTotal = yTrue.reduce((acc, val) => acc + Math.pow(val - meanY, 2), 0);
  const ssRes = yTrue.reduce((acc, val, i) => acc + Math.pow(val - yPred[i], 2), 0);
  if (ssTotal === 0) return 1;
  return Math.max(-1, Math.min(1, 1 - ssRes / ssTotal));
}

export function evaluateRegression(yTrue: number[], yPred: number[]): EvaluationMetrics {
  return {
    mae: calculateMae(yTrue, yPred),
    mse: calculateMse(yTrue, yPred),
    rmse: calculateRmse(yTrue, yPred),
    rSquared: calculateRSquared(yTrue, yPred),
  };
}

export function fitOls(x: number[], y: number[]): OlsResult {
  const n = x.length;
  if (n === 0 || n !== y.length) {
    return {
      slope: 0,
      intercept: 0,
      metrics: { mae: 0, mse: 0, rmse: 0, rSquared: 0 },
      residuals: [],
      fittedValues: [],
    };
  }

  const meanX = x.reduce((acc, val) => acc + val, 0) / n;
  const meanY = y.reduce((acc, val) => acc + val, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - meanX) * (y[i] - meanY);
    den += Math.pow(x[i] - meanX, 2);
  }

  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;

  const fittedValues = x.map((xi) => slope * xi + intercept);
  const residuals = y.map((yi, i) => yi - fittedValues[i]);
  const metrics = evaluateRegression(y, fittedValues);

  return { slope, intercept, metrics, residuals, fittedValues };
}
