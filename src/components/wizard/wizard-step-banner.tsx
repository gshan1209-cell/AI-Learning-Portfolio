"use client";

import React, { useEffect, useState } from "react";
import { useWizard, WizardStep } from "./wizard-context";

interface WizardStepBannerProps {
  initialSteps: WizardStep[];
  pageTitle?: string;
}

export default function WizardStepBanner({ initialSteps, pageTitle }: WizardStepBannerProps) {
  const {
    enabled,
    steps,
    currentStepIndex,
    setSteps,
    nextStep,
    prevStep,
    goToStep,
    setCompanionOpen,
    markCourseCompleted,
    isCourseCompleted,
  } = useWizard();

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [hoveredStepIndex, setHoveredStepIndex] = useState<number | null>(null);
  const [showInlineSnippet, setShowInlineSnippet] = useState(true);
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    if (initialSteps && initialSteps.length > 0) {
      setSteps(initialSteps);
    }
  }, [initialSteps, setSteps]);

  if (!enabled || steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const hoveredStep = hoveredStepIndex !== null ? steps[hoveredStepIndex] : null;
  const isFinished = isCourseCompleted(pageTitle || "單元關卡");

  const handleNextClick = () => {
    if (currentStepIndex >= steps.length - 1) {
      markCourseCompleted(pageTitle || "單元關卡");
      setCelebrated(true);
      return;
    }
    nextStep();
    const nextTarget = steps[currentStepIndex + 1]?.targetElementId;
    if (nextTarget) {
      setTimeout(() => {
        document.getElementById(nextTarget)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="my-6 rounded-3xl border border-indigo-200/80 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />

      <div className="relative z-10">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 text-xl font-black shadow-md">
              🧙‍♂️
            </span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                WIZARD GUIDED MODE · 精靈引導學習
              </span>
              <h3 className="text-lg font-black text-white">
                {pageTitle || "單元關卡式學習任務"}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewModalOpen(true)}
              className="rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-black text-amber-300 ring-1 ring-amber-400/40 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center gap-1.5"
            >
              🔍 預覽總內容 ({steps.length} 個步驟)
            </button>
            <button
              onClick={() => setCompanionOpen(true)}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300 hover:bg-white/20 transition-all"
            >
              💬 詢問小精靈
            </button>
          </div>
        </div>

        {/* Steps Progress Pills with Hover Preview Tooltip */}
        <div className="relative mt-4 flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;

            return (
              <div key={step.id} className="relative group shrink-0">
                <button
                  onClick={() => goToStep(idx)}
                  onMouseEnter={() => setHoveredStepIndex(idx)}
                  onMouseLeave={() => setHoveredStepIndex(null)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                    isCurrent
                      ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 scale-105"
                      : isCompleted
                      ? "bg-white/20 text-slate-200 hover:bg-white/30"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-950/20 text-[10px]">
                    {isCompleted ? "✓" : idx + 1}
                  </span>
                  <span>{step.title}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Floating Quick Preview Card on Hover */}
        {hoveredStep && (
          <div className="mt-2 rounded-2xl border border-amber-300/40 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-lg animate-fadeIn text-xs">
            <div className="flex items-center justify-between text-amber-300 font-bold border-b border-white/10 pb-1.5 mb-1.5">
              <span>👁️ 快速預覽：步驟 {hoveredStep.id} — {hoveredStep.title}</span>
              <span className="text-[10px] text-slate-400">點擊標籤可切換至此步驟</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{hoveredStep.description}</p>
            {hoveredStep.actionText && (
              <p className="mt-1 font-semibold text-amber-200">🎯 {hoveredStep.actionText}</p>
            )}
          </div>
        )}

        {/* Current Step Active Card */}
        {currentStep && (
          <div className="mt-4 rounded-2xl bg-white/10 p-5 border border-white/15 backdrop-blur-md space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-amber-400/20 text-amber-300 px-2.5 py-0.5 text-[10px] font-black">
                    MISSION STEP {currentStep.id} / {steps.length}
                  </span>
                  <h4 className="font-bold text-white text-base">{currentStep.title}</h4>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed max-w-3xl">
                  {currentStep.description}
                </p>
                {currentStep.actionText && (
                  <p className="text-xs font-bold text-amber-300">
                    🎯 指引建議：{currentStep.actionText}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {currentStep.targetElementId && (
                  <button
                    onClick={() => {
                      const el = document.getElementById(currentStep.targetElementId!);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-white/25 transition-all flex items-center gap-1"
                    title="滑動跳轉至該操作區域"
                  >
                    📍 跳轉區域
                  </button>
                )}
                <button
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 disabled:opacity-30"
                >
                  ← 上一步
                </button>
                <button
                  onClick={handleNextClick}
                  className={`rounded-xl px-5 py-2 text-xs font-black shadow-md transition-all ${
                    isFinished || celebrated
                      ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300 ring-2 ring-emerald-300/60"
                      : "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400"
                  }`}
                >
                  {isFinished || celebrated
                    ? "🏆 單元已通關"
                    : currentStepIndex >= steps.length - 1
                    ? "🎉 完成本單元"
                    : "下一步 →"}
                </button>
              </div>
            </div>

            {/* Expandable Step Snippet Preview inside active step card */}
            <div className="border-t border-white/10 pt-3">
              <button
                onClick={() => setShowInlineSnippet(!showInlineSnippet)}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
              >
                <span>{showInlineSnippet ? "📖 隱藏內容預覽摘要" : "📖 展開本步驟內容預覽摘要"}</span>
                <span>{showInlineSnippet ? "▲" : "▼"}</span>
              </button>

              {showInlineSnippet && (
                <div className="mt-2 rounded-xl bg-slate-950/60 p-3.5 border border-white/10 text-xs text-slate-200 leading-relaxed space-y-1.5">
                  <div className="font-bold text-amber-300 flex items-center gap-1">
                    <span>✨ 本步驟精華預覽：</span>
                  </div>
                  <p>{currentStep.previewSnippet || currentStep.description}</p>
                  {currentStep.previewBullets && (
                    <ul className="mt-2 space-y-1 text-slate-300 pl-2">
                      {currentStep.previewBullets.map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Full Learning Content Overview Modal (全單元學習內容總覽面板) */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-3xl rounded-3xl border border-white/20 bg-slate-900 text-white p-6 md:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧙‍♂️</span>
                <div>
                  <h3 className="text-xl font-black text-amber-300">
                    全單元學習內容總覽與預覽
                  </h3>
                  <p className="text-xs text-slate-300">
                    {pageTitle || "單元關卡預覽"} · 共 {steps.length} 個主要學習步驟
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((s, idx) => {
                const isActive = idx === currentStepIndex;

                const handleSelect = () => {
                  goToStep(idx);
                  setPreviewModalOpen(false);
                  if (s.targetElementId) {
                    setTimeout(() => {
                      document.getElementById(s.targetElementId!)?.scrollIntoView({ behavior: "smooth" });
                    }, 150);
                  }
                };

                return (
                  <div
                    key={s.id}
                    onClick={handleSelect}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelect();
                      }
                    }}
                    className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-200 outline-none ${
                      isActive
                        ? "border-amber-400 bg-indigo-950/80 ring-2 ring-amber-400/60 shadow-xl"
                        : "border-white/15 bg-white/5 hover:border-amber-400/80 hover:bg-white/10 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-black transition-colors ${
                            isActive
                              ? "bg-amber-400 text-slate-950"
                              : "bg-white/15 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950"
                          }`}
                        >
                          STEP {s.id}
                        </span>
                        <h4 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                          {s.title}
                        </h4>
                        {isActive && (
                          <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-400/30">
                            當前進行中
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect();
                        }}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition-all shrink-0 ${
                          isActive
                            ? "bg-amber-400 text-slate-950 shadow-md"
                            : "bg-amber-400/20 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950"
                        }`}
                      >
                        {isActive ? "📍 目前所在位置" : "👉 點擊切換至此步驟"}
                      </button>
                    </div>

                    <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">{s.description}</p>

                    {s.previewSnippet && (
                      <div className="mt-3 rounded-xl bg-black/50 p-3.5 border border-white/10 text-xs text-slate-200 group-hover:border-amber-400/30 transition-colors">
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <span>✨ 關卡內容重點預覽：</span>
                        </span>
                        <p className="mt-1 leading-relaxed">{s.previewSnippet}</p>
                        {s.previewBullets && (
                          <ul className="mt-2 space-y-1 text-slate-300 pl-2">
                            {s.previewBullets.map((b, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-amber-400 font-bold">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white text-xs hover:bg-indigo-500 shadow-lg"
              >
                關閉預覽
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
