import { getCourseSummaryCardContent } from "@/lib/course-summary-card-content";
import type { Course } from "@/types/course";

const SVG_WIDTH = 1200;
const SVG_HEIGHT = 2133;

const PANEL_COLORS = {
  blue: { header: "#1769d2", border: "#1769d2", fill: "#f7fbff" },
  green: { header: "#20a468", border: "#20a468", fill: "#f3fff9" },
  orange: { header: "#f59e0b", border: "#f59e0b", fill: "#fffaf0" },
  purple: { header: "#7c4dcc", border: "#7c4dcc", fill: "#fbf8ff" },
  teal: { header: "#0ea5a6", border: "#0ea5a6", fill: "#f1ffff" },
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
  anchor: "start" | "middle" | "end" = "start",
): string {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${startY + index * lineHeight}" class="${className}" font-size="${fontSize}" text-anchor="${anchor}">${escapeSvgText(line)}</text>`,
    )
    .join("\n");
}

function renderPanel(
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  color: keyof typeof PANEL_COLORS,
  body: string,
): string {
  const palette = PANEL_COLORS[color];
  return `<g>
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="34" fill="${palette.fill}" stroke="${palette.border}" stroke-width="4" />
    <path d="M ${x + 34} ${y} H ${x + width - 34} Q ${x + width} ${y} ${x + width} ${y + 34} V ${y + 82} H ${x} V ${y + 34} Q ${x} ${y} ${x + 34} ${y} Z" fill="${palette.header}" />
    <text x="${x + 28}" y="${y + 57}" class="panel-title" font-size="31">${escapeSvgText(title)}</text>
    ${body}
  </g>`;
}

function renderTutor(): string {
  return `<g transform="translate(825 36)" aria-label="AI 助教">
    <circle cx="176" cy="160" r="132" fill="#ffe4f0" />
    <path d="M72 156 C62 48 274 5 302 147 C291 82 254 39 181 33 C106 30 72 79 72 156Z" fill="#e9dcff" stroke="#172554" stroke-width="5" />
    <circle cx="176" cy="155" r="104" fill="#fff5f7" stroke="#172554" stroke-width="5" />
    <path d="M82 132 C91 52 270 52 278 134 C243 101 219 110 194 81 C162 113 122 102 82 132Z" fill="#eadfff" />
    <ellipse cx="137" cy="164" rx="15" ry="23" fill="#172554" />
    <ellipse cx="215" cy="164" rx="15" ry="23" fill="#172554" />
    <circle cx="132" cy="157" r="5" fill="#ffffff" />
    <circle cx="210" cy="157" r="5" fill="#ffffff" />
    <path d="M154 207 Q176 225 201 205" fill="none" stroke="#ec4899" stroke-width="7" stroke-linecap="round" />
    <path d="M70 133 C35 135 34 212 74 220" fill="none" stroke="#172554" stroke-width="12" />
    <path d="M282 133 C319 137 316 211 278 220" fill="none" stroke="#172554" stroke-width="12" />
    <circle cx="61" cy="178" r="31" fill="#fb4b91" stroke="#172554" stroke-width="6" />
    <circle cx="291" cy="178" r="31" fill="#fb4b91" stroke="#172554" stroke-width="6" />
    <text x="291" y="187" class="tutor-label" font-size="24" text-anchor="middle">AI</text>
    <path d="M291 208 Q319 227 286 242" fill="none" stroke="#172554" stroke-width="7" />
    <circle cx="282" cy="243" r="7" fill="#172554" />
    <path d="M102 264 Q176 237 250 264 L280 435 L70 435 Z" fill="#ffffff" stroke="#172554" stroke-width="5" />
    <path d="M154 258 L176 338 L199 258" fill="#fb4b91" stroke="#172554" stroke-width="4" />
    <path d="M236 286 Q306 254 317 197" fill="none" stroke="#172554" stroke-width="27" stroke-linecap="round" />
    <path d="M317 197 L323 125" fill="none" stroke="#172554" stroke-width="20" stroke-linecap="round" />
    <circle cx="323" cy="116" r="12" fill="#fff5f7" stroke="#172554" stroke-width="4" />
    <rect x="86" y="310" width="58" height="48" rx="10" fill="#fb4b91" />
    <text x="115" y="342" class="tutor-label" font-size="24" text-anchor="middle">AI</text>
    <text x="176" y="469" class="tutor-caption" font-size="25" text-anchor="middle">AI 助教</text>
  </g>`;
}

function renderProcess(
  items: ReturnType<typeof getCourseSummaryCardContent>["process"],
): string {
  return items
    .slice(0, 3)
    .map((item, index) => {
      const centerX = 145 + index * 208;
      const titleLines = wrapSvgText(item.title, 8).slice(0, 2);
      const detailLines = wrapSvgText(item.detail, 10).slice(0, 3);
      const arrow =
        index < 2
          ? `<path d="M ${centerX + 74} 774 H ${centerX + 121}" stroke="#1769d2" stroke-width="12" stroke-linecap="round" /><path d="M ${centerX + 111} 758 L ${centerX + 130} 774 L ${centerX + 111} 790" fill="none" stroke="#1769d2" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />`
          : "";
      return `<g>
        <circle cx="${centerX}" cy="690" r="58" fill="#e3efff" stroke="#1769d2" stroke-width="4" />
        <text x="${centerX}" y="707" class="step-number" font-size="43" text-anchor="middle">${index + 1}</text>
        <circle cx="${centerX}" cy="774" r="25" fill="#1769d2" opacity="0.18" />
        <circle cx="${centerX}" cy="774" r="10" fill="#1769d2" />
        ${renderTextLines(titleLines, centerX, 850, 29, 37, "item-title", "middle")}
        ${renderTextLines(detailLines, centerX, 925, 22, 30, "item-detail", "middle")}
        ${arrow}
      </g>`;
    })
    .join("\n");
}

function renderChecklist(
  items: string[],
  x: number,
  startY: number,
  width: number,
  color: string,
  maxCharacters: number,
): string {
  return items
    .slice(0, 4)
    .map((item, index) => {
      const y = startY + index * 97;
      const lines = wrapSvgText(item, maxCharacters).slice(0, 2);
      return `<g>
        <circle cx="${x}" cy="${y - 10}" r="17" fill="${color}" />
        <path d="M ${x - 8} ${y - 10} L ${x - 2} ${y - 3} L ${x + 10} ${y - 18}" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
        ${renderTextLines(lines, x + 35, y, 24, 31, "list-text")}
        ${index < items.slice(0, 4).length - 1 ? `<line x1="${x + 34}" y1="${y + 42}" x2="${x + width}" y2="${y + 42}" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5 6" />` : ""}
      </g>`;
    })
    .join("\n");
}

function renderExamples(
  items: ReturnType<typeof getCourseSummaryCardContent>["examples"],
): string {
  return items
    .slice(0, 3)
    .map((item, index) => {
      const y = 1217 + index * 82;
      const title = wrapSvgText(item.title, 10).slice(0, 1);
      const detail = wrapSvgText(item.detail, 12).slice(0, 1);
      return `<g>
        <circle cx="650" cy="${y - 8}" r="18" fill="#dbeafe" stroke="#1769d2" stroke-width="3" />
        <path d="M 644 ${y - 8} H 656 M 650 ${y - 14} V ${y - 2}" stroke="#1769d2" stroke-width="4" stroke-linecap="round" />
        ${renderTextLines(title, 682, y, 23, 29, "list-text")}
        <text x="865" y="${y}" class="arrow-text" font-size="24">→</text>
        ${renderTextLines(detail, 905, y, 23, 29, "accent-text")}
        ${index < 2 ? `<line x1="638" y1="${y + 36}" x2="1120" y2="${y + 36}" stroke="#bfdbfe" stroke-width="2" stroke-dasharray="5 6" />` : ""}
      </g>`;
    })
    .join("\n");
}

function renderTools(tools: string[]): string {
  return tools
    .slice(0, 4)
    .map((tool, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const centerX = 748 + column * 274;
      const centerY = 1586 + row * 150;
      const initials = tool
        .split(/[\s／-]+/)
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 3)
        .toUpperCase();
      return `<g>
        <circle cx="${centerX}" cy="${centerY}" r="43" fill="${index % 2 === 0 ? "#dbeafe" : "#ccfbf1"}" stroke="#0ea5a6" stroke-width="3" />
        <text x="${centerX}" y="${centerY + 10}" class="tool-icon" font-size="24" text-anchor="middle">${escapeSvgText(initials || "AI")}</text>
        ${renderTextLines(wrapSvgText(tool, 14).slice(0, 2), centerX, centerY + 74, 22, 27, "tool-name", "middle")}
      </g>`;
    })
    .join("\n");
}

function renderRobot(): string {
  return `<g transform="translate(1000 1902)">
    <circle cx="80" cy="78" r="65" fill="#e0f2fe" stroke="#ffffff" stroke-width="5" />
    <rect x="27" y="35" width="106" height="82" rx="32" fill="#ffffff" stroke="#7dd3fc" stroke-width="5" />
    <rect x="42" y="50" width="76" height="48" rx="20" fill="#0f274d" />
    <circle cx="64" cy="73" r="7" fill="#67e8f9" />
    <circle cx="96" cy="73" r="7" fill="#67e8f9" />
    <path d="M68 86 Q80 96 93 86" fill="none" stroke="#67e8f9" stroke-width="5" stroke-linecap="round" />
    <line x1="80" y1="13" x2="80" y2="-7" stroke="#ffffff" stroke-width="7" />
    <circle cx="80" cy="-14" r="9" fill="#67e8f9" stroke="#ffffff" stroke-width="4" />
    <rect x="48" y="120" width="64" height="48" rx="18" fill="#ffffff" stroke="#7dd3fc" stroke-width="5" />
    <text x="80" y="151" class="robot-label" font-size="21" text-anchor="middle">AI</text>
    <path d="M34 128 Q8 112 2 80" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" />
    <path d="M126 128 Q153 105 155 65" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round" />
    <circle cx="156" cy="58" r="10" fill="#ffffff" />
  </g>`;
}

export function renderCourseSummarySvg(course: Course): string {
  const card = getCourseSummaryCardContent(course);
  const titleLines = wrapSvgText(card.title, 17).slice(0, 3);
  const subtitleLines = wrapSvgText(card.subtitle, 28).slice(0, 2);
  const speechLines = wrapSvgText(card.speech, 19).slice(0, 5);
  const keyPhraseLines = wrapSvgText(card.keyPhrase, 13).slice(0, 3);
  const keyNoteLines = wrapSvgText(card.keyNote, 23).slice(0, 3);
  const footerFormulaLines = wrapSvgText(card.footerFormula, 31).slice(0, 2);
  const footerNoteLines = wrapSvgText(card.footerNote, 34).slice(0, 2);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" role="img" aria-labelledby="title description">
  <title id="title">${escapeSvgText(card.title)}｜課程重點圖卡</title>
  <desc id="description">${escapeSvgText(card.subtitle)}</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff7fb" />
      <stop offset="50%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#eff8ff" />
    </linearGradient>
    <linearGradient id="footer" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#082b63" />
      <stop offset="100%" stop-color="#143d7c" />
    </linearGradient>
    <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#172554" flood-opacity="0.12" />
    </filter>
    <style>
      .title-text { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-weight: 950; fill: #102c66; }
      .subtitle-text { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-weight: 800; fill: #be185d; }
      .panel-title { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-weight: 900; fill: #ffffff; }
      .item-title, .list-text { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-weight: 800; fill: #172554; }
      .item-detail { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-weight: 600; fill: #475569; }
      .step-number { font-family: system-ui, sans-serif; font-weight: 950; fill: #1769d2; }
      .key-text { font-family: system-ui, sans-serif; font-weight: 950; fill: #172554; }
      .key-note { font-family: system-ui, sans-serif; font-weight: 650; fill: #475569; }
      .accent-text { font-family: system-ui, sans-serif; font-weight: 850; fill: #e11d68; }
      .arrow-text { font-family: system-ui, sans-serif; font-weight: 900; fill: #64748b; }
      .tool-icon { font-family: system-ui, sans-serif; font-weight: 950; fill: #0f4f86; }
      .tool-name { font-family: system-ui, sans-serif; font-weight: 800; fill: #172554; }
      .tutor-label, .robot-label { font-family: system-ui, sans-serif; font-weight: 950; fill: #ffffff; }
      .tutor-caption { font-family: system-ui, sans-serif; font-weight: 900; fill: #be185d; }
      .speech-text { font-family: system-ui, sans-serif; font-weight: 750; fill: #172554; }
      .footer-formula { font-family: system-ui, sans-serif; font-weight: 950; fill: #ffffff; }
      .footer-note { font-family: system-ui, sans-serif; font-weight: 750; fill: #fef3c7; }
    </style>
  </defs>

  <rect width="1200" height="2133" fill="url(#background)" />
  <circle cx="80" cy="62" r="120" fill="#fce7f3" />
  <circle cx="1140" cy="520" r="135" fill="#dbeafe" opacity="0.55" />
  <g opacity="0.65" fill="#60a5fa">
    <circle cx="1110" cy="40" r="7" /><circle cx="1140" cy="40" r="7" /><circle cx="1170" cy="40" r="7" />
    <circle cx="1110" cy="70" r="7" /><circle cx="1140" cy="70" r="7" /><circle cx="1170" cy="70" r="7" />
  </g>
  <path d="M0 322 H92 L113 302 H194" fill="none" stroke="#bfdbfe" stroke-width="4" />
  <path d="M0 350 H135 L155 370 H250" fill="none" stroke="#ddd6fe" stroke-width="4" />

  <g filter="url(#soft-shadow)">
    <rect x="48" y="38" width="1110" height="500" rx="46" fill="#ffffff" opacity="0.96" />
  </g>
  <rect x="58" y="58" width="116" height="116" rx="28" fill="#e3efff" stroke="#1769d2" stroke-width="4" />
  <path d="M82 142 L112 111 L135 127 L155 87" fill="none" stroke="#fb4b91" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="82" cy="142" r="7" fill="#1769d2" /><circle cx="112" cy="111" r="7" fill="#1769d2" /><circle cx="135" cy="127" r="7" fill="#1769d2" /><circle cx="155" cy="87" r="7" fill="#1769d2" />
  ${renderTextLines(titleLines, 196, 118, 59, 68, "title-text")}
  <rect x="66" y="375" width="705" height="92" rx="46" fill="#fff0f6" />
  ${renderTextLines(subtitleLines, 100, 417, 29, 37, "subtitle-text")}
  ${renderTutor()}
  <path d="M 660 330 Q 660 275 718 275 H 1080 Q 1135 275 1135 330 V 458 Q 1135 510 1080 510 H 755 L 713 540 L 720 510 H 718 Q 660 510 660 458 Z" fill="#ffffff" stroke="#1769d2" stroke-width="4" />
  ${renderTextLines(speechLines, 895, 336, 23, 31, "speech-text", "middle")}

  ${renderPanel(40, 560, 660, 500, "1 運作流程", "blue", renderProcess(card.process))}
  ${renderPanel(720, 560, 440, 500, "2 核心能力", "green", renderChecklist(card.capabilities, 765, 680, 320, "#20a468", 14))}

  ${renderPanel(
    40,
    1080,
    540,
    340,
    "3 重點觀念",
    "orange",
    `<circle cx="110" cy="1218" r="38" fill="#fff3cd" stroke="#f59e0b" stroke-width="4" /><path d="M95 1218 L106 1229 L126 1205" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
     ${renderTextLines(keyPhraseLines, 158, 1205, 37, 48, "key-text")}
     ${renderTextLines(keyNoteLines, 82, 1334, 23, 31, "key-note")}`,
  )}
  ${renderPanel(600, 1080, 560, 340, "4 生活中的例子", "blue", renderExamples(card.examples))}

  ${renderPanel(40, 1440, 540, 400, "5 這堂課你會學到", "purple", renderChecklist(card.learnings, 82, 1558, 430, "#7c4dcc", 21))}
  ${renderPanel(600, 1440, 560, 400, "6 常用工具", "teal", `${renderTools(card.tools)}<line x1="880" y1="1535" x2="880" y2="1810" stroke="#99f6e4" stroke-width="2" stroke-dasharray="6 6" /><line x1="630" y1="1663" x2="1130" y2="1663" stroke="#99f6e4" stroke-width="2" stroke-dasharray="6 6" />`)}

  <rect x="40" y="1860" width="1120" height="235" rx="40" fill="url(#footer)" />
  <path d="M65 1887 H1135 V2068 H65 Z" fill="none" stroke="#60a5fa" stroke-width="3" stroke-dasharray="11 9" opacity="0.7" />
  <circle cx="104" cy="1964" r="48" fill="#fbbf24" />
  <path d="M104 1928 L114 1952 L140 1954 L120 1971 L126 1997 L104 1983 L82 1997 L88 1971 L68 1954 L94 1952 Z" fill="#ffffff" />
  ${renderTextLines(footerFormulaLines, 176, 1934, 36, 47, "footer-formula")}
  ${renderTextLines(footerNoteLines, 176, 2040, 25, 34, "footer-note")}
  ${renderRobot()}
</svg>`;
}
