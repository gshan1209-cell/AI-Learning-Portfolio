"use client";

import { useEffect, useState } from "react";

export default function ProgressBar({ total }: { total: number }) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    function sync() {
      const items = JSON.parse(localStorage.getItem("completed") || "[]") as string[];
      setCompleted(items.length);
    }
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("progressUpdated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("progressUpdated", sync);
    };
  }, []);

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div style={{ padding: "20px", borderTop: "1px solid var(--panel-border)", background: "rgba(255, 255, 255, 0.02)", marginTop: "auto", backdropFilter: "blur(10px)", borderRadius: "0 0 var(--radius-lg) var(--radius-lg)" }}>
      <div className="flex-between" style={{ marginBottom: "10px" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>整體學習進度</span>
        <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--accent-cyan)" }}>{percent}%</span>
      </div>
      <div style={{ width: "100%", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", height: "6px", overflow: "hidden" }} aria-label="Learning progress">
        <div style={{ background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))", height: "100%", borderRadius: "999px", transition: "width 0.7s ease-out", boxShadow: "0 0 10px rgba(6, 182, 212, 0.5)", width: `${percent}%` }} />
      </div>
      {percent === 100 ? (
        <p style={{ fontSize: "0.65rem", color: "var(--status-success)", fontWeight: 700, marginTop: "8px", textAlign: "center" }}>🎉 恭喜完成所有演算法！</p>
      ) : (
        <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "8px", textAlign: "right", fontWeight: 500 }}>{completed} / {total} 已完成</p>
      )}
    </div>
  );
}
