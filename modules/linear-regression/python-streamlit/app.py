# Migrated from gshan1209-cell/L4@main
# Source blob SHA: 891a64363b6f2d99d87287ba2d1cebb794d797d7
# This file is preserved as the original Streamlit reference implementation.

import streamlit as st
import os

os.environ.setdefault("MPLCONFIGDIR", os.path.join(os.getcwd(), ".matplotlib"))

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression


def generate_data(
    n=200,
    x_min=-100,
    x_max=100,
    a_min=-50,
    a_max=50,
    b_min=0,
    b_max=100,
    variance_min=0.0,
    variance_max=100000.0,
    random_seed=None,
):
    if n <= 0:
        raise ValueError("n must be greater than 0.")
    if x_min >= x_max:
        raise ValueError("x_min must be less than x_max.")
    if a_min >= a_max:
        raise ValueError("a_min must be less than a_max.")
    if b_min >= b_max:
        raise ValueError("b_min must be less than b_max.")
    if variance_min < 0:
        raise ValueError("variance_min must be non-negative.")
    if variance_min > variance_max:
        raise ValueError("variance_min must be less than or equal to variance_max.")

    rng = np.random.default_rng(random_seed)

    true_a = rng.uniform(a_min, a_max)
    true_b = rng.uniform(b_min, b_max)
    variance = rng.uniform(variance_min, variance_max)
    std = np.sqrt(variance)

    x_values = rng.uniform(x_min, x_max, n)
    noise = rng.normal(0, std, n)
    y_values = true_a * x_values + true_b + noise

    df = pd.DataFrame(
        {
            "X": x_values,
            "Y": y_values,
        }
    )

    return df, true_a, true_b, variance


def fit_linear_regression(df):
    model = LinearRegression()
    model.fit(df[["X"]], df["Y"])

    best_a = model.coef_[0]
    best_b = model.intercept_

    df = df.copy()
    df["Y_pred"] = model.predict(df[["X"]])
    df["residual"] = df["Y"] - df["Y_pred"]
    df["abs_residual"] = df["residual"].abs()

    return df, model, best_a, best_b


def find_top_outliers(df, top_k=10):
    if top_k <= 0:
        raise ValueError("top_k must be greater than 0.")

    df = df.copy()
    df["is_outlier"] = False

    top_outliers = df.sort_values(by="abs_residual", ascending=False).head(top_k)
    df.loc[top_outliers.index, "is_outlier"] = True

    return df, top_outliers


def plot_regression(
    df,
    top_outliers,
    best_a,
    best_b,
    true_a,
    true_b,
    variance,
    x_min=-100,
    x_max=100,
    save_path=None,
    show=True,
):
    fig, ax = plt.subplots(figsize=(10, 6))

    ax.scatter(df["X"], df["Y"], label="Data Points")
    ax.scatter(
        top_outliers["X"],
        top_outliers["Y"],
        s=120,
        label="Top 10 Outliers",
    )

    for i, (_, row) in enumerate(top_outliers.iterrows()):
        ax.annotate(
            str(i + 1),
            (row["X"], row["Y"]),
            textcoords="offset points",
            xytext=(0, 10),
            ha="center",
            fontsize=10,
            fontweight="bold",
        )

    x_line = np.linspace(x_min, x_max, 300)
    y_line = best_a * x_line + best_b
    ax.plot(
        x_line,
        y_line,
        color="red",
        linewidth=2,
        label="Regression Line",
    )

    ax.set_title("Simple Linear Regression with Top 10 Outliers")
    ax.set_xlabel("X")
    ax.set_ylabel("Y")
    ax.legend()
    ax.grid(True)

    info_text = (
        f"True a = {true_a:.4f}\n"
        f"True b = {true_b:.4f}\n"
        f"Variance = {variance:.4f}\n"
        f"Best a = {best_a:.4f}\n"
        f"Best b = {best_b:.4f}"
    )
    ax.text(
        0.02,
        0.98,
        info_text,
        transform=ax.transAxes,
        verticalalignment="top",
        bbox=dict(boxstyle="round", alpha=0.2),
    )

    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches="tight")

    if show:
        plt.show()

    return fig


def main():
    st.set_page_config(page_title="線性迴歸產生器", layout="wide")
    st.title("簡單線性迴歸圖產生器")

    st.sidebar.header("參數設定")
    n = st.sidebar.slider("資料筆數 (n)", min_value=10, max_value=1000, value=200, step=10)
    variance_range = st.sidebar.slider(
        "Variance 範圍",
        min_value=0.0,
        max_value=500000.0,
        value=(10000.0, 100000.0),
        step=1000.0,
    )
    variance_min, variance_max = variance_range

    with st.sidebar.expander("進階參數設定"):
        x_min = st.number_input("x_min", value=-100.0)
        x_max = st.number_input("x_max", value=100.0)
        a_min = st.number_input("a_min", value=-50.0)
        a_max = st.number_input("a_max", value=50.0)
        b_min = st.number_input("b_min", value=0.0)
        b_max = st.number_input("b_max", value=100.0)
        top_k = st.number_input("Top K Outliers", min_value=1, max_value=50, value=10)
        random_seed = st.number_input("Random Seed (輸入 0 為隨機)", value=42)

    seed = int(random_seed) if random_seed != 0 else None

    df, true_a, true_b, variance = generate_data(
        n=int(n),
        x_min=float(x_min),
        x_max=float(x_max),
        a_min=float(a_min),
        a_max=float(a_max),
        b_min=float(b_min),
        b_max=float(b_max),
        variance_min=float(variance_min),
        variance_max=float(variance_max),
        random_seed=seed,
    )

    df, model, best_a, best_b = fit_linear_regression(df)
    df, top10_outliers = find_top_outliers(df, top_k=int(top_k))

    fig = plot_regression(
        df=df,
        top_outliers=top10_outliers,
        best_a=best_a,
        best_b=best_b,
        true_a=true_a,
        true_b=true_b,
        variance=variance,
        x_min=float(x_min),
        x_max=float(x_max),
        show=False,
    )
    st.pyplot(fig)

    st.subheader("模型資訊")
    cols = st.columns(5)
    cols[0].metric("True a", f"{true_a:.4f}")
    cols[1].metric("True b", f"{true_b:.4f}")
    cols[2].metric("Variance", f"{variance:.4f}")
    cols[3].metric("Best a", f"{best_a:.4f}")
    cols[4].metric("Best b", f"{best_b:.4f}")

    st.subheader(f"Top {int(top_k)} Outliers")
    st.dataframe(
        top10_outliers[["X", "Y", "Y_pred", "residual", "abs_residual"]],
        use_container_width=True,
    )

    return df, top10_outliers, model


if __name__ == "__main__":
    main()
