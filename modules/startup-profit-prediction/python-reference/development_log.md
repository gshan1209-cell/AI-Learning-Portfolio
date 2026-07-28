# Startup Profit Prediction - 專案開發日誌 (Development Log)

> **⚠️ 重要提示：開發前必讀**
> 
> 本專案的完整開發規格書路徑為：`d:\SeanLin\L6-2\startup_profit_crispdm_development_spec.md`
> 所有開發者在進行任何修改或接手開發前，**務必優先詳細研讀該規格書**，以確保開發方向與專案規範一致。

## 專案狀態摘要
- **最後更新時間**: 2026-06-11
- **目前階段**: 基礎 CRISP-DM 流程建立完成，已升級為 Pipeline 與 Random Forest 模型訓練與部署 (FastAPI + Streamlit)。
- **給接手 Agent 的話**: 本專案已經具備完整的基本骨架，後續開發可專注於「模型優化 (如更換演算法)」、「工程架構升級 (如 Docker 化、建立 Pipeline)」或「自動化測試與 MLOps」。

## 已完成任務 (Completed)
1. **資料集建立**: 匯入 `50_Startups.csv` 測試資料集。
2. **探索與訓練流程 (Notebook)**: 完成 `01_startup_profit_crisp_dm.ipynb`，涵蓋資料探索 (EDA)、One-Hot Encoding、模型訓練、評估與圖表產出。
3. **模組化程式碼 (src)**:
   - `data_loader.py`: 處理資料載入。
   - `preprocessing.py`: 處理特徵切分 (One-Hot 交由 Pipeline)。
   - `train_model.py`: 建立與訓練 RandomForest Pipeline 模型，並使用 `joblib` 儲存。
   - `evaluate_model.py`: 計算 MAE, MSE, RMSE, R²。
   - `predict.py`: 提供模型預測介面 (直接傳遞原始 DataFrame 供 Pipeline 使用)。
4. **應用程式部署 (app)**:
   - `streamlit_app.py`: 建立互動式前端預測介面。
   - `fastapi_app.py`: 建立 RESTful API，提供 `/predict` 端點。
5. **專案設定與文件**: 完成 `requirements.txt`, `.gitignore` 與 `README.md`，並撰寫完整的專案開發規格書。

## 目前系統架構與技術棧
- **語言**: Python 3.10+
- **資料處理**: Pandas, NumPy
- **機器學習**: Scikit-learn (RandomForestRegressor, Pipeline, ColumnTransformer)
- **網頁框架**: Streamlit
- **API 框架**: FastAPI, Uvicorn
- **模型儲存**: joblib (儲存於 `models/startup_profit_model.pkl`)

## 待辦事項與未來規劃 (Next Action Items)
後續的 Agent 可以從以下方向挑選任務延續開發：

### 1. 模型優化 (Model Improvement)
- [x] 將 Linear Regression 升級為 `RandomForestRegressor` 或 `XGBoost`，以捕捉非線性關係並嘗試提高 R² Score。
- [x] 導入 `sklearn.pipeline.Pipeline` 與 `ColumnTransformer`，取代目前手動的 DataFrame 操作與 `get_dummies`。
- [ ] 實作交叉驗證 (Cross-Validation) 與超參數調整 (GridSearchCV / Optuna)。

### 2. 軟體工程與架構升級 (Engineering & Architecture)
- [x] 撰寫 `Dockerfile` 與 `docker-compose.yml`，將 FastAPI 與 Streamlit 容器化，方便一鍵啟動。
- [x] 加入單元測試 (Unit Tests)，例如使用 `pytest` 測試 `src/` 下的函式與 FastAPI 端點。
- [ ] 導入代碼檢查與格式化工具 (如 `flake8`, `black`, `isort`)。

### 3. MLOps 導入 (MLOps Integration)
- [ ] 導入 MLflow 進行實驗追蹤與模型版本控制。
- [ ] 建立基本的 CI/CD Workflow (如 GitHub Actions)。

## 已知問題與技術債 (Known Issues & Tech Debt)
- **特徵編碼設計**: (已解決) 目前已導入 `sklearn.pipeline.Pipeline` 結合 `OneHotEncoder(handle_unknown='ignore')`，不再依賴 pandas 的 `get_dummies`。
- **資料限制**: 訓練資料樣本數極少 (僅 50 筆)，模型極易受到極端值 (Outliers) 影響。
- **防呆處理**: API 與網頁輸入防呆還可以做得更詳細 (例如加入各項支出的合理上限檢查)。

---