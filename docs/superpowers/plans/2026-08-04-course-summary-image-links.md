# Course Summary Image Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 「重點摘要」 link to every course card and show one dynamically generated SVG summary image for each course.

**Architecture:** Keep course content in the existing Course Registry. A pure helper converts one `Course` into escaped, wrapped SVG markup; a route handler serves that SVG; a dedicated summary page displays it; and the course card links to that page.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5, Tailwind CSS, SVG, existing JSON Course Registry.

## Global Constraints

- Summary image size is exactly 1200 × 1600.
- No external image service or new npm dependency.
- Planned courses can show summaries, but their existing full-course availability rules remain unchanged.
- Invalid course slugs return 404.
- Learning points fall back from `learningObjectives` to section titles, then tags.
- All SVG text is XML-escaped and wrapped before rendering.

---

### Task 1: Pure summary image generator

**Files:**
- Create: `src/lib/course-summary-image.ts`
- Modify: `scripts/run_tests.ts`

**Interfaces:**
- Consumes: `Course` from `src/types/course.ts`.
- Produces: `escapeSvgText(value: string): string`, `wrapSvgText(value: string, maxUnits: number): string[]`, `getCourseSummaryHighlights(course: Course): string[]`, `renderCourseSummarySvg(course: Course): string`.

- [ ] **Step 1: Add failing imports and assertions to `scripts/run_tests.ts`**

Add imports:

```ts
import {
  escapeSvgText,
  getCourseSummaryHighlights,
  renderCourseSummarySvg,
  wrapSvgText,
} from "../src/lib/course-summary-image";
import type { Course } from "../src/types/course";
```

Inside `runAllTests()`, add:

```ts
console.log("\n--- 7. Course Summary SVG ---");
const summaryCourse: Course = {
  id: "course-summary-test",
  slug: "summary-test",
  title: "AI & 資料 <入門>",
  subtitle: "用圖看懂課程",
  summary: "把複雜內容整理成一張可以快速閱讀的重點摘要圖。",
  category: "測試課程",
  level: "beginner",
  durationMinutes: 30,
  status: "published",
  tags: ["Next.js", "SVG", "AI"],
  learningObjectives: ["理解摘要圖用途", "看懂課程重點"],
  source: { repository: "example/test", repositoryUrl: "https://github.com/example/test" },
  sections: [],
  updatedAt: "2026-08-04",
};

assert(escapeSvgText("A&B <C> \"D\"") === "A&amp;B &lt;C&gt; &quot;D&quot;", "Summary SVG escapes XML text");
assert(wrapSvgText("1234567890", 4).join("|") === "1234|5678|90", "Summary SVG wraps long text");
assert(getCourseSummaryHighlights(summaryCourse).length === 2, "Summary SVG uses learning objectives first");

const sectionFallback = getCourseSummaryHighlights({
  ...summaryCourse,
  learningObjectives: [],
  sections: [{ id: "one", title: "第一重點", summary: "內容" }],
});
assert(sectionFallback[0] === "第一重點", "Summary SVG falls back to section titles");

const tagFallback = getCourseSummaryHighlights({
  ...summaryCourse,
  learningObjectives: [],
  sections: [],
});
assert(tagFallback[0] === "Next.js", "Summary SVG falls back to tags");

const summarySvg = renderCourseSummarySvg(summaryCourse);
assert(summarySvg.includes('viewBox="0 0 1200 1600"'), "Summary SVG uses 1200x1600 viewBox");
assert(summarySvg.includes("AI &amp; 資料 &lt;入門&gt;"), "Summary SVG contains escaped course title");
assert(summarySvg.includes("理解摘要圖用途"), "Summary SVG contains learning highlights");
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
npm run test
```

Expected: FAIL because `src/lib/course-summary-image.ts` does not exist.

- [ ] **Step 3: Create `src/lib/course-summary-image.ts`**

Implement:

```ts
import type { Course } from "@/types/course";

const SVG_WIDTH = 1200;
const SVG_HEIGHT = 1600;

export function escapeSvgText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function characterUnits(character: string): number {
  return /[\u0000-\u00ff]/.test(character) ? 0.55 : 1;
}

export function wrapSvgText(value: string, maxUnits: number): string[] {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const lines: string[] = [];
  let current = "";
  let units = 0;

  for (const character of normalized) {
    const nextUnits = characterUnits(character);
    if (current && units + nextUnits > maxUnits) {
      lines.push(current.trim());
      current = "";
      units = 0;
    }
    current += character;
    units += nextUnits;
  }

  if (current.trim()) lines.push(current.trim());
  return lines;
}

export function getCourseSummaryHighlights(course: Course): string[] {
  if (course.learningObjectives.length > 0) return course.learningObjectives.slice(0, 4);
  if (course.sections.length > 0) return course.sections.slice(0, 4).map((section) => section.title);
  return course.tags.slice(0, 4);
}

function textLines(lines: string[], x: number, startY: number, fontSize: number, lineHeight: number, className: string) {
  return lines
    .map((line, index) => `<text x="${x}" y="${startY + index * lineHeight}" class="${className}" font-size="${fontSize}">${escapeSvgText(line)}</text>`)
    .join("\n");
}

export function renderCourseSummarySvg(course: Course): string {
  const titleLines = wrapSvgText(course.title, 16).slice(0, 3);
  const subtitleLines = wrapSvgText(course.subtitle, 29).slice(0, 2);
  const summaryLines = wrapSvgText(course.summary, 35).slice(0, 5);
  const highlights = getCourseSummaryHighlights(course);
  const tags = course.tags.slice(0, 5).join("  ·  ");

  const highlightMarkup = highlights
    .map((item, index) => {
      const y = 960 + index * 112;
      const lines = wrapSvgText(item, 31).slice(0, 2);
      return `<circle cx="112" cy="${y - 14}" r="15" fill="#10b981" />\n${textLines(lines, 150, y, 34, 44, "body")}`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" role="img" aria-labelledby="title description">
  <title id="title">${escapeSvgText(course.title)}重點摘要</title>
  <desc id="description">${escapeSvgText(course.summary)}</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ecfdf5" />
      <stop offset="55%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#eff6ff" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>
    <style>
      .eyebrow { font-family: system-ui, sans-serif; font-weight: 800; fill: #047857; letter-spacing: 3px; }
      .title { font-family: system-ui, sans-serif; font-weight: 900; fill: #0f172a; }
      .subtitle { font-family: system-ui, sans-serif; font-weight: 750; fill: #059669; }
      .body { font-family: system-ui, sans-serif; font-weight: 550; fill: #475569; }
      .label { font-family: system-ui, sans-serif; font-weight: 850; fill: #0f172a; }
    </style>
  </defs>
  <rect width="1200" height="1600" fill="url(#background)" />
  <circle cx="1040" cy="155" r="210" fill="#a7f3d0" opacity="0.55" />
  <circle cx="105" cy="1450" r="250" fill="#bfdbfe" opacity="0.42" />
  <rect x="70" y="70" width="1060" height="1460" rx="64" fill="#ffffff" opacity="0.96" filter="url(#shadow)" />
  <text x="110" y="150" class="eyebrow" font-size="28">AI LEARNING PORTFOLIO · 重點摘要</text>
  <rect x="110" y="190" width="${Math.min(420, 140 + course.category.length * 34)}" height="66" rx="33" fill="#d1fae5" />
  <text x="145" y="234" class="eyebrow" font-size="27">${escapeSvgText(course.category)}</text>
  ${textLines(titleLines, 110, 370, 72, 88, "title")}
  ${textLines(subtitleLines, 110, 650, 36, 50, "subtitle")}
  <line x1="110" y1="770" x2="1090" y2="770" stroke="#e2e8f0" stroke-width="3" />
  ${textLines(summaryLines, 110, 840, 34, 50, "body")}
  <text x="110" y="900" class="label" font-size="34">這門課的四個重點</text>
  ${highlightMarkup}
  <rect x="110" y="1400" width="980" height="2" fill="#e2e8f0" />
  <text x="110" y="1460" class="body" font-size="27">${escapeSvgText(tags)}</text>
  <text x="110" y="1510" class="body" font-size="25">難度：${escapeSvgText(course.level)}　｜　預估時間：約 ${course.durationMinutes} 分鐘</text>
</svg>`;
}
```

- [ ] **Step 4: Run tests and verify they pass**

Run:

```bash
npm run test
```

Expected: all existing tests and the new summary SVG tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/course-summary-image.ts scripts/run_tests.ts
git commit -m "feat: add course summary SVG generator"
```

---

### Task 2: Summary image API and page

**Files:**
- Create: `src/app/api/courses/[slug]/summary-image/route.ts`
- Create: `src/app/courses/[slug]/summary/page.tsx`

**Interfaces:**
- Consumes: `getCourseBySlug(slug)` and `renderCourseSummarySvg(course)`.
- Produces: `GET(_: Request, context: { params: { slug: string } }): Response` and the `/courses/[slug]/summary` page.

- [ ] **Step 1: Add route-level assertions to `scripts/run_tests.ts`**

Import:

```ts
import { GET as summaryImageGet } from "../src/app/api/courses/[slug]/summary-image/route";
```

Add assertions after the pure SVG assertions:

```ts
const summaryImageResponse = await summaryImageGet(
  new Request("http://localhost/api/courses/linear-regression-for-beginners/summary-image"),
  { params: { slug: "linear-regression-for-beginners" } },
);
assert(summaryImageResponse.status === 200, "Course summary image API returns 200");
assert(summaryImageResponse.headers.get("content-type")?.includes("image/svg+xml") === true, "Course summary image API returns SVG");
assert((await summaryImageResponse.text()).includes("用一條線看懂資料趨勢"), "Course summary image API renders course content");

const missingSummaryResponse = await summaryImageGet(
  new Request("http://localhost/api/courses/missing/summary-image"),
  { params: { slug: "missing" } },
);
assert(missingSummaryResponse.status === 404, "Course summary image API returns 404 for missing course");
```

- [ ] **Step 2: Run tests and verify route import fails**

Run:

```bash
npm run test
```

Expected: FAIL because the route does not exist.

- [ ] **Step 3: Create the SVG route handler**

Create `src/app/api/courses/[slug]/summary-image/route.ts`:

```ts
import { getCourseBySlug } from "@/lib/course-repository";
import { renderCourseSummarySvg } from "@/lib/course-summary-image";

export const dynamic = "force-static";

export function GET(_: Request, { params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course) {
    return new Response("Course not found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(renderCourseSummarySvg(course), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Disposition": `inline; filename="${course.slug}-summary.svg"`,
    },
  });
}
```

- [ ] **Step 4: Create the summary page**

Create `src/app/courses/[slug]/summary/page.tsx`:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/lib/course-repository";

export function generateStaticParams() {
  return getAllCourses().map((course) => ({ slug: course.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  return { title: course ? `${course.title}｜重點摘要` : "課程重點摘要" };
}

export default function CourseSummaryPage({ params }: { params: { slug: string } }) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();

  const published = course.status === "published";
  const imageUrl = `/api/courses/${encodeURIComponent(course.slug)}/summary-image`;

  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/courses" className="text-sm font-bold text-brand hover:underline">← 回到課程目錄</Link>
        {published ? (
          <Link href={`/courses/${course.slug}`} className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-white">進入完整課程</Link>
        ) : (
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">完整課程製作中</span>
        )}
      </div>

      <header className="mt-8 text-center">
        <p className="text-sm font-black tracking-[0.24em] text-brand">COURSE SUMMARY</p>
        <h1 className="mt-3 text-3xl font-black text-ink md:text-5xl">{course.title}｜重點摘要</h1>
        <p className="mx-auto mt-4 max-w-3xl leading-8 text-slate-600">{course.summary}</p>
      </header>

      <figure className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
        <img src={imageUrl} alt={`${course.title}重點摘要圖`} className="h-auto w-full" />
        <figcaption className="border-t border-slate-100 px-6 py-4 text-center text-sm text-slate-500">
          摘要內容由課程 Registry 自動整理，完整細節請進入課程頁查看。
        </figcaption>
      </figure>
    </main>
  );
}
```

- [ ] **Step 5: Run tests and type checks**

Run:

```bash
npm run test
npx tsc --noEmit
```

Expected: PASS with no TypeScript error.

- [ ] **Step 6: Commit**

```bash
git add scripts/run_tests.ts src/app/api/courses/[slug]/summary-image/route.ts src/app/courses/[slug]/summary/page.tsx
git commit -m "feat: add course summary image pages"
```

---

### Task 3: Course card summary link and final verification

**Files:**
- Modify: `src/components/course-card.tsx`

**Interfaces:**
- Consumes: existing `course.slug`, `course.status`, and Next.js `Link`.
- Produces: visible 「重點摘要」 link for every course card.

- [ ] **Step 1: Update the card footer**

Replace the existing footer block with:

```tsx
<div className="mt-5 border-t border-slate-100 pt-4">
  <div className="flex items-center justify-between gap-3 text-sm font-medium">
    <span className="text-xs text-slate-400">約 {course.durationMinutes} 分鐘</span>
    <Link
      href={`/courses/${course.slug}/summary`}
      className="inline-flex items-center gap-1 rounded-full border border-brand/20 px-3 py-1.5 text-xs font-bold text-brand transition hover:border-brand hover:bg-emerald-50"
      aria-label={`查看${course.title}重點摘要`}
    >
      重點摘要 <span aria-hidden="true">▣</span>
    </Link>
  </div>

  <div className="mt-3 flex justify-end">
    {enabled ? (
      <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-1 font-bold text-brand hover:underline">
        開始學習 <span>→</span>
      </Link>
    ) : (
      <span className="font-semibold text-slate-400">即將推出</span>
    )}
  </div>
</div>
```

- [ ] **Step 2: Run complete verification**

Run:

```bash
npm run prisma:generate
npm run test
npm run lint
npx tsc --noEmit
npm run build
```

Expected:

- Prisma client generation succeeds.
- Existing and new tests pass.
- ESLint reports zero errors.
- TypeScript reports zero errors.
- Next.js builds the summary page and SVG API route successfully.

- [ ] **Step 3: Inspect key routes locally**

Run:

```bash
npm run dev
```

Verify:

- `/courses` shows 「重點摘要」 on every card.
- `/courses/linear-regression-for-beginners/summary` shows the vertical SVG image.
- `/api/courses/linear-regression-for-beginners/summary-image` opens as an SVG.
- A planned course summary opens, while its full-course button remains unavailable.
- `/courses/missing/summary` returns the Next.js 404 page.

- [ ] **Step 4: Commit**

```bash
git add src/components/course-card.tsx
git commit -m "feat: link course cards to summary images"
```
