import { NextResponse } from "next/server";
import { getCourseBySlug } from "@/lib/course-repository";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course) return NextResponse.json({ message: "Course not found" }, { status: 404 });
  return NextResponse.json(course);
}
