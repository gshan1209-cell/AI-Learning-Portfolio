import os
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def export_rf():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, "data", "50_Startups.csv")
    if not os.path.exists(csv_path):
        csv_path = os.path.join(base_dir, "..", "data", "50_Startups.csv")
        
    df = pd.read_csv(csv_path)
    
    # One-hot encode State column
    states = ["Florida", "New York"] # California is baseline
    for st in states:
        df[f"State_{st}"] = (df["State"] == st).astype(float)
        
    features = ["State_Florida", "State_New York", "R&D Spend", "Administration", "Marketing Spend"]
    X = df[features].values
    y = df["Profit"].values
    
    rf = RandomForestRegressor(n_estimators=10, random_state=42, max_depth=5)
    rf.fit(X, y)
    
    preds = rf.predict(X)
    mae = float(mean_absolute_error(y, preds))
    mse = float(mean_squared_error(y, preds))
    rmse = float(np.sqrt(mse))
    r2 = float(r2_score(y, preds))
    
    trees_data = []
    for dt in rf.estimators_:
        tree = dt.tree_
        trees_data.append({
            "childrenLeft": tree.children_left.tolist(),
            "childrenRight": tree.children_right.tolist(),
            "feature": tree.feature.tolist(),
            "threshold": tree.threshold.tolist(),
            "value": tree.value.squeeze().tolist()
        })
        
    # Golden samples for test verification
    sample_inputs = [
        {"rdSpend": 165349.2, "administration": 136897.8, "marketingSpend": 471784.1, "state": "New York"},
        {"rdSpend": 100000.0, "administration": 120000.0, "marketingSpend": 250000.0, "state": "California"},
        {"rdSpend": 50000.0, "administration": 90000.0, "marketingSpend": 100000.0, "state": "Florida"}
    ]
    
    golden_samples = []
    for item in sample_inputs:
        x_vec = [
            1.0 if item["state"] == "Florida" else 0.0,
            1.0 if item["state"] == "New York" else 0.0,
            float(item["rdSpend"]),
            float(item["administration"]),
            float(item["marketingSpend"])
        ]
        pred_val = float(rf.predict([x_vec])[0])
        golden_samples.append({
            "input": item,
            "expectedProfit": round(pred_val, 2)
        })
        
    artifact = {
        "metadata": {
            "sourceRepository": "gshan1209-cell/machinelearningHw6-2",
            "sourceCommit": "cd4b4ae549ab9cecb83123447260b0b135a8d70e",
            "modelType": "RandomForestRegressor",
            "nEstimators": len(trees_data),
            "featureOrder": features,
            "seed": 42,
            "metrics": { "mae": mae, "mse": mse, "rmse": rmse, "rSquared": r2 },
            "generatedAt": "2026-07-28T00:00:00Z"
        },
        "trees": trees_data,
        "goldenSamples": golden_samples
    }
    
    artifact_path = os.path.join(base_dir, "..", "artifacts", "startup_rf_model.json")
    os.makedirs(os.path.dirname(artifact_path), exist_ok=True)
    with open(artifact_path, "w", encoding="utf-8") as f:
        json.dump(artifact, f, indent=2)
    print("Exported RF tree model artifact successfully to", artifact_path)

if __name__ == "__main__":
    export_rf()
