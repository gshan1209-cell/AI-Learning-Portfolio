import React from "react";
import type { ProvenanceMetadata } from "@/lib/web-lab/types";
import { DataModeBadge } from "./data-mode-badge";
import { FreshnessIndicator } from "./freshness-indicator";
import { FallbackNotice } from "./fallback-notice";

interface Props {
  provenance: ProvenanceMetadata;
  title?: string;
}

export function SourceProvenanceCard({ provenance, title = "資料來源與治理標示 (Data Provenance)" }: Props) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
          <span>🌐</span> {title}
        </h3>
        <DataModeBadge mode={provenance.mode} />
      </div>

      {provenance.fallbackReason && <FallbackNotice reason={provenance.fallbackReason} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-slate-500 dark:text-slate-400 block font-medium">來源機構 / 網站：</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{provenance.sourceLabel}</span>
          <a
            href={provenance.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 hover:underline dark:text-blue-400 truncate mt-0.5"
          >
            {provenance.sourceUrl}
          </a>
        </div>

        <FreshnessIndicator
          fetchedAt={provenance.fetchedAt}
          dataHash={provenance.dataHash}
          snapshotVersion={provenance.snapshotVersion}
        />
      </div>

      {provenance.notice && (
        <p className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800">
          💡 <strong>著作權與倫理提示：</strong> {provenance.notice}
        </p>
      )}
    </div>
  );
}
