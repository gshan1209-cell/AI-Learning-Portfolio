import Link from "next/link";
import CourseCard from "@/components/course-card";
import { getAllCourses } from "@/lib/course-repository";

export default function HomePage() {
  const courses = getAllCourses();
  const publishedCourses = courses.filter((course) => course.status === "published");
  const featuredCourses = publishedCourses.filter((course) => course.featured).slice(0, 3);

  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-brand">Portfolio × Learning</p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-ink md:text-6xl">
            不只展示作業，還把它教到你看得懂。
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-600">
            每個課程主題都由真實作業重新設計，包含白話原理、生活比喻、操作 Demo、程式架構、測驗與延伸挑戰。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/courses" className="rounded-full bg-brand px-6 py-3 font-bold text-white shadow-soft hover:opacity-90">
              瀏覽全部課程
            </Link>
            <a href="https://github.com/gshan1209-cell" target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-6 py-3 font-bold text-ink hover:border-brand">
              查看原始作品
            </a>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-soft">
          <p className="text-sm font-bold text-brand">目前進度</p>
          <dl className="mt-6 grid grid-cols-2 gap-6">
            <div><dt className="text-sm text-slate-500">已登錄作業</dt><dd className="mt-1 text-4xl font-black text-ink">{courses.length}</dd></div>
            <div><dt className="text-sm text-slate-500">可學習課程</dt><dd className="mt-1 text-4xl font-black text-ink">{publishedCourses.length}</dd></div>
            <div><dt className="text-sm text-slate-500">資料架構</dt><dd className="mt-1 text-lg font-bold text-ink">JSON Chunks</dd></div>
            <div><dt className="text-sm text-slate-500">資料庫</dt><dd className="mt-1 text-lg font-bold text-ink">Prisma Ready</dd></div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold text-brand">第一批示範課</p>
            <h2 className="mt-2 text-3xl font-black text-ink">從能看懂開始</h2>
          </div>
          <Link href="/courses" className="text-sm font-bold text-brand hover:underline">完整目錄 →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <div className="rounded-[2rem] bg-ink p-8 text-white md:p-12">
          <h2 className="text-3xl font-black">每門課都採六段式教學</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {["能做什麼", "白話原理", "互動 Demo", "程式架構", "小測驗", "延伸挑戰"].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <span className="text-sm font-bold text-emerald-300">0{index + 1}</span>
                <p className="mt-2 font-bold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
