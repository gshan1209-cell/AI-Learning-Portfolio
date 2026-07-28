from __future__ import annotations

import json
import math
import re
import subprocess
import sys
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
RF_ARTIFACT = ROOT / "modules/startup-profit-prediction/artifacts/startup_rf_model.json"
FEATURE_ARTIFACT = ROOT / "modules/feature-selection/artifacts/feature_selection_results.json"
RF_EXPORTER = ROOT / "modules/startup-profit-prediction/python-reference/export_rf_tree.py"
FEATURE_EXPORTER = ROOT / "modules/feature-selection/python-reference/scripts/export_feature_selection.py"
DIAGNOSTIC_FILE = ROOT / "artifact-verification-diagnostic.txt"
# generatedAt and datasetNote are descriptive. datasetHash is a raw-byte hash and
# can differ across Windows/Linux line-ending normalization even when rows match.
IGNORED_METADATA_KEYS = {"generatedAt", "datasetNote", "datasetHash"}
SHA256_PATTERN = re.compile(r"^[0-9a-f]{64}$")


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as file_handle:
        return json.load(file_handle)


def compare_values(
    committed: Any,
    regenerated: Any,
    path: str,
    *,
    relative_tolerance: float = 1e-8,
    absolute_tolerance: float = 1e-6,
) -> None:
    if isinstance(committed, bool) or isinstance(regenerated, bool):
        if committed is not regenerated:
            raise RuntimeError(f"Boolean mismatch at {path}: {committed!r} != {regenerated!r}")
        return

    if isinstance(committed, (int, float)) and isinstance(regenerated, (int, float)):
        if not math.isclose(
            float(committed),
            float(regenerated),
            rel_tol=relative_tolerance,
            abs_tol=absolute_tolerance,
        ):
            raise RuntimeError(f"Numeric mismatch at {path}: {committed!r} != {regenerated!r}")
        return

    if isinstance(committed, dict) and isinstance(regenerated, dict):
        committed_keys = set(committed)
        regenerated_keys = set(regenerated)
        if path.endswith("metadata"):
            committed_keys -= IGNORED_METADATA_KEYS
            regenerated_keys -= IGNORED_METADATA_KEYS
        if committed_keys != regenerated_keys:
            raise RuntimeError(
                f"Key mismatch at {path}: committed={sorted(committed_keys)}, regenerated={sorted(regenerated_keys)}"
            )
        for key in sorted(committed_keys):
            compare_values(
                committed[key],
                regenerated[key],
                f"{path}.{key}",
                relative_tolerance=relative_tolerance,
                absolute_tolerance=absolute_tolerance,
            )
        return

    if isinstance(committed, list) and isinstance(regenerated, list):
        if len(committed) != len(regenerated):
            raise RuntimeError(f"Length mismatch at {path}: {len(committed)} != {len(regenerated)}")
        for index, (committed_item, regenerated_item) in enumerate(zip(committed, regenerated)):
            compare_values(
                committed_item,
                regenerated_item,
                f"{path}[{index}]",
                relative_tolerance=relative_tolerance,
                absolute_tolerance=absolute_tolerance,
            )
        return

    if committed != regenerated:
        raise RuntimeError(f"Value mismatch at {path}: {committed!r} != {regenerated!r}")


def validate_hash(label: str, value: Any) -> None:
    if not isinstance(value, str) or not SHA256_PATTERN.fullmatch(value):
        raise RuntimeError(f"{label} must be a 64-character lowercase SHA-256 value")


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

    for label, payload in (
        ("Committed Random Forest datasetHash", committed_rf["metadata"].get("datasetHash")),
        ("Regenerated Random Forest datasetHash", regenerated_rf["metadata"].get("datasetHash")),
        ("Committed Feature Selection datasetHash", committed_feature["metadata"].get("datasetHash")),
        ("Regenerated Feature Selection datasetHash", regenerated_feature["metadata"].get("datasetHash")),
    ):
        validate_hash(label, payload)

    compare_values(committed_rf, regenerated_rf, "randomForestArtifact")
    print("PASS: Random Forest artifact structure, topology and predictions are reproducible")

    compare_values(
        committed_feature,
        regenerated_feature,
        "featureSelectionArtifact",
        relative_tolerance=1e-6,
        absolute_tolerance=1e-5,
    )
    print("PASS: Feature Selection rankings and metrics are reproducible within numeric tolerance")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        DIAGNOSTIC_FILE.write_text(f"{type(error).__name__}: {error}\n", encoding="utf-8")
        raise
