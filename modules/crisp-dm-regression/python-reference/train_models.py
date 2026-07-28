import yfinance as yf
import pandas as pd
import numpy as np
import optuna
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
import pickle
import gzip
import os

os.makedirs("models", exist_ok=True)
os.makedirs("data/raw", exist_ok=True)
os.makedirs("data/processed", exist_ok=True)

print("Training Stock Model (2330.TW)...")
ticker = "2330.TW"
df = yf.download(ticker, start="2020-01-01", end="2026-01-01")
df = df.dropna()

df["MA_5"] = df["Close"].rolling(window=5).mean()
df["MA_10"] = df["Close"].rolling(window=10).mean()
df["MA_20"] = df["Close"].rolling(window=20).mean()
df["Return"] = df["Close"].pct_change()
df["Lag_1_Close"] = df["Close"].shift(1)
df["Lag_2_Close"] = df["Close"].shift(2)
df["Lag_3_Close"] = df["Close"].shift(3)
df = df.dropna()

features = ["Open", "High", "Low", "Volume", "MA_5", "MA_10", "MA_20", "Return", "Lag_1_Close", "Lag_2_Close", "Lag_3_Close"]
X = df[features].astype(float)
y = df["Close"].astype(float)

split_index = int(len(df) * 0.8)
X_train = X.iloc[:split_index]
y_train = y.iloc[:split_index]

stock_model = LinearRegression()
stock_model.fit(X_train, y_train)

with gzip.open("models/stock_model.pkl.gz", "wb") as f:
    pickle.dump(stock_model, f)
print("Stock model saved.")

print("Training Startup 50 Model...")
data_path = "data/raw/50_Startups.csv"
if not os.path.exists(data_path):
    url = "https://raw.githubusercontent.com/krishnaik06/Multiple-Linear-Regression/master/50_Startups.csv"
    startup_df = pd.read_csv(url)
    startup_df.to_csv(data_path, index=False)
else:
    startup_df = pd.read_csv(data_path)

X_start = startup_df.drop("Profit", axis=1)
y_start = startup_df["Profit"]

X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(X_start, y_start, test_size=0.2, random_state=42)

numeric_features = ["R&D Spend", "Administration", "Marketing Spend"]
categorical_features = ["State"]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(drop="first", handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numeric_features)
    ]
)

startup_model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("regressor", LinearRegression())
    ]
)
startup_model.fit(X_train_s, y_train_s)

with gzip.open("models/startup_model.pkl.gz", "wb") as f:
    pickle.dump(startup_model, f)
print("Startup 50 model saved.")
