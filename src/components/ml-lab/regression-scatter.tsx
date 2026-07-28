"use client";

interface RegressionScatterProps {
  x: number[];
  y: number[];
  fittedValues?: number[];
  xLabel?: string;
  yLabel?: string;
  title?: string;
}

export default function RegressionScatter({
  x,
  y,
  fittedValues,
  xLabel = "輸入特徵 X",
  yLabel = "目標數值 Y",
  title = "擬合趨勢與散態圖 (Regression Fit)",
}: RegressionScatterProps) {
  if (x.length === 0 || x.length !== y.length) {
    return <div className="p-4 text-xs text-slate-400">無有效數據提供視覺化。</div>;
  }

  const width = 600;
  const height = 300;
  const padding = 50;

  const minX = Math.min(...x);
  const maxX = Math.max(...x) || 1;
  const minY = Math.min(...y);
  const maxY = Math.max(...y) || 1;

  const scaleX = (val: number) =>
    padding + ((val - minX) / (maxX - minX || 1)) * (width - 2 * padding);
  const scaleY = (val: number) =>
    height - padding - ((val - minY) / (maxY - minY || 1)) * (height - 2 * padding);

  // Generate line points if fittedValues exist
  const points = x.map((xi, i) => ({
    xScaled: scaleX(xi),
    yScaled: scaleY(y[i]),
    yFitScaled: fittedValues ? scaleY(fittedValues[i]) : null,
  }));

  // Sort by x for continuous line
  const sortedPoints = [...points].sort((a, b) => a.xScaled - b.xScaled);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
      <h3 className="text-lg font-black text-ink">{title}</h3>
      <div className="mt-4 flex justify-center overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-2xl text-xs select-none">
          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Labels */}
          <text x={width / 2} y={height - 10} textAnchor="middle" fill="#64748b" className="font-semibold">{xLabel}</text>
          <text x={15} y={height / 2} textAnchor="middle" transform={`rotate(-90 15 ${height / 2})`} fill="#64748b" className="font-semibold">{yLabel}</text>

          {/* Fitted Line */}
          {fittedValues && sortedPoints.length > 1 && (
            <line
              x1={sortedPoints[0].xScaled}
              y1={sortedPoints[0].yFitScaled!}
              x2={sortedPoints[sortedPoints.length - 1].xScaled}
              y2={sortedPoints[sortedPoints.length - 1].yFitScaled!}
              stroke="#059669"
              strokeWidth="2.5"
            />
          )}

          {/* Scatter Data Points */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.xScaled}
              cy={pt.yScaled}
              r="4"
              fill="#0284c7"
              opacity="0.75"
              className="transition-all hover:r-6 hover:opacity-100"
            />
          ))}
        </svg>
      </div>
      <div className="mt-2 flex items-center justify-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-sky-600"></span> 實際觀察點 (Scatter)</span>
        {fittedValues && <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 bg-emerald-600"></span> OLS 擬合直線 (Fitted Line)</span>}
      </div>
    </div>
  );
}
