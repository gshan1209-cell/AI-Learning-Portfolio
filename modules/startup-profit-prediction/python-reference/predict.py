import os
import joblib
import pandas as pd

def predict_profit(rd_spend: float, administration: float, marketing_spend: float, state: str) -> float:
    """載入訓練好的 Pipeline 模型進行利潤預測"""
    base_dir = os.path.dirname(__file__)
    
    # 判斷目前檔案是否在 src 資料夾內，以決定正確的模型路徑
    if os.path.basename(base_dir) == "src":
        model_path = os.path.join(base_dir, "..", "models", "startup_profit_model.pkl")
    else:
        model_path = os.path.join(base_dir, "models", "startup_profit_model.pkl")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError("Model files not found. Please run the training notebook first.")
        
    model = joblib.load(model_path)
    
    # 建立輸入資料 DataFrame (Pipeline 會自動處理編碼)
    input_df = pd.DataFrame({
        "R&D Spend": [rd_spend],
        "Administration": [administration],
        "Marketing Spend": [marketing_spend],
        "State": [state]
    })
    
    return model.predict(input_df)[0]