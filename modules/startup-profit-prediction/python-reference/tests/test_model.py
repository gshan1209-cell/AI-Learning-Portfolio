import os
import joblib
import pandas as pd
import pytest

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir) if os.path.basename(current_dir) == "tests" else current_dir

MODEL_PATH = os.path.join(project_root, "models", "startup_profit_model.pkl")
DATA_PATH = os.path.join(project_root, "data", "50_Startups.csv")

def test_model_exists():
    """測試模型檔案是否存在"""
    assert os.path.exists(MODEL_PATH), f"找不到模型檔案: {MODEL_PATH}，請先執行訓練腳本或 Notebook。"

def test_data_exists():
    """測試資料集檔案是否存在"""
    assert os.path.exists(DATA_PATH), f"找不到資料集檔案: {DATA_PATH}"

def test_model_prediction():
    """測試 Pipeline 模型載入與基礎預測輸出格式"""
    # 1. 確保模型可成功載入
    try:
        pipeline = joblib.load(MODEL_PATH)
    except Exception as e:
        pytest.fail(f"模型載入失敗: {e}")

    # 2. 準備測試用的 DataFrame (需包含與訓練時相同的特徵名稱)
    dummy_data = pd.DataFrame({
        "R&D Spend": [165349.20],
        "Administration": [136897.80],
        "Marketing Spend": [471784.10],
        "State": ["New York"]
    })

    # 3. 進行預測
    prediction = pipeline.predict(dummy_data)

    # 4. 驗證預測結果的長度與型態
    assert len(prediction) == 1, "預測結果的長度應為 1"
    assert isinstance(prediction[0], float), "預測利潤的資料型態應為 float"