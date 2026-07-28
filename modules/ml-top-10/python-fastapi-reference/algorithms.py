import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

router = APIRouter()
DATA_FILE = Path(__file__).parent / "data" / "algorithms.json"


def load_algorithms_data():
    with DATA_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


@router.get("/")
def get_all_algorithms():
    return load_algorithms_data()


@router.get("/{slug}")
def get_algorithm_by_slug(slug: str):
    for item in load_algorithms_data():
        if item["slug"] == slug:
            return item
    raise HTTPException(status_code=404, detail="Algorithm not found")
