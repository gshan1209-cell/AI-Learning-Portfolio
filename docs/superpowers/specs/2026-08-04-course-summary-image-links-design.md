# 課程重點摘要圖片連結設計

日期：2026-08-04

## 目標

在每張課程卡片加入「重點摘要」入口。點擊後進入該課程的專屬摘要頁，頁面顯示一張由課程 Registry 資料動態產生的 SVG 重點摘要圖片。

## 使用者流程

1. 使用者在 `/courses` 瀏覽課程卡片。
2. 卡片底部同時顯示「重點摘要」與原有主要操作。
3. 點擊「重點摘要」後前往 `/courses/[slug]/summary`。
4. 摘要頁顯示該課程的單張重點摘要圖，並提供返回課程目錄與進入完整課程的操作。

## 架構

### 卡片入口

修改 `src/components/course-card.tsx`，讓所有有效課程都能顯示摘要連結。主要學習按鈕的既有 published/planned 行為維持不變。

### 摘要頁

新增 `src/app/courses/[slug]/summary/page.tsx`：

- 以 `getCourseBySlug` 取得課程資料。
- 不限制 published 狀態，因此 planned 課程也能先查看摘要。
- 使用 `<img>` 顯示 SVG 摘要圖。
- 顯示返回目錄、進入完整課程或「課程製作中」狀態。

### SVG 圖片 API

新增 `src/app/api/courses/[slug]/summary-image/route.ts`：

- 回傳 `image/svg+xml`。
- 圖片尺寸固定為 1200 × 1600，適合手機直式閱讀與社群分享。
- 顯示課程分類、標題、副標、摘要、學習重點、技術標籤與預估時間。
- 學習重點優先使用 `learningObjectives`；資料不足時依序退回 section 標題與 tags。
- 對文字做 XML escape 與固定寬度換行，避免特殊字元破壞 SVG。
- 找不到課程時回傳 404。

### 共用摘要工具

新增 `src/lib/course-summary-image.ts`，集中處理：

- XML 字元跳脫。
- 中英文混合文字換行。
- 摘要重點 fallback 規則。
- SVG 字串產生。

這些函式保持純函式，方便單元測試。

## 錯誤與相容性

- 無效 slug：摘要頁使用 `notFound()`，圖片 API 回傳 404。
- 課程資料缺少 learning objectives：改用 sections 或 tags，不顯示空白區塊。
- SVG 不載入：摘要頁仍顯示課程標題、文字摘要與導覽操作。
- 不新增外部圖片服務或第三方套件，Vercel Build 不依賴網路。

## 測試

- 驗證 XML escape。
- 驗證長文字能分行且不遺失內容。
- 驗證 learning objectives、sections、tags 三層 fallback。
- 驗證 SVG 包含標題、摘要、標籤與正確 viewBox。
- 執行既有 `npm run test`、TypeScript 檢查與 Build。

## 非本次範圍

- 不提供摘要圖編輯後台。
- 不建立圖片下載追蹤或分享統計。
- 不改動既有課程內容與 Demo。
- 不將摘要圖改成外部生成式 AI 圖片，確保所有課程都能立即產生一致版本。
