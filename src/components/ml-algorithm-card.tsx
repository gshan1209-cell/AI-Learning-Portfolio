import Link from "next/link";
import MlFavoriteButton from "@/components/ml-favorite-button";
import type { MlAlgorithm } from "@/types/ml-algorithm";

export default function MlAlgorithmCard({ algorithm }: { algorithm: MlAlgorithm }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand/40">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-xs font-black">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{algorithm.category}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{algorithm.difficulty}</span>
        </div>
        <MlFavoriteButton slug={algorithm.slug} />
      </div>

      <p className="mt-6 text-sm font-bold text-brand">{algorithm.name_en}</p>
      <h2 className="mt-1 text-2xl font-black text-ink">{algorithm.name_zh}</h2>
      <p className="mt-4 flex-1 leading-7 text-slate-600">{algorithm.one_liner}</p>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400">生活比喻</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{algorithm.analogy}</p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm font-bold text-slate-400">{algorithm.quiz.length} 題測驗</span>
        <Link href={`/ml-algorithms/${algorithm.slug}`} className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-brand">
          開始學習 →
        </Link>
      </div>
    </article>
  );
}
