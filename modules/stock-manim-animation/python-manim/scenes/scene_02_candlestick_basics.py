from manim import *
from shared.theme import *
from shared.chart_components import create_candle, create_candlestick_chart
from shared.data_samples import get_sample_ohlcv_data
from shared.text_components import title_text, body_text, small_text
from shared.layout_components import create_footer_warning
from shared.animation_utils import draw_chart_frame, create_glow_circle, create_gradient_background
import numpy as np


class CandlestickBasics(Scene):
    def construct(self):
        create_gradient_background(self)

        title = title_text("K 線基礎：看懂一根 K 線")
        title.to_edge(UP, buff=0.6)
        self.play(FadeIn(title, run_time=0.8))
        self.wait(0.3)

        subtitle1 = body_text("一根 K 線包含四個價格資訊")
        subtitle1.next_to(title, DOWN, buff=0.5)
        self.play(FadeIn(subtitle1, run_time=0.6))

        center_candle = create_candle(100, 106, 108, 98, x=0, scale=0.08)
        center_candle.move_to(ORIGIN).shift(DOWN * 0.3)
        self.play(FadeIn(center_candle, run_time=0.8))
        self.wait(0.3)

        label_configs = [
            ("High 最高價", [0, 108 * 0.08, 0], UP),
            ("Close 收盤價", [0.65, 106 * 0.08, 0], RIGHT),
            ("Open 開盤價", [-0.65, 100 * 0.08, 0], LEFT),
            ("Low 最低價", [0, 98 * 0.08, 0], DOWN),
        ]

        labels = VGroup()
        for text, pos, direction in label_configs:
            glow = create_glow_circle(pos, radius=0.08, color=COLOR_BLUE, opacity=0.2)
            label = small_text(text)
            label.next_to(pos, direction, buff=0.3)
            if np.array_equal(direction, RIGHT):
                label.align_to([pos[0], pos[1], 0], LEFT)
            labels.add(VGroup(glow, label))

        self.play(FadeIn(labels, run_time=1.0))
        self.wait(1.0)

        self.play(FadeOut(subtitle1), FadeOut(center_candle), FadeOut(labels), run_time=0.5)

        subtitle2 = body_text("收盤價低於開盤價 = 綠 K")
        subtitle2.next_to(title, DOWN, buff=0.5)
        self.play(FadeIn(subtitle2, run_time=0.5))

        green_candle = create_candle(100, 95, 102, 93, x=0, scale=0.08)
        green_candle.move_to(ORIGIN).shift(DOWN * 0.3)
        self.play(FadeIn(green_candle, run_time=0.8))
        self.wait(1.0)

        self.play(FadeOut(subtitle2), FadeOut(green_candle), run_time=0.5)

        subtitle3 = body_text("台股慣例：紅色上漲 ｜ 綠色下跌")
        subtitle3.next_to(title, DOWN, buff=0.5)
        self.play(FadeIn(subtitle3, run_time=0.5))

        red_candle = create_candle(100, 106, 108, 98, x=-1.5, scale=0.06)
        green_candle2 = create_candle(100, 94, 103, 92, x=1.5, scale=0.06)

        red_label = small_text("紅 K = 漲")
        red_label.next_to(red_candle, DOWN, buff=0.4)
        green_label = small_text("綠 K = 跌")
        green_label.next_to(green_candle2, DOWN, buff=0.4)

        comparison = VGroup(red_candle, green_candle2, red_label, green_label)
        comparison.move_to(ORIGIN).shift(DOWN * 0.3)

        self.play(FadeIn(red_candle), FadeIn(green_candle2), run_time=0.8)
        self.play(FadeIn(red_label), FadeIn(green_label), run_time=0.5)
        self.wait(1.0)

        self.play(FadeOut(subtitle3), FadeOut(comparison), run_time=0.6)

        subtitle4 = body_text("多根 K 線組合，形成價格走勢")
        subtitle4.next_to(title, DOWN, buff=0.5)
        self.play(FadeIn(subtitle4, run_time=0.5))

        df = get_sample_ohlcv_data()
        chart_frame = draw_chart_frame(width=8, height=4)
        chart_frame.shift(DOWN * 0.3)

        candles_chart = create_candlestick_chart(df, width=7.5, height=3.5, with_3d=True)
        candles_chart.shift(DOWN * 0.3)

        self.play(Create(chart_frame, run_time=0.8))
        self.play(FadeIn(candles_chart, run_time=1.0))
        self.wait(1.2)

        footer = create_footer_warning("K 線是價格變化的濃縮圖。台股常見慣例：紅色代表上漲，綠色代表下跌。")
        footer.to_edge(DOWN, buff=0.3)
        self.play(FadeIn(footer, run_time=0.5))
        self.wait(2.0)
