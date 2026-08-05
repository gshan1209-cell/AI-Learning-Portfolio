import Link from "next/link";
import { notFound } from "next/navigation";
import CourseAssetsPanel from "@/components/course-assets-panel";
import DemoAdapter from "@/components/demo-adapter";
import WizardStepBanner from "@/components/wizard/wizard-step-banner";
import { getAllCourses, getCourseBySlug } from "@/lib/course-repository";

export function generateStaticParams() {
  return getAllCourses({ status: "published" }).map((course) => ({ slug: course.slug }));
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course || course.status !== "published") notFound();

  const wizardSteps = [
    {
      id: 1,
      title: "學習目標與簡介",
      description: course.subtitle,
      actionText: "閱讀「學完你會知道」與使用技術",
      targetElementId: "section-objectives",
      previewSnippet: course.summary,
      previewBullets: course.learningObjectives,
    },
    ...(course.demo || course.source.demoUrl
      ? [
          {
            id: 2,
            title: "動手操作 Demo",
            description: "親自體驗本單元的互動展示與程式實作。",
            actionText: "操作「動手操作看看」區塊",
            targetElementId: "section-demo",
            previewSnippet: `使用 Mode: ${course.demo?.mode || "native"} 展示`,
            previewBullets: ["隨機資料生成", "即時參數調整與結果對照"],
          },
        ]
      : []),
    ...course.sections.map((section, idx) => ({
      id: (course.demo || course.source.demoUrl ? 3 : 2) + idx,
      title: section.title,
      description: section.summary,
      actionText: `閱讀 STEP ${idx + 1} 重點細節`,
      targetElementId: `section-step-${section.id}`,
      previewSnippet: section.summary,
      previewBullets: section.bullets || (section.code ? ["包含程式碼實作示範"] : undefined),
    })),
    ...(course.quiz
      ? [
          {
            id:
              (course.demo || course.source.demoUrl ? 3 : 2) +
              course.sections.length,
            title: "課後想一想測驗",
            description: "回答複習測驗並對照解答。",
            actionText: "點擊「課後想一想」解答對照",
            targetElementId: "section-quiz",
            previewSnippet: course.quiz.question,
            previewBullets: course.quiz.options,
          },
        ]
      : []),
  ];

  return (
    <main className="mx-auto max-w-5xl px-5 py-14">
      <Link href="/courses" className="text-sm font-bold text-brand hover:underline">← 回到課程目錄</Link>

      <WizardStepBanner initialSteps={wizardSteps} pageTitle={`${course.title} 學習指引`} />

      <header className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft md:p-12">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-brand">{course.category}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">約 {course.durationMinutes} 分鐘</span>
        </div>
        <h1 className="mt-5 text-4xl font-black text-ink md:text-5xl">{course.title}</h1>
        <p className="mt-3 text-xl font-bold text-brand">{course.subtitle}</p>
        <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">{course.summary}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={course.source.repositoryUrl} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-5 py-3 font-bold text-white">查看來源 Repo</a>
          {course.source.demoUrl && (
            <a href={course.source.demoUrl} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 px-5 py-3 font-bold text-ink">直接開啟原始 Demo</a>
          )}
        </div>
      </header>

      <CourseAssetsPanel courseSlug={course.slug} assets={course.assets} />

      <section id="section-objectives" className="mt-10 grid gap-5 md:grid-cols-2 scroll-mt-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-black text-ink">學完你會知道</h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            {course.learningObjectives.map((item) => <li key={item}>✓ {item}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-black text-ink">使用技術</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {course.tags.map((tag) => <span key={tag} className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">{tag}</span>)}
          </div>
        </div>
      </section>

      {(course.demo || course.source.demoUrl) && (
        <section id="section-demo" className="mt-10 scroll-mt-20">
          <div className="mb-5">
            <p className="text-sm font-black text-brand">INTERACTIVE DEMO</p>
            <h2 className="mt-1 text-3xl font-black text-ink">動手操作看看</h2>
            <p className="mt-2 text-slate-600">展示模式由 Course Registry 統一管理，外部服務無法載入時仍可退回原始作品。</p>
          </div>
          <DemoAdapter courseTitle={course.title} demo={course.demo} source={course.source} />
        </section>
      )}

      <div className="mt-10 space-y-6">
        {course.sections.map((section, index) => (
          <section id={`section-step-${section.id}`} key={section.id} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft md:p-9 scroll-mt-20">
            <p className="text-sm font-black text-brand">STEP {String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 text-2xl font-black text-ink">{section.title}</h2>
            <p className="mt-4 leading-8 text-slate-600">{section.summary}</p>
            {section.bullets && (
              <ul className="mt-5 space-y-3 text-slate-600">
                {section.bullets.map((bullet) => <li key={bullet} className="flex gap-3"><span className="text-brand">●</span><span>{bullet}</span></li>)}
              </ul>
            )}
            {section.code && <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm text-slate-100"><code>{section.code}</code></pre>}
          </section>
        ))}
      </div>

      {course.quiz && (
        <section id="section-quiz" className="mt-10 rounded-3xl bg-ink p-8 text-white scroll-mt-20">
          <p className="text-sm font-bold text-emerald-300">課後想一想</p>
          <h2 className="mt-2 text-2xl font-black">{course.quiz.question}</h2>
          <ol className="mt-6 space-y-3">
            {course.quiz.options.map((option, index) => <li key={option} className="rounded-xl border border-white/15 p-4">{index + 1}. {option}</li>)}
          </ol>
          <details className="mt-6 rounded-xl bg-white/10 p-4">
            <summary className="cursor-pointer font-bold">查看答案與說明</summary>
            <p className="mt-3 leading-7 text-slate-200">答案：{course.quiz.answerIndex + 1}。{course.quiz.explanation}</p>
          </details>
        </section>
      )}
    </main>
  );
}
