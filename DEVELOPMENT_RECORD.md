# AI Learning Portfolio｜開發紀錄

## 中文摘要

- 專案採 **Migration-first**：來源 Repo 的必要程式、教材、Demo 與文件逐一移植進本 Monorepo。
- 舊 Repo 僅在最低必要驗收、搬遷公告與人工核准後設為 Archived／唯讀。
- 4 個來源進入 `refactoring`：L4、CWA OpenData、L13 SVM、L12 台股 Manim。
- 第 5 個來源 `machinelearningHw05` 已進入 `importing`。
- `external`、`iframe` 只供移植期間比對，不代表接管完成。

## 目前狀態

| 狀態 | 數量 |
|---|---:|
| importing | 1 |
| refactoring | 4 |
| planned | 9 |
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

已完成：

- 9 個教學場景全部移入
- requirements、pyproject、main、render_all
- theme、text、layout、animation、chart、sample data 共用層
- scenes／shared package
- 來源 commit 與 blob SHA 勾稽
- 模組 README、migration manifest 與任務文件

待完成：tests、橫幅／影片資產、Manim／FFmpeg／中文字體、9 場景渲染、播放器與退役流程。

## ALP-MIG-005｜機器學習十大演算法

**狀態：`importing`**

### 來源架構

| 層級 | 技術 |
|---|---|
| Frontend | Next.js 15.5、React 18 |
| Backend | FastAPI、Pydantic |
| AI | Gemini `google-genai` |
| Content | 約 703 行 `algorithms.json` |
| Progress | localStorage |

### 已完成

- [x] README、package、requirements 與前後端架構盤點
- [x] 保存主要來源 SHA
- [x] FastAPI main／algorithms／chat 與 requirements 移入來源參考區
- [x] Next.js package、首頁、AlgorithmGrid、AlgorithmCard、ProgressBar 移入
- [x] Algorithm／Quiz／DisplayAlgorithm 型別移入
- [x] 教材 normalization 與文字 fallback 邏輯移入
- [x] Gemini fallback 與 Prompt 內容盤點
- [x] AI Gateway／Prompt Registry／Token Cost 改造要求文件化
- [x] 模組 README、migration manifest 與任務文件

### 重要發現

1. README 描述 OpenAI，但目前程式實際使用 Gemini；正式規格以程式為準。
2. 來源使用 Next.js 15.5，中央平台是 Next.js 14，不能直接放進正式編譯路徑。
3. `AlgorithmCard` 依賴尚未搬入的 `FavoriteButton`。
4. AI API 會接收 `user_id` 與最近五筆對話，需要個資最小化與日誌規範。
5. 完整教材 JSON 是核心資產，目前尚未進入中央正式資料層。

### 待完成

- [ ] 完整教材與測驗 JSON 移植、比對與 chunk 化
- [ ] FavoriteButton、詳細頁、Quiz、視覺化與 AI Tutor UI
- [ ] Course Registry 與正式路由映射
- [ ] Gemini 改走中央 AI Gateway
- [ ] Prompt Version、Token Usage、Cost Ledger
- [ ] SQLite／SQLAlchemy 實際用途確認
- [ ] Build／Runtime／瀏覽器與退役流程

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

1. 將 ML Top 10 的 703 行教材拆成中央平台可維護的資料 chunks。
2. 補齊 Favorite、詳細頁、Quiz 與視覺化來源元件。
3. 建立正式 ML Topic Collection 與課程路由。
4. 後續集中執行四個 `refactoring` 模組的最低必要 Runtime 驗收。
