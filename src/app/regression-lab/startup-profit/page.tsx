"use client";

import { useState } from "react";
import Link from "next/link";
import MetricCardGrid from "@/components/ml-lab/metric-card-grid";
import EthicsNotice from "@/components/ml-lab/ethics-notice";
import { predictStartupProfit, getRfArtifactMetadata } from "@/lib/ml-lab/regression/random-forest-infer";
import type { StartupPredictInput, StartupPredictOutput } from "@/lib/ml-lab/types";

export default function StartupProfitPage() {
  const metadata = getRfArtifactMetadata();
  const [input, setInput] = useState<StartupPredictInput>({
    rdSpend: 100000,
    administration: 120000,
    marketingSpend: 250000,
    state: "New York",
  });

  const [output, setOutput] = useState<StartupPredictOutput>(() => predictStartupProfit(input));

  function handleCalculate() {
    setOutput(predictStartupProfit(input));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/regression-lab" className="hover:text-brand">Regression Lab</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">Startup Profit Prediction</span>
      </div>

      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
        <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
          ALP-MIG-007
        </span>
        <h1 className="mt-3 text-2xl font-black text-ink md:text-3xl">
          50 Startups 新創利潤預測 (Random Forest Pipeline)
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">
          使用 50 Startups 資料集，展示研發支出 (R&D Spend)、行政支出 (Administration)、行銷支出 (Marketing Spend) 與所在州別 (State) 對企業淨利潤 (Profit) 的迴歸預測。核心推論由純 TypeScript Random Forest 引擎執行。
        </p>
      </div>

      {/* General Ethics & Domain Notice */}
      <EthicsNotice type="general" />

      {/* Prediction Form & Interactive Lab */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Inputs */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8 space-y-4">
          <h3 className="text-lg font-black text-ink">輸入營運支出參數</h3>
          
          <div>
            <label className="block text-xs font-bold text-slate-700">研發支出 R&D Spend (USD)</label>
            <input
              type="number"
              min="0"
              max="1000000"
              value={input.rdSpend}
              onChange={(e) => setInput({ ...input, rdSpend: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-800 shadow-2xs focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">行政管理支出 Administration (USD)</label>
            <input
              type="number"
              min="0"
              max="1000000"
              value={input.administration}
              onChange={(e) => setInput({ ...input, administration: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-800 shadow-2xs focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">行銷推廣支出 Marketing Spend (USD)</label>
            <input
              type="number"
              min="0"
              max="1000000"
              value={input.marketingSpend}
              onChange={(e) => setInput({ ...input, marketingSpend: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-800 shadow-2xs focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">企業註冊州別 (State)</label>
            <select
              value={input.state}
              onChange={(e) => setInput({ ...input, state: e.target.value as "New York" | "California" | "Florida" })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-800 shadow-2xs focus:border-brand focus:outline-none"
            >
              <option value="New York">New York</option>
              <option value="California">California</option>
              <option value="Florida">Florida</option>
            </select>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-soft transition-colors hover:bg-emerald-700"
          >
            執行 Random Forest 推論計算
          </button>
        </div>

        {/* Prediction Results Display */}
        <div className="flex flex-col justify-between rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-soft md:p-8">
          <div>
            <span className="rounded-md bg-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
              {output.modelVersion}
            </span>
            <div className="mt-4 text-xs font-bold text-emerald-800 uppercase tracking-wider">預估淨利潤 (PREDICTED PROFIT)</div>
            <div className="mt-2 text-4xl font-black text-emerald-950">
              ${output.predictedProfit.toLocaleString()} USD
            </div>
            <p className="mt-4 text-xs leading-relaxed text-emerald-900/80">
              推論依據：由 {metadata.nEstimators} 棵 Decision Tree 進行分枝節點特徵比對與投票平均得出。
            </p>
          </div>

          <div className="mt-6 border-t border-emerald-200/80 pt-4 space-y-1 text-[11px] text-emerald-900/70">
            <div>• 模型結構：{metadata.modelType} ({metadata.nEstimators} 棵樹)</div>
            <div>• 資料集訓練 R²: {(metadata.trainingMetrics || metadata.metrics!).rSquared.toFixed(4)} | MAE: ${(metadata.trainingMetrics || metadata.metrics!).mae.toLocaleString()}</div>
            <div>• 特徵順序：{metadata.featureOrder.join(", ")}</div>
          </div>
        </div>
      </div>

      {/* Model Evaluation Grid */}
      <MetricCardGrid metrics={metadata.trainingMetrics || metadata.metrics!} title="Random Forest 訓練與測試基準評估" />

      {/* Course link */}
      <div className="flex items-center justify-between rounded-3xl bg-slate-900 p-6 text-white">
        <div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">TEACHING COURSE</div>
          <h3 className="text-lg font-bold">查看 50 Startups 新創利潤預測完整課程</h3>
        </div>
        <Link
          href="/courses/startup-profit-prediction"
          className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition-hover hover:bg-emerald-400"
        >
          前往對應課程 →
        </Link>
      </div>
    </div>
  );
}
