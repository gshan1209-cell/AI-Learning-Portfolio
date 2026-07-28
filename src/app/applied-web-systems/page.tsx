import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Applied Web Systems Lab | AI Learning Portfolio",
  description: "網頁爬蟲、API 治理、農事氣象地圖與 Django Web 框架系統教學實驗室",
};

export default function AppliedWebSystemsPage() {
  const modules = [
    {
      slug: "movie-scraper",
      title: "ALP-MIG-009｜電影資料擷取與來源治理",
      badge: "Web Scraping / Rate Limit",
      desc: "受控伺服器端 HTML 擷取、Parser 正規化、Allowlist 防禦、離線 Snapshot 備援與負責任擷取倫理規範。",
      href: "/applied-web-systems/movie-scraper",
      icon: "🎬",
      color: "from-blue-600 to-indigo-600",
    },
    {
      slug: "agri-weather",
      title: "ALP-MIG-010｜農事天氣儀表板與氣象風險提醒",
      badge: "OpenData API / GIS Map",
      desc: "整合中央氣象署 CWA OpenData、農事風險 JSON 規則引擎，以及動態 Leaflet 台灣氣象地圖卡片。",
      href: "/applied-web-systems/agri-weather",
      icon: "🌾",
      color: "from-emerald-600 to-teal-600",
    },
    {
      slug: "django-blog",
      title: "ALP-MIG-011｜Django Blog 基礎與請求生命週期",
      badge: "Python Django / MVT Pattern",
      desc: "真實 Django Runtime 測試驗證，搭配基於 Schema Artifacts 的 Next.js MVT/ORM 與 Request Lifecycle 唯讀教學鏡像。",
      href: "/applied-web-systems/django-blog",
      icon: "🐍",
      color: "from-amber-600 to-orange-600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <header className="space-y-4 text-center md:text-left border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
          <span>⚡ Applied Web Systems Lab</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          應用 Web 系統與 API 治理實驗室
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed text-sm md:text-base">
          本波次匯集三個跨技術領域之 Web 系統實務能力：包含受控爬蟲、氣象 API 與風險引擎地圖、以及 Python/Django MVT 全端框架。提供完整 Live/Snapshot 雙模運作機制與真實來源碼保存。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((m) => (
          <div
            key={m.slug}
            className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`p-5 bg-gradient-to-r ${m.color} text-white flex items-center justify-between`}>
              <span className="text-3xl">{m.icon}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/30 backdrop-blur-sm uppercase tracking-wider">
                {m.badge}
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
              <Link
                href={m.href}
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all text-slate-700 dark:text-slate-200"
              >
                前往 Native 實驗室頁面 &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 text-xs md:text-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>🛡️</span> 核心系統與治理合約規範
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">1. Live / Snapshot / Fallback 模式誠實標示</h4>
            <p>所有外部 HTTP/API 模組均預設選用版本化 Snapshot，自動防範斷線；Live 模式皆限定伺服器端執行並附帶白名單與 2MB 大小限制。</p>
          </div>
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">2. 真實 Python/Django Runtime 與 Native 教學鏡像分離</h4>
            <p>Django Blog 模組保留完整 Python `manage.py check/test` 驗證，並在 Next.js 中透過 Python 自動匯出的 Schema Artifact 進行唯讀鏡像教學。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
