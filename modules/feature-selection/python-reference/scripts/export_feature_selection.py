import os
import json
import hashlib
import pandas as pd
import numpy as np
import scipy.stats as stats
import sklearn
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LassoCV
from sklearn.feature_selection import f_regression, mutual_info_regression, RFE, SequentialFeatureSelector
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def get_file_hash(filepath):
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        buf = f.read()
        hasher.update(buf)
    return hasher.hexdigest()

METHOD_NAMES = {
    "pearson": "Pearson Correlation (皮爾森相關係數)",
    "spearman": "Spearman Correlation (斯皮爾曼相關)",
    "ftest": "F-test Regression (F檢定迴歸)",
    "mutual_info": "Mutual Information (互資訊量)",
    "rfe": "Recursive Feature Elimination (遞迴特徵消除)",
    "sfs": "Sequential Forward Selection (前向特徵選擇)",
    "sbs": "Sequential Backward Selection (後向特徵消除)",
    "lasso": "Lasso L1 Regularization (Lasso L1 正則化)",
    "rf": "Random Forest Feature Importance (隨機森林特徵重要性)"
}

def rank_features(method_key, X_train_df, y_train):
    feature_names = list(X_train_df.columns)
    X_mat = X_train_df.values
    y_vec = y_train.values

    if method_key == "pearson":
        scores = [abs(stats.pearsonr(X_train_df[col], y_train)[0]) for col in feature_names]
        order = np.argsort(scores)[::-1]
    elif method_key == "spearman":
        scores = [abs(stats.spearmanr(X_train_df[col], y_train)[0]) for col in feature_names]
        order = np.argsort(scores)[::-1]
    elif method_key == "ftest":
        f_vals, _ = f_regression(X_mat, y_vec)
        scores = list(f_vals)
        order = np.argsort(scores)[::-1]
    elif method_key == "mutual_info":
        scores = list(mutual_info_regression(X_mat, y_vec, random_state=42))
        order = np.argsort(scores)[::-1]
    elif method_key == "rfe":
        estimator = LinearRegression()
        rfe = RFE(estimator, n_features_to_select=1)
        rfe.fit(X_mat, y_vec)
        # rfe.ranking_: 1 is best, n is worst
        rankings = list(rfe.ranking_)
        scores = [float(len(feature_names) - r + 1) for r in rankings]
        order = np.argsort(rankings) # ascending rank
    elif method_key == "sfs":
        # Forward selection ranking
        selected = []
        remaining = list(range(len(feature_names)))
        for _ in range(len(feature_names)):
            best_score = -1.0
            best_feat = remaining[0]
            for f in remaining:
                candidate = selected + [f]
                lr = LinearRegression()
                lr.fit(X_mat[:, candidate], y_vec)
                score = lr.score(X_mat[:, candidate], y_vec)
                if score > best_score:
                    best_score = score
                    best_feat = f
            selected.append(best_feat)
            remaining.remove(best_feat)
        order = selected
        scores = [float(len(feature_names) - i) for i in range(len(feature_names))]
    elif method_key == "sbs":
        # Backward elimination ranking
        selected = list(range(len(feature_names)))
        eliminated = []
        for _ in range(len(feature_names) - 1):
            worst_score = -1e9
            worst_feat = selected[0]
            for f in selected:
                candidate = [x for x in selected if x != f]
                lr = LinearRegression()
                lr.fit(X_mat[:, candidate], y_vec)
                score = lr.score(X_mat[:, candidate], y_vec)
                if score > worst_score:
                    worst_score = score
                    worst_feat = f
            eliminated.append(worst_feat)
            selected.remove(worst_feat)
        eliminated.append(selected[0])
        order = eliminated[::-1]
        scores = [float(i + 1) for i in range(len(feature_names))]
    elif method_key == "lasso":
        lasso = LassoCV(cv=5, random_state=42)
        lasso.fit(X_mat, y_vec)
        scores = list(np.abs(lasso.coef_))
        order = np.argsort(scores)[::-1]
    elif method_key == "rf":
        rf = RandomForestRegressor(n_estimators=50, random_state=42)
        rf.fit(X_mat, y_vec)
        scores = list(rf.feature_importances_)
        order = np.argsort(scores)[::-1]
    else:
        order = list(range(len(feature_names)))
        scores = [1.0] * len(feature_names)

    ranked_features = [feature_names[i] for i in order]
    ranking_items = []
    max_score = max(scores) if max(scores) > 0 else 1.0
    for idx, f_idx in enumerate(order):
        ranking_items.append({
            "feature": feature_names[f_idx],
            "score": round(float(scores[f_idx] / max_score), 4),
            "rank": idx + 1
        })
    return ranked_features, ranking_items

def process_mode(mode, df):
    if mode == "ethical":
        # Remove B column before running any feature selection algorithm
        feature_cols = [c for c in df.columns if c not in ["MEDV", "B"]]
    else:
        feature_cols = [c for c in df.columns if c != "MEDV"]

    X = df[feature_cols]
    y = df["MEDV"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    mode_results = {}
    max_k = len(feature_cols)

    for method_key in METHOD_NAMES.keys():
        ranked_features, ranking_items = rank_features(method_key, X_train, y_train)

        k_results = []
        for k in range(1, max_k + 1):
            selected_k = ranked_features[:k]
            lr = LinearRegression()
            lr.fit(X_train[selected_k], y_train)
            preds = lr.predict(X_test[selected_k])

            r2 = float(r2_score(y_test, preds))
            mse = float(mean_squared_error(y_test, preds))
            mae = float(mean_absolute_error(y_test, preds))
            rmse = float(np.sqrt(mse))

            k_results.append({
                "k": k,
                "selectedFeatures": selected_k,
                "metrics": {
                    "rSquared": round(r2, 4),
                    "mse": round(mse, 2),
                    "mae": round(mae, 2),
                    "rmse": round(rmse, 2)
                }
            })

        mode_results[method_key] = {
            "methodKey": method_key,
            "methodName": METHOD_NAMES[method_key],
            "mode": mode,
            "rankings": ranking_items,
            "kResults": k_results
        }
    return mode_results

def export_feature_selection():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, "..", "data", "boston_housing.csv")
    if not os.path.exists(csv_path):
        csv_path = os.path.join(base_dir, "..", "..", "data", "boston_housing.csv")

    dataset_hash = get_file_hash(csv_path)
    df = pd.read_csv(csv_path)
    total_rows = len(df)

    ethical_mode_results = process_mode("ethical", df)
    historical_mode_results = process_mode("historical", df)

    artifact = {
        "metadata": {
            "sourceRepository": "gshan1209-cell/hw07",
            "sourceCommit": "91618e5e83812cb9fd0af3ded059dfd2731e821f",
            "generator": "scikit-learn Feature Selection & LinearRegression Evaluation Pipeline",
            "scikitLearnVersion": sklearn.__version__,
            "dataset": "Boston Housing Dataset",
            "datasetHash": dataset_hash,
            "totalRows": total_rows,
            "splitSeed": 42,
            "testSize": 0.2,
            "ethicalFeaturesCount": 12,
            "historicalFeaturesCount": 13,
            "generatedAt": "2026-07-28T00:00:00Z"
        },
        "ethicalMode": ethical_mode_results,
        "historicalMode": historical_mode_results
    }

    project_root = os.path.abspath(os.path.join(base_dir, "..", "..", "..", ".."))
    artifact_path = os.path.join(project_root, "modules", "feature-selection", "artifacts", "feature_selection_results.json")
    os.makedirs(os.path.dirname(artifact_path), exist_ok=True)
    with open(artifact_path, "w", encoding="utf-8") as f:
        json.dump(artifact, f, indent=2)
    print("Exported real Feature Selection results artifact successfully to", artifact_path)

if __name__ == "__main__":
    export_feature_selection()
