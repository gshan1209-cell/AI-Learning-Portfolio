import { NextRequest, NextResponse } from "next/server";
import { loadDjangoPostsFixture } from "@/lib/web-lab/django-blog/fixtures";
import { normalizeError } from "@/lib/web-lab/request-policy";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug || slug.length > 200) {
      return NextResponse.json(
        normalizeError("Invalid or oversized slug parameter.", 400, "INVALID_SLUG"),
        { status: 400 }
      );
    }

    const data = loadDjangoPostsFixture(slug);

    if (!data.post) {
      return NextResponse.json(
        normalizeError(`Django Post with slug '${slug}' not found. (HTTP 404)`, 404, "NOT_FOUND"),
        { status: 404 }
      );
    }

    return NextResponse.json({
      post: data.post,
      provenance: data.provenance,
    }, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=600",
      },
    });
  } catch (err) {
    return NextResponse.json(
      normalizeError("An error occurred while fetching Django post detail.", 500, "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
