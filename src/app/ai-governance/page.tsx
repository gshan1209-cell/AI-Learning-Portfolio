import { getAiGovernanceSnapshot } from "@/lib/ai-governance";

export const dynamic = "force-dynamic";

function StatusBadge({ enabled, on, off }: { enabled: boolean; on: string; off: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${enabled ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
      {enabled ? on : off}
    </span>
  );
}

export default function AiGovernancePage() {
  const snapshot = getAiGovernanceSnapshot();

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <header className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-white md:p-12">
        <p className="text-sm font-black uppercase tracking-wider text-indigo-300">AI GOVERNANCE</p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">Prompt、Token 與成本治理</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          此頁只顯示不含 Secret 與完整 Prompt 內容的治理資訊。Prompt 正式來源、版本、模型、流量限制與近期用量可在同一處勾稽。
        </p>
      </header>

      <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Gemini Secret</p>
          <div className="mt-3"><StatusBadge enabled={snapshot.provider.geminiConfigured} on="已配置" off="未配置 · Fallback" /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Prompt Registry</p>
          <p className="mt-3 text-3xl font-black text-ink">{snapshot.prompts.length}</p>
          <p className="mt-1 text-sm text-slate-500">正式 Prompt</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Rate Limit</p>
          <p className="mt-3 text-3xl font-black text-ink">{snapshot.rateLimit.maxRequests}</p>
          <p className="mt-1 text-sm text-slate-500">每 {snapshot.rateLimit.windowSeconds} 秒／匿名來源</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Usage Ledger</p>
          <p className="mt-3 text-xl font-black text-ink">{snapshot.ledger.mode}</p>
          <p className="mt-1 text-sm text-slate-500">PostgreSQL Schema 已預留</p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black text-brand">PROMPT REGISTRY</p>
            <h2 className="mt-2 text-2xl font-black text-ink">提示語版本</h2>
          </div>
          <p className="text-sm text-slate-500">系統提示語本文不在此公開。</p>
        </div>

        <div className="mt-6 space-y-5">
          {snapshot.prompts.map((prompt) => (
            <article key={prompt.promptId} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-bold text-brand">{prompt.promptId}</p>
                  <h3 className="mt-1 text-xl font-black text-ink">{prompt.name}</h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">Active {prompt.activeVersion}</span>
              </div>

              {prompt.active && (
                <dl className="mt-5 grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div><dt className="text-slate-400">Provider／Model</dt><dd className="mt-1 font-bold text-ink">{prompt.active.provider}／{prompt.active.model}</dd></div>
                  <div><dt className="text-slate-400">Temperature</dt><dd className="mt-1 font-bold text-ink">{prompt.active.temperature}</dd></div>
                  <div><dt className="text-slate-400">Max Output</dt><dd className="mt-1 font-bold text-ink">{prompt.active.maxOutputTokens} tokens</dd></div>
                  <div><dt className="text-slate-400">Input Limit</dt><dd className="mt-1 font-bold text-ink">{prompt.active.limits.messageCharacters} 字</dd></div>
                </dl>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {prompt.versions.map((version) => (
                  <span key={version.version} className={`rounded-lg px-3 py-2 text-xs font-bold ${version.status === "active" ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                    v{version.version} · {version.status}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-black text-brand">COST CONFIGURATION</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Token 費率</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><dt className="text-slate-500">Input／1M Tokens</dt><dd className="font-bold text-ink">{snapshot.rates.inputUsdPerMillionTokens ?? "未設定"}</dd></div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><dt className="text-slate-500">Output／1M Tokens</dt><dd className="font-bold text-ink">{snapshot.rates.outputUsdPerMillionTokens ?? "未設定"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Currency</dt><dd className="font-bold text-ink">{snapshot.rates.currency}</dd></div>
          </dl>
          <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">費率未設定時只記 Token，系統不會猜測或使用過期價格。</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-black text-brand">PERSISTENCE</p>
          <h2 className="mt-2 text-2xl font-black text-ink">使用紀錄儲存</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><dt className="text-slate-500">目前模式</dt><dd className="font-bold text-ink">{snapshot.ledger.mode}</dd></div>
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><dt className="text-slate-500">PostgreSQL Schema</dt><dd className="font-bold text-emerald-700">已預留</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">DB Migration</dt><dd className="font-bold text-amber-800">尚未執行</dd></div>
          </dl>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
        <p className="text-sm font-black text-brand">RECENT USAGE</p>
        <h2 className="mt-2 text-2xl font-black text-ink">近期 Token 記錄</h2>

        {snapshot.ledger.recentEntries.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            尚無本機 JSONL 記錄；未執行 Live／Fallback Runtime 驗收前屬正常狀態。
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500"><tr><th className="px-3 py-3">時間</th><th className="px-3 py-3">Prompt</th><th className="px-3 py-3">Mode</th><th className="px-3 py-3">Model</th><th className="px-3 py-3">Token</th><th className="px-3 py-3">Cost</th></tr></thead>
              <tbody>
                {snapshot.ledger.recentEntries.map((entry) => (
                  <tr key={entry.requestId} className="border-b border-slate-100">
                    <td className="px-3 py-3">{entry.createdAt}</td>
                    <td className="px-3 py-3 font-mono text-xs">{entry.promptId}@{entry.promptVersion}</td>
                    <td className="px-3 py-3">{entry.mode}</td>
                    <td className="px-3 py-3">{entry.model}</td>
                    <td className="px-3 py-3">{entry.usage.totalTokens}</td>
                    <td className="px-3 py-3">{entry.cost.estimatedUsd ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
