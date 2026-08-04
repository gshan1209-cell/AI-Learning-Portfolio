"use client";

import React, { useState } from "react";
import { useWizard } from "./wizard-context";

export default function WizardCompanion() {
  const {
    enabled,
    companionOpen,
    setCompanionOpen,
    activeHint,
    steps,
    currentStepIndex,
    nextStep,
    prevStep,
  } = useWizard();

  const [activeTab, setActiveTab] = useState<"guide" | "hints" | "ai">("guide");
  const [userQuery, setUserQuery] = useState("");
  const [aiHistory, setAiHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "嗨！我是你的學習小精靈 🧙‍♂️ 有任何不懂的地方隨時問我！" },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  if (!enabled) return null;

  const currentStep = steps[currentStepIndex];

  async function handleAskAi(e: React.FormEvent) {
    e.preventDefault();
    const query = userQuery.trim();
    if (!query || aiLoading) return;

    setUserQuery("");
    const newHistory = [...aiHistory, { role: "user" as const, content: query }];
    setAiHistory(newHistory);
    setAiLoading(true);

    try {
      const res = await fetch("/api/ai/ml-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          algorithmSlug: "linear-regression",
          message: query,
          history: newHistory.slice(-4),
        }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setAiHistory([...newHistory, { role: "assistant", content: data.reply }]);
      } else {
        setAiHistory([
          ...newHistory,
          { role: "assistant", content: data.error || "抱歉，助教暫時忙碌中，請稍後再試！" },
        ]);
      }
    } catch {
      setAiHistory([
        ...newHistory,
        { role: "assistant", content: "無法連接到 AI 助教服務，教材與視覺化可正常使用。" },
      ]);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      {/* 智慧提示快閃氣泡 (Unexpanded floating hint) */}
      {!companionOpen && activeHint && (
        <div className="animate-bounce-short max-w-xs rounded-2xl border border-amber-200 bg-amber-50/95 p-3.5 shadow-lg backdrop-blur text-xs font-medium text-amber-900">
          <div className="flex items-center justify-between gap-2 border-b border-amber-200/60 pb-1.5 font-bold text-amber-800">
            <span>💡 精靈提示</span>
            <button
              onClick={() => setCompanionOpen(true)}
              className="text-[10px] text-amber-700 underline hover:text-amber-950"
            >
              詳細
            </button>
          </div>
          <p className="mt-1.5 leading-relaxed">{activeHint}</p>
        </div>
      )}

      {/* 展開後的精靈窗口 (Glassmorphism Drawer) */}
      {companionOpen && (
        <div className="w-80 sm:w-96 rounded-3xl border border-white/40 bg-white/90 shadow-2xl backdrop-blur-xl transition-all duration-300 overflow-hidden flex flex-col max-h-[520px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 ring-1 ring-amber-300/40 text-xl">
                🧙‍♂️
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wide">學習小精靈 Assistant</h3>
                <p className="text-[11px] text-slate-300">引導 · 提示 · AI 答疑</p>
              </div>
            </div>
            <button
              onClick={() => setCompanionOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xs"
              title="縮小小精靈"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/80 p-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab("guide")}
              className={`py-2 rounded-xl transition-all ${
                activeTab === "guide"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "hover:text-slate-900"
              }`}
            >
              🎯 學習導覽
            </button>
            <button
              onClick={() => setActiveTab("hints")}
              className={`py-2 rounded-xl transition-all ${
                activeTab === "hints"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "hover:text-slate-900"
              }`}
            >
              💡 術語提示
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`py-2 rounded-xl transition-all ${
                activeTab === "ai"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "hover:text-slate-900"
              }`}
            >
              🤖 AI 助教
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-4 overflow-y-auto flex-1 text-xs leading-relaxed">
            {activeTab === "guide" && (
              <div className="space-y-4">
                {steps.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mb-2">
                      <span>學習進度 ({currentStepIndex + 1}/{steps.length})</span>
                      <span className="text-indigo-600 font-black">
                        {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-indigo-600 transition-all duration-300"
                        style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                      />
                    </div>

                    {currentStep && (
                      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 space-y-2">
                        <div className="inline-block rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-black text-white">
                          步驟 {currentStep.id}
                        </div>
                        <h4 className="font-black text-slate-900 text-sm">{currentStep.title}</h4>
                        <p className="text-slate-600">{currentStep.description}</p>
                        {currentStep.actionText && (
                          <p className="font-bold text-indigo-700 text-[11px]">
                            👉 建議操作：{currentStep.actionText}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={prevStep}
                        disabled={currentStepIndex === 0}
                        className="rounded-xl border border-slate-300 px-3 py-1.5 font-bold text-slate-600 disabled:opacity-40"
                      >
                        上一步
                      </button>
                      <button
                        onClick={nextStep}
                        disabled={currentStepIndex >= steps.length - 1}
                        className="rounded-xl bg-indigo-600 px-4 py-1.5 font-bold text-white shadow-md disabled:opacity-40"
                      >
                        下一步
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="text-3xl">🧭</div>
                    <p className="font-bold text-slate-700">歡迎使用學習精靈！</p>
                    <p className="text-slate-500">
                      進入「課程目錄」或「實驗室」頁面時，精靈會自動開啟專屬分步引導。
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "hints" && (
              <div className="space-y-3">
                <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-amber-900">
                  <span className="font-black">💡 當前頁面提示：</span>
                  <p className="mt-1">{activeHint || "點擊頁面中的術語或實驗室控制項以獲取詳細說明！"}</p>
                </div>
                <div className="space-y-2 mt-3">
                  <h5 className="font-bold text-slate-700">📚 初學者白話速查：</h5>
                  <details className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <summary className="font-bold text-slate-800 cursor-pointer">迴歸 (Regression)</summary>
                    <p className="mt-1 text-slate-600">用過去的數據點畫出一條趨勢線，用來預測未來的連續數值（例如房價或氣溫）。</p>
                  </details>
                  <details className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <summary className="font-bold text-slate-800 cursor-pointer">殘差 (Residuals)</summary>
                    <p className="mt-1 text-slate-600">模型預測出來的值跟真實答案之間的差距。差距越小代表模型越準！</p>
                  </details>
                  <details className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <summary className="font-bold text-slate-800 cursor-pointer">SVM 核心技巧 (Kernel Trick)</summary>
                    <p className="mt-1 text-slate-600">當平面上分不開資料時，把它投影到更高的維度（空間），這樣就能輕鬆切下一刀拉開數據。</p>
                  </details>
                </div>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="flex flex-col h-64 justify-between">
                <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                  {aiHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                          msg.role === "user"
                            ? "bg-indigo-600 text-white font-medium"
                            : "bg-slate-100 text-slate-800 border border-slate-200"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <p className="text-[11px] font-bold text-indigo-600 animate-pulse">
                      🧙‍♂️ 精靈思考中...
                    </p>
                  )}
                </div>

                <form onSubmit={handleAskAi} className="mt-3 flex gap-2">
                  <input
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="詢問任何觀念..."
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-indigo-500"
                  />
                  <button
                    disabled={aiLoading || !userQuery.trim()}
                    className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
                  >
                    發送
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Sprite Avatar Trigger */}
      <button
        onClick={() => setCompanionOpen(!companionOpen)}
        type="button"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-indigo-600 to-indigo-800 shadow-xl shadow-indigo-500/30 transition-all duration-300 hover:scale-105 active:scale-95 text-2xl"
        title="點擊展開學習小精靈"
      >
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-indigo-600 opacity-40 blur transition-all duration-300 group-hover:opacity-75" />
        <span className="relative z-10 select-none">🧙‍♂️</span>
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 ring-2 ring-white text-[10px] font-black text-slate-950">
          ✨
        </span>
      </button>
    </div>
  );
}
