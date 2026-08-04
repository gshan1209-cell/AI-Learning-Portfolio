import fs from "node:fs";
import path from "node:path";
import { GET as summaryImageGet } from "../src/app/api/courses/[slug]/summary-image/route";
import {
  COURSE_SUMMARY_CARD_CONTENT,
  getCourseSummaryCardContent,
} from "../src/lib/course-summary-card-content";
import { getAllCourses } from "../src/lib/course-repository";
import {
  escapeSvgText,
  getCourseSummaryHighlights,
  renderCourseSummarySvg,
  wrapSvgText,
} from "../src/lib/course-summary-image";
import type { Course } from "../src/types/course";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (!condition) {
    failed += 1;
    throw new Error(`FAIL: ${message}`);
  }
  passed += 1;
  console.log(`PASS: ${message}`);
}

function createCourse(overrides: Partial<Course> = {}): Course {
  return {
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
    source: {
      repository: "example/test",
      repositoryUrl: "https://github.com/example/test",
    },
    sections: [],
    updatedAt: "2026-08-04",
    ...overrides,
  };
}

async function runCourseSummaryTests(): Promise<void> {
  console.log("=== Course Summary Image Test Suite ===\n");

  assert(
    escapeSvgText("A&B <C> \"D'") === "A&amp;B &lt;C&gt; &quot;D&apos;",
    "escapes XML text",
  );
  assert(
    wrapSvgText("1234567890", 4).join("|") === "1234|5678|90",
    "wraps long text",
  );

  const course = createCourse();
  assert(
    getCourseSummaryHighlights(course).join("|") ===
      "理解摘要圖用途|看懂課程重點",
    "uses learning objectives first",
  );

  assert(
    getCourseSummaryHighlights(
      createCourse({
        learningObjectives: [],
        sections: [{ id: "one", title: "第一重點", summary: "內容" }],
      }),
    )[0] === "第一重點",
    "falls back to section titles",
  );

  assert(
    getCourseSummaryHighlights(
      createCourse({ learningObjectives: [], sections: [] }),
    )[0] === "Next.js",
    "falls back to tags",
  );

  const registeredCourses = getAllCourses();
  assert(registeredCourses.length === 14, "course registry contains 14 courses");
  assert(
    Object.keys(COURSE_SUMMARY_CARD_CONTENT).length === 14,
    "summary card registry contains 14 dedicated cards",
  );
  assert(
    registeredCourses.every((registeredCourse) =>
      Boolean(getCourseSummaryCardContent(registeredCourse)),
    ),
    "every registered course has dedicated summary card content",
  );

  const linearCourse = registeredCourses.find(
    (registeredCourse) =>
      registeredCourse.slug === "linear-regression-for-beginners",
  );
  assert(Boolean(linearCourse), "linear regression course exists");
  const linearCard = getCourseSummaryCardContent(linearCourse!);
  assert(
    linearCard.title === "什麼是線性迴歸？",
    "linear regression card has its dedicated title",
  );
  assert(linearCard.process.length === 3, "card has three process steps");
  assert(linearCard.capabilities.length === 3, "card has three capabilities");
  assert(linearCard.examples.length === 3, "card has three examples");
  assert(linearCard.learnings.length === 4, "card has four learning points");
  assert(linearCard.tools.length === 4, "card has four tools");

  const svg = renderCourseSummarySvg(linearCourse!);
  assert(
    svg.includes('viewBox="0 0 1200 2133"'),
    "uses a 1200x2133 vertical viewBox",
  );
  assert(svg.includes("什麼是線性迴歸？"), "contains the dedicated card title");
  assert(svg.includes("1 運作流程"), "contains the process panel");
  assert(svg.includes("2 核心能力"), "contains the capability panel");
  assert(svg.includes("3 重點觀念"), "contains the key concept panel");
  assert(svg.includes("4 生活中的例子"), "contains the examples panel");
  assert(svg.includes("5 這堂課你會學到"), "contains the learning panel");
  assert(svg.includes("6 常用工具"), "contains the tools panel");
  assert(svg.includes("AI 助教"), "contains the shared AI tutor mascot");
  assert(!svg.includes("drive.google.com"), "does not depend on Google Drive URLs");

  const fallbackSvg = renderCourseSummarySvg(course);
  assert(
    fallbackSvg.includes("AI &amp; 資料 &lt;入門&gt;"),
    "fallback card contains an escaped course title",
  );
  assert(
    fallbackSvg.includes("理解摘要圖用途"),
    "fallback card contains learning highlights",
  );

  const routeResponse = summaryImageGet(
    new Request(
      "http://localhost/api/courses/linear-regression-for-beginners/summary-image",
    ),
    { params: { slug: "linear-regression-for-beginners" } },
  );
  assert(routeResponse.status === 200, "summary image route returns 200");
  assert(
    routeResponse.headers.get("content-type")?.includes("image/svg+xml") ===
      true,
    "summary image route returns SVG",
  );
  assert(
    (await routeResponse.text()).includes("什麼是線性迴歸？"),
    "summary image route renders dedicated infographic content",
  );

  const missingRouteResponse = summaryImageGet(
    new Request("http://localhost/api/courses/missing/summary-image"),
    { params: { slug: "missing" } },
  );
  assert(
    missingRouteResponse.status === 404,
    "summary image route returns 404 for a missing course",
  );

  const courseCardPath = path.join(
    process.cwd(),
    "src/components/course-card.tsx",
  );
  const courseCardSource = fs.readFileSync(courseCardPath, "utf8");
  assert(
    courseCardSource.includes("重點摘要"),
    "course card shows the summary label",
  );
  assert(
    courseCardSource.includes("/courses/${course.slug}/summary"),
    "course card links to the course summary page",
  );

  const summaryPagePath = path.join(
    process.cwd(),
    "src/app/courses/[slug]/summary/page.tsx",
  );
  assert(fs.existsSync(summaryPagePath), "course summary page exists");
  const summaryPageSource = fs.readFileSync(summaryPagePath, "utf8");
  assert(
    summaryPageSource.includes("/summary-image"),
    "course summary page displays the SVG image route",
  );

  console.log(`\n=== Test Summary: ${passed} Passed, ${failed} Failed ===`);
}

runCourseSummaryTests().catch((error) => {
  console.error(error);
  console.error(`\n=== Test Summary: ${passed} Passed, ${failed} Failed ===`);
  process.exit(1);
});
