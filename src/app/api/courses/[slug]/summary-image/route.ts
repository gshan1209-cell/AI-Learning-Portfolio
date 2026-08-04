import { getCourseBySlug } from "../../../../../lib/course-repository";
import { renderCourseSummarySvg } from "../../../../../lib/course-summary-image";

export const dynamic = "force-static";

export function GET(
  _: Request,
  { params }: { params: { slug: string } },
): Response {
  const course = getCourseBySlug(params.slug);
  if (!course) {
    return new Response("Course not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(renderCourseSummarySvg(course), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Disposition": `inline; filename="${course.slug}-summary.svg"`,
    },
  });
}
