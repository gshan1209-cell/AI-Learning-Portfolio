from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt
import json
import os

def evaluate_model(model, X_train, y_train, X_test, y_test, dataset_name, model_name, model_path=""):
    """
    評估模型，計算指標並產生報告字典
    """
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)
    mse = mean_squared_error(y_test, y_pred_test)
    mae = mean_absolute_error(y_test, y_pred_test)

    # 判斷 Overfitting / Underfitting
    diagnosis = "Good Fit"
    if train_r2 > 0.8 and test_r2 < 0.6:
        diagnosis = "Overfitting"
    elif train_r2 < 0.5 and test_r2 < 0.5:
        diagnosis = "Underfitting"
        
    report = {
        "dataset": dataset_name,
        "model": model_name,
        "train_size": len(y_train),
        "test_size": len(y_test),
        "mse": mse,
        "mae": mae,
        "r2": test_r2,
        "train_r2": train_r2,
        "test_r2": test_r2,
        "diagnosis": diagnosis,
        "model_path": model_path
    }
    
    return report, y_pred_test

def plot_actual_vs_predicted(y_test, y_pred, title="Actual vs Predicted", save_path=None):
    """
    繪製實際值與預測值的散佈圖
    """
    plt.figure(figsize=(8, 6))
    plt.scatter(y_test, y_pred, alpha=0.7, color='b')
    
    # 畫一條 y=x 的斜對角線 (完美預測線)
    min_val = min(min(y_test), min(y_pred))
    max_val = max(max(y_test), max(y_pred))
    plt.plot([min_val, max_val], [min_val, max_val], color='r', linestyle='--')
    
    plt.xlabel("Actual Value")
    plt.ylabel("Predicted Value")
    plt.title(title)
    plt.grid(True)
    
    if save_path:
        # 確保目錄存在
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path)
        print(f"Plot saved to {save_path}")
    else:
        plt.show()

def generate_report_json(report, save_path):
    """
    匯出 JSON 報告
    """
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    with open(save_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=4, ensure_ascii=False)
    print(f"Report saved to {save_path}")
