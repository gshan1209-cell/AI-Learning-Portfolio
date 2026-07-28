import yfinance as yf
import pandas as pd

def load_stock_data(ticker: str, start_date: str, end_date: str) -> pd.DataFrame:
    """
    載入股票歷史資料
    :param ticker: 股票代號，例如 "2330.TW"
    :param start_date: 開始日期，例如 "2020-01-01"
    :param end_date: 結束日期，例如 "2026-01-01"
    :return: DataFrame 包含 Open, High, Low, Close, Volume 等欄位
    """
    print(f"Loading stock data for {ticker} from {start_date} to {end_date}...")
    df = yf.download(ticker, start=start_date, end=end_date)
    return df

def load_startup_data(file_path: str) -> pd.DataFrame:
    """
    載入 Startup 50 資料
    :param file_path: CSV 檔案路徑，例如 "data/raw/50_Startups.csv"
    :return: DataFrame
    """
    print(f"Loading startup data from {file_path}...")
    df = pd.read_csv(file_path)
    return df

if __name__ == "__main__":
    # 簡單測試
    df_stock = load_stock_data("2330.TW", "2023-01-01", "2024-01-01")
    print(df_stock.head())
    
    df_startup = load_startup_data("../data/raw/50_Startups.csv")
    print(df_startup.head())
