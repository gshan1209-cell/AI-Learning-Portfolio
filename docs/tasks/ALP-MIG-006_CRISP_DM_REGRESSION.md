# ALP-MIG-006｜CRISP-DM 迴歸學習系統移植

## 任務目標

將 `gshan1209-cell/machinelearningHw6` 的 CRISP-DM 教材、台積電歷史股價迴歸案例、新創利潤案例參考程式、Streamlit／FastAPI 與模型產製流程移入 AI-Learning-Portfolio。

本任務重點是建立「從商業理解到部署」的完整迴歸教學流程；Startup 50 的完整 Native 預測器由 ALP-MIG-007 負責。

## 目前狀態

**`planned`**

Codex 完成來源 Inventory 並開始移入檔案後改為 `importing`；完成 Native 基礎後改為 `refactoring`。

## 來源盤點要求

至少盤點並保存：

- `README.md`
- `CRISP-DM_Regression_Development_Spec.md`
- `DEVELOPMENT_LOG.md`
- `requirements.txt`
- `app/streamlit_app.py`
- `app/fastapi_app.py`
- `src/`
- `notebooks/`
- 模型建立、壓縮、載入與部署程式
- 可合法保存的資料與產製腳本

建立：

```text
modules/crisp-dm-regression/
├── README.md
├── migration.json
├── python-reference/
├── data/
├── artifacts/
└── docs/
```

## Native 功能

建立 `/regression-lab/crisp-dm`，至少包含：

1. CRISP-DM 六階段互動時間軸。
2. 商業問題、資料理解、前處理、建模、評估與部署的逐步教學。
3. 版本化股價 snapshot，不依賴 yfinance 才能開啟頁面。
4. 移動平均、Lag、Return 等特徵工程解說。
5. 線性迴歸與 Random Forest 教學比較。
6. Train／Test 指標比較與 Overfitting／Underfitting 解讀。
7. 實際值與預測值折線圖。
8. 模型 artifact、版本、seed 與資料來源說明。
9. 至少 3 題測驗與解析。

## 技術規則

- 預設 Dataset 必須可重現。
- 時間序列切分不得使用隨機打散。
- 避免 Data Leakage，移動平均與 Lag 必須只使用當時可取得的歷史資料。
- Native 線性迴歸與指標使用 Regression Lab 共用函式。
- Random Forest 可使用預先產生結果作模型比較，但不得假裝為即時重新訓練。
- 外部即時股價刷新只能是選用 server-side script。
- 不得把 yfinance 或舊 FastAPI 當作正式頁面的必要 Runtime。

## API

若新增股價資料 API，需使用固定 dataset ID 白名單，不接受任意 ticker、檔案路徑或 URL。

## 免責與倫理

頁面固定顯示：

- 本內容僅供機器學習教學。
- 歷史模型不代表未來表現。
- 不構成投資建議、買賣訊號或報酬保證。

## 驗收

- [ ] 原始必要程式與文件已移入
- [ ] `migration.json` 含來源 commit 與檔案清單
- [ ] Native 頁面可在無網路、無 Secret 下使用
- [ ] 時間序列切分與特徵工程無明顯 Leakage
- [ ] OLS／MAE／MSE／RMSE／R² 測試通過
- [ ] 三題以上測驗與解析
- [ ] Lint／TypeScript／Test／Build 通過
- [ ] 維持 `refactoring`，不得提前退役