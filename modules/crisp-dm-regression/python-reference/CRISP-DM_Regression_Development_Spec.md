# 開發規格書：使用 CRISP-DM 解決多元迴歸 Regression Problem

## 1. 專案名稱

**CRISP-DM Regression Learning System**

---

## 2. 專案目標

本專案目標是建立一套教學型機器學習系統，使用 **CRISP-DM 方法論**完整示範如何解決迴歸型問題。

系統需包含兩個主要案例：

1. **Stock Price Prediction**
   - 股票代號：`2330.TW`
   - 任務類型：Auto Regression / Time Series Regression
   - 目標：根據歷史股價資料預測未來股價。

2. **Startup 50 Profit Prediction**
   - 資料來源：Kaggle Startup 50 Dataset
   - 任務類型：Multiple Linear Regression
   - 目標：根據公司研發支出、行政支出、行銷支出、地區等特徵預測公司利潤。

本系統需讓初學者理解：

- 什麼是 Regression Problem
- CRISP-DM 如何應用在機器學習專案
- 資料載入、視覺化、前處理、建模、評估、優化、部署的完整流程
- MSE、MAE、R² 的意義
- Overfitting / Underfitting 的判斷方式
- 如何使用 Optuna 優化模型
- 如何使用 Pickle / Gzip 儲存與部署模型

---

## 3. 使用技術

### 3.1 程式語言

- Python 3.10+

### 3.2 主要套件

```txt
pandas
numpy
matplotlib
seaborn
scikit-learn
yfinance
optuna
pickle
gzip
joblib
streamlit
fastapi
uvicorn
```

### 3.3 可選擇部署方式

系統至少支援以下其中一種部署方式：

1. Streamlit Web App
2. FastAPI API Service
3. Jupyter Notebook 教學版
4. Python Script CLI 版

---

## 4. 專案架構

建議專案目錄如下：

```txt
crispdm-regression-project/
│
├── data/
│   ├── raw/
│   │   └── 50_Startups.csv
│   ├── processed/
│   │   ├── startup_processed.csv
│   │   └── stock_2330_processed.csv
│
├── notebooks/
│   ├── 01_stock_price_regression.ipynb
│   └── 02_startup_50_regression.ipynb
│
├── src/
│   ├── data_loader.py
│   ├── preprocessing.py
│   ├── visualization.py
│   ├── model.py
│   ├── evaluation.py
│   ├── optimization.py
│   └── deployment.py
│
├── models/
│   ├── startup_model.pkl
│   ├── startup_model.pkl.gz
│   ├── stock_model.pkl
│   └── stock_model.pkl.gz
│
├── app/
│   ├── streamlit_app.py
│   └── fastapi_app.py
│
├── requirements.txt
└── README.md
```

---

## 5. CRISP-DM 開發流程

本專案需依照 CRISP-DM 六大階段開發：

1. Business Understanding
2. Data Understanding
3. Data Preparation
4. Modeling
5. Evaluation
6. Deployment

在教學呈現上，可對應成以下五個實作 Step：

- Step 1：Load Data + Generate Scatter Plot
- Step 2：Preprocessing
- Step 3：Build Model
- Step 4：Evaluation + Optimization
- Step 5：Deployment

---

# 6. Case 1：2330.TW Stock Price Prediction

## 6.1 Business Understanding

### 問題定義

使用台積電股票 `2330.TW` 的歷史股價資料，建立自迴歸模型，預測未來收盤價。

### 任務類型

```txt
Regression Problem
Time Series Regression
Auto Regression
```

### 預測目標

```txt
Target Variable: Close Price
```

### 可能使用的特徵

```txt
Open
High
Low
Close
Volume
MA_5
MA_10
MA_20
Return
Lag_1_Close
Lag_2_Close
Lag_3_Close
```

---

## 6.2 Data Understanding

### 資料來源

使用 `yfinance` 下載股票資料。

```python
import yfinance as yf

df = yf.download("2330.TW", start="2020-01-01", end="2026-01-01")
```

### 需要產生的圖表

1. Close Price Line Chart
2. Volume Chart
3. Moving Average Chart
4. Random Data Scatter Plot
5. Feature vs Target Scatter Plot
6. Train / Test Prediction Curve

---

## 6.3 Step 1：Load Data + Generate Random Data Scatter Plot

### 功能需求

系統需提供資料載入功能：

```python
load_stock_data(ticker, start_date, end_date)
```

輸入：

```txt
ticker: 股票代號，例如 2330.TW
start_date: 開始日期
end_date: 結束日期
```

輸出：

```txt
DataFrame，包含 Open, High, Low, Close, Volume
```

### Random Data Scatter Plot

系統需產生簡單隨機資料，讓使用者理解迴歸概念。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.random.uniform(-100, 100, 200)
a = np.random.uniform(-50, 50)
b = np.random.uniform(0, 100)
noise = np.random.normal(0, 300, 200)

y = a * x + b + noise

plt.scatter(x, y)
plt.xlabel("X")
plt.ylabel("Y")
plt.title("Random Regression Data Scatter Plot")
plt.show()
```

### 教學重點

```txt
迴歸問題的目標是找到一條線或曲線，
讓模型可以根據 X 預測 Y。
```

---

## 6.4 Step 2：Preprocessing

### 6.4.1 缺失值處理

股票資料可能因假日或資料缺漏產生 NaN。

需支援：

```python
df.dropna()
df.fillna(method="ffill")
```

### 6.4.2 Feature Engineering

需產生以下特徵：

```python
df["MA_5"] = df["Close"].rolling(window=5).mean()
df["MA_10"] = df["Close"].rolling(window=10).mean()
df["MA_20"] = df["Close"].rolling(window=20).mean()

df["Return"] = df["Close"].pct_change()

df["Lag_1_Close"] = df["Close"].shift(1)
df["Lag_2_Close"] = df["Close"].shift(2)
df["Lag_3_Close"] = df["Close"].shift(3)
```

### 6.4.3 Train Test Split 的必要性

系統需說明：

```txt
Train Set 用來訓練模型。
Test Set 用來檢查模型是否真的能預測沒看過的資料。

如果只用同一份資料訓練與測試，模型可能只是記住答案，
而不是真的學到規律。
```

### 6.4.4 Time Series Split 注意事項

股價資料不可隨機切分，需保留時間順序。

錯誤方式：

```python
train_test_split(X, y, shuffle=True)
```

正確方式：

```python
split_index = int(len(df) * 0.8)

train = df.iloc[:split_index]
test = df.iloc[split_index:]
```

### 6.4.5 Change Type and Reshape

模型輸入需轉成數值型態。

```python
X = X.astype(float)
y = y.astype(float)
```

若只有單一特徵，需 reshape：

```python
X = X.values.reshape(-1, 1)
```

---

## 6.5 Step 3：Build Model

### 基礎模型

需至少支援：

```python
LinearRegression
RandomForestRegressor
GradientBoostingRegressor
```

### 股票預測範例

```python
from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
```

### 模型輸出

模型需輸出：

```txt
預測股價
實際股價
誤差
評估指標
預測曲線圖
```

---

## 6.6 Step 4：Evaluation

### 必須支援的指標

#### MSE

Mean Squared Error，平均平方誤差。

```txt
MSE 會放大大錯誤。
數值越小，代表模型預測越準。
```

#### MAE

Mean Absolute Error，平均絕對誤差。

```txt
MAE 可以理解成平均預測差多少錢。
例如 MAE = 5，代表平均預測誤差約 5 元。
```

#### R²

Coefficient of Determination，決定係數。

```txt
R² 越接近 1，代表模型解釋能力越好。
R² = 0 代表模型跟直接猜平均值差不多。
R² < 0 代表模型比猜平均值還差。
```

### 評估程式

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
```

---

## 6.7 Overfitting / Underfitting 判斷

系統需畫出：

```txt
Training Error Curve
Test Error Curve
Learning Curve
Prediction Curve
```

### Overfitting 判斷

```txt
Training Error 很低
Test Error 很高
代表模型在訓練資料表現很好，
但遇到新資料表現很差。
```

### Underfitting 判斷

```txt
Training Error 高
Test Error 也高
代表模型太簡單，連訓練資料都學不好。
```

### 良好模型

```txt
Training Error 和 Test Error 都低，
而且兩者差距不大。
```

---

## 6.8 Optuna 模型優化

系統需支援 Optuna 自動搜尋最佳參數。

```python
import optuna
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

def objective(trial):
    n_estimators = trial.suggest_int("n_estimators", 50, 300)
    max_depth = trial.suggest_int("max_depth", 2, 20)

    model = RandomForestRegressor(
        n_estimators=n_estimators,
        max_depth=max_depth,
        random_state=42
    )

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    mse = mean_squared_error(y_test, y_pred)

    return mse

study = optuna.create_study(direction="minimize")
study.optimize(objective, n_trials=50)

print(study.best_params)
```

---

## 6.9 Step 5：Deployment

### 模型儲存

需支援 Pickle：

```python
import pickle

with open("models/stock_model.pkl", "wb") as f:
    pickle.dump(model, f)
```

### Gzip 壓縮模型

```python
import gzip
import pickle

with gzip.open("models/stock_model.pkl.gz", "wb") as f:
    pickle.dump(model, f)
```

### 載入模型

```python
with gzip.open("models/stock_model.pkl.gz", "rb") as f:
    model = pickle.load(f)
```

### FastAPI 預測 API

```python
from fastapi import FastAPI
import gzip
import pickle
import numpy as np

app = FastAPI()

with gzip.open("models/stock_model.pkl.gz", "rb") as f:
    model = pickle.load(f)

@app.post("/predict")
def predict(features: list[float]):
    X = np.array(features).reshape(1, -1)
    prediction = model.predict(X)
    return {
        "prediction": float(prediction[0])
    }
```

---

# 7. Case 2：Startup 50 Multiple Linear Regression

## 7.1 Business Understanding

### 問題定義

根據新創公司的支出資料與所在地區，預測公司利潤。

### 任務類型

```txt
Multiple Linear Regression
Regression Problem
```

### 預測目標

```txt
Target Variable: Profit
```

### 特徵欄位

```txt
R&D Spend
Administration
Marketing Spend
State
```

其中：

```txt
State 是類別型欄位，需要 One-Hot Encoding。
```

---

## 7.2 Data Understanding

### 資料來源

Kaggle Startup 50 Dataset。

檔案名稱：

```txt
50_Startups.csv
```

常見欄位：

```txt
R&D Spend
Administration
Marketing Spend
State
Profit
```

### 需要產生的圖表

1. R&D Spend vs Profit Scatter Plot
2. Marketing Spend vs Profit Scatter Plot
3. Administration vs Profit Scatter Plot
4. Correlation Heatmap
5. Actual vs Predicted Plot
6. Training / Test Error Curve

---

## 7.3 Step 1：Load Data + Scatter Plot

### 功能需求

```python
load_startup_data(file_path)
```

輸入：

```txt
data/raw/50_Startups.csv
```

輸出：

```txt
DataFrame
```

### Scatter Plot 範例

```python
plt.scatter(df["R&D Spend"], df["Profit"])
plt.xlabel("R&D Spend")
plt.ylabel("Profit")
plt.title("R&D Spend vs Profit")
plt.show()
```

### 教學說明

```txt
如果散佈圖呈現明顯向上趨勢，
代表該特徵可能與 Profit 有正相關。
```

---

## 7.4 Step 2：Preprocessing

### 7.4.1 One-Hot Encoding for Nominal Features

`State` 是名目型類別資料，不能直接丟進線性迴歸模型。

錯誤資料：

```txt
New York
California
Florida
```

需轉換為：

```txt
State_New York
State_California
State_Florida
```

程式範例：

```python
df = pd.get_dummies(df, columns=["State"], drop_first=True)
```

### 7.4.2 Train Test Split

Startup 50 不是時間序列資料，因此可以隨機切分。

```python
from sklearn.model_selection import train_test_split

X = df.drop("Profit", axis=1)
y = df["Profit"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)
```

### 7.4.3 Change Type

```python
X_train = X_train.astype(float)
X_test = X_test.astype(float)
y_train = y_train.astype(float)
y_test = y_test.astype(float)
```

### 7.4.4 Reshape

如果模型輸入只有單一特徵，需要：

```python
X = X.values.reshape(-1, 1)
```

如果是多特徵資料，通常不需要 reshape。

---

## 7.5 Step 3：Build Model

### Multiple Linear Regression

```python
from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
```

### 需要輸出

```txt
模型係數 coefficients
模型截距 intercept
預測結果 predictions
實際值 actual values
誤差 metrics
```

### 係數解讀

系統需提供白話說明：

```txt
係數代表當某個特徵增加 1 單位時，
在其他條件不變的情況下，
Profit 預測值會增加或減少多少。
```

例如：

```txt
R&D Spend 的係數越大，
代表研發支出對 Profit 的影響越明顯。
```

---

## 7.6 Step 4：Evaluation

### 指標需求

系統需計算：

```txt
MSE
MAE
R²
```

### 程式範例

```python
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("MSE:", mse)
print("MAE:", mae)
print("R2:", r2)
```

### Actual vs Predicted Plot

```python
plt.scatter(y_test, y_pred)
plt.xlabel("Actual Profit")
plt.ylabel("Predicted Profit")
plt.title("Actual vs Predicted Profit")
plt.show()
```

### 判斷方式

```txt
如果點越接近斜對角線，
代表預測越準。
```

---

## 7.7 Overfitting / Underfitting

Startup 50 資料量較小，容易出現 overfitting。

系統需提醒：

```txt
資料筆數太少時，模型可能會過度記住訓練資料。
因此需要觀察 Train Score 和 Test Score 的差距。
```

### 判斷邏輯

```python
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)

print("Train R2:", train_score)
print("Test R2:", test_score)
```

判斷：

```txt
Train R² 高，Test R² 低：Overfitting
Train R² 低，Test R² 低：Underfitting
Train R² 和 Test R² 都高且接近：模型表現良好
```

---

## 7.8 Optuna 優化

線性迴歸本身可調參數較少，因此可加入以下模型進行優化比較：

```txt
Ridge Regression
Lasso Regression
RandomForestRegressor
GradientBoostingRegressor
```

### Ridge + Optuna 範例

```python
import optuna
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error

def objective(trial):
    alpha = trial.suggest_float("alpha", 0.001, 100.0, log=True)

    model = Ridge(alpha=alpha)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)

    return mse

study = optuna.create_study(direction="minimize")
study.optimize(objective, n_trials=50)

print(study.best_params)
```

---

## 7.9 Step 5：Deployment

### 儲存模型

```python
import pickle

with open("models/startup_model.pkl", "wb") as f:
    pickle.dump(model, f)
```

### Gzip 儲存模型

```python
import gzip
import pickle

with gzip.open("models/startup_model.pkl.gz", "wb") as f:
    pickle.dump(model, f)
```

### 載入模型

```python
with gzip.open("models/startup_model.pkl.gz", "rb") as f:
    model = pickle.load(f)
```

### FastAPI 預測 API

```python
from fastapi import FastAPI
from pydantic import BaseModel
import gzip
import pickle
import pandas as pd

app = FastAPI()

with gzip.open("models/startup_model.pkl.gz", "rb") as f:
    model = pickle.load(f)

class StartupInput(BaseModel):
    rd_spend: float
    administration: float
    marketing_spend: float
    state: str

@app.post("/predict-startup")
def predict_startup(data: StartupInput):
    input_df = pd.DataFrame([{
        "R&D Spend": data.rd_spend,
        "Administration": data.administration,
        "Marketing Spend": data.marketing_spend,
        "State": data.state
    }])

    input_df = pd.get_dummies(input_df)

    prediction = model.predict(input_df)

    return {
        "predicted_profit": float(prediction[0])
    }
```

注意：

```txt
部署時 One-Hot Encoding 欄位必須與訓練時一致。
建議使用 sklearn Pipeline 或 ColumnTransformer 保存完整前處理流程。
```

---

## 8. 建議使用 Pipeline 改善部署穩定性

為避免部署時欄位不一致，建議使用 Pipeline。

### Startup 50 Pipeline 範例

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression

numeric_features = [
    "R&D Spend",
    "Administration",
    "Marketing Spend"
]

categorical_features = [
    "State"
]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(drop="first", handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numeric_features)
    ]
)

model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("regressor", LinearRegression())
    ]
)

model.fit(X_train, y_train)
```

優點：

```txt
前處理與模型綁在一起。
部署時不用重新手動做 One-Hot Encoding。
比較不容易發生欄位缺失或順序錯誤。
```

---

## 9. Streamlit 教學介面需求

系統可提供 Streamlit 介面，讓使用者選擇不同案例。

### 9.1 頁面功能

左側 Sidebar：

```txt
選擇案例：
- 2330.TW Stock Price Prediction
- Startup 50 Profit Prediction
```

主畫面需包含：

```txt
1. CRISP-DM 流程說明
2. 資料預覽
3. Scatter Plot
4. Preprocessing 說明
5. Model Training
6. Evaluation Metrics
7. Training/Test Curve
8. Actual vs Predicted Plot
9. Model Download
10. Prediction Demo
```

---

## 10. API 規格

### 10.1 Stock Prediction API

Endpoint：

```txt
POST /predict-stock
```

Input：

```json
{
  "open": 600.0,
  "high": 610.0,
  "low": 595.0,
  "volume": 35000000,
  "ma_5": 602.3,
  "ma_10": 598.7,
  "ma_20": 590.2,
  "return": 0.012,
  "lag_1_close": 600.0,
  "lag_2_close": 596.0,
  "lag_3_close": 590.0
}
```

Output：

```json
{
  "predicted_close": 604.52
}
```

---

### 10.2 Startup Prediction API

Endpoint：

```txt
POST /predict-startup
```

Input：

```json
{
  "rd_spend": 165349.2,
  "administration": 136897.8,
  "marketing_spend": 471784.1,
  "state": "New York"
}
```

Output：

```json
{
  "predicted_profit": 192261.83
}
```

---

## 11. 評估報告輸出需求

系統需自動產生模型評估報告。

報告內容包含：

```txt
模型名稱
資料集名稱
訓練資料筆數
測試資料筆數
使用特徵
Target
MSE
MAE
R²
Train R²
Test R²
是否可能 Overfitting
是否可能 Underfitting
最佳參數
模型儲存路徑
```

範例格式：

```json
{
  "dataset": "Startup 50",
  "model": "Linear Regression",
  "target": "Profit",
  "mse": 78432123.21,
  "mae": 7210.45,
  "r2": 0.91,
  "train_r2": 0.95,
  "test_r2": 0.91,
  "diagnosis": "Good Fit",
  "model_path": "models/startup_model.pkl.gz"
}
```

---

## 12. 教學說明文字需求

系統需在每個步驟加入白話教學說明。

### Step 1 教學說明

```txt
這一步是先把資料讀進來，並用圖表觀察資料長什麼樣子。
在機器學習中，不要一開始就急著訓練模型，
先看懂資料，比直接建模更重要。
```

### Step 2 教學說明

```txt
資料前處理是把原始資料整理成模型看得懂的格式。
例如文字類別要轉成數字，缺失值要處理，
資料型態要正確，訓練集與測試集也要分開。
```

### Step 3 教學說明

```txt
建模就是讓模型從資料中學習 X 和 y 之間的關係。
在迴歸問題中，模型的目標是預測一個連續數值。
```

### Step 4 教學說明

```txt
模型訓練完後，不能只看預測結果感覺準不準，
需要用 MSE、MAE、R² 等指標客觀評估。
也要觀察模型是否 overfit 或 underfit。
```

### Step 5 教學說明

```txt
部署是把訓練好的模型保存起來，
讓其他程式或使用者可以輸入新資料並取得預測結果。
Pickle 可以儲存模型，Gzip 可以壓縮模型檔案大小。
```

---

## 13. 最低可交付成果 MVP

MVP 版本需完成：

```txt
1. 可載入 Startup 50 Dataset
2. 可載入 2330.TW 股價資料
3. 可產生 Scatter Plot
4. 可完成 One-Hot Encoding
5. 可完成 Train Test Split
6. 可訓練 Linear Regression 模型
7. 可輸出 MSE、MAE、R²
8. 可畫 Actual vs Predicted 圖
9. 可判斷 Overfitting / Underfitting
10. 可用 Pickle + Gzip 儲存模型
```

---

## 14. 進階版本需求

進階版可加入：

```txt
1. Optuna 自動調參
2. RandomForestRegressor
3. GradientBoostingRegressor
4. Ridge / Lasso Regression
5. Streamlit 互動式教學介面
6. FastAPI 預測 API
7. 模型評估報告自動輸出
8. 模型下載功能
9. 使用者輸入資料即時預測
10. Learning Curve 視覺化
```

---

## 15. 驗收標準

### 15.1 功能驗收

系統完成後需符合：

```txt
可以成功載入資料
可以完成資料前處理
可以成功訓練模型
可以成功產生預測結果
可以成功計算 MSE、MAE、R²
可以成功畫出訓練與測試曲線
可以成功儲存 .pkl 與 .pkl.gz 模型
可以成功載入模型並進行新資料預測
```

### 15.2 教學驗收

系統需讓初學者理解：

```txt
什麼是迴歸問題
為什麼需要 Train Test Split
什麼是 One-Hot Encoding
MSE、MAE、R² 各代表什麼
怎麼判斷 Overfitting 與 Underfitting
Optuna 為什麼可以幫助模型優化
Pickle / Gzip 在部署中的作用
```

---

## 16. 注意事項

### 16.1 股票預測限制

股價預測僅作為機器學習教學用途，不應作為投資建議。

系統需顯示提醒：

```txt
本預測結果僅供教學與研究用途，不構成任何投資建議。
股票市場受大量不可控因素影響，模型預測不保證準確。
```

### 16.2 Startup 50 資料限制

Startup 50 Dataset 資料量較小，模型結果容易受到資料切分方式影響。

系統需顯示提醒：

```txt
此資料集適合用於教學 Multiple Linear Regression，
但資料量較少，不適合直接代表真實商業預測場景。
```

### 16.3 部署注意事項

部署時需保存：

```txt
模型本體
欄位順序
前處理流程
One-Hot Encoding 規則
模型版本
訓練日期
評估結果
```

建議使用：

```txt
sklearn Pipeline
ColumnTransformer
Pickle / Joblib
Gzip Compression
```

---

## 17. 最終成果

本專案完成後，使用者可以透過完整 CRISP-DM 流程學會如何處理迴歸問題，並能實作：

```txt
2330.TW 股價預測
Startup 50 利潤預測
資料視覺化
資料前處理
多元線性迴歸
模型評估
過擬合與欠擬合判斷
Optuna 模型優化
Pickle / Gzip 模型部署
API 或 Web App 預測服務
```
