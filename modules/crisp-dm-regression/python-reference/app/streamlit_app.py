import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
import yfinance as yf
import plotly.express as px
import plotly.graph_objects as go
import gzip
import pickle
import os

st.set_page_config(page_title="CRISP-DM 迴歸學習系統", layout="wide")

# Theme Selection
st.sidebar.title("外觀設定")
theme = st.sidebar.selectbox("選擇全域皮膚 (Theme)", ["Dark (深色)", "Light (淺色)", "Pink (粉色)"])

plt.style.use('default')
if theme == "Dark (深色)":
    plt.style.use('dark_background')
    css = """
    <style>
    [data-testid="stAppViewContainer"] { background-color: #0e1117; color: #fafafa; }
    [data-testid="stSidebar"] { background-color: #262730; color: #fafafa; }
    .stMarkdown, .stText, h1, h2, h3, h4, h5, h6, p, label { color: #fafafa !important; }
    </style>
    """
elif theme == "Light (淺色)":
    css = """
    <style>
    [data-testid="stAppViewContainer"] { background-color: #ffffff; color: #31333F; }
    [data-testid="stSidebar"] { background-color: #f0f2f6; color: #31333F; }
    .stMarkdown, .stText, h1, h2, h3, h4, h5, h6, p, label { color: #31333F !important; }
    </style>
    """
elif theme == "Pink (粉色)":
    plt.rcParams['figure.facecolor'] = '#fff0f5'
    plt.rcParams['axes.facecolor'] = '#ffe4e1'
    css = """
    <style>
    [data-testid="stAppViewContainer"] { background-color: #fff0f5; color: #4a0e2e; }
    [data-testid="stSidebar"] { background-color: #ffb6c1; color: #4a0e2e; }
    .stMarkdown, .stText, h1, h2, h3, h4, h5, h6, p, label { color: #4a0e2e !important; }
    [data-testid="stHeader"] { background-color: rgba(0,0,0,0); }
    .stButton>button { background-color: #ff69b4 !important; color: white !important; border: none; }
    .stButton>button:hover { background-color: #ff1493 !important; }
    </style>
    """

st.markdown(css, unsafe_allow_html=True)

st.sidebar.markdown("---")

# Sidebar
st.sidebar.title("CRISP-DM 學習")
case_selection = st.sidebar.radio(
    "選擇案例：",
    ("案例 1：2330.TW 股價預測", "案例 2：Startup 50 新創利潤預測")
)

st.title("CRISP-DM 迴歸學習系統")
st.markdown("本系統使用 **CRISP-DM 方法論**完整示範如何解決迴歸型 (Regression) 問題。")

def load_stock_data():
    ticker = "2330.TW"
    df = yf.download(ticker, start="2020-01-01", end="2026-01-01")
    df = df.dropna()
    return df

def process_stock_data(df):
    df["MA_5"] = df["Close"].rolling(window=5).mean()
    df["MA_10"] = df["Close"].rolling(window=10).mean()
    df["MA_20"] = df["Close"].rolling(window=20).mean()
    df["Return"] = df["Close"].pct_change()
    df["Lag_1_Close"] = df["Close"].shift(1)
    df["Lag_2_Close"] = df["Close"].shift(2)
    df["Lag_3_Close"] = df["Close"].shift(3)
    df = df.dropna()
    
    features = ["Open", "High", "Low", "Volume", "MA_5", "MA_10", "MA_20", "Return", "Lag_1_Close", "Lag_2_Close", "Lag_3_Close"]
    X = df[features].astype(float)
    y = df["Close"].astype(float)
    return X, y, df

def load_startup_data():
    data_path = "data/raw/50_Startups.csv"
    if not os.path.exists(data_path):
        os.makedirs("data/raw", exist_ok=True)
        url = "https://raw.githubusercontent.com/krishnaik06/Multiple-Linear-Regression/master/50_Startups.csv"
        df = pd.read_csv(url)
        df.to_csv(data_path, index=False)
    else:
        df = pd.read_csv(data_path)
    return df

if case_selection == "案例 1：2330.TW 股價預測":
    st.header("案例 1：2330.TW 股價預測")
    st.markdown("任務類型：自迴歸 (Auto Regression) / 時間序列迴歸 (Time Series Regression)  \n預測目標：根據歷史股價資料預測未來收盤價。")
    
    st.subheader("步驟 1：載入資料與產生散佈圖")
    st.info("這一步是先把資料讀進來，並用圖表觀察資料長什麼樣子。先看懂資料，比直接建模更重要。")
    df_raw = load_stock_data()
    st.write("資料預覽：", df_raw.head())
    
    st.write("隨機迴歸資料散佈圖 (理解迴歸概念)：")
    fig, ax = plt.subplots(figsize=(8,4))
    x_rand = np.random.uniform(-100, 100, 200)
    y_rand = 2.5 * x_rand + 50 + np.random.normal(0, 100, 200)
    ax.scatter(x_rand, y_rand, alpha=0.6)
    ax.set_title("隨機迴歸資料")
    st.pyplot(fig)
    
    st.write("真實股價走勢圖：")
    st.line_chart(df_raw['Close'])
    
    st.subheader("步驟 2：資料前處理")
    st.info("資料前處理是把原始資料整理成模型看得懂的格式。這裡我們處理了缺失值並加入了移動平均 (MA) 等特徵。")
    X, y, df_processed = process_stock_data(df_raw)
    st.write("特徵工程後的 X (前五筆)：", X.head())
    
    split_index = int(len(df_processed) * 0.8)
    X_train, y_train = X.iloc[:split_index], y.iloc[:split_index]
    X_test, y_test = X.iloc[split_index:], y.iloc[split_index:]
    st.write(f"訓練集大小 (Train size): {len(X_train)}, 測試集大小 (Test size): {len(X_test)}")
    
    st.subheader("步驟 3：建立模型")
    st.info("建模就是讓模型從資料中學習 X 和 y 之間的關係。")
    model_type = st.selectbox("選擇模型", ["線性迴歸 (Linear Regression)", "隨機森林迴歸 (Random Forest Regressor)"])
    
    if model_type == "線性迴歸 (Linear Regression)":
        model = LinearRegression()
    else:
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        
    model.fit(X_train, y_train)
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    st.success("模型訓練完成！")
    
    st.subheader("步驟 4：模型評估")
    st.info("模型訓練完後，需要用 MSE、MAE、R² 等指標客觀評估。觀察模型是否 overfit 或 underfit。")
    mse = mean_squared_error(y_test, y_pred_test)
    mae = mean_absolute_error(y_test, y_pred_test)
    r2 = r2_score(y_test, y_pred_test)
    train_r2 = r2_score(y_train, y_pred_train)
    
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("訓練集 R²", f"{train_r2:.4f}")
    col2.metric("測試集 R²", f"{r2:.4f}")
    col3.metric("MSE", f"{mse:.4f}")
    col4.metric("MAE", f"{mae:.4f}")
    
    st.write("訓練 / 測試集預測曲線 (互動式)：")
    fig2 = go.Figure()
    fig2.add_trace(go.Scatter(x=df_processed.index[:split_index], y=y_train, mode='lines', name="實際訓練集 (Actual Train)"))
    fig2.add_trace(go.Scatter(x=df_processed.index[split_index:], y=y_test, mode='lines', name="實際測試集 (Actual Test)"))
    fig2.add_trace(go.Scatter(x=df_processed.index[split_index:], y=y_pred_test, mode='lines', line=dict(dash='dash'), name="預測測試集 (Predicted Test)"))
    fig2.update_layout(xaxis_title="日期 (Date)", yaxis_title="股價 (Price)", hovermode="x unified")
    st.plotly_chart(fig2, use_container_width=True)
    
    st.subheader("步驟 5：模型部署")
    st.info("部署是把訓練好的模型保存起來，讓其他程式或使用者可以輸入新資料並取得預測結果。")
    if st.button("下載模型 (Download Model pkl.gz)"):
        with open("models/stock_model.pkl.gz", "rb") as f:
            st.download_button(
                label="點擊此處下載 (Click here to download)",
                data=f,
                file_name="stock_model.pkl.gz",
                mime="application/gzip"
            )
            
    st.write("預測 Demo (使用測試集最後一筆資料)：")
    sample_input = X_test.iloc[-1:]
    st.write("輸入特徵 (Input Features):", sample_input)
    st.write("預測收盤價 (Predicted Close Price):", model.predict(sample_input)[0])

else:
    st.header("案例 2：Startup 50 新創利潤預測")
    st.markdown("任務類型：多元線性迴歸 (Multiple Linear Regression)  \n預測目標：根據公司支出與地區預測利潤。")
    
    st.subheader("步驟 1：載入資料與產生散佈圖")
    st.info("這一步是先把資料讀進來，並用圖表觀察資料長什麼樣子。如果散佈圖呈現明顯向上趨勢，代表該特徵可能與 Profit 有正相關。")
    df = load_startup_data()
    st.write("資料預覽：", df.head())
    
    st.write("特徵對 Profit 的散佈圖：")
    fig, axes = plt.subplots(1, 3, figsize=(15, 4))
    axes[0].scatter(df["R&D Spend"], df["Profit"])
    axes[0].set_title("研發支出 vs 利潤")
    axes[1].scatter(df["Administration"], df["Profit"], color='orange')
    axes[1].set_title("行政支出 vs 利潤")
    axes[2].scatter(df["Marketing Spend"], df["Profit"], color='green')
    axes[2].set_title("行銷支出 vs 利潤")
    st.pyplot(fig)
    
    st.subheader("步驟 2：資料前處理")
    st.info("將文字類別 (State) 做 One-Hot Encoding，並切割 Train/Test 集合。")
    X = df.drop("Profit", axis=1)
    y = df["Profit"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    st.write(f"訓練集大小 (Train set): {X_train.shape}, 測試集大小 (Test set): {X_test.shape}")
    
    st.subheader("步驟 3：建立模型")
    st.info("建立 Pipeline，將 One-Hot Encoding 前處理和 Linear Regression 模型綁定。")
    numeric_features = ["R&D Spend", "Administration", "Marketing Spend"]
    categorical_features = ["State"]
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(drop="first", handle_unknown="ignore"), categorical_features),
            ("num", "passthrough", numeric_features)
        ]
    )
    model = Pipeline(steps=[("preprocessor", preprocessor), ("regressor", LinearRegression())])
    model.fit(X_train, y_train)
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    st.success("Pipeline 訓練完成！")
    
    st.subheader("步驟 4：模型評估")
    mse = mean_squared_error(y_test, y_pred_test)
    mae = mean_absolute_error(y_test, y_pred_test)
    r2 = r2_score(y_test, y_pred_test)
    train_r2 = r2_score(y_train, y_pred_train)
    
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("訓練集 R²", f"{train_r2:.4f}")
    col2.metric("測試集 R²", f"{r2:.4f}")
    col3.metric("MSE", f"{mse:.4f}")
    col4.metric("MAE", f"{mae:.4f}")
    
    st.write("實際 vs 預測圖 (Actual vs Predicted)：如果點越接近斜對角線，代表預測越準。")
    
    # 使用 Plotly 繪製互動式圖表
    fig2 = go.Figure()
    fig2.add_trace(go.Scatter(x=y_test, y=y_pred_test, mode='markers', name='預測值'))
    fig2.add_trace(go.Scatter(x=[y_test.min(), y_test.max()], y=[y_test.min(), y_test.max()], 
                              mode='lines', line=dict(dash='dash', color='red'), name='理想預測線'))
    fig2.update_layout(xaxis_title="實際利潤 (Actual Profit)", yaxis_title="預測利潤 (Predicted Profit)", hovermode="closest")
    st.plotly_chart(fig2, use_container_width=True)
    
    st.subheader("步驟 5：模型部署")
    st.info("將整個 Pipeline 儲存，以便未來不需手動做 One-Hot Encoding。")
    if st.button("下載 Pipeline 模型 (Download Model pkl.gz)"):
        with open("models/startup_model.pkl.gz", "rb") as f:
            st.download_button(
                label="點擊此處下載 (Click here to download)",
                data=f,
                file_name="startup_model.pkl.gz",
                mime="application/gzip"
            )
            
    st.write("預測 Demo (自行輸入特徵)：")
    rd = st.number_input("研發支出 (R&D Spend)", value=100000)
    admin = st.number_input("行政支出 (Administration)", value=150000)
    market = st.number_input("行銷支出 (Marketing Spend)", value=300000)
    state = st.selectbox("州 (State)", ["New York", "California", "Florida"])
    
    if st.button("預測利潤 (Predict Profit)"):
        input_df = pd.DataFrame([{
            "R&D Spend": rd,
            "Administration": admin,
            "Marketing Spend": market,
            "State": state
        }])
        pred = model.predict(input_df)[0]
        st.success(f"預測利潤 (Predicted Profit): ${pred:,.2f}")
