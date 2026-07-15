# Linear Regression Module｜線性迴歸移植模組

## 中文摘要

- 本模組接管原 `gshan1209-cell/L4` 的程式、教學內容與 Demo 功能。
- `python-streamlit/` 保存原始 Python／Streamlit 版本，作為功能基準與可回溯來源。
- 網站正式版本由 `src/components/native-demos/linear-regression-playground.tsx` 提供。
- 目前仍在移植中，舊 L4 Repository 尚未達退役標準。

## 來源

```text
Repository: gshan1209-cell/L4
Branch: main
Main Entry: app.py
```

## 已移入內容

```text
modules/linear-regression/
├─ README.md
├─ migration.json
└─ python-streamlit/
   ├─ app.py
   └─ requirements.txt
```

## 原始功能

- 隨機產生線性資料
- 隨機產生真實斜率、截距與雜訊變異數
- 使用 scikit-learn 訓練 LinearRegression
- 計算預測值、殘差與絕對殘差
- 排序並標示 Top K Outliers
- 使用 Matplotlib 繪圖
- 使用 Streamlit 控制參數與顯示指標

## 新平台目標

| 功能 | 新平台位置 | 狀態 |
|---|---|---|
| 線性資料視覺化 | `src/components/native-demos/linear-regression-playground.tsx` | 部分完成 |
| 斜率／截距控制 | Native Playground | 已完成 |
| 殘差計算 | Native Playground | 已完成 |
| 隨機資料生成 | Native Playground | 待補 |
| OLS 自動擬合 | Native Playground | 待補 |
| Top K Outliers | Native Playground | 待補 |
| Streamlit 原始版 | `python-streamlit/app.py` | 已移入，未執行驗證 |

## Python 原始版啟動方式

```bash
cd modules/linear-regression/python-streamlit
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
streamlit run app.py
```

啟動後開啟：

```text
http://localhost:8501
```

## 退役條件

舊 `L4` Repository 只有在以下條件全部完成後才能封存：

1. 原始程式與相依文件已由本模組接管。
2. Native Playground 完成隨機資料、OLS 擬合與 Top K Outliers。
3. 舊新功能差異已記錄。
4. 完成最低必要執行驗收。
5. 舊 Repo README 加上搬遷公告。
6. 舊 Streamlit 部署停止或改為搬遷說明。
7. 舊 Repo 設為 Archived／唯讀。
