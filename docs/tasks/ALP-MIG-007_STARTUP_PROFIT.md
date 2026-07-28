# ALP-MIG-007｜Startup Profit Prediction 移植

## 任務目標

將 `gshan1209-cell/machinelearningHw6-2` 的 50 Startups 資料、CRISP-DM 教材、Random Forest Pipeline、Streamlit／FastAPI、Notebook、模型訓練與推論流程移入 AI-Learning-Portfolio，建立不依賴舊部署的 Native 預測器。

## 目前狀態

**`planned`**

完成 Inventory 並開始移入來源檔案後更新為 `importing`；Native 推論與課程基礎完成後更新為 `refactoring`。

## 來源盤點要求

至少盤點並保存：

- `README.md`
- `requirements.txt`
- `data/50_Startups.csv`
- `notebooks/01_startup_profit_crisp_dm.ipynb`
- `app/streamlit_app.py`
- `app/fastapi_app.py`
- `src/` 內訓練、預測與前處理程式
- 模型 artifact 與產製方式
- Demo 與部署說明

建立：

```text
modules/startup-profit-prediction/
├── README.md
├── migration.json
├── python-reference/
├── data/
├── artifacts/
└── docs/
```

## Native 功能

建立 `/regression-lab/startup-profit`，至少包含：

1. 50 Startups 欄位與資料限制說明。
2. R&D、Administration、Marketing 與 Profit 的資料探索。
3. State 類別欄位與 One-Hot Encoding 解說。
4. CRISP-DM 六階段共用時間軸。
5. Random Forest Pipeline 架構圖。
6. 可操作預測表單。
7. MAE、MSE、RMSE、R² 與 Train／Test 比較。
8. 特徵重要性與不可過度因果解讀的說明。
9. 至少 3 題測驗與解析。

## 真實 Native 推論要求

不得以固定答案、線性公式或隨機數冒充 Random Forest。

實作方式：

1. 使用來源 Python Pipeline 以固定 seed 訓練。
2. 將 One-Hot Encoding 欄位順序、每棵樹節點、threshold、children 與 leaf value 匯出為版本化 JSON。
3. 在 TypeScript 中實作 Random Forest inference。
4. 建立 Python golden samples，至少涵蓋：
   - 三個州別
   - 低、中、高支出
   - 邊界值
5. TypeScript 與 Python 預測結果必須在設定誤差內一致。

Artifact metadata 至少包含：

- sourceRepository
- sourceCommit
- datasetHash
- seed
- featureOrder
- categoricalEncoding
- modelParameters
- trainingMetrics
- generatedAt

## API

建立：

`POST /api/ml-lab/startup-profit/predict`

輸入：

- `rdSpend`
- `administration`
- `marketingSpend`
- `state`

規則：

- 所有金額必須是有限、非負數，並設定合理上限。
- State 只能使用資料集白名單。
- Reject `NaN`、`Infinity`、字串注入與多餘大型欄位。
- Request Body 設定大小限制。
- 回傳模型版本、預測值與使用限制，不回傳內部檔案路徑。

## 教學與倫理

固定標示：

- 資料集樣本數少且欄位有限。
- Random Forest 對訓練範圍外的外插能力弱。
- 特徵重要性不是因果關係。
- 結果只供教學與初步分析，不應直接作為投資、融資、人事或營運決策。

## 驗收

- [ ] 來源必要程式、Notebook、資料與文件已移入
- [ ] `migration.json` 完整
- [ ] Random Forest 已匯出版本化 JSON
- [ ] TypeScript 真實推論完成
- [ ] Python golden samples 對照通過
- [ ] API 正常、錯誤與邊界測試通過
- [ ] Native 表單與圖表 RWD 正常
- [ ] 三題以上測驗與解析
- [ ] Lint／TypeScript／Test／Build 通過
- [ ] 維持 `refactoring`，不得提前退役