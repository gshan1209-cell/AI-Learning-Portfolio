import React from "react";

export interface LifecycleStep {
  step: number;
  name: string;
  description: string;
  status: "pending" | "active" | "completed" | "error";
  codeSnippet?: string;
}

interface Props {
  steps: LifecycleStep[];
  title?: string;
}

export function RequestLifecycleViewer({ steps, title = "HTTP 請求生命週期與處理流程" }: Props) {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 space-y-4">
      <h4 className="font-semibold text-sm text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
        <span>⚙️</span> {title}
      </h4>
      <div className="space-y-3">
        {steps.map((s) => (
          <div
            key={s.step}
            className={`p-3 rounded-lg border text-xs transition-colors ${
              s.status === "completed"
                ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-200"
                : s.status === "active"
                ? "bg-blue-950/60 border-blue-600 text-blue-100 ring-1 ring-blue-500"
                : s.status === "error"
                ? "bg-rose-950/40 border-rose-800 text-rose-200"
                : "bg-slate-950/40 border-slate-800 text-slate-400"
            }`}
          >
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                  {s.step}
                </span>
                {s.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-mono">[{s.status}]</span>
            </div>
            <p className="mt-1 text.slate-300 pl-7">{s.description}</p>
            {s.codeSnippet && (
              <pre className="mt-2 ml-7 p-2 rounded bg-black/60 font-mono text-[11px] overflow-x-auto text-emerald-400 border border-slate-800">
                {s.codeSnippet}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
