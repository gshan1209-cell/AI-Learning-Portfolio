# ALP Migration Wave 002｜Regression Lab 共用能力層

## 1. 波次目標

本波次一次推進三個來源 Repository，但維持三個獨立 Migration、課程與退役門檻：

| Migration | 來源 Repository | 新模組 | 核心定位 |
|---|---|---|---|
| ALP-MIG-006 | `gshan1209-cell/machinelearningHw6` | `modules/crisp-dm-regression` | CRISP-DM 六階段與迴歸完整生命週期 |
| ALP-MIG-007 | `gshan1209-cell/machinelearningHw6-2` | `modules/startup-profit-prediction` | 新創支出、Random Forest Pipeline 與利潤預測 |
| ALP-MIG-008 | `gshan1209-cell/hw07` | `modules/feature-selection` | 九種特徵選擇方法、模型比較與資料倫理 |

採用同一波次是為了抽出共用的資料載入、迴歸指標、模型比較、圖表、輸入驗證與教學元件，避免三個專案重複造輪子；不得將三個來源模組合併成單一不可拆分的產品。

## 2. 固定架構

### 2.1 共用 Native 層

建立：

```text
src/lib/ml-lab/
├── datasets/
├── metrics/
├── regression/
├── feature-selection/
├── validation/
└── types.ts

src/components/ml-lab/
├── crisp-dm-timeline.tsx
├── dataset-preview.tsx
├── metric-card-grid.tsx
├── model-comparison-table.tsx
├── regression-scatter.tsx
├── prediction-form.tsx
├── feature-ranking-chart.tsx
├── ethics-notice.tsx
└── learning-checkpoint.tsx
```

共用層只能放通用能力；來源專案特有的教材、模型、資料與規則必須留在各自模組或課程 chunk。

### 2.2 Native 頁面

建立：

- `/regression-lab`：三個課程入口、學習路線與共用概念。
- `/regression-lab/crisp-dm`：CRISP-DM 六階段與股價迴歸教學。
- `/regression-lab/startup-profit`：新創利潤預測與模型解釋。
- `/regression-lab/feature-selection`：九種特徵選擇方法比較。

既有 `/courses/[slug]` 必須能導向對應 Native Demo，不得依賴舊 Streamlit、FastAPI 或外部部署才能完成主要學習流程。

### 2.3 API

最低需求：

- `GET /api/ml-lab/datasets/[dataset]`
- `POST /api/ml-lab/startup-profit/predict`
- `GET /api/ml-lab/feature-selection/results`

規則：

- 不接受任意遠端 URL。
- Request Body、數值範圍與字串長度必須驗證。
- 錯誤回傳不得洩漏檔案路徑、堆疊或 Secret。
- 可重現資料預設使用版本化 snapshot 或 seeded dataset。
- 外部資料刷新只能由 server-side script 或受控 API 執行，不能成為主畫面的必要依賴。

## 3. 模型與 Runtime 策略

### 3.1 原始 Python 保留

每個來源 Repository 的必要 Python 程式、Notebook、requirements、資料說明與模型產製流程，完整保存於：

```text
modules/<module-slug>/python-reference/
```

不得只留下摘要、截圖或外部連結。

### 3.2 Native 推論

主要網站必須在 Next.js Runtime 中提供可操作 Demo。

- 線性迴歸：以 TypeScript 實作可驗證的 OLS／指標計算。
- Random Forest：由 Python 訓練流程匯出版本化的樹結構 JSON，再由 TypeScript 執行推論；不得用固定文案假裝模型預測。
- 特徵選擇：Python 產生完整基準結果 JSON，Native UI 可切換方法與 k 值；至少一組簡化方法可由 TypeScript 即時計算，並明確標示「即時計算」與「基準結果」。

每個模型 artifact 必須記錄：

- 來源 Repository
- 來源 commit
- dataset version／hash
- 訓練腳本
- random seed
- model parameters
- evaluation metrics
- generatedAt

## 4. 課程內容

三個課程都使用專案既有六段式模板：

1. 這個主題能做什麼
2. 白話原理與生活比喻
3. 可操作 Demo
4. 程式架構與關鍵程式碼
5. 小測驗
6. 延伸挑戰

每個課程至少 3 題測驗並提供答案解析。

## 5. 邊界與避免重複

### ALP-MIG-006

- 負責 CRISP-DM 方法論、股價案例、迴歸生命週期與部署觀念。
- 新創案例只做方法論串接與連結，不重做 ALP-MIG-007 的完整預測器。

### ALP-MIG-007

- 負責 50 Startups 資料、Pipeline、Random Forest、輸入表單、推論與模型限制。
- CRISP-DM 六階段使用共用元件，不另建一套流程元件。

### ALP-MIG-008

- 負責九種特徵選擇方法、k 值比較、R²／MSE 視覺化與倫理說明。
- 共用迴歸指標與圖表，不複製計算函式。

## 6. 資料與倫理規則

### 股價案例

- 預設使用版本化歷史 snapshot，確保建置與 Demo 可重現。
- 即時下載只作選用刷新流程。
- 全頁顯示「教學用途，不構成投資建議」。
- 不顯示保證報酬、買賣訊號或未來價格承諾。

### Startup 50

- 清楚標示樣本數少、欄位有限、外插能力弱。
- 預測結果只能作教學與初步分析，不可宣稱為真實營運決策依據。
- 金額欄位需顯示資料集原始貨幣語境，不自行換匯。

### Boston Housing

- 原始資料可為歷史重現目的保存，但必須標示爭議欄位與年代限制。
- Native UI 預設不得使用具爭議的 `B` 欄位；如提供歷史重現模式，需明確 opt-in 並顯示警告。
- `LSTAT` 必須標示為社經代理變數，禁止將結果用於真實房貸、租屋、保險、定價或人群決策。
- 預設體驗應提供移除爭議欄位後的比較結果。

## 7. 測試與 CI

新增可在無 Secret、無 Python Runtime、無外網的 CI 環境執行的測試：

- Dataset schema 與版本檢查。
- OLS、MAE、MSE、RMSE、R² 單元測試。
- Startup Random Forest TypeScript 推論與 Python golden samples 誤差檢查。
- API 正常、錯誤、邊界與超量 Body 測試。
- 九種特徵選擇結果完整性與 k 範圍檢查。
- 頁面、TypeScript、Lint、Build。

CI 至少執行：

```bash
npm ci
npm run prisma:generate
npm run lint
npx tsc --noEmit
npm run test
npm run build
```

若新增測試框架，優先採用 Vitest，避免建立第二套測試基礎。

## 8. Migration 狀態

Codex 開始盤點並移入來源檔案後，可將三個項目由 `planned` 更新為 `importing`；完成來源保存、Native 基礎與課程內容後才可更新為 `refactoring`。

本波次不得將任何項目設為：

- `ready_to_retire`
- `retired`

## 9. 完成定義

本波次 PR 最低需完成：

- 三個來源 Inventory 與 `migration.json`。
- 必要 Python／Notebook／資料產製程式移入。
- Regression Lab 共用能力層。
- 三個 Native 頁面與課程 chunk。
- Startup Random Forest 真實 TypeScript 推論。
- Feature Selection 基準結果與倫理模式。
- API、測試與 CI 全數通過。
- `DEVELOPMENT_RECORD.md` 與三份 Migration 任務文件更新。

舊 Repo README 導向、舊部署停止與 Archived 仍留待後續人工核准。