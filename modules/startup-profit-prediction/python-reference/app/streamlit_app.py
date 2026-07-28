import os
import sys

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
try:
    from src.predict import predict_profit
except ModuleNotFoundError:
    from predict import predict_profit


st.set_page_config(
    page_title="Startup Profit Predictor",
    layout="wide",
    initial_sidebar_state="expanded",
)


st.markdown(
    """
    <style>
        :root {
            --surface: #ffffff;
            --surface-soft: #f6f8fb;
            --ink: #172033;
            --muted: #5d687c;
            --line: #dfe5ef;
            --accent: #0f766e;
            --accent-strong: #115e59;
            --warm: #f59e0b;
            --blue: #2563eb;
            --danger: #dc2626;
            --glass: rgba(255, 255, 255, 0.58);
            --glass-strong: rgba(255, 255, 255, 0.74);
            --glass-line: rgba(255, 255, 255, 0.72);
            --glass-shadow: 0 22px 55px rgba(23, 32, 51, 0.12);
            --glass-blur: blur(18px) saturate(145%);
        }

        @keyframes fadeUp {
            from {
                opacity: 0;
                transform: translateY(14px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulseGlow {
            0%, 100% {
                box-shadow: 0 14px 32px rgba(23, 32, 51, 0.07);
            }
            50% {
                box-shadow: 0 18px 42px rgba(15, 118, 110, 0.18);
            }
        }

        @keyframes progressFill {
            from {
                transform: scaleX(0);
            }
            to {
                transform: scaleX(1);
            }
        }

        .stApp {
            background:
                radial-gradient(circle at 12% 14%, rgba(15, 118, 110, 0.24), transparent 24rem),
                radial-gradient(circle at 86% 18%, rgba(37, 99, 235, 0.18), transparent 23rem),
                radial-gradient(circle at 72% 82%, rgba(245, 158, 11, 0.16), transparent 20rem),
                linear-gradient(135deg, #f9fbff 0%, #eaf3f2 48%, #f8fbff 100%);
            color: var(--ink);
        }

        .block-container {
            padding-top: 2rem;
        }

        section[data-testid="stSidebar"] {
            background: rgba(255, 255, 255, 0.46);
            border-right: 1px solid rgba(255, 255, 255, 0.74);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            box-shadow: 12px 0 34px rgba(23, 32, 51, 0.08);
        }

        section[data-testid="stSidebar"] > div {
            background:
                linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0.18));
        }

        .hero {
            position: relative;
            overflow: hidden;
            padding: 1.4rem 1.6rem;
            border: 1px solid var(--glass-line);
            border-radius: 8px;
            background:
                linear-gradient(135deg, rgba(255,255,255,0.76) 0%, rgba(238,248,247,0.48) 100%),
                repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0 1px, transparent 1px 42px);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            animation: fadeUp 520ms ease-out both, pulseGlow 4.8s ease-in-out infinite;
            margin-bottom: 1.2rem;
            box-shadow: var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.72);
        }

        .hero::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.5) 45%, transparent 70%);
            transform: translateX(-100%);
            animation: shimmer 5.5s ease-in-out infinite;
            pointer-events: none;
        }

        @keyframes shimmer {
            0%, 45% {
                transform: translateX(-100%);
            }
            70%, 100% {
                transform: translateX(100%);
            }
        }

        .hero h1 {
            margin: 0 0 0.35rem;
            font-size: clamp(2rem, 4vw, 3.2rem);
            line-height: 1.05;
            letter-spacing: 0;
            color: var(--ink);
        }

        .hero p {
            max-width: 56rem;
            margin: 0;
            color: var(--muted);
            font-size: 1.02rem;
            line-height: 1.65;
        }

        .section-title {
            margin: 0.2rem 0 0.7rem;
            color: var(--ink);
            font-size: 1.25rem;
            font-weight: 700;
        }

        div[data-testid="stMetric"] {
            background:
                linear-gradient(145deg, rgba(255,255,255,0.74), rgba(255,255,255,0.42));
            border: 1px solid var(--glass-line);
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 14px 32px rgba(23, 32, 51, 0.08), inset 0 1px 0 rgba(255,255,255,0.72);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        }

        div[data-testid="stMetric"]:hover {
            transform: translateY(-3px);
            border-color: rgba(255, 255, 255, 0.92);
            box-shadow: 0 18px 44px rgba(15, 118, 110, 0.16), inset 0 1px 0 rgba(255,255,255,0.86);
        }

        div[data-testid="stMetric"] label {
            color: var(--muted);
        }

        div[data-testid="stTabs"] button {
            color: var(--muted);
            font-weight: 600;
            border-radius: 8px 8px 0 0;
            transition: color 150ms ease, background 150ms ease;
        }

        div[data-testid="stTabs"] button[aria-selected="true"] {
            color: var(--accent-strong);
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .result-panel {
            padding: 1rem 1.1rem;
            border: 1px solid rgba(255, 255, 255, 0.78);
            border-left: 5px solid var(--accent);
            border-radius: 8px;
            background:
                linear-gradient(135deg, rgba(240, 253, 250, 0.78), rgba(255, 255, 255, 0.42));
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            box-shadow: 0 18px 44px rgba(15, 118, 110, 0.13), inset 0 1px 0 rgba(255,255,255,0.78);
            margin: 0.5rem 0 1rem;
            animation: fadeUp 420ms ease-out both;
        }

        .result-panel strong {
            color: var(--accent-strong);
            font-size: 1.7rem;
        }

        .profit-meter {
            margin-top: 0.8rem;
            height: 12px;
            overflow: hidden;
            border-radius: 999px;
            background: rgba(216, 228, 238, 0.62);
            box-shadow: inset 0 1px 4px rgba(23, 32, 51, 0.12);
        }

        .profit-meter > span {
            display: block;
            height: 100%;
            width: var(--score);
            transform-origin: left;
            animation: progressFill 900ms cubic-bezier(.2,.85,.2,1) both;
            background: linear-gradient(90deg, var(--warm), var(--accent), var(--blue));
        }

        .interactive-chip {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            margin: 0 0.4rem 0.5rem 0;
            padding: 0.42rem 0.65rem;
            border: 1px solid rgba(255, 255, 255, 0.72);
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.48);
            backdrop-filter: blur(14px) saturate(140%);
            -webkit-backdrop-filter: blur(14px) saturate(140%);
            box-shadow: 0 10px 24px rgba(23, 32, 51, 0.07), inset 0 1px 0 rgba(255,255,255,0.76);
            color: var(--muted);
            font-size: 0.9rem;
            transition: transform 160ms ease, border-color 160ms ease;
        }

        .interactive-chip:hover {
            transform: translateY(-2px);
            border-color: rgba(255, 255, 255, 0.95);
        }

        .muted-note {
            color: var(--muted);
            font-size: 0.92rem;
            line-height: 1.55;
        }

        div.stButton > button,
        div[data-testid="stFormSubmitButton"] button {
            width: 100%;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            background:
                linear-gradient(135deg, rgba(15, 118, 110, 0.95), rgba(17, 94, 89, 0.92));
            color: white;
            font-weight: 700;
            box-shadow: 0 14px 28px rgba(15, 118, 110, 0.22), inset 0 1px 0 rgba(255,255,255,0.28);
            transition: transform 150ms ease, background 150ms ease, box-shadow 150ms ease;
        }

        div.stButton > button:hover,
        div[data-testid="stFormSubmitButton"] button:hover {
            transform: translateY(-1px);
            border-color: rgba(255, 255, 255, 0.74);
            background:
                linear-gradient(135deg, rgba(17, 94, 89, 0.98), rgba(15, 118, 110, 0.98));
            color: white;
            box-shadow: 0 18px 34px rgba(15, 118, 110, 0.28), inset 0 1px 0 rgba(255,255,255,0.32);
        }

        .stDataFrame {
            border: 1px solid rgba(255, 255, 255, 0.72);
            border-radius: 8px;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.44);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            box-shadow: 0 14px 34px rgba(23, 32, 51, 0.08);
        }

        div[data-testid="stAlert"] {
            border-radius: 8px;
            backdrop-filter: blur(16px) saturate(140%);
            -webkit-backdrop-filter: blur(16px) saturate(140%);
            box-shadow: 0 12px 28px rgba(23, 32, 51, 0.08);
        }

        div[data-testid="stPlotlyChart"] {
            padding: 0.35rem;
            border: 1px solid rgba(255, 255, 255, 0.58);
            border-radius: 8px;
            background:
                linear-gradient(145deg, rgba(255,255,255,0.42), rgba(255,255,255,0.22));
            backdrop-filter: blur(16px) saturate(140%);
            -webkit-backdrop-filter: blur(16px) saturate(140%);
            box-shadow: 0 16px 38px rgba(23, 32, 51, 0.08);
        }

        div[data-testid="stForm"] {
            padding: 0.9rem;
            border: 1px solid rgba(255, 255, 255, 0.62);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.32);
            backdrop-filter: blur(16px) saturate(140%);
            -webkit-backdrop-filter: blur(16px) saturate(140%);
            box-shadow: 0 14px 28px rgba(23, 32, 51, 0.07);
        }

        div[data-baseweb="input"],
        div[data-baseweb="select"] > div,
        div[data-testid="stMultiSelect"] div[data-baseweb="select"] > div {
            border-color: rgba(255, 255, 255, 0.7);
            background-color: rgba(255, 255, 255, 0.48);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
        }

        div[data-baseweb="input"]:focus-within,
        div[data-baseweb="select"] > div:focus-within {
            border-color: rgba(15, 118, 110, 0.48);
            box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
        }

        div[data-testid="stSlider"] {
            padding: 0.3rem 0.15rem;
            border-radius: 8px;
        }

        div[data-testid="stVerticalBlockBorderWrapper"] {
            border-color: rgba(255, 255, 255, 0.64);
        }
    </style>
    """,
    unsafe_allow_html=True,
)


@st.cache_data
def load_startup_data() -> pd.DataFrame | None:
    data_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "data", "50_Startups.csv")
    )
    if not os.path.exists(data_path):
        return None
    return pd.read_csv(data_path)


def money(value: float) -> str:
    return f"${value:,.0f}"


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(value, high))


def apply_chart_theme(fig: go.Figure, height: int = 430) -> go.Figure:
    fig.update_layout(
        height=height,
        margin=dict(l=16, r=16, t=58, b=18),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(255,255,255,0.86)",
        font=dict(color="#172033", family="Arial, sans-serif"),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            bgcolor="rgba(255,255,255,0)",
        ),
        hoverlabel=dict(bgcolor="#172033", font_color="white"),
        transition=dict(duration=450, easing="cubic-in-out"),
    )
    fig.update_xaxes(gridcolor="#e7edf5", zeroline=False)
    fig.update_yaxes(gridcolor="#e7edf5", zeroline=False)
    return fig


df = load_startup_data()

st.markdown(
    """
    <div class="hero">
        <h1>Startup Profit Predictor</h1>
        <p>
            以研發、行政、行銷支出與州別資料預測新創公司利潤，並用互動圖表把預測結果放回歷史資料分布中比較。
        </p>
    </div>
    """,
    unsafe_allow_html=True,
)

with st.sidebar:
    st.header("預測設定")
    st.caption("調整輸入後按下預測，頁面會顯示落點、分數與比較圖。")

    with st.form("prediction_form"):
        rd_spend = st.number_input(
            "研發支出",
            min_value=0.0,
            value=100000.0,
            step=5000.0,
            format="%.2f",
        )
        administration = st.number_input(
            "行政支出",
            min_value=0.0,
            value=50000.0,
            step=5000.0,
            format="%.2f",
        )
        marketing_spend = st.number_input(
            "行銷支出",
            min_value=0.0,
            value=150000.0,
            step=5000.0,
            format="%.2f",
        )
        state = st.selectbox("州別", ["New York", "California", "Florida"])
        x_axis_choice = st.selectbox(
            "結果圖表 X 軸",
            ["R&D Spend", "Administration", "Marketing Spend"],
            help="選擇預測點要和哪一項歷史支出做比較。",
        )
        submitted = st.form_submit_button("預測利潤", type="primary")

    st.divider()
    st.subheader("圖表互動")
    chart_mode = st.radio(
        "視覺模式",
        ["散點圖", "氣泡圖", "3D 視角"],
        horizontal=False,
    )
    marker_size = st.slider("資料點大小", 6, 18, 10)
    enable_success_effect = st.toggle("預測成功特效", value=True)

    if df is not None:
        selected_states = st.multiselect(
            "篩選州別",
            sorted(df["State"].unique()),
            default=sorted(df["State"].unique()),
        )
        profit_min = int(df["Profit"].min())
        profit_max = int(df["Profit"].max())
        profit_range = st.slider(
            "利潤範圍",
            profit_min,
            profit_max,
            (profit_min, profit_max),
            step=1000,
        )
    else:
        selected_states = []
        profit_range = (0, 0)

    st.divider()
    st.caption("模型輸出僅供課程與資料分析展示使用。")

if df is None:
    filtered_df = None
    st.warning("找不到 data/50_Startups.csv，資料摘要與比較圖表暫時無法顯示。")
else:
    filtered_df = df[
        df["State"].isin(selected_states)
        & df["Profit"].between(profit_range[0], profit_range[1])
    ]

    metric_cols = st.columns(4)
    metric_cols[0].metric("目前樣本", f"{len(filtered_df):,}", f"總計 {len(df):,}")
    avg_metric = money(filtered_df["Profit"].mean()) if not filtered_df.empty else "-"
    max_metric = money(filtered_df["Profit"].max()) if not filtered_df.empty else "-"
    metric_cols[1].metric("平均利潤", avg_metric)
    metric_cols[2].metric("最高利潤", max_metric)
    metric_cols[3].metric("涵蓋州別", f"{filtered_df['State'].nunique()} 州")

    st.markdown(
        f"""
        <div>
            <span class="interactive-chip">篩選樣本 {len(filtered_df):,} 筆</span>
            <span class="interactive-chip">資料點大小 {marker_size}</span>
            <span class="interactive-chip">目前模式 {chart_mode}</span>
        </div>
        """,
        unsafe_allow_html=True,
    )

predicted_profit = None
error_message = None

if submitted:
    try:
        predicted_profit = predict_profit(
            rd_spend, administration, marketing_spend, state
        )
        if enable_success_effect:
            st.toast("預測完成，結果已更新。")
            st.balloons()
    except FileNotFoundError:
        error_message = "找不到模型檔案，請先完成模型訓練並產生 models/startup_profit_model.pkl。"
    except Exception as exc:
        error_message = f"預測時發生錯誤：{exc}"

tab_overview, tab_charts, tab_prediction, tab_simulator = st.tabs(
    ["資料總覽", "支出關聯", "預測結果", "互動模擬"]
)

with tab_overview:
    if filtered_df is None:
        st.info("請加入 data/50_Startups.csv 後重新整理頁面。")
    elif filtered_df.empty:
        st.info("目前篩選條件沒有資料，請調整側欄篩選。")
    else:
        left, right = st.columns([1.35, 1])
        with left:
            st.markdown('<div class="section-title">利潤分布</div>', unsafe_allow_html=True)
            hist_fig = px.histogram(
                filtered_df,
                x="Profit",
                color="State",
                nbins=18,
                color_discrete_sequence=["#0f766e", "#f59e0b", "#2563eb"],
                title="各州新創公司利潤分布",
            )
            apply_chart_theme(hist_fig, height=390)
            st.plotly_chart(hist_fig, use_container_width=True)
        with right:
            st.markdown('<div class="section-title">資料預覽</div>', unsafe_allow_html=True)
            st.dataframe(
                filtered_df.sort_values("Profit", ascending=False).head(10),
                use_container_width=True,
                hide_index=True,
            )
            st.markdown(
                '<p class="muted-note">篩選器會同步影響資料摘要、圖表與預測落點比較。</p>',
                unsafe_allow_html=True,
            )

with tab_charts:
    if filtered_df is None:
        st.info("沒有可用的歷史資料可以繪圖。")
    elif filtered_df.empty:
        st.info("目前篩選條件沒有資料，請調整側欄篩選。")
    else:
        st.markdown('<div class="section-title">支出與利潤關係</div>', unsafe_allow_html=True)
        if chart_mode == "3D 視角":
            fig_3d = px.scatter_3d(
                filtered_df,
                x="R&D Spend",
                y="Marketing Spend",
                z="Profit",
                color="State",
                size="Administration",
                color_discrete_sequence=["#0f766e", "#f59e0b", "#2563eb"],
                title="R&D、Marketing 與 Profit 的 3D 關係",
            )
            fig_3d.update_traces(marker=dict(opacity=0.78))
            fig_3d.update_layout(
                height=560,
                margin=dict(l=10, r=10, t=52, b=10),
                paper_bgcolor="rgba(0,0,0,0)",
                scene=dict(
                    xaxis=dict(backgroundcolor="#ffffff", gridcolor="#e7edf5"),
                    yaxis=dict(backgroundcolor="#ffffff", gridcolor="#e7edf5"),
                    zaxis=dict(backgroundcolor="#ffffff", gridcolor="#e7edf5"),
                ),
            )
            st.plotly_chart(fig_3d, use_container_width=True)
        else:
            chart_cols = st.columns(3)
            chart_specs = [
                ("R&D Spend", "R&D Spend vs Profit"),
                ("Administration", "Administration vs Profit"),
                ("Marketing Spend", "Marketing Spend vs Profit"),
            ]
            for chart_col, (x_col, title) in zip(chart_cols, chart_specs):
                with chart_col:
                    if chart_mode == "氣泡圖":
                        fig = px.scatter(
                            filtered_df,
                            x=x_col,
                            y="Profit",
                            color="State",
                            size="Marketing Spend",
                            color_discrete_sequence=["#0f766e", "#f59e0b", "#2563eb"],
                            title=title,
                        )
                    else:
                        fig = px.scatter(
                            filtered_df,
                            x=x_col,
                            y="Profit",
                            color="State",
                            color_discrete_sequence=["#0f766e", "#f59e0b", "#2563eb"],
                            title=title,
                        )
                    fig.update_traces(
                        marker=dict(size=marker_size, line=dict(width=0.5, color="white"))
                    )
                    apply_chart_theme(fig, height=360)
                    st.plotly_chart(fig, use_container_width=True)

with tab_prediction:
    if error_message:
        st.error(error_message)
    elif predicted_profit is None:
        st.info("在左側輸入資料並按下「預測利潤」後，這裡會顯示模型結果、分數條與比較圖。")
    else:
        compare_df = filtered_df if filtered_df is not None and not filtered_df.empty else df
        profit_floor = float(compare_df["Profit"].min()) if compare_df is not None else 0.0
        profit_ceiling = float(compare_df["Profit"].max()) if compare_df is not None else 1.0
        score = 100 * (predicted_profit - profit_floor) / max(profit_ceiling - profit_floor, 1)
        score = clamp(score, 0, 100)
        avg_profit = float(compare_df["Profit"].mean()) if compare_df is not None else 0.0
        delta = predicted_profit - avg_profit

        st.markdown(
            f"""
            <div class="result-panel">
                預測利潤<br>
                <strong>{money(predicted_profit)}</strong>
                <div class="profit-meter" aria-label="Profit score">
                    <span style="--score: {score:.1f}%"></span>
                </div>
                <p class="muted-note">
                    相對目前篩選資料平均值：{money(delta)}
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )

        input_x_val = {
            "R&D Spend": rd_spend,
            "Administration": administration,
            "Marketing Spend": marketing_spend,
        }[x_axis_choice]

        input_summary = pd.DataFrame(
            [
                {"項目": "研發支出", "金額": money(rd_spend)},
                {"項目": "行政支出", "金額": money(administration)},
                {"項目": "行銷支出", "金額": money(marketing_spend)},
                {"項目": "州別", "金額": state},
                {"項目": "利潤分位感", "金額": f"{score:.1f}%"},
            ]
        )

        summary_col, chart_col = st.columns([0.85, 1.75])
        with summary_col:
            st.markdown('<div class="section-title">輸入摘要</div>', unsafe_allow_html=True)
            st.dataframe(input_summary, hide_index=True, use_container_width=True)
            st.progress(score / 100, text=f"落在目前資料區間約 {score:.1f}% 的位置")
        with chart_col:
            if compare_df is None:
                st.info("沒有歷史資料，因此只顯示預測值。")
            else:
                fig_result = go.Figure()
                fig_result.add_trace(
                    go.Scatter(
                        x=compare_df[x_axis_choice],
                        y=compare_df["Profit"],
                        mode="markers",
                        name="歷史資料",
                        marker=dict(
                            color="#94a3b8",
                            opacity=0.62,
                            size=marker_size,
                            line=dict(width=0.5, color="white"),
                        ),
                        hovertemplate=(
                            f"{x_axis_choice}: %{{x:,.0f}}<br>"
                            "Profit: %{y:,.0f}<extra></extra>"
                        ),
                    )
                )
                fig_result.add_trace(
                    go.Scatter(
                        x=[input_x_val],
                        y=[predicted_profit],
                        mode="markers",
                        name="本次預測",
                        marker=dict(
                            color="#dc2626",
                            size=22,
                            symbol="star",
                            line=dict(width=1.4, color="white"),
                        ),
                        hovertemplate=(
                            "<b>本次輸入</b><br>"
                            f"R&D Spend: {rd_spend:,.0f}<br>"
                            f"Administration: {administration:,.0f}<br>"
                            f"Marketing Spend: {marketing_spend:,.0f}<br>"
                            f"State: {state}<br>"
                            f"<b>Profit: {predicted_profit:,.0f}</b><extra></extra>"
                        ),
                    )
                )
                fig_result.add_hline(
                    y=avg_profit,
                    line_dash="dot",
                    line_color="#0f766e",
                    annotation_text="目前平均",
                    annotation_position="top left",
                )
                fig_result.update_layout(
                    title=f"{x_axis_choice} 與 Profit 比較",
                    xaxis_title=x_axis_choice,
                    yaxis_title="Profit",
                    hovermode="closest",
                )
                apply_chart_theme(fig_result, height=460)
                st.plotly_chart(fig_result, use_container_width=True)

with tab_simulator:
    st.markdown('<div class="section-title">快速情境模擬</div>', unsafe_allow_html=True)
    st.caption("用滑桿建立一組替代情境，不影響左側正式預測輸入。")
    sim_cols = st.columns(4)
    with sim_cols[0]:
        sim_rd = st.slider("模擬研發支出", 0, 200000, int(rd_spend), step=5000)
    with sim_cols[1]:
        sim_admin = st.slider("模擬行政支出", 0, 200000, int(administration), step=5000)
    with sim_cols[2]:
        sim_marketing = st.slider("模擬行銷支出", 0, 300000, int(marketing_spend), step=5000)
    with sim_cols[3]:
        sim_state = st.selectbox(
            "模擬州別",
            ["New York", "California", "Florida"],
            index=["New York", "California", "Florida"].index(state),
        )

    if st.button("試算模擬情境"):
        try:
            sim_profit = predict_profit(sim_rd, sim_admin, sim_marketing, sim_state)
            st.success(f"模擬情境預測利潤：{money(sim_profit)}")
            fig_sim = go.Figure(
                go.Waterfall(
                    name="spending",
                    orientation="v",
                    measure=["relative", "relative", "relative", "total"],
                    x=["研發", "行政", "行銷", "預測利潤"],
                    y=[sim_rd, sim_admin, sim_marketing, sim_profit],
                    connector={"line": {"color": "#94a3b8"}},
                    increasing={"marker": {"color": "#0f766e"}},
                    totals={"marker": {"color": "#2563eb"}},
                )
            )
            fig_sim.update_layout(title="支出投入與預測利潤情境", yaxis_title="Amount")
            apply_chart_theme(fig_sim, height=430)
            st.plotly_chart(fig_sim, use_container_width=True)
        except FileNotFoundError:
            st.error("找不到模型檔案，請先完成模型訓練。")
        except Exception as exc:
            st.error(f"模擬時發生錯誤：{exc}")
