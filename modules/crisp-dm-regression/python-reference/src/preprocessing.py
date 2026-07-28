import pandas as pd
from sklearn.model_selection import train_test_split

def preprocess_stock_data(df: pd.DataFrame):
    """
    處理股票資料：處理缺失值、特徵工程、切割 Train/Test (Time Series)
    """
    df = df.copy()
    
    # 1. 處理缺失值
    df = df.ffill().dropna()
    
    # 2. Feature Engineering
    df["MA_5"] = df["Close"].rolling(window=5).mean()
    df["MA_10"] = df["Close"].rolling(window=10).mean()
    df["MA_20"] = df["Close"].rolling(window=20).mean()
    df["Return"] = df["Close"].pct_change()
    df["Lag_1_Close"] = df["Close"].shift(1)
    df["Lag_2_Close"] = df["Close"].shift(2)
    df["Lag_3_Close"] = df["Close"].shift(3)
    
    # 去除因 window 和 shift 產生的 NaN
    df = df.dropna()
    
    # 定義特徵與標籤
    features = [
        "Open", "High", "Low", "Volume",
        "MA_5", "MA_10", "MA_20", "Return",
        "Lag_1_Close", "Lag_2_Close", "Lag_3_Close"
    ]
    
    # 如果 yfinance 回傳 MultiIndex (通常出現在多個 ticker)，需處理；
    # 這裡假設已經是 Single Index 或是取出了 "Close" 欄位。
    if isinstance(df.columns, pd.MultiIndex):
        # 展平 MultiIndex 如果有
        df.columns = [col[0] for col in df.columns]

    X = df[features].astype(float)
    y = df["Close"].astype(float)
    
    # 3. Time Series Split (80% train, 20% test)
    split_index = int(len(df) * 0.8)
    X_train = X.iloc[:split_index]
    X_test = X.iloc[split_index:]
    y_train = y.iloc[:split_index]
    y_test = y.iloc[split_index:]
    
    return X_train, X_test, y_train, y_test

def preprocess_startup_data(df: pd.DataFrame):
    """
    處理 Startup 50 資料：Train Test Split (Random)
    注意：One-Hot Encoding 會統一由 sklearn Pipeline 處理 (依據 Spec 8)，
    這裡只負責切分資料並確保型別。
    """
    df = df.copy()
    
    X = df.drop("Profit", axis=1)
    y = df["Profit"].astype(float)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    return X_train, X_test, y_train, y_test
