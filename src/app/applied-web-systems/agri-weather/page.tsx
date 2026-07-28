"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SourceProvenanceCard } from "@/components/web-lab/source-provenance-card";
import { RequestLifecycleViewer, type LifecycleStep } from "@/components/web-lab/request-lifecycle";
import { WeatherMap } from "@/components/web-lab/agri-weather/weather-map";
import type { WeatherAdvisoryResult, WeeklyWeatherResult, WeatherStationsResult } from "@/lib/web-lab/agri-weather/types";

export default function AgriWeatherPage() {
  const [city, setCity] = useState("臺中市");
  const [district, setDistrict] = useState("西屯區");
  const [crop, setCrop] = useState("rice");
  const [mode, setMode] = useState<"snapshot" | "live">("snapshot");

  const [forecast, setForecast] = useState<WeeklyWeatherResult | null>(null);
  const [advisory, setAdvisory] = useState<WeatherAdvisoryResult | null>(null);
  const [stations, setStations] = useState<WeatherStationsResult | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fRes, aRes, sRes] = await Promise.all([
        fetch(`/api/web-lab/weather/weekly?city=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}&mode=${mode}`),
        fetch(`/api/web-lab/weather/advisory?city=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}&crop=${crop}&mode=${mode}`),
        fetch(`/api/web-lab/weather/stations?city=${encodeURIComponent(city)}`),
      ]);

      if (fRes.ok) setForecast(await fRes.json());
      if (aRes.ok) setAdvisory(await aRes.json());
      if (sRes.ok) setStations(await sRes.json());
    } catch (err) {
      console.error("Failed to load weather data:", err);
    } finally {
      setLoading(false);
    }
  }, [city, district, crop, mode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const lifecycleSteps: LifecycleStep[] = [
    {
      step: 1,
      name: "作物與地理行政區選擇",
      description: `選擇 ${city} ${district} 與 作物 (${crop})，前端平行請求三大 Route Handlers。`,
      status: "completed",
    },
    {
      step: 2,
      name: "CWA OpenData 中央 Client & Secret 隔離",
      description: "API Key 僅於伺服器端讀取 (Server-only)，無任何 Key 出現在 Client Bundle 或 URL 參數中。",
      status: "completed",
      codeSnippet: `process.env.CWA_API_KEY // Server-only Secret`,
    },
    {
      step: 3,
      name: "農事氣象風險 JSON 規則引擎診斷",
      description: "讀取版本化 agri-risk-rules.json，依據溫度、降雨機率與風速比對門檻觸發風險提醒與防護建議。",
      status: "completed",
      codeSnippet: `evaluateAgriRisks(weeklyForecast, crop) -> RiskAssessment[]`,
    },
    {
      step: 4,
      name: "Leaflet + OpenStreetMap 地圖動態渲染",
      description: "透過 Dynamic Import 切離 SSR window 物件，將離線測站座標與雨量資訊標記於台灣 OpenStreetMap 圖層。",
      status: "completed",
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
            🌾 ALP-MIG-010 農事天氣儀表板與氣象風險提醒
          </h1>
        </div>
        <Link
          href="/courses/agri-weather-dashboard"
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          查看對應六段式課程 &rarr;
        </Link>
      </div>

      {/* Controller Controls */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">縣市 / 行政區</label>
            <div className="flex gap-1">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium"
              >
                <option value="臺中市">臺中市</option>
                <option value="臺北市">臺北市</option>
                <option value="高雄市">高雄市</option>
              </select>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium"
              >
                <option value="西屯區">西屯區</option>
                <option value="中正區">中正區</option>
                <option value="鳳山區">鳳山區</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">目標農作物情境 (Crop)</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 font-medium"
            >
              <option value="rice">水稻 (Rice)</option>
              <option value="vegetable">葉菜類 (Vegetable)</option>
              <option value="fruit">果樹 (Fruit)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">資料模式 (Mode)</label>
            <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setMode("snapshot")}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                  mode === "snapshot"
                    ? "bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Snapshot (快照)
              </button>
              <button
                type="button"
                onClick={() => setMode("live")}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${
                  mode === "live"
                    ? "bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Live CWA API
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {loading ? "更新中..." : "🔄 重新載入氣象資料"}
        </button>
      </div>

      {/* Provenance Card */}
      {forecast && <SourceProvenanceCard provenance={forecast.provenance} />}

      {/* Risk Advisory Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
          <span>⚠️</span> 農事風險提醒與建議 (基於 agri-risk-rules.json 數據化規則)
        </h3>
        {advisory?.risks && advisory.risks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advisory.risks.map((r) => (
              <div
                key={r.ruleId}
                className={`p-4 rounded-xl border space-y-2 ${
                  r.severity === "high"
                    ? "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200"
                    : "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>{r.name}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/20">
                    [{r.ruleId}]
                  </span>
                </div>
                <p className="text-xs">{r.userMessage}</p>
                <div className="text-xs font-semibold bg-white/60 dark:bg-black/40 p-2 rounded">
                  💡 建議處置：{r.recommendation}
                </div>
                <p className="text-[11px] opacity-75">限制提示：{r.limitations}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs">
            ✅ 目前預報期間內，無高風險農業氣象災害提示。適宜正常栽培管理。
          </div>
        )}
      </div>

      {/* Weather Forecast Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
          📅 一週氣象預報 ({city} {district})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {forecast?.weeklyForecast.map((f, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
            >
              <div className="font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-1">
                {new Date(f.startTime).toLocaleDateString("zh-TW", { month: "numeric", day: "numeric", weekday: "short" })}
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {f.temperatureMin}°C ~ {f.temperatureMax}°C
              </div>
              <div className="text-slate-600 dark:text-slate-400">{f.weatherDescription}</div>
              <div className="flex items-center justify-between text-slate-500 pt-1">
                <span>🌧️ 降雨率: {f.precipitationProbability}%</span>
                <span>{f.comfort}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GIS Leaflet Map */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center justify-between">
          <span>🗺️ 台灣 CWA 氣象測站地圖 (Leaflet + OpenStreetMap Client Component)</span>
          <span className="text-xs text-slate-500 font-normal">共 {stations?.stations.length || 0} 個測站座標</span>
        </h3>
        {stations && <WeatherMap stations={stations.stations} />}
      </div>

      {/* Teaching Lifecycle */}
      <RequestLifecycleViewer steps={lifecycleSteps} />
    </div>
  );
}
