from manim import *
from shared.theme import *
from shared.text_components import title_text, body_text, small_text
from shared.layout_components import create_footer_warning, create_card, create_3d_panel
from shared.animation_utils import create_gradient_background

import numpy as np


class TrendBreakoutIntro(Scene):
    def construct(self):
        create_gradient_background(self)

        title = title_text("趨勢線、突破與假突破")
        title.to_edge(UP, buff=0.4)
        self.play(FadeIn(title, run_time=0.8))

        subtitle1 = body_text("市場狀態：上升、下降、盤整")
        subtitle1.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle1, run_time=0.5))

        card_w, card_h = 3.2, 2.5
        cards = VGroup()

        trend_types = [
            ("上升趨勢", "高點與低點逐步墊高"),
            ("下降趨勢", "高點與低點逐步降低"),
            ("橫盤整理", "價格在區間內震盪"),
        ]

        for i, (label_text_str, desc_text) in enumerate(trend_types):
            shadow = RoundedRectangle(
                width=card_w, height=card_h,
                corner_radius=CARD_CORNER_RADIUS,
                fill_color=COLOR_SHADOW, fill_opacity=0.12, stroke_width=0,
            )
            shadow.shift(SHADOW_OFFSET * 4)

            card = RoundedRectangle(
                width=card_w, height=card_h,
                corner_radius=CARD_CORNER_RADIUS,
                fill_color=COLOR_CARD_BG, fill_opacity=GLASS_OPACITY,
                stroke_color=COLOR_BLUE, stroke_width=2,
            )

            hl = RoundedRectangle(
                width=card_w - 0.06, height=card_h - 0.06,
                corner_radius=CARD_CORNER_RADIUS * 0.8,
                fill_opacity=0, stroke_color=WHITE,
                stroke_width=1, stroke_opacity=0.5,
            )
            hl.move_to(card.get_center())

            label = small_text(label_text_str)
            label.move_to(card.get_top() + DOWN * 0.4)

            desc = small_text(desc_text)
            desc.set_color(COLOR_GRAY)
            desc.scale(0.8)
            desc.move_to(card.get_center() + UP * 0.2)

            if i == 0:
                t_points = [[-1.0, -0.5, 0], [-0.3, -0.2, 0], [0.3, 0.1, 0], [1.0, 0.5, 0]]
                line_color = COLOR_RED_UP
            elif i == 1:
                t_points = [[-1.0, 0.5, 0], [-0.3, 0.2, 0], [0.3, -0.1, 0], [1.0, -0.5, 0]]
                line_color = COLOR_GREEN_DOWN
            else:
                t_points = [[-1.0, 0.2, 0], [-0.5, -0.1, 0], [0.0, 0.15, 0], [0.5, -0.05, 0], [1.0, 0.1, 0]]
                line_color = COLOR_GRAY

            trend_glow = VMobject(color=line_color, stroke_width=7, stroke_opacity=0.15)
            trend_glow.set_points_smoothly(t_points)
            trend_glow.move_to(card.get_center() + DOWN * 0.6)

            trend_line = VMobject(color=line_color, stroke_width=3.5)
            trend_line.set_points_smoothly(t_points)
            trend_line.move_to(card.get_center() + DOWN * 0.6)

            card_group = VGroup(shadow, card, hl, label, desc, trend_glow, trend_line)
            cards.add(card_group)

        cards.arrange(RIGHT, buff=0.6)
        cards.next_to(subtitle1, DOWN, buff=0.6)

        for card in cards:
            self.play(FadeIn(card, run_time=0.6))
            self.wait(0.2)

        self.wait(1.0)

        self.play(FadeOut(subtitle1), FadeOut(cards), run_time=0.5)

        subtitle2 = body_text("真突破 vs 假突破")
        subtitle2.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle2, run_time=0.5))

        lf = Rectangle(width=3.5, height=3.0,
                       stroke_color=COLOR_GRID, stroke_width=2,
                       fill_color=COLOR_BG, fill_opacity=0.3)
        lf.shift(LEFT * 2.2 + DOWN * 0.3)
        left_label = small_text("真突破")
        left_label.set_color(COLOR_RED_UP)
        left_label.next_to(lf, UP, buff=0.2)

        l_points = [
            [-2.2 - 1.2, -1.2 - 0.3, 0], [-2.2 - 0.6, -0.4 - 0.3, 0],
            [-2.2, 0.0 - 0.3, 0], [-2.2 + 0.4, 0.2 - 0.3, 0],
            [-2.2 + 0.8, 0.6 - 0.3, 0], [-2.2 + 1.2, 1.0 - 0.3, 0],
        ]
        l_glow = VMobject(color=COLOR_RED_UP, stroke_width=8, stroke_opacity=0.15)
        l_glow.set_points_smoothly(l_points)
        l_line = VMobject(color=COLOR_RED_UP, stroke_width=4.5)
        l_line.set_points_smoothly(l_points)

        l_res = DashedLine(
            [-2.2 - 1.5, 0.2 - 0.3, 0], [-2.2 + 1.5, 0.2 - 0.3, 0],
            color=COLOR_RED_UP, stroke_width=2.5, dash_length=0.12,
        )

        self.play(Create(lf), FadeIn(left_label), run_time=0.5)
        self.play(Create(l_glow), Create(l_line), Create(l_res), run_time=0.8)

        rf = Rectangle(width=3.5, height=3.0,
                       stroke_color=COLOR_GRID, stroke_width=2,
                       fill_color=COLOR_BG, fill_opacity=0.3)
        rf.shift(RIGHT * 2.2 + DOWN * 0.3)
        right_label = small_text("假突破")
        right_label.set_color(COLOR_WARNING)
        right_label.next_to(rf, UP, buff=0.2)

        r_points = [
            [2.2 - 1.2, -0.8 - 0.3, 0], [2.2 - 0.6, -0.2 - 0.3, 0],
            [2.2, 0.0 - 0.3, 0], [2.2 + 0.3, 0.5 - 0.3, 0],
            [2.2 + 0.6, 0.8 - 0.3, 0], [2.2 + 0.9, -0.1 - 0.3, 0],
            [2.2 + 1.2, -0.6 - 0.3, 0],
        ]
        r_glow = VMobject(color=COLOR_WARNING, stroke_width=8, stroke_opacity=0.15)
        r_glow.set_points_smoothly(r_points)
        r_line = VMobject(color=COLOR_WARNING, stroke_width=4.5)
        r_line.set_points_smoothly(r_points)

        r_res = DashedLine(
            [2.2 - 1.5, 0.0 - 0.3, 0], [2.2 + 1.5, 0.0 - 0.3, 0],
            color=COLOR_RED_UP, stroke_width=2.5, dash_length=0.12,
        )

        self.play(Create(rf), FadeIn(right_label), run_time=0.5)
        self.play(Create(r_glow), Create(r_line), Create(r_res), run_time=0.8)

        cross = VGroup(
            Line([2.2 + 0.6 - 0.22, 0.8 - 0.3 - 0.22, 0],
                 [2.2 + 0.6 + 0.22, 0.8 - 0.3 + 0.22, 0],
                 color=COLOR_WARNING, stroke_width=5),
            Line([2.2 + 0.6 - 0.22, 0.8 - 0.3 + 0.22, 0],
                 [2.2 + 0.6 + 0.22, 0.8 - 0.3 - 0.22, 0],
                 color=COLOR_WARNING, stroke_width=5),
        )
        self.play(FadeIn(cross, run_time=0.5))
        self.wait(1.0)

        self.play(FadeOut(lf), FadeOut(rf), FadeOut(left_label), FadeOut(right_label),
                  FadeOut(l_glow), FadeOut(l_line), FadeOut(l_res),
                  FadeOut(r_glow), FadeOut(r_line), FadeOut(r_res),
                  FadeOut(cross), FadeOut(subtitle2), run_time=0.5)

        insight = body_text("突破不是答案，而是一個需要後續確認的訊號")
        insight.next_to(title, DOWN, buff=0.8)
        self.play(FadeIn(insight, run_time=0.6))

        remind = small_text("突破後需觀察成交量與價格確認，搭配風險控管")
        remind.set_color(COLOR_GRAY)
        remind.next_to(insight, DOWN, buff=0.5)
        self.play(FadeIn(remind, run_time=0.5))
        self.wait(1.0)

        footer = create_footer_warning("突破不是答案，而是一個需要後續確認的訊號。假突破常見，請做好風控。")
        footer.to_edge(DOWN, buff=0.3)
        self.play(FadeIn(footer, run_time=0.5))
        self.wait(2.0)
