import type { MovieItem } from "./types";

export function decodeHtml(html?: string): string {
  if (!html) return "";
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function textFromHtml(html?: string): string {
  if (!html) return "";
  return decodeHtml(html.replace(/<[^>]+>/g, "")).trim();
}

export function getMatch(text: string, regex: RegExp): string {
  const match = text.match(regex);
  return match ? match[1] ?? "" : "";
}

export function parseScrapeCenterHtml(html: string): MovieItem[] {
  if (!html) return [];
  const blocks = html.split(/<div[^>]+class="el-card item m-t is-hover-shadow"[^>]*>/).slice(1);

  return blocks
    .map((block) => {
      const id = getMatch(block, /href="\/detail\/(\d+)"/);
      const title = textFromHtml(getMatch(block, /<h2[^>]*class="m-b-sm"[^>]*>([\s\S]*?)<\/h2>/));
      const cover = decodeHtml(getMatch(block, /<img[\s\S]*?src="([^"]+)"[\s\S]*?class="cover"/));
      const categoriesBlock = getMatch(block, /<div[^>]*class="categories"[^>]*>([\s\S]*?)<\/div>/);
      const categories = Array.from(categoriesBlock.matchAll(/<span>([\s\S]*?)<\/span>/g)).map(
        (match) => textFromHtml(match[1])
      );
      const infoBlocks = Array.from(
        block.matchAll(/<div[^>]*class="m-v-sm info"[^>]*>([\s\S]*?)<\/div>/g)
      ).map((match) => textFromHtml(match[1]));
      const [region = "", duration = ""] = (infoBlocks[0] ?? "").split("/").map((item) => item.trim());
      const releaseDate = (infoBlocks[1] ?? "").replace(" 上映", "");
      const score = getMatch(block, /<p[^>]*class="score[^"]*"[^>]*>\s*([\d.]+)/);

      return {
        id: id || title,
        title,
        cover,
        categories: categories.length > 0 ? categories : ["通用"],
        region: region || undefined,
        duration: duration || undefined,
        releaseDate: releaseDate || undefined,
        score: score || undefined,
        detailUrl: id ? `https://ssr1.scrape.center/detail/${id}` : "https://ssr1.scrape.center",
        source: "scrape-center" as const,
        sourceLabel: "Scrape Center",
      };
    })
    .filter((m) => m.title);
}

export function parseAtMoviesNewHtml(html: string): MovieItem[] {
  if (!html) return [];
  const blocks = html.split(/<article[^>]*class="filmList"[^>]*>/).slice(1);

  return blocks
    .map((block) => {
      const detailPath = getMatch(block, /<div[^>]*class="filmTitle"[\s\S]*?<a href="([^"]+)"/);
      const title = textFromHtml(getMatch(block, /<div[^>]*class="filmTitle"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/));
      const coverPath = getMatch(block, /<img src="([^"]+)" class="filmListPoster"/);
      const runtimeRaw = textFromHtml(getMatch(block, /<div[^>]*class="runtime"[^>]*>([\s\S]*?)<\/div>/));
      const duration = getMatch(runtimeRaw, /片長[:：]?\s*([0-9]+分)/);
      const releaseDate = getMatch(runtimeRaw, /上映日期[:：]?\s*([0-9/]+)/);
      const scoreRaw = textFromHtml(getMatch(block, /<div id="avg"[^>]*>([\s\S]*?)<\/div>/)).replace("★", "");

      const id = detailPath.replace(/\//g, "") || title;

      return {
        id,
        title,
        cover: coverPath ? `https://www.atmovies.com.tw${coverPath}` : undefined,
        categories: ["本周新片"],
        duration: duration || undefined,
        releaseDate: releaseDate || undefined,
        score: scoreRaw && scoreRaw !== "0" ? scoreRaw : undefined,
        detailUrl: detailPath ? `https://www.atmovies.com.tw${detailPath}` : "https://www.atmovies.com.tw",
        source: "atmovies" as const,
        sourceLabel: "@movies 開眼電影網",
      };
    })
    .filter((m) => m.title);
}
