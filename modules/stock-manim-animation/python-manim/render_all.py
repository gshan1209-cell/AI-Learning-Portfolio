import os
import subprocess
from pathlib import Path

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


def render_all(quality="-pql"):
    env = os.environ.copy()
    env["PYTHONPATH"] = str(Path(__file__).parent.absolute())

    for file_path, scene_name in SCENE_COMMANDS:
        if not Path(file_path).exists():
            print(f"Missing file: {file_path}")
            continue

        cmd = ["manim", quality, file_path, scene_name]
        print("Running:", " ".join(cmd))
        subprocess.run(cmd, env=env, check=False)


if __name__ == "__main__":
    render_all()
