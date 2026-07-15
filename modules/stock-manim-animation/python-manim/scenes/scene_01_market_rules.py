from manim import *
from shared.theme import *
from shared.text_components import title_text, body_text, small_text
from shared.layout_components import create_card, create_footer_warning, create_badge, create_3d_panel
from shared.animation_utils import create_gradient_background


class MarketRulesIntro(Scene):
    def construct(self):
        create_gradient_background(self)

        title = title_text("台股市場基本規則")
        title.to_edge(UP, buff=0.5)
        self.play(FadeIn(title, run_time=0.8))

        card1 = create_card(5.5, 3.0, title="市場參與者")
        card1.move_to(LEFT * 3.2 + DOWN * 0.3)

        participants = VGroup()
        items1 = [
            ("投資人", "個人與機構交易者"),
            ("買方", "看好未來，願意買進"),
            ("賣方", "需要資金或看壞未來"),
        ]
        for i, (label_str, desc) in enumerate(items1):
            line = VGroup(
                small_text(label_str),
                small_text(desc).set_color(COLOR_GRAY).scale(0.85),
            )
            line.arrange(DOWN, aligned_edge=LEFT, buff=0.1)
            if i > 0:
                line.next_to(participants[-1], DOWN, aligned_edge=LEFT, buff=0.35)
            participants.add(line)
        participants.move_to(card1[0].get_center())

        self.play(FadeIn(card1, run_time=0.5))
        self.play(FadeIn(participants, run_time=0.8))
        self.wait(0.5)

        card2 = create_card(4.5, 3.0, title="股票代號")
        card2.move_to(RIGHT * 3.4 + DOWN * 0.3)

        ticker_box = RoundedRectangle(
            width=3.0, height=1.2,
            corner_radius=0.15,
            fill_color=COLOR_LIGHT_BLUE, fill_opacity=0.5,
            stroke_color=COLOR_BLUE, stroke_width=2.5,
        )
        ticker_hl = RoundedRectangle(
            width=2.85, height=1.05,
            corner_radius=0.13, fill_opacity=0,
            stroke_color=WHITE, stroke_width=1, stroke_opacity=0.4,
        )
        ticker_hl.move_to(ticker_box.get_center())
        ticker_text = body_text("2330.TW")
        ticker_text.set_color(COLOR_BLUE)
        ticker_text.move_to(ticker_box.get_center())
        ticker_desc = small_text("台灣證券交易所代碼")
        ticker_desc.set_color(COLOR_GRAY)
        ticker_desc.next_to(ticker_box, DOWN, buff=0.3)
        ticker_group = VGroup(ticker_box, ticker_hl, ticker_text, ticker_desc)
        ticker_group.move_to(card2[0].get_center())

        self.play(FadeIn(card2, run_time=0.5))
        self.play(FadeIn(ticker_group, run_time=0.6))
        self.wait(0.8)

        self.play(FadeOut(card1), FadeOut(participants), FadeOut(card2), FadeOut(ticker_group), run_time=0.5)

        subtitle = body_text("價格圖表 = 市場交易行為的歷史紀錄")
        subtitle.next_to(title, DOWN, buff=0.6)
        self.play(FadeIn(subtitle, run_time=0.6))

        insight_card = create_card(8, 2.5, title="核心觀念")
        insight_card.next_to(subtitle, DOWN, buff=0.8)

        insight_text = body_text("每一根 K 線都是市場買賣留下的痕跡")
        insight_text.move_to(insight_card[0].get_center())
        self.play(FadeIn(insight_card, run_time=0.5))
        self.play(FadeIn(insight_text, run_time=0.6))

        sub_text = small_text("先理解市場行為，再看懂圖表訊號")
        sub_text.set_color(COLOR_GRAY)
        sub_text.next_to(insight_card, DOWN, buff=0.5)
        self.play(FadeIn(sub_text, run_time=0.5))
        self.wait(1.2)

        footer = create_footer_warning("看圖之前，先理解：每一根 K 線都是市場買賣留下的痕跡。")
        footer.to_edge(DOWN, buff=0.3)
        self.play(FadeOut(sub_text), FadeIn(footer), run_time=0.6)
        self.wait(2.0)
