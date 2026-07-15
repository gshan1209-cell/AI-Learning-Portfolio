# AI Learning Portfolio｜開發紀錄

## 中文摘要

- 專案採 **Migration-first**：來源 Repo 的必要程式、教材、Demo 與文件逐一移植進本 Monorepo。
- 舊 Repo 僅在最低必要驗收、搬遷公告、舊部署處理與人工核准後設為 Archived／唯讀。
- 目前已有 5 個來源進入 `refactoring`：L4、CWA OpenData、L13 SVM、L12 台股 Manim、machinelearningHw05。
- `external`、`iframe` 只供移植期間比對，不代表接管完成。
- 本階段依決策跳過完整 Build／CI，但來源 Repo 退役前的最低 Runtime 驗收不可省略。

## 目前狀態

| 狀態 | 數量 |
|---|---:|
| importing | 0 |
| refactoring | 5 |
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

待完成：tests、橫幅／影片資產、Manim／FFmpeg／中文字體、9 場景渲染、播放器與退役流程。

## ALP-MIG-005｜機器學習十大演算法

**狀態：`refactoring`**

### 已完成

- [x] FastAPI／Next.js 來源架構與主要來源碼保存
- [x] 703 行來源教材拆成 10 個中央 JSON chunk
- [x] 10 個主題、30 題測驗與 30 組解析
- [x] 中央型別、Loader、搜尋、分類、難度與統計
- [x] `/ml-algorithms` 主題目錄
- [x] `/ml-algorithms/[slug]` 十個詳細頁
- [x] 收藏、測驗結果與學習進度 localStorage Adapter
- [x] 通過門檻、作答解析與重新作答
- [x] 列表與單筆 API
- [x] 十種 React／SVG Native 視覺化
- [x] 線性回歸與 SVM 進階 Native 課程勾稽
- [x] 移植中心可直接開啟新平台內容
- [x] SVM Kernel Trick 數學說明校訂

### 已接管視覺化

- `scatter-line`
- `logistic-curve`
- `decision-tree`
- `random-forest`
- `svm-margin`
- `knn-neighbors`
- `kmeans-clustering`
- `naive-bayes-text`
- `pca-projection`
- `gradient-descent`

### 待完成

- [ ] AI Tutor UI
- [ ] 中央 AI Gateway
- [ ] Prompt Registry、Prompt Version、Token Usage 與 Cost Ledger
- [ ] 輸入長度、Prompt Injection、Schema 與個資防護
- [ ] SQLite／SQLAlchemy 與未使用 OpenAI 相依盤點
- [ ] Build／TypeScript／瀏覽器／RWD／localStorage 驗收
- [ ] 舊 Vercel／FastAPI 停止或導向
- [ ] 舊 Repo 搬遷公告與人工退役核准

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

1. 建立共用 AI Gateway／Prompt Registry 基礎，接管 ML Top 10 Gemini 助教。
2. 補 Prompt Version、Token Usage 與 Cost Ledger。
3. 後續集中執行 5 個 `refactoring` 模組的最低必要 Runtime 驗收。
4. 驗收後再逐一建立舊 Repo 搬遷公告與退役候選清單。
