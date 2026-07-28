import { NextRequest, NextResponse } from "next/server";
import { CwaClientError, fetchCwaJson, getCwaApiKey } from "@/lib/cwa-open-data/client";

const DATASET_PATTERN = /^[A-Z0-9-]{3,40}$/;
const FORMATS = new Set(["JSON", "XML"]);

function samplePayload(dataset: string) {
  return {
    success: "true",
    mode: "sample",
    dataset,
    records: {
      datasetInfo: {
        datasetName: "一週農業氣象預報（教學模擬資料）",
        updateDate: "2026-07-15T00:00:00+08:00",
      },
      location: [
        {
          locationName: "北部地區",
          weatherElement: [
            { elementName: "Wx", time: [{ elementValue: { value: "多雲午後短暫雷陣雨" } }] },
            { elementName: "MinT", time: [{ elementValue: { value: "25" } }] },
            { elementName: "MaxT", time: [{ elementValue: { value: "33" } }] },
          ],
        },
        {
          locationName: "中部地區",
          weatherElement: [
            { elementName: "Wx", time: [{ elementValue: { value: "晴時多雲" } }] },
            { elementName: "MinT", time: [{ elementValue: { value: "24" } }] },
            { elementName: "MaxT", time: [{ elementValue: { value: "34" } }] },
          ],
        },
      ],
    },
  };
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dataset = (searchParams.get("dataset") || "F-A0010-001").toUpperCase();
  const format = (searchParams.get("format") || "JSON").toUpperCase();
  const mode = searchParams.get("mode") || "sample";

  if (!DATASET_PATTERN.test(dataset)) {
    return errorResponse("Invalid dataset identifier.", 400);
  }

  if (!FORMATS.has(format)) {
    return errorResponse("Format must be JSON or XML.", 400);
  }

  if (mode !== "live") {
    return NextResponse.json(samplePayload(dataset), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const apiKey = getCwaApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "CWA_API_KEY is not configured on the server.", fallbackMode: "sample" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${dataset}_${timestamp}.${format.toLowerCase()}`;

  try {
    if (format === "JSON") {
      const json = await fetchCwaJson(dataset);
      return NextResponse.json(json, {
        headers: {
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const endpoint = new URL(`https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/${dataset}`);
    endpoint.searchParams.set("Authorization", apiKey);
    endpoint.searchParams.set("format", "XML");

    const response = await fetch(endpoint, {
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      return errorResponse(`CWA request failed with status ${response.status}.`, response.status === 404 ? 404 : 502);
    }

    const xml = await response.text();
    if (Buffer.byteLength(xml, "utf8") > 2 * 1024 * 1024) {
      return errorResponse("CWA response exceeded the 2 MB limit.", 502);
    }

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof CwaClientError) {
      return errorResponse(error.message, error.status);
    }
    return errorResponse("Unable to reach CWA OpenData.", 502);
  }
}
