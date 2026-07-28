# Codex 執行指令｜Migration Wave 002 Regression Lab

請在 Repository `gshan1209-cell/AI-Learning-Portfolio` 執行第二波來源移植。

## 工作分支

直接使用既有分支：

`codex/migration-wave-2-regression-lab`

開始前先同步最新 `main`，如有衝突請保留目前任務文件與主線既有功能。

## 必讀文件

依序閱讀：

1. `AGENT.md`
2. `docs/tasks/ALP-MIG-WAVE-002_REGRESSION_LAB.md`
3. `docs/tasks/ALP-MIG-006_CRISP_DM_REGRESSION.md`
4. `docs/tasks/ALP-MIG-007_STARTUP_PROFIT.md`
5. `docs/tasks/ALP-MIG-008_FEATURE_SELECTION.md`
6. `docs/migrations/SOURCE_REPOSITORY_MIGRATION.md`
7. `DEVELOPMENT_RECORD.md`
8. `migration_registry/migrations.json`

以上任務文件是本次完成定義，不得任意縮減為 iframe、external link、snapshot-only 或固定答案 Demo。

## 來源 Repository

- `gshan1209-cell/machinelearningHw6`
- `gshan1209-cell/machinelearningHw6-2`
- `gshan1209-cell/hw07`

逐一盤點來源預設分支的 README、入口程式、Python、Notebook、資料、模型、圖表、requirements、部署方式與必要文件，並將來源 commit 寫入各自 `migration.json`。

## 執行順序

### Phase A｜Inventory 與來源保存

1. 建立三個模組目錄。
2. 保存必要原始程式與文件於 `python-reference/`。
3. 建立三份 `migration.json`。
4. 對每個來源檔案記錄 imported／excluded 與理由。
5. 更新 Migration Registry：開始移入後改為 `importing`。

### Phase B｜Regression Lab 共用層

1. 建立 `src/lib/ml-lab/`。
2. 建立 `src/components/ml-lab/`。
3. 實作共用 Dataset schema、輸入驗證、OLS、MAE、MSE、RMSE、R²。
4. 建立 `/regression-lab` 入口。
5. 共用元件不得含來源專案特有規則。

### Phase C｜ALP-MIG-006

1. 建立 CRISP-DM 六階段 Native 教學。
2. 使用版本化股價 snapshot。
3. 實作時間序列特徵與正確切分。
4. 避免 Data Leakage。
5. 顯示模型比較、評估與投資免責。
6. Startup 案例只連結 ALP-MIG-007，不重複預測器。

### Phase D｜ALP-MIG-007

1. 保存 50 Startups 資料與 Python Pipeline。
2. 固定 seed 訓練 Random Forest。
3. 匯出完整樹結構與前處理規則為版本化 JSON。
4. 使用 TypeScript 實作真實 Random Forest inference。
5. 建立 Python golden samples 與一致性測試。
6. 建立 Native 預測表單與 API。
7. 不得以線性公式、固定值或隨機數冒充 Random Forest。

### Phase E｜ALP-MIG-008

1. 保存九種特徵選擇方法與結果產製程式。
2. 產生固定 seed、k=1～13 的版本化基準 JSON。
3. 建立九種方法與 R²／MSE Native 比較介面。
4. 實作至少一種 TypeScript 即時計算與 golden result 測試。
5. 預設 Ethical Mode 排除 `B`。
6. Historical Mode 必須主動 opt-in 且顯示警告。

### Phase F｜課程與 Registry

1. 新增三個六段式課程 chunk。
2. 每課至少 3 題測驗與解析。
3. 更新 Course／Demo／Repository／Migration Registry。
4. Native Demo 必須從課程頁可到達。
5. 完成 Native 基礎後，狀態更新為 `refactoring`。

### Phase G｜測試與驗收

新增 Vitest 或沿用專案既有測試基礎，至少測試：

- Dataset schema
- OLS 與四種指標
- Random Forest TypeScript／Python golden samples
- Feature Selection golden results
- API 正常、錯誤、大小與邊界
- Ethical／Historical Mode
- 頁面路由與主要資料載入

執行：

```bash
npm ci
npm run prisma:generate
npm run lint
npx tsc --noEmit
npm run test
npm run build
python -m compileall modules/crisp-dm-regression/python-reference
python -m compileall modules/startup-profit-prediction/python-reference
python -m compileall modules/feature-selection/python-reference
```

若 Python 依賴無法在目前環境安裝，至少完成 compileall、artifact schema 驗證與文件化；不得因此刪除 Python 來源。

## 安全與品質

- 不提交 Token、API Key、Cookie、憑證或 `.env`。
- 不接受任意 URL、ticker、檔案路徑、Python 表達式或欄位運算式。
- 所有 API 必須限制 Body、數值範圍與白名單。
- 不使用外部服務作主要 Runtime 必要條件。
- 不任意刪除既有程式碼或 Registry。
- 不降低 TypeScript strict、ESLint 或 CI 標準。
- 不因測試失敗而跳過或關閉測試。
- 不封存、不停止、不刪除任何來源 Repo 或舊部署。

## 文件更新

更新：

- `DEVELOPMENT_RECORD.md`
- `README.md`（需要時）
- 三份 ALP-MIG 任務文件
- `migration_registry/migrations.json`
- `repository_registry/repositories.json`
- `course_demo_registry/demo_registry.json`

記錄實際執行命令、結果、尚未驗證項目與來源差異。

## 交付

完成後提交並 Push 同一分支，建立 PR 到 `main`。

PR 標題：

`feat: 移植 Regression Lab 三個機器學習模組`

PR 說明至少包含：

- 三個來源 Inventory
- Native 功能摘要
- 共用能力層
- Random Forest 推論一致性結果
- Feature Selection 倫理模式
- 測試與 CI 結果
- 尚待人工驗證項目
- 三個 Migration 的最終狀態

不要自動合併 PR；完成後等待驗收。