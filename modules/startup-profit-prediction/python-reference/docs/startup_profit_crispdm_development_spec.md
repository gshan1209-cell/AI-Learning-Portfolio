# Kaggle 50 Startups Profit Prediction
# CRISP-DM 多元線性迴歸專案開發規格書

## 0. 給 AI 開發工具的任務說明

請你扮演一位資深 Python 資料科學工程師與機器學習專案開發者，根據本規格書開發一個完整的機器學習教學專案。

本專案主題為：

**使用 Kaggle 50 Startups dataset，依照 CRISP-DM 六大步驟，建立 Multiple Linear Regression 模型來預測新創公司利潤 Profit。**

請產生完整可執行專案，包含：

1. Jupyter Notebook 教學版
2. Python 模組化程式碼
3. 模型訓練流程
4. 模型評估結果
5. 模型儲存與載入
6. Streamlit 預測網頁 App
7. FastAPI 預測 API
8. README.md 專案說明文件
9. requirements.txt
10. 專案資料夾結構

專案必須適合初學者學習，程式碼需有清楚註解，Markdown 說明需白話、完整、容易理解。

---

# 1. 專案目標

## 1.1 專案名稱

Startup Profit Prediction with CRISP-DM and Multiple Linear Regression

## 1.2 專案背景

新創公司通常資源有限，管理者需要知道資金應該投入在哪些地方，才能提高公司利潤。

本專案使用 Kaggle 50 Startups dataset，根據以下特徵預測公司利潤：

- R&D Spend
- Administration
- Marketing Spend
- State

目標變數為：

- Profit

因為 Profit 是連續數值，所以本專案屬於監督式學習中的迴歸問題。

---

# 2. 使用方法論

本專案必須依照 CRISP-DM 六大步驟設計：

1. Business Understanding
2. Data Understanding
3. Data Preparation / Data Preprocessing
4. Modeling
5. Evaluation
6. Deployment

每一個步驟都需要在 Notebook 中用 Markdown 說明，並搭配 Python 程式碼實作。

---

# 3. 資料集規格

## 3.1 資料來源

資料集名稱：

```text
50_Startups.csv
```

資料來源：

```text
Kaggle 50 Startups dataset
```

## 3.2 欄位說明

| 欄位名稱 | 資料型態 | 說明 | 是否為特徵 |
|---|---|---|---|
| R&D Spend | float | 研發支出 | 是 |
| Administration | float | 行政管理支出 | 是 |
| Marketing Spend | float | 行銷支出 | 是 |
| State | object | 公司所在州別 | 是 |
| Profit | float | 公司利潤 | 目標變數 |

## 3.3 預期資料格式

CSV 檔案應放在：

```text
data/50_Startups.csv
```

讀取方式：

```python
import pandas as pd

df = pd.read_csv("data/50_Startups.csv")
```

---

# 4. 專案資料夾結構

請建立以下資料夾結構：

```text
startup-profit-prediction/
│
├── data/
│   └── 50_Startups.csv
│
├── notebooks/
│   └── 01_startup_profit_crisp_dm.ipynb
│
├── models/
│   ├── startup_profit_model.pkl
│   └── model_columns.pkl
│
├── src/
│   ├── __init__.py
│   ├── data_loader.py
│   ├── preprocessing.py
│   ├── train_model.py
│   ├── evaluate_model.py
│   └── predict.py
│
├── app/
│   ├── streamlit_app.py
│   └── fastapi_app.py
│
├── outputs/
│   ├── evaluation_metrics.csv
│   ├── actual_vs_predicted.csv
│   └── feature_coefficients.csv
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

# 5. 技術需求

## 5.1 Python 版本

建議使用：

```text
Python 3.10+
```

## 5.2 必要套件

requirements.txt 請包含：

```text
pandas
numpy
scikit-learn
matplotlib
streamlit
fastapi
uvicorn
pydantic
joblib
```

## 5.3 不使用過度複雜工具

本專案是教學型專案，請避免使用過於複雜的架構，例如：

- Docker
- MLflow
- Airflow
- Kubernetes
- Cloud deployment

除非在 README 的「延伸方向」中簡單提及。

---

# 6. Notebook 開發規格

請在 `notebooks/01_startup_profit_crisp_dm.ipynb` 中完整呈現 CRISP-DM 六大步驟。

---

## 6.1 Section 1：Business Understanding

### 內容需求

請使用 Markdown 說明：

1. 本專案的商業問題
2. 為什麼要預測 startup profit
3. 資料中的支出欄位代表什麼商業意義
4. 為什麼這是一個 Regression Problem
5. 專案成功標準

### 必須包含的商業問題

```text
How can we predict a startup company’s profit based on its spending in different business areas?
```

### 必須包含的商業目標

1. 預測新創公司的 Profit
2. 找出影響 Profit 的重要因素
3. 協助管理者做預算分配
4. 提供投資者或商業分析師參考
5. 建立可解釋的機器學習模型

---

## 6.2 Section 2：Data Understanding

### 程式需求

請完成以下觀察：

```python
df.head()
df.tail()
df.info()
df.describe()
df.isnull().sum()
df.duplicated().sum()
df["State"].value_counts()
```

### 圖表需求

請產生以下圖表：

1. R&D Spend vs Profit scatter plot
2. Marketing Spend vs Profit scatter plot
3. Administration vs Profit scatter plot
4. State vs Profit boxplot 或 bar chart
5. Correlation heatmap 或 correlation table
6. Profit distribution histogram

### 分析說明需求

請用 Markdown 解釋：

1. R&D Spend 是否看起來與 Profit 有明顯關係
2. Marketing Spend 是否與 Profit 有關
3. Administration 的影響是否較弱
4. State 是否需要 One-Hot Encoding
5. 哪些欄位可能是重要特徵

### 專家觀察表

請加入以下表格：

| 特徵 | 專家定位 | 預期重要性 | 建議 |
|---|---|---|---|
| R&D Spend | 核心成長因子 | 很高 | 一定保留 |
| Marketing Spend | 市場擴張因子 | 中高 | 保留，但注意共線性 |
| Administration | 營運成本／規模因子 | 低到中 | 先保留，後續評估 |
| State | 地區輔助因子 | 低到中 | One-Hot 後保留，謹慎解讀 |

---

## 6.3 Section 3：Data Preprocessing

### 目標

將原始資料轉換成模型可使用的格式。

### 必須完成

1. 檢查缺失值
2. 檢查重複值
3. 分離 X 與 y
4. 對 State 做 One-Hot Encoding
5. 使用 `drop_first=True`
6. 切分 train/test data
7. 儲存模型訓練時的欄位順序

### 程式範例需求

```python
X = df.drop("Profit", axis=1)
y = df["Profit"]
```

```python
X_encoded = pd.get_dummies(X, columns=["State"], drop_first=True)
```

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X_encoded,
    y,
    test_size=0.2,
    random_state=42
)
```

### 注意事項

請在 Markdown 中說明：

1. 為什麼 State 不能直接丟進模型
2. One-Hot Encoding 的意義
3. 為什麼使用 `drop_first=True`
4. 為什麼需要切分 Training Set 與 Testing Set
5. 為什麼本專案可以先不做 Feature Scaling

---

## 6.4 Section 4：Modeling

### 模型選擇

本專案主要模型為：

```text
Multiple Linear Regression
```

### 使用套件

```python
from sklearn.linear_model import LinearRegression
```

### 訓練流程

```python
model = LinearRegression()
model.fit(X_train, y_train)
```

### 預測流程

```python
y_pred = model.predict(X_test)
```

### 係數分析

請輸出模型係數：

```python
coefficients = pd.DataFrame({
    "Feature": X_encoded.columns,
    "Coefficient": model.coef_
})
```

並依照係數絕對值排序：

```python
coefficients["Abs_Coefficient"] = coefficients["Coefficient"].abs()
coefficients = coefficients.sort_values(by="Abs_Coefficient", ascending=False)
```

### Markdown 解釋

請說明：

1. Linear Regression 的基本概念
2. Multiple Linear Regression 與 Simple Linear Regression 的差異
3. 模型係數的商業意義
4. R&D Spend 係數若為正代表什麼
5. Administration 係數若較小代表什麼
6. State 的係數不應過度解讀

---

## 6.5 Section 5：Evaluation

### 必須使用的評估指標

請使用以下四個指標：

1. MAE
2. MSE
3. RMSE
4. R² Score

### 程式需求

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)
```

### 評估表格

請產生 DataFrame：

```python
evaluation_result = pd.DataFrame({
    "Metric": ["MAE", "MSE", "RMSE", "R2 Score"],
    "Value": [mae, mse, rmse, r2]
})
```

並輸出到：

```text
outputs/evaluation_metrics.csv
```

### Actual vs Predicted

請建立比較表：

```python
comparison = pd.DataFrame({
    "Actual Profit": y_test,
    "Predicted Profit": y_pred,
    "Error": y_test - y_pred
})
```

輸出到：

```text
outputs/actual_vs_predicted.csv
```

### 圖表需求

請建立：

1. Actual vs Predicted scatter plot
2. Residual plot
3. Feature coefficients bar chart

### Markdown 解釋

請解釋：

| 指標 | 意義 | 判斷方式 |
|---|---|---|
| MAE | 平均絕對誤差 | 越低越好 |
| MSE | 平均平方誤差 | 越低越好 |
| RMSE | 均方根誤差 | 越低越好 |
| R² Score | 模型解釋力 | 越接近 1 越好 |

### 商業解讀

請說明：

1. 如果 R² 高，代表支出資料能很好解釋 Profit。
2. 如果 MAE 低，代表平均預測誤差小。
3. 如果 RMSE 明顯高於 MAE，代表可能有少數預測誤差較大的資料。
4. 模型結果應作為商業決策輔助，不可完全取代人工判斷。

---

## 6.6 Section 6：Deployment

### 目標

將模型轉換成可以實際使用的形式。

本專案需要完成三種部署形式：

1. 儲存模型
2. Streamlit App
3. FastAPI API

---

# 7. 模型儲存規格

請將訓練好的模型儲存到：

```text
models/startup_profit_model.pkl
```

請將模型使用的欄位順序儲存到：

```text
models/model_columns.pkl
```

### 建議使用 joblib

```python
import joblib

joblib.dump(model, "models/startup_profit_model.pkl")
joblib.dump(list(X_encoded.columns), "models/model_columns.pkl")
```

### 載入方式

```python
model = joblib.load("models/startup_profit_model.pkl")
model_columns = joblib.load("models/model_columns.pkl")
```

---

# 8. Streamlit App 規格

請在以下路徑建立 Streamlit App：

```text
app/streamlit_app.py
```

## 8.1 App 目標

建立一個簡單網頁，讓使用者輸入新創公司的支出資料，並預測 Profit。

## 8.2 頁面標題

```text
Startup Profit Prediction App
```

## 8.3 頁面說明

請顯示：

```text
This app predicts startup profit based on R&D Spend, Administration Spend, Marketing Spend, and State.
```

## 8.4 輸入欄位

Streamlit App 必須包含以下輸入元件：

1. R&D Spend：number_input
2. Administration Spend：number_input
3. Marketing Spend：number_input
4. State：selectbox

State 選項：

```python
["New York", "California", "Florida"]
```

## 8.5 預測按鈕

按鈕文字：

```text
Predict Profit
```

## 8.6 輸出結果

按下按鈕後，顯示：

```text
Predicted Profit: $xxxx.xx
```

## 8.7 Streamlit 預測流程

1. 載入模型
2. 載入 model_columns
3. 收集使用者輸入
4. 建立 DataFrame
5. 對 State 做 One-Hot Encoding
6. 使用 `reindex(columns=model_columns, fill_value=0)` 對齊欄位
7. 使用模型預測
8. 顯示結果

## 8.8 Streamlit 執行指令

README 中需提供：

```bash
streamlit run app/streamlit_app.py
```

---

# 9. FastAPI App 規格

請在以下路徑建立 FastAPI App：

```text
app/fastapi_app.py
```

## 9.1 API 目標

建立一個 `/predict` endpoint，讓其他系統可以用 JSON 呼叫模型並取得 Profit 預測結果。

## 9.2 API 路由

### 首頁

```text
GET /
```

回傳：

```json
{
  "message": "Startup Profit Prediction API is running."
}
```

### 預測 API

```text
POST /predict
```

## 9.3 Request Body

使用 Pydantic 建立輸入資料格式：

```python
class StartupInput(BaseModel):
    rd_spend: float
    administration: float
    marketing_spend: float
    state: str
```

## 9.4 輸入範例

```json
{
  "rd_spend": 120000,
  "administration": 130000,
  "marketing_spend": 250000,
  "state": "New York"
}
```

## 9.5 輸出範例

```json
{
  "predicted_profit": 152000.75
}
```

## 9.6 錯誤處理

請加入基本錯誤處理：

1. 如果 state 不在允許範圍，回傳錯誤。
2. 如果數值小於 0，回傳錯誤。
3. 如果模型檔案不存在，提示需要先訓練模型。

允許的 state：

```python
["New York", "California", "Florida"]
```

## 9.7 FastAPI 執行指令

README 中需提供：

```bash
uvicorn app.fastapi_app:app --reload
```

Swagger 文件網址：

```text
http://127.0.0.1:8000/docs
```

---

# 10. Python 模組化程式需求

## 10.1 data_loader.py

路徑：

```text
src/data_loader.py
```

功能：

1. 讀取 CSV
2. 回傳 DataFrame
3. 檢查檔案是否存在

函式名稱：

```python
load_data(file_path: str) -> pd.DataFrame
```

---

## 10.2 preprocessing.py

路徑：

```text
src/preprocessing.py
```

功能：

1. 分離 X 與 y
2. 對 State 做 One-Hot Encoding
3. 切分 train/test
4. 回傳 X_train, X_test, y_train, y_test, feature_columns

函式名稱：

```python
preprocess_data(df: pd.DataFrame)
```

---

## 10.3 train_model.py

路徑：

```text
src/train_model.py
```

功能：

1. 建立 Linear Regression 模型
2. 訓練模型
3. 儲存模型
4. 儲存欄位順序

函式名稱：

```python
train_model(X_train, y_train)
save_model(model, feature_columns)
```

---

## 10.4 evaluate_model.py

路徑：

```text
src/evaluate_model.py
```

功能：

1. 預測測試資料
2. 計算 MAE、MSE、RMSE、R²
3. 輸出 evaluation_metrics.csv
4. 輸出 actual_vs_predicted.csv

函式名稱：

```python
evaluate_model(model, X_test, y_test)
```

---

## 10.5 predict.py

路徑：

```text
src/predict.py
```

功能：

1. 載入模型
2. 載入欄位順序
3. 接收單筆輸入
4. 做 One-Hot Encoding
5. 對齊欄位
6. 回傳 Profit 預測值

函式名稱：

```python
predict_profit(rd_spend, administration, marketing_spend, state)
```

---

# 11. Docker 容器化規格

本專案需支援 Docker 容器化，使開發與部署環境一致。

## 11.1 Dockerfile.fastapi
1. 使用 Python 3.10 基礎映像檔。
2. 安裝 requirements.txt 套件。
3. 複製專案檔案。
4. 設定啟動指令為 `uvicorn app.fastapi_app:app --host 0.0.0.0 --port 8000`。

## 11.2 Dockerfile.streamlit
1. 使用 Python 3.10 基礎映像檔。
2. 安裝 requirements.txt 套件。
3. 複製專案檔案。
4. 設定啟動指令為 `streamlit run app/streamlit_app.py --server.port 8501`。

## 11.3 docker-compose.yml
建立兩個 services:
- `api`：建置 FastAPI，對外開放 `8000` port。
- `web`：建置 Streamlit，對外開放 `8501` port。

---

# 12. Pytest 單元與整合測試規格

請在 `tests/` 資料夾下建立自動化測試，以確保程式碼邏輯與 API 端點運作正確。

## 12.1 測試套件
需使用 `pytest` 與 `httpx` (用於 FastAPI 整合測試)。

## 12.2 測試項目
1. **test_model.py**: 測試資料載入是否成功、測試 Pipeline 模型載入與基礎預測輸出格式。
2. **test_api.py**: 測試 FastAPI 的 `GET /` 與 `POST /predict`，確認 200 成功回應與 422 錯誤驗證機制。

---

# 13. README.md 規格

README.md 必須包含以下章節：

```text
# Startup Profit Prediction

## 1. Project Overview
## 2. Business Problem
## 3. Dataset Description
## 4. CRISP-DM Workflow
## 5. Project Structure
## 6. Installation
## 7. How to Run Notebook
## 8. How to Train Model
## 9. How to Run Streamlit App
## 10. How to Run FastAPI App
## 11. Model Evaluation
## 12. How to Run with Docker
## 13. How to Run Tests
## 14. Business Insights
## 15. Limitations
## 16. Future Improvements
```

## 11.1 Installation

README 需包含：

```bash
pip install -r requirements.txt
```

## 11.2 Run Notebook

```bash
jupyter notebook notebooks/01_startup_profit_crisp_dm.ipynb
```

## 11.3 Run Streamlit

```bash
streamlit run app/streamlit_app.py
```

## 11.4 Run FastAPI

```bash
uvicorn app.fastapi_app:app --reload
```

---

# 12. 商業洞察輸出需求

請在 Notebook 和 README 中整理以下商業洞察：

1. R&D Spend 通常是最重要的 Profit 預測因素。
2. Marketing Spend 可能與 Profit 有關，但需要注意是否與 R&D Spend 相關。
3. Administration 對 Profit 的影響可能較弱。
4. State 可以作為輔助變數，但不應過度解讀。
5. 模型可協助新創公司初步估算利潤與規劃預算。
6. 模型結果應作為決策輔助，而不是唯一決策依據。

---

# 13. 圖表輸出需求

Notebook 中至少需要產生以下圖表：

## 13.1 EDA 圖表

1. R&D Spend vs Profit
2. Marketing Spend vs Profit
3. Administration vs Profit
4. Profit Distribution
5. Correlation Matrix

## 13.2 模型評估圖表

1. Actual vs Predicted Plot
2. Residual Plot
3. Feature Coefficients Plot

所有圖表需包含：

1. 標題
2. X 軸名稱
3. Y 軸名稱
4. 適當大小
5. 清楚註解

---

# 14. 驗收標準

專案完成後必須符合以下條件：

## 14.1 基本驗收

1. 可以成功讀取 `data/50_Startups.csv`
2. Notebook 可以從上到下完整執行
3. 不可出現程式錯誤
4. 可以成功訓練 Linear Regression 模型
5. 可以成功產生 y_pred
6. 可以成功計算 MAE、MSE、RMSE、R²
7. 可以成功儲存模型
8. 可以成功載入模型

## 14.2 Streamlit 驗收

1. `streamlit run app/streamlit_app.py` 可以成功啟動
2. 使用者可以輸入三種支出與 State
3. 點擊 Predict Profit 後可以顯示預測結果
4. 預測結果格式為美元金額
5. 不會因 One-Hot 欄位不一致而報錯

## 14.3 FastAPI 驗收

1. `uvicorn app.fastapi_app:app --reload` 可以成功啟動
2. `/` 可以回傳 API running message
3. `/predict` 可以接收 JSON
4. `/predict` 可以回傳 predicted_profit
5. `/docs` 可以正常顯示 Swagger UI
6. 錯誤輸入會有合理錯誤訊息

## 14.4 文件驗收

1. README.md 說明完整
2. requirements.txt 可用
3. 程式碼有註解
4. Notebook 有 Markdown 教學說明
5. CRISP-DM 六步驟完整呈現

---

# 15. 模型限制說明

請在 Notebook 與 README 中說明：

1. 資料只有 50 筆，樣本數較少。
2. 特徵欄位有限，沒有包含產業類別、員工人數、市場規模、競爭程度等因素。
3. Linear Regression 假設特徵與 Profit 之間是線性關係。
4. State 的影響可能受到樣本分布影響，不應過度解讀。
5. 模型適合作為教學與初步分析，不適合直接用於高風險商業決策。

---

# 16. 未來改善方向

請在 README 最後加入 Future Improvements：

1. 增加更多 startup 資料。
2. 加入更多特徵，例如產業類別、員工數、成立年限、市場規模。
3. 嘗試 Ridge Regression。
4. 嘗試 Lasso Regression。
5. 嘗試 Random Forest Regression。
6. 嘗試 XGBoost Regression。
7. 使用 Cross Validation。
8. 建立完整 preprocessing pipeline。
9. 加入模型版本管理。
10. 部署到雲端平台。

---

# 17. 輸出成果清單

請完成以下檔案：

```text
data/50_Startups.csv
notebooks/01_startup_profit_crisp_dm.ipynb
models/startup_profit_model.pkl
models/model_columns.pkl
src/data_loader.py
src/preprocessing.py
src/train_model.py
src/evaluate_model.py
src/predict.py
app/streamlit_app.py
app/fastapi_app.py
outputs/evaluation_metrics.csv
outputs/actual_vs_predicted.csv
outputs/feature_coefficients.csv
requirements.txt
README.md
.gitignore
```

---

# 18. 開發風格要求

請遵守以下風格：

1. 程式碼清楚、簡潔、容易閱讀。
2. 每個 Python 檔案都要有必要註解。
3. 函式命名要直覺。
4. 初學者可以理解。
5. 不要寫過度複雜的工程架構。
6. Notebook 的 Markdown 說明要詳細。
7. 圖表要清楚。
8. README 要能讓使用者照著步驟執行專案。

---

# 19. 最終目標

完成後，這個專案應該可以作為一份完整的機器學習作業與作品集專案。

使用者可以透過 Notebook 學習：

1. CRISP-DM 流程
2. 資料理解
3. 資料前處理
4. One-Hot Encoding
5. Multiple Linear Regression
6. 模型評估
7. 模型部署

同時也可以透過 Streamlit 與 FastAPI 實際體驗模型部署流程。

請根據以上規格直接產生完整專案程式碼與文件。
