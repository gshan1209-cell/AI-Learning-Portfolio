from manim import *
from shared.theme import *


def _create_shadow(main_shape, offset=None, opacity=None):
    off = offset if offset is not None else SHADOW_OFFSET
    op = opacity if opacity is not None else SHADOW_OPACITY
    shadow_group = VGroup()
    layers = 3
    for layer in range(1, layers + 1):
        shadow = main_shape.copy()
        shadow.set_fill(COLOR_SHADOW, opacity=op / (layer * 1.5))
        shadow.set_stroke(width=0)
        shadow.shift(off * (layer * 0.75))
        shadow_group.add(shadow)
    return shadow_group


def create_card(width, height, title=None, color=None, with_shadow=True):
    fill_color = color if color else COLOR_GLASS_BG
    card = RoundedRectangle(
        width=width,
        height=height,
        corner_radius=CARD_CORNER_RADIUS,
        fill_color=fill_color,
        fill_opacity=GLASS_OPACITY,
        stroke_color=COLOR_GRID,
        stroke_width=1.5,
    )
    highlight = RoundedRectangle(
        width=width - 0.08,
        height=height - 0.08,
        corner_radius=CARD_CORNER_RADIUS * 0.85,
        fill_opacity=0,
        stroke_color=WHITE,
        stroke_width=1.2,
        stroke_opacity=0.35 if DARK_MODE else 0.55,
    )
    highlight.move_to(card.get_center())
    group_elements = [card, highlight]
    if with_shadow:
        shadow = _create_shadow(card, offset=SHADOW_OFFSET * CARD_ELEVATION, opacity=0.18)
        group_elements.insert(0, shadow)
    if title is None:
        return VGroup(*group_elements)
    title_mob = Text(title, font_size=FONT_SMALL_SIZE, color=COLOR_TITLE, weight=BOLD)
    title_mob.move_to(card.get_top() + DOWN * 0.4)
    accent = RoundedRectangle(
        width=width * 0.45,
        height=0.06,
        corner_radius=0.03,
        fill_color=COLOR_BLUE_HIGHLIGHT,
        fill_opacity=0.8,
        stroke_width=0,
    )
    accent.next_to(title_mob, DOWN, buff=0.12)
    group_elements.extend([title_mob, accent])
    return VGroup(*group_elements)


def create_badge(number: str, color=None, with_shadow=True):
    badge_color = color if color else COLOR_BLUE
    circle = Circle(
        radius=0.28,
        fill_color=badge_color,
        fill_opacity=1.0,
        stroke_color=badge_color,
        stroke_width=0,
    )
    highlight = Circle(
        radius=0.16,
        fill_color=WHITE,
        fill_opacity=0.3,
        stroke_width=0,
    )
    highlight.move_to(circle.get_center() + UP * 0.08 + LEFT * 0.05)
    text = Text(number, font_size=FONT_SMALL_SIZE, color=WHITE, weight=BOLD)
    text.move_to(circle.get_center())
    elements = [circle, highlight, text]
    if with_shadow:
        shadow = Circle(
            radius=0.28,
            fill_color=COLOR_SHADOW,
            fill_opacity=0.25,
            stroke_width=0,
        )
        shadow.move_to(circle.get_center() + SHADOW_OFFSET * 2.2)
        elements.insert(0, shadow)
    return VGroup(*elements)


def create_footer_warning(text: str, with_shadow=True):
    bg_color = "#201316" if DARK_MODE else "#FFF2F2"
    border_color = COLOR_WARNING
    text_color = COLOR_WARNING_HIGHLIGHT if DARK_MODE else COLOR_WARNING
    box = RoundedRectangle(
        width=12.2,
        height=0.75,
        corner_radius=0.12,
        fill_color=bg_color,
        fill_opacity=0.9,
        stroke_color=border_color,
        stroke_width=2.0,
    )
    inner_border = RoundedRectangle(
        width=12.08,
        height=0.63,
        corner_radius=0.1,
        fill_opacity=0,
        stroke_color=border_color,
        stroke_width=0.8,
        stroke_opacity=0.35,
    )
    inner_border.move_to(box.get_center())
    warning = Text(text, font_size=FONT_TINY_SIZE, color=text_color)
    warning.move_to(box.get_center())
    elements = [box, inner_border, warning]
    if with_shadow:
        shadow = _create_shadow(box, offset=SHADOW_OFFSET * 2, opacity=0.15)
        elements.insert(0, shadow)
    return VGroup(*elements)


def create_box_frame(width, height, color=None, with_shadow=True):
    frame_color = color if color else COLOR_GRID
    frame = Rectangle(
        width=width,
        height=height,
        stroke_color=frame_color,
        stroke_width=1.5,
        fill_color=COLOR_BG,
        fill_opacity=0.3,
    )
    inner_bezel = Rectangle(
        width=width - 0.12,
        height=height - 0.12,
        stroke_color=frame_color,
        stroke_width=0.5,
        stroke_opacity=0.4,
        fill_opacity=0,
    )
    inner_bezel.move_to(frame.get_center())
    elements = [frame, inner_bezel]
    if with_shadow:
        shadow = _create_shadow(frame, offset=SHADOW_OFFSET * 2, opacity=0.1)
        elements.insert(0, shadow)
    return VGroup(*elements)


def create_3d_panel(width, height, color=None, with_shadow=True):
    fill_color = color if color else COLOR_GLASS_BG
    panel = RoundedRectangle(
        width=width,
        height=height,
        corner_radius=CARD_CORNER_RADIUS,
        fill_color=fill_color,
        fill_opacity=GLASS_OPACITY,
        stroke_color=COLOR_GRID,
        stroke_width=1.5,
    )
    highlight_edge = Line(
        panel.get_left() + UP * height / 2 + RIGHT * CARD_CORNER_RADIUS,
        panel.get_right() + UP * height / 2 + LEFT * CARD_CORNER_RADIUS,
        color=WHITE,
        stroke_width=1.2,
        stroke_opacity=0.35 if DARK_MODE else 0.55,
    )
    elements = [panel, highlight_edge]
    if with_shadow:
        shadow = _create_shadow(panel, offset=SHADOW_OFFSET * CARD_ELEVATION, opacity=0.18)
        elements.insert(0, shadow)
    return VGroup(*elements)
