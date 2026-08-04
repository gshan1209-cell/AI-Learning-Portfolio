import Link from "next/link";
import { notFound } from "next/navigation";
import MlAiTutor from "@/components/ml-ai-tutor";
import MlAlgorithmQuiz from "@/components/ml-algorithm-quiz";
import MlAlgorithmVisual from "@/components/ml-algorithm-visual";
import MlFavoriteButton from "@/components/ml-favorite-button";
import WizardStepBanner from "@/components/wizard/wizard-step-banner";
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

  const wizardSteps = [
    {
      id: 1,
      title: "白話觀念與比喻",
      description: `閱讀 ${algorithm.name_zh} 的核心說明與生活比喻，建立基本概念。`,
      actionText: "閱讀「白話解釋」與「生活比喻」區塊",
      targetElementId: "section-concept",
      previewSnippet: algorithm.description,
      previewBullets: [`生活比喻：${algorithm.analogy}`, `核心定位：${algorithm.one_liner}`],
    },
    {
      id: 2,
      title: "運作流程與注意事項",
      description: "理解模型運作的詳細步驟、常見錯誤與限制。",
      actionText: "閱讀「運作流程」與「常見錯誤」",
      targetElementId: "section-howitworks",
      previewSnippet: `包含 ${algorithm.how_it_works.length} 個主要運作步驟`,
      previewBullets: algorithm.how_it_works.slice(0, 3),
    },
    {
      id: 3,
      title: "互動視覺化圖解",
      description: "透過動態圖表或模擬圖，親自體驗演算法如何處理數據。",
      actionText: "操作視覺化展示區塊",
      targetElementId: "section-visual",
      previewSnippet: `使用可互動的 ${algorithm.visual_type} 視覺化模擬圖`,
      previewBullets: ["隨機生成數據點", "觀察模型邊界與數據分佈"],
    },
    {
      id: 4,
      title: "AI 助教對話",
      description: "如果有任何不懂的地方，可以隨時提問 Central AI Gateway。",
      actionText: "在 AI Tutor 輸入或點擊預設問題",
      targetElementId: "section-tutor",
      previewSnippet: "支援 Live Gemini API 與固定教材 Fallback 雙模式回答",
      previewBullets: ["一鍵點擊熱門問題", "即時解析困難概念"],
    },
    {
      id: 5,
      title: "單元小測驗",
      description: "挑戰 3 道觀念題目，驗收學習成果！",
      actionText: "回答小測驗並查看即時解析",
      targetElementId: "section-quiz",
      previewSnippet: `共包含 ${algorithm.quiz.length} 道高頻觀念題`,
      previewBullets: ["即時核對答案", "查看白話詳細解答"],
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/ml-algorithms" className="font-bold text-brand hover:underline">← 回到十大演算法</Link>
        <MlFavoriteButton slug={algorithm.slug} />
      </div>

      <WizardStepBanner initialSteps={wizardSteps} pageTitle={`${algorithm.name_zh} 學習指引`} />

      <header className="mt-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white md:p-12">
        <div className="flex flex-wrap gap-2 text-xs font-black">
          <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-emerald-200">{algorithm.category}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">{algorithm.difficulty}</span>
        </div>
        <p className="mt-7 text-sm font-bold text-emerald-300">{algorithm.name_en}</p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">{algorithm.name_zh}</h1>
        <p className="mt-5 max-w-3xl text-xl leading-9 text-slate-200">{algorithm.one_liner}</p>
      </header>

      <section id="section-concept" className="mt-8 grid gap-6 md:grid-cols-2 scroll-mt-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
          <p className="text-sm font-black text-brand">白話解釋</p>
          <p className="mt-4 leading-8 text-slate-700">{algorithm.description}</p>
        </div>
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7">
          <p className="text-sm font-black text-emerald-700">生活比喻</p>
          <p className="mt-4 text-xl font-bold leading-8 text-emerald-950">{algorithm.analogy}</p>
        </div>
      </section>

      <section id="section-howitworks" className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-soft scroll-mt-20">
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

      <div id="section-visual" className="mt-6 scroll-mt-20">
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

      <div id="section-tutor" className="mt-8 scroll-mt-20">
        <MlAiTutor algorithmSlug={algorithm.slug} algorithmName={algorithm.name_zh} />
      </div>

      <div id="section-quiz" className="mt-8 scroll-mt-20">
        <MlAlgorithmQuiz slug={algorithm.slug} questions={algorithm.quiz} />
      </div>
    </main>
  );
}
