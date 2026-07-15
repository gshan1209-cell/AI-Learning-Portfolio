import { NextRequest, NextResponse } from "next/server";
import { getAllCourses } from "@/lib/course-repository";
import type { CourseLevel, CourseStatus } from "@/types/course";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "12")));

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
