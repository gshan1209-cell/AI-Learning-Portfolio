# AI Learning Portfolio｜AI 學習作品集與教學平台

> **本專案是舊課程 Repository 的正式接管平台，不只是外部連結型作品集。**

將分散於不同 GitHub Repository 的課程作業、原始程式與展示功能，逐一移植到同一個新專案，重新整理為新手友善、可操作、可持續維護的教學型作品集。

## 中文摘要

- 新專案會接管來源 Repo 的必要原始碼、教材、Demo 與文件。
- 舊 Repo 只作為移植期間的來源證據，不再是長期正式依賴。
- 每個來源 Repo 完成「功能對照、程式移植、內容轉製、驗收、連結轉向」後，才可標記退役。
- 退役 Repo 原則上改為唯讀封存，不直接刪除 Git 歷史。
- `external`、`iframe` Demo 只屬於過渡方案，最終應轉為本站 `native` 模組或由本 Monorepo 管理的服務。

## 核心定位

- 個人 AI／資料科學作品集
- 新手小白也能理解的教學網站
- 多種作業技術的統一 Monorepo
- 舊課程 Repo 的遷移、接管與退役中心
- 未來可擴充會員、進度、AI 助教與課程管理後台

## Migration-first 原則

來源 Repo 的最終生命週期：

```text
盤點 source
  ↓
建立功能與檔案對照
  ↓
移植必要原始碼、素材與文件
  ↓
重構為共用模組／原生 Demo
  ↓
新平台功能驗收
  ↓
更新舊 Repo README 指向新平台
  ↓
舊 Repo 設為唯讀或 Archived
```

在未完成驗收前，不得刪除或封存來源 Repo。

## 技術架構

本專案採用 `gshan1209-cell/scrape` 的架構理念：

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS
- Route Handlers API
- JSON chunk 分批資料來源
- Prisma + PostgreSQL 預留
- Node.js／Python 移植與資料匯入工具
- `modules/` 保存已接管的課程程式與原始教學資產
- `migration_registry/` 管理來源 Repo 的移植與退役狀態

## 專案目錄方向

```text
src/                         Next.js 教學平台
modules/                     已移植進來的課程程式與資產
  linear-regression/
    python-streamlit/        L4 原始 Python／Streamlit 版本
    migration.json           功能對照、驗收與退役狀態
course_chunks/               統一課程內容
course_demo_registry/        過渡與原生 Demo 設定
migration_registry/          全來源 Repo 移植總表
repository_registry/         GitHub Metadata 快照
docs/migrations/             移植規範與逐 Repo 計畫
```

## 快速開始

```bash
npm install
npm run dev
```

開啟 `http://localhost:3000`。

主要頁面：

```text
/            首頁
/courses     教學課程目錄
/sources     來源 Repo 與移植狀態
```

## 第一批移植

### L4｜簡單線性迴歸

目前已開始接管：

- 原始 Streamlit `app.py`
- Python 相依套件
- 資料生成、模型訓練、殘差與離群值邏輯
- 站內原生 Linear Regression Playground
- 六段式教學內容

L4 仍處於「移植中」，在功能對照與必要驗收完成前，不會封存舊 Repo。

## Demo Adapter

支援五種展示模式：

- `native`：本站正式實作，為最終優先模式
- `video`：適合動畫與操作錄影
- `snapshot`：適合保留生成結果或不可執行的舊成果
- `iframe`：過渡嵌入模式，最終應移植或改由本 Monorepo 部署
- `external`：過渡連結模式，不代表移植完成

## 資料與來源策略

課程內容透過伺服器端 Repository 與 `/api/courses` 統一讀取。來源 Repo Metadata 保存於：

```text
repository_registry/repositories.json
```

移植與退役狀態保存於：

```text
migration_registry/migrations.json
```

來源 URL 只用於稽核與歷史追溯；正式功能應由本專案程式碼提供。

## 退役標準

來源 Repo 只有在下列條件全部完成後，才能淘汰：

1. 必要程式碼與素材已移入新專案。
2. 原功能與新功能完成對照。
3. 教學頁、Demo 與來源文件可以由新專案提供。
4. 環境變數、授權與敏感資料已重新整理。
5. 新平台完成必要驗收。
6. 舊 Repo README 已加上搬遷公告與新位置。
7. 舊部署已停止或導向新平台。
8. 舊 Repo 設為 Archived／唯讀；Git 歷史原則上保留。

## 開發狀態

目前已完成平台骨架、Demo Adapter、GitHub Metadata Registry，並正式轉向 **Source Repository Migration**。依專案決策，完整 CI 與正式部署驗證暫緩，但每個 Repo 在退役前仍必須完成最低必要的功能驗收。