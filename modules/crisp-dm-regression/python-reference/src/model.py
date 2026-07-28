from sklearn.linear_model import LinearRegression
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
import pandas as pd

def build_stock_model(X_train, y_train):
    """
    建立並訓練股票預測模型 (Linear Regression)
    """
    model = LinearRegression()
    model.fit(X_train, y_train)
    return model

def build_startup_pipeline(X_train: pd.DataFrame, y_train: pd.Series):
    """
    建立並訓練 Startup 50 預測模型 (包含 One-Hot Encoding 的 Pipeline)
    """
    numeric_features = ["R&D Spend", "Administration", "Marketing Spend"]
    categorical_features = ["State"]

    # 設定前處理 ColumnTransformer
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(drop="first", handle_unknown="ignore"), categorical_features),
            ("num", "passthrough", numeric_features)
        ]
    )

    # 建立 Pipeline，將前處理與模型綁在一起
    model_pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", LinearRegression())
        ]
    )

    model_pipeline.fit(X_train, y_train)
    return model_pipeline

def predict_model(model, X_test):
    """
    進行預測
    """
    return model.predict(X_test)
