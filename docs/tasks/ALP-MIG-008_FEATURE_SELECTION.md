# ALP-MIG-008｜Boston Housing 特徵選擇移植

## 任務目標

將 `gshan1209-cell/hw07` 的 Boston Housing 資料、九種特徵選擇方法、k 值模型比較、圖表生成程式與倫理聲明移入 AI-Learning-Portfolio，建立 Native 特徵選擇實驗室。

## 目前狀態

**`planned`**

完成 Inventory 並開始移入來源檔案後更新為 `importing`；Native 頁面與基準結果完成後更新為 `refactoring`。

## 來源盤點要求

至少盤點並保存：

- `README.md`
- `requirements.txt`
- `data/boston_housing.csv`
- `src/data_loader.py`
- `src/preprocessing.py`
- `src/feature_selection.py`
- `src/model_evaluation.py`
- `src/visualization.py`
- `scripts/generate_feature_selection_chart.py`
- `reports/figures/feature_selection_performance_allinone.png`
- 產生結果、參數與文件

建立：

```text
modules/feature-selection/
├── README.md
├── migration.json
├── python-reference/
├── data/
├── artifacts/
└── docs/
```

## 九種方法

必須保留與解說：

1. Pearson Correlation
2. Spearman Correlation
3. F-test Regression
4. Mutual Information
5. Recursive Feature Elimination
6. Sequential Forward Selection
7. Sequential Backward Selection
8. Lasso L1
9. Random Forest Feature Importance

不得將不同方法的結果合併成單一排名而失去原始比較意義。

## Native 功能

建立 `/regression-lab/feature-selection`，至少包含：

1. 特徵選擇目的與 Filter／Wrapper／Embedded 分類。
2. 九種方法切換與方法說明。
3. k=1～13 的結果比較。
4. Test R² 與 Test MSE 圖表。
5. 所選特徵排名與交集比較。
6. Sweet Spot 解釋，不宣稱單一 k 永遠最佳。
7. 預設倫理模式與歷史重現模式。
8. 至少 3 題測驗與解析。

## 結果產製策略

- Python 使用固定 seed 產生完整基準結果 JSON。
- Artifact 必須包含 dataset hash、scikit-learn 版本、切分參數、模型參數、方法參數與產製時間。
- Native UI 使用版本化結果 JSON，無 Python Runtime 也能操作。
- 至少實作 Pearson 或 F-test 的 TypeScript 即時計算，作為教學對照。
- 即時計算結果與 Python golden result 必須有測試。

## Boston Housing 倫理模式

### 預設模式

- 排除 `B` 欄位。
- 顯示 `LSTAT` 為社經代理變數的警告。
- 顯示資料年代、用途與限制。
- 產生排除爭議欄位後的基準結果。

### 歷史重現模式

如保留完整原始欄位：

- 必須由使用者主動 opt-in。
- 進入前顯示明確警告。
- 不保存 opt-in 為預設狀態。
- 畫面固定標示僅供歷史演算法重現。

### 禁止用途

不得宣稱或暗示可用於真實：

- 房貸核准
- 保險定價
- 租屋篩選
- 房地產投資決策
- 人群或社區風險評分

## API

建立：

`GET /api/ml-lab/feature-selection/results`

允許參數：

- `method`：九種方法白名單
- `mode`：`ethical` 或 `historical`
- `k`：1～13

不得接受任意檔案、Python 程式、URL 或欄位運算式。

## 驗收

- [ ] 原始必要程式、資料、圖表與文件已移入
- [ ] `migration.json` 完整
- [ ] 九種方法與 k=1～13 結果完整
- [ ] Ethical／Historical 模式分離
- [ ] 預設排除 `B`
- [ ] TypeScript 即時計算與 Python golden result 對照通過
- [ ] API 白名單與邊界測試通過
- [ ] 圖表、表格與 RWD 驗收通過
- [ ] 三題以上測驗與解析
- [ ] Lint／TypeScript／Test／Build 通過
- [ ] 維持 `refactoring`，不得提前退役