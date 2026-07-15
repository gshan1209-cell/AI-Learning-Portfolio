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


def create_candle(open_price, close_price, high_price, low_price, x=0, scale=1.0,
                  with_shadow=True, with_highlight=True):
    is_red = close_price >= open_price
    color = COLOR_RED_UP if is_red else COLOR_GREEN_DOWN
    color_highlight = COLOR_RED_UP_HIGHLIGHT if is_red else COLOR_GREEN_DOWN_HIGHLIGHT

    body_height = max(abs(close_price - open_price) * scale, 0.12)
    candle_width = 0.32

    shadow_body = None
    if with_shadow:
        shadow_body = Rectangle(
            width=candle_width,
            height=body_height,
            fill_color=COLOR_SHADOW,
            fill_opacity=0.18,
            stroke_width=0,
        )

    body = Rectangle(
        width=candle_width,
        height=body_height,
        stroke_color=color,
        fill_color=color,
        fill_opacity=0.75 if DARK_MODE else 0.85,
        stroke_width=1.5,
    )

    highlight_strip = None
    if with_highlight and body_height > 0.18:
        highlight_strip = Rectangle(
            width=candle_width * 0.22,
            height=body_height * 0.75,
            fill_color=color_highlight,
            fill_opacity=0.45,
            stroke_width=0,
        )

    body_y = ((open_price + close_price) / 2) * scale
    body.move_to([x, body_y, 0])

    if shadow_body:
        shadow_body.move_to([x + SHADOW_OFFSET[0] * 2.2, body_y + SHADOW_OFFSET[1] * 2.2, 0])

    if highlight_strip:
        highlight_strip.move_to([x - candle_width * 0.28, body_y, 0])

    wick_color = color_highlight if DARK_MODE else color
    wick = Line(
        [x, low_price * scale, 0],
        [x, high_price * scale, 0],
        color=wick_color,
        stroke_width=3.0,
    )

    elements = [wick, body]
    if shadow_body:
        elements.insert(0, shadow_body)
    if highlight_strip:
        elements.append(highlight_strip)

    return VGroup(*elements)


def create_candlestick_chart(df, width=8, height=4, with_3d=True):
    n = len(df)
    x_positions = [width * (i / (n - 1) - 0.5) for i in range(n)]

    price_min = df["low"].min()
    price_max = df["high"].max()
    price_range = price_max - price_min
    offset = 0.15 * price_range
    price_min -= offset
    price_max += offset
    price_range = price_max - price_min

    scale = height / price_range
    shift = (price_min + price_max) / 2

    candles = VGroup()
    for i in range(n):
        candle = create_candle(
            df["open"].iloc[i] - shift,
            df["close"].iloc[i] - shift,
            df["high"].iloc[i] - shift,
            df["low"].iloc[i] - shift,
            x=x_positions[i],
            scale=scale,
            with_shadow=with_3d,
            with_highlight=with_3d,
        )
        candles.add(candle)

    return candles


def create_volume_bars(df, width=8, height=1.5, with_3d=True):
    n = len(df)
    x_positions = [width * (i / (n - 1) - 0.5) for i in range(n)]

    vol_max = df["volume"].max()
    vol_min = df["volume"].min()
    scale = height / (vol_max - vol_min) if vol_max != vol_min else height / vol_max

    bars = VGroup()
    for i in range(n):
        vol = df["volume"].iloc[i]
        open_p = df["open"].iloc[i]
        close_p = df["close"].iloc[i]
        is_red = close_p >= open_p
        color = COLOR_RED_UP if is_red else COLOR_GREEN_DOWN
        color_highlight = COLOR_RED_UP_HIGHLIGHT if is_red else COLOR_GREEN_DOWN_HIGHLIGHT

        bar_width = 0.28
        bar_height = max(vol * scale, 0.05)
        bar_x = x_positions[i]
        bar_y = bar_height / 2

        bar = Rectangle(
            width=bar_width,
            height=bar_height,
            fill_color=color,
            fill_opacity=0.6 if DARK_MODE else 0.75,
            stroke_color=color,
            stroke_width=1.2,
        )
        bar.move_to([bar_x, bar_y, 0])

        elements = [bar]

        if with_3d and bar_height > 0.1:
            hl_strip = Rectangle(
                width=bar_width * 0.22,
                height=bar_height * 0.8,
                fill_color=color_highlight,
                fill_opacity=0.35,
                stroke_width=0,
            )
            hl_strip.move_to([bar_x - bar_width * 0.26, bar_y, 0])
            elements.append(hl_strip)

        if with_3d:
            shadow = Rectangle(
                width=bar_width,
                height=bar_height,
                fill_color=COLOR_SHADOW,
                fill_opacity=0.12,
                stroke_width=0,
            )
            shadow.move_to([bar_x + SHADOW_OFFSET[0] * 2.2, bar_y + SHADOW_OFFSET[1] * 2.2, 0])
            elements.insert(0, shadow)

        bars.add(VGroup(*elements))

    return bars


def create_moving_average_line(values, color, width=8, height=4, with_glow=True):
    n = len(values)
    x_positions = [width * (i / (n - 1) - 0.5) for i in range(n)]

    v_min = min(values)
    v_max = max(values)
    v_range = v_max - v_min or 1
    scale = height / v_range
    shift = (v_min + v_max) / 2

    points = []
    for i in range(n):
        y = (values[i] - shift) * scale
        points.append([x_positions[i], y, 0])

    line = VMobject(color=color, stroke_width=4.5)
    line.set_points_smoothly(points)

    if with_glow:
        glow_outer = VMobject(color=color, stroke_width=14, stroke_opacity=0.06)
        glow_outer.set_points_smoothly(points)
        glow_inner = VMobject(color=color, stroke_width=8, stroke_opacity=0.18)
        glow_inner.set_points_smoothly(points)
        return VGroup(glow_outer, glow_inner, line)

    return line


def create_support_resistance_lines(support_y, resistance_y, width=8, with_glow=True):
    half_w = width / 2

    s_glow = None
    r_glow = None
    if with_glow:
        s_glow = DashedLine(
            [-half_w, support_y, 0], [half_w, support_y, 0],
            color=COLOR_GREEN_DOWN, stroke_width=10, stroke_opacity=0.15,
            dash_length=0.15,
        )
        r_glow = DashedLine(
            [-half_w, resistance_y, 0], [half_w, resistance_y, 0],
            color=COLOR_RED_UP, stroke_width=10, stroke_opacity=0.15,
            dash_length=0.15,
        )

    support_line = DashedLine(
        [-half_w, support_y, 0], [half_w, support_y, 0],
        color=COLOR_GREEN_DOWN, stroke_width=3.2, dash_length=0.15,
    )
    resistance_line = DashedLine(
        [-half_w, resistance_y, 0], [half_w, resistance_y, 0],
        color=COLOR_RED_UP, stroke_width=3.2, dash_length=0.15,
    )

    support_label = Text("支撐", font_size=FONT_SMALL_SIZE, color=COLOR_GREEN_DOWN, weight=BOLD)
    support_label.next_to(support_line, LEFT, buff=0.25)
    resistance_label = Text("壓力", font_size=FONT_SMALL_SIZE, color=COLOR_RED_UP, weight=BOLD)
    resistance_label.next_to(resistance_line, LEFT, buff=0.25)

    elements = [support_line, resistance_line, support_label, resistance_label]
    if s_glow:
        elements.insert(0, s_glow)
    if r_glow:
        elements.insert(2, r_glow)

    return VGroup(*elements)


def create_indicator_panel(lines, width=8, height=1.5):
    return VGroup(*lines)


def create_metric_card(title_text_str, value_text_str, color, with_shadow=True):
    card = RoundedRectangle(
        width=2.5,
        height=1.55,
        corner_radius=CARD_CORNER_RADIUS,
        fill_color=COLOR_GLASS_BG,
        fill_opacity=GLASS_OPACITY,
        stroke_color=COLOR_GRID,
        stroke_width=1.5,
    )

    glass_edge = RoundedRectangle(
        width=2.42,
        height=1.47,
        corner_radius=CARD_CORNER_RADIUS * 0.85,
        fill_opacity=0,
        stroke_color=WHITE,
        stroke_width=1.0,
        stroke_opacity=0.35 if DARK_MODE else 0.55,
    )
    glass_edge.move_to(card.get_center())

    accent_bar = RoundedRectangle(
        width=2.5,
        height=0.08,
        corner_radius=0.04,
        fill_color=color,
        fill_opacity=0.85,
        stroke_width=0,
    )
    accent_bar.move_to(card.get_top() + DOWN * 0.04)

    title = Text(title_text_str, font_size=FONT_SMALL_SIZE, color=COLOR_GRAY)
    title.move_to(card.get_center() + UP * 0.25)
    value = Text(value_text_str, font_size=FONT_SUBTITLE_SIZE, color=color, weight=BOLD)
    value.move_to(card.get_center() + DOWN * 0.28)

    elements = [card, glass_edge, accent_bar, title, value]
    if with_shadow:
        shadow = _create_shadow(card, offset=SHADOW_OFFSET * CARD_ELEVATION, opacity=0.18)
        elements.insert(0, shadow)

    return VGroup(*elements)
