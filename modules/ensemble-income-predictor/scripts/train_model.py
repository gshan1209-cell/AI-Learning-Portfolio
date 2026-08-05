from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
import platform
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearn.base import clone
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier, VotingClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier

DATA_URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/adult/adult.data"
SOURCE_REPOSITORY = "gshan1209-cell/L20-Ensemble-Model"
SOURCE_REVISION = "46f23c298da353ded39aca4cfa000c8df29589f4"
MODEL_VERSION = "adult-income-rf-v1.1"
RANDOM_STATE = 42

COLUMN_NAMES = [
    "age", "workclass", "fnlwgt", "education", "education_num",
    "marital_status", "occupation", "relationship", "race", "sex",
    "capital_gain", "capital_loss", "hours_per_week", "native_country", "income",
]
NUMERIC_FEATURES = [
    "age", "fnlwgt", "education_num", "capital_gain", "capital_loss", "hours_per_week",
]
CATEGORICAL_FEATURES = [
    "workclass", "education", "marital_status", "occupation",
    "relationship", "race", "sex", "native_country",
]
TARGET = "income"
POSITIVE_LABEL = ">50K"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def download_dataset(cache_path: Path | None = None) -> tuple[pd.DataFrame, str]:
    if cache_path and cache_path.exists():
        raw = cache_path.read_bytes()
    else:
        request = urllib.request.Request(DATA_URL, headers={"User-Agent": "AI-Learning-Portfolio/1.0"})
        with urllib.request.urlopen(request, timeout=60) as response:
            raw = response.read()
        if cache_path:
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            cache_path.write_bytes(raw)

    frame = pd.read_csv(
        io.BytesIO(raw),
        header=None,
        names=COLUMN_NAMES,
        skipinitialspace=True,
        na_values="?",
    )
    frame[TARGET] = frame[TARGET].astype(str).str.strip().str.rstrip(".")
    frame = frame[frame[TARGET].isin(["<=50K", ">50K"])].reset_index(drop=True)
    return frame, sha256_bytes(raw)


def make_preprocessor() -> ColumnTransformer:
    numeric = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])
    categorical = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
    ])
    return ColumnTransformer([
        ("num", numeric, NUMERIC_FEATURES),
        ("cat", categorical, CATEGORICAL_FEATURES),
    ])


def make_models() -> dict[str, Pipeline]:
    preprocessor = make_preprocessor()
    logistic = LogisticRegression(max_iter=1_000, random_state=RANDOM_STATE)
    tree = DecisionTreeClassifier(max_depth=12, min_samples_leaf=8, random_state=RANDOM_STATE)
    forest = RandomForestClassifier(
        n_estimators=160,
        max_depth=None,
        min_samples_leaf=2,
        class_weight="balanced_subsample",
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )
    gradient = GradientBoostingClassifier(random_state=RANDOM_STATE)
    voting = VotingClassifier(
        estimators=[
            ("logistic", clone(logistic)),
            ("tree", clone(tree)),
            ("forest", clone(forest)),
        ],
        voting="soft",
        n_jobs=-1,
    )
    estimators = {
        "LogisticRegression": logistic,
        "DecisionTree": tree,
        "RandomForest": forest,
        "GradientBoosting": gradient,
        "SoftVotingEnsemble": voting,
    }
    return {
        name: Pipeline([
            ("preprocessor", clone(preprocessor)),
            ("classifier", estimator),
        ])
        for name, estimator in estimators.items()
    }


def score_model(model: Pipeline, x_test: pd.DataFrame, y_test: pd.Series) -> dict[str, Any]:
    predictions = model.predict(x_test)
    probabilities = model.predict_proba(x_test)
    classes = [str(value) for value in model.classes_]
    return {
        "accuracy": round(float(accuracy_score(y_test, predictions)), 6),
        "precision": round(float(precision_score(y_test, predictions, pos_label=POSITIVE_LABEL, zero_division=0)), 6),
        "recall": round(float(recall_score(y_test, predictions, pos_label=POSITIVE_LABEL, zero_division=0)), 6),
        "f1": round(float(f1_score(y_test, predictions, pos_label=POSITIVE_LABEL, zero_division=0)), 6),
        "confusionMatrix": confusion_matrix(y_test, predictions, labels=["<=50K", ">50K"]).tolist(),
        "classes": classes,
        "meanPositiveProbability": round(float(probabilities[:, classes.index(POSITIVE_LABEL)].mean()), 6),
    }


def safe_rate(numerator: int, denominator: int) -> float | None:
    return round(numerator / denominator, 6) if denominator else None


def group_fairness(
    x_test: pd.DataFrame,
    y_test: pd.Series,
    predictions: np.ndarray,
    group_column: str,
) -> dict[str, Any]:
    rows: dict[str, Any] = {}
    values = x_test[group_column].fillna("Unknown").astype(str)
    truth = y_test.reset_index(drop=True).astype(str)
    predicted = pd.Series(predictions).reset_index(drop=True).astype(str)
    values = values.reset_index(drop=True)

    for value in sorted(values.unique()):
        mask = values == value
        count = int(mask.sum())
        if count < 25:
            continue
        group_truth = truth[mask]
        group_pred = predicted[mask]
        positives = group_truth == POSITIVE_LABEL
        negatives = ~positives
        true_positive = int(((group_pred == POSITIVE_LABEL) & positives).sum())
        false_positive = int(((group_pred == POSITIVE_LABEL) & negatives).sum())
        selected = int((group_pred == POSITIVE_LABEL).sum())
        rows[value] = {
            "count": count,
            "actualPositiveCount": int(positives.sum()),
            "predictedPositiveCount": selected,
            "recall": safe_rate(true_positive, int(positives.sum())),
            "falsePositiveRate": safe_rate(false_positive, int(negatives.sum())),
            "selectionRate": safe_rate(selected, count),
        }
    return rows


def fixture_records() -> list[dict[str, Any]]:
    return [
        {
            "age": 39, "workclass": "Private", "fnlwgt": 77516,
            "education": "Bachelors", "education_num": 13,
            "marital_status": "Never-married", "occupation": "Adm-clerical",
            "relationship": "Not-in-family", "race": "White", "sex": "Male",
            "capital_gain": 2174, "capital_loss": 0, "hours_per_week": 40,
            "native_country": "United-States",
        },
        {
            "age": 50, "workclass": "Self-emp-not-inc", "fnlwgt": 83311,
            "education": "Bachelors", "education_num": 13,
            "marital_status": "Married-civ-spouse", "occupation": "Exec-managerial",
            "relationship": "Husband", "race": "White", "sex": "Male",
            "capital_gain": 0, "capital_loss": 0, "hours_per_week": 60,
            "native_country": "United-States",
        },
        {
            "age": 28, "workclass": "Private", "fnlwgt": 338409,
            "education": "HS-grad", "education_num": 9,
            "marital_status": "Never-married", "occupation": "Handlers-cleaners",
            "relationship": "Own-child", "race": "Black", "sex": "Female",
            "capital_gain": 0, "capital_loss": 0, "hours_per_week": 30,
            "native_country": "United-States",
        },
    ]


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def train(output_dir: Path, cache_path: Path | None = None) -> dict[str, Any]:
    frame, dataset_sha256 = download_dataset(cache_path)
    x = frame.drop(columns=[TARGET])
    y = frame[TARGET]
    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=RANDOM_STATE,
        stratify=y,
    )

    models = make_models()
    metrics: dict[str, Any] = {}
    for name, model in models.items():
        print(f"[TRAIN] {name}", flush=True)
        model.fit(x_train, y_train)
        metrics[name] = score_model(model, x_test, y_test)
        print(json.dumps({name: metrics[name]}, ensure_ascii=False), flush=True)

    deployed_name = "RandomForest"
    deployed = models[deployed_name]
    predictions = deployed.predict(x_test)
    fairness = {
        "method": "held-out test split, random_state=42, minimum group size=25",
        "warning": "These descriptive rates do not establish legal or ethical fairness and must not be used for high-risk decisions.",
        "groups": {
            "sex": group_fairness(x_test, y_test, predictions, "sex"),
            "race": group_fairness(x_test, y_test, predictions, "race"),
        },
    }

    fixtures = pd.DataFrame(fixture_records())
    fixture_probabilities = deployed.predict_proba(fixtures)
    fixture_classes = [str(value) for value in deployed.classes_]
    fixture_output = []
    for record, prediction, probability in zip(
        fixture_records(),
        deployed.predict(fixtures),
        fixture_probabilities,
        strict=True,
    ):
        fixture_output.append({
            "input": record,
            "prediction": str(prediction),
            "classProbabilities": {
                label: round(float(probability[index]), 8)
                for index, label in enumerate(fixture_classes)
            },
        })

    output_dir.mkdir(parents=True, exist_ok=True)
    model_path = output_dir / "adult_income_pipeline.joblib"
    joblib.dump(deployed, model_path, compress=3)
    model_sha256 = hashlib.sha256(model_path.read_bytes()).hexdigest()

    meta = {
        "modelVersion": MODEL_VERSION,
        "algorithm": "RandomForestClassifier",
        "deployedModel": deployed_name,
        "dataset": "UCI Adult Dataset",
        "datasetUrl": DATA_URL,
        "datasetSha256": dataset_sha256,
        "records": int(frame.shape[0]),
        "features": int(x.shape[1]),
        "randomState": RANDOM_STATE,
        "testSize": 0.2,
        "modelSha256": model_sha256,
        "sourceRepository": SOURCE_REPOSITORY,
        "sourceRevision": SOURCE_REVISION,
        "trainedAt": datetime.now(timezone.utc).isoformat(),
        "pythonVersion": platform.python_version(),
        "sklearnVersion": sklearn.__version__,
        "classes": fixture_classes,
        "disclaimer": "Educational use only. Do not use for hiring, compensation, lending, insurance, or other high-risk decisions.",
    }
    report = {
        "meta": meta,
        "metrics": metrics,
        "fairness": fairness,
        "fixturePredictions": fixture_output,
    }

    write_json(output_dir / "model_meta.json", meta)
    write_json(output_dir / "metrics.json", {"deployedModel": deployed_name, "models": metrics})
    write_json(output_dir / "fairness.json", fairness)
    write_json(output_dir / "fixture_predictions.json", fixture_output)
    write_json(output_dir / "training_report.json", report)
    print(json.dumps(report, ensure_ascii=False, indent=2), flush=True)
    return report


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train and evaluate Adult Census ensemble models")
    parser.add_argument("--output-dir", type=Path, default=Path(__file__).parents[1] / "runtime-artifacts")
    parser.add_argument("--dataset-cache", type=Path, default=Path(__file__).parents[1] / "data" / "adult.data")
    return parser.parse_args()


if __name__ == "__main__":
    arguments = parse_args()
    train(arguments.output_dir.resolve(), arguments.dataset_cache.resolve())
    sys.exit(0)
