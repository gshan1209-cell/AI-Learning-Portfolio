from __future__ import annotations

import importlib.util
import json
from pathlib import Path
from types import SimpleNamespace

import pytest

MODULE_PATH = Path(__file__).parents[1] / "render_all.py"
SPEC = importlib.util.spec_from_file_location("stock_manim_render_all", MODULE_PATH)
assert SPEC and SPEC.loader
render_module = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(render_module)


def test_scene_registry_contains_exactly_nine_unique_scenes() -> None:
    assert len(render_module.SCENE_COMMANDS) == 9
    assert len({scene for _, scene in render_module.SCENE_COMMANDS}) == 9


def test_build_render_command_is_headless_and_uses_explicit_media_dir(tmp_path: Path) -> None:
    command = render_module.build_render_command(
        "scenes/scene_02_candlestick_basics.py",
        "CandlestickBasics",
        quality="-ql",
        media_dir=tmp_path,
    )

    assert command[:2] == ["manim", "-ql"]
    assert "-p" not in " ".join(command)
    assert command[2:4] == ["--media_dir", str(tmp_path)]
    assert command[-2:] == [
        "scenes/scene_02_candlestick_basics.py",
        "CandlestickBasics",
    ]


def test_render_all_fails_fast_when_scene_file_is_missing(tmp_path: Path) -> None:
    with pytest.raises(FileNotFoundError):
        render_module.render_all(
            quality="-ql",
            media_dir=tmp_path / "media",
            project_dir=tmp_path,
            strict=True,
        )


def test_render_all_propagates_non_zero_manim_exit(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    project_dir = tmp_path / "project"
    scene_path = project_dir / render_module.SCENE_COMMANDS[0][0]
    scene_path.parent.mkdir(parents=True)
    scene_path.write_text("# fixture", encoding="utf-8")

    monkeypatch.setattr(render_module, "SCENE_COMMANDS", [render_module.SCENE_COMMANDS[0]])

    def fail_runner(*args, **kwargs):
        raise render_module.subprocess.CalledProcessError(2, args[0])

    monkeypatch.setattr(render_module.subprocess, "run", fail_runner)

    with pytest.raises(render_module.subprocess.CalledProcessError):
        render_module.render_all(
            quality="-ql",
            media_dir=tmp_path / "media",
            project_dir=project_dir,
            strict=True,
        )


def test_write_manifest_contains_verified_video_metadata(tmp_path: Path) -> None:
    video = tmp_path / "CandlestickBasics.mp4"
    video.write_bytes(b"real-video-fixture")
    result = render_module.RenderResult(
        scene="CandlestickBasics",
        source="scenes/scene_02_candlestick_basics.py",
        video_path=video,
        bytes=video.stat().st_size,
        duration=2.5,
        width=854,
        height=480,
        sha256=render_module.sha256_file(video),
    )

    manifest_path = tmp_path / "render-manifest.json"
    render_module.write_manifest([result], manifest_path)
    payload = json.loads(manifest_path.read_text(encoding="utf-8"))

    assert payload["sceneCount"] == 1
    assert payload["scenes"][0] == {
        "scene": "CandlestickBasics",
        "source": "scenes/scene_02_candlestick_basics.py",
        "videoPath": str(video),
        "bytes": len(b"real-video-fixture"),
        "duration": 2.5,
        "width": 854,
        "height": 480,
        "sha256": result.sha256,
    }
