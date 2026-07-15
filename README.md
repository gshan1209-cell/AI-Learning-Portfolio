# AI Learning Portfolio｜AI 學習作品集

將分散於不同 GitHub Repository 的課程作業，重新設計成新手友善、可操作、可持續擴充的教學型作品集。

## 核心定位

- 個人 AI／資料科學作品集
- 新手小白也能理解的教學網站
- 跨 Repository 課程整合平台
- 原作業 Repo 保留為原始碼、版本歷史與獨立 Demo 證據

## 技術架構

本專案採用 `gshan1209-cell/scrape` 的架構理念：

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS
- Route Handlers API
- JSON chunk 分批資料來源
- Prisma + PostgreSQL 預留
- Node.js／Python 資料匯入腳本預留

## 快速開始

```bash
npm install
npm run dev
```

開啟 `http://localhost:3000`。

## 目前內容

第一批示範課程：

1. 用一條線看懂資料趨勢｜線性迴歸
2. 把平面摺成立體｜SVM Kernel Trick
3. 第一次呼叫政府資料 API｜CWA OpenData

其餘課程已登錄於 Course Registry，後續逐一轉製。

## 資料策略

課程資料存放於：

```text
course_chunks/
course_chunks_archive/
```

前端不直接匯入單一大型 JSON，而由伺服器端 Repository 與 `/api/courses` 統一讀取、搜尋及分頁。未來可使用匯入腳本寫入 PostgreSQL，原始 chunk 保留作為可追溯來源。

## 開發狀態

目前為平台基礎架構階段。依專案決策，正式測試與 CI 驗證暫緩，優先完成可運作骨架與課程轉製流程。
