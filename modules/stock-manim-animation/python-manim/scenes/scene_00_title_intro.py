from manim import *
from shared.theme import *
from shared.text_components import title_text, subtitle_text, body_text, small_text
from shared.layout_components import create_card, create_footer_warning, create_3d_panel
from shared.animation_utils import *


class TitleIntro(Scene):
    def construct(self):
        create_gradient_background(self)

        title = title_text("台股實戰教學")
        title.to_edge(UP, buff=1.2)

        subtitle = subtitle_text("K 線 × 均線 × 成交量 × 技術指標 × 回測風險")
        subtitle.next_to(title, DOWN, buff=0.4)

        title.save_state()
        title.rotate(PI / 2, axis=RIGHT).shift(DOWN * 0.5).set_opacity(0)
        self.play(Restore(title), run_time=1.2)
        self.wait(0.3)

        subtitle.save_state()
        subtitle.rotate(PI / 2, axis=RIGHT).shift(DOWN * 0.3).set_opacity(0)
        self.play(Restore(subtitle), run_time=1.0)
        self.wait(0.6)

        roadmap_items = [
            ("1", "看懂價格", "了解 K 線與價格變化的意義"),
            ("2", "看懂趨勢", "均線與市場走向"),
            ("3", "看懂量能", "成交量與價量關係"),
            ("4", "看懂指標", "RSI / MACD / 布林通道入門"),
            ("5", "看懂風險", "回測績效與風險控管"),
        ]

        roadmap_group = VGroup()
        for i, (num, label_text_str, desc) in enumerate(roadmap_items):
            card_w = 6.5
            card_h = 0.9

            shadow = RoundedRectangle(
                width=card_w, height=card_h,
                corner_radius=CARD_CORNER_RADIUS,
                fill_color=COLOR_SHADOW, fill_opacity=0.1, stroke_width=0,
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

            num_circle = Circle(radius=0.25, fill_color=COLOR_BLUE, fill_opacity=1, stroke_width=0)
            num_circle_hl = Circle(radius=0.15, fill_color=WHITE, fill_opacity=0.2, stroke_width=0)
            num_circle_hl.move_to(num_circle.get_center() + UP * 0.06 + LEFT * 0.04)
            num_text = Text(num, font_size=FONT_SMALL_SIZE, color=WHITE, weight=BOLD)
            num_text.move_to(num_circle.get_center())
            num_badge = VGroup(num_circle, num_circle_hl, num_text)
            num_badge.move_to(card.get_left() + RIGHT * 0.5, aligned_edge=LEFT)

            label_text = Text(label_text_str, font_size=FONT_BODY_SIZE, color=COLOR_DARK, weight=BOLD)
            label_text.next_to(num_badge, RIGHT, buff=0.5).align_to(card, UP)

            desc_text = Text(desc, font_size=FONT_TINY_SIZE, color=COLOR_GRAY)
            desc_text.next_to(label_text, DOWN, buff=0.15).align_to(label_text, LEFT)

            item_group = VGroup(shadow, card, hl, num_badge, label_text, desc_text)
            if i > 0:
                item_group.next_to(roadmap_group[-1], DOWN, buff=0.35)
            roadmap_group.add(item_group)

        roadmap_group.next_to(subtitle, DOWN, buff=0.7)

        for item in roadmap_group:
            item.save_state()
            item.rotate(-PI / 2, axis=UP).shift(RIGHT * 0.5).set_opacity(0)
            self.play(Restore(item), run_time=0.55)
            self.wait(0.12)

        self.wait(0.8)

        footer = create_footer_warning("本內容僅供教學，不構成投資建議。")
        footer.to_edge(DOWN, buff=0.4)
        self.play(FadeIn(footer, run_time=0.6))
        self.wait(2.0)
