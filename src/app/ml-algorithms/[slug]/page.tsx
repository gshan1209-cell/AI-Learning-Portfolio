import Link from "next/link";
import { notFound } from "next/navigation";
import MlAlgorithmQuiz from "@/components/ml-algorithm-quiz";
import MlAlgorithmVisual from "@/components/ml-algorithm-visual";
import MlFavoriteButton from "@/components/ml-favorite-button";
import {
  getAllMlAlgorithms,
  getMlAlgorithm,
  getMlAlgorithmRelatedCourse,
} from "@/lib/ml-algorithms";

export function generateStaticParams() {
  return getAllMlAlgorithms().map((algorithm) => ({ slug: algorithm.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const algorithm = getMlAlgorithm(params.slug);
  if (!algorithm) return { title: "找不到演算法" };
  return {
    title: `${algorithm.name_zh}｜機器學習十大演算法`,
    description: algorithm.one_liner,
  };
}

function ListPanel({ title, items, tone = "slate" }: { title: string; items: string[]; tone?: "slate" | "emerald" | "amber" }) {
  const toneClass = tone === "emerald"
    ? "border-emerald-200 bg-emerald-50"
    : tone === "amber"
      ? "border-amber-200 bg-amber-50"
      : "border-slate-200 bg-white";

  return (
    <section className={`rounded-3xl border p-6 ${toneClass}`}>
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <ul className="mt-4 space-y-3 text-slate-700">
        {items.map((item) => <li key={item} className="flex gap-3"><span className="font-black text-brand">•</span><span className="leading-7">{item}</span></li>)}
      </ul>
    </section>
  );
}

export default function MlAlgorithmDetailPage({ params }: { params: { slug: string } }) {
  const algorithm = getMlAlgorithm(params.slug);
  if (!algorithm) notFound();
  const relatedCourse = getMlAlgorithmRelatedCourse(algorithm.slug);

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/ml-algorithms" className="font-bold text-brand hover:underline">← 回到十大演算法</Link>
        <MlFavoriteButton slug={algorithm.slug} />
      </div>

      <header className="mt-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white md:p-12">
        <div className="flex flex-wrap gap-2 text-xs font-black">
          <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-emerald-200">{algorithm.category}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">{algorithm.difficulty}</span>
        </div>
        <p className="mt-7 text-sm font-bold text-emerald-300">{algorithm.name_en}</p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">{algorithm.name_zh}</h1>
        <p className="mt-5 max-w-3xl text-xl leading-9 text-slate-200">{algorithm.one_liner}</p>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
          <p className="text-sm font-black text-brand">白話解釋</p>
          <p className="mt-4 leading-8 text-slate-700">{algorithm.description}</p>
        </div>
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7">
          <p className="text-sm font-black text-emerald-700">生活比喻</p>
          <p className="mt-4 text-xl font-bold leading-8 text-emerald-950">{algorithm.analogy}</p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
        <p className="text-sm font-black text-brand">HOW IT WORKS</p>
        <h2 className="mt-2 text-2xl font-black text-ink">運作流程</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {algorithm.how_it_works.map((step, index) => (
            <li key={step} className="flex gap-4 rounded-2xl bg-slate-50 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand font-black text-white">{index + 1}</span>
              <span className="leading-7 text-slate-700">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {algorithm.editorial_note && (
        <aside className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <p className="font-black">教材校訂註記</p>
          <p className="mt-2 leading-7">{algorithm.editorial_note}</p>
        </aside>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ListPanel title="常見應用" items={algorithm.use_cases} tone="emerald" />
        <ListPanel title="常見錯誤" items={algorithm.common_mistakes} tone="amber" />
        <ListPanel title="優點" items={algorithm.pros} tone="emerald" />
        <ListPanel title="限制與風險" items={algorithm.cons} tone="amber" />
      </div>

      <div className="mt-6">
        <MlAlgorithmVisual visualType={algorithm.visual_type} />
      </div>

      {relatedCourse && (
        <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="font-black text-emerald-900">延伸實驗室</p>
          <p className="mt-2 leading-7 text-emerald-900">此主題已有更完整的移植模組，可繼續操作參數、資料與進階教學。</p>
          <Link href={`/courses/${relatedCourse}`} className="mt-4 inline-flex rounded-full bg-emerald-700 px-5 py-3 font-bold text-white">
            開啟已移植的互動實驗室 →
          </Link>
        </section>
      )}

      <div className="mt-8">
        <MlAlgorithmQuiz slug={algorithm.slug} questions={algorithm.quiz} />
      </div>
    </main>
  );
}
