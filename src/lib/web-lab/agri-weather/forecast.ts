import fs from "node:fs";
import path from "node:path";
import type { WeeklyWeatherResult, WeatherStationsResult } from "./types";
import { createProvenanceMetadata, computeDataHash } from "../provenance";

const SNAPSHOT_PATH = path.join(
  process.cwd(),
  "modules/agri-weather-dashboard/snapshots/weather-snapshot.json"
);

export function loadWeatherSnapshot(city = "臺中市", district = "西屯區"): WeeklyWeatherResult {
  let raw = {
    snapshotVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    dataHash: "weather-snapshot-hash",
    city,
    district,
    weeklyForecast: [
      {
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
        temperatureMin: 27,
        temperatureMax: 34,
        precipitationProbability: 30,
        weatherDescription: "多雲午後局部短暫雷陣雨",
        comfort: "悶熱",
        wind: "西南風 2-3 級",
      },
      {
        startTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        endTime: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
        temperatureMin: 28,
        temperatureMax: 36,
        precipitationProbability: 20,
        weatherDescription: "晴時多雲高溫炎熱",
        comfort: "酷熱",
        wind: "偏南風 2 級",
      },
    ],
  };

  try {
    if (fs.existsSync(SNAPSHOT_PATH)) {
      const content = fs.readFileSync(SNAPSHOT_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed.weeklyForecast) {
        raw = { ...raw, ...parsed };
      }
    }
  } catch (err) {
    console.error("Failed to load weather snapshot JSON:", err);
  }

  const provenance = createProvenanceMetadata({
    mode: "snapshot",
    source: "cwa-open-data",
    sourceLabel: "CWA 中央氣象署開放資料平台",
    sourceUrl: "https://opendata.cwa.gov.tw/dataset/forecast",
    snapshotVersion: raw.snapshotVersion,
    dataHash: raw.dataHash || computeDataHash(raw.weeklyForecast),
    notice: "預設使用版本化離線氣象快照，確保展示絕不斷線；可切換 Live 模式體驗即時 API 串接。",
  });

  return {
    city: city || raw.city,
    district: district || raw.district,
    weeklyForecast: raw.weeklyForecast,
    provenance,
  };
}

export function loadStationsSnapshot(city?: string): WeatherStationsResult {
  let raw = {
    snapshotVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    dataHash: "stations-snapshot-hash",
    stations: [
      {
        stationId: "467490",
        name: "臺中",
        latitude: 24.1457,
        longitude: 120.6842,
        temperature: 33.5,
        rainfall: 0.0,
        observedAt: new Date().toISOString(),
      },
      {
        stationId: "C0F9A0",
        name: "西屯",
        latitude: 24.1812,
        longitude: 120.6401,
        temperature: 34.1,
        rainfall: 0.5,
        observedAt: new Date().toISOString(),
      },
      {
        stationId: "466920",
        name: "臺北",
        latitude: 25.0375,
        longitude: 121.5149,
        temperature: 32.8,
        rainfall: 0.0,
        observedAt: new Date().toISOString(),
      },
    ],
  };

  try {
    if (fs.existsSync(SNAPSHOT_PATH)) {
      const content = fs.readFileSync(SNAPSHOT_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.stations)) {
        raw.stations = parsed.stations;
      }
    }
  } catch (err) {
    console.error("Failed to load stations snapshot JSON:", err);
  }

  const provenance = createProvenanceMetadata({
    mode: "snapshot",
    source: "cwa-open-data",
    sourceLabel: "CWA 中央氣象署開放資料平台",
    sourceUrl: "https://opendata.cwa.gov.tw/dataset/observation",
    snapshotVersion: raw.snapshotVersion,
    dataHash: raw.dataHash || computeDataHash(raw.stations),
    notice: "氣象測站地理座標與觀測資料快照。",
  });

  return {
    city,
    stations: raw.stations,
    provenance,
  };
}
