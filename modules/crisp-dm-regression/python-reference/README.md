# CRISP-DM Regression Learning System

這是一個教學型的機器學習系統，旨在透過 **CRISP-DM 方法論** 完整示範如何解決迴歸型 (Regression) 問題。

## 專案目標

本專案協助初學者理解：
- 什麼是 Regression Problem
- CRISP-DM 如何應用在機器學習專案
- 資料載入、視覺化、前處理、建模、評估、優化、部署的完整流程
- MSE、MAE、R² 的意義
- Overfitting / Underfitting 的判斷方式
- 如何使用 Optuna 優化模型
- 如何使用 Pickle / Gzip 儲存與部署模型

## 實作案例

專案包含兩個主要案例：

1. **Stock Price Prediction (台積電 2330.TW)**
   - 任務類型：Auto Regression / Time Series Regression
   - 目標：根據歷史股價資料與衍生特徵 (MA, Lag) 預測未來股價。

2. **Startup 50 Profit Prediction**
   - 任務類型：Multiple Linear Regression
   - 目標：根據公司研發支出、行政支出、行銷支出、地區等特徵預測公司利潤。

## 專案架構

```txt
crispdm-regression-project/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
│   ├── 01_stock_price_regression.ipynb
│   └── 02_startup_50_regression.ipynb
├── src/
│   ├── data_loader.py
│   ├── preprocessing.py
│   ├── model.py
│   ├── evaluation.py
│   └── deployment.py
├── models/
│   ├── startup_model.pkl.gz
│   └── stock_model.pkl.gz
├── app/
│   ├── streamlit_app.py
│   └── fastapi_app.py
├── requirements.txt
└── README.md
```

## 安裝與執行

### 1. 安裝依賴套件

請確保您的 Python 版本為 3.10+，接著安裝需要的套件：

```bash
pip install -r requirements.txt
```

### 2. 啟動互動式教學介面 (Streamlit)

我們提供了一個互動式的教學介面，您可以選擇不同的案例來學習：

```bash
streamlit run app/streamlit_app.py
```

### 3. 啟動模型預測 API (FastAPI)

如果您想要測試部署的 API 服務：

```bash
uvicorn app.fastapi_app:app --reload
```
啟動後可以前往 `http://127.0.0.1:8000/docs` 使用自動生成的 Swagger UI 進行測試：
- `/predict-stock`: 預測股票收盤價
- `/predict-startup`: 預測新創公司利潤

## 學習資源
- `notebooks/`: 包含詳細註解與執行步驟的 Jupyter Notebook，建議初學者先從這裡開始學習。
- `DEVELOPMENT_LOG.md`: 記錄專案開發進度與歷史軌跡。
- `CRISP-DM_Regression_Development_Spec.md`: 專案的詳細開發規格與需求說明。

---
**免責聲明**：
股價預測僅作為機器學習教學用途，不應作為投資建議。股票市場受大量不可控因素影響，模型預測不保證準確。
