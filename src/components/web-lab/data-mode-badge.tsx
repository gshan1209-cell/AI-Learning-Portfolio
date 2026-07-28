import React from "react";
import type { DataMode } from "@/lib/web-lab/types";

interface Props {
  mode: DataMode;
  className?: string;
}

export function DataModeBadge({ mode, className = "" }: Props) {
  const styles: Record<DataMode, { bg: string; text: string; label: string }> = {
    snapshot: {
      bg: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
      text: "Snapshot 模式 (離線快照)",
      label: "Snapshot",
    },
    live: {
      bg: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
      text: "Live 模式 (即時 API/網頁)",
      label: "Live",
    },
    fallback: {
      bg: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
      text: "Fallback 模式 (自動降級備援)",
      label: "Fallback",
    },
  };

  const style = styles[mode] || styles.snapshot;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.bg} ${className}`}
      title={style.text}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse" />
      {style.label}
    </span>
  );
}
