# AI Learning Portfolio｜開發紀錄

## 中文摘要

- 專案已正式採用 **Migration-first**：來源 Repo 的必要程式、教材、Demo 與文件要移植進本 Monorepo。
- 舊 Repo 只有在功能驗收、搬遷公告與人工核准後，才可設為 Archived／唯讀。
- `external`、`iframe` 只屬移植期間比對工具，不代表整合完成。
- 已完成兩個實際移植樣板：L4 線性迴歸、CWA OpenData CLI。
- 完整 CI 暫緩，但來源 Repo 退役前的最低必要驗收不可省略。

## 目前狀態

**階段：Migration-first 已落地；L4 與 CWA OpenData 均進入 `refactoring`。**

| 狀態 | 數量 |
|---|---:|
| refactoring | 2 |
| planned | 12 |
| ready_to_retire | 0 |
| retired | 0 |

## 平台層已完成

- [x] Next.js 14 App Router + TypeScript + Tailwind CSS
- [x] 首頁、課程目錄與動態課程頁
- [x] JSON Course Chunk 與課程 API
- [x] Prisma + PostgreSQL Schema 預留
- [x] 14 個來源 Repo Metadata Registry
- [x] Demo Adapter：native、external、iframe、video、snapshot
- [x] `migration_registry/migrations.json`
- [x] `/api/migrations`
- [x] `/sources` 移植與退役中心
- [x] v1.2 Source Migration 規格
- [x] Agent Migration-first 規範

## ALP-MIG-001｜L4 線性迴歸

### 已完成

- [x] 來源 README、`app.py`、requirements 盤點
- [x] 保存來源 blob SHA
- [x] 原始 Streamlit 程式移入 `modules/linear-regression/python-streamlit/`
- [x] 模組 README 與 `migration.json`
- [x] Native seeded random dataset
- [x] OLS 自動擬合
- [x] true／estimated slope、intercept、variance、MAE、MSE
- [x] residual／abs residual
- [x] Top K Outliers 排序、標記與表格
- [x] React SVG 圖表
- [x] fitted／manual 雙模式

### 待驗收

- [ ] Next.js Build／TypeScript／瀏覽器操作
- [ ] Python Streamlit 參考版啟動
- [ ] 確認 CSV／PNG 匯出是否屬必要功能
- [ ] 舊 L4 README 搬遷公告
- [ ] 舊 Streamlit 部署處理
- [ ] 人工核准後 Archived

## ALP-MIG-002｜CWA OpenData

### 來源證據

| 項目 | 內容 |
|---|---|
| Source Repo | `gshan1209-cell/cwa_scraper` |
| Default Branch | `main` |
| Main Entry | `cwa_scraper.py` |
| Source Script SHA | `e7d8fb50ab93f8609349866641e562619c683530` |
| Requirements SHA | `2b1be2aac5f82492d1af8c8b1c36d5afcad4f40e` |
| New Module | `modules/cwa-open-data` |
| Migration Status | `refactoring` |

### 已完成

- [x] README、CLI 與 requirements 盤點
- [x] 原始 Python CLI 移入 `modules/cwa-open-data/python-cli/`
- [x] 模組 README 與 `migration.json`
- [x] 保留 Dataset、JSON/XML、輸出與預覽邏輯
- [x] `CWA_API_KEY` 改為 Server-only Secret
- [x] 新增 `/api/modules/cwa-open-data`
- [x] Dataset ID 與 Format 驗證
- [x] Sample 模式，不需 API Key
- [x] Live 模式，使用伺服器環境變數
- [x] 401、404 與上游錯誤轉譯
- [x] JSON／XML Content-Type 與下載檔名
- [x] Native CWA Playground
- [x] 課程 Demo 從 external 改為 native

### 待驗收

- [ ] Next.js Build／TypeScript／瀏覽器操作
- [ ] 使用測試用 Secret 驗證即時 JSON
- [ ] 驗證即時 XML 與檔案下載
- [ ] Python CLI 參考版啟動
- [ ] 舊 CWA Repo README 搬遷公告
- [ ] 人工核准後 Archived

## Migration Registry 狀態

```text
planned
inventory
importing
refactoring
verifying
ready_to_retire
retired
blocked
```

課程已發布、已有 Demo 或原始碼已複製，都不等於來源 Repo 可以退役。

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
9. 舊 Repo 改為 Archived／唯讀。

## 重要決策

1. `scrape` 只作為技術架構參考，不是移植課程。
2. `machinelearningHw05` 是來源模組之一，不是母體專案。
3. 來源 URL 僅供稽核與追溯，不能成為正式 Runtime 依賴。
4. 真實 Token、API Key、`.env` 不得移入 Git。
5. 大型模型、資料集與媒體檔逐項判斷，不做無差別搬運。
6. 舊 Repo 優先 Archived，不直接刪除 Git 歷史。
7. 未達退役門檻前不得封存來源 Repo。

## 下一步

### ALP-MIG-003｜L13 SVM Kernel Trick

1. 盤點 Manim、Streamlit、Plotly 與模型檔案。
2. 移入必要 Python 原始碼、requirements 與動畫腳本。
3. 將目前 iframe 過渡模式改寫成站內 native 互動視覺化。
4. 建立來源功能對照與 `migration.json`。
5. 保留舊 Repo 到最低必要驗收完成。
