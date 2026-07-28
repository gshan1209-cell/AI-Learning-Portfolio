import sys
import os

# 確保 Python 能正確找到 app 模組 (無論測試檔在根目錄或 tests/ 內)
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir) if os.path.basename(current_dir) == "tests" else current_dir
sys.path.insert(0, project_root)

from fastapi.testclient import TestClient

# 嘗試從 app 資料夾載入，若找不到則直接從根目錄載入
try:
    from app.fastapi_app import app
except ModuleNotFoundError:
    from fastapi_app import app

# 建立 FastAPI 測試客戶端
client = TestClient(app)

def test_read_root():
    """測試首頁 GET 請求是否正常回應"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Startup Profit Prediction API is running."}

def test_predict_valid_input():
    """測試 /predict POST 請求，給予合法的 JSON 參數"""
    valid_payload = {
        "rd_spend": 120000.0,
        "administration": 130000.0,
        "marketing_spend": 250000.0,
        "state": "New York"
    }
    response = client.post("/predict", json=valid_payload)
    
    assert response.status_code == 200
    response_data = response.json()
    assert "predicted_profit" in response_data
    assert isinstance(response_data["predicted_profit"], float)

def test_predict_invalid_input():
    """測試 /predict POST 請求，給予缺漏的 JSON 參數，預期應回傳 422 錯誤"""
    invalid_payload = {
        "rd_spend": 120000.0,
        # 故意遺漏 administration, marketing_spend, state
    }
    response = client.post("/predict", json=invalid_payload)
    
    assert response.status_code == 422  # 422 Unprocessable Entity