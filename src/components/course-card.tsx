import Link from "next/link";
import type { Course } from "@/types/course";

const levelLabels = {
  beginner: "入門",
  intermediate: "進階",
  advanced: "高階",
};

const statusLabels = {
  published: "可學習",
  draft: "製作中",
  planned: "待轉製",
};

export default function CourseCard({ course }: { course: Course }) {
  const enabled = course.status === "published";

  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-brand">{course.category}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{levelLabels[course.level]}</span>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-accent">{statusLabels[course.status]}</span>
      </div>
      <h2 className="text-xl font-bold text-ink">{course.title}</h2>
      <p className="mt-2 text-sm font-medium text-brand">{course.subtitle}</p>
      <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{course.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {course.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500">{tag}</span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
        <span className="text-slate-500">約 {course.durationMinutes} 分鐘</span>
        {enabled ? (
          <Link href={`/courses/${course.slug}`} className="font-semibold text-brand hover:underline">開始學習 →</Link>
        ) : (
          <span className="font-semibold text-slate-400">即將推出</span>
        )}
      </div>
    </article>
  );
}
