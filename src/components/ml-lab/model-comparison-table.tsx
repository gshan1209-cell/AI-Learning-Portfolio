import type { EvaluationMetrics } from "@/lib/ml-lab/types";

interface ModelComparisonRow {
  modelName: string;
  datasetName: string;
  metrics: EvaluationMetrics;
  notes?: string;
}

interface ModelComparisonTableProps {
  rows: ModelComparisonRow[];
  title?: string;
}

export default function ModelComparisonTable({ rows, title = "演算法模型比較表 (Model Comparison)" }: ModelComparisonTableProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
      <h3 className="text-lg font-black text-ink">{title}</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <th className="p-3 font-bold">模型演算法</th>
              <th className="p-3 font-bold">資料切分/情境</th>
              <th className="p-3 font-bold text-right">R²</th>
              <th className="p-3 font-bold text-right">MAE</th>
              <th className="p-3 font-bold text-right">RMSE</th>
              <th className="p-3 font-bold">備註說明</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80">
                <td className="p-3 font-black text-slate-800">{row.modelName}</td>
                <td className="p-3 text-slate-600">{row.datasetName}</td>
                <td className="p-3 text-right font-bold text-emerald-600">{row.metrics.rSquared.toFixed(4)}</td>
                <td className="p-3 text-right text-slate-700">{row.metrics.mae.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                <td className="p-3 text-right text-slate-700">{row.metrics.rmse.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                <td className="p-3 text-slate-500">{row.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
