# ALP-MIG-013｜Adult Census Ensemble Income Predictor

## 1. 任務目標

將 `gshan1209-cell/L20-Ensemble-Model` 的 Adult Census Income Predictor 規格與 Next.js 基礎移植進 AI-Learning-Portfolio，完成可重現的真實 Ensemble 分類模型、Native 推論、模型比較、資料集說明與公平性治理。

本模組只作資料科學教學與模型風險展示，**不得用於實際就業、貸款、保險、住房、教育、福利、移民、治安或資格決策。**

## 2. 固定來源

- Repository：`gshan1209-cell/L20-Ensemble-Model`
- Branch：`main`
- Commit：`46f23c298da353ded39aca4cfa000c8df29589f4`
- Source Runtime：Next.js 14／TypeScript；規格預留 Python／scikit-learn／Postgres
- Dataset：UCI Adult／Census Income Dataset
- Target：`<=50K`／`>50K`

## 3. 來源成熟度與移植原則

來源 Repo 主要包含 README、開發規格與 Next.js 初始化骨架，尚不能把規格中的建議功能描述成已完成模型。

本 Migration 必須：

1. 保存來源規格與前端骨架。
2. 真正取得、版本化並驗證 Adult Dataset。
3. 真正執行 Python preprocessing、training、evaluation 與 artifact export。
4. 真正建立 TypeScript inference 與 Python Golden Samples。
5. 不得以固定機率、規則公式、隨機結果、假 Metrics 或 Mock Prediction 冒充 Ensemble Model。
6. 本波次不建立保存敏感個人資料的 Prediction Logs／Dashboard。
7. Postgres 只保留未來匿名 aggregate event schema，不執行正式資料庫 migration。

## 4. 目標模組

```text
modules/ensemble-income-predictor/
├── README.md
├── migration.json
├── source-reference/
├── python-reference/
│   ├── requirements.txt
│   ├── train_models.py
│   ├── evaluate_models.py
│   ├── export_model_artifacts.py
│   ├── fairness_metrics.py
│   └── tests/
├── data/
│   ├── adult.data.gz
│   ├── adult.test.gz
│   ├── DATASET_CARD.md
│   └── dataset-manifest.json
├── artifacts/
│   ├── preprocessing.json
│   ├── logistic-regression.json
│   ├── decision-tree.json
│   ├── random-forest.json
│   ├── gradient-boosting.json
│   ├── voting-classifier.json
│   ├── model-card.json
│   ├── metrics.json
│   ├── fairness-metrics.json
│   └── golden-samples.json
└── snapshots/
    └── aggregate-insights.json
```

Native 程式：

```text
src/lib/responsible-ai-lab/ensemble-income/
├── schema.ts
├── feature-policy.ts
├── preprocessing.ts
├── logistic-inference.ts
├── tree-inference.ts
├── forest-inference.ts
├── gradient-boosting-inference.ts
├── voting-inference.ts
├── predictor.ts
├── model-card.ts
├── metrics.ts
├── fairness.ts
└── types.ts

src/components/responsible-ai-lab/ensemble-income/
├── prediction-form.tsx
├── prediction-result.tsx
├── model-selector.tsx
├── model-comparison-table.tsx
├── confusion-matrix.tsx
├── fairness-dashboard.tsx
├── feature-policy-panel.tsx
└── dataset-card.tsx

src/app/responsible-ai-lab/ensemble-income/page.tsx
src/app/api/responsible-ai-lab/ensemble-income/model-card/route.ts
src/app/api/responsible-ai-lab/ensemble-income/metrics/route.ts
src/app/api/responsible-ai-lab/ensemble-income/predict/route.ts
```

## 5. Dataset 保存與資料卡

使用 UCI Adult Dataset 的固定版本，優先保存官方 train／test split 的 gzip 檔案。

`dataset-manifest.json` 最低欄位：

- datasetName；
- sourceOrganization；
- sourceUrl；
- retrievalDate；
- license／termsNote；
- trainFile／testFile；
- trainRows／testRows；
- sha256；
- targetColumn；
- missingValuePolicy；
- categoricalColumns；
- numericColumns；
- directSensitiveColumns；
- proxyRiskColumns；
- datasetLimitations；
- sourceRepository／sourceCommit。

`DATASET_CARD.md` 必須說明：

- 資料年代與歷史背景；
- 收入門檻為資料集原始的美元語境；
- `race`、`sex`、`native-country` 的敏感性；
- `marital-status`、`relationship`、`occupation`、`education` 等可能形成代理偏誤；
- `fnlwgt` 的 Census 權重語義；
- 缺失值 `?` 的處理；
- 不可用於個人高風險決策；
- 模型輸出不是個人價值、能力或真實未來收入的判定。

CI 不得從 UCI 即時下載 Dataset。

## 6. Feature Policy

提供兩種模式：

### 6.1 Responsible Mode（預設）

模型訓練與推論前排除直接敏感欄位：

- `race`；
- `sex`；
- `native-country`。

UI 不要求使用者輸入這三欄。公平性分析仍可使用測試資料中保留的群組標籤計算 aggregate metrics，但不得把敏感欄位傳入 Responsible Model。

頁面需提醒：即使移除直接敏感欄位，其他欄位仍可能是代理變數，並不代表模型已公平。

### 6.2 Historical Benchmark Mode

目的只限重現來源資料集常見 benchmark。

啟用條件：

- 使用者明確切換；
- 顯示警告 Modal／Checkbox；
- Request 必須包含 `acknowledgeHistoricalBenchmark: true`；
- 結果顯示敏感欄位已被模型使用；
- 不保存輸入；
- 不提供「更準確所以更好」的價值判斷。

未明確確認時 API 回 400。

## 7. Preprocessing

Python 與 TypeScript 必須使用同一份版本化 preprocessing artifact。

最低流程：

- 移除欄位前後的空白；
- 將 `?` 正規化為 missing；
- 固定缺失值處理策略；
- 數值欄位固定順序；
- 類別欄位固定 category vocabulary；
- `OneHotEncoder(handle_unknown="ignore")` 等價行為；
- 必要時輸出 scaler mean／scale；
- 固定 feature vector order；
- unknown category 不得造成 Runtime 崩潰；
- artifact 記錄 scikit-learn／Python 版本與資料 Hash。

禁止在 Native Runtime 重新推測 category order。

## 8. 模型訓練

固定 `random_seed=42`，使用官方 train／test split或文件化的固定 stratified split。

最低模型：

1. Logistic Regression；
2. Decision Tree；
3. Random Forest；
4. Gradient Boosting；
5. Voting Classifier。

每個模式（Responsible／Historical）分別訓練或提供明確 artifact，不可共用錯誤 feature vector。

模型參數、版本與訓練結果全部寫入 artifact，不得硬編碼在 UI。

## 9. Artifact Export 與 TypeScript 推論

### 9.1 Logistic Regression

匯出：

- coefficients；
- intercept；
- classes；
- featureOrder；
- probability function metadata。

TypeScript 實作 sigmoid／binary probability。

### 9.2 Decision Tree／Random Forest

匯出完整樹節點：

- childrenLeft／childrenRight；
- feature；
- threshold；
- classCounts／probabilities；
- tree weights。

### 9.3 Gradient Boosting

匯出：

- initial log odds／base score；
- learningRate；
- 每階段樹結構；
- class mapping；
- probability transform。

### 9.4 Voting Classifier

匯出：

- voting mode；
- member model IDs；
- weights；
- class order；
- probability aggregation rule。

TypeScript 不得以固定權重公式取代未匯出的 member model。

## 10. Golden Samples

建立至少 24 筆 Golden Samples：

- Responsible／Historical 各至少 12 筆；
- 涵蓋不同 age、education、occupation、hours、capital gain／loss；
- 涵蓋 unknown category；
- 涵蓋 `<=50K`／`>50K`；
- Historical 涵蓋不同敏感群組但不包含真實個人識別資料。

每筆記錄：

- mode；
- modelId；
- input；
- expectedClass；
- expectedProbability；
- preprocessingVersion；
- modelVersion。

TypeScript／Python 驗收：

- class 必須完全一致；
- probability 差異 `< 1e-5`，如浮點策略不同可在文件化後放寬至 `< 1e-4`；
- 不得以同一 TypeScript 實作自行生成 expected value。

## 11. Metrics 與公平性

每個模型、每個模式至少提供：

- Accuracy；
- Precision；
- Recall；
- F1；
- Confusion Matrix；
- Test Row Count；
- Positive Class Rate；
- TrainedAt；
- Dataset Hash；
- Model Version。

公平性 aggregate metrics 至少依 `sex` 與 `race` 群組提供：

- group sample count；
- positive prediction rate；
- true positive rate；
- false positive rate；
- precision；
- recall；
- selection rate ratio／difference；
- equal opportunity difference；
- insufficient sample warning。

說明：

- 指標是描述與風險診斷，不是公平證明；
- 小樣本群組需警告；
- 不建立個人層級公平分數；
- UI 不以單一綠色分數宣稱「模型公平」。

## 12. Prediction API

### `POST /api/responsible-ai-lab/ensemble-income/predict`

Request Body 最大 16 KB，拒絕額外欄位。

共同欄位：

- `mode`：`responsible|historical`；
- `modelId`：Artifact Allowlist；
- `age`：17～90；
- `workclass`：Artifact Category Allowlist；
- `education`：Allowlist；
- `maritalStatus`：Allowlist；
- `occupation`：Allowlist；
- `relationship`：Allowlist；
- `capitalGain`：0～99999；
- `capitalLoss`：0～99999；
- `hoursPerWeek`：1～99。

Historical Only：

- `race`；
- `sex`；
- `nativeCountry`；
- `acknowledgeHistoricalBenchmark=true`。

Responsible Mode：

- 傳入 `race`／`sex`／`nativeCountry` 必須回 400，不可默默忽略。

Response：

```json
{
  "prediction": ">50K",
  "probability": 0.82,
  "mode": "responsible",
  "modelId": "voting-classifier",
  "modelVersion": "adult-responsible-v1.0.0",
  "preprocessingVersion": "adult-preprocess-v1.0.0",
  "datasetVersion": "uci-adult-fixed",
  "notice": "Educational model output only; not for individual decisions."
}
```

禁止：

- 回傳「適合錄用」「信用良好」「值得貸款」等判斷；
- 產生建議行動；
- 保存完整 Request；
- 將模型機率描述為真實收入機率或人生成功機率。

## 13. Model Card API

### `GET /api/responsible-ai-lab/ensemble-income/model-card`

回傳：

- Dataset Card 摘要；
- Models；
- Modes；
- Sensitive Feature Policy；
- Intended Use；
- Prohibited Use；
- Metrics Version；
- Artifact Hashes；
- Training Environment；
- Known Limitations。

### `GET /api/responsible-ai-lab/ensemble-income/metrics`

Query：

- `mode=responsible|historical`；
- `model=<allowlisted model id>`。

只回傳 aggregate metrics，不回傳資料列。

## 14. Native 頁面最低功能

- Dataset Card；
- Responsible／Historical Mode 切換與警告；
- 模型選擇；
- 預測表單；
- 結果卡片與機率；
- 模型版本／Dataset Hash／Mode；
- 五模型比較表；
- Confusion Matrix；
- Fairness Dashboard；
- Direct Sensitive／Proxy Risk 欄位說明；
- 不適用情境；
- Python 訓練與 TypeScript 推論流程圖；
- 手機版側欄隱藏或改為 Drawer，不產生水平捲軸。

本波次不建立個人 Prediction Logs 列表。

## 15. 課程

建立 `ensemble-income-predictor` 六段式課程，至少涵蓋：

- Classification 與 Probability；
- Logistic／Tree／Forest／Boosting／Voting；
- Preprocessing 與 One-hot；
- Confusion Matrix、Precision、Recall、F1；
- Python Training／Artifact Export／TypeScript Inference；
- Direct Sensitive Features 與 Proxy Variables；
- Historical Bias；
- Fairness Metrics 的限制；
- 高風險決策禁止；
- 至少 3 題測驗與解析。

## 16. 測試與 CI

最低測試：

- Dataset Hash、Rows、Columns、Target 與 License metadata；
- Python exporter deterministic；
- Preprocessing vector order；
- Unknown category；
- 五種模型 artifact schema；
- Responsible／Historical artifact feature 數一致；
- TypeScript／Python Golden Samples；
- 五模型 metrics 完整性；
- Confusion Matrix 合計等於 test rows；
- Responsible Mode 排除 `race`／`sex`／`native-country`；
- Responsible API 拒絕敏感欄位；
- Historical API 無確認時拒絕；
- Fairness group count 與 metric range；
- Body Size、數值邊界、category allowlist、額外欄位；
- API 不回傳原始資料列；
- 不建立 Prediction Log；
- Python tests、TypeScript、Lint、Build。

CI 不得從 UCI 下載 Dataset，不得連線 Postgres。

## 17. Migration 狀態與退役門檻

完成 Dataset、真實模型、Artifact、Native 推論、課程與測試後可設為 `refactoring`。

以下完成前不可設為 `ready_to_retire`：

- 使用者驗收所有五模型與兩種模式；
- 瀏覽器表單、RWD 與 Accessibility；
- Dataset License／Terms 人工確認；
- 舊 Vercel 或來源部署導向／停止；
- README 搬遷公告；
- 使用者人工核准 Archived。