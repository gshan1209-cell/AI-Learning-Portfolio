from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from sklearn.model_selection import train_test_split

TRAINER_PATH = Path(__file__).with_name("train_model.py")
SPEC = importlib.util.spec_from_file_location("ensemble_trainer", TRAINER_PATH)
if not SPEC or not SPEC.loader:
    raise RuntimeError(f"Unable to load trainer module: {TRAINER_PATH}")
trainer = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(trainer)

DEPLOYED_MODEL_NAME = "SoftVotingEnsemble"
MODEL_VERSION = "adult-income-soft-voting-v1.1"


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def export_soft_voting(output_dir: Path, cache_path: Path) -> dict[str, Any]:
    frame, dataset_sha256 = trainer.download_dataset(cache_path)
    x = frame.drop(columns=[trainer.TARGET])
    y = frame[trainer.TARGET]
    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=trainer.RANDOM_STATE,
        stratify=y,
    )

    model = trainer.make_models()[DEPLOYED_MODEL_NAME]
    print(f"[DEPLOY] Training {DEPLOYED_MODEL_NAME}", flush=True)
    model.fit(x_train, y_train)
    metrics = trainer.score_model(model, x_test, y_test)
    predictions = model.predict(x_test)
    fairness = {
        "model": DEPLOYED_MODEL_NAME,
        "method": "held-out test split, random_state=42, minimum group size=25",
        "warning": "These descriptive rates do not establish legal or ethical fairness and must not be used for high-risk decisions.",
        "groups": {
            "sex": trainer.group_fairness(x_test, y_test, predictions, "sex"),
            "race": trainer.group_fairness(x_test, y_test, predictions, "race"),
        },
    }

    fixtures = trainer.fixture_records()
    fixture_frame = pd.DataFrame(fixtures)
    probabilities = model.predict_proba(fixture_frame)
    classes = [str(value) for value in model.classes_]
    fixture_predictions = []
    for record, prediction, probability in zip(
        fixtures,
        model.predict(fixture_frame),
        probabilities,
        strict=True,
    ):
        fixture_predictions.append({
            "input": record,
            "prediction": str(prediction),
            "classProbabilities": {
                label: round(float(probability[index]), 8)
                for index, label in enumerate(classes)
            },
        })

    output_dir.mkdir(parents=True, exist_ok=True)
    model_path = output_dir / "adult_income_pipeline.joblib"
    joblib.dump(model, model_path, compress=3)
    model_sha256 = hashlib.sha256(model_path.read_bytes()).hexdigest()

    deployed_meta = {
        "modelVersion": MODEL_VERSION,
        "algorithm": "VotingClassifier(voting=soft)",
        "deployedModel": DEPLOYED_MODEL_NAME,
        "dataset": "UCI Adult Dataset",
        "datasetUrl": trainer.DATA_URL,
        "datasetSha256": dataset_sha256,
        "records": int(frame.shape[0]),
        "features": int(x.shape[1]),
        "randomState": trainer.RANDOM_STATE,
        "testSize": 0.2,
        "modelSha256": model_sha256,
        "sourceRepository": trainer.SOURCE_REPOSITORY,
        "sourceRevision": trainer.SOURCE_REVISION,
        "classes": classes,
        "metrics": metrics,
        "disclaimer": "Educational use only. Do not use for hiring, compensation, lending, insurance, or other high-risk decisions.",
    }

    write_json(output_dir / "deployed_model.json", deployed_meta)
    write_json(output_dir / "fairness.json", fairness)
    write_json(output_dir / "deployed_fixture_predictions.json", fixture_predictions)
    print(json.dumps({
        "deployedModel": deployed_meta,
        "fairness": fairness,
        "fixturePredictions": fixture_predictions,
    }, ensure_ascii=False, indent=2), flush=True)
    return deployed_meta


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export the verified Soft Voting deployment artifact")
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--dataset-cache", type=Path, required=True)
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    export_soft_voting(args.output_dir.resolve(), args.dataset_cache.resolve())
