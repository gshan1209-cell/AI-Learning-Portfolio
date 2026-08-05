import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8")) as T;
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

type StoryData = {
  title: string;
  sourceBlobSha: string;
  sourceRevision: string;
  rightsStatus: string;
  slides: Array<{
    id: string;
    imageUrl: string;
    alt: string;
    text: string;
    duration: number;
    transition: string;
  }>;
};

type DemoRegistry = Record<string, {
  mode: string;
  url?: string;
  description?: string;
}>;

function testNativeVisualStory(): void {
  const story = readJson<StoryData>("src/data/ai-visual-story.json");
  const registry = readJson<DemoRegistry>("course_demo_registry/demo_registry.json");
  const player = readText("src/components/visual-story-player.tsx");
  const route = readText("src/app/learning-labs/[slug]/page.tsx");

  assert.equal(story.title, "小王子與銀色之花");
  assert.equal(story.slides.length, 12);
  assert.equal(new Set(story.slides.map((slide) => slide.id)).size, 12);
  assert.match(story.sourceBlobSha, /^[0-9a-f]{40}$/);
  assert.match(story.sourceRevision, /^[0-9a-f]{40}$/);
  assert.ok(story.rightsStatus.length > 20);

  for (const slide of story.slides) {
    assert.ok(slide.alt.length > 8, `${slide.id} must have meaningful alt text`);
    assert.ok(slide.text.includes("幕："), `${slide.id} must preserve the source scene heading`);
    assert.ok(slide.duration > 0, `${slide.id} duration must be positive`);
    assert.ok(["fade", "slide-in", "zoom-in"].includes(slide.transition));
    assert.ok(slide.imageUrl.includes(story.sourceRevision), `${slide.id} image must pin the source revision`);
  }

  assert.equal(registry["ai-visual-story"].mode, "native");
  assert.equal(registry["ai-visual-story"].url, "/learning-labs/ai-visual-story");
  assert.ok(!JSON.stringify(registry["ai-visual-story"]).includes("iframe"));
  assert.ok(route.includes('"ai-visual-story"'));
  assert.ok(route.includes("<VisualStoryPlayer />"));

  for (const contract of [
    'aria-label="上一幕"',
    'aria-label="下一幕"',
    "prefers-reduced-motion",
    'event.key === "ArrowLeft"',
    'event.key === "ArrowRight"',
    "sourceBlobSha",
  ]) {
    assert.ok(player.includes(contract), `visual story player missing contract: ${contract}`);
  }
}

function main(): void {
  testNativeVisualStory();
  console.log("Runtime contract tests passed: native visual story");
}

main();
