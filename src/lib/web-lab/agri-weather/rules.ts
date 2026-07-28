import fs from "node:fs";
import path from "node:path";
import type { RiskAssessment, WeeklyForecastItem } from "./types";

const RULES_PATH = path.join(
  process.cwd(),
  "modules/agri-weather-dashboard/rules/agri-risk-rules.json"
);

interface RawRule {
  ruleId: string;
  name: string;
  crops: string[];
  severity: "high" | "medium" | "low";
  threshold: {
    temperatureMaxGte?: number;
    temperatureMinLte?: number;
    precipitationProbabilityGte?: number;
    windSpeedGte?: number;
  };
  userMessage: string;
  recommendation: string;
  limitations: string;
}

export function evaluateAgriRisks(
  forecast: WeeklyForecastItem[],
  crop: string
): RiskAssessment[] {
  let rules: RawRule[] = [
    {
      ruleId: "RULE-HEAT-01",
      name: "極端高溫熱害風險",
      crops: ["all", "rice", "vegetable", "fruit"],
      severity: "high",
      threshold: { temperatureMaxGte: 35 },
      userMessage: "預報出現高溫天氣，可能引發農作物水分蒸散過快與熱傷害。",
      recommendation: "建議清晨或傍晚適度灌溉降溫。",
      limitations: "請依現場作物狀況調整。",
    },
    {
      ruleId: "RULE-RAIN-01",
      name: "高降雨機率與豪雨風險",
      crops: ["all", "vegetable", "fruit"],
      severity: "medium",
      threshold: { precipitationProbabilityGte: 70 },
      userMessage: "降雨機率高達 70% 以上，濕氣過重容易引發病蟲害。",
      recommendation: "請清理田間排水溝渠，防止積水澇害。",
      limitations: "排水設施應維持隨時暢通。",
    },
  ];

  try {
    if (fs.existsSync(RULES_PATH)) {
      const content = fs.readFileSync(RULES_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.rules)) {
        rules = parsed.rules;
      }
    }
  } catch (err) {
    console.error("Failed to load agri risk rules JSON:", err);
  }

  const risks: RiskAssessment[] = [];

  const maxTemp = Math.max(...forecast.map((f) => f.temperatureMax));
  const minTemp = Math.min(...forecast.map((f) => f.temperatureMin));
  const maxRainProb = Math.max(...forecast.map((f) => f.precipitationProbability));

  for (const rule of rules) {
    if (!rule.crops.includes("all") && !rule.crops.includes(crop)) {
      continue;
    }

    let triggered = false;

    if (
      rule.threshold.temperatureMaxGte !== undefined &&
      maxTemp >= rule.threshold.temperatureMaxGte
    ) {
      triggered = true;
    }

    if (
      rule.threshold.temperatureMinLte !== undefined &&
      minTemp <= rule.threshold.temperatureMinLte
    ) {
      triggered = true;
    }

    if (
      rule.threshold.precipitationProbabilityGte !== undefined &&
      maxRainProb >= rule.threshold.precipitationProbabilityGte
    ) {
      triggered = true;
    }

    if (triggered) {
      risks.push({
        ruleId: rule.ruleId,
        name: rule.name,
        severity: rule.severity,
        userMessage: rule.userMessage,
        recommendation: rule.recommendation,
        limitations: rule.limitations,
      });
    }
  }

  return risks;
}
