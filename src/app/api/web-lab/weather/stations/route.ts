import { NextRequest, NextResponse } from "next/server";
import { loadStationsSnapshot } from "@/lib/web-lab/agri-weather/forecast";
import { normalizeError } from "@/lib/web-lab/request-policy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || undefined;

    const result = loadStationsSnapshot(city);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=600",
      },
    });
  } catch (err) {
    return NextResponse.json(
      normalizeError("An error occurred while fetching weather stations.", 500, "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
