from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import os
from datetime import datetime

# 確保能載入 src 模組
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
try:
    from src.predict import predict_profit
except ModuleNotFoundError:
    from predict import predict_profit

app = FastAPI(title="Startup Profit Prediction API")

# 建立一個 List 來暫存預測歷史 (請注意：伺服器重啟後會清空)
prediction_history = []

class StartupInput(BaseModel):
    rd_spend: float
    administration: float
    marketing_spend: float
    state: str

@app.get("/")
def read_root():
    return {"message": "Startup Profit Prediction API is running."}

@app.get("/history")
def get_history():
    """取得所有的預測歷史紀錄"""
    return {"total_records": len(prediction_history), "history": prediction_history}

@app.post("/predict")
def predict(data: StartupInput):
    if data.rd_spend < 0 or data.administration < 0 or data.marketing_spend < 0:
        raise HTTPException(status_code=400, detail="Spending amounts cannot be negative.")
        
    valid_states = ["New York", "California", "Florida"]
    if data.state not in valid_states:
        raise HTTPException(status_code=400, detail=f"Invalid state. Allowed: {valid_states}")
        
    try:
        profit = predict_profit(data.rd_spend, data.administration, data.marketing_spend, data.state)
        result = round(profit, 2)
        
        # 將這次的輸入與輸出紀錄到歷史中
        prediction_history.append({
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "input": {
                "rd_spend": data.rd_spend,
                "administration": data.administration,
                "marketing_spend": data.marketing_spend,
                "state": data.state
            },
            "predicted_profit": result
        })
        
        return {"predicted_profit": result}
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Model files not found. Train the model first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))