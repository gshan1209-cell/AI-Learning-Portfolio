# AI Learning Portfolio｜開發紀錄

## 中文摘要

- 2026-07-15 建立全新獨立 Repository。
- 技術架構採 `gshan1209-cell/scrape` 的 Next.js + JSON chunks + Prisma 模式。
- 完成平台基礎骨架、三門示範課程與五模式 Demo Adapter。
- 完成 14 個來源 Repository 的 Metadata Registry、查詢 API 與同步腳本。
- 線性迴歸已具備站內互動 Playground。
- 依使用者決策，正式測試與驗證先跳過。

## 目前狀態

**階段：P1 平台展示與來源同步基礎已完成，下一步建立 Course Import／Transform Pipeline。**

## 已完成

- [x] 全新 `AI-Learning-Portfolio` Repository
- [x] Next.js 14 App Router
- [x] Tailwind CSS 與基本 RWD
- [x] 首頁與作品集定位
- [x] 課程目錄、搜尋與分類
- [x] 動態課程頁
- [x] JSON chunk 資料讀取
- [x] `/api/courses` 搜尋與分頁
- [x] `/api/courses/[slug]` 單課程 API
- [x] Prisma PostgreSQL Schema
- [x] 14 個來源作業登錄
- [x] 3 門六段式示範課
- [x] Agent 開發規範
- [x] Demo Adapter：external、iframe、video、snapshot、native
- [x] 獨立 `course_demo_registry` 資料層
- [x] Demo 失效統一 fallback
- [x] 線性迴歸 native 互動 Demo
- [x] Demo Adapter 架構文件
- [x] 14 個來源 Repo Metadata 快照
- [x] `/sources` 跨 Repository 來源中心
- [x] `/api/repositories` 查詢 API
- [x] `npm run repositories:sync` GitHub Metadata 同步腳本
- [x] Repository 與 Course Slug 勾稽

## Demo Adapter 完成證據

| 課程 | 模式 | 說明 |
|---|---|---|
| 線性迴歸 | native | 站內可調斜率、截距與殘差 |
| SVM Kernel Trick | iframe | 嵌入 Streamlit，保留備援連結 |
| CWA OpenData | external | 連到命令列工具來源 Repo |
| 台股技術分析動畫 | video | 模式已預留，待補影片 |
| Cosmos 文字生成圖片 | snapshot | 模式已預留，待補快照 |

## Repository Registry 完成證據

| 項目 | 狀態 |
|---|---|
| 來源 Repo 數量 | 14 |
| 預設分支 | 14 個皆為 `main` |
| 公開狀態 | 14 個皆為 public |
| 已轉製課程 | 3 |
| 待轉製課程 | 11 |
| 同步方式 | GitHub Connector 快照 + Node.js GitHub API 腳本 |

> `gshan1209-cell/scrape` 的預設分支是 `master`，但它是技術架構參考來源，不屬於本次 14 個課程作業 Registry。

## 待處理

- [ ] Course Import／Transform Pipeline
- [ ] README 與程式結構分析器
- [ ] 課程草稿產生器
- [ ] 課程轉製後台
- [ ] PostgreSQL 匯入腳本
- [ ] 學習進度與收藏
- [ ] AI 助教
- [ ] 正式測試、CI、部署驗證

## 重要決策

1. 不把課程平台放進 `scrape` 表特專案。
2. 不再以 `machinelearningHw05` 當技術母體。
3. 原始作業 Repo 全部保留；中央平台只保存教學內容、來源與 Adapter。
4. 大量資料採 chunk 分批讀取，不放入前端 bundle。
5. Demo 設定與課程內容分離，展示網址變更不應重寫課程 chunk。
6. 外部作品不可用時，課程內容仍須可閱讀並提供來源 Repo 備援。
7. GitHub Metadata 採快照式管理，避免前台每次載入都直接呼叫 GitHub API。
8. 真實 `GITHUB_TOKEN` 只允許放在本機或部署 Secret，不得提交到 Repository。

## 下一步任務

### ALP-P1-003｜Course Import／Transform Pipeline

目標：將不同 Repository 的 README、檔案結構與 Demo 資訊轉成統一課程草稿。

預計輸入：

```text
repository_registry/repositories.json
source_snapshots/<repo>/README.md
source_snapshots/<repo>/file-tree.json
```

預計輸出：

```text
course_drafts/<course-slug>.json
```

草稿必須包含：

1. 作品用途
2. 白話原理
3. Demo 觀察重點
4. 程式架構
5. 課後測驗
6. 延伸挑戰
7. 來源 Repo 與同步時間
8. 人工審核狀態
