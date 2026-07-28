"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mlAlgorithmCompleted";
const EVENT_NAME = "mlProgressUpdated";

export default function MlLearningProgress({ total }: { total: number }) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    function sync() {
      try {
        const values = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
        setCompleted(new Set(values).size);
      } catch {
        setCompleted(0);
      }
    }

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(EVENT_NAME, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(EVENT_NAME, sync);
    };
  }, []);

  const percent = total === 0 ? 0 : Math.min(100, Math.round((completed / total) * 100));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-label="機器學習課程進度">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Learning Progress</p>
          <p className="mt-1 font-black text-ink">{completed} / {total} 個主題已通過測驗</p>
        </div>
        <span className="text-2xl font-black text-brand">{percent}%</span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-500">測驗答對至少 2／3 題，即標記該主題完成。</p>
    </section>
  );
}
