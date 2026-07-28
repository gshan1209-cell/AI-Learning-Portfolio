from manim import *
from shared.theme import *
from shared.chart_components import create_candlestick_chart
from shared.data_samples import get_sample_ohlcv_data
from shared.text_components import title_text, body_text, small_text, create_legend
from shared.layout_components import create_footer_warning, create_3d_panel
from shared.animation_utils import draw_chart_frame, create_gradient_background

import numpy as np


class MovingAverageIntro(Scene):
    def construct(self):
        create_gradient_background(self)

        title = title_text("均線 MA：把雜訊變平滑，觀察大方向")
        title.to_edge(UP, buff=0.5)
        self.play(FadeIn(title, run_time=0.8))

        df = get_sample_ohlcv_data()
        close_prices = df["close"].values
        n = len(close_prices)

        chart_center = DOWN * 0.4
        chart_frame = draw_chart_frame(width=8, height=4)
        chart_frame.move_to(chart_center)

        candles = create_candlestick_chart(df, width=7.5, height=3.5, with_3d=True)
        candles.move_to(chart_center)

        self.play(Create(chart_frame, run_time=0.6))
        self.play(FadeIn(candles, run_time=0.8))

        x_positions_full = [7.5 * (i / (n - 1) - 0.5) for i in range(n)]
        price_min = df["low"].min()
        price_max = df["high"].max()
        price_range = price_max - price_min
        offset = 0.15 * price_range
        price_min -= offset
        price_max += offset
        price_range = price_max - price_min
        scale = 3.5 / price_range
        shift = (price_min + price_max) / 2

        def build_ma(values, period):
            result = np.full(n, np.nan)
            for i in range(period - 1, n):
                result[i] = np.mean(close_prices[i - period + 1:i + 1])
            return result

        ma5_values = build_ma(close_prices, 3)
        ma20_values = build_ma(close_prices, 5)
        ma60_values = build_ma(close_prices, 7)

        def build_points(values):
            pts = []
            for i in range(n):
                if not np.isnan(values[i]):
                    y = (values[i] - shift) * scale + chart_center[1]
                    pts.append([x_positions_full[i], y, 0])
            return pts

        def create_ma_with_glow(points, color, glow_color, stroke_w=5):
            glow = VMobject(color=glow_color, stroke_width=stroke_w + 7, stroke_opacity=0.15)
            glow.set_points_smoothly(points)
            line = VMobject(color=color, stroke_width=stroke_w)
            line.set_points_smoothly(points)
            return VGroup(glow, line)

        ma5_line = create_ma_with_glow(build_points(ma5_values), COLOR_MA5, COLOR_MA5_GLOW, 5)
        ma20_line = create_ma_with_glow(build_points(ma20_values), COLOR_MA20, COLOR_MA20_GLOW, 5)
        ma60_line = create_ma_with_glow(build_points(ma60_values), COLOR_MA60, COLOR_MA60_GLOW, 5)

        subtitle = body_text("加入均線，觀察趨勢方向")
        subtitle.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle, run_time=0.4))

        self.play(Create(ma5_line, run_time=1.0))
        self.wait(0.2)
        self.play(Create(ma20_line, run_time=1.0))
        self.wait(0.2)
        self.play(Create(ma60_line, run_time=1.0))
        self.wait(0.5)

        legend = create_legend(
            labels=["MA5 短線觀察", "MA20 中線觀察", "MA60 長線觀察"],
            colors=[COLOR_MA5, COLOR_MA20, COLOR_MA60],
            font_size=FONT_TINY_SIZE,
        )
        legend.to_edge(RIGHT, buff=0.6).shift(UP * 1.0)
        self.play(FadeIn(legend, run_time=0.6))

        key_text = body_text("均線是輔助觀察工具，不是預言")
        key_text.move_to(DOWN * 3.2)
        self.play(FadeIn(key_text, run_time=0.6))
        self.wait(1.0)

        footer = create_footer_warning("均線可以幫助我們把雜訊變平滑，觀察價格的大方向。輔助觀察，不是預言。")
        footer.to_edge(DOWN, buff=0.3)
        self.play(FadeOut(key_text), FadeIn(footer), run_time=0.6)
        self.wait(2.0)
