from fastapi import FastAPI
from pydantic import BaseModel
import gzip
import pickle
import numpy as np
import pandas as pd
import os

app = FastAPI(title="CRISP-DM Regression Learning System API")

# Load Models
STOCK_MODEL_PATH = "models/stock_model.pkl.gz"
STARTUP_MODEL_PATH = "models/startup_model.pkl.gz"

stock_model = None
startup_model = None

@app.on_event("startup")
def load_models():
    global stock_model, startup_model
    try:
        with gzip.open(STOCK_MODEL_PATH, "rb") as f:
            stock_model = pickle.load(f)
        print("Stock model loaded successfully.")
    except Exception as e:
        print(f"Error loading stock model: {e}")

    try:
        with gzip.open(STARTUP_MODEL_PATH, "rb") as f:
            startup_model = pickle.load(f)
        print("Startup model loaded successfully.")
    except Exception as e:
        print(f"Error loading startup model: {e}")

class StockInput(BaseModel):
    open: float
    high: float
    low: float
    volume: float
    ma_5: float
    ma_10: float
    ma_20: float
    return_: float
    lag_1_close: float
    lag_2_close: float
    lag_3_close: float

class StartupInput(BaseModel):
    rd_spend: float
    administration: float
    marketing_spend: float
    state: str

@app.post("/predict-stock")
def predict_stock(data: StockInput):
    if stock_model is None:
        return {"error": "Stock model is not loaded."}
    
    # Feature order: ["Open", "High", "Low", "Volume", "MA_5", "MA_10", "MA_20", "Return", "Lag_1_Close", "Lag_2_Close", "Lag_3_Close"]
    features = [
        data.open, data.high, data.low, data.volume,
        data.ma_5, data.ma_10, data.ma_20, data.return_,
        data.lag_1_close, data.lag_2_close, data.lag_3_close
    ]
    X = np.array(features).reshape(1, -1)
    prediction = stock_model.predict(X)
    return {
        "predicted_close": float(prediction[0])
    }

@app.post("/predict-startup")
def predict_startup(data: StartupInput):
    if startup_model is None:
        return {"error": "Startup model is not loaded."}
    
    input_df = pd.DataFrame([{
        "R&D Spend": data.rd_spend,
        "Administration": data.administration,
        "Marketing Spend": data.marketing_spend,
        "State": data.state
    }])

    # Pipeline handles the One-Hot Encoding
    prediction = startup_model.predict(input_df)

    return {
        "predicted_profit": float(prediction[0])
    }
