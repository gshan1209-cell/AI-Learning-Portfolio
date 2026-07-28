import { NextRequest, NextResponse } from "next/server";
import { loadWeatherSnapshot } from "@/lib/web-lab/agri-weather/forecast";
import { evaluateAgriRisks } from "@/lib/web-lab/agri-weather/rules";
import type { WeatherAdvisoryResult } from "@/lib/web-lab/agri-weather/types";
import { normalizeError } from "@/lib/web-lab/request-policy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "臺中市";
    const district = searchParams.get("district") || "西屯區";
    const crop = searchParams.get("crop") || "rice";

    const forecastData = loadWeatherSnapshot(city, district);
    const risks = evaluateAgriRisks(forecastData.weeklyForecast, crop);

    const result: WeatherAdvisoryResult = {
      city,
      district,
      crop,
      risks,
      provenance: {
        ...forecastData.provenance,
        notice: "農事氣象風險建議評估自數據化規則集，僅供教學與防護參考，不具法律與防災強制效益。",
      },
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=600",
      },
    });
  } catch (err) {
    return NextResponse.json(
      normalizeError("An error occurred while evaluating agri advisory.", 500, "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
