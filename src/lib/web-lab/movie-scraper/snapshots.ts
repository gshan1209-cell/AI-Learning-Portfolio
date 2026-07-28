import fs from "node:fs";
import path from "node:path";
import type { MovieItem, MovieResult, MovieSource } from "./types";
import { createProvenanceMetadata } from "../provenance";

const SNAPSHOT_PATH = path.join(
  process.cwd(),
  "modules/movie-scraper/snapshots/movies-snapshot.json"
);

interface RawSnapshot {
  snapshotVersion: string;
  generatedAt: string;
  dataHash: string;
  movies: MovieItem[];
}

export function loadMovieSnapshot(
  source: MovieSource = "scrape-center",
  page = 1,
  pageSize = 10,
  category?: string
): MovieResult {
  let raw: RawSnapshot = {
    snapshotVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    dataHash: "fallback-hash",
    movies: [
      {
        id: "fallback-1",
        title: "霸王別姬",
        cover: "https://p0.meituan.net/movie/v1.jpg",
        categories: ["劇情", "愛情"],
        region: "中國大陸",
        duration: "171 分鐘",
        releaseDate: "1993-01-01",
        score: "9.5",
        detailUrl: "https://ssr1.scrape.center/detail/1",
        source: "scrape-center",
        sourceLabel: "Scrape Center",
      },
    ],
  };

  try {
    if (fs.existsSync(SNAPSHOT_PATH)) {
      const content = fs.readFileSync(SNAPSHOT_PATH, "utf-8");
      raw = JSON.parse(content);
    }
  } catch (err) {
    console.error("Failed to load movie snapshot JSON:", err);
  }

  let filtered = raw.movies.filter((m) => m.source === source);
  if (category) {
    filtered = filtered.filter((m) => m.categories.includes(category));
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  const categories = Array.from(new Set(filtered.flatMap((m) => m.categories))).sort();

  const sourceUrl =
    source === "atmovies"
      ? "https://www.atmovies.com.tw/movie/new/"
      : "https://ssr1.scrape.center";

  const provenance = createProvenanceMetadata({
    mode: "snapshot",
    source,
    sourceLabel: source === "atmovies" ? "@movies 開眼電影網" : "Scrape Center",
    sourceUrl,
    snapshotVersion: raw.snapshotVersion,
    dataHash: raw.dataHash,
    notice:
      "本頁資料為伺服器端版本化 Snapshot，僅包含公開基本資訊與原始連結，離線與 CI 環境均可使用。",
  });

  return {
    source,
    sourceLabel: source === "atmovies" ? "@movies 開眼電影網" : "Scrape Center",
    sourceUrl,
    page,
    pageSize,
    total,
    movies: paginated,
    categories,
    filteredBy: category,
    provenance,
  };
}
