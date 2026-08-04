"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useWizard } from "@/components/wizard/wizard-context";

const COMPLETED_KEY = "mlAlgorithmCompleted";
const FAVORITES_KEY = "mlAlgorithmFavorites";
const PROGRESS_EVENT = "mlProgressUpdated";
const FAVORITES_EVENT = "mlFavoritesUpdated";

interface LearnerProgressHubProps {
  totalCoursesCount?: number;
  totalAlgorithmsCount?: number;
}

export default function LearnerProgressHub({
  totalCoursesCount = 5,
  totalAlgorithmsCount = 10,
}: LearnerProgressHubProps) {
  const { completedCourses } = useWizard();
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "favorites">("all");

  function syncData() {
    try {
      const c = JSON.parse(localStorage.getItem(COMPLETED_KEY) || "[]") as string[];
      const f = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]") as string[];
      setCompletedSlugs(Array.from(new Set(c)));
      setFavoriteSlugs(Array.from(new Set(f)));
    } catch {
      setCompletedSlugs([]);
      setFavoriteSlugs([]);
    }
  }

  useEffect(() => {
    syncData();
    window.addEventListener("storage", syncData);
    window.addEventListener(PROGRESS_EVENT, syncData);
    window.addEventListener(FAVORITES_EVENT, syncData);
    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener(PROGRESS_EVENT, syncData);
      window.removeEventListener(FAVORITES_EVENT, syncData);
    };
  }, []);

  function exportBackup() {
    const backup = {
      completedSlugs,
      favoriteSlugs,
      completedWizardModules: completedCourses,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-learning-portfolio-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const quizCompletionPercent = Math.min(
    100,
    Math.round((completedSlugs.length / totalAlgorithmsCount) * 100)
  );

  return (
    <section className="my-8 rounded-3xl border border-indigo-100 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-black text-amber-300 ring-1 ring-amber-400/30">
              LEARNER DASHBOARD · 個人學習中心
            </span>
            <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
              您的 AI 學習紀錄與成就
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              無需登入，系統會自動在瀏覽器保存您的測驗成績、關卡成就與收藏清單。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportBackup}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-white/20 transition-all flex items-center gap-1.5"
            >
              📥 備份進度 JSON
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Card 1: Quiz Completion */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
              <span>🎯 演算法測驗通關</span>
              <span className="text-amber-300 font-black">{quizCompletionPercent}%</span>
            </div>
            <p className="text-2xl font-black text-white">
              {completedSlugs.length} / {totalAlgorithmsCount} <span className="text-xs font-medium text-slate-400">個主題</span>
            </p>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${quizCompletionPercent}%` }}
              />
            </div>
          </div>

          {/* Card 2: Wizard Modules Passed */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
              <span>🧙‍♂️ 精靈關卡成就</span>
              <span className="text-indigo-300 font-black">
                {completedCourses.length} 單元
              </span>
            </div>
            <p className="text-2xl font-black text-white">
              {completedCourses.length} <span className="text-xs font-medium text-slate-400">個單元已通關</span>
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {completedCourses.length > 0 ? completedCourses.join("、") : "尚未完成關卡，前往課程體驗吧！"}
            </p>
          </div>

          {/* Card 3: Favorites Count */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between text-slate-300 text-xs font-bold">
              <span>❤️ 我的最愛收藏</span>
              <span className="text-rose-300 font-black">{favoriteSlugs.length} 主題</span>
            </div>
            <p className="text-2xl font-black text-white">
              {favoriteSlugs.length} <span className="text-xs font-medium text-slate-400">個演算法收藏</span>
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {favoriteSlugs.length > 0 ? favoriteSlugs.join("、") : "在演算法頁面點擊❤️即可加入收藏"}
            </p>
          </div>
        </div>

        {/* Quick Filter Tabs & Interactive Lists */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              快顯導覽與紀錄選單
            </h3>
            <div className="flex rounded-xl bg-white/10 p-1 text-xs font-bold">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filter === "all" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-300 hover:text-white"
                }`}
              >
                全部進度
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filter === "completed" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-300 hover:text-white"
                }`}
              >
                已通關 ({completedSlugs.length})
              </button>
              <button
                onClick={() => setFilter("favorites")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filter === "favorites" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-300 hover:text-white"
                }`}
              >
                已收藏 ({favoriteSlugs.length})
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {filter === "favorites" && favoriteSlugs.length === 0 && (
              <p className="text-slate-400 py-2">尚未加入任何收藏。前往「十大演算法」點擊 ❤️ 保存感興趣的主題。</p>
            )}
            {filter === "completed" && completedSlugs.length === 0 && (
              <p className="text-slate-400 py-2">尚未通過測驗。前往演算法與課程頁挑戰小測驗吧！</p>
            )}
            {(filter === "favorites" ? favoriteSlugs : completedSlugs).map((slug) => (
              <Link
                key={slug}
                href={`/ml-algorithms/${slug}`}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 font-bold text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center gap-1.5"
              >
                <span>📖 {slug}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
