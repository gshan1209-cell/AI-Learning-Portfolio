# AI Learning Portfolio｜開發紀錄

## 中文摘要

- 專案採 **Migration-first**：來源 Repo 的必要程式、教材、Demo 與文件逐一移植進本 Monorepo。
- 舊 Repo 僅在最低必要驗收、搬遷公告與人工核准後設為 Archived／唯讀。
- 已有四個來源進入 `refactoring`：L4、CWA OpenData、L13 SVM、L12 台股 Manim 動畫。
- `external`、`iframe` 只供移植期間比對，不代表接管完成。
- 完整 CI 暫緩，但來源 Repo 退役前的 Runtime 驗收不可省略。

## 目前狀態

| 狀態 | 數量 |
|---|---:|
| refactoring | 4 |
| planned | 10 |
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

已完成：原始 Streamlit 程式、Native seeded data、OLS、殘差、Top K Outliers、指標與 SVG。

待完成：Next.js／瀏覽器／Python 最低驗收、CSV／PNG 範圍、搬遷公告與退役核准。

## ALP-MIG-002｜CWA OpenData

**狀態：`refactoring`**

已完成：原始 Python CLI、Server-only API Key、CWA Route Handler、Sample／Live、JSON／XML、錯誤轉譯與 Native Playground。

待完成：測試 Secret 即時驗收、Python CLI 驗收、搬遷公告與退役核准。

## ALP-MIG-003｜L13 SVM Kernel Trick

**狀態：`refactoring`**

已完成：Phase 1／2／3、資料生成與 SVC 工具完整移入；Native Playground 已接管 Kernel、C、Gamma、Degree、Noise、Seed、2D 邊界與高維直覺，課程已從 iframe 改為 native。

實作界線：Native 元件是教學模型，不假裝等同完整 scikit-learn SVC；精確 Python 程式已在 Monorepo，後續可新增本專案管理的 Python API／Worker。

待完成：圖片／Manim 影片、Python Runtime、瀏覽器 RWD、精確 SVC Runtime 策略與退役流程。

## ALP-MIG-004｜L12 台股 Manim 動畫

**狀態：`refactoring`**

### 來源證據

| 項目 | 內容 |
|---|---|
| Source Repo | `gshan1209-cell/L12` |
| Source Root | `manim-animations/` |
| Source Commit | `cc8902757a2f4e240710f8c9dbe14fd53bf7f280` |
| New Module | `modules/stock-manim-animation` |
| Runtime | Python 3.10+／Manim 0.18+ |

### 已完成

- [x] README、requirements、pyproject、main 與批次渲染器移入
- [x] 9 個場景全部移入
- [x] Title／Market Rules／Candlestick／Moving Average
- [x] Volume Price／Support Resistance／Trend Breakout
- [x] RSI／MACD／Bollinger／Backtesting Risk
- [x] theme、text、layout、animation、chart、sample data 共用層移入
- [x] scenes／shared Python package 初始化
- [x] 來源 commit 與每個主要 blob SHA 記錄
- [x] 模組 README、migration manifest 與任務文件
- [x] 投資教育免責、字體與 Manim 系統相依風險文件化

### 待完成

- [ ] 來源 tests 盤點與移植
- [ ] `project_banner.png` 與必要媒體資產
- [ ] Manim／FFmpeg／Cairo／Pango 環境驗收
- [ ] Windows／Linux 繁體中文字體驗收
- [ ] 9 個場景低畫質渲染
- [ ] `render_all.py` 批次驗收
- [ ] 成交量柱狀圖縮放視覺檢查
- [ ] 正式 MP4／Poster／章節 Metadata
- [ ] 課程影片播放器與章節導覽
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

1. 完成 L12 tests／圖片／影片資產盤點。
2. 建立 Manim 媒體輸出與課程章節 Metadata 規格。
3. 啟動 ALP-MIG-005，優先處理可直接整合的 Next.js 來源模組。
4. 後續集中執行 L4、CWA、L13、L12 的最低必要 Runtime 驗收。
