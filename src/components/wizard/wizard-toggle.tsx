"use client";

import React from "react";
import { useWizard } from "./wizard-context";

export default function WizardToggle() {
  const { enabled, toggleEnabled } = useWizard();

  return (
    <button
      onClick={toggleEnabled}
      type="button"
      className={`group relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-300 ${
        enabled
          ? "bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
      }`}
      title={enabled ? "精靈模式已開啟（點擊關閉）" : "精靈模式已關閉（點擊開啟）"}
    >
      <span className="relative flex h-2 w-2">
        {enabled && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            enabled ? "bg-amber-300" : "bg-slate-400"
          }`}
        />
      </span>
      <span className="tracking-wide">🧙‍♂️ 精靈模式</span>
      <span
        className={`ml-0.5 rounded-md px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
          enabled ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
        }`}
      >
        {enabled ? "ON" : "OFF"}
      </span>
    </button>
  );
}
