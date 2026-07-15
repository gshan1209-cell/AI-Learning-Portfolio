import numpy as np


def generate_ring_dataset(
    n_inner: int = 35,
    n_outer: int = 45,
    inner_radius_range: tuple[float, float] = (0.0, 1.0),
    outer_radius_range: tuple[float, float] = (1.6, 2.5),
    noise: float = 0.08,
    random_seed: int = 7,
):
    """Generate a reproducible two-class concentric ring dataset."""
    rng = np.random.default_rng(random_seed)

    r_inner = rng.uniform(inner_radius_range[0], inner_radius_range[1], n_inner)
    theta_inner = rng.uniform(0, 2 * np.pi, n_inner)
    X_inner = np.column_stack((r_inner * np.cos(theta_inner), r_inner * np.sin(theta_inner)))

    r_outer = rng.uniform(outer_radius_range[0], outer_radius_range[1], n_outer)
    theta_outer = rng.uniform(0, 2 * np.pi, n_outer)
    X_outer = np.column_stack((r_outer * np.cos(theta_outer), r_outer * np.sin(theta_outer)))

    X_inner += rng.normal(0, noise, size=X_inner.shape)
    X_outer += rng.normal(0, noise, size=X_outer.shape)

    X = np.vstack((X_inner, X_outer))
    y = np.hstack((np.zeros(n_inner, dtype=int), np.ones(n_outer, dtype=int)))
    return X, y
