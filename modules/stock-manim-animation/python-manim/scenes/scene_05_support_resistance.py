from manim import *
from shared.theme import *
from shared.text_components import title_text, body_text, small_text
from shared.layout_components import create_footer_warning, create_3d_panel
from shared.chart_components import create_candlestick_chart
from shared.animation_utils import draw_chart_frame, create_glow_circle, create_gradient_background
from shared.data_samples import get_support_resistance_data


class SupportResistanceIntro(Scene):
    def construct(self):
        create_gradient_background(self)

        title = title_text("支撐線與壓力線：市場心理的參考區域")
        title.to_edge(UP, buff=0.5)
        self.play(FadeIn(title, run_time=0.8))

        df = get_support_resistance_data()
        chart_center = DOWN * 0.3

        chart_frame = draw_chart_frame(width=8, height=4)
        chart_frame.move_to(chart_center)

        candles = create_candlestick_chart(df, width=7.5, height=3.5, with_3d=True)
        candles.move_to(chart_center)

        self.play(Create(chart_frame, run_time=0.6))
        self.play(FadeIn(candles, run_time=0.8))
        self.wait(0.3)

        price_min = df["low"].min()
        price_max = df["high"].max()
        price_range = price_max - price_min
        offset = 0.15 * price_range
        price_min -= offset
        price_max += offset
        price_range = price_max - price_min
        scale = 3.5 / price_range
        shift_price = (price_min + price_max) / 2

        support_price = 94.5
        resistance_price = 113
        support_y = (support_price - shift_price) * scale + chart_center[1]
        resistance_y = (resistance_price - shift_price) * scale + chart_center[1]
        half_w = 3.8

        s_glow = DashedLine(
            [-half_w, support_y, 0], [half_w, support_y, 0],
            color=COLOR_GREEN_DOWN, stroke_width=8, stroke_opacity=0.12,
            dash_length=0.15,
        )
        support_line = DashedLine(
            [-half_w, support_y, 0], [half_w, support_y, 0],
            color=COLOR_GREEN_DOWN, stroke_width=3.5, dash_length=0.15,
        )
        support_label = small_text("支撐線")
        support_label.set_color(COLOR_GREEN_DOWN)
        support_label.next_to(support_line, LEFT, buff=0.25)

        r_glow = DashedLine(
            [-half_w, resistance_y, 0], [half_w, resistance_y, 0],
            color=COLOR_RED_UP, stroke_width=8, stroke_opacity=0.12,
            dash_length=0.15,
        )
        resistance_line = DashedLine(
            [-half_w, resistance_y, 0], [half_w, resistance_y, 0],
            color=COLOR_RED_UP, stroke_width=3.5, dash_length=0.15,
        )
        resistance_label = small_text("壓力線")
        resistance_label.set_color(COLOR_RED_UP)
        resistance_label.next_to(resistance_line, LEFT, buff=0.25)

        subtitle1 = body_text("支撐：價格容易止跌反彈的位置")
        subtitle1.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle1, run_time=0.5))
        self.play(Create(s_glow), Create(support_line), FadeIn(support_label), run_time=0.8)

        bounce_circle = create_glow_circle([0.5, support_y, 0], radius=0.15, color=COLOR_GREEN_DOWN, opacity=0.35)
        self.play(FadeIn(bounce_circle, run_time=0.5))
        self.play(bounce_circle.animate.scale(1.6).set_opacity(0), run_time=0.6)
        self.wait(0.5)

        subtitle2 = body_text("壓力：價格容易遇到賣壓回落的位置")
        subtitle2.next_to(title, DOWN, buff=0.4)
        self.play(ReplacementTransform(subtitle1, subtitle2), run_time=0.5)
        self.play(Create(r_glow), Create(resistance_line), FadeIn(resistance_label), run_time=0.8)

        res_circle = create_glow_circle([3.0, resistance_y, 0], radius=0.15, color=COLOR_RED_UP, opacity=0.35)
        self.play(FadeIn(res_circle, run_time=0.5))
        self.play(res_circle.animate.scale(1.6).set_opacity(0), run_time=0.6)
        self.wait(0.5)

        subtitle3 = body_text("支撐與壓力是「區域」，不是精準點位")
        subtitle3.next_to(title, DOWN, buff=0.4)
        self.play(ReplacementTransform(subtitle2, subtitle3), run_time=0.5)

        support_zone = Rectangle(
            width=8, height=0.6,
            fill_color=COLOR_GREEN_DOWN, fill_opacity=0.1, stroke_width=0,
        )
        support_zone.move_to([0, support_y, 0])

        resistance_zone = Rectangle(
            width=8, height=0.6,
            fill_color=COLOR_RED_UP, fill_opacity=0.1, stroke_width=0,
        )
        resistance_zone.move_to([0, resistance_y, 0])

        self.play(FadeIn(support_zone), FadeIn(resistance_zone), run_time=0.8)
        self.wait(1.0)

        self.play(
            FadeOut(support_zone), FadeOut(resistance_zone), FadeOut(subtitle3),
            FadeOut(candles), FadeOut(chart_frame), FadeOut(support_line),
            FadeOut(resistance_line), FadeOut(support_label), FadeOut(resistance_label),
            FadeOut(s_glow), FadeOut(r_glow), run_time=0.5
        )

        subtitle4 = body_text("突破壓力後，原壓力可能變成支撐")
        subtitle4.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle4, run_time=0.5))

        price_path = VMobject(color=COLOR_BLUE, stroke_width=4.5)
        path_points = [
            [-3.5, -1.0, 0], [-2.5, -0.3, 0], [-1.5, -0.8, 0],
            [-0.5, 0.3, 0], [0.5, 0.0, 0], [1.5, 0.8, 0],
            [2.5, 0.5, 0], [3.5, 1.6, 0],
        ]
        price_path.set_points_smoothly(path_points)

        orig_res_glow = DashedLine(
            [-4, 0.7, 0], [4, 0.7, 0],
            color=COLOR_RED_UP, stroke_width=8, stroke_opacity=0.12, dash_length=0.15,
        )
        orig_res = DashedLine(
            [-4, 0.7, 0], [4, 0.7, 0],
            color=COLOR_RED_UP, stroke_width=3.5, dash_length=0.15,
        )
        orig_label = small_text("壓力")
        orig_label.set_color(COLOR_RED_UP)
        orig_label.next_to(orig_res, LEFT, buff=0.2)

        self.play(Create(price_path, run_time=1.2))
        self.play(Create(orig_res_glow), Create(orig_res), FadeIn(orig_label), run_time=0.6)
        self.wait(0.8)

        new_support_glow = DashedLine(
            [-4, 0.7, 0], [4, 0.7, 0],
            color=COLOR_GREEN_DOWN, stroke_width=8, stroke_opacity=0.12, dash_length=0.15,
        )
        new_support = DashedLine(
            [-4, 0.7, 0], [4, 0.7, 0],
            color=COLOR_GREEN_DOWN, stroke_width=3.5, dash_length=0.15,
        )
        new_label = small_text("變成支撐")
        new_label.set_color(COLOR_GREEN_DOWN)
        new_label.next_to(new_support, RIGHT, buff=0.2)

        self.play(
            ReplacementTransform(orig_res_glow, new_support_glow),
            ReplacementTransform(orig_res, new_support),
            ReplacementTransform(orig_label, new_label),
            run_time=0.8
        )

        breakout_arrow = Arrow(
            [2.5, 0.5, 0], [2.5, 1.1, 0],
            color=COLOR_ORANGE, buff=0, max_tip_length_to_length_ratio=0.15,
            stroke_width=4,
        )
        self.play(GrowArrow(breakout_arrow), run_time=0.5)
        self.wait(1.0)

        footer = create_footer_warning("支撐與壓力比較像區域，不是神奇的精準價格。突破需搭配風險確認。")
        footer.to_edge(DOWN, buff=0.3)
        self.play(FadeIn(footer, run_time=0.5))
        self.wait(2.0)
