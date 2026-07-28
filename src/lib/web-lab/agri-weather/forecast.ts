import fs from "node:fs";
import path from "node:path";
import { fetchCwaJson } from "@/lib/cwa-open-data/client";
import type {
  WeeklyForecastItem,
  WeeklyWeatherResult,
  WeatherStationItem,
  WeatherStationsResult,
} from "./types";
import { createProvenanceMetadata, computeDataHash } from "../provenance";

const SNAPSHOT_PATH = path.join(
  process.cwd(),
  "modules/agri-weather-dashboard/snapshots/weather-snapshot.json",
);
const WEEKLY_DATASET = "F-D0047-091";
const STATIONS_DATASET = "O-A0001-001";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asRecords(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function toFiniteNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readElementValue(item: JsonRecord): string | undefined {
  const candidates = item.elementValue ?? item.ElementValue;
  const valueRecord = Array.isArray(candidates)
    ? candidates.find(isRecord)
    : isRecord(candidates)
      ? candidates
      : undefined;

  if (valueRecord) {
    for (const key of [
      "value",
      "measures",
      "WeatherDescription",
      "Weather",
      "MaxTemperature",
      "MinTemperature",
      "Temperature",
      "ProbabilityOfPrecipitation",
      "MinComfortIndexDescription",
      "MaxComfortIndexDescription",
      "RelativeHumidity",
      "WindSpeed",
      "WindDirection",
    ]) {
      const value = valueRecord[key];
      if (value !== undefined && value !== null && String(value).trim()) {
        return String(value);
      }
    }
    const first = Object.values(valueRecord).find((value) => value !== undefined && value !== null);
    if (first !== undefined) return String(first);
  }

  const parameter = isRecord(item.parameter) ? item.parameter.parameterName : undefined;
  return parameter === undefined ? undefined : String(parameter);
}

function normalizeWeeklyForecast(
  raw: JsonRecord,
  city: string,
  district: string,
): WeeklyForecastItem[] {
  const records = isRecord(raw.records) ? raw.records : {};
  const groups = asRecords(records.locations ?? records.Locations);
  let locations: JsonRecord[] = [];

  for (const group of groups) {
    const groupName = String(group.locationsName ?? group.LocationsName ?? "");
    if (!groupName || groupName === city) {
      locations.push(...asRecords(group.location ?? group.Location));
    }
  }

  if (locations.length === 0) {
    locations = asRecords(records.location ?? records.Location);
  }

  const location = locations.find((item) => String(item.locationName ?? item.LocationName ?? "") === district)
    ?? locations[0];
  if (!location) return [];

  const elements = asRecords(location.weatherElement ?? location.WeatherElement);
  const buckets = new Map<string, Partial<WeeklyForecastItem>>();

  for (const element of elements) {
    const elementName = String(element.elementName ?? element.ElementName ?? element.description ?? "");
    const normalizedName = elementName.toLowerCase();
    const times = asRecords(element.time ?? element.Time);

    for (const time of times) {
      const startTime = String(time.startTime ?? time.StartTime ?? time.dataTime ?? time.DataTime ?? "");
      if (!startTime) continue;
      const endTime = String(time.endTime ?? time.EndTime ?? startTime);
      const bucket = buckets.get(startTime) ?? { startTime, endTime };
      const value = readElementValue(time);

      if (elementName === "MinT" || elementName === "最低溫度" || normalizedName.includes("min")) {
        bucket.temperatureMin = toFiniteNumber(value);
      } else if (elementName === "MaxT" || elementName === "最高溫度" || normalizedName.includes("max")) {
        bucket.temperatureMax = toFiniteNumber(value);
      } else if (
        ["PoP", "PoP6h", "PoP12h"].includes(elementName)
        || normalizedName.includes("precipitation")
        || elementName.includes("降雨")
      ) {
        bucket.precipitationProbability = toFiniteNumber(value);
      } else if (elementName === "Wx" || normalizedName.includes("weather") || elementName.includes("天氣")) {
        bucket.weatherDescription = value || "未提供天氣描述";
      } else if (elementName === "CI" || normalizedName.includes("comfort") || elementName.includes("舒適")) {
        bucket.comfort = value;
      } else if (normalizedName.includes("humidity") || elementName.includes("濕度")) {
        bucket.humidity = toFiniteNumber(value);
      } else if (normalizedName.includes("wind") || elementName.includes("風")) {
        bucket.wind = bucket.wind ? `${bucket.wind} ${value || ""}`.trim() : value;
      }

      buckets.set(startTime, bucket);
    }
  }

  return Array.from(buckets.values())
    .map((item) => ({
      startTime: item.startTime || "",
      endTime: item.endTime || item.startTime || "",
      temperatureMin: item.temperatureMin ?? 0,
      temperatureMax: item.temperatureMax ?? 0,
      precipitationProbability: item.precipitationProbability ?? 0,
      weatherDescription: item.weatherDescription || "未提供天氣描述",
      comfort: item.comfort,
      wind: item.wind,
      humidity: item.humidity,
    }))
    .filter((item) => item.startTime)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 14);
}

function normalizeStations(raw: JsonRecord, city?: string): WeatherStationItem[] {
  const records = isRecord(raw.records) ? raw.records : {};
  const stations = asRecords(records.Station ?? records.station);

  return stations.flatMap((entry) => {
    const geo = isRecord(entry.GeoInfo) ? entry.GeoInfo : {};
    if (city && String(geo.CountyName ?? "") !== city) return [];

    const coordinates = asRecords(geo.Coordinates);
    const coordinate = coordinates[0] ?? {};
    const latitude = toFiniteNumber(coordinate.StationLatitude ?? coordinate.CoordinateLatitude, Number.NaN);
    const longitude = toFiniteNumber(coordinate.StationLongitude ?? coordinate.CoordinateLongitude, Number.NaN);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];

    const weather = isRecord(entry.WeatherElement) ? entry.WeatherElement : {};
    const now = isRecord(weather.Now) ? weather.Now : {};
    const obsTime = isRecord(entry.ObsTime) ? entry.ObsTime.DateTime : undefined;

    return [{
      stationId: String(entry.StationId ?? ""),
      name: String(entry.StationName ?? ""),
      latitude,
      longitude,
      temperature: toFiniteNumber(weather.AirTemperature),
      rainfall: toFiniteNumber(now.Precipitation),
      observedAt: String(obsTime ?? new Date().toISOString()),
    }];
  });
}

function withFallback<T extends WeeklyWeatherResult | WeatherStationsResult>(
  result: T,
  reason: string,
): T {
  return {
    ...result,
    provenance: {
      ...result.provenance,
      mode: "fallback",
      fallbackReason: reason,
      notice: `${result.provenance.notice || ""} Live CWA 不可用，已自動切回版本化快照。`.trim(),
    },
  };
}

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
    ],
  };

  try {
    if (fs.existsSync(SNAPSHOT_PATH)) {
      const content = fs.readFileSync(SNAPSHOT_PATH, "utf-8");
      const parsed = JSON.parse(content) as typeof raw;
      if (Array.isArray(parsed.weeklyForecast)) raw = { ...raw, ...parsed };
    }
  } catch {
    // Keep the deterministic embedded fallback when the versioned file is unavailable.
  }

  const provenance = createProvenanceMetadata({
    mode: "snapshot",
    source: "cwa-open-data",
    sourceLabel: "CWA 中央氣象署開放資料平台",
    sourceUrl: "https://opendata.cwa.gov.tw/dataset/forecast",
    snapshotVersion: raw.snapshotVersion,
    dataHash: raw.dataHash || computeDataHash(raw.weeklyForecast),
    notice: "預設使用版本化離線氣象快照；Live 模式只在伺服器設定合法 CWA Key 時啟用。",
  });

  return { city, district, weeklyForecast: raw.weeklyForecast, provenance };
}

export function loadStationsSnapshot(city?: string): WeatherStationsResult {
  let raw = {
    snapshotVersion: "1.0.0",
    dataHash: "stations-snapshot-hash",
    stations: [] as WeatherStationItem[],
  };

  try {
    if (fs.existsSync(SNAPSHOT_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf-8")) as typeof raw;
      if (Array.isArray(parsed.stations)) raw = { ...raw, ...parsed };
    }
  } catch {
    // Keep an empty station list if the versioned file is unavailable.
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

  return { city, stations: raw.stations, provenance };
}

export async function getWeeklyWeather(
  city: string,
  district: string,
  mode: "snapshot" | "live",
): Promise<WeeklyWeatherResult> {
  if (mode === "snapshot") return loadWeatherSnapshot(city, district);

  try {
    const raw = await fetchCwaJson(WEEKLY_DATASET, { locationName: city });
    const weeklyForecast = normalizeWeeklyForecast(raw, city, district);
    if (weeklyForecast.length === 0) throw new Error("CWA weekly forecast contained no usable records.");

    return {
      city,
      district,
      weeklyForecast,
      provenance: createProvenanceMetadata({
        mode: "live",
        source: "cwa-open-data",
        sourceLabel: "CWA 中央氣象署開放資料平台",
        sourceUrl: `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${WEEKLY_DATASET}`,
        dataHash: computeDataHash(weeklyForecast),
        notice: "由中央 server-only CWA Client 即時取得；API Key 不會進入瀏覽器。",
      }),
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "CWA live request failed.";
    return withFallback(loadWeatherSnapshot(city, district), reason);
  }
}

export async function getWeatherStations(
  city: string | undefined,
  mode: "snapshot" | "live",
): Promise<WeatherStationsResult> {
  if (mode === "snapshot") return loadStationsSnapshot(city);

  try {
    const raw = await fetchCwaJson(STATIONS_DATASET);
    const stations = normalizeStations(raw, city);
    return {
      city,
      stations,
      provenance: createProvenanceMetadata({
        mode: "live",
        source: "cwa-open-data",
        sourceLabel: "CWA 中央氣象署開放資料平台",
        sourceUrl: `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${STATIONS_DATASET}`,
        dataHash: computeDataHash(stations),
        notice: stations.length > 0 ? "CWA 即時測站資料。" : "CWA 回應中沒有符合縣市的可用測站。",
      }),
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "CWA station request failed.";
    return withFallback(loadStationsSnapshot(city), reason);
  }
}
