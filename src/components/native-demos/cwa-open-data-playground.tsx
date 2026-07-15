"use client";

import { useMemo, useState } from "react";

const DATASETS = [
  { value: "F-A0010-001", label: "一週農業氣象預報" },
  { value: "F-C0032-001", label: "今明 36 小時天氣預報" },
];

export default function CwaOpenDataPlayground() {
  const [dataset, setDataset] = useState("F-A0010-001");
  const [format, setFormat] = useState<"JSON" | "XML">("JSON");
  const [mode, setMode] = useState<"sample" | "live">("sample");
  const [result, setResult] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const requestPath = useMemo(
    () => `/api/modules/cwa-open-data?dataset=${encodeURIComponent(dataset)}&format=${format}&mode=${mode}`,
    [dataset, format, mode],
  );

  async function runRequest() {
    setStatus("loading");
    setResult("");

    try {
      const response = await fetch(requestPath, { cache: "no-store" });
      const contentType = response.headers.get("content-type") || "";
      const body = contentType.includes("json")
        ? JSON.stringify(await response.json(), null, 2)
        : await response.text();

      setResult(body);
      setStatus(response.ok ? "success" : "error");
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Request failed");
      setStatus("error");
    }
  }

  return (
    <div className="rounded-3xl border border-sky-200 bg-sky-50/70 p-5 md:p-7">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <section className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-sky-700">CWA API LAB</p>
            <h3 className="mt-2 text-xl font-black text-ink">開放資料請求設定</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              API Key 只保存在伺服器環境變數，瀏覽器不會取得金鑰。
            </p>
          </div>

          <label className="block text-sm font-bold text-ink">
            資料集
            <select
              value={dataset}
              onChange={(event) => setDataset(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3"
            >
              {DATASETS.map((item) => (
                <option key={item.value} value={item.value}>{item.value}｜{item.label}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-bold text-ink">
            回傳格式
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value as "JSON" | "XML")}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3"
            >
              <option value="JSON">JSON</option>
              <option value="XML">XML</option>
            </select>
          </label>

          <fieldset>
            <legend className="text-sm font-bold text-ink">執行模式</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["sample", "live"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={`rounded-xl px-3 py-3 text-sm font-bold ${mode === item ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {item === "sample" ? "教學模擬" : "即時 API"}
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={runRequest}
            disabled={status === "loading"}
            className="w-full rounded-xl bg-ink px-4 py-3 font-bold text-white disabled:opacity-50"
          >
            {status === "loading" ? "取得資料中…" : "送出請求"}
          </button>
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-black text-sky-700">REQUEST</p>
          <code className="mt-2 block break-all rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
            GET {requestPath}
          </code>

          <div className="mt-5 flex items-center justify-between gap-3">
            <h4 className="font-black text-ink">回應預覽</h4>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${status === "success" ? "bg-emerald-100 text-emerald-700" : status === "error" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-500"}`}>
              {status === "idle" ? "尚未執行" : status === "loading" ? "讀取中" : status === "success" ? "成功" : "失敗"}
            </span>
          </div>

          <pre className="mt-3 max-h-[440px] min-h-[260px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
            {result || "先使用「教學模擬」觀察 CWA JSON 結構；部署環境設定 CWA_API_KEY 後，再切換即時 API。"}
          </pre>
        </section>
      </div>
    </div>
  );
}
