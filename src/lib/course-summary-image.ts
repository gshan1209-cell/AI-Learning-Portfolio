import type { Course } from "@/types/course";

const SVG_WIDTH = 1200;
const SVG_HEIGHT = 1600;
const LEVEL_LABELS: Record<Course["level"], string> = {
  beginner: "入門",
  intermediate: "進階",
  advanced: "高階",
};

export function escapeSvgText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function wrapSvgText(value: string, maxCharacters: number): string[] {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized || maxCharacters <= 0) return [];

  const lines: string[] = [];
  let current = "";

  for (const character of normalized) {
    if (current.length >= maxCharacters) {
      lines.push(current.trim());
      current = "";
    }
    current += character;
  }

  if (current.trim()) lines.push(current.trim());
  return lines;
}

export function getCourseSummaryHighlights(course: Course): string[] {
  if (course.learningObjectives.length > 0) {
    return course.learningObjectives.slice(0, 4);
  }
  if (course.sections.length > 0) {
    return course.sections.slice(0, 4).map((section) => section.title);
  }
  return course.tags.slice(0, 4);
}

function renderTextLines(
  lines: string[],
  x: number,
  startY: number,
  fontSize: number,
  lineHeight: number,
  className: string,
): string {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${startY + index * lineHeight}" class="${className}" font-size="${fontSize}">${escapeSvgText(line)}</text>`,
    )
    .join("\n");
}

export function renderCourseSummarySvg(course: Course): string {
  const titleLines = wrapSvgText(course.title, 14).slice(0, 3);
  const subtitleLines = wrapSvgText(course.subtitle, 27).slice(0, 2);
  const summaryLines = wrapSvgText(course.summary, 32).slice(0, 5);
  const highlights = getCourseSummaryHighlights(course);
  const tags = course.tags.slice(0, 5).join("  ·  ");
  const pillWidth = Math.min(520, Math.max(220, 96 + course.category.length * 36));

  const highlightMarkup = highlights
    .map((item, index) => {
      const y = 1125 + index * 92;
      const lines = wrapSvgText(item, 31).slice(0, 2);
      return `<circle cx="122" cy="${y - 13}" r="14" fill="#10b981" />\n${renderTextLines(lines, 158, y, 31, 38, "body")}`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" role="img" aria-labelledby="title description">
  <title id="title">${escapeSvgText(course.title)}重點摘要</title>
  <desc id="description">${escapeSvgText(course.summary)}</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ecfdf5" />
      <stop offset="52%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#eff6ff" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>
    <style>
      .eyebrow { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-weight: 800; fill: #047857; letter-spacing: 3px; }
      .title { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-weight: 900; fill: #0f172a; }
      .subtitle { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-weight: 750; fill: #059669; }
      .body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-weight: 550; fill: #475569; }
      .label { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-weight: 850; fill: #0f172a; }
    </style>
  </defs>
  <rect width="1200" height="1600" fill="url(#background)" />
  <circle cx="1050" cy="150" r="220" fill="#a7f3d0" opacity="0.55" />
  <circle cx="90" cy="1490" r="260" fill="#bfdbfe" opacity="0.40" />
  <rect x="60" y="60" width="1080" height="1480" rx="64" fill="#ffffff" opacity="0.97" filter="url(#shadow)" />

  <text x="105" y="135" class="eyebrow" font-size="27">AI LEARNING PORTFOLIO · 重點摘要</text>
  <rect x="105" y="175" width="${pillWidth}" height="64" rx="32" fill="#d1fae5" />
  <text x="140" y="218" class="eyebrow" font-size="26">${escapeSvgText(course.category)}</text>

  ${renderTextLines(titleLines, 105, 340, 72, 86, "title")}
  ${renderTextLines(subtitleLines, 105, 610, 35, 48, "subtitle")}

  <rect x="95" y="715" width="1010" height="300" rx="36" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />
  <text x="130" y="775" class="label" font-size="30">一句話看懂</text>
  ${renderTextLines(summaryLines, 130, 835, 32, 44, "body")}

  <text x="105" y="1065" class="label" font-size="34">學習重點</text>
  ${highlightMarkup}

  <line x1="105" y1="1460" x2="1095" y2="1460" stroke="#e2e8f0" stroke-width="3" />
  <text x="105" y="1510" class="body" font-size="25">${escapeSvgText(tags)}</text>
  <text x="105" y="1555" class="body" font-size="24">難度：${LEVEL_LABELS[course.level]}　｜　預估時間：約 ${course.durationMinutes} 分鐘</text>
</svg>`;
}
