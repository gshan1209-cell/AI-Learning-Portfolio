import { NextRequest, NextResponse } from "next/server";
import { loadMovieSnapshot } from "@/lib/web-lab/movie-scraper/snapshots";
import { parseAtMoviesNewHtml, parseScrapeCenterHtml } from "@/lib/web-lab/movie-scraper/parsers";
import type { MovieItem, MovieSource } from "@/lib/web-lab/movie-scraper/types";
import { createProvenanceMetadata, computeDataHash } from "@/lib/web-lab/provenance";
import { isUrlAllowed, normalizeError } from "@/lib/web-lab/request-policy";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceParam = searchParams.get("source") || "scrape-center";
    const modeParam = searchParams.get("mode") || "snapshot";
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const categoryParam = searchParams.get("category") || undefined;

    if (sourceParam !== "scrape-center" && sourceParam !== "atmovies") {
      return NextResponse.json(
        normalizeError("Invalid source parameter. Must be 'scrape-center' or 'atmovies'.", 400, "INVALID_PARAMETER"),
        { status: 400 }
      );
    }

    if (modeParam !== "snapshot" && modeParam !== "live") {
      return NextResponse.json(
        normalizeError("Invalid mode parameter. Must be 'snapshot' or 'live'.", 400, "INVALID_PARAMETER"),
        { status: 400 }
      );
    }

    const source: MovieSource = sourceParam;
    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

    // Default to snapshot mode
    if (modeParam === "snapshot") {
      const result = loadMovieSnapshot(source, page, 10, categoryParam);
      return NextResponse.json(result, {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=600",
        },
      });
    }

    // Controlled Server-only Live Mode
    const targetUrl =
      source === "atmovies"
        ? "https://www.atmovies.com.tw/movie/new/"
        : "https://ssr1.scrape.center";

    if (!isUrlAllowed(targetUrl)) {
      const fallbackResult = loadMovieSnapshot(source, page, 10, categoryParam);
      fallbackResult.provenance = {
        ...fallbackResult.provenance,
        mode: "fallback",
        fallbackReason: "Target URL is not in security allowlist.",
      };
      return NextResponse.json(fallbackResult);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(targetUrl, {
        headers: {
          "User-Agent": "AI-Learning-Portfolio-Scraper/1.0 (+https://github.com/gshan1209-cell/AI-Learning-Portfolio)",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Upstream returned HTTP ${res.status}`);
      }

      const html = await res.text();
      if (html.length > 2 * 1024 * 1024) {
        throw new Error("Upstream response body exceeded 2MB limit");
      }

      let liveMovies: MovieItem[] = [];
      if (source === "atmovies") {
        liveMovies = parseAtMoviesNewHtml(html);
      } else {
        liveMovies = parseScrapeCenterHtml(html);
      }

      if (categoryParam) {
        liveMovies = liveMovies.filter((m) => m.categories.includes(categoryParam));
      }

      const pageSize = 10;
      const total = liveMovies.length;
      const paginated = liveMovies.slice((page - 1) * pageSize, page * pageSize);
      const categories = Array.from(new Set(liveMovies.flatMap((m) => m.categories))).sort();
      const hash = computeDataHash(paginated);

      const provenance = createProvenanceMetadata({
        mode: "live",
        source,
        sourceLabel: source === "atmovies" ? "@movies 開眼電影網" : "Scrape Center",
        sourceUrl: targetUrl,
        dataHash: hash,
        notice: "即時擷取自公開頁面 White-listed 伺服器端請求。",
      });

      return NextResponse.json({
        source,
        sourceLabel: source === "atmovies" ? "@movies 開眼電影網" : "Scrape Center",
        sourceUrl: targetUrl,
        page,
        pageSize,
        total,
        movies: paginated,
        categories,
        filteredBy: categoryParam,
        provenance,
      }, {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=120",
        },
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Live scrape request failed";
      const fallbackResult = loadMovieSnapshot(source, page, 10, categoryParam);
      fallbackResult.provenance = {
        ...fallbackResult.provenance,
        mode: "fallback",
        fallbackReason: errorMsg,
      };
      return NextResponse.json(fallbackResult);
    }
  } catch (err) {
    return NextResponse.json(
      normalizeError("An error occurred while fetching movies.", 500, "INTERNAL_ERROR"),
      { status: 500 }
    );
  }
}
