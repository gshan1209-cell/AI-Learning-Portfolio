# AI Learning Portfolio｜開發紀錄

## 中文摘要

- 專案採 **Migration-first**：來源 Repo 的必要程式、教材、Demo 與文件逐一移植進本 Monorepo。
- 舊 Repo 僅在最低必要驗收、搬遷公告、舊部署處理與人工核准後設為 Archived／唯讀。
- 目前已有 11 個來源進入 `refactoring`：L4、CWA OpenData、L13 SVM、L12 台股 Manim、machinelearningHw05、machinelearningHw6 (CRISP-DM)、machinelearningHw6-2 (Startup Profit)、hw07 (Feature Selection)、scrape_movie (Movie Scraper)、scrape_weather (Agri Weather)、2026-DjangoBlog (Django Blog)。
- 已完成 Migration Wave 002：Regression Lab 共用能力層、三個 Native 實驗室頁面與真實 ML Artifact 驗證。
- 已完成 Migration Wave 003：Applied Web Systems 共用能力層、三個 Native 實驗室頁面、Route Handlers、三個六段式課程、Python Runtime、Artifact 與 Next.js Build 驗證。
- 已建立 Migration Wave 004：Responsible AI Experience Lab，準備移植最後三個 `planned` 來源。

## 目前狀態

| 狀態 | 數量 |
|---|---:|
| importing | 0 |
| refactoring | 11 |
| planned | 3 |
| ready_to_retire | 0 |
| retired | 0 |

## 平台層已完成

- [x] Next.js 14 App Router + TypeScript + Tailwind CSS
- [x] 首頁、課程目錄、動態課程頁與 Course API
- [x] Prisma + PostgreSQL Schema 預留
- [x] 14 個來源 Repo Metadata Registry
- [x] Demo Adapter：native、external、iframe、video、snapshot
- [x] Migration Registry、`/api/migrations`、`/sources`
- [x] v1.2 Source Migration 規格與 Agent 規範
- [x] Prompt Registry、Prompt Versioning 與中央 AI Gateway 基礎
- [x] Token／Cost Ledger 合約與 Prisma Schema 預留
- [x] `/ai-governance` 唯讀 Prompt／Token／成本治理儀表板
- [x] Node／Python CI、ML／Django Artifact 重建、FastAPI／Django Runtime 驗證
- [x] 精靈模式 (Wizard Mode) 全站引導機制：`WizardContext`、`WizardCompanion` 隨頁學習小精靈、`WizardStepBanner` 關卡引導與 `WizardToggle` 開關控制

## ALP-MIG-001｜L4 線性迴歸

**狀態：`refactoring`**

已完成：原始 Streamlit、Native seeded data、OLS、殘差、Top K Outliers、指標與 SVG。

待完成：Runtime 驗收、CSV／PNG 範圍、搬遷公告與退役核准。

## ALP-MIG-002｜CWA OpenData

**狀態：`refactoring`**

已完成：原始 Python CLI、Server-only API Proxy、Sample／Live、JSON／XML、下載與 Native Playground。

待完成：測試 Secret、Python CLI、下載與退役驗收。

## ALP-MIG-003｜L13 SVM Kernel Trick

**狀態：`refactoring`**

已完成：Phase 1／2／3、SVC 工具與 Native SVM Playground，課程已從 iframe 改為 native。

實作界線：Native 元件是教學模型，不假裝等同完整 scikit-learn SVC；精確 Python 原始碼已在 Monorepo。

待完成：圖片／影片、Python Runtime、RWD、精確 SVC Runtime 策略與退役流程。

## ALP-MIG-004｜L12 台股 Manim 動畫

**狀態：`refactoring`**

已完成 9 個場景、批次渲染器、requirements、pyproject 與完整 shared 共用層。

待完成：tests、圖片／影片資產、Manim／FFmpeg／中文字體、9 場景渲染、播放器與退役流程。

## ALP-MIG-005｜機器學習十大演算法

**狀態：`refactoring`**

已完成：教材、30 題測驗、主要前端、十種視覺化、中央 AI Gateway、Prompt v1.1.0、Token／Cost Ledger 合約與唯讀治理儀表板。

## Migration Wave 002｜Regression Lab

**狀態：`refactoring`**

- ALP-MIG-006：CRISP-DM 迴歸生命週期。
- ALP-MIG-007：Startup Profit 真實 Random Forest Artifact 與 TypeScript 推論。
- ALP-MIG-008：九種 Feature Selection、Ethical／Historical Mode。
- 驗證：Python Artifact 重建、Golden Samples、Route Handler、TypeScript、Lint 與 Next.js Build 全部通過。

## Migration Wave 003｜Applied Web Systems

**狀態：`refactoring`**

- ALP-MIG-009：`scrape_movie` (`f3e0b48074c91adab5b92879b011e9ace805581a`)，建立受控網頁擷取、parser、snapshot、來源追溯、快取與 fallback。
- ALP-MIG-010：`scrape_weather` (`788311e505d9231378f55e093a7f1e791266693d`)，重用中央 CWA Client，建立農事風險規則 JSON 與 Leaflet 台灣地圖。
- ALP-MIG-011：`2026-DjangoBlog` (`eb900202f0d791951a26b6ea1767d15e69cde9ac`)，保存真實 Django Runtime，建立 Native MVT／ORM 教學鏡像與可重建 Schema Artifacts。
- 驗證：自動測試、TypeScript、Next.js Build、Django `check/makemigrations/test`、FastAPI pytest 與 Artifact 重建全部通過。
- Merge Commit：`25eca55a3af8a6510a58c9338242922e87cc29d5`。

## Migration Wave 004｜Responsible AI Experience Lab

**狀態：`planned`（規格與 Codex 任務已建立）**

- ALP-MIG-012：`hw3-cosmos-text2image` (`f253f47b364d4148ce8f6481187f5c7550f0c31f`)，文字生圖、Prompt 控制、Server-only Provider、Demo／Live／Fallback 與 Model 身分治理。
- ALP-MIG-013：`L20-Ensemble-Model` (`46f23c298da353ded39aca4cfa000c8df29589f4`)，Adult Census 五種真實 Ensemble 模型、TypeScript 推論、Responsible／Historical 模式與公平性分析。
- ALP-MIG-014：`L2DOC1-github` (`07c40f377f2e7fdee8d3ce9b69c9dade26792699`)，12 幕圖文故事播放器、Asset Manifest、Rights Status 與 Accessibility。
- 工作分支：`codex/migration-wave-4-responsible-ai-experience-lab`。
- 完成後目標：`refactoring=14`、`planned=0`，但不得提前進入 `ready_to_retire`。

## 共同退役門檻

1. 必要程式、素材與文件已進本專案。
2. 舊新功能有完整對照。
3. 新平台能獨立提供正式功能或成果。
4. 敏感資料、授權與大型資產完成檢查。
5. 完成最低必要 Runtime 驗收。
6. 舊 Repo README 有搬遷公告。
7. 舊部署停止或導向新平台。
8. 使用者人工核准。
9. 舊 Repo 設為 Archived／唯讀。

## 下一步

1. 由 Codex 依 `docs/tasks/CODEX_PROMPT_MIGRATION_WAVE_004.md` 執行最後三個來源移植。
2. 建立 PR 到 `main`，不得自動合併，進行真實模型、Provider、Asset、Python 與 Browser 驗收。
3. Wave 004 合併後，確認 Migration Registry 達到 `14 refactoring / 0 planned`。
4. 集中執行 14 個 `refactoring` 模組的最低必要 Runtime 驗收。
5. 驗收後建立舊 Repo 搬遷公告與第一批退役候選清單。