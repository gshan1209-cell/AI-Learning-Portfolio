from manim import *
from shared.theme import *


def fade_in_sequence(mobjects, run_time=0.5, lag_ratio=0.3):
    animations = []
    for mob in mobjects:
        animations.append(FadeIn(mob, run_time=run_time))
    return AnimationGroup(*animations, lag_ratio=lag_ratio)


def write_and_fade(text_mob, run_time=1.5):
    return Write(text_mob, run_time=run_time)


def pulse_highlight(mob, scale_factor=1.15, run_time=0.6):
    original_color = mob.get_color() if hasattr(mob, "get_color") else WHITE
    return Succession(
        mob.animate.scale(scale_factor).set_color(COLOR_ORANGE),
        mob.animate.scale(1 / scale_factor).set_color(original_color),
        run_time=run_time,
    )


def grow_from_bottom(mob, run_time=1.0):
    return GrowFromEdge(mob, DOWN, run_time=run_time)


def float_in_from(mob, direction=DOWN, distance=0.6, run_time=0.8):
    target = mob.copy()
    mob.shift(direction * distance)
    mob.set_opacity(0)
    return mob.animate.move_to(target.get_center()).set_opacity(1)


def create_gradient_background(scene):
    bg = Rectangle(
        width=15.0,
        height=8.5,
        stroke_width=0,
        fill_opacity=1.0,
    )
    bg.set_color_by_gradient([COLOR_BG_GRADIENT_TOP, COLOR_BG_GRADIENT_BOTTOM])
    bg.move_to(ORIGIN)
    scene.add(bg)

    grid = VGroup()
    grid_opacity = 0.08 if DARK_MODE else 0.035
    grid_spacing = 0.85

    for x in np.arange(-7.5, 7.5, grid_spacing):
        line = Line(
            [x, -4.25, 0], [x, 4.25, 0],
            color=COLOR_GRID, stroke_width=0.8, stroke_opacity=grid_opacity
        )
        grid.add(line)

    for y in np.arange(-4.25, 4.25, grid_spacing):
        line = Line(
            [-7.5, y, 0], [7.5, y, 0],
            color=COLOR_GRID, stroke_width=0.8, stroke_opacity=grid_opacity
        )
        grid.add(line)

    scene.add(grid)
    return VGroup(bg, grid)


def draw_chart_frame(width=8, height=4, with_3d=True):
    half_w = width / 2
    half_h = height / 2

    frame = Rectangle(
        width=width,
        height=height,
        stroke_color=COLOR_GRID,
        stroke_width=1.8,
        fill_color=COLOR_BG,
        fill_opacity=0.35,
    )

    elements = [frame]

    if with_3d:
        bezel = Rectangle(
            width=width - 0.08,
            height=height - 0.08,
            stroke_color=COLOR_GRID,
            stroke_width=0.6,
            stroke_opacity=0.4,
            fill_opacity=0,
        )
        bezel.move_to(frame.get_center())
        elements.append(bezel)

    grid_lines = VGroup()
    for i in range(1, 4):
        y = -half_h + i * height / 4
        line = DashedLine(
            [-half_w + 0.1, y, 0],
            [half_w - 0.1, y, 0],
            color=COLOR_GRID,
            stroke_width=0.8,
            dash_length=0.1,
            stroke_opacity=0.4 if DARK_MODE else 0.5,
        )
        grid_lines.add(line)
    elements.append(grid_lines)

    return VGroup(*elements)


def create_glow_circle(center, radius=0.2, color=COLOR_ORANGE, opacity=0.25):
    glow = Circle(
        radius=radius * 2.2,
        fill_color=color,
        fill_opacity=opacity,
        stroke_width=0,
    )
    glow.move_to(center)

    ring = Circle(
        radius=radius,
        stroke_color=color,
        stroke_width=2.5,
        fill_opacity=0,
    )
    ring.move_to(center)

    return VGroup(glow, ring)


def glow_ripple(center, color=COLOR_ORANGE, start_radius=0.15, end_radius=0.7, run_time=0.8):
    ripple = Circle(
        radius=start_radius,
        stroke_color=color,
        stroke_width=3,
        fill_opacity=0,
    )
    ripple.move_to(center)

    return Succession(
        ripple.animate(run_time=run_time, rate_func=exponential_decay).scale(end_radius / start_radius).set_stroke(opacity=0, width=0.5),
        run_time=run_time
    )
