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

主要頁面：

```text
/            首頁
/courses     教學課程目錄
/sources     跨 Repository 來源中心
```

## 目前內容

第一批示範課程：

1. 用一條線看懂資料趨勢｜線性迴歸
2. 把平面摺成立體｜SVM Kernel Trick
3. 第一次呼叫政府資料 API｜CWA OpenData

其餘課程已登錄於 Course Registry，後續逐一轉製。

## Demo Adapter

作品展示設定獨立存放於：

```text
course_demo_registry/demo_registry.json
```

支援五種展示模式：

- `external`：新分頁開啟原始作品
- `iframe`：嵌入 Streamlit、Vercel 或 GitHub Pages
- `video`：播放 Manim 或操作錄影
- `snapshot`：展示舊作品或生成結果快照
- `native`：在本站重製互動元件

外部服務失效時，必須保留 GitHub Repository 或原始 Demo 備援連結。

## 課程資料策略

課程資料存放於：

```text
course_chunks/
course_chunks_archive/
```

前端不直接匯入單一大型 JSON，而由伺服器端 Repository 與 `/api/courses` 統一讀取、搜尋及分頁。未來可使用匯入腳本寫入 PostgreSQL，原始 chunk 保留作為可追溯來源。

## GitHub 來源 Registry

來源 Repository 快照存放於：

```text
repository_registry/repositories.json
```

更新 GitHub 基本 Metadata：

```bash
npm run repositories:sync
```

公開 Repository 可不設定 Token；若遇到 GitHub API 額度限制，可在本機 `.env` 設定 `GITHUB_TOKEN`。真實 Token 不得提交到 Git。

查詢 API：

```text
GET /api/repositories
GET /api/repositories?q=streamlit
GET /api/repositories?status=published
```

## 開發狀態

目前已完成：

- P0 平台基礎架構
- P1 Demo Adapter
- P1 GitHub Metadata Registry 與同步腳本

依專案決策，正式測試與 CI 驗證暫緩，優先完成課程轉製流程。
