import Link from "next/link";
import CrispDmTimeline from "@/components/ml-lab/crisp-dm-timeline";

export const metadata = {
  title: "Regression Lab | 機器學習迴歸實驗室",
  description: "探索 CRISP-DM 迴歸生命週期、Startup 50 隨機森林利潤預測與 Boston Housing 9種特徵選擇方法。",
};

const LAB_MODULES = [
  {
    slug: "crisp-dm",
    title: "CRISP-DM 迴歸生命週期 (ALP-MIG-006)",
    description: "以台積電歷史股價為案例，實作從商業理解、時間序列切分、特徵工程到模型評估的 CRISP-DM 六階段完整流程。",
    tags: ["CRISP-DM", "TSMC 2330", "OLS Regression", "Time-Series Split"],
    badge: "生命週期",
  },
  {
    slug: "startup-profit",
    title: "Startup Profit 利潤預測 (ALP-MIG-007)",
    description: "使用 50 Startups 資料集與純 TypeScript Random Forest 推論引擎，實作即時新創支出利潤預測表單與模型對照。",
    tags: ["Random Forest", "TypeScript Inference", "50 Startups", "One-Hot Encoding"],
    badge: "樹模型推論",
  },
  {
    slug: "feature-selection",
    title: "Boston Housing 特徵選擇 (ALP-MIG-008)",
    description: "比較 9 種 Filter / Wrapper / Embedded 特徵選擇方法在 k=1..13 上的表现，內建預設倫理模式 (Ethical Mode)。",
    tags: ["9 Selection Methods", "Ethical Mode", "Pearson/F-test", "R²/MSE Score"],
    badge: "特徵篩選",
  },
];

export default function RegressionLabPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-6">
      {/* Header */}
      <header className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl md:p-12">
        <span className="rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-emerald-400">
          MIGRATION WAVE 002
        </span>
        <h1 className="mt-4 text-3xl font-black md:text-5xl">
          Regression Lab 迴歸實驗室
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
          專屬的機器學習迴歸演算法實踐區。整合 CRISP-DM 六階段方法論、真實 TypeScript 樹模型推論引擎，以及包含倫理治理的特徵選擇實驗。
        </p>
      </header>

      {/* CRISP-DM Timeline Overview Component */}
      <CrispDmTimeline />

      {/* Lab Modules Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-ink">實驗室三大特色模組</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {LAB_MODULES.map((mod) => (
            <div
              key={mod.slug}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition-all hover:border-brand hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    {mod.badge}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-black text-ink">{mod.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{mod.description}</p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {mod.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <Link
                  href={`/regression-lab/${mod.slug}`}
                  className="flex items-center justify-center rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand"
                >
                  進入實驗室 Native Demo →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
