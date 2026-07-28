"use client";

import dynamic from "next/dynamic";
import React from "react";
import type { WeatherStationItem } from "@/lib/web-lab/agri-weather/types";

const WeatherMapInner = dynamic(() => import("./weather-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-500 animate-pulse">
      🗺️ 載入 Leaflet + OpenStreetMap 台灣地圖中...
    </div>
  ),
});

interface Props {
  stations: WeatherStationItem[];
}

export function WeatherMap({ stations }: Props) {
  return <WeatherMapInner stations={stations} />;
}
