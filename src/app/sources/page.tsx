import Link from "next/link";
import { getMigrationCounts, getMigrations } from "@/lib/migration-registry";
import type { MigrationStatus } from "@/types/migration";

const statusLabels: Record<MigrationStatus, string> = {
  planned: "待移植",
  inventory: "盤點中",
  importing: "原始碼匯入中",
  refactoring: "重構中",
  verifying: "驗收中",
  ready_to_retire: "可退役",
  retired: "已退役",
  blocked: "受阻",
};

const statusStyles: Record<MigrationStatus, string> = {
  planned: "bg-slate-100 text-slate-700",
  inventory: "bg-sky-100 text-sky-800",
  importing: "bg-amber-100 text-amber-800",
  refactoring: "bg-violet-100 text-violet-800",
  verifying: "bg-indigo-100 text-indigo-800",
  ready_to_retire: "bg-emerald-100 text-emerald-800",
  retired: "bg-zinc-800 text-white",
  blocked: "bg-rose-100 text-rose-800",
};

function formatSize(sizeKb?: number) {
  if (sizeKb === undefined) return "尚未同步";
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} MB`;
  return `${sizeKb} KB`;
}

export default function SourcesPage({
  searchParams,
}: {
  searchParams?: { q?: string; status?: MigrationStatus };
}) {
  const query = searchParams?.q || "";
  const status = searchParams?.status;
  const migrations = getMigrations({ query, status });
  const counts = getMigrationCounts();
  const activeCount =
    counts.inventory + counts.importing + counts.refactoring + counts.verifying;

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <header className="rounded-[2rem] bg-ink p-8 text-white md:p-12">
        <p className="text-sm font-black text-emerald-300">SOURCE MIGRATION CENTER</p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">來源 Repo 移植與退役中心</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          新專案將逐一接管來源 Repository 的程式、教材、Demo 與文件。外部 Repo 只在移植期間保留；完成驗收、搬遷公告與連結轉向後，才進入 Archived／唯讀狀態。
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold">
          <span className="rounded-full bg-white/10 px-4 py-2">來源 Repo：{getMigrations().length}</span>
          <span className="rounded-full bg-amber-400/20 px-4 py-2 text-amber-100">進行中：{activeCount}</span>
          <span className="rounded-full bg-white/10 px-4 py-2">待移植：{counts.planned}</span>
          <span className="rounded-full bg-emerald-400/20 px-4 py-2 text-emerald-200">可退役：{counts.ready_to_retire}</span>
          <span className="rounded-full bg-white/10 px-4 py-2">已退役：{counts.retired}</span>
        </div>
      </header>

      <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h2 className="font-black">完成課程 ≠ 完成 Repo 移植</h2>
        <p className="mt-2 leading-7">
          `external`、`iframe`、課程文字或畫面截圖只能作為過渡證據。只有必要原始碼與功能已由本專案接管，並通過最低必要驗收，來源 Repo 才能標記為「可退役」。
        </p>
      </section>

      <form className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-[1fr_240px_auto]">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="搜尋 Repo、技術、Runtime 或課程 slug"
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand"
        />
        <select
          name="status"
          defaultValue={status || ""}
          className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand"
        >
          <option value="">全部移植狀態</option>
          <option value="planned">待移植</option>
          <option value="inventory">盤點中</option>
          <option value="importing">原始碼匯入中</option>
          <option value="refactoring">重構中</option>
          <option value="verifying">驗收中</option>
          <option value="ready_to_retire">可退役</option>
          <option value="retired">已退役</option>
          <option value="blocked">受阻</option>
        </select>
        <button className="rounded-xl bg-brand px-6 py-3 font-bold text-white">篩選</button>
      </form>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {migrations.map((migration) => {
          const repository = migration.repository;
          return (
            <article key={migration.sourceRepository} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-brand">
                    {migration.sourceRuntime} · {migration.sourceBranch} branch
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-ink">{migration.sourceRepository}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyles[migration.status]}`}>
                  {statusLabels[migration.status]}
                </span>
              </div>

              <p className="mt-4 leading-7 text-slate-600">
                {repository?.summary || migration.notes || "尚待建立來源摘要。"}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
                  目標：{migration.targetDemoMode}
                </span>
                {(repository?.techTags || []).map((tag) => (
                  <span key={tag} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">{tag}</span>
                ))}
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-sm">
                <div>
                  <dt className="text-slate-400">Repository 大小</dt>
                  <dd className="mt-1 font-bold text-ink">{formatSize(repository?.sizeKb)}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">舊 Repo 可退役</dt>
                  <dd className="mt-1 font-bold text-ink">{migration.retirementReady ? "是" : "否"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-400">新專案模組</dt>
                  <dd className="mt-1 break-all font-mono text-xs text-ink">{migration.modulePath}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-400">對應課程</dt>
                  <dd className="mt-1 break-all font-mono text-xs text-ink">{migration.courseSlug}</dd>
                </div>
              </dl>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-bold">
                <div className={`rounded-xl p-3 ${migration.sourceReadmeRedirected ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                  搬遷公告<br />{migration.sourceReadmeRedirected ? "完成" : "未完成"}
                </div>
                <div className={`rounded-xl p-3 ${migration.legacyDeploymentRetired ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                  舊部署<br />{migration.legacyDeploymentRetired ? "已停止" : "仍保留"}
                </div>
                <div className={`rounded-xl p-3 ${repository?.archived ? "bg-zinc-800 text-white" : "bg-slate-100 text-slate-500"}`}>
                  舊 Repo<br />{repository?.archived ? "Archived" : "未封存"}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {repository && (
                  <a href={repository.url} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-ink">
                    查看來源 Repo
                  </a>
                )}
                {repository?.conversionStatus === "published" && (
                  <Link href={`/courses/${migration.courseSlug}`} className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white">
                    開啟新平台課程
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {migrations.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          找不到符合條件的移植項目。
        </div>
      )}
    </main>
  );
}
