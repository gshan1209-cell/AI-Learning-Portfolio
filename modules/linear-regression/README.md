# Linear Regression Module｜線性迴歸移植模組

## 中文摘要

- 本模組接管原 `gshan1209-cell/L4` 的程式、教學內容與 Demo 功能。
- `python-streamlit/` 保存原始 Python／Streamlit 版本，作為功能基準與可回溯來源。
- 網站正式版本由 `src/components/native-demos/linear-regression-playground.tsx` 提供。
- 主要功能已完成重構，目前等待執行驗收；舊 L4 Repository 尚未達退役標準。

## 來源

```text
Repository: gshan1209-cell/L4
Branch: main
Main Entry: app.py
Source App SHA: 891a64363b6f2d99d87287ba2d1cebb794d797d7
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

## 新平台功能對照

| 功能 | 新平台位置 | 狀態 |
|---|---|---|
| 可重現隨機資料 | Native Playground | 已完成 |
| OLS 自動擬合 | Native Playground | 已完成 |
| 真實／估計斜率截距 | Native Playground | 已完成 |
| Variance、MAE、MSE | Native Playground | 已完成 |
| Residual／Abs residual | Native Playground | 已完成 |
| Top K Outliers | Native Playground | 已完成 |
| 圖上離群值排名 | Native Playground | 已完成 |
| 離群值資料表 | Native Playground | 已完成 |
| 手動斜率／截距模式 | Native Playground | 已完成 |
| Streamlit 原始版 | `python-streamlit/app.py` | 已移入，未執行驗證 |
| CSV 下載 | 尚未納入 | 待確認是否需要 |
| PNG 匯出 | 尚未納入 | 待確認是否需要 |

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

## 目前移植狀態

```text
refactoring
```

尚未進入 `verifying`，因為本階段依專案決策尚未執行 Next.js build、瀏覽器操作與 Python runtime 驗證。

## 退役條件

舊 `L4` Repository 只有在以下條件全部完成後才能封存：

1. 原始程式與相依文件已由本模組接管。
2. Native Playground 主要功能完成。
3. 舊新功能差異已記錄。
4. 完成最低必要執行驗收。
5. CSV／PNG 缺口已決定接受或補做。
6. 舊 Repo README 加上搬遷公告。
7. 舊 Streamlit 部署停止或改為搬遷說明。
8. 使用者人工核准。
9. 舊 Repo 設為 Archived／唯讀。
