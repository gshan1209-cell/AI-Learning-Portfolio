"use client";

import { useMemo, useState } from "react";

const points = [
  { x: 1, y: 18 },
  { x: 2, y: 24 },
  { x: 3, y: 27 },
  { x: 4, y: 38 },
  { x: 5, y: 42 },
  { x: 6, y: 49 },
  { x: 7, y: 58 },
  { x: 8, y: 60 },
  { x: 9, y: 72 },
];

const width = 720;
const height = 360;
const padding = 38;
const xMax = 10;
const yMax = 100;

function scaleX(value: number) {
  return padding + (value / xMax) * (width - padding * 2);
}

function scaleY(value: number) {
  return height - padding - (value / yMax) * (height - padding * 2);
}

export default function LinearRegressionPlayground() {
  const [slope, setSlope] = useState(6);
  const [intercept, setIntercept] = useState(10);

  const metrics = useMemo(() => {
    const residuals = points.map((point) => point.y - (slope * point.x + intercept));
    const mae = residuals.reduce((sum, value) => sum + Math.abs(value), 0) / residuals.length;
    const largest = residuals.reduce(
      (current, value, index) => Math.abs(value) > Math.abs(current.value) ? { value, index } : current,
      { value: residuals[0], index: 0 },
    );

    return { mae, largestPoint: points[largest.index], largestResidual: largest.value };
  }, [intercept, slope]);

  const lineStart = { x: 0, y: intercept };
  const lineEnd = { x: xMax, y: slope * xMax + intercept };

  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5 md:p-7">
      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="可調整斜率與截距的線性迴歸示意圖" className="h-auto w-full">
            <rect width={width} height={height} fill="white" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#94a3b8" strokeWidth="2" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#94a3b8" strokeWidth="2" />

            {points.map((point) => {
              const predicted = slope * point.x + intercept;
              return (
                <g key={`${point.x}-${point.y}`}>
                  <line
                    x1={scaleX(point.x)}
                    y1={scaleY(point.y)}
                    x2={scaleX(point.x)}
                    y2={scaleY(predicted)}
                    stroke="#cbd5e1"
                    strokeDasharray="5 5"
                  />
                  <circle cx={scaleX(point.x)} cy={scaleY(point.y)} r="7" fill="#0f766e" />
                </g>
              );
            })}

            <line
              x1={scaleX(lineStart.x)}
              y1={scaleY(lineStart.y)}
              x2={scaleX(lineEnd.x)}
              y2={scaleY(lineEnd.y)}
              stroke="#f97316"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="space-y-6">
          <label className="block text-sm font-bold text-ink">
            斜率：{slope.toFixed(1)}
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={slope}
              onChange={(event) => setSlope(Number(event.target.value))}
              className="mt-3 w-full accent-emerald-700"
            />
          </label>

          <label className="block text-sm font-bold text-ink">
            截距：{intercept.toFixed(0)}
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={intercept}
              onChange={(event) => setIntercept(Number(event.target.value))}
              className="mt-3 w-full accent-emerald-700"
            />
          </label>

          <div className="rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600">
            <p><strong className="text-ink">平均絕對殘差：</strong>{metrics.mae.toFixed(1)}</p>
            <p className="mt-2"><strong className="text-ink">偏離最大資料點：</strong>x={metrics.largestPoint.x}、y={metrics.largestPoint.y}</p>
            <p className="mt-2 text-xs text-slate-500">調整橘色直線，嘗試讓灰色殘差線整體變短。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
