import Link from "next/link";
import AlgorithmGrid from "../components/AlgorithmGrid";
import ProgressBar from "../components/ProgressBar";
import { getAlgorithms } from "../lib/algorithms";

export default function HomePage() {
  const algorithms = getAlgorithms();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <section className="glass-panel" style={{ padding: "80px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "rgba(6, 182, 212, 0.15)", filter: "blur(100px)", zIndex: 0, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", padding: "6px 16px", borderRadius: "99px", background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)", color: "var(--accent-cyan)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "24px" }}>
            ✨ ML Tutor System v2.0
          </div>
          <h1 className="heading-1">解鎖 <span className="text-gradient">機器學習</span> 的核心</h1>
          <p className="subtitle" style={{ margin: "0 auto 32px" }}>
            結合互動卡片、動態視覺化與 AI 助教，在深色科技介面中探索十大機器學習演算法，將艱澀理論轉化為直覺體驗。
          </p>
          <div className="flex-center gap-4">
            <Link href="#algorithms" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "1.1rem" }}>啟動學習程序</Link>
            <Link href="/about" className="btn btn-secondary" style={{ padding: "14px 28px", fontSize: "1.1rem" }}>查閱系統日誌</Link>
          </div>
        </div>
      </section>

      <section id="algorithms">
        <div className="flex-between mb-8" style={{ alignItems: "flex-end", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <h2 className="heading-2" style={{ display: "flex", alignItems: "center", gap: "12px", margin: 0 }}>
              <span style={{ width: "4px", height: "24px", background: "var(--accent-cyan)", borderRadius: "4px", boxShadow: "var(--shadow-glow)" }} />
              探索演算法矩陣
            </h2>
            <p style={{ color: "var(--text-muted)", marginLeft: "16px", marginTop: "8px" }}>選擇目標模組，載入學習資源</p>
          </div>
          <div style={{ minWidth: "280px" }}><ProgressBar total={algorithms.length} /></div>
        </div>
        <AlgorithmGrid algorithms={algorithms} />
      </section>
    </div>
  );
}
