import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

def train_model(X_train, y_train):
    """使用 Pipeline 訓練 Random Forest 模型，並包含資料前處理"""
    # 設定前處理器
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", drop="first"), ["State"])
        ],
        remainder="passthrough"
    )

    # 建立 Pipeline
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("model", RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    pipeline.fit(X_train, y_train)
    return pipeline

def save_model(model):
    """儲存 Pipeline 模型至 models 資料夾"""
    base_dir = os.path.dirname(__file__)
    
    if os.path.basename(base_dir) == "src":
        model_dir = os.path.join(base_dir, "..", "models")
    else:
        model_dir = os.path.join(base_dir, "models")
    os.makedirs(model_dir, exist_ok=True)
    
    # 儲存完整的 Pipeline 模型
    joblib.dump(model, os.path.join(model_dir, "startup_profit_model.pkl"))