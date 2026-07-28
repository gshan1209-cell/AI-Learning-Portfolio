import { evaluateAgriRisks } from "../agri-weather/rules";
import { loadWeatherSnapshot } from "../agri-weather/forecast";
import type { AssertFn } from "./movie-scraper.test";

export function runAgriWeatherUnitTests(assert: AssertFn) {
  const heatRisks = evaluateAgriRisks([
    {
      startTime: "2026-07-28T00:00:00Z",
      endTime: "2026-07-28T12:00:00Z",
      temperatureMin: 28,
      temperatureMax: 36,
      precipitationProbability: 20,
      weatherDescription: "晴朗高溫",
    },
  ], "rice");
  assert(heatRisks.some((risk) => risk.ruleId === "RULE-HEAT-01"), "Heat rule triggers at 36°C");

  const rainRisks = evaluateAgriRisks([
    {
      startTime: "2026-07-28T00:00:00Z",
      endTime: "2026-07-28T12:00:00Z",
      temperatureMin: 24,
      temperatureMax: 30,
      precipitationProbability: 85,
      weatherDescription: "大雨",
    },
  ], "vegetable");
  assert(rainRisks.some((risk) => risk.ruleId === "RULE-RAIN-01"), "Rain rule triggers at 85%");

  const snapshot = loadWeatherSnapshot("臺中市", "西屯區");
  assert(snapshot.city === "臺中市", "Weather snapshot keeps city");
  assert(snapshot.district === "西屯區", "Weather snapshot keeps district");
  assert(snapshot.weeklyForecast.length > 0, "Weather snapshot contains forecast");
  assert(snapshot.provenance.mode === "snapshot", "Weather snapshot declares snapshot mode");
}
