"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SourceProvenanceCard } from "@/components/web-lab/source-provenance-card";
import { RequestLifecycleViewer, type LifecycleStep } from "@/components/web-lab/request-lifecycle";
import type { MovieResult, MovieSource } from "@/lib/web-lab/movie-scraper/types";

export default function MovieScraperPage() {
  const [source, setSource] = useState<MovieSource>("scrape-center");
  const [mode, setMode] = useState<"snapshot" | "live">("snapshot");
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<string>("");
  const [data, setData] = useState<MovieResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        source,
        mode,
        page: page.toString(),
      });
      if (category) params.set("category", category);

      const res = await fetch(`/api/web-lab/movies?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }
      const json: MovieResult = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load movie data");
    } finally {
      setLoading(false);
    }
  }, [source, mode, page, category]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const lifecycleSteps: LifecycleStep[] = [
    {
      step: 1,
      name: "用戶切換條件與安全驗證",
      description: `用戶選擇來源 (${source}) 與 模式 (${mode})，Client 端呼叫 GET /api/web-lab/movies。`,
      status: "completed",
      codeSnippet: `fetch('/api/web-lab/movies?source=${source}&mode=${mode}')`,
    },
    {
      step: 2,
      name: "Server-only 網域 Allowlist 防禦與快取檢查",
      description: "伺服器檢查目標 URL 是否在白名單內 (https://ssr1.scrape.center / https://www.atmovies.com.tw)，並驗證 Cache-Control。",
      status: "completed",
      codeSnippet: `isUrlAllowed(targetUrl) // Allowlist Validation`,
    },
    {
      step: 3,
      name: "HTML 抓取或 Snapshot 備援載入",
      description: mode === "live"
        ? "以 8 秒 Timeout 與 2MB 上限進行受控 HTTP Fetch。若失敗自動降級至 Snapshot。"
        : "直接載入伺服器端版本化 JSON Snapshot，確保 100% 離線可用。",
      status: mode === "live" ? "active" : "completed",
      codeSnippet: mode === "live" ? `fetch(url, { signal: AbortSignal.timeout(8000) })` : `loadMovieSnapshot(source, page)`,
    },
    {
      step: 4,
      name: "DOM / RegExp HTML Parser 與 Schema 正規化",
      description: "解析 HTML 標籤萃取電影名稱、海報、評分與類別，過濾非法或未受信任內容，並補齊 Data Provenance Metadata。",
      status: "completed",
      codeSnippet: `parseScrapeCenterHtml(html) -> MovieItem[]`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Link
            href="/applied-web-systems"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mb-1"
          >
            &larr; 返回 Applied Web Systems 實驗室
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            🎬 ALP-MIG-009 電影資料擷取與來源治理
          </h1>
        </div>
        <Link
          href="/courses/movie-scraper-nextjs"
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          查看對應六段式課程 &rarr;
        </Link>
      </div>

      {/* Controller bar */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">資料來源 (Source)</label>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value as MovieSource);
                setPage(1);
                setCategory("");
              }}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="scrape-center">Scrape Center (ssr1.scrape.center)</option>
              <option value="atmovies">@movies 開眼電影網</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">運作模式 (Mode)</label>
            <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setMode("snapshot")}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                  mode === "snapshot"
                    ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Snapshot (離線)
              </button>
              <button
                type="button"
                onClick={() => setMode("live")}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                  mode === "live"
                    ? "bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Live (即時)
              </button>
            </div>
          </div>

          {data && data.categories.length > 0 && (
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">分類過濾 (Category)</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">全部類別 ({data.total} 筆)</option>
                {data.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={fetchMovies}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? "載入與解析中..." : "🔄 重新整理 / 抓取"}
        </button>
      </div>

      {/* Provenance Card */}
      {data && <SourceProvenanceCard provenance={data.provenance} />}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
          <strong>錯誤：</strong> {error}
        </div>
      )}

      {/* Movie Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            🎬 電影清單 (共 {data?.total || 0} 筆資料, 第 {page} 頁)
          </h3>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {data?.movies.map((m) => (
              <div
                key={m.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between space-y-3 hover:border-indigo-400 transition-all shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1">{m.title}</h4>
                    {m.score && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[11px] font-bold">
                        ★ {m.score}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {m.categories.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                    {m.region && <div>地區：{m.region}</div>}
                    {m.duration && <div>片長：{m.duration}</div>}
                    {m.releaseDate && <div>上映：{m.releaseDate}</div>}
                  </div>
                </div>

                <a
                  href={m.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 border-t border-slate-100 dark:border-slate-800 pt-2"
                >
                  前往來源原始頁面 &rarr;
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.total > 10 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 text-xs font-medium disabled:opacity-40"
            >
              上一頁
            </button>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              第 {page} 頁 / 共 {Math.ceil(data.total / 10)} 頁
            </span>
            <button
              type="button"
              disabled={page >= Math.ceil(data.total / 10)}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 text-xs font-medium disabled:opacity-40"
            >
              下一頁
            </button>
          </div>
        )}
      </div>

      {/* Teaching Architecture Component */}
      <RequestLifecycleViewer steps={lifecycleSteps} />
    </div>
  );
}
