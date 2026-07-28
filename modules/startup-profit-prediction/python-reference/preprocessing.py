import pandas as pd
from sklearn.model_selection import train_test_split

def preprocess_data(df: pd.DataFrame):
    """
    前處理流程：分離 X 與 y、切分訓練與測試集。
    (類別特徵的 One-Hot Encoding 交由 Pipeline 處理)
    """
    # 分離 X 與 y
    X = df.drop("Profit", axis=1)
    y = df["Profit"]

    # 切分 train/test data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    return X_train, X_test, y_train, y_test