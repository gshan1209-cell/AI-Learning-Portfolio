import os

import matplotlib.pyplot as plt
import numpy as np

from utils.data_generator import generate_ring_dataset
from utils.svm_utils import compute_decision_surface, make_decision_grid, train_svm


def main():
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "outputs")
    os.makedirs(output_dir, exist_ok=True)

    C_value = 10.0
    gamma_value = 1.0
    noise_value = 0.08
    seed_value = 7

    X, y = generate_ring_dataset(
        n_inner=35,
        n_outer=45,
        inner_radius_range=(0.0, 1.0),
        outer_radius_range=(1.6, 2.5),
        noise=noise_value,
        random_seed=seed_value,
    )

    classifier = train_svm(X, y, kernel="rbf", C=C_value, gamma=gamma_value)
    accuracy = classifier.score(X, y)

    x_min, x_max = X[:, 0].min() - 0.5, X[:, 0].max() + 0.5
    y_min, y_max = X[:, 1].min() - 0.5, X[:, 1].max() + 0.5
    xx, yy, grid_points = make_decision_grid(
        x_range=(x_min, x_max),
        y_range=(y_min, y_max),
        resolution=150,
    )
    surface = compute_decision_surface(classifier, grid_points, xx, yy)

    support_indices = classifier.support_
    support_vectors = X[support_indices]
    decision_scores = classifier.decision_function(X)

    blue = "#1E88E5"
    red = "#E53935"
    yellow = "#FFD54F"

    figure_2d, axis_2d = plt.subplots(figsize=(7, 6))
    confidence = axis_2d.contourf(xx, yy, surface, levels=50, cmap="RdBu_r", alpha=0.3)
    figure_2d.colorbar(confidence, ax=axis_2d, label="Decision Score f(x, y)")
    axis_2d.contour(
        xx,
        yy,
        surface,
        levels=[-1.0, 0.0, 1.0],
        colors=[yellow, yellow, yellow],
        linestyles=["dashed", "solid", "dashed"],
        linewidths=[1.5, 2.5, 1.5],
    )
    axis_2d.scatter(X[y == 0, 0], X[y == 0, 1], c=blue, edgecolors="black", label="Inner Class")
    axis_2d.scatter(X[y == 1, 0], X[y == 1, 1], c=red, edgecolors="black", label="Outer Class")
    axis_2d.scatter(
        support_vectors[:, 0],
        support_vectors[:, 1],
        s=140,
        facecolors="none",
        edgecolors="white",
        linewidths=2,
        label="Support Vectors",
    )
    axis_2d.set_title(f"2D RBF SVM Decision Boundary (Accuracy: {accuracy * 100:.1f}%)")
    axis_2d.set_xlabel("Feature x")
    axis_2d.set_ylabel("Feature y")
    axis_2d.legend()
    axis_2d.grid(True, linestyle="--", alpha=0.4)
    figure_2d.savefig(os.path.join(output_dir, "phase2_decision_boundary_2d.png"), dpi=150, bbox_inches="tight")
    plt.close(figure_2d)

    figure_3d = plt.figure(figsize=(8, 7))
    axis_3d = figure_3d.add_subplot(111, projection="3d")
    axis_3d.plot_surface(xx, yy, surface, cmap="RdBu_r", alpha=0.5, linewidth=0)
    axis_3d.plot_surface(xx, yy, np.zeros_like(xx), color=yellow, alpha=0.15, shade=False)
    axis_3d.scatter(
        X[y == 0, 0],
        X[y == 0, 1],
        decision_scores[y == 0],
        c=blue,
        edgecolors="black",
        depthshade=False,
    )
    axis_3d.scatter(
        X[y == 1, 0],
        X[y == 1, 1],
        decision_scores[y == 1],
        c=red,
        edgecolors="black",
        depthshade=False,
    )
    axis_3d.scatter(
        support_vectors[:, 0],
        support_vectors[:, 1],
        classifier.decision_function(support_vectors),
        s=100,
        facecolors="none",
        edgecolors=yellow,
        linewidths=2,
        depthshade=False,
    )
    axis_3d.set_title("3D SVM RBF Decision Function Surface z = f(x, y)")
    axis_3d.set_xlabel("Feature x")
    axis_3d.set_ylabel("Feature y")
    axis_3d.set_zlabel("Decision Score f(x, y)")
    axis_3d.view_init(elev=28, azim=-48)
    figure_3d.savefig(os.path.join(output_dir, "phase2_decision_surface_3d.png"), dpi=150, bbox_inches="tight")
    plt.close(figure_3d)

    print(f"Training accuracy: {accuracy * 100:.2f}%")
    print(f"Support vectors: {len(support_indices)}")
    print(f"Saved outputs to: {output_dir}")


if __name__ == "__main__":
    main()
