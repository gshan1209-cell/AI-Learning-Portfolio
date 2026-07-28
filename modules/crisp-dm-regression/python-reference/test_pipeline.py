import os
import sys

from src.data_loader import load_stock_data, load_startup_data
from src.preprocessing import preprocess_stock_data, preprocess_startup_data
from src.model import build_stock_model, build_startup_pipeline
from src.evaluation import evaluate_model, generate_report_json
from src.deployment import save_model_gzip

def test_stock_pipeline():
    print("--- Testing Stock Pipeline ---")
    df = load_stock_data("2330.TW", "2023-01-01", "2024-01-01")
    X_train, X_test, y_train, y_test = preprocess_stock_data(df)
    model = build_stock_model(X_train, y_train)
    report, _ = evaluate_model(model, X_train, y_train, X_test, y_test, "2330.TW Stock", "Linear Regression", "models/stock_model.pkl.gz")
    generate_report_json(report, "data/processed/stock_report.json")
    save_model_gzip(model, "models/stock_model.pkl.gz")
    print("Stock Pipeline OK!\n")

def test_startup_pipeline():
    print("--- Testing Startup 50 Pipeline ---")
    if not os.path.exists("data/raw/50_Startups.csv"):
        print("data/raw/50_Startups.csv not found!")
        return
        
    df = load_startup_data("data/raw/50_Startups.csv")
    X_train, X_test, y_train, y_test = preprocess_startup_data(df)
    model = build_startup_pipeline(X_train, y_train)
    report, _ = evaluate_model(model, X_train, y_train, X_test, y_test, "Startup 50", "Linear Regression Pipeline", "models/startup_model.pkl.gz")
    generate_report_json(report, "data/processed/startup_report.json")
    save_model_gzip(model, "models/startup_model.pkl.gz")
    print("Startup Pipeline OK!\n")

if __name__ == "__main__":
    test_stock_pipeline()
    test_startup_pipeline()
