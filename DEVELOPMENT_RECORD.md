# AI Learning Portfolio｜開發紀錄

## 中文摘要

- 專案採 **Migration-first**：來源 Repo 的必要程式、教材、Demo 與文件逐一移植進本 Monorepo。
- 舊 Repo 僅在最低必要驗收、搬遷公告與人工核准後設為 Archived／唯讀。
- 已進行三個實際移植模組：L4 線性迴歸、CWA OpenData、L13 SVM Kernel Trick。
- `external`、`iframe` 只供移植期間功能比對，不代表接管完成。
- 完整 CI 暫緩，但來源 Repo 退役前的 Runtime 驗收不可省略。

## 目前狀態

| 狀態 | 數量 |
|---|---:|
| importing | 1 |
| refactoring | 2 |
| planned | 11 |
| ready_to_retire | 0 |
| retired | 0 |

## 平台層已完成

- [x] Next.js 14 App Router + TypeScript + Tailwind CSS
- [x] 首頁、課程目錄與動態課程頁
- [x] JSON Course Chunk、課程 API、Prisma Schema
- [x] 14 個來源 Repo Metadata Registry
- [x] Demo Adapter：native、external、iframe、video、snapshot
- [x] Migration Registry 與 `/api/migrations`
- [x] `/sources` 移植與退役中心
- [x] v1.2 Source Migration 規格
- [x] Agent Migration-first 規範

## ALP-MIG-001｜L4 線性迴歸

**狀態：`refactoring`**

已完成：

- 原始 Streamlit `app.py` 與 requirements 移入
- 模組 README、migration manifest、來源 SHA
- Native seeded random dataset
- OLS 自動擬合
- true／estimated slope、intercept、variance、MAE、MSE
- residual／abs residual
- Top K Outliers、表格與 React SVG
- fitted／manual 雙模式

待完成：

- Next.js／瀏覽器與 Python Streamlit 最低驗收
- 確認 CSV／PNG 是否為必要功能
- 舊 Repo 搬遷公告、部署處理與人工退役核准

## ALP-MIG-002｜CWA OpenData

**狀態：`refactoring`**

已完成：

- 原始 Python CLI 與 requirements 移入
- 模組 README、migration manifest、來源 SHA
- Server-only `CWA_API_KEY`
- `/api/modules/cwa-open-data`
- Dataset／JSON／XML 驗證
- Sample 與 Live 模式
- 401、404、上游錯誤轉譯
- Content-Type／Content-Disposition
- Native CWA Playground
- 課程 Demo 從 external 改為 native

待完成：

- Build／瀏覽器與 Python CLI 最低驗收
- 使用測試 Secret 驗證即時 JSON、XML 與下載
- 舊 Repo 搬遷公告與人工退役核准

## ALP-MIG-003｜L13 SVM Kernel Trick

**狀態：`importing`**

### 來源架構

| 階段 | 來源檔案 | 功能 |
|---|---|---|
| Phase 1 | `phase1_manim_kernel_trick.py` | 2D 同心圓提升到 3D 幾何動畫 |
| Phase 2 | `phase2_rbf_decision_surface.py` | RBF SVM 2D 邊界與 3D 決策函數曲面 |
| Phase 3 | `phase3_streamlit_app.py` | kernel、C、gamma、degree、noise 與點數互動 |

### 已完成

- [x] README、requirements 與三階段架構盤點
- [x] 保存 README、Phase 1／2／3、utils 來源 SHA
- [x] requirements 移入
- [x] `utils/data_generator.py` 移入
- [x] `utils/svm_utils.py` 移入
- [x] Phase 1 Manim 程式移入
- [x] Phase 2 RBF 決策曲面程式移入
- [x] 模組 README 與 `migration.json`
- [x] 建立 `ALP-MIG-003` 任務文件

### 待完成

- [ ] 完整移入 Phase 3 Streamlit 主程式
- [ ] 盤點並移入必要圖片、影片與輸出素材
- [ ] 建立 Native SVM Playground
- [ ] Native 2D 同心圓與支持向量視覺化
- [ ] Native 3D 幾何／決策函數曲面
- [ ] kernel、C、gamma、degree、noise、point count 控制
- [ ] 準確率、支持向量指標與動態教學提示
- [ ] 將課程 iframe 過渡模式改為 native
- [ ] Runtime 最低必要驗收
- [ ] 舊 Repo 搬遷公告與人工退役核准

## 數學規則

1. `z=x²+y²` 只能描述為幾何直覺示意。
2. 真實 RBF Kernel 不可描述成顯式 3D 特徵映射。
3. 3D `f(x,y)` 圖必須標示為決策函數曲面。
4. high gamma 需說明局部邊界與過擬合風險。
5. low／high C 需說明 Soft／Hard Margin 差異。

## 退役門檻

來源 Repo 必須全部達成：

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

1. 完整搬入 L13 Phase 3 Streamlit 程式。
2. 建立 Native SVM Playground 的資料與參數核心。
3. 完成 2D 邊界、支持向量與參數教學提示。
4. 再處理 3D 視覺化與 Manim 影片資產。
