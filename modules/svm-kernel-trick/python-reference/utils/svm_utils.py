import numpy as np
from sklearn.svm import SVC


def train_svm(
    X: np.ndarray,
    y: np.ndarray,
    kernel: str = "rbf",
    C: float = 10.0,
    gamma: float | str = 1.0,
    degree: int = 3,
) -> SVC:
    """Train a scikit-learn Support Vector Classifier."""
    classifier = SVC(
        C=C,
        kernel=kernel,
        gamma=gamma,
        degree=degree,
        random_state=42,
    )
    classifier.fit(X, y)
    return classifier


def make_decision_grid(
    x_range: tuple[float, float] = (-3.0, 3.0),
    y_range: tuple[float, float] = (-3.0, 3.0),
    resolution: int = 100,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Create a flattened two-dimensional mesh grid."""
    x = np.linspace(x_range[0], x_range[1], resolution)
    y = np.linspace(y_range[0], y_range[1], resolution)
    xx, yy = np.meshgrid(x, y)
    grid_points = np.column_stack((xx.ravel(), yy.ravel()))
    return xx, yy, grid_points


def compute_decision_surface(
    model: SVC,
    grid_points: np.ndarray,
    xx: np.ndarray,
    yy: np.ndarray,
) -> np.ndarray:
    """Evaluate and reshape SVC decision scores for a mesh grid."""
    values = model.decision_function(grid_points)
    return values.reshape(xx.shape)
