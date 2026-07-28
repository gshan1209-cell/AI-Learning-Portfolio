import MlAlgorithmCard from "@/components/ml-algorithm-card";
import MlLearningProgress from "@/components/ml-learning-progress";
import {
  getAllMlAlgorithms,
  getMlAlgorithmCategories,
  getMlAlgorithmDifficulties,
  getMlAlgorithmStats,
} from "@/lib/ml-algorithms";

export const metadata = {
  title: "機器學習十大演算法",
  description: "以白話、生活比喻與測驗學習十大機器學習核心主題。",
};

export default function MlAlgorithmsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; difficulty?: string };
}) {
  const algorithms = getAllMlAlgorithms({
    query: searchParams.q,
    category: searchParams.category,
    difficulty: searchParams.difficulty,
  });
  const categories = getMlAlgorithmCategories();
  const difficulties = getMlAlgorithmDifficulties();
  const stats = getMlAlgorithmStats();

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white md:p-12">
        <p className="text-sm font-black uppercase tracking-wider text-emerald-300">ML Topic Collection</p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">機器學習十大演算法</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          原本分散在 machinelearningHw05 的教材、測驗與學習流程，現已移入中央平台。每個主題包含白話解釋、生活比喻、運作流程、應用、限制與三題檢核。
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-3xl font-black">{stats.algorithms}</p><p className="mt-1 text-sm text-slate-300">核心主題</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-3xl font-black">{stats.quizzes}</p><p className="mt-1 text-sm text-slate-300">測驗題目</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-3xl font-black">{stats.categories}</p><p className="mt-1 text-sm text-slate-300">學習分類</p></div>
        </div>
      </section>

      <div className="mt-8">
        <MlLearningProgress total={stats.algorithms} />
      </div>

      <form className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1fr_200px_160px_auto]">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="搜尋演算法、用途或生活比喻"
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand"
        />
        <select name="category" defaultValue={searchParams.category ?? ""} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand">
          <option value="">全部分類</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <select name="difficulty" defaultValue={searchParams.difficulty ?? ""} className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand">
          <option value="">全部難度</option>
          {difficulties.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
        </select>
        <button className="rounded-xl bg-brand px-6 py-3 font-bold text-white">篩選</button>
      </form>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {algorithms.map((algorithm) => <MlAlgorithmCard key={algorithm.slug} algorithm={algorithm} />)}
      </div>

      {algorithms.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">找不到符合條件的演算法。</div>
      )}
    </main>
  );
}
