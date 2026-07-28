import { evaluateAgriRisks } from "../agri-weather/rules";
import { loadWeatherSnapshot } from "../agri-weather/forecast";

describe("Agri Weather Unit Tests", () => {
  test("evaluateAgriRisks triggers high temperature risk when maxTemp >= 35°C", () => {
    const mockForecast = [
      {
        startTime: "2026-07-28T00:00:00Z",
        endTime: "2026-07-28T12:00:00Z",
        temperatureMin: 28,
        temperatureMax: 36,
        precipitationProbability: 20,
        weatherDescription: "晴朗高溫",
      },
    ];

    const risks = evaluateAgriRisks(mockForecast, "rice");
    expect(risks.some((r) => r.ruleId === "RULE-HEAT-01")).toBe(true);
  });

  test("evaluateAgriRisks triggers rain risk when precipitationProbability >= 70%", () => {
    const mockForecast = [
      {
        startTime: "2026-07-28T00:00:00Z",
        endTime: "2026-07-28T12:00:00Z",
        temperatureMin: 24,
        temperatureMax: 30,
        precipitationProbability: 85,
        weatherDescription: "大雨",
      },
    ];

    const risks = evaluateAgriRisks(mockForecast, "vegetable");
    expect(risks.some((r) => r.ruleId === "RULE-RAIN-01")).toBe(true);
  });

  test("loadWeatherSnapshot returns default weather forecast and provenance", () => {
    const snapshot = loadWeatherSnapshot("臺中市", "西屯區");
    expect(snapshot.city).toBe("臺中市");
    expect(snapshot.district).toBe("西屯區");
    expect(snapshot.weeklyForecast.length).toBeGreaterThan(0);
    expect(snapshot.provenance.mode).toBe("snapshot");
  });
});
