"use client";

import { useMemo, useState } from "react";

type DataPoint = {
  x: number;
  y: number;
  predicted: number;
  residual: number;
  absResidual: number;
  index: number;
};

const width = 760;
const height = 390;
const padding = 44;
const xMin = 0;
const xMax = 10;

function mulberry32(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function normalRandom(random: () => number) {
  const u = Math.max(random(), Number.EPSILON);
  const v = Math.max(random(), Number.EPSILON);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function fitOrdinaryLeastSquares(points: Array<{ x: number; y: number }>) {
  const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const numerator = points.reduce(
    (sum, point) => sum + (point.x - meanX) * (point.y - meanY),
    0,
  );
  const denominator = points.reduce(
    (sum, point) => sum + (point.x - meanX) ** 2,
    0,
  );
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = meanY - slope * meanX;
  return { slope, intercept };
}

export default function LinearRegressionPlayground() {
  const [seed, setSeed] = useState(42);
  const [pointCount, setPointCount] = useState(50);
  const [noiseStd, setNoiseStd] = useState(8);
  const [topK, setTopK] = useState(5);
  const [lineMode, setLineMode] = useState<"fitted" | "manual">("fitted");
  const [manualSlope, setManualSlope] = useState(6);
  const [manualIntercept, setManualIntercept] = useState(10);

  const generated = useMemo(() => {
    const random = mulberry32(seed);
    const trueSlope = 2 + random() * 6;
    const trueIntercept = 5 + random() * 20;
    const points = Array.from({ length: pointCount }, (_, index) => {
      const x = xMin + ((xMax - xMin) * index) / Math.max(pointCount - 1, 1);
      const y = trueSlope * x + trueIntercept + normalRandom(random) * noiseStd;
      return { x, y };
    });
    const fitted = fitOrdinaryLeastSquares(points);
    return {
      points,
      trueSlope,
      trueIntercept,
      variance: noiseStd ** 2,
      fittedSlope: fitted.slope,
      fittedIntercept: fitted.intercept,
    };
  }, [noiseStd, pointCount, seed]);

  const activeSlope = lineMode === "fitted" ? generated.fittedSlope : manualSlope;
  const activeIntercept = lineMode === "fitted" ? generated.fittedIntercept : manualIntercept;

  const analysis = useMemo(() => {
    const rows: DataPoint[] = generated.points.map((point, index) => {
      const predicted = activeSlope * point.x + activeIntercept;
      const residual = point.y - predicted;
      return {
        ...point,
        predicted,
        residual,
        absResidual: Math.abs(residual),
        index,
      };
    });
    const ranked = [...rows].sort((a, b) => b.absResidual - a.absResidual);
    const outliers = ranked.slice(0, Math.min(topK, rows.length));
    const outlierIndexes = new Set(outliers.map((row) => row.index));
    const mae = rows.reduce((sum, row) => sum + row.absResidual, 0) / rows.length;
    const mse = rows.reduce((sum, row) => sum + row.residual ** 2, 0) / rows.length;
    return { rows, outliers, outlierIndexes, mae, mse };
  }, [activeIntercept, activeSlope, generated.points, topK]);

  const yBounds = useMemo(() => {
    const lineValues = [
      activeSlope * xMin + activeIntercept,
      activeSlope * xMax + activeIntercept,
    ];
    const values = [...generated.points.map((point) => point.y), ...lineValues];
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const margin = Math.max((rawMax - rawMin) * 0.12, 5);
    return { min: rawMin - margin, max: rawMax + margin };
  }, [activeIntercept, activeSlope, generated.points]);

  function scaleX(value: number) {
    return padding + ((value - xMin) / (xMax - xMin)) * (width - padding * 2);
  }

  function scaleY(value: number) {
    return height - padding - ((value - yBounds.min) / (yBounds.max - yBounds.min)) * (height - padding * 2);
  }

  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-emerald-700">Native migrated module</p>
          <h3 className="mt-1 text-xl font-black text-ink">簡單線性迴歸與離群值實驗室</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            本元件依照原 L4 Streamlit 功能重構，可產生可重現資料、自動擬合迴歸線、計算殘差並標示 Top K 離群值。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSeed((current) => current + 1)}
          className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
        >
          重新產生資料
        </button>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="線性迴歸、自動擬合、殘差與離群值圖" className="h-auto w-full">
            <rect width={width} height={height} fill="white" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#94a3b8" strokeWidth="2" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#94a3b8" strokeWidth="2" />

            {analysis.rows.map((point) => {
              const isOutlier = analysis.outlierIndexes.has(point.index);
              const outlierRank = analysis.outliers.findIndex((row) => row.index === point.index);
              return (
                <g key={point.index}>
                  <line
                    x1={scaleX(point.x)}
                    y1={scaleY(point.y)}
                    x2={scaleX(point.x)}
                    y2={scaleY(point.predicted)}
                    stroke={isOutlier ? "#fb7185" : "#cbd5e1"}
                    strokeWidth={isOutlier ? 2 : 1}
                    strokeDasharray="5 5"
                  />
                  <circle
                    cx={scaleX(point.x)}
                    cy={scaleY(point.y)}
                    r={isOutlier ? 8 : 5}
                    fill={isOutlier ? "#e11d48" : "#0f766e"}
                  />
                  {isOutlier && (
                    <text
                      x={scaleX(point.x)}
                      y={scaleY(point.y) - 12}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="800"
                      fill="#be123c"
                    >
                      {outlierRank + 1}
                    </text>
                  )}
                </g>
              );
            })}

            <line
              x1={scaleX(xMin)}
              y1={scaleY(activeSlope * xMin + activeIntercept)}
              x2={scaleX(xMax)}
              y2={scaleY(activeSlope * xMax + activeIntercept)}
              stroke="#f97316"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-2 text-sm font-bold">
            <button
              type="button"
              onClick={() => setLineMode("fitted")}
              className={`rounded-xl px-3 py-3 ${lineMode === "fitted" ? "bg-emerald-700 text-white" : "text-slate-600"}`}
            >
              OLS 自動擬合
            </button>
            <button
              type="button"
              onClick={() => setLineMode("manual")}
              className={`rounded-xl px-3 py-3 ${lineMode === "manual" ? "bg-orange-500 text-white" : "text-slate-600"}`}
            >
              手動調整
            </button>
          </div>

          <label className="block text-sm font-bold text-ink">
            資料筆數：{pointCount}
            <input type="range" min="20" max="120" step="10" value={pointCount} onChange={(event) => setPointCount(Number(event.target.value))} className="mt-3 w-full accent-emerald-700" />
          </label>

          <label className="block text-sm font-bold text-ink">
            雜訊標準差：{noiseStd.toFixed(0)}
            <input type="range" min="0" max="20" step="1" value={noiseStd} onChange={(event) => setNoiseStd(Number(event.target.value))} className="mt-3 w-full accent-emerald-700" />
          </label>

          <label className="block text-sm font-bold text-ink">
            Top K Outliers：{topK}
            <input type="range" min="1" max="10" step="1" value={topK} onChange={(event) => setTopK(Number(event.target.value))} className="mt-3 w-full accent-rose-600" />
          </label>

          <label className="block text-sm font-bold text-ink">
            Random Seed
            <input type="number" value={seed} onChange={(event) => setSeed(Number(event.target.value) || 0)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>

          {lineMode === "manual" && (
            <div className="space-y-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <label className="block text-sm font-bold text-ink">
                手動斜率：{manualSlope.toFixed(1)}
                <input type="range" min="-10" max="15" step="0.5" value={manualSlope} onChange={(event) => setManualSlope(Number(event.target.value))} className="mt-3 w-full accent-orange-500" />
              </label>
              <label className="block text-sm font-bold text-ink">
                手動截距：{manualIntercept.toFixed(0)}
                <input type="range" min="-20" max="60" step="1" value={manualIntercept} onChange={(event) => setManualIntercept(Number(event.target.value))} className="mt-3 w-full accent-orange-500" />
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["True slope", generated.trueSlope.toFixed(3)],
          ["True intercept", generated.trueIntercept.toFixed(3)],
          ["Variance", generated.variance.toFixed(1)],
          ["Estimated slope", generated.fittedSlope.toFixed(3)],
          ["Estimated intercept", generated.fittedIntercept.toFixed(3)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-4">
            <p className="text-xs font-bold text-slate-400">{label}</p>
            <p className="mt-1 text-lg font-black text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs font-bold text-slate-400">平均絕對殘差 MAE</p>
          <p className="mt-1 text-2xl font-black text-ink">{analysis.mae.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs font-bold text-slate-400">均方誤差 MSE</p>
          <p className="mt-1 text-2xl font-black text-ink">{analysis.mse.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3">排名</th>
              <th className="px-4 py-3">X</th>
              <th className="px-4 py-3">Y</th>
              <th className="px-4 py-3">Y pred</th>
              <th className="px-4 py-3">Residual</th>
              <th className="px-4 py-3">Abs residual</th>
            </tr>
          </thead>
          <tbody>
            {analysis.outliers.map((row, index) => (
              <tr key={row.index} className="border-t border-slate-100">
                <td className="px-4 py-3 font-black text-rose-600">{index + 1}</td>
                <td className="px-4 py-3">{row.x.toFixed(2)}</td>
                <td className="px-4 py-3">{row.y.toFixed(2)}</td>
                <td className="px-4 py-3">{row.predicted.toFixed(2)}</td>
                <td className="px-4 py-3">{row.residual.toFixed(2)}</td>
                <td className="px-4 py-3 font-bold">{row.absResidual.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
