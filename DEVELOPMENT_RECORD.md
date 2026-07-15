# AI Learning Portfolio｜開發紀錄

## 中文摘要

- 專案採 **Migration-first**：來源 Repo 的必要程式、教材、Demo 與文件逐一移植進本 Monorepo。
- 舊 Repo 僅在最低必要驗收、搬遷公告與人工核准後設為 Archived／唯讀。
- 已有三個來源進入 `refactoring`：L4 線性迴歸、CWA OpenData、L13 SVM Kernel Trick。
- `external`、`iframe` 只供移植期間功能比對，不代表接管完成。
- 完整 CI 暫緩，但來源 Repo 退役前的 Runtime 驗收不可省略。

## 目前狀態

| 狀態 | 數量 |
|---|---:|
| refactoring | 3 |
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
- Native seeded random dataset、OLS、殘差與 Top K Outliers
- true／estimated slope、intercept、variance、MAE、MSE
- React SVG 與 fitted／manual 雙模式

待完成：

- Next.js／瀏覽器與 Python Streamlit 最低驗收
- 確認 CSV／PNG 是否為必要功能
- 舊 Repo 搬遷公告、部署處理與人工退役核准

## ALP-MIG-002｜CWA OpenData

**狀態：`refactoring`**

已完成：

- 原始 Python CLI 與 requirements 移入
- Server-only `CWA_API_KEY`
- `/api/modules/cwa-open-data`
- Dataset／JSON／XML、Sample／Live、錯誤轉譯與下載標頭
- Native CWA Playground
- 課程 Demo 從 external 改為 native

待完成：

- Build／瀏覽器與 Python CLI 最低驗收
- 使用測試 Secret 驗證即時 JSON、XML 與下載
- 舊 Repo 搬遷公告與人工退役核准

## ALP-MIG-003｜L13 SVM Kernel Trick

**狀態：`refactoring`**

### 三階段原始碼已接管

| 階段 | 新專案檔案 | 功能 |
|---|---|---|
| Phase 1 | `python-reference/phase1_manim_kernel_trick.py` | 2D 同心圓提升到 3D 幾何動畫 |
| Phase 2 | `python-reference/phase2_rbf_decision_surface.py` | RBF SVM 2D 邊界與 3D 決策函數曲面 |
| Phase 3 | `python-reference/phase3_streamlit_app.py` | Kernel、C、Gamma、Degree、Noise 與點數互動 |

### 已完成

- [x] requirements、資料生成器與 SVC 工具移入
- [x] Phase 1、2、3 完整移入
- [x] Native SVM Playground
- [x] RBF、Linear、Polynomial、Sigmoid 控制
- [x] C、Gamma、Degree、Noise、Point Count、Seed
- [x] Native 同心圓資料生成
- [x] 2D 邊界與近似支持向量
- [x] `z=x²+y²` 高維提升直覺圖
- [x] 教學分類率與支持向量指標
- [x] Gamma、C 與 Linear Kernel 動態提示
- [x] Demo Adapter Native 註冊
- [x] 課程從 iframe 改為 native

### 實作界線

Native Playground 接管操作流程與教學概念，但不宣稱是完整 scikit-learn SVC 的瀏覽器重寫。精確 SVC 原始碼已在 Monorepo；若網站需要精確即時計算，後續應新增由本專案管理的 Python API／Worker。

### 待完成

- [ ] 必要圖片與 Manim 影片資產
- [ ] Phase 1、2、3 Python Runtime 驗收
- [ ] Native Playground 瀏覽器／RWD 驗收
- [ ] 精確 SVC Runtime 策略決定
- [ ] 舊 Streamlit Demo 停止或導向
- [ ] 舊 Repo 搬遷公告與人工退役核准

## 數學規則

1. `z=x²+y²` 只能描述為幾何直覺示意。
2. 真實 RBF Kernel 不可描述成顯式 3D 特徵映射。
3. 3D `f(x,y)` 圖必須標示為決策函數曲面。
4. High Gamma 需說明局部邊界與過擬合風險。
5. Low／High C 需說明 Soft／Hard Margin 差異。

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

1. 盤點並移入 L13 必要圖片與 Manim 影片資產。
2. 啟動 ALP-MIG-004｜L12 台股 Manim 動畫移植。
3. 後續統一執行 L4、CWA、L13 的最低必要 Runtime 驗收。
