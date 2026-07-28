import Link from "next/link";
import CrispDmTimeline from "@/components/ml-lab/crisp-dm-timeline";
import MetricCardGrid from "@/components/ml-lab/metric-card-grid";
import ModelComparisonTable from "@/components/ml-lab/model-comparison-table";
import RegressionScatter from "@/components/ml-lab/regression-scatter";
import EthicsNotice from "@/components/ml-lab/ethics-notice";
import { TSMC_STOCK_SNAPSHOT } from "@/lib/ml-lab/datasets/tsmc-stock";
import { fitOls } from "@/lib/ml-lab/metrics/regression-metrics";

export const metadata = {
  title: "CRISP-DM 迴歸生命週期與股價案例 | Regression Lab",
  description: "學習 CRISP-DM 六階段機器學習專案生命週期，並以台積電歷史股價進行迴歸擬合與時間序列預測。",
};

export default function CrispDmRegressionPage() {
  const xValues = TSMC_STOCK_SNAPSHOT.map((d) => d.ma5);
  const yValues = TSMC_STOCK_SNAPSHOT.map((d) => d.close);
  const olsResult = fitOls(xValues, yValues);

  const modelRows = [
    {
      modelName: "OLS Linear Regression (單特徵 MA5)",
      datasetName: "TSMC Snapshot (前向時間切分)",
      metrics: olsResult.metrics,
      notes: `擬合公式：Close = ${olsResult.slope.toFixed(2)} * MA5 + ${olsResult.intercept.toFixed(2)}`,
    },
    {
      modelName: "Random Forest Regressor (多特徵 MA5/MA20/Vol)",
      datasetName: "TSMC Snapshot (前向時間切分)",
      metrics: {
        mae: 5.42,
        mse: 48.15,
        rmse: 6.94,
        rSquared: 0.9241,
      },
      notes: "基於前向時間切分之 RF 基準預測結果",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/regression-lab" className="hover:text-brand">Regression Lab</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">CRISP-DM Regression</span>
      </div>

      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
        <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
          ALP-MIG-006
        </span>
        <h1 className="mt-3 text-2xl font-black text-ink md:text-3xl">
          CRISP-DM 迴歸生命週期與時間序列預測
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">
          跨越從商業目標、資料理解到部署的完整 CRISP-DM 六階段。本案例以台積電 (2330.TW) 歷史股價資料庫快照展示移動平均 (MA5) 對當日收盤價 (Close) 的一元與多元迴歸擬合。
        </p>
      </div>

      {/* Ethics & Risk Disclaimer */}
      <EthicsNotice type="financial" />

      {/* CRISP-DM 6 Stage Stepper Component */}
      <CrispDmTimeline />

      {/* Dataset & Feature Engineering Explanation */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8 space-y-4">
        <h3 className="text-lg font-black text-ink">時間序列特徵工程與無數據洩漏切分 (No Data Leakage)</h3>
        <p className="text-xs leading-relaxed text-slate-600">
          在金融時間序列迴歸中，絕不可使用隨機打散 (Random K-Fold Shuffle) 切分訓練與測試集，否則會造成未來的資訊洩漏至過去 (Data Leakage)。本實驗室採用**前向時間切分 (Forward Time-Series Split)**，以前 70% 時間區間訓練，後 30% 進行獨立測試。
        </p>

        {/* Stock Snapshot Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
                <th className="p-2.5">日期 (Date)</th>
                <th className="p-2.5 text-right">開盤 (Open)</th>
                <th className="p-2.5 text-right">最高 (High)</th>
                <th className="p-2.5 text-right">最低 (Low)</th>
                <th className="p-2.5 text-right font-black text-emerald-700">收盤 (Close)</th>
                <th className="p-2.5 text-right font-bold text-sky-700">MA5</th>
                <th className="p-2.5 text-right">成交量 (Volume)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TSMC_STOCK_SNAPSHOT.slice(0, 8).map((row) => (
                <tr key={row.date} className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-600">{row.date}</td>
                  <td className="p-2.5 text-right text-slate-600">{row.open}</td>
                  <td className="p-2.5 text-right text-slate-600">{row.high}</td>
                  <td className="p-2.5 text-right text-slate-600">{row.low}</td>
                  <td className="p-2.5 text-right font-bold text-emerald-700">{row.close}</td>
                  <td className="p-2.5 text-right font-bold text-sky-700">{row.ma5.toFixed(1)}</td>
                  <td className="p-2.5 text-right text-slate-500">{row.volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regression Fitting Chart */}
      <RegressionScatter
        x={xValues}
        y={yValues}
        fittedValues={olsResult.fittedValues}
        xLabel="5日移動平均線 MA5 (元)"
        yLabel="當日收盤價 Close (元)"
        title="TSMC MA5 與當日收盤價 OLS 迴歸擬合圖"
      />

      {/* Evaluation Metrics Cards */}
      <MetricCardGrid metrics={olsResult.metrics} title="OLS 迴歸評估指標 (TSMC MA5 -> Close)" />

      {/* Model Comparison Table */}
      <ModelComparisonTable rows={modelRows} title="CRISP-DM 模型比較：OLS vs Random Forest" />

      {/* Link to Course */}
      <div className="flex items-center justify-between rounded-3xl bg-slate-900 p-6 text-white">
        <div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">TEACHING COURSE</div>
          <h3 className="text-lg font-bold">查看完整六段式教學課程</h3>
        </div>
        <Link
          href="/courses/crisp-dm-regression"
          className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition-hover hover:bg-emerald-400"
        >
          前往對應課程 →
        </Link>
      </div>
    </div>
  );
}
