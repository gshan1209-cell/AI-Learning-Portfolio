"use client";

import { useState } from "react";
import type { CrispDmStage } from "@/lib/ml-lab/types";

const STAGES: CrispDmStage[] = [
  {
    id: "business_understanding",
    title: "Business Understanding",
    titleZh: "1. 商業理解",
    summary: "明確定義預測目標、評估指標與商業衡量標準。",
    details: [
      "確定目標變數（例如：每日收盤價、新創營運利潤）。",
      "評估錯誤預測造成的商業成本與風控界線。",
      "設定衡量指標（例如：R² > 0.85, MAE < 5%）。",
    ],
    keyOutputs: ["商業目標文書", "數據挖掘目標", "專案可行性評估"],
  },
  {
    id: "data_understanding",
    title: "Data Understanding",
    titleZh: "2. 資料理解",
    summary: "收集原始資料，檢查品質、離群值與統計分佈。",
    details: [
      "載入歷史數據（例如：TSMC 股票價格、50 Startups 資料集）。",
      "檢查遺漏值、異常值與極端爆發值。",
      "繪製散佈圖與特徵相關係數矩陣。",
    ],
    keyOutputs: ["資料探索報告", "數據品質檢查表", "初步相關性矩陣"],
  },
  {
    id: "data_preparation",
    title: "Data Preparation",
    titleZh: "3. 資料準備",
    summary: "清洗數據、特徵工程、類別編碼與時間序列切分。",
    details: [
      "時間序列特徵工程：計算移動平均 (MA5/MA20)、Lag1 與日報酬率。",
      "類別變數編碼：使用 One-Hot Encoding 處理 State (New York/California/Florida)。",
      "前向時間切分 (Time-series Train/Test Split) 避免 Data Leakage。",
    ],
    keyOutputs: ["已前處理特徵集", "Train/Test 訓練測試集", "One-Hot 轉置規則"],
  },
  {
    id: "modeling",
    title: "Modeling",
    titleZh: "4. 建立模型",
    summary: "選擇合適演算法，進行超參數調整與模型訓練。",
    details: [
      "選擇擬合演算法：一元與多元 OLS 線性迴歸、Random Forest Regressor。",
      "設定樹結構超參數 (n_estimators, max_depth, random_state)。",
      "記錄 model parameter 結構與 feature order。",
    ],
    keyOutputs: ["已訓練模型 Artifact", "模型權重與樹節點", "超參數快照"],
  },
  {
    id: "evaluation",
    title: "Evaluation",
    titleZh: "5. 模型評估",
    summary: "評估 Test 集上的 MAE、MSE、RMSE 與 R² 指標。",
    details: [
      "計算訓練集與測試集擬合優度與過擬合 (Overfitting) 程度。",
      "殘差分析：檢查殘差是否隨機常態分佈。",
      "檢查倫理與領域界線：確認特定爭議變數不被盲目採納。",
    ],
    keyOutputs: ["評估指標對照表", "殘差分佈圖", "過擬合診斷報告"],
  },
  {
    id: "deployment",
    title: "Deployment",
    titleZh: "6. 部署與監控",
    summary: "將模型封裝為 API 與互動式 Web UI 供使用者決策或操作。",
    details: [
      "匯出版本化 JSON artifact (含 seed, metrics, timestamp)。",
      "提供 Next.js / TypeScript 即時推論與 REST API Handler。",
      "加上免責聲明與運作條件警告 (Out-of-domain Warning)。",
    ],
    keyOutputs: ["Interactive Web Dashboard", "Predict API Handler", "版本化 JSON Artifact"],
  },
];

export default function CrispDmTimeline() {
  const [activeStage, setActiveStage] = useState<CrispDmStage>(STAGES[0]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-brand">METHODOLOGY</span>
          <h2 className="text-xl font-black text-ink md:text-2xl">CRISP-DM 迴歸生命週期六階段</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          6-Stage Process
        </span>
      </div>

      {/* Stepper Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {STAGES.map((stage, idx) => {
          const isActive = stage.id === activeStage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage)}
              className={`rounded-2xl border p-3 text-left transition-all ${
                isActive
                  ? "border-brand bg-emerald-50/60 font-bold text-brand shadow-sm"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="text-xs text-slate-400">Step 0{idx + 1}</div>
              <div className="mt-1 text-sm font-black">{stage.titleZh}</div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Details */}
      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <h3 className="text-lg font-black text-ink">{activeStage.titleZh} ({activeStage.title})</h3>
          <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            {activeStage.id}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">{activeStage.summary}</p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">關鍵執行事項</h4>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
              {activeStage.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="font-bold text-brand">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">階段產出物 (Outputs)</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {activeStage.keyOutputs.map((out, i) => (
                <span key={i} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
                  {out}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
