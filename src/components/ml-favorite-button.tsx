"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mlAlgorithmFavorites";

export default function MlFavoriteButton({ slug }: { slug: string }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    try {
      const values = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
      setFavorite(values.includes(slug));
    } catch {
      setFavorite(false);
    }
  }, [slug]);

  function toggleFavorite() {
    try {
      const values = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
      const next = values.includes(slug) ? values.filter((item) => item !== slug) : [...values, slug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setFavorite(next.includes(slug));
    } catch {
      setFavorite((value) => !value);
    }
  }

  return (
    <button
      type="button"
      aria-pressed={favorite}
      aria-label={favorite ? "取消收藏" : "加入收藏"}
      onClick={toggleFavorite}
      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:border-brand hover:text-brand"
    >
      {favorite ? "★ 已收藏" : "☆ 收藏"}
    </button>
  );
}
