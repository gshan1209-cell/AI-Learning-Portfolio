"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type RuntimeStatus = {
  configured: boolean;
  hasToken: boolean;
  hasDedicatedEndpoint: boolean;
  model: string;
  provider: string;
  timeoutMs: number;
  mode: "live" | "unconfigured";
};

type RuntimeError = {
  error?: string;
  message?: string;
};

export default function CosmosRuntimeLab() {
  const [status, setStatus] = useState<RuntimeStatus | null>(null);
  const [statusError, setStatusError] = useState("");
  const [prompt, setPrompt] = useState("A friendly agricultural drone flying above a Taiwanese rice field at sunrise, cinematic wide shot, physically plausible light");
  const [negativePrompt, setNegativePrompt] = useState("blurry, watermark, duplicated objects, unreadable text");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [seed, setSeed] = useState(42);
  const [steps, setSteps] = useState(28);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [submitting, setSubmitting] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [resultMeta, setResultMeta] = useState<{ model: string; provider: string; generatedAt: string } | null>(null);
  const [error, setError] = useState("");
  const previousUrl = useRef("");

  useEffect(() => {
    let active = true;
    fetch("/api/cosmos/status", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<RuntimeStatus>;
      })
      .then((payload) => {
        if (active) setStatus(payload);
      })
      .catch((reason: unknown) => {
        if (active) setStatusError(reason instanceof Error ? reason.message : "無法讀取 Runtime 狀態");
      });
    return () => {
      active = false;
      if (previousUrl.current) URL.revokeObjectURL(previousUrl.current);
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setResultMeta(null);

    try {
      const response = await fetch("/api/cosmos/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, negativePrompt, aspectRatio, seed, steps, guidanceScale }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({} as RuntimeError)) as RuntimeError;
        throw new Error(payload.message || `Cosmos Runtime 回傳 HTTP ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) throw new Error("Runtime 未回傳圖片格式。");
      const blob = await response.blob();
      if (previousUrl.current) URL.revokeObjectURL(previousUrl.current);
      const url = URL.createObjectURL(blob);
      previousUrl.current = url;
      setResultUrl(url);
      setResultMeta({
        model: response.headers.get("x-cosmos-model") || "未回報",
        provider: response.headers.get("x-cosmos-provider") || "未回報",
        generatedAt: response.headers.get("x-cosmos-generated-at") || new Date().toISOString(),
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Cosmos Runtime 發生未知錯誤。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft md:p-12">
        <p className="text-sm font-black text-brand">REAL GPU PROVIDER RUNTIME</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Cosmos 文字生成圖片實驗室</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          瀏覽器只把提示詞送到 AI-Learning-Portfolio 的 Server Route；HF Token 不會進入前端。圖片只有在外部 GPU Provider 真實回傳後才會顯示，沒有 Mock Mode、Unsplash 備援或隱藏模型切換。
        </p>
      </header>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-brand">RUNTIME STATUS</p>
            <h2 className="mt-1 text-2xl font-black text-ink">Provider 與模型揭露</h2>
          </div>
          <span className={`rounded-full px-4 py-2 text-sm font-black ${status?.configured ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
            {status ? (status.configured ? "LIVE 已設定" : "UNCONFIGURED") : "讀取中"}
          </span>
        </div>
        {statusError && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-rose-700">狀態讀取失敗：{statusError}</p>}
        {status && (
          <dl className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-xs font-black text-slate-500">MODEL</dt><dd className="mt-1 break-words font-bold text-ink">{status.model}</dd></div>
            <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-xs font-black text-slate-500">PROVIDER</dt><dd className="mt-1 break-words font-bold text-ink">{status.provider}</dd></div>
            <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-xs font-black text-slate-500">HF TOKEN</dt><dd className="mt-1 font-bold text-ink">{status.hasToken ? "伺服器端已設定" : "未設定"}</dd></div>
            <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-xs font-black text-slate-500">ENDPOINT</dt><dd className="mt-1 font-bold text-ink">{status.hasDedicatedEndpoint ? "專用 GPU" : "HF Router"}</dd></div>
          </dl>
        )}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
          <h2 className="text-2xl font-black text-ink">生成參數</h2>
          <label className="mt-5 block text-sm font-bold text-slate-700">提示詞
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={6} maxLength={2000} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 leading-7" required />
          </label>
          <label className="mt-4 block text-sm font-bold text-slate-700">負面提示詞
            <textarea value={negativePrompt} onChange={(event) => setNegativePrompt(event.target.value)} rows={3} maxLength={1000} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-slate-700">長寬比
              <select value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3">
                <option value="1:1">1:1</option><option value="16:9">16:9</option><option value="9:16">9:16</option><option value="4:3">4:3</option>
              </select>
            </label>
            <label className="text-sm font-bold text-slate-700">Seed
              <input type="number" min={0} max={2147483647} value={seed} onChange={(event) => setSeed(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
            </label>
            <label className="text-sm font-bold text-slate-700">Steps
              <input type="number" min={1} max={50} value={steps} onChange={(event) => setSteps(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
            </label>
            <label className="text-sm font-bold text-slate-700">Guidance Scale
              <input type="number" min={0} max={20} step={0.5} value={guidanceScale} onChange={(event) => setGuidanceScale(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
            </label>
          </div>
          <button type="submit" disabled={!status?.configured || submitting} className="mt-6 w-full rounded-full bg-brand px-6 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">
            {submitting ? "GPU 推論中…" : "送出真實生成請求"}
          </button>
          {!status?.configured && <p className="mt-3 text-sm leading-6 text-amber-700">正式環境需設定 `HF_TOKEN`；使用專用 Endpoint 時再設定 `COSMOS_ENDPOINT_URL`。未設定時按鈕會保持停用。</p>}
          {error && <p className="mt-4 rounded-xl bg-rose-50 p-4 leading-7 text-rose-700">{error}</p>}
        </form>

        <section className="rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white shadow-soft">
          <p className="text-sm font-black text-emerald-300">PROVIDER OUTPUT</p>
          <h2 className="mt-1 text-2xl font-black">真實圖片與執行證據</h2>
          {resultUrl ? (
            <>
              <img src={resultUrl} alt="外部 GPU Provider 根據本次提示詞生成的圖片" className="mt-6 max-h-[620px] w-full rounded-2xl bg-black object-contain" />
              {resultMeta && (
                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-xl bg-white/10 p-4"><dt className="text-slate-400">模型</dt><dd className="mt-1 break-words font-bold">{resultMeta.model}</dd></div>
                  <div className="rounded-xl bg-white/10 p-4"><dt className="text-slate-400">Provider</dt><dd className="mt-1 break-words font-bold">{resultMeta.provider}</dd></div>
                  <div className="rounded-xl bg-white/10 p-4"><dt className="text-slate-400">生成時間</dt><dd className="mt-1 font-bold">{resultMeta.generatedAt}</dd></div>
                </dl>
              )}
            </>
          ) : (
            <div className="mt-6 grid min-h-[420px] place-items-center rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-slate-400">
              <p>尚無 Provider 輸出。這裡不顯示預置圖片；只有真實 HTTP 200 圖片回應才會出現在此處。</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
