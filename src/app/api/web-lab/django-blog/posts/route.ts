import { NextResponse } from "next/server";
import { loadDjangoPostsFixture } from "@/lib/web-lab/django-blog/fixtures";
import { normalizeError } from "@/lib/web-lab/request-policy";

export async function GET() {
  try {
    const data = loadDjangoPostsFixture();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=600",
      },
    });
  } catch (err) {
    return NextResponse.json(
      normalizeError("An error occurred while fetching Django posts.", 500, "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
