# Course Asset Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 14 門課程的 Google Drive 圖卡、簡報、NotebookLM 提示語與 64 秒影片稿接入 AI-Learning-Portfolio 課程 Registry 與課程頁。

**Architecture:** 使用獨立 `course_asset_registry/asset_registry.json` 以 course slug 對應 Drive 資產，`course-repository.ts` 在讀取課程時合併資產資料。課程頁透過共用 `CourseAssetsPanel` 呈現四個入口，避免把 Drive URL 重複散落到 14 份課程內容檔。

**Tech Stack:** Next.js 14、React 18、TypeScript、Node.js、Google Drive

## Global Constraints

- 專案名稱固定為 `AI-Learning-Portfolio`。
- 14 個 course slug 不得更名。
- 每門課必須有 summary card、課程簡報、NotebookLM 完整提示語與 64 秒影片設計稿。
- GitHub Registry 與 Drive 必須以 course slug 對應。
- 頁面入口名稱固定為重點圖卡、課程簡報、NotebookLM 提示語、64 秒影片設計。

---

### Task 1: Asset Registry

**Files:**
- Create: `course_asset_registry/asset_registry.json`
- Test: `scripts/run_course_asset_tests.mjs`

- [x] Write a failing test for 14 slugs and 56 unique assets.
- [x] Run `node scripts/run_course_asset_tests.mjs` and confirm it fails because the registry is absent.
- [x] Add the Drive folder and four core asset records for every course.
- [x] Run the asset test and confirm the Registry checks pass.

### Task 2: Course Type and Repository Merge

**Files:**
- Modify: `src/types/course.ts`
- Modify: `src/lib/course-repository.ts`

- [x] Define `CourseAssetLink` and `CourseAssets`.
- [x] Add optional `assets` to `Course`.
- [x] Load `course_asset_registry/asset_registry.json` and merge by slug.
- [x] Verify the source-level contract in the asset test.

### Task 3: Course Page Asset Entrances

**Files:**
- Create: `src/components/course-assets-panel.tsx`
- Modify: `src/app/courses/[slug]/page.tsx`

- [x] Add four asset cards and a Drive folder link.
- [x] Render the shared panel below the course header.
- [x] Verify required labels and rendering through the asset test.

### Task 4: Project Test Integration

**Files:**
- Modify: `package.json`

- [x] Add `node scripts/run_course_asset_tests.mjs` to the default test command.
- [ ] Run the full repository test, lint, typecheck and build in GitHub Actions.
