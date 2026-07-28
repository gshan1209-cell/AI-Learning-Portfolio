# Startup Profit Prediction
![alt text](Kaggle50.png)
## Demo網址:https://machinelearninghw6-2.streamlit.app/

## 1. Project Overview
本專案使用 Kaggle 50 Startups dataset，依照 CRISP-DM 六大步驟，建立 Random Forest Regression 模型 (並結合 Scikit-Learn Pipeline) 來預測新創公司利潤 (Profit)。這是一份從資料處理、模型建立到網頁與 API 部署的完整專案。

## 2. Business Problem
**How can we predict a startup company’s profit based on its spending in different business areas?**
新創公司通常資源有限，管理者需要知道資金應該投入在哪些地方，才能提高公司利潤。

## 3. Dataset Description
資料集來自 Kaggle，包含 5 個欄位：
- `R&D Spend`: 研發支出 (特徵)
- `Administration`: 行政管理支出 (特徵)
- `Marketing Spend`: 行銷支出 (特徵)
- `State`: 公司所在州別 (特徵)
- `Profit`: 公司利潤 (目標變數)

## 4. CRISP-DM Workflow
專案完全遵循標準機器學習工作流：
1. **Business Understanding**: 定義商業目標與問題。
2. **Data Understanding**: 執行 EDA (探索性資料分析)。
3. **Data Preparation**: 遺失值檢查、特徵與目標變數分離、切分 train/test (One-Hot Encoding 交由 Pipeline)。
4. **Modeling**: 使用 Scikit-Learn 建立 Pipeline (ColumnTransformer + RandomForestRegressor) 訓練模型。
5. **Evaluation**: 透過 MAE, MSE, RMSE, R² Score 進行驗證。
6. **Deployment**: 提供模型儲存、FastAPI 以及 Streamlit 應用程式。

## 5. Project Structure
```text
startup-profit-prediction/
├── data/
│   └── 50_Startups.csv
├── notebooks/
│   └── 01_startup_profit_crisp_dm.ipynb
├── models/
├── src/
├── app/
│   ├── streamlit_app.py
│   └── fastapi_app.py
├── outputs/
├── requirements.txt
└── README.md
```

## 6. Installation
請先確保您的環境安裝了 Python 3.10+。
```bash
pip install -r requirements.txt
```

## 7. How to Run Notebook
您可直接透過 Jupyter 開啟 Notebook 進行資料分析與模型訓練的學習。
```bash
jupyter notebook notebooks/01_startup_profit_crisp_dm.ipynb
```

## 8. How to Train Model
若要直接使用模組化腳本進行訓練與評估，您也可以開啟 Python 終端環境匯入 `src` 下的方法，不過最簡單的方法仍是執行上述 Notebook，它將會自動產生訓練好的 `.pkl` 模型至 `models/` 資料夾。

## 9. How to Run Streamlit App
在專案根目錄執行以下指令啟動前端網頁預測介面：
```bash
streamlit run app/streamlit_app.py
```

## 10. How to Run FastAPI App
執行以下指令啟動後端 API：
```bash
uvicorn app.fastapi_app:app --reload
```
可開啟瀏覽器前往 `http://127.0.0.1:8000/docs` 查看 Swagger 測試文件。

## 11. Model Evaluation
我們使用以下四個指標進行評估：
- **MAE**: 平均絕對誤差 (越低越好)
- **MSE**: 平均平方誤差 (越低越好)
- **RMSE**: 均方根誤差 (越低越好)
- **R² Score**: 模型解釋力 (越接近 1 越好)

*如果 R² 高，代表支出資料能很好解釋 Profit。*

## 12. Business Insights
1. **R&D Spend** 通常是最重要的 Profit 預測因素，具有高度正相關。
2. **Marketing Spend** 可能與 Profit 有關，但需要注意是否與 R&D Spend 相關。
3. **Administration** 對 Profit 的影響較弱。
4. **State** 可以作為輔助變數，但不應過度解讀。
5. 模型可協助新創公司初步估算利潤與規劃預算。
6. 模型結果應作為決策輔助，而不是唯一決策依據。

## 13. Limitations
1. 資料只有少量筆數，樣本數較少，模型可能受極端值影響較深。
2. 特徵欄位有限，沒有包含產業類別、員工人數、市場規模、競爭程度等因素。
3. Random Forest 雖然能捕捉非線性關係，但在訓練資料之外的範圍 (extrapolation) 預測能力較弱。
4. State 的影響可能受到樣本分布影響，不應過度解讀。
5. 模型適合作為教學與初步分析，**不適合直接用於高風險商業決策**。

## 14. Future Improvements
1. 增加更多 startup 資料。
2. 加入更多特徵，例如產業類別、員工數、成立年限、市場規模。
3. 嘗試引入 XGBoost 或 LightGBM 進一步提升模型表現。
4. 對 Random Forest 進行超參數調整 (Hyperparameter Tuning)。
5. 使用 Cross Validation (交叉驗證) 以提高模型評估客觀性。
6. 加入更多前處理步驟至 Pipeline (如 StandardScaler)。
7. 加入模型版本管理 (如 MLflow)。
8. 部署到雲端平台。