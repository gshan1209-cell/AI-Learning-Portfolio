from manim import *
from shared.theme import *
from shared.chart_components import create_candlestick_chart
from shared.data_samples import get_indicator_data
from shared.text_components import title_text, body_text, small_text, create_legend
from shared.layout_components import create_footer_warning, create_card, create_3d_panel
from shared.animation_utils import draw_chart_frame, create_gradient_background

import numpy as np


class IndicatorsIntro(Scene):
    def construct(self):
        create_gradient_background(self)

        title = title_text("技術指標入門：RSI / MACD / 布林通道")
        title.to_edge(UP, buff=0.4)
        self.play(FadeIn(title, run_time=0.8))

        df = get_indicator_data()
        close_prices = df["close"].values
        n = len(close_prices)
        x_positions = np.linspace(-3.8, 3.8, n)

        subtitle1 = body_text("RSI：相對強弱指標，觀察過熱與過冷")
        subtitle1.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle1, run_time=0.5))

        changes = np.diff(close_prices, prepend=close_prices[0])
        gains = np.where(changes > 0, changes, 0)
        losses = np.where(changes < 0, -changes, 0)
        rsi_values = np.zeros(n)
        for i in range(1, n):
            avg_gain = np.mean(gains[max(0, i - 5):i + 1])
            avg_loss = np.mean(losses[max(0, i - 5):i + 1])
            rsi_values[i] = 100 if avg_loss == 0 else 100 - 100 / (1 + avg_gain / avg_loss)

        rsi_center = DOWN * 1.8
        rsi_frame = Rectangle(
            width=8, height=1.2,
            stroke_color=COLOR_GRID, stroke_width=2,
            fill_color=COLOR_BG, fill_opacity=0.3,
        )
        rsi_frame.move_to(rsi_center)

        rsi_label_left = small_text("RSI")
        rsi_label_left.set_color(COLOR_PURPLE)
        rsi_label_left.next_to(rsi_frame, LEFT, buff=0.3)

        rsi_norm = (rsi_values / 100) * 1.0 + rsi_center[1] - 0.5
        rsi_points = [[x_positions[i], rsi_norm[i], 0] for i in range(n)]

        rsi_glow = VMobject(color=COLOR_PURPLE, stroke_width=7, stroke_opacity=0.15)
        rsi_glow.set_points_smoothly(rsi_points)
        rsi_line = VMobject(color=COLOR_PURPLE, stroke_width=3.5)
        rsi_line.set_points_smoothly(rsi_points)

        ob_y = rsi_center[1] + 0.2
        os_y = rsi_center[1] - 0.3

        ob_line = DashedLine([-3.8, ob_y, 0], [3.8, ob_y, 0], color=COLOR_RED_UP, stroke_width=2, dash_length=0.1)
        os_line = DashedLine([-3.8, os_y, 0], [3.8, os_y, 0], color=COLOR_GREEN_DOWN, stroke_width=2, dash_length=0.1)

        ob_label = small_text("70 (過熱)")
        ob_label.set_color(COLOR_RED_UP)
        ob_label.scale(0.7)
        ob_label.next_to(ob_line, RIGHT, buff=0.15)
        os_label = small_text("30 (過冷)")
        os_label.set_color(COLOR_GREEN_DOWN)
        os_label.scale(0.7)
        os_label.next_to(os_line, RIGHT, buff=0.15)

        self.play(Create(rsi_frame), FadeIn(rsi_label_left), run_time=0.5)
        self.play(Create(rsi_glow), Create(rsi_line), run_time=0.8)
        self.play(Create(ob_line), Create(os_line), FadeIn(ob_label), FadeIn(os_label), run_time=0.5)
        self.wait(1.0)

        self.play(FadeOut(subtitle1), FadeOut(rsi_frame), FadeOut(rsi_label_left),
                  FadeOut(rsi_glow), FadeOut(rsi_line), FadeOut(ob_line), FadeOut(os_line),
                  FadeOut(ob_label), FadeOut(os_label), run_time=0.5)

        subtitle2 = body_text("MACD：觀察趨勢動能變化")
        subtitle2.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle2, run_time=0.5))

        ema12 = np.zeros(n)
        ema26 = np.zeros(n)
        ema12[0], ema26[0] = close_prices[0], close_prices[0]
        for i in range(1, n):
            ema12[i] = close_prices[i] * 2 / 13 + ema12[i - 1] * 11 / 13
            ema26[i] = close_prices[i] * 2 / 27 + ema26[i - 1] * 25 / 27

        dif = ema12 - ema26
        dea = np.zeros(n)
        dea[0] = dif[0]
        for i in range(1, n):
            dea[i] = dif[i] * 2 / 10 + dea[i - 1] * 8 / 10
        macd_bar = 2 * (dif - dea)

        macd_center = DOWN * 1.8
        macd_frame = Rectangle(
            width=8, height=1.2,
            stroke_color=COLOR_GRID, stroke_width=2,
            fill_color=COLOR_BG, fill_opacity=0.3,
        )
        macd_frame.move_to(macd_center)

        macd_label_left = small_text("MACD")
        macd_label_left.set_color(COLOR_PURPLE)
        macd_label_left.next_to(macd_frame, LEFT, buff=0.3)

        all_macd = np.concatenate([dif, dea, macd_bar])
        macd_max = max(abs(all_macd.max()), abs(all_macd.min()))
        macd_scale = 0.4 / macd_max if macd_max > 0 else 1

        dif_points = [[x_positions[i], dif[i] * macd_scale + macd_center[1], 0] for i in range(n)]
        dea_points = [[x_positions[i], dea[i] * macd_scale + macd_center[1], 0] for i in range(n)]

        dif_glow = VMobject(color=COLOR_MA5, stroke_width=7, stroke_opacity=0.15)
        dif_glow.set_points_smoothly(dif_points)
        dif_line = VMobject(color=COLOR_MA5, stroke_width=3.5)
        dif_line.set_points_smoothly(dif_points)

        dea_line = VMobject(color=COLOR_MA20, stroke_width=3.5)
        dea_line.set_points_smoothly(dea_points)

        bars = VGroup()
        for i in range(n):
            bar_val = macd_bar[i] * macd_scale
            bar_color = COLOR_RED_UP if bar_val >= 0 else COLOR_GREEN_DOWN
            bar = Rectangle(
                width=0.12, height=abs(bar_val),
                fill_color=bar_color, fill_opacity=0.8, stroke_width=0,
            )
            bar.move_to([x_positions[i], macd_center[1] + bar_val / 2, 0])
            bars.add(bar)

        self.play(Create(macd_frame), FadeIn(macd_label_left), run_time=0.5)
        self.play(Create(dif_glow), Create(dif_line), Create(dea_line), FadeIn(bars), run_time=0.8)
        self.wait(1.0)

        self.play(FadeOut(subtitle2), FadeOut(macd_frame), FadeOut(macd_label_left),
                  FadeOut(dif_glow), FadeOut(dif_line), FadeOut(dea_line), FadeOut(bars), run_time=0.5)

        subtitle3 = body_text("布林通道：觀察價格波動區間")
        subtitle3.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle3, run_time=0.5))

        chart_center = DOWN * 0.2
        chart_frame = draw_chart_frame(width=8, height=3.0)
        chart_frame.move_to(chart_center)

        candles = create_candlestick_chart(df, width=7.5, height=2.8, with_3d=True)
        candles.move_to(chart_center)

        window = 5
        bb_mid = np.zeros(n)
        bb_upper = np.zeros(n)
        bb_lower = np.zeros(n)
        for i in range(n):
            wp = close_prices[max(0, i - window + 1):i + 1]
            bb_mid[i] = np.mean(wp)
            s = np.std(wp)
            bb_upper[i] = bb_mid[i] + 2 * s
            bb_lower[i] = bb_mid[i] - 2 * s

        price_min = df["low"].min()
        price_max = df["high"].max()
        p_range = price_max - price_min
        offset = 0.15 * p_range
        price_min -= offset
        price_max += offset
        p_range = price_max - price_min
        scale = 2.8 / p_range
        shift = (price_min + price_max) / 2

        def build_band_points(values):
            return [[x_positions[i], (values[i] - shift) * scale + chart_center[1], 0] for i in range(n)]

        mid_pts = build_band_points(bb_mid)
        upper_pts = build_band_points(bb_upper)
        lower_pts = build_band_points(bb_lower)

        upper_glow = VMobject(color=COLOR_ORANGE, stroke_width=6, stroke_opacity=0.12)
        upper_glow.set_points_smoothly(upper_pts)
        upper_line = VMobject(color=COLOR_ORANGE, stroke_width=2.5, stroke_opacity=0.7)
        upper_line.set_points_smoothly(upper_pts)

        lower_glow = VMobject(color=COLOR_ORANGE, stroke_width=6, stroke_opacity=0.12)
        lower_glow.set_points_smoothly(lower_pts)
        lower_line = VMobject(color=COLOR_ORANGE, stroke_width=2.5, stroke_opacity=0.7)
        lower_line.set_points_smoothly(lower_pts)

        mid_line = VMobject(color=COLOR_BLUE, stroke_width=2.5)
        mid_line.set_points_smoothly(mid_pts)

        self.play(Create(chart_frame), FadeIn(candles), run_time=0.8)
        self.play(Create(upper_glow), Create(lower_glow),
                  Create(upper_line), Create(lower_line), Create(mid_line), run_time=1.0)

        bb_legend = create_legend(
            labels=["上軌 (+2σ)", "中軌 (MA)", "下軌 (-2σ)"],
            colors=[COLOR_ORANGE, COLOR_BLUE, COLOR_ORANGE],
            font_size=FONT_TINY_SIZE,
        )
        bb_legend.to_edge(RIGHT, buff=0.5).shift(UP * 1.0)
        self.play(FadeIn(bb_legend, run_time=0.5))
        self.wait(1.0)

        self.play(FadeOut(subtitle3), FadeOut(chart_frame), FadeOut(candles),
                  FadeOut(upper_glow), FadeOut(lower_glow),
                  FadeOut(upper_line), FadeOut(lower_line), FadeOut(mid_line),
                  FadeOut(bb_legend), run_time=0.5)

        final_text = body_text("技術指標是輔助判斷工具，最好不要單獨使用")
        final_text.next_to(title, DOWN, buff=0.8)
        self.play(FadeIn(final_text, run_time=0.6))

        final_sub = small_text("搭配趨勢、量能與風控，才能做出更全面的判斷")
        final_sub.set_color(COLOR_GRAY)
        final_sub.next_to(final_text, DOWN, buff=0.5)
        self.play(FadeIn(final_sub, run_time=0.5))
        self.wait(1.0)

        footer = create_footer_warning("技術指標是輔助判斷工具，最好不要單獨使用。指標不是預言，有明顯限制。")
        footer.to_edge(DOWN, buff=0.3)
        self.play(FadeIn(footer, run_time=0.5))
        self.wait(2.0)
