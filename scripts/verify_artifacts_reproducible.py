from __future__ import annotations

import copy
import hashlib
import json
import subprocess
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
RF_ARTIFACT = ROOT / "modules/startup-profit-prediction/artifacts/startup_rf_model.json"
FEATURE_ARTIFACT = ROOT / "modules/feature-selection/artifacts/feature_selection_results.json"
RF_EXPORTER = ROOT / "modules/startup-profit-prediction/python-reference/export_rf_tree.py"
FEATURE_EXPORTER = ROOT / "modules/feature-selection/python-reference/scripts/export_feature_selection.py"


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as file_handle:
        return json.load(file_handle)


def stable_hash(payload: dict[str, Any]) -> str:
    encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def normalize_rf(payload: dict[str, Any]) -> dict[str, Any]:
    normalized = copy.deepcopy(payload)
    metadata = normalized.get("metadata", {})
    # These descriptive fields may be corrected independently of model structure.
    metadata.pop("generatedAt", None)
    metadata.pop("datasetNote", None)
    return normalized


def normalize_feature(payload: dict[str, Any]) -> dict[str, Any]:
    normalized = copy.deepcopy(payload)
    metadata = normalized.get("metadata", {})
    metadata.pop("generatedAt", None)
    return normalized


def assert_equal(name: str, committed: dict[str, Any], regenerated: dict[str, Any]) -> None:
    committed_hash = stable_hash(committed)
    regenerated_hash = stable_hash(regenerated)
    if committed_hash != regenerated_hash:
        raise RuntimeError(
            f"{name} is not reproducible: committed={committed_hash}, regenerated={regenerated_hash}"
        )
    print(f"PASS: {name} reproducible hash {committed_hash}")


def main() -> None:
    committed_rf = load_json(RF_ARTIFACT)
    committed_feature = load_json(FEATURE_ARTIFACT)

    subprocess.run([sys.executable, str(RF_EXPORTER)], cwd=ROOT, check=True)
    subprocess.run([sys.executable, str(FEATURE_EXPORTER)], cwd=ROOT, check=True)

    regenerated_rf = load_json(RF_ARTIFACT)
    regenerated_feature = load_json(FEATURE_ARTIFACT)

    row_count = regenerated_rf["metadata"]["datasetRows"]
    expected_note = f"來源檔 50_Startups.csv 實際包含 {row_count} 筆紀錄"
    if regenerated_rf["metadata"].get("datasetNote") != expected_note:
        raise RuntimeError("Random Forest exporter generated an inaccurate datasetNote")

    assert_equal(
        "Random Forest artifact",
        normalize_rf(committed_rf),
        normalize_rf(regenerated_rf),
    )
    assert_equal(
        "Feature Selection artifact",
        normalize_feature(committed_feature),
        normalize_feature(regenerated_feature),
    )


if __name__ == "__main__":
    main()
