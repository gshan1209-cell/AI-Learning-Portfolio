import type { ProvenanceMetadata } from "../types";

export interface WeeklyForecastItem {
  startTime: string;
  endTime: string;
  temperatureMin: number;
  temperatureMax: number;
  precipitationProbability: number;
  weatherDescription: string;
  comfort?: string;
  wind?: string;
  humidity?: number;
}

export interface WeatherStationItem {
  stationId: string;
  name: string;
  latitude: number;
  longitude: number;
  temperature: number;
  rainfall: number;
  observedAt: string;
}

export interface RiskAssessment {
  ruleId: string;
  name: string;
  severity: "high" | "medium" | "low";
  userMessage: string;
  recommendation: string;
  limitations: string;
}

export interface WeeklyWeatherResult {
  city: string;
  district: string;
  weeklyForecast: WeeklyForecastItem[];
  provenance: ProvenanceMetadata;
}

export interface WeatherAdvisoryResult {
  city: string;
  district: string;
  crop: string;
  risks: RiskAssessment[];
  provenance: ProvenanceMetadata;
}

export interface WeatherStationsResult {
  city?: string;
  stations: WeatherStationItem[];
  provenance: ProvenanceMetadata;
}
