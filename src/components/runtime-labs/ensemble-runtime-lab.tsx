"use client";

import { FormEvent, useEffect, useState } from "react";
import report from "@/data/ensemble-runtime-report.json";

type RuntimeStatus = {
  ok: boolean;
  modelVersion: string;
  modelSource: string;
  expectedGitBlobSha: string;
  loaded: boolean;
  loggingSensitiveInputs: boolean;
};

type PredictionResult = {
  prediction: string;
  probability: number;
  classProbabilities: Record<string, number>;
  modelVersion: string;
  modelSource: string;
  modelSha256: string;
  generatedAt: string;
  disclaimer: string;
};

const options = {
  workclass: ["Private", "Self-emp-not-inc", "Self-emp-inc", "Federal-gov", "Local-gov", "State-gov", "Without-pay"],
  education: ["HS-grad", "Some-college", "Bachelors", "Masters", "Assoc-voc", "Assoc-acdm", "Prof-school", "Doctorate", "11th"],
  marital_status: ["Never-married", "Married-civ-spouse", "Divorced", "Separated", "Widowed", "Married-spouse-absent"],
  occupation: ["Adm-clerical", "Exec-managerial", "Prof-specialty", "Craft-repair", "Sales", "Other-service", "Machine-op-inspct", "Transport-moving", "Handlers-cleaners", "Tech-support"],
  relationship: ["Not-in-family", "Husband", "Wife", "Own-child", "Unmarried", "Other-relative"],
  race: ["White", "Black", "Asian-Pac-Islander", "Amer-Indian-Eskimo", "Other"],
  sex: ["Male", "Female"],
  native_country: ["United-States", "Mexico", "Philippines", "Germany", "Canada", "India", "Taiwan", "Japan", "England"],
} as const;

export default function EnsembleRuntimeLab() {
  const [status, setStatus] = useState<RuntimeStatus | null>(null);
  const [statusError, setStatusError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [form, setForm] = useState({
    age: 39,
    workclass: "Private",
    education: "Bachelors",
    marital_status: "Never-married",
    occupation: "Adm-clerical",
    relationship: "Not-in-family",
    race: "White",
    sex: "Male",
    capital_gain: 2174,
    capital_loss: 0,
    hours_per_week: 40,
    native_country: "United-States",
  });

  useEffect(() => {
    fetch("/api/ensemble-predict", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<RuntimeStatus>;
      })
      .then(setStatus)
      .catch((reason: unknown) => setStatusError(reason instanceof Error ? reason.message : "無法讀取模型狀態"));
  }, []);

  function setField(name: string, value: string | number) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/ensemble-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json() as PredictionResult & { message?: string };
      if (!response.ok) throw new Error(payload.message || `模型 Runtime 回傳 HTTP ${response.status}`);
      setResult(payload);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "模型推論發生未知錯誤");
    } finally {
      setSubmitting(false);
    }
  }

  const metrics = report.deployedModel.metrics;

  return (
    <>
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft md:p-12">
        <p className="text-sm font-black text-brand">REAL SCIKIT-LEARN RUNTIME</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Adult Census 模型推論與公平性驗證</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Python Function 會下載並驗證固定 Git Blob 的 Random Forest Pipeline，再執行真實 `predict_proba`。CI 另外以 UCI Adult 原始資料固定切分重訓五種模型，輸出可追溯 Artifact 與公平性報告。
        </p>
      </header>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-sm font-black text-brand">DEPLOYED MODEL</p><h2 className="mt-1 text-2xl font-black text-ink">版本、來源與整體指標</h2></div>
          <span className={`rounded-full px-4 py-2 text-sm font-black ${status?.ok ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
            {status ? (status.ok ? "PYTHON RUNTIME READY" : "UNAVAILABLE") : "讀取中"}
          </span>
        </div>
        {statusError && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-rose-700">Runtime 狀態讀取失敗：{statusError}</p>}
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries({ Accuracy: metrics.accuracy, Precision: metrics.precision, Recall: metrics.recall, F1: metrics.f1 }).map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-5"><dt className="text-xs font-black text-slate-500">{label}</dt><dd className="mt-2 text-3xl font-black text-ink">{(value * 100).toFixed(2)}%</dd></div>
          ))}
        </dl>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5"><p className="text-xs font-black text-slate-500">MODEL VERSION</p><p className="mt-2 break-words font-bold text-ink">{status?.modelVersion || report.deployedModel.modelVersion}</p></div>
          <div className="rounded-2xl border border-slate-200 p-5"><p className="text-xs font-black text-slate-500">PINNED SOURCE</p><p className="mt-2 break-words font-bold text-ink">{status?.modelSource || `${report.deployedModel.sourceRepository}@${report.deployedModel.sourceRevision.slice(0, 12)}`}</p></div>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
          <h2 className="text-2xl font-black text-ink">真實推論輸入</h2>
          <p className="mt-2 leading-7 text-slate-600">輸入只用於本次無狀態推論，不寫入 Prediction Log。敏感欄位的存在正是公平性教材的一部分，不代表適合實際決策。</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-slate-700">年齡<input type="number" min={17} max={90} value={form.age} onChange={(event) => setField("age", Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
            <label className="text-sm font-bold text-slate-700">每週工時<input type="number" min={1} max={99} value={form.hours_per_week} onChange={(event) => setField("hours_per_week", Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
            <SelectField label="工作類型" name="workclass" value={form.workclass} values={options.workclass} onChange={setField} />
            <SelectField label="教育程度" name="education" value={form.education} values={options.education} onChange={setField} />
            <SelectField label="婚姻狀態" name="marital_status" value={form.marital_status} values={options.marital_status} onChange={setField} />
            <SelectField label="職業" name="occupation" value={form.occupation} values={options.occupation} onChange={setField} />
            <SelectField label="家庭關係" name="relationship" value={form.relationship} values={options.relationship} onChange={setField} />
            <SelectField label="Race（敏感欄位）" name="race" value={form.race} values={options.race} onChange={setField} />
            <SelectField label="Sex（敏感欄位）" name="sex" value={form.sex} values={options.sex} onChange={setField} />
            <SelectField label="原生國家" name="native_country" value={form.native_country} values={options.native_country} onChange={setField} />
            <label className="text-sm font-bold text-slate-700">資本利得<input type="number" min={0} value={form.capital_gain} onChange={(event) => setField("capital_gain", Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
            <label className="text-sm font-bold text-slate-700">資本損失<input type="number" min={0} value={form.capital_loss} onChange={(event) => setField("capital_loss", Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
          </div>
          <button type="submit" disabled={submitting} className="mt-6 w-full rounded-full bg-brand px-6 py-3 font-black text-white disabled:bg-slate-300">{submitting ? "模型推論中…" : "執行真實 predict_proba"}</button>
          {error && <p className="mt-4 rounded-xl bg-rose-50 p-4 leading-7 text-rose-700">{error}</p>}
        </form>

        <section className="rounded-3xl bg-slate-950 p-7 text-white shadow-soft">
          <p className="text-sm font-black text-emerald-300">PREDICTION OUTPUT</p>
          <h2 className="mt-1 text-2xl font-black">模型輸出與責任邊界</h2>
          {result ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-white/10 p-6"><p className="text-sm text-slate-400">預測類別</p><p className="mt-2 text-4xl font-black">{result.prediction}</p><p className="mt-2 text-xl font-bold text-emerald-300">信心 {(result.probability * 100).toFixed(2)}%</p></div>
              <div className="rounded-2xl bg-white/10 p-5"><p className="text-sm text-slate-400">完整類別機率</p>{Object.entries(result.classProbabilities).map(([label, value]) => <p key={label} className="mt-2 flex justify-between"><span>{label}</span><strong>{(value * 100).toFixed(2)}%</strong></p>)}</div>
              <div className="rounded-2xl bg-white/10 p-5 text-sm leading-7 text-slate-300"><p>版本：{result.modelVersion}</p><p className="break-words">SHA-256：{result.modelSha256}</p><p>時間：{result.generatedAt}</p></div>
              <p className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 leading-7 text-amber-200">{result.disclaimer}</p>
            </div>
          ) : (
            <div className="mt-6 grid min-h-[380px] place-items-center rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-slate-400">送出表單後，此處才顯示 Python／scikit-learn 的真實推論結果；不使用預先寫死的機率。</div>
          )}
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-7">
        <h2 className="text-2xl font-black text-ink">公平性與用途限制</h2>
        <p className="mt-3 leading-7 text-slate-700">{report.warning}</p>
        <p className="mt-3 leading-7 text-slate-700">CI 重訓會針對 `sex` 與 `race` 分組輸出樣本數、Recall、False Positive Rate 與 Selection Rate。這些是描述性診斷，不等於法律或倫理上的公平認證。</p>
      </section>
    </>
  );
}

function SelectField({ label, name, value, values, onChange }: { label: string; name: string; value: string; values: readonly string[]; onChange: (name: string, value: string | number) => void }) {
  return (
    <label className="text-sm font-bold text-slate-700">{label}
      <select value={value} onChange={(event) => onChange(name, event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3">
        {values.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
