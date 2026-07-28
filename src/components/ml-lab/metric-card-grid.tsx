import type { EvaluationMetrics } from "@/lib/ml-lab/types";

interface MetricCardGridProps {
  metrics: EvaluationMetrics;
  title?: string;
}

export default function MetricCardGrid({ metrics, title = "模型評估指標 (Evaluation Metrics)" }: MetricCardGridProps) {
  const cards = [
    {
      key: "rSquared",
      label: "R² 決定係數",
      value: metrics.rSquared.toFixed(4),
      desc: "反映模型解釋目標變異的比例 (越接近 1.0 越佳)",
      highlight: true,
    },
    {
      key: "mae",
      label: "MAE 平均絕對誤差",
      value: metrics.mae.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      desc: "實際值與預測值絕對差距的平均數",
    },
    {
      key: "rmse",
      label: "RMSE 均方根誤差",
      value: metrics.rmse.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      desc: "對大誤差敏感的開方指標",
    },
    {
      key: "mse",
      label: "MSE 均方誤差",
      value: metrics.mse.toLocaleString(undefined, { maximumFractionDigits: 2 }),
      desc: "殘差平方的平均值",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
      <h3 className="text-lg font-black text-ink">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.key}
            className={`rounded-2xl border p-4 transition-all ${
              card.highlight
                ? "border-emerald-200 bg-emerald-50/70 text-emerald-950 shadow-2xs"
                : "border-slate-200 bg-slate-50 text-slate-800"
            }`}
          >
            <div className="text-xs font-bold text-slate-500">{card.label}</div>
            <div className="mt-1 text-2xl font-black">{card.value}</div>
            <div className="mt-2 text-[11px] leading-tight text-slate-500">{card.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
