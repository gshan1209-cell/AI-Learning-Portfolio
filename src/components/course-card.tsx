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
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl">
      {/* 封面圖片與標籤 Overlay */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900/5">
        {course.coverImage ? (
          <img
            src={course.coverImage}
            alt={course.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-center text-white">
            <div>
              <span className="text-3xl font-black opacity-20">
                {course.category}
              </span>
              <p className="mt-1 text-sm font-semibold opacity-70">
                {course.title}
              </p>
            </div>
          </div>
        )}

        {/* 懸浮標籤 */}
        <div className="absolute left-3 right-3 top-3 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand shadow-sm backdrop-blur-md">
            {course.category}
          </span>
          <div className="flex gap-1.5 text-xs font-semibold">
            <span className="rounded-full bg-slate-900/75 px-2.5 py-1 text-slate-100 shadow-sm backdrop-blur-md">
              {levelLabels[course.level]}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md ${
                enabled
                  ? "bg-emerald-500/90 text-white"
                  : "bg-amber-500/90 text-white"
              }`}
            >
              {statusLabels[course.status]}
            </span>
          </div>
        </div>
      </div>

      {/* 卡片主要內容 */}
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-bold text-ink transition-colors duration-200 group-hover:text-brand">
          {course.title}
        </h2>
        <p className="mt-1.5 text-xs font-bold tracking-wide text-brand">
          {course.subtitle}
        </p>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
          {course.summary}
        </p>

        {/* 標籤 */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {course.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-slate-200 bg-slate-50/50 px-2 py-0.5 text-xs font-medium text-slate-500"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 底部導覽列 */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between gap-3 text-sm font-medium">
            <span className="text-xs text-slate-400">
              約 {course.durationMinutes} 分鐘
            </span>
            <Link
              href={`/courses/${course.slug}/summary`}
              className="inline-flex items-center gap-1 rounded-full border border-brand/20 px-3 py-1.5 text-xs font-bold text-brand transition hover:border-brand hover:bg-emerald-50"
              aria-label={`查看${course.title}重點摘要`}
            >
              重點摘要 <span aria-hidden="true">▣</span>
            </Link>
          </div>

          <div className="mt-3 flex justify-end text-sm font-medium">
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center gap-1 font-bold text-brand hover:underline"
            >
              {enabled ? "開始學習" : "查看課程內容"} <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
