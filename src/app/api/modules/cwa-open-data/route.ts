import { NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dataset = (searchParams.get("dataset") || "F-A0010-001").toUpperCase();
  const format = (searchParams.get("format") || "JSON").toUpperCase();
  const mode = searchParams.get("mode") || "sample";

  if (!DATASET_PATTERN.test(dataset)) {
    return NextResponse.json({ error: "Invalid dataset identifier." }, { status: 400 });
  }

  if (!FORMATS.has(format)) {
    return NextResponse.json({ error: "Format must be JSON or XML." }, { status: 400 });
  }

  if (mode !== "live") {
    return NextResponse.json(samplePayload(dataset), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const apiKey = process.env.CWA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "CWA_API_KEY is not configured on the server.", fallbackMode: "sample" },
      { status: 503 },
    );
  }

  const endpoint = new URL(`https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/${dataset}`);
  endpoint.searchParams.set("Authorization", apiKey);
  endpoint.searchParams.set("format", format);

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "CWA authorization failed." }, { status: 502 });
    }

    if (response.status === 404) {
      return NextResponse.json({ error: `Dataset ${dataset} was not found.` }, { status: 404 });
    }

    if (!response.ok) {
      return NextResponse.json({ error: `CWA request failed with status ${response.status}.` }, { status: 502 });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${dataset}_${timestamp}.${format.toLowerCase()}`;

    if (format === "XML") {
      const xml = await response.text();
      return new NextResponse(xml, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const json = await response.json();
    return NextResponse.json(json, {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown request error";
    return NextResponse.json({ error: "Unable to reach CWA Open Data.", detail: message }, { status: 502 });
  }
}
