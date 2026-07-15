"use client";

import { useMemo, useState } from "react";
import AlgorithmCard from "./AlgorithmCard";
import type { DisplayAlgorithm } from "../lib/types";

export default function AlgorithmGrid({ algorithms }: { algorithms: DisplayAlgorithm[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const categories = [...new Set(algorithms.map((algorithm) => algorithm.displayCategory))];
  const difficulties = [...new Set(algorithms.map((algorithm) => algorithm.displayDifficulty))];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return algorithms.filter((algorithm) => {
      const haystack = `${algorithm.displayName} ${algorithm.displayCategory} ${algorithm.summary}`.toLowerCase();
      return (!q || haystack.includes(q))
        && (!category || algorithm.displayCategory === category)
        && (!difficulty || algorithm.displayDifficulty === difficulty);
    });
  }, [algorithms, category, difficulty, query]);

  return (
    <>
      <div className="flex-between mb-8" style={{ flexWrap: "wrap", gap: "16px" }}>
        <input
          className="btn-secondary"
          style={{ flexGrow: 1, padding: "12px 16px", minWidth: "240px", background: "var(--panel-bg)", backdropFilter: "blur(12px)", color: "#fff" }}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="🔍 搜尋演算法、分類或用途..."
          type="search"
        />
        <div style={{ display: "flex", gap: "12px" }}>
          <select className="btn-secondary" style={{ padding: "12px 16px" }} value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">所有分類</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="btn-secondary" style={{ padding: "12px 16px" }} value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="">所有難度</option>
            {difficulties.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel flex-center" style={{ padding: "60px", flexDirection: "column", gap: "16px" }}>
          <span style={{ fontSize: "3rem" }}>🔍</span>
          <p style={{ color: "var(--text-muted)" }}>沒有找到符合條件的演算法。</p>
          <button onClick={() => { setQuery(""); setCategory(""); setDifficulty(""); }} className="btn btn-secondary">清除篩選條件</button>
        </div>
      ) : (
        <div className="grid-container">
          {filtered.map((algorithm, index) => <AlgorithmCard key={algorithm.slug} algorithm={algorithm} index={index} />)}
        </div>
      )}
    </>
  );
}
