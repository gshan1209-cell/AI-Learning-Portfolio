# AI Learning Portfolio｜Agent 開發規範

## 中文摘要

- 本專案將跨 GitHub Repository 的課程作業轉製為教學型作品集。
- 技術架構以 `gshan1209-cell/scrape` 為模板。
- 原始 Repo 不搬移 Git 歷史；中央平台保存來源連結與轉製內容。
- 現階段優先完成架構與內容，正式測試與 CI 暫緩。

## 1. 固定技術架構

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS
- Route Handlers
- JSON chunks：`course_chunks/`、`course_chunks_archive/`
- Prisma + PostgreSQL
- Node.js／Python 匯入腳本

不得在未更新規格與開發紀錄的情況下改成其他大型框架。

## 2. 課程六段式模板

每個發布課程至少包含：

1. 這個主題能做什麼
2. 白話原理與生活比喻
3. 互動 Demo 或可操作展示
4. 程式架構與關鍵程式碼
5. 小測驗
6. 延伸挑戰

## 3. 跨 Repo 整合原則

- `source.repository` 必須保存 `owner/repo`。
- `source.repositoryUrl` 必須連回原始 Repository。
- 有獨立部署時保存 `demoUrl`。
- 不直接複製大型模型、資料集、敏感設定與金鑰。
- 原始程式若要內嵌，需建立 Adapter，不得直接把不同框架混入 Next.js runtime。

## 4. 資料規則

- 新課程先寫入新的 `course_chunks/course_XXXX.json`。
- 已處理舊檔可移至 `course_chunks_archive/`。
- 未來匯入 DB 後移至 `imported_chunks/`，原檔不可直接刪除。
- API 必須支援搜尋、分類、狀態與分頁。

## 5. 當前任務

### ALP-P0-001｜平台骨架

- [x] Next.js／Tailwind 基礎
- [x] 首頁與課程目錄
- [x] Course Registry 型別
- [x] JSON chunk Repository
- [x] 課程列表 API
- [x] 動態課程頁
- [x] Prisma Schema 預留

### ALP-P0-002｜首批示範課

- [x] 線性迴歸
- [x] SVM Kernel Trick
- [x] CWA OpenData API

### 下一階段

- [ ] Demo Adapter 規格與元件
- [ ] GitHub Repo Metadata 同步腳本
- [ ] 課程 chunk 匯入 PostgreSQL
- [ ] 管理後台草稿流程
- [ ] 學習進度 localStorage／DB Adapter

## 6. 驗證策略

依專案決策，本階段跳過正式測試、CI 與部署驗證。Agent 完成任務後仍需進行基本結構檢查，並在 `DEVELOPMENT_RECORD.md` 誠實記錄尚未驗證項目。
