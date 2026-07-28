import { NextResponse } from "next/server";
import { loadDjangoFullSchema } from "@/lib/web-lab/django-blog/schema";
import { normalizeError } from "@/lib/web-lab/request-policy";

export async function GET() {
  try {
    const data = loadDjangoFullSchema();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=600",
      },
    });
  } catch (err) {
    return NextResponse.json(
      normalizeError("An error occurred while fetching Django schema.", 500, "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
