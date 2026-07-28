# AI Learning Portfolio｜Agent 開發規範

## 中文摘要

- 本專案的目標是把分散於來源 GitHub Repository 的程式、教材與 Demo 移植進本專案。
- 來源 Repo 是暫時來源，不是長期正式依賴。
- 完成移植與驗收後，來源 Repo 應改為唯讀／Archived，並在 README 指向本專案。
- 技術架構以 `gshan1209-cell/scrape` 的 Next.js + JSON chunks + Prisma 模式為基礎。
- `external`、`iframe` 只能作為遷移期間的過渡展示，不得被標記為完成移植。

## 1. 固定技術架構

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS
- Route Handlers
- JSON chunks：`course_chunks/`、`course_chunks_archive/`
- Prisma + PostgreSQL
- Node.js／Python 移植與匯入腳本
- `modules/`：已接管的課程程式、素材與相依文件
- `migration_registry/`：移植狀態、功能對照與退役門檻

不得在未更新規格與開發紀錄的情況下改成其他大型框架。

## 2. 最終目標

每一個來源 Repo 必須走完以下流程：

1. Inventory：盤點 README、入口檔、程式、素材、資料、Demo、部署方式。
2. Mapping：建立舊功能到新模組的對照。
3. Import：把必要程式與素材移入 `modules/<module-slug>/`。
4. Refactor：抽離可共用邏輯，重構成本站 native 功能或本 Monorepo 管理的服務。
5. Course Transform：整理成統一六段式教學內容。
6. Verification：完成最低必要功能驗收與差異記錄。
7. Redirect：更新舊 Repo README 與部署入口，指向新平台。
8. Retirement：將舊 Repo 設為 Archived／唯讀。

不得在第 6 步以前刪除、封存或停止來源 Repo。

## 3. 課程六段式模板

每個發布課程至少包含：

1. 這個主題能做什麼
2. 白話原理與生活比喻
3. 可操作 Demo
4. 程式架構與關鍵程式碼
5. 小測驗
6. 延伸挑戰

## 4. 原始碼移植規則

- 每個來源 Repo 對應一個 `modules/<module-slug>/`。
- 必須保存 `migration.json`，記錄來源 Repo、來源 commit、入口檔、已移植檔案、排除檔案、功能差異與退役狀態。
- 原始程式可以先完整保存，再逐步重構；但不可只留下摘要或外部連結。
- 大型模型、資料集與生成資產要評估授權、體積與必要性；不能直接無差別搬入 Git。
- 金鑰、Token、憑證、`.env` 不得移植到版本庫。
- 第三方套件必須集中記錄版本與啟動方式。
- 若來源為 Streamlit、Django、FastAPI 或純 Python，可先放入模組子目錄，再決定改寫成 Next.js native 或保留為 Monorepo service。
- `source.repositoryUrl` 只保留作為歷史來源，不得作為正式執行依賴。

## 5. Demo 模式完成定義

| 模式 | 是否代表移植完成 | 說明 |
|---|---:|---|
| native | 是 | 功能已由本專案程式提供 |
| video | 視情況 | 動畫／影音成果可作正式呈現，但原始產製程式仍需移植 |
| snapshot | 否 | 只能證明成果存在 |
| iframe | 否 | 仍依賴外部部署 |
| external | 否 | 仍依賴舊 Repo 或舊服務 |

## 6. 移植狀態

統一使用：

- `planned`：尚未開始
- `inventory`：盤點中
- `importing`：原始碼與資產匯入中
- `refactoring`：重構中
- `verifying`：驗收中
- `ready_to_retire`：已達退役門檻
- `retired`：舊 Repo 已封存或唯讀
- `blocked`：授權、依賴、體積或技術問題阻擋

不得使用 `published` 取代移植狀態；課程發布與 Repo 移植是兩條不同狀態線。

## 7. 資料規則

- 課程內容：`course_chunks/`
- Demo 設定：`course_demo_registry/`
- GitHub Metadata：`repository_registry/`
- 移植狀態：`migration_registry/`
- 已接管程式：`modules/`
- 移植文件：`docs/migrations/`

## 8. 當前任務

### ALP-P0｜平台骨架

- [x] Next.js／Tailwind 基礎
- [x] 首頁與課程目錄
- [x] Course Registry 型別
- [x] JSON chunk Repository
- [x] 課程 API
- [x] Prisma Schema 預留

### ALP-P1｜展示與來源盤點

- [x] 五模式 Demo Adapter
- [x] GitHub Metadata Registry
- [x] 14 個來源 Repo 盤點

### ALP-MIG-001｜L4 線性迴歸完整移植

- [x] 盤點 README、入口檔與 requirements
- [ ] 移入原始 Streamlit 程式
- [ ] 建立 `migration.json`
- [ ] 完成功能對照表
- [ ] 補齊 native Demo 功能差異
- [ ] 完成最低必要驗收
- [ ] 更新舊 Repo 搬遷公告
- [ ] 將舊 Repo 設為 Archived

### 後續

- [ ] 依 migration registry 逐一移植其餘 13 個 Repo
- [ ] Course Import／Transform Pipeline 改為 Source Migration Pipeline
- [ ] PostgreSQL 匯入腳本
- [ ] 管理後台
- [ ] 學習進度與收藏
- [ ] AI 助教

## 9. 驗證策略

完整 CI 與部署驗證可暫緩，但**任何來源 Repo 在退役前**至少必須完成：

- 核心功能可執行或可由 native 模組取代
- 入口與依賴文件完整
- 舊新功能差異表
- 敏感資料檢查
- 移植檔案清單
- 回退方式
- 人工驗收紀錄

Agent 完成任務後必須更新 `DEVELOPMENT_RECORD.md` 與對應 `migration.json`。