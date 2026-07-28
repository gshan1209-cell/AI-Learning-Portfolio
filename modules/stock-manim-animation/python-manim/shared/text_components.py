from manim import *
from shared.theme import *

CHINESE_FONT = "Microsoft JhengHei"


def title_text(text: str, with_shadow=True):
    title = Text(text, font_size=FONT_TITLE_SIZE, color=COLOR_TITLE, weight=BOLD, font=CHINESE_FONT)
    if not with_shadow:
        return title
    shadow_color = COLOR_SHADOW if DARK_MODE else "#94A3B8"
    shadow_opacity = 0.25 if DARK_MODE else 0.15
    shadow = Text(text, font_size=FONT_TITLE_SIZE, color=shadow_color, weight=BOLD,
                  fill_opacity=shadow_opacity, font=CHINESE_FONT)
    shadow.move_to(title.get_center() + SHADOW_OFFSET * 2.8)
    return VGroup(shadow, title)


def subtitle_text(text: str, with_shadow=True):
    sub = Text(text, font_size=FONT_SUBTITLE_SIZE, color=COLOR_BLUE, weight=BOLD, font=CHINESE_FONT)
    if not with_shadow:
        return sub
    shadow_color = COLOR_SHADOW if DARK_MODE else "#CBD5E1"
    shadow_opacity = 0.2 if DARK_MODE else 0.12
    shadow = Text(text, font_size=FONT_SUBTITLE_SIZE, color=shadow_color, weight=BOLD,
                  fill_opacity=shadow_opacity, font=CHINESE_FONT)
    shadow.move_to(sub.get_center() + SHADOW_OFFSET * 2.2)
    return VGroup(shadow, sub)


def body_text(text: str, with_shadow=False):
    body = Text(text, font_size=FONT_BODY_SIZE, color=COLOR_DARK, font=CHINESE_FONT)
    if not with_shadow:
        return body
    shadow_color = COLOR_SHADOW if DARK_MODE else "#CBD5E1"
    shadow_opacity = 0.15 if DARK_MODE else 0.08
    shadow = Text(text, font_size=FONT_BODY_SIZE, color=shadow_color,
                  fill_opacity=shadow_opacity, font=CHINESE_FONT)
    shadow.move_to(body.get_center() + SHADOW_OFFSET * 1.8)
    return VGroup(shadow, body)


def small_text(text: str, with_shadow=False):
    return Text(text, font_size=FONT_SMALL_SIZE, color=COLOR_GRAY, font=CHINESE_FONT)


def warning_text(text: str):
    color = COLOR_WARNING_HIGHLIGHT if DARK_MODE else COLOR_WARNING
    return Text(text, font_size=FONT_SMALL_SIZE, color=color, weight=BOLD, font=CHINESE_FONT)


def bullet_list(items: list[str]):
    bullets = VGroup()
    for i, item in enumerate(items):
        text = body_text("•  " + item)
        if i > 0:
            text.next_to(bullets[-1], DOWN, aligned_edge=LEFT, buff=0.4)
        bullets.add(text)
    return bullets


def create_legend(labels, colors, font_size=FONT_SMALL_SIZE):
    legend = VGroup()
    for i, (label, color) in enumerate(zip(labels, colors)):
        glow = Line(LEFT * 0.28, RIGHT * 0.28, color=color, stroke_width=8, stroke_opacity=0.2)
        line = Line(LEFT * 0.28, RIGHT * 0.28, color=color, stroke_width=4.0)
        line_indicator = VGroup(glow, line)
        text = Text(label, font_size=font_size, color=color, weight=BOLD, font=CHINESE_FONT)
        text.next_to(line_indicator, RIGHT, buff=0.2)
        item = VGroup(line_indicator, text)
        if i > 0:
            item.next_to(legend[-1], DOWN, aligned_edge=LEFT, buff=0.22)
        legend.add(item)
    return legend
