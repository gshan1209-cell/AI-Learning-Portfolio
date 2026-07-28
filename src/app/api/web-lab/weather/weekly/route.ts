import { NextRequest, NextResponse } from "next/server";
import { getWeeklyWeather } from "@/lib/web-lab/agri-weather/forecast";
import { isAllowedCityDistrict, isAllowedWeatherMode } from "@/lib/web-lab/agri-weather/validation";
import { normalizeError } from "@/lib/web-lab/request-policy";

function errorResponse(message: string) {
  return NextResponse.json(
    normalizeError(message, 400, "INVALID_PARAMETER"),
    { status: 400, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const city = searchParams.get("city") || "臺中市";
    const district = searchParams.get("district") || "西屯區";
    const mode = searchParams.get("mode") || "snapshot";

    if (!isAllowedWeatherMode(mode)) {
      return errorResponse("Invalid mode parameter. Must be 'snapshot' or 'live'.");
    }
    if (!isAllowedCityDistrict(city, district)) {
      return errorResponse("Unsupported city and district combination.");
    }

    const result = await getWeeklyWeather(city, district, mode);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": mode === "snapshot"
          ? "public, max-age=300, s-maxage=600"
          : "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      normalizeError("An error occurred while fetching weekly forecast.", 500, "INTERNAL_ERROR"),
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
