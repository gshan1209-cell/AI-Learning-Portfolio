import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { getAllCourses, getCourseBySlug } from "../src/lib/course-repository.ts";
import { GET as getCourseRoute } from "../src/app/api/courses/[slug]/route.ts";
import { GET as listCoursesRoute } from "../src/app/api/courses/route.ts";

const draftSlug = "__synthetic-draft-visibility-check__";
const draftPath = path.join(process.cwd(), "course_chunks", `${draftSlug}.json`);
const samplePublished = getAllCourses()[0];
assert.ok(samplePublished, "Expected at least one non-draft course fixture");

fs.writeFileSync(
  draftPath,
  JSON.stringify(
    {
      ...samplePublished,
      id: draftSlug,
      slug: draftSlug,
      title: "Synthetic Draft Course",
      status: "draft",
    },
    null,
    2,
  ),
  "utf8",
);

try {
  assert.equal(getCourseBySlug(draftSlug), undefined, "getCourseBySlug must hide draft courses");
  assert.equal(
    getAllCourses({ status: "draft" }).some((c) => c.slug === draftSlug),
    false,
    "getAllCourses({ status: 'draft' }) must not leak draft courses publicly",
  );
  assert.equal(
    getAllCourses({ includeDraft: true, status: "draft" }).some((c) => c.slug === draftSlug),
    true,
    "includeDraft: true should still allow explicit internal inspection",
  );

  const detailRes = await getCourseRoute(
    new NextRequest(`http://localhost/api/courses/${draftSlug}`),
    { params: { slug: draftSlug } },
  );
  assert.equal(detailRes.status, 404, "GET /api/courses/[slug] must return 404 for draft courses");

  const listRes = await listCoursesRoute(
    new NextRequest("http://localhost/api/courses?status=draft"),
  );
  assert.equal(listRes.status, 200);
  const listPayload = await listRes.json();
  assert.equal(listPayload.items.length, 0, "GET /api/courses?status=draft must return no draft items");

  console.log("5 draft visibility assertions PASS");
} finally {
  if (fs.existsSync(draftPath)) {
    fs.unlinkSync(draftPath);
  }
}
