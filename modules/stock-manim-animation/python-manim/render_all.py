from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
from pathlib import Path
from typing import NamedTuple

SCENE_COMMANDS = [
    ("scenes/scene_00_title_intro.py", "TitleIntro"),
    ("scenes/scene_01_market_rules.py", "MarketRulesIntro"),
    ("scenes/scene_02_candlestick_basics.py", "CandlestickBasics"),
    ("scenes/scene_03_moving_average.py", "MovingAverageIntro"),
    ("scenes/scene_04_volume_price.py", "VolumePriceIntro"),
    ("scenes/scene_05_support_resistance.py", "SupportResistanceIntro"),
    ("scenes/scene_06_trend_breakout.py", "TrendBreakoutIntro"),
    ("scenes/scene_07_indicators_intro.py", "IndicatorsIntro"),
    ("scenes/scene_08_backtesting_risk.py", "BacktestingRiskIntro"),
]


class RenderResult(NamedTuple):
    scene: str
    source: str
    video_path: Path
    bytes: int
    duration: float
    width: int
    height: int
    sha256: str


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def build_render_command(
    source: str,
    scene: str,
    *,
    quality: str,
    media_dir: Path,
) -> list[str]:
    if "p" in quality.lstrip("-"):
        raise ValueError("Preview flags are not allowed in headless rendering")
    if not quality.startswith("-q"):
        raise ValueError("quality must be a Manim quality flag such as -ql or -qm")

    return [
        "manim",
        quality,
        "--media_dir",
        str(media_dir),
        source,
        scene,
    ]


def find_rendered_video(media_dir: Path, scene: str) -> Path:
    candidates = sorted(
        media_dir.rglob(f"{scene}.mp4"),
        key=lambda path: (path.stat().st_mtime_ns, path.stat().st_size),
        reverse=True,
    )
    if not candidates:
        raise FileNotFoundError(f"Manim did not produce an MP4 for {scene} in {media_dir}")
    return candidates[0]


def probe_video(path: Path) -> tuple[float, int, int]:
    completed = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height:format=duration",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    payload = json.loads(completed.stdout)
    streams = payload.get("streams") or []
    if not streams:
        raise RuntimeError(f"No video stream found in {path}")

    duration = float((payload.get("format") or {}).get("duration") or 0)
    width = int(streams[0].get("width") or 0)
    height = int(streams[0].get("height") or 0)
    if duration <= 0 or width <= 0 or height <= 0:
        raise RuntimeError(
            f"Invalid video metadata for {path}: duration={duration}, width={width}, height={height}"
        )
    return duration, width, height


def write_manifest(results: list[RenderResult], manifest_path: Path) -> None:
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "sceneCount": len(results),
        "scenes": [
            {
                "scene": result.scene,
                "source": result.source,
                "videoPath": str(result.video_path),
                "bytes": result.bytes,
                "duration": result.duration,
                "width": result.width,
                "height": result.height,
                "sha256": result.sha256,
            }
            for result in results
        ],
    }
    manifest_path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def render_all(
    quality: str = "-ql",
    *,
    media_dir: Path | None = None,
    project_dir: Path | None = None,
    strict: bool = True,
    manifest_path: Path | None = None,
) -> list[RenderResult]:
    project_dir = (project_dir or Path(__file__).resolve().parent).resolve()
    media_dir = (media_dir or project_dir / "runtime-media").resolve()
    media_dir.mkdir(parents=True, exist_ok=True)

    env = os.environ.copy()
    env["PYTHONPATH"] = str(project_dir)
    env.setdefault("MANIM_CHINESE_FONT", "Noto Sans CJK TC")

    results: list[RenderResult] = []
    for source, scene in SCENE_COMMANDS:
        source_path = project_dir / source
        if not source_path.exists():
            if strict:
                raise FileNotFoundError(f"Missing scene file: {source_path}")
            print(f"Skipping missing scene file: {source_path}")
            continue

        command = build_render_command(
            source,
            scene,
            quality=quality,
            media_dir=media_dir,
        )
        print("Running:", " ".join(command), flush=True)
        completed = subprocess.run(
            command,
            cwd=project_dir,
            env=env,
            check=strict,
        )
        if not strict and completed.returncode != 0:
            print(f"Skipping failed scene {scene}: exit {completed.returncode}")
            continue

        video_path = find_rendered_video(media_dir, scene)
        duration, width, height = probe_video(video_path)
        results.append(
            RenderResult(
                scene=scene,
                source=source,
                video_path=video_path,
                bytes=video_path.stat().st_size,
                duration=duration,
                width=width,
                height=height,
                sha256=sha256_file(video_path),
            )
        )

    if strict and len(results) != len(SCENE_COMMANDS):
        raise RuntimeError(
            f"Expected {len(SCENE_COMMANDS)} rendered scenes, got {len(results)}"
        )

    if manifest_path:
        write_manifest(results, manifest_path.resolve())
    return results


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Render and verify all stock Manim scenes")
    parser.add_argument("--quality", default="-ql", help="Manim quality flag, for example -ql")
    parser.add_argument(
        "--media-dir",
        type=Path,
        default=Path("runtime-media"),
        help="Directory for Manim output",
    )
    parser.add_argument(
        "--manifest",
        type=Path,
        default=Path("runtime-media/render-manifest.json"),
        help="Verified render manifest path",
    )
    parser.add_argument(
        "--no-strict",
        action="store_true",
        help="Continue after missing or failed scenes (not allowed in CI)",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    rendered = render_all(
        quality=args.quality,
        media_dir=args.media_dir,
        strict=not args.no_strict,
        manifest_path=args.manifest,
    )
    print(f"Verified {len(rendered)} rendered scene(s).")
