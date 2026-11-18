import { NextRequest, NextResponse } from "next/server";
import { parseCoursePagination } from "@/lib/course-pagination";
import { getAllCourses } from "@/lib/course-repository";
import type { CourseLevel, CourseStatus } from "@/types/course";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pagination = parseCoursePagination(searchParams);
  if (!pagination) {
    return NextResponse.json(
      { message: "page and limit must be positive safe integers with a safe page offset" },
      { status: 400 },
    );
  }
  const { page, limit } = pagination;

  const courses = getAllCourses({
    query: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    level: (searchParams.get("level") as CourseLevel | null) ?? undefined,
    status: (searchParams.get("status") as CourseStatus | null) ?? undefined,
  });

  const start = (page - 1) * limit;
  const items = courses.slice(start, start + limit);

  return NextResponse.json({
    items,
    pagination: {
      page,
      limit,
      total: courses.length,
      totalPages: Math.max(1, Math.ceil(courses.length / limit)),
    },
  });
}
