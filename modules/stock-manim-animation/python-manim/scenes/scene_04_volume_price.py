from manim import *
from shared.theme import *
from shared.chart_components import create_candlestick_chart, create_volume_bars
from shared.data_samples import get_sample_ohlcv_data
from shared.text_components import title_text, body_text, small_text
from shared.layout_components import create_footer_warning, create_card, create_3d_panel
from shared.animation_utils import draw_chart_frame, create_gradient_background


class VolumePriceIntro(Scene):
    def construct(self):
        bg_group = create_gradient_background(self)

        title = title_text("成交量與價量關係")
        title.to_edge(UP, buff=0.5)
        self.play(FadeIn(title, run_time=0.8))

        df = get_sample_ohlcv_data()

        kline_center = UP * 0.6
        vol_center = DOWN * 2.5

        kline_frame = draw_chart_frame(width=8, height=2.8)
        kline_frame.move_to(kline_center)

        candles = create_candlestick_chart(df, width=7.5, height=2.5, with_3d=True)
        candles.move_to(kline_center)

        vol_frame = Rectangle(
            width=8, height=1.5,
            stroke_color=COLOR_GRID, stroke_width=2,
            fill_color=COLOR_BG, fill_opacity=0.3,
        )
        vol_frame.move_to(vol_center)

        vol_bars = create_volume_bars(df, width=7.5, height=1.3, with_3d=True)
        vol_bars.move_to(vol_center + UP * 0.1)

        self.play(Create(kline_frame), Create(vol_frame), run_time=0.8)
        self.play(FadeIn(candles), FadeIn(vol_bars), run_time=1.0)
        self.wait(0.5)

        subtitle = body_text("成交量代表市場參與程度")
        subtitle.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle, run_time=0.5))
        self.wait(0.5)

        scenarios_data = [
            ("價漲量增：市場積極追價", [1.5, 1.7, 0], COLOR_RED_UP),
            ("價漲量縮：追價意願不足", [-1.8, 1.2, 0], COLOR_ORANGE),
            ("突破放量：訊號相對較強", [0.3, 2.3, 0], COLOR_BLUE),
        ]

        for text, pos, color in scenarios_data:
            label = small_text(text)
            label.set_color(color)
            label.move_to([pos[0], pos[1], 0])
            self.play(FadeIn(label, run_time=0.5))
            self.wait(0.3)

        self.wait(0.8)

        self.play(
            FadeOut(kline_frame), FadeOut(candles), FadeOut(vol_frame),
            FadeOut(vol_bars), FadeOut(subtitle), run_time=0.5
        )

        for m in list(self.mobjects):
            if m != title and m != bg_group:
                self.remove(m)

        insight_title = body_text("只看價格容易失真，成交量能幫助我們觀察市場參與度")
        insight_title.next_to(title, DOWN, buff=0.6)
        self.play(FadeIn(insight_title, run_time=0.6))

        advice_card = create_card(7, 2.0)
        advice_card.next_to(insight_title, DOWN, buff=0.8)

        advice_text = body_text("成交量需搭配價格趨勢一起判斷")
        advice_text.move_to(advice_card[0].get_center())
        advice_sub = small_text("放量突破不代表一定成功，仍需風險確認")
        advice_sub.set_color(COLOR_GRAY)
        advice_sub.next_to(advice_card[0], DOWN, buff=0.4)

        self.play(FadeIn(advice_card, run_time=0.5))
        self.play(FadeIn(advice_text), FadeIn(advice_sub), run_time=0.5)
        self.wait(1.0)

        footer = create_footer_warning("只看價格容易失真，成交量能幫助我們觀察市場參與度。放量不保證突破成功。")
        footer.to_edge(DOWN, buff=0.3)
        self.play(FadeOut(advice_sub), FadeIn(footer), run_time=0.6)
        self.wait(2.0)
