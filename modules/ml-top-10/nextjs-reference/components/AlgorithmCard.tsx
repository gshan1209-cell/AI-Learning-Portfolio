"use client";

import { useRouter } from "next/navigation";
import FavoriteButton from "./FavoriteButton";
import type { DisplayAlgorithm } from "../lib/types";

export default function AlgorithmCard({ algorithm, index }: { algorithm: DisplayAlgorithm; index: number }) {
  const router = useRouter();

  return (
    <article className="card" onClick={() => router.push(`/algorithms/${algorithm.slug}`)} style={{ cursor: "pointer" }}>
      <div className="card-header">
        <span className="tag">{algorithm.displayDifficulty}</span>
        <div onClick={(event) => event.stopPropagation()}>
          <FavoriteButton slug={algorithm.slug} />
        </div>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: "4px" }}>
          {algorithm.displayCategory}
        </div>
        <h2 className="card-title">{algorithm.displayName}</h2>
      </div>

      <p className="card-body">{algorithm.summary}</p>

      <div className="flex-between">
        <span style={{ color: "var(--text-muted)", fontSize: "2.5rem", fontWeight: 900, opacity: 0.1, lineHeight: 1 }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.85rem", transition: "all 0.3s ease" }}>
          開始學習 <span style={{ display: "inline-block", transition: "transform 0.3s ease" }} className="arrow">→</span>
        </span>
      </div>
    </article>
  );
}
