# CRISP-DM Regression Learning System - Development Log

## 目的
本紀錄檔旨在記錄 `CRISP-DM Regression Learning System` 的開發歷程、架構決策與未完成事項，以利後續接手的 Agent 能夠快速理解專案現況並繼續開發。

## 專案架構概覽
```txt
crispdm-regression-project/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
├── src/
│   ├── data_loader.py
│   ├── preprocessing.py
│   ├── model.py
│   ├── evaluation.py
│   └── deployment.py
├── models/
├── app/
├── requirements.txt
└── README.md
```

## 開發日誌

### 2026-06-09: MVP 第一階段啟動
- **狀態**: `Phase 1 Completed`
- **已完成事項**:
  - 確認開發規格與 MVP 範圍。
  - 建立 `DEVELOPMENT_LOG.md`。
  - 建立基礎目錄結構。
  - 遷移 `50_Startups.csv` 到 `data/raw/`。
  - 建立 `requirements.txt`。
  - 實作 `src/` 底下的核心模組 (`data_loader.py`, `preprocessing.py`, `model.py`, `evaluation.py`, `deployment.py`)。
  - 建立 `test_pipeline.py` 驗證腳本。
  - 成功完成套件安裝與 `test_pipeline.py` 測試。
### 2026-06-09: MVP 第二階段完成
- **狀態**: `Phase 2 Completed`
- **已完成事項**:
  - 實作 Case 1 (2330.TW) 與 Case 2 (Startup 50) 的完整 Notebook 教學，使用 nbformat 生成 `01_stock_price_regression.ipynb` 及 `02_startup_50_regression.ipynb`。
  - 成功訓練並壓縮匯出模型 (`stock_model.pkl.gz`, `startup_model.pkl.gz`)。
  - 實作 FastAPI 服務 (`app/fastapi_app.py`) 提供預測 API 端點。
  - 實作 Streamlit App (`app/streamlit_app.py`) 建立互動式教學介面。
### 2026-06-09: 增加全域皮膚切換功能
- **狀態**: `Completed`
- **已完成事項**:
  - 在 `app/streamlit_app.py` 中加入了全域外觀主題切換功能 (Dark、Light、Pink)。
  - 透過動態注入 CSS 與調整 Matplotlib `plt.style` 來達成即時的 UI 皮膚與圖表樣式切換。

- **待辦事項 (後續可進行進階優化)**:
  - 加入更多演算法如 Ridge / Lasso 的比較。
  - 自動化測試案例整合。
