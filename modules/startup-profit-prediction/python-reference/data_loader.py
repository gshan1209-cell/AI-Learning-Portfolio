import pandas as pd
import os

def load_data(file_path: str) -> pd.DataFrame:
    """讀取 CSV 檔案並回傳 DataFrame"""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    df = pd.read_csv(file_path)
    return df