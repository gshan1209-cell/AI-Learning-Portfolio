import React from "react";

interface Props {
  fetchedAt?: string;
  dataHash?: string;
  snapshotVersion?: string;
}

export function FreshnessIndicator({ fetchedAt, dataHash, snapshotVersion }: Props) {
  if (!fetchedAt && !dataHash) return null;

  const formattedTime = fetchedAt
    ? new Date(fetchedAt).toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        hour12: false,
      })
    : "未知";

  return (
    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
      {fetchedAt && (
        <div>
          <span className="font-medium text-slate-600 dark:text-slate-300">擷取時間：</span>
          <time dateTime={fetchedAt}>{formattedTime}</time>
        </div>
      )}
      {snapshotVersion && (
        <div>
          <span className="font-medium text-slate-600 dark:text-slate-300">Snapshot 版本：</span>
          <code>v{snapshotVersion}</code>
        </div>
      )}
      {dataHash && (
        <div className="font-mono text-[11px] truncate" title={`SHA-256 Hash: ${dataHash}`}>
          <span className="font-sans font-medium text-slate-600 dark:text-slate-300">Hash: </span>
          {dataHash.substring(0, 16)}...
        </div>
      )}
    </div>
  );
}
