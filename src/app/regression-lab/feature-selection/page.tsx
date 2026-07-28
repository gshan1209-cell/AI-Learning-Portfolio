"use client";

import { useState } from "react";
import Link from "next/link";
import MetricCardGrid from "@/components/ml-lab/metric-card-grid";
import FeatureRankingChart from "@/components/ml-lab/feature-ranking-chart";
import EthicsNotice from "@/components/ml-lab/ethics-notice";
import { getFeatureSelectionResults, getFeatureSelectionMetadata } from "@/lib/ml-lab/feature-selection/live-select";
import type { FeatureSelectionMethodKey } from "@/lib/ml-lab/types";

const METHODS: Array<{ key: FeatureSelectionMethodKey; name: string; category: string }> = [
  { key: "pearson", name: "Pearson 相關", category: "Filter 方法" },
  { key: "spearman", name: "Spearman 相關", category: "Filter 方法" },
  { key: "ftest", name: "F-test 迴歸", category: "Filter 方法" },
  { key: "mutual_info", name: "Mutual Information", category: "Filter 方法" },
  { key: "rfe", name: "RFE 遞迴消除", category: "Wrapper 方法" },
  { key: "sfs", name: "SFS 前向選擇", category: "Wrapper 方法" },
  { key: "sbs", name: "SBS 後向消除", category: "Wrapper 方法" },
  { key: "lasso", name: "Lasso L1 正則化", category: "Embedded 方法" },
  { key: "rf", name: "Random Forest 重要性", category: "Embedded 方法" },
];

export default function FeatureSelectionPage() {
  const metadata = getFeatureSelectionMetadata();
  const [selectedMethod, setSelectedMethod] = useState<FeatureSelectionMethodKey>("pearson");
  const [mode, setMode] = useState<"ethical" | "historical">("ethical");
  const [k, setK] = useState<number>(5);
  const [showOptInWarning, setShowOptInWarning] = useState<boolean>(false);

  const result = getFeatureSelectionResults(selectedMethod, mode, k);
  const maxK = mode === "ethical" ? metadata.ethicalFeaturesCount : metadata.historicalFeaturesCount;

  function handleModeChange(newMode: "ethical" | "historical") {
    if (newMode === "historical") {
      setShowOptInWarning(true);
    } else {
      setMode("ethical");
    }
  }

  function confirmHistoricalOptIn() {
    setMode("historical");
    setShowOptInWarning(false);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/regression-lab" className="hover:text-brand">Regression Lab</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">Boston Feature Selection</span>
      </div>

      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
        <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
          ALP-MIG-008
        </span>
        <h1 className="mt-3 text-2xl font-black text-ink md:text-3xl">
          Boston Housing 九種特徵選擇方法與倫理治理
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">
          比較 Filter (相關係數、F檢定)、Wrapper (RFE/SFS/SBS) 與 Embedded (Lasso, Random Forest) 九種特徵選擇方法在 k=1..{maxK} 上的 R² 與 MSE 變化。
        </p>
      </div>

      {/* Boston Ethics Notice */}
      <EthicsNotice type="boston" />

      {/* Mode Selector & Warning */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div>
          <h3 className="text-sm font-black text-ink">倫理模式選擇 (Dataset Ethics Governance)</h3>
          <p className="mt-1 text-xs text-slate-500">
            {mode === "ethical"
              ? "目前：倫理模式 (Ethical Mode - 預設) — 已排除爭議欄位 B。"
              : "目前：歷史重現模式 (Historical Mode - 主動 Opt-In) — 包含歷史完整 13 欄位。"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleModeChange("ethical")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              mode === "ethical"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            倫理模式 (Ethical Mode - 預設)
          </button>
          <button
            onClick={() => handleModeChange("historical")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              mode === "historical"
                ? "bg-rose-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            歷史重現模式 (Historical Mode)
          </button>
        </div>
      </div>

      {/* Historical Mode Warning Modal */}
      {showOptInWarning && (
        <div className="rounded-3xl border-2 border-rose-400 bg-rose-50 p-6 shadow-xl space-y-3">
          <h4 className="text-base font-black text-rose-950">⚠️ 切換至歷史重現模式警告 (Opt-In Required)</h4>
          <p className="text-xs leading-relaxed text-rose-900">
            歷史重現模式包含 Boston Housing 資料集中具社會人口爭議之欄位 B（黑人人口比例變數）。切換後僅供學術重現與演算法研究，本站不保存此模式為預設狀態，嚴禁將結果用於真實房屋定價或人群評分。
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowOptInWarning(false)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              取消 (保持倫理模式)
            </button>
            <button
              onClick={confirmHistoricalOptIn}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
            >
              我瞭解並同意僅供歷史學術研究
            </button>
          </div>
        </div>
      )}

      {/* Method Selection Tabs */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft space-y-4">
        <h3 className="text-base font-black text-ink">選擇特徵選擇方法 (9 Methods)</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
          {METHODS.map((m) => {
            const isSelected = m.key === selectedMethod;
            return (
              <button
                key={m.key}
                onClick={() => setSelectedMethod(m.key)}
                className={`rounded-2xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-2xs"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="text-[10px] text-slate-400 font-semibold">{m.category}</div>
                <div className="mt-1 text-xs font-black">{m.name}</div>
              </button>
            );
          })}
        </div>

        {/* K-Value Selection */}
        <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">特徵數量 k:</span>
            <input
              type="range"
              min="1"
              max={maxK}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="w-48 accent-emerald-600 cursor-pointer"
            />
            <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-900">
              k = {result.k}
            </span>
          </div>

          {/* Selected Features List */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-500">已選特徵:</span>
            {result.selectedFeatures.map((feat) => (
              <span key={feat} className="rounded-md bg-slate-900 px-2 py-0.5 font-mono text-white text-[11px]">
                {feat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Ranking Chart */}
      <FeatureRankingChart rankings={result.rankings} title={`${result.methodName} - 特徵評分排名`} />

      {/* Metric Card Grid for Selected K */}
      <MetricCardGrid metrics={result.metrics} title={`當前選擇 (k=${result.k}) 之 OLS 迴歸評估指標`} />

      {/* Course link */}
      <div className="flex items-center justify-between rounded-3xl bg-slate-900 p-6 text-white">
        <div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">TEACHING COURSE</div>
          <h3 className="text-lg font-bold">查看 Boston Housing 特徵選擇完整課程</h3>
        </div>
        <Link
          href="/courses/boston-feature-selection"
          className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition-hover hover:bg-emerald-400"
        >
          前往對應課程 →
        </Link>
      </div>
    </div>
  );
}
