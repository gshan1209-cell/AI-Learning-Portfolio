import CourseCard from "@/components/course-card";
import LearnerProgressHub from "@/components/learner-progress-hub";
import { getAllCourses, getCourseCategories } from "@/lib/course-repository";

export const metadata = { title: "課程目錄" };

export default function CoursesPage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const courses = getAllCourses({ query: searchParams.q, category: searchParams.category });
  const categories = getCourseCategories();

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-sm font-bold text-brand">Course Registry</p>
      <h1 className="mt-2 text-4xl font-black text-ink">課程作業總目錄</h1>
      <p className="mt-4 max-w-3xl leading-8 text-slate-600">
        「可學習」代表已完成六段式轉製；「待轉製」仍保留來源 Repository，後續將依序補上教學內容與 Demo Adapter。
      </p>

      <LearnerProgressHub totalCoursesCount={courses.length} />

      <form className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1fr_240px_auto]">
        <input name="q" defaultValue={searchParams.q} placeholder="搜尋課程、技術或 Repository" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand" />
        <select name="category" defaultValue={searchParams.category ?? ""} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand">
          <option value="">全部分類</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <button className="rounded-xl bg-brand px-6 py-3 font-bold text-white">篩選</button>
      </form>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>

      {courses.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">找不到符合條件的課程。</div>
      )}
    </main>
  );
}
