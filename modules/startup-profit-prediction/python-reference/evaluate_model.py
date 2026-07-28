import os
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def evaluate_model(model, X_test, y_test):
    """評估模型表現並輸出結果指標"""
    y_pred = model.predict(X_test)
    
    # 1. 計算評估指標
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    
    base_dir = os.path.dirname(__file__)
    
    if os.path.basename(base_dir) == "src":
        output_dir = os.path.join(base_dir, "..", "outputs")
    else:
        output_dir = os.path.join(base_dir, "outputs")
    os.makedirs(output_dir, exist_ok=True)
    
    # 2. 儲存評估結果
    evaluation_result = pd.DataFrame({
        "Metric": ["MAE", "MSE", "RMSE", "R2 Score"],
        "Value": [mae, mse, rmse, r2]
    })
    evaluation_result.to_csv(os.path.join(output_dir, "evaluation_metrics.csv"), index=False)
    
    # 3. 儲存 Actual vs Predicted 比較表
    comparison = pd.DataFrame({
        "Actual Profit": y_test,
        "Predicted Profit": y_pred,
        "Error": y_test - y_pred
    })
    comparison.to_csv(os.path.join(output_dir, "actual_vs_predicted.csv"), index=False)