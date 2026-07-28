import React from "react";

interface Props {
  reason?: string;
  className?: string;
}

export function FallbackNotice({ reason, className = "" }: Props) {
  if (!reason) return null;

  return (
    <div
      className={`p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-200 ${className}`}
    >
      <div className="flex items-start gap-2">
        <span className="font-bold text-amber-600 dark:text-amber-400">⚠️ Live 上游請求未回應或超時：</span>
        <span className="flex-1">{reason}</span>
      </div>
      <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
        系統已自動無縫降級切換至預設的版本化 Snapshot 資料備援，確保教學體驗不受斷線影響。
      </p>
    </div>
  );
}
