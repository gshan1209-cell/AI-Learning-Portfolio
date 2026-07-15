import Link from "next/link";
import { getRepositories } from "@/lib/repository-registry";
import type { RepositoryConversionStatus } from "@/types/repository";

const statusLabels: Record<RepositoryConversionStatus, string> = {
  published: "已轉製",
  in_progress: "轉製中",
  planned: "待轉製",
  excluded: "不納入",
};

const statusStyles: Record<RepositoryConversionStatus, string> = {
  published: "bg-emerald-100 text-emerald-800",
  in_progress: "bg-amber-100 text-amber-800",
  planned: "bg-slate-100 text-slate-700",
  excluded: "bg-rose-100 text-rose-800",
};

function formatSize(sizeKb: number) {
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} MB`;
  return `${sizeKb} KB`;
}

export default function SourcesPage({
  searchParams,
}: {
  searchParams?: { q?: string; status?: RepositoryConversionStatus };
}) {
  const query = searchParams?.q || "";
  const status = searchParams?.status;
  const repositories = getRepositories({ query, status });
  const publishedCount = getRepositories({ status: "published" }).length;
  const plannedCount = getRepositories({ status: "planned" }).length;

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <header className="rounded-[2rem] bg-ink p-8 text-white md:p-12">
        <p className="text-sm font-black text-emerald-300">SOURCE REGISTRY</p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">跨 Repository 來源中心</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          原始作業保留在各自的 GitHub Repository；中央平台只管理同步快照、課程對應、轉製狀態與 Demo 入口。
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold">
          <span className="rounded-full bg-white/10 px-4 py-2">來源 Repo：{getRepositories().length}</span>
          <span className="rounded-full bg-emerald-400/20 px-4 py-2 text-emerald-200">已轉製：{publishedCount}</span>
          <span className="rounded-full bg-white/10 px-4 py-2">待轉製：{plannedCount}</span>
        </div>
      </header>

      <form className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-[1fr_220px_auto]">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="搜尋 Repo、技術或課程 slug"
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand"
        />
        <select
          name="status"
          defaultValue={status || ""}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand"
        >
          <option value="">全部狀態</option>
          <option value="published">已轉製</option>
          <option value="in_progress">轉製中</option>
          <option value="planned">待轉製</option>
          <option value="excluded">不納入</option>
        </select>
        <button className="rounded-xl bg-brand px-6 py-3 font-bold text-white">篩選</button>
      </form>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {repositories.map((repository) => (
          <article key={repository.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-brand">{repository.defaultBranch} branch</p>
                <h2 className="mt-2 text-2xl font-black text-ink">{repository.name}</h2>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyles[repository.conversionStatus]}`}>
                {statusLabels[repository.conversionStatus]}
              </span>
            </div>

            <p className="mt-4 leading-7 text-slate-600">{repository.summary}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {repository.techTags.map((tag) => (
                <span key={tag} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">{tag}</span>
              ))}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-sm">
              <div>
                <dt className="text-slate-400">Repository 大小</dt>
                <dd className="mt-1 font-bold text-ink">{formatSize(repository.sizeKb)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">最後同步</dt>
                <dd className="mt-1 font-bold text-ink">{repository.lastSyncedAt}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-400">對應課程</dt>
                <dd className="mt-1 break-all font-mono text-xs text-ink">{repository.courseSlug}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={repository.url} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white">
                查看 GitHub Repo
              </a>
              {repository.conversionStatus === "published" && (
                <Link href={`/courses/${repository.courseSlug}`} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-ink">
                  開啟教學課程
                </Link>
              )}
              {repository.demoUrl && (
                <a href={repository.demoUrl} target="_blank" rel="noreferrer" className="rounded-full border border-emerald-300 px-5 py-3 text-sm font-bold text-brand">
                  原始 Demo
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {repositories.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          找不到符合條件的來源 Repository。
        </div>
      )}
    </main>
  );
}
