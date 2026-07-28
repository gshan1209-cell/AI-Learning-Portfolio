# AI Learning Portfolio｜開發紀錄

## 中文摘要

- 專案採 **Migration-first**：來源 Repo 的必要程式、教材、Demo 與文件逐一移植進本 Monorepo。
- 舊 Repo 僅在最低必要驗收、搬遷公告、舊部署處理與人工核准後設為 Archived／唯讀。
- 目前已有 8 個來源進入 `refactoring`：L4、CWA OpenData、L13 SVM、L12 台股 Manim、machinelearningHw05、machinelearningHw6 (CRISP-DM)、machinelearningHw6-2 (Startup Profit)、hw07 (Feature Selection)。
- 已完成 Migration Wave 002 (Regression Lab 共用能力層、三個 Native 實驗室頁面與測試)。
- 已建立 Migration Wave 003 (Applied Web Systems) 規格與 Codex 執行指令，準備移植電影爬蟲、農事天氣與 Django Blog。

## 目前狀態

| 狀態 | 數量 |
|---|---:|
| importing | 0 |
| refactoring | 8 |
| planned | 6 |
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

已完成 9 個教學場景、批次渲染器、requirements、pyproject 與完整 shared 共用層。

待完成：tests、橫幅／影片資產、Manim／FFmpeg／中文字體、9 場景渲染、播放器與退役流程。

## ALP-MIG-005｜機器學習十大演算法

**狀態：`refactoring`**

### 教材與 Native 功能已完成

- [x] 來源 FastAPI／Next.js 主要碼與 SHA 保存
- [x] 703 行來源教材拆成 10 個中央 JSON chunk
- [x] 10 個主題、30 題測驗與 30 組解析
- [x] `/ml-algorithms` 與十個詳細頁
- [x] 搜尋、分類、難度、收藏、測驗與進度
- [x] 列表與單筆 API
- [x] 十種 React／SVG Native 視覺化
- [x] 線性回歸與 SVM 進階課程勾稽
- [x] SVM Kernel Trick 數學說明校訂

### 中央 AI 治理已實作

- [x] `POST /api/ai/ml-tutor`
- [x] AI Tutor UI 接入十個演算法頁面
- [x] Prompt Registry 正式來源
- [x] Prompt v1.0.0 歷史版保留
- [x] Prompt v1.1.0 Injection Guard 啟用
- [x] Gemini Structured JSON Schema
- [x] Server-side Response Validation
- [x] Secret 缺少／Provider Error／Timeout fallback
- [x] Question／History／16 KB Request Body Limits
- [x] 不接收 user_id、不保存完整對話與原始 IP
- [x] 匿名雜湊 Rate Limit
- [x] Token Usage 與可設定費率的 Cost Estimate
- [x] 本機 JSONL Ledger 與正式 PostgreSQL Schema 預留
- [x] `ai_prompts`、`ai_prompt_versions`、`ai_model_rates`、`ai_usage_logs`
- [x] `/ai-governance` 唯讀治理儀表板
- [x] Prompt 版本、模型、Secret 配置狀態、Rate Limit、費率、Ledger 模式與近期用量檢視
- [x] AI Gateway 架構文件

### 待完成

- [ ] 使用測試 Secret 驗證 Live Gemini 回覆、Schema 與 Token Metadata
- [ ] 執行 Prisma Migration
- [ ] 正式 Usage Ledger 寫入 PostgreSQL
- [ ] 具認證／授權的 Prompt 編輯、發布與回滾後台
- [ ] 正式 Token／成本查詢圖表與多實例 Rate Limiter
- [ ] SQLite／SQLAlchemy 與來源 OpenAI 相依盤點
- [x] Build／TypeScript／瀏覽器／RWD／localStorage 驗收
- [ ] 舊 Vercel／FastAPI 停止或導向
- [ ] 舊 Repo 搬遷公告與人工退役核准

## Migration Wave 003｜Applied Web Systems

**狀態：規格完成，尚未開始移植**

- ALP-MIG-009：`scrape_movie`，建立受控擷取、snapshot、來源追溯、快取與 fallback。
- ALP-MIG-010：`scrape_weather`，擴充既有 CWA 共用層，加入農事風險與 Leaflet 地圖。
- ALP-MIG-011：`2026-DjangoBlog`，保留真實 Django Runtime，建立 Native MVT／ORM／request lifecycle 教學鏡像。
- 工作分支：`codex/migration-wave-3-applied-web-systems`。
- 完成定義：`docs/tasks/ALP-MIG-WAVE-003_APPLIED_WEB_SYSTEMS.md`。
- Codex 指令：`docs/tasks/CODEX_PROMPT_MIGRATION_WAVE_003.md`。

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

1. 依 `CODEX_PROMPT_MIGRATION_WAVE_003.md` 執行 Applied Web Systems 三個模組移植。
2. 使用測試 Secret 驗證 ML Top 10 Live／Fallback AI 流程。
3. 執行 Prisma Migration 後改用 PostgreSQL Usage Ledger。
4. 建立具認證／授權的 Prompt 編輯、發布與回滾後台。
5. 集中執行既有 `refactoring` 模組的最低必要 Runtime 驗收。
6. 驗收後建立舊 Repo 搬遷公告與退役候選清單。