"use client";

import type { FeatureRankingItem } from "@/lib/ml-lab/types";

interface FeatureRankingChartProps {
  rankings: FeatureRankingItem[];
  title?: string;
}

export default function FeatureRankingChart({
  rankings,
  title = "特徵重要性與評分排名 (Feature Importance / Score)",
}: FeatureRankingChartProps) {
  if (rankings.length === 0) {
    return <div className="p-4 text-xs text-slate-400">無特徵排名數據。</div>;
  }

  const maxScore = Math.max(...rankings.map((r) => r.score)) || 1;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
      <h3 className="text-lg font-black text-ink">{title}</h3>
      <div className="mt-4 space-y-2.5">
        {rankings.map((item) => {
          const pct = Math.max(5, Math.min(100, (item.score / maxScore) * 100));
          return (
            <div key={item.feature} className="flex items-center text-xs">
              <span className="w-24 shrink-0 font-bold text-slate-700">{item.feature}</span>
              <div className="flex-1 overflow-hidden rounded-full bg-slate-100 h-4 mx-2">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-16 shrink-0 text-right font-mono font-bold text-slate-600">
                {item.score.toFixed(3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
