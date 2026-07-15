from manim import *
from shared.theme import *
from shared.text_components import title_text, body_text, small_text
from shared.layout_components import create_footer_warning, create_3d_panel
from shared.chart_components import create_metric_card
from shared.animation_utils import create_gradient_background

import numpy as np


class BacktestingRiskIntro(Scene):
    def construct(self):
        create_gradient_background(self)

        title = title_text("回測與風險控管：策略驗證與資金保護")
        title.to_edge(UP, buff=0.4)
        self.play(FadeIn(title, run_time=0.8))

        subtitle1 = body_text("回測：用歷史資料模擬策略表現")
        subtitle1.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle1, run_time=0.5))

        np.random.seed(42)
        t = np.linspace(0, 8, 30)
        price = 100 + np.cumsum(np.random.randn(30) * 2)

        half_w = 3.8
        chart_center = DOWN * 0.8
        x_positions = np.linspace(-half_w, half_w, 30)
        price_norm = (price - price.min()) / (price.max() - price.min()) * 3.0 - 1.5 + chart_center[1]

        price_points = []
        for i in range(30):
            price_points.append([x_positions[i], price_norm[i], 0])

        price_line = VMobject(color=COLOR_BLUE, stroke_width=4)
        price_line.set_points_smoothly(price_points)

        chart_frame = Rectangle(
            width=8, height=3.5,
            stroke_color=COLOR_GRID, stroke_width=2,
            fill_color=COLOR_BG, fill_opacity=0.3,
        )
        chart_frame.move_to(chart_center)

        self.play(Create(chart_frame), Create(price_line), run_time=1.0)

        buy_points = [3, 10, 18]
        sell_points = [7, 15, 22]

        signals = VGroup()
        for bp in buy_points:
            dot = Dot([x_positions[bp], price_norm[bp], 0], color=COLOR_RED_UP, radius=0.1)
            glow = Circle(radius=0.18, fill_color=COLOR_RED_UP, fill_opacity=0.2, stroke_width=0)
            glow.move_to(dot.get_center())
            label = small_text("買")
            label.set_color(COLOR_RED_UP)
            label.next_to(dot, UP, buff=0.15)
            signals.add(VGroup(glow, dot, label))

        for sp in sell_points:
            dot = Dot([x_positions[sp], price_norm[sp], 0], color=COLOR_GREEN_DOWN, radius=0.1)
            glow = Circle(radius=0.18, fill_color=COLOR_GREEN_DOWN, fill_opacity=0.2, stroke_width=0)
            glow.move_to(dot.get_center())
            label = small_text("賣")
            label.set_color(COLOR_GREEN_DOWN)
            label.next_to(dot, UP, buff=0.15)
            signals.add(VGroup(glow, dot, label))

        self.play(FadeIn(signals, run_time=0.8))
        self.wait(0.8)

        self.play(FadeOut(subtitle1), FadeOut(chart_frame), FadeOut(price_line), FadeOut(signals), run_time=0.5)

        subtitle2 = body_text("績效曲線：資金隨策略交易的變化")
        subtitle2.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle2, run_time=0.5))

        np.random.seed(123)
        capital = 100
        capital_curve = [capital]
        for i in range(29):
            change = np.random.randn() * 3
            capital += change
            capital = max(capital, 80)
            capital_curve.append(capital)

        cap_norm = (np.array(capital_curve) - 80) / (max(capital_curve) - 80) * 2.8 - 1.4 + chart_center[1]

        cap_points = []
        for i in range(30):
            cap_points.append([x_positions[i], cap_norm[i], 0])

        cap_frame = Rectangle(
            width=8, height=3.5,
            stroke_color=COLOR_GRID, stroke_width=2,
            fill_color=COLOR_BG, fill_opacity=0.3,
        )
        cap_frame.move_to(chart_center)

        cap_line = VMobject(color=COLOR_BLUE, stroke_width=4.5)
        cap_line.set_points_smoothly(cap_points)

        self.play(Create(cap_frame), Create(cap_line), run_time=1.0)

        peak_idx, trough_idx = 12, 19
        drawdown_arrow = Arrow(
            [x_positions[peak_idx], cap_norm[peak_idx], 0],
            [x_positions[trough_idx], cap_norm[trough_idx], 0],
            color=COLOR_WARNING, buff=0,
            max_tip_length_to_length_ratio=0.2, stroke_width=4,
        )
        dd_label = small_text("最大回撤")
        dd_label.set_color(COLOR_WARNING)
        dd_label.next_to(drawdown_arrow, RIGHT, buff=0.2)

        self.play(GrowArrow(drawdown_arrow), FadeIn(dd_label), run_time=0.8)
        self.wait(1.0)

        self.play(
            FadeOut(subtitle2), FadeOut(cap_frame), FadeOut(cap_line),
            FadeOut(drawdown_arrow), FadeOut(dd_label), run_time=0.5
        )

        subtitle3 = body_text("回測績效指標")
        subtitle3.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle3, run_time=0.5))

        card_total = create_metric_card("總報酬率", "+18.5%", COLOR_RED_UP)
        card_winrate = create_metric_card("勝率", "62%", COLOR_BLUE)
        card_maxdd = create_metric_card("最大回撤", "-12.3%", COLOR_WARNING)

        cards = VGroup(card_total, card_winrate, card_maxdd)
        cards.arrange(RIGHT, buff=1.2)
        cards.next_to(subtitle3, DOWN, buff=0.8)

        for card in cards:
            self.play(FadeIn(card, run_time=0.5))
            self.wait(0.2)

        self.wait(0.5)

        note = body_text("回測結果 ≠ 未來績效保證")
        note.set_color(COLOR_WARNING)
        note.next_to(cards, DOWN, buff=0.8)
        self.play(FadeIn(note, run_time=0.6))
        self.wait(1.0)

        self.play(FadeOut(subtitle3), FadeOut(cards), FadeOut(note), run_time=0.5)

        subtitle4 = body_text("實戰三防護：停損、停利、資金控管")
        subtitle4.next_to(title, DOWN, buff=0.4)
        self.play(FadeIn(subtitle4, run_time=0.5))

        shields_data = [
            ("停損", "控制單次最大損失", COLOR_WARNING),
            ("停利", "避免獲利回吐", COLOR_BLUE),
            ("資金控管", "避免一次投入過大", COLOR_PURPLE),
        ]

        shields = VGroup()
        for label_str, desc, color in shields_data:
            shadow = RoundedRectangle(
                width=3.2, height=1.8,
                corner_radius=CARD_CORNER_RADIUS,
                fill_color=COLOR_SHADOW, fill_opacity=0.1, stroke_width=0,
            )
            shadow.shift(SHADOW_OFFSET * 4)

            card = RoundedRectangle(
                width=3.2, height=1.8,
                corner_radius=CARD_CORNER_RADIUS,
                fill_color=COLOR_CARD_BG, fill_opacity=GLASS_OPACITY,
                stroke_color=color, stroke_width=3.5,
            )

            hl = RoundedRectangle(
                width=3.05, height=1.65,
                corner_radius=CARD_CORNER_RADIUS * 0.8,
                fill_opacity=0, stroke_color=WHITE,
                stroke_width=1, stroke_opacity=0.5,
            )
            hl.move_to(card.get_center())

            shield_title = small_text(label_str)
            shield_title.set_color(color)
            shield_title.move_to(card.get_top() + DOWN * 0.5)

            shield_desc = small_text(desc)
            shield_desc.set_color(COLOR_GRAY)
            shield_desc.scale(0.85)
            shield_desc.move_to(card.get_center() + DOWN * 0.15)

            shield_group = VGroup(shadow, card, hl, shield_title, shield_desc)
            shields.add(shield_group)

        shields.arrange(RIGHT, buff=0.8)
        shields.next_to(subtitle4, DOWN, buff=0.8)

        for shield in shields:
            self.play(FadeIn(shield, run_time=0.5))
            self.wait(0.2)

        self.wait(1.0)

        footer = create_footer_warning("技術分析只能幫助理解市場行為，不能保證獲利；實戰操作請務必做好資金控管、停損停利與風險管理。")
        footer.to_edge(DOWN, buff=0.3)
        self.play(FadeIn(footer, run_time=0.5))
        self.wait(2.5)
