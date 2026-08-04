import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/lib/course-repository";

export function generateStaticParams() {
  return getAllCourses().map((course) => ({ slug: course.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  return {
    title: course ? `${course.title}｜重點摘要` : "課程重點摘要",
    description: course?.summary,
  };
}

export default function CourseSummaryPage({
  params,
}: {
  params: { slug: string };
}) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();

  const published = course.status === "published";
  const imageUrl = `/api/courses/${encodeURIComponent(
    course.slug,
  )}/summary-image`;

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/courses"
          className="text-sm font-bold text-brand hover:underline"
        >
          ← 回到課程目錄
        </Link>

        {published ? (
          <Link
            href={`/courses/${course.slug}`}
            className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition hover:brightness-95"
          >
            進入完整課程
          </Link>
        ) : (
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
            完整課程製作中
          </span>
        )}
      </div>

      <header className="mt-8 text-center">
        <p className="text-sm font-black tracking-[0.24em] text-brand">
          COURSE SUMMARY
        </p>
        <h1 className="mt-3 text-3xl font-black text-ink md:text-5xl">
          {course.title}｜重點摘要
        </h1>
        <p className="mx-auto mt-4 max-w-3xl leading-8 text-slate-600">
          {course.summary}
        </p>
      </header>

      <figure className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
        <img
          src={imageUrl}
          alt={`${course.title}重點摘要圖`}
          className="h-auto w-full"
        />
        <figcaption className="border-t border-slate-100 px-6 py-4 text-center text-sm text-slate-500">
          摘要內容由課程 Registry 自動整理，完整細節請進入課程頁查看。
        </figcaption>
      </figure>
    </main>
  );
}
