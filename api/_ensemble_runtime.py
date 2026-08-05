from __future__ import annotations

import hashlib
import io
import json
import threading
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[1]
ARTIFACT_DIR = PROJECT_ROOT / "modules" / "ensemble-income-predictor" / "runtime-artifacts"
LOCAL_MODEL_PATH = ARTIFACT_DIR / "adult_income_pipeline.joblib"
LOCAL_META_PATH = ARTIFACT_DIR / "deployed_model.json"

FALLBACK_MODEL_URL = (
    "https://raw.githubusercontent.com/gshan1209-cell/L20-Ensemble-Model/"
    "46f23c298da353ded39aca4cfa000c8df29589f4/"
    "adult-census-vercel/models/adult_income_pipeline.joblib"
)
EXPECTED_GIT_BLOB_SHA = "514ee4278a4b0aa45b867126a988ee97550ef546"
FALLBACK_MODEL_VERSION = "adult-income-rf-v1.0-source-pinned"
FALLBACK_MODEL_SOURCE = "gshan1209-cell/L20-Ensemble-Model@46f23c298da353ded39aca4cfa000c8df29589f4"

EDUCATION_NUM_MAP = {
    "Preschool": 1, "1st-4th": 2, "5th-6th": 3, "7th-8th": 4,
    "9th": 5, "10th": 6, "11th": 7, "12th": 8,
    "HS-grad": 9, "Some-college": 10, "Assoc-voc": 11,
    "Assoc-acdm": 12, "Bachelors": 13, "Masters": 14,
    "Prof-school": 15, "Doctorate": 16,
}
REQUIRED_FIELDS = [
    "age", "workclass", "education", "marital_status", "occupation",
    "relationship", "race", "sex", "capital_gain", "capital_loss",
    "hours_per_week", "native_country",
]

_pipeline = None
_model_bytes_sha256 = None
_model_meta: dict[str, Any] | None = None
_model_lock = threading.Lock()


class ValidationError(ValueError):
    pass


def git_blob_sha(data: bytes) -> str:
    header = f"blob {len(data)}\0".encode("utf-8")
    return hashlib.sha1(header + data).hexdigest()


def download_fallback_model_bytes() -> bytes:
    request = urllib.request.Request(
        FALLBACK_MODEL_URL,
        headers={"User-Agent": "AI-Learning-Portfolio/1.0"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        data = response.read()
    actual_blob_sha = git_blob_sha(data)
    if actual_blob_sha != EXPECTED_GIT_BLOB_SHA:
        raise RuntimeError(
            f"Pinned model blob mismatch: expected {EXPECTED_GIT_BLOB_SHA}, got {actual_blob_sha}"
        )
    return data


def read_local_meta() -> dict[str, Any] | None:
    if not LOCAL_META_PATH.exists():
        return None
    payload = json.loads(LOCAL_META_PATH.read_text(encoding="utf-8"))
    if payload.get("deployedModel") != "SoftVotingEnsemble":
        raise RuntimeError("Local deployment metadata is not a Soft Voting Ensemble artifact")
    return payload


def load_model():
    global _pipeline, _model_bytes_sha256, _model_meta
    if _pipeline is not None:
        return _pipeline
    with _model_lock:
        if _pipeline is not None:
            return _pipeline

        local_meta = read_local_meta()
        if LOCAL_MODEL_PATH.exists() and local_meta:
            data = LOCAL_MODEL_PATH.read_bytes()
            actual_sha256 = hashlib.sha256(data).hexdigest()
            expected_sha256 = str(local_meta.get("modelSha256") or "")
            if actual_sha256 != expected_sha256:
                raise RuntimeError(
                    f"Local model SHA-256 mismatch: expected {expected_sha256}, got {actual_sha256}"
                )
            _model_meta = local_meta
        else:
            data = download_fallback_model_bytes()
            actual_sha256 = hashlib.sha256(data).hexdigest()
            _model_meta = {
                "modelVersion": FALLBACK_MODEL_VERSION,
                "algorithm": "RandomForestClassifier",
                "deployedModel": "RandomForest",
                "modelSha256": actual_sha256,
                "sourceRepository": "gshan1209-cell/L20-Ensemble-Model",
                "sourceRevision": "46f23c298da353ded39aca4cfa000c8df29589f4",
            }

        _model_bytes_sha256 = actual_sha256
        _pipeline = joblib.load(io.BytesIO(data))
        return _pipeline


def validate_input(body: Any) -> dict[str, Any]:
    if not isinstance(body, dict):
        raise ValidationError("Request Body 必須是 JSON 物件。")
    missing = [field for field in REQUIRED_FIELDS if field not in body]
    if missing:
        raise ValidationError(f"缺少必要欄位：{', '.join(missing)}")

    age = body.get("age")
    hours = body.get("hours_per_week")
    capital_gain = body.get("capital_gain")
    capital_loss = body.get("capital_loss")
    if not isinstance(age, (int, float)) or isinstance(age, bool) or not 17 <= age <= 90:
        raise ValidationError("age 必須介於 17 到 90。")
    if not isinstance(hours, (int, float)) or isinstance(hours, bool) or not 1 <= hours <= 99:
        raise ValidationError("hours_per_week 必須介於 1 到 99。")
    for name, value in (("capital_gain", capital_gain), ("capital_loss", capital_loss)):
        if not isinstance(value, (int, float)) or isinstance(value, bool) or value < 0:
            raise ValidationError(f"{name} 必須是大於或等於 0 的數值。")

    for field in [
        "workclass", "education", "marital_status", "occupation",
        "relationship", "race", "sex", "native_country",
    ]:
        value = body.get(field)
        if not isinstance(value, str) or not value.strip() or len(value) > 100:
            raise ValidationError(f"{field} 必須是有效字串。")
    return body


def build_input_frame(data: dict[str, Any]) -> pd.DataFrame:
    education = data["education"].strip()
    return pd.DataFrame([{
        "age": float(data["age"]),
        "workclass": data["workclass"].strip(),
        "fnlwgt": float(data.get("fnlwgt", 189_778)),
        "education": education,
        "education_num": float(data.get("education_num", EDUCATION_NUM_MAP.get(education, 9))),
        "marital_status": data["marital_status"].strip(),
        "occupation": data["occupation"].strip(),
        "relationship": data["relationship"].strip(),
        "race": data["race"].strip(),
        "sex": data["sex"].strip(),
        "capital_gain": float(data["capital_gain"]),
        "capital_loss": float(data["capital_loss"]),
        "hours_per_week": float(data["hours_per_week"]),
        "native_country": data["native_country"].strip(),
    }])


def predict(body: Any) -> dict[str, Any]:
    clean = validate_input(body)
    model = load_model()
    frame = build_input_frame(clean)
    probabilities = model.predict_proba(frame)[0]
    classes = [str(value) for value in model.classes_]
    best_index = int(probabilities.argmax())
    class_probabilities = {
        label: round(float(probabilities[index]), 6)
        for index, label in enumerate(classes)
    }
    meta = _model_meta or {}
    model_version = str(meta.get("modelVersion") or FALLBACK_MODEL_VERSION)
    model_source = (
        f"{meta.get('sourceRepository')}@{meta.get('sourceRevision')}"
        if meta.get("sourceRepository") and meta.get("sourceRevision")
        else FALLBACK_MODEL_SOURCE
    )
    return {
        "prediction": classes[best_index],
        "probability": round(float(probabilities[best_index]), 6),
        "classProbabilities": class_probabilities,
        "modelVersion": model_version,
        "modelSource": model_source,
        "modelSha256": _model_bytes_sha256,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "disclaimer": (
            "僅供機器學習教學。不得用於徵才、薪資、授信、保險或其他高風險決策。"
        ),
    }


def runtime_status() -> dict[str, Any]:
    artifact_available = LOCAL_MODEL_PATH.exists() and LOCAL_META_PATH.exists()
    local_meta = read_local_meta() if artifact_available else None
    return {
        "ok": True,
        "artifactAvailable": artifact_available,
        "modelVersion": (
            local_meta.get("modelVersion") if local_meta else FALLBACK_MODEL_VERSION
        ),
        "deployedModel": (
            local_meta.get("deployedModel") if local_meta else "RandomForest"
        ),
        "modelSource": (
            f"{local_meta.get('sourceRepository')}@{local_meta.get('sourceRevision')}"
            if local_meta
            else FALLBACK_MODEL_SOURCE
        ),
        "expectedGitBlobSha": EXPECTED_GIT_BLOB_SHA,
        "loaded": _pipeline is not None,
        "modelSha256": (
            local_meta.get("modelSha256") if local_meta else _model_bytes_sha256
        ),
        "trainingData": "UCI Adult Dataset",
        "loggingSensitiveInputs": False,
        "disclaimer": "Educational use only; not for high-risk decisions.",
    }
