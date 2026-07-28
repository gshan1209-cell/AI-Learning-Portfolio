import { NextRequest, NextResponse } from "next/server";
import { loadWeatherSnapshot } from "@/lib/web-lab/agri-weather/forecast";
import { normalizeError } from "@/lib/web-lab/request-policy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "臺中市";
    const district = searchParams.get("district") || "西屯區";
    const mode = searchParams.get("mode") || "snapshot";

    if (mode !== "snapshot" && mode !== "live") {
      return NextResponse.json(
        normalizeError("Invalid mode parameter. Must be 'snapshot' or 'live'.", 400, "INVALID_PARAMETER"),
        { status: 400 }
      );
    }

    const result = loadWeatherSnapshot(city, district);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=600",
      },
    });
  } catch (err) {
    return NextResponse.json(
      normalizeError("An error occurred while fetching weekly forecast.", 500, "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
