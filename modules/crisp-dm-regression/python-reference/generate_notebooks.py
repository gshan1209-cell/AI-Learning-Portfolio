import json
import os

def create_notebook(cells, filename):
    nb = {
        "cells": cells,
        "metadata": {},
        "nbformat": 4,
        "nbformat_minor": 5
    }
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(nb, f, indent=2, ensure_ascii=False)

def markdown_cell(source):
    # Ensure source ends with newline for proper formatting except the last one
    lines = source.strip().split("\n")
    formatted_source = [line + "\n" for line in lines[:-1]] + [lines[-1]] if lines else []
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": formatted_source
    }

def code_cell(source):
    lines = source.strip().split("\n")
    formatted_source = [line + "\n" for line in lines[:-1]] + [lines[-1]] if lines else []
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": formatted_source
    }

# -----------------
# 1. Stock Price Regression Notebook
# -----------------
stock_cells = [
    markdown_cell("# CRISP-DM Case 1: 2330.TW Stock Price Prediction\n\n這是一個使用 CRISP-DM 方法論解決時間序列迴歸 (Time Series Regression) 問題的教學範例。我們將使用台積電 (2330.TW) 的歷史股價資料，建立模型來預測未來的收盤價。"),
    markdown_cell("## Step 1: Load Data + Generate Random Data Scatter Plot\n\n這一步是先把資料讀進來，並用圖表觀察資料長什麼樣子。\n在機器學習中，不要一開始就急著訓練模型，先看懂資料，比直接建模更重要。\n\n### 產生 Random Regression Data Scatter Plot\n這是一個簡單的隨機資料散佈圖，讓我們先理解「迴歸」的概念：找到一條線或曲線，讓模型可以根據 X 預測 Y。"),
    code_cell("""import numpy as np
import matplotlib.pyplot as plt

# 隨機產生 X 和 Y
x = np.random.uniform(-100, 100, 200)
a = np.random.uniform(-50, 50)
b = np.random.uniform(0, 100)
noise = np.random.normal(0, 300, 200)

y = a * x + b + noise

plt.scatter(x, y)
plt.xlabel("X")
plt.ylabel("Y")
plt.title("Random Regression Data Scatter Plot")
plt.show()"""),
    markdown_cell("### 載入台積電股價資料"),
    code_cell("""import yfinance as yf
import pandas as pd
import os

# 下載資料
ticker = "2330.TW"
df = yf.download(ticker, start="2020-01-01", end="2026-01-01")
df.head()"""),
    code_cell("""# 畫出收盤價走勢圖與成交量
plt.figure(figsize=(14, 6))

plt.subplot(2, 1, 1)
plt.plot(df.index, df['Close'])
plt.title(f"{ticker} Close Price")
plt.ylabel("Price")

plt.subplot(2, 1, 2)
plt.bar(df.index, df['Volume'])
plt.title(f"{ticker} Volume")
plt.ylabel("Volume")

plt.tight_layout()
plt.show()"""),
    markdown_cell("## Step 2: Preprocessing\n\n資料前處理是把原始資料整理成模型看得懂的格式。\n例如文字類別要轉成數字，缺失值要處理，資料型態要正確，訓練集與測試集也要分開。"),
    code_cell("""# 處理缺失值
df = df.dropna()

# 特徵工程 (Feature Engineering)
df["MA_5"] = df["Close"].rolling(window=5).mean()
df["MA_10"] = df["Close"].rolling(window=10).mean()
df["MA_20"] = df["Close"].rolling(window=20).mean()

df["Return"] = df["Close"].pct_change()

# 延遲特徵 (Lag features) - 使用過去的價格來預測未來
df["Lag_1_Close"] = df["Close"].shift(1)
df["Lag_2_Close"] = df["Close"].shift(2)
df["Lag_3_Close"] = df["Close"].shift(3)

# 移除因為 rolling 和 shift 產生的 NaN
df = df.dropna()

# 準備 X 和 y
features = ["Open", "High", "Low", "Volume", "MA_5", "MA_10", "MA_20", "Return", "Lag_1_Close", "Lag_2_Close", "Lag_3_Close"]
X = df[features]
y = df["Close"]

# 轉換型態
X = X.astype(float)
y = y.astype(float)

# 儲存處理好的資料供後續使用
os.makedirs("../data/processed", exist_ok=True)
df.to_csv("../data/processed/stock_2330_processed.csv")"""),
    markdown_cell("### Train Test Split (時間序列切分)\n\nTrain Set 用來訓練模型。Test Set 用來檢查模型是否真的能預測沒看過的資料。\n如果只用同一份資料訓練與測試，模型可能只是記住答案，而不是真的學到規律。\n\n**注意**: 股價資料不可隨機切分，需保留時間順序。"),
    code_cell("""# 時間序列的 Train/Test Split
split_index = int(len(df) * 0.8)

X_train = X.iloc[:split_index]
y_train = y.iloc[:split_index]
X_test = X.iloc[split_index:]
y_test = y.iloc[split_index:]

print(f"Train size: {len(X_train)}, Test size: {len(X_test)}")"""),
    markdown_cell("## Step 3: Build Model\n\n建模就是讓模型從資料中學習 X 和 y 之間的關係。\n在迴歸問題中，模型的目標是預測一個連續數值。"),
    code_cell("""from sklearn.linear_model import LinearRegression

# 建立並訓練模型
model = LinearRegression()
model.fit(X_train, y_train)

# 預測
y_pred_train = model.predict(X_train)
y_pred_test = model.predict(X_test)"""),
    markdown_cell("## Step 4: Evaluation\n\n模型訓練完後，不能只看預測結果感覺準不準，需要用 MSE、MAE、R² 等指標客觀評估。\n也要觀察模型是否 overfit 或 underfit。\n\n- **MSE**: 平均平方誤差。數值越小，代表模型預測越準。會放大大錯誤。\n- **MAE**: 平均絕對誤差。可以理解成平均預測差多少錢。\n- **R²**: 決定係數。越接近 1，代表模型解釋能力越好。"),
    code_cell("""from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# 計算測試集指標
mse = mean_squared_error(y_test, y_pred_test)
mae = mean_absolute_error(y_test, y_pred_test)
r2 = r2_score(y_test, y_pred_test)

train_r2 = r2_score(y_train, y_pred_train)

print(f"Train R²: {train_r2:.4f}")
print(f"Test R²: {r2:.4f}")
print(f"MSE: {mse:.4f}")
print(f"MAE: {mae:.4f}")"""),
    markdown_cell("### 觀察預測曲線與 Overfitting / Underfitting 判斷\n\n- **Overfitting**: Train R² 高，Test R² 低。\n- **Underfitting**: Train R² 低，Test R² 也低。\n- **Good Fit**: Train R² 和 Test R² 都高且接近。"),
    code_cell("""# 畫出預測曲線與實際曲線的比較
plt.figure(figsize=(14, 6))

# 我們把 train 和 test 接在一起畫
plt.plot(df.index[:split_index], y_train, label="Actual Train")
plt.plot(df.index[split_index:], y_test, label="Actual Test")
plt.plot(df.index[split_index:], y_pred_test, label="Predicted Test", linestyle="--")

plt.title("Train / Test / Predicted Curve")
plt.xlabel("Date")
plt.ylabel("Close Price")
plt.legend()
plt.show()"""),
    markdown_cell("### Optuna 模型優化 (以 Random Forest 為例)"),
    code_cell("""import optuna
from sklearn.ensemble import RandomForestRegressor

def objective(trial):
    n_estimators = trial.suggest_int("n_estimators", 50, 150)
    max_depth = trial.suggest_int("max_depth", 2, 10)

    rf_model = RandomForestRegressor(
        n_estimators=n_estimators,
        max_depth=max_depth,
        random_state=42
    )

    rf_model.fit(X_train, y_train)
    rf_pred = rf_model.predict(X_test)
    
    return mean_squared_error(y_test, rf_pred)

# 為了加快示範，只跑 10 次 trials
study = optuna.create_study(direction="minimize")
study.optimize(objective, n_trials=10)

print("Best params:", study.best_params)

# 使用最佳參數重新訓練模型
best_rf = RandomForestRegressor(**study.best_params, random_state=42)
best_rf.fit(X_train, y_train)

rf_pred_test = best_rf.predict(X_test)
print(f"Optimized Random Forest Test R²: {r2_score(y_test, rf_pred_test):.4f}")"""),
    markdown_cell("## Step 5: Deployment\n\n部署是把訓練好的模型保存起來，讓其他程式或使用者可以輸入新資料並取得預測結果。\nPickle 可以儲存模型，Gzip 可以壓縮模型檔案大小。"),
    code_cell("""import pickle
import gzip
import os

# 確保 models 目錄存在
os.makedirs("../models", exist_ok=True)

# 儲存 Linear Regression 模型 (使用 gzip 壓縮)
model_path = "../models/stock_model.pkl.gz"
with gzip.open(model_path, "wb") as f:
    pickle.dump(model, f)
    
print(f"Model saved to {model_path}")

# 測試載入模型
with gzip.open(model_path, "rb") as f:
    loaded_model = pickle.load(f)

# 驗證載入的模型是否可用
sample_input = X_test.iloc[[0]]
print("Sample prediction:", loaded_model.predict(sample_input))""")
]

# -----------------
# 2. Startup 50 Regression Notebook
# -----------------
startup_cells = [
    markdown_cell("# CRISP-DM Case 2: Startup 50 Profit Prediction\n\n這是一個使用 CRISP-DM 解決多元線性迴歸 (Multiple Linear Regression) 問題的範例。\n我們將根據新創公司的研發支出、行政支出、行銷支出與所在地區，預測公司的利潤 (Profit)。"),
    markdown_cell("## Step 1: Load Data + Scatter Plot\n\n這一步是先把資料讀進來，並用圖表觀察資料長什麼樣子。"),
    code_cell("""import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# 載入資料 (請確保 50_Startups.csv 已放置在 data/raw 目錄)
# 這裡我們自動下載如果檔案不存在的話
data_path = "../data/raw/50_Startups.csv"
if not os.path.exists(data_path):
    os.makedirs("../data/raw", exist_ok=True)
    url = "https://raw.githubusercontent.com/krishnaik06/Multiple-Linear-Regression/master/50_Startups.csv"
    df = pd.read_csv(url)
    df.to_csv(data_path, index=False)
else:
    df = pd.read_csv(data_path)

df.head()"""),
    markdown_cell("### 產生圖表\n\n如果散佈圖呈現明顯向上趨勢，代表該特徵可能與 Profit 有正相關。"),
    code_cell("""# 1. R&D Spend vs Profit
plt.figure(figsize=(15, 4))
plt.subplot(1, 3, 1)
plt.scatter(df["R&D Spend"], df["Profit"])
plt.xlabel("R&D Spend")
plt.ylabel("Profit")
plt.title("R&D Spend vs Profit")

# 2. Administration vs Profit
plt.subplot(1, 3, 2)
plt.scatter(df["Administration"], df["Profit"], color='orange')
plt.xlabel("Administration")
plt.ylabel("Profit")
plt.title("Administration vs Profit")

# 3. Marketing Spend vs Profit
plt.subplot(1, 3, 3)
plt.scatter(df["Marketing Spend"], df["Profit"], color='green')
plt.xlabel("Marketing Spend")
plt.ylabel("Profit")
plt.title("Marketing vs Profit")

plt.tight_layout()
plt.show()"""),
    code_cell("""# Correlation Heatmap (只取數值欄位)
numeric_df = df.select_dtypes(include=['float64', 'int64'])
plt.figure(figsize=(6, 5))
sns.heatmap(numeric_df.corr(), annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Correlation Heatmap")
plt.show()"""),
    markdown_cell("## Step 2: Preprocessing\n\n因為 `State` 是類別型特徵，我們需要做 One-Hot Encoding。\n另外，Startup 50 不是時間序列，所以我們可以隨機切分 (Train Test Split)。"),
    code_cell("""from sklearn.model_selection import train_test_split

# 將資料分為特徵 (X) 與目標變數 (y)
X = df.drop("Profit", axis=1)
y = df["Profit"]

# Train Test Split (80% 訓練, 20% 測試)
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print(f"Train set: {X_train.shape}, Test set: {X_test.shape}")"""),
    markdown_cell("## Step 3 & Step 5 結合: 建立 Pipeline 與模型\n\n為了避免部署時 One-Hot Encoding 欄位與訓練時不一致，我們使用 Pipeline。\nPipeline 可以把「資料前處理」和「模型」綁在一起。"),
    code_cell("""from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression

# 定義數值型與類別型欄位
numeric_features = ["R&D Spend", "Administration", "Marketing Spend"]
categorical_features = ["State"]

# 建立前處理器
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(drop="first", handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numeric_features)
    ]
)

# 建立 Pipeline
model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("regressor", LinearRegression())
    ]
)

# 訓練模型 (傳入包含 State 字串的 DataFrame 即可，Pipeline 會自動做 One-Hot)
model.fit(X_train, y_train)

# 預測
y_pred_train = model.predict(X_train)
y_pred_test = model.predict(X_test)"""),
    markdown_cell("### 係數解讀\n係數代表當某個特徵增加 1 單位時，在其他條件不變的情況下，Profit 預測值會增加或減少多少。"),
    code_cell("""# 取得 Linear Regression 模型的係數
lr_model = model.named_steps["regressor"]
cat_encoder = model.named_steps["preprocessor"].named_transformers_["cat"]

# 取得 One-Hot Encoding 產生的欄位名稱
encoded_cat_cols = cat_encoder.get_feature_names_out(categorical_features)
all_feature_names = list(encoded_cat_cols) + numeric_features

# 顯示係數
for name, coef in zip(all_feature_names, lr_model.coef_):
    print(f"{name}: {coef:.4f}")"""),
    markdown_cell("## Step 4: Evaluation\n\n來看看這個多元線性迴歸模型的表現。"),
    code_cell("""from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

mse = mean_squared_error(y_test, y_pred_test)
mae = mean_absolute_error(y_test, y_pred_test)
r2 = r2_score(y_test, y_pred_test)
train_r2 = r2_score(y_train, y_pred_train)

print(f"Train R²: {train_r2:.4f}")
print(f"Test R²: {r2:.4f}")
print(f"MSE: {mse:.4f}")
print(f"MAE: {mae:.4f}")"""),
    markdown_cell("### Actual vs Predicted Plot\n\n如果點越接近斜對角線，代表預測越準。"),
    code_cell("""plt.figure(figsize=(6, 6))
plt.scatter(y_test, y_pred_test)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
plt.xlabel("Actual Profit")
plt.ylabel("Predicted Profit")
plt.title("Actual vs Predicted Profit")
plt.show()"""),
    markdown_cell("## 部署模型 (Save Model)\n\n把 Pipeline 整個存起來！"),
    code_cell("""import pickle
import gzip
import os

os.makedirs("../models", exist_ok=True)
model_path = "../models/startup_model.pkl.gz"

with gzip.open(model_path, "wb") as f:
    pickle.dump(model, f)
    
print(f"Pipeline saved to {model_path}")""")
]

if __name__ == "__main__":
    create_notebook(stock_cells, "d:/SeanLin/L6/notebooks/01_stock_price_regression.ipynb")
    create_notebook(startup_cells, "d:/SeanLin/L6/notebooks/02_startup_50_regression.ipynb")
    print("Notebooks created successfully.")
