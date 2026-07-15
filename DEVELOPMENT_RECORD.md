# AI Learning Portfolio｜開發紀錄

## 中文摘要

- 2026-07-15 建立全新獨立 Repository。
- 技術架構改採 `gshan1209-cell/scrape` 的 Next.js + JSON chunks + Prisma 模式。
- 完成平台基礎骨架與三門示範課程。
- 依使用者決策，正式測試與驗證先跳過。

## 目前狀態

**階段：P0 平台骨架已建立，待內容擴充與 Demo Adapter。**

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

## 待處理

- [ ] Demo Adapter：external、iframe、video、native 四種模式
- [ ] GitHub Metadata 同步
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
