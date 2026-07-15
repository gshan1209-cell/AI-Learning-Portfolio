# AI Learning Portfolio｜開發紀錄

## 中文摘要

- 2026-07-15 建立全新獨立 Repository。
- 技術架構採 `gshan1209-cell/scrape` 的 Next.js + JSON chunks + Prisma 模式。
- 完成平台骨架、三門示範課、五模式 Demo Adapter 與 14 個來源 Repo Metadata Registry。
- 2026-07-15 使用者重新確認最終目標：**來源 Repo 的程式與功能要移植進本專案，舊 Repo 完成驗收後退役。**
- 原本「保留舊 Repo 作為長期執行來源」的設計正式撤銷。
- 完整 CI 暫緩，但來源 Repo 在退役前仍必須完成最低必要驗收。

## 目前狀態

**階段：Migration-first 架構調整完成，開始 ALP-MIG-001｜L4 線性迴歸完整移植。**

## 已完成

- [x] 全新 `AI-Learning-Portfolio` Repository
- [x] Next.js 14 App Router
- [x] Tailwind CSS 與基本 RWD
- [x] 首頁與作品集定位
- [x] 課程目錄、搜尋與分類
- [x] 動態課程頁
- [x] JSON chunk 資料讀取
- [x] `/api/courses` 與單課程 API
- [x] Prisma PostgreSQL Schema
- [x] 14 個來源作業登錄
- [x] 3 門六段式示範課
- [x] Demo Adapter：external、iframe、video、snapshot、native
- [x] 獨立 `course_demo_registry`
- [x] 線性迴歸 native Playground
- [x] 14 個來源 Repo Metadata 快照
- [x] `/sources` 跨 Repository 來源中心
- [x] `/api/repositories`
- [x] `npm run repositories:sync`
- [x] Migration-first README 與 Agent 規範
- [x] 來源 Repo 退役門檻定義
- [x] L4 README、`app.py`、`requirements.txt` 盤點

## 方向修正紀錄

### 舊方向（已撤銷）

- 中央網站只保存教學內容與來源連結。
- 舊 Repo 長期保留為正式原始碼與 Demo。
- `external` 或 `iframe` 可被視為作品整合完成。

### 新方向（正式採用）

- 本專案要接管必要原始碼、教材、Demo、素材與啟動文件。
- 每個來源 Repo 對應一個 `modules/<module-slug>/`。
- `external`、`iframe` 只算遷移過渡狀態。
- 只有本專案能獨立提供功能，或功能已由本 Monorepo 管理的服務提供，才算移植完成。
- 舊 Repo 完成驗收、搬遷公告與連結轉向後，改為 Archived／唯讀。
- 原則上不刪除 Git 歷史，以利稽核與回溯。

## 第一個移植樣板：L4 線性迴歸

### 已盤點來源

| 項目 | 內容 |
|---|---|
| Source Repo | `gshan1209-cell/L4` |
| Default Branch | `main` |
| Main Entry | `app.py` |
| Framework | Streamlit |
| Core Libraries | NumPy、Pandas、Matplotlib、scikit-learn |
| Core Functions | `generate_data`、`fit_linear_regression`、`find_top_outliers`、`plot_regression`、`main` |
| Existing Native Replacement | `src/components/native-demos/linear-regression-playground.tsx` |
| Migration Status | `importing` |

### L4 功能對照

| 舊功能 | 新平台狀態 | 說明 |
|---|---|---|
| 隨機產生資料 | 部分完成 | native Demo 目前採固定樣本與參數調整，仍需補隨機資料模式 |
| 訓練最佳迴歸線 | 尚未完整對等 | 目前可調整直線，仍需補 OLS 自動擬合 |
| 顯示真實／估計斜率截距 | 部分完成 | native Demo 需補完整指標卡 |
| 計算 residual | 已完成 | 站內 Demo 可計算殘差 |
| Top K Outliers | 尚未完成 | 待補排序、標記與表格 |
| Streamlit 參數控制 | 部分完成 | native Demo 已有斜率與截距控制 |
| Matplotlib 圖表 | 已改寫 | 改為 SVG／React 原生呈現 |
| CSV 與圖片產出 | 尚未決定 | 需判斷是否屬正式教學需求 |

## Migration Registry 狀態定義

- `planned`
- `inventory`
- `importing`
- `refactoring`
- `verifying`
- `ready_to_retire`
- `retired`
- `blocked`

課程 `published` 不代表來源 Repo 已完成移植。

## 退役門檻

來源 Repo 必須全部達成以下條件：

1. 必要程式、素材與文件已進入本專案。
2. 舊功能與新功能有完整對照。
3. 新平台能提供正式 Demo 或等價成果。
4. 敏感資料、授權與大型資產完成檢查。
5. 完成最低必要功能驗收。
6. 舊 Repo README 有搬遷公告。
7. 舊部署停止或導向新平台。
8. 舊 Repo 改為 Archived／唯讀。

## 待處理

### ALP-MIG-001｜L4

- [ ] 移入原始 Streamlit 程式與 requirements
- [ ] 建立模組 README 與 `migration.json`
- [ ] 補齊 native Demo 的 OLS 擬合
- [ ] 補齊隨機資料與 Top K Outliers
- [ ] 完成最低必要驗收
- [ ] 更新舊 L4 Repo 搬遷公告
- [ ] 封存舊 L4 Repo

### 平台層

- [ ] 將 `/sources` 改為「移植與退役中心」
- [ ] Source Migration Pipeline
- [ ] 原始檔案樹與來源 commit 快照
- [ ] PostgreSQL 匯入腳本
- [ ] 管理後台
- [ ] 學習進度與收藏
- [ ] AI 助教
- [ ] 正式 CI 與部署驗證

## 重要決策

1. `scrape` 只作為技術架構參考，不納入移植課程。
2. `machinelearningHw05` 是來源課程之一，不再是母體專案。
3. 來源 Repo URL 僅供稽核與追溯，不能作為最終執行依賴。
4. 大型模型、資料集與媒體檔必須逐項判斷，不做無差別搬運。
5. 真實 Token、金鑰與 `.env` 不得移植進 Git。
6. 舊 Repo 淘汰採 Archived／唯讀優先，不直接刪除歷史。
7. 未達退役門檻前，不得封存或關閉來源 Repo。

## 下一步任務

### ALP-MIG-001｜L4 線性迴歸完整移植

輸入：

```text
gshan1209-cell/L4@main
README.md
app.py
requirements.txt
```

輸出：

```text
modules/linear-regression/python-streamlit/app.py
modules/linear-regression/python-streamlit/requirements.txt
modules/linear-regression/README.md
modules/linear-regression/migration.json
migration_registry/migrations.json
```

完成後再依相同方式處理下一個來源 Repo。