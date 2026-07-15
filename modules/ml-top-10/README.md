# ML Top 10 Module｜機器學習十大演算法移植模組

## 中文摘要

- 本模組接管原 `gshan1209-cell/machinelearningHw05` 的 Next.js 教學網站與 FastAPI Gemini 助教。
- 來源核心教材已拆為 10 個中央 JSON chunk，共 10 個主題、30 題測驗與 30 組解析。
- 中央平台已提供主題目錄、搜尋、篩選、詳細頁、收藏、測驗、進度、API 與十種 Native 視覺化。
- 正式教材與非 AI 學習流程已不需要舊 FastAPI 或舊 Vercel。
- 目前狀態為 `refactoring`；AI Gateway、Runtime 驗收與舊系統退役尚未完成。

## 來源

```text
Repository: gshan1209-cell/machinelearningHw05
Branch: main
Source commit: 9567a798c0f7de0065a1834f6af8500708e902a1
Legacy deployment: https://machinelearning-hw05.vercel.app/
```

## 新專案結構

```text
modules/ml-top-10/
├─ README.md
├─ migration.json
├─ data/algorithms/
│  ├─ linear-regression.json
│  ├─ logistic-regression.json
│  ├─ decision-tree.json
│  ├─ random-forest.json
│  ├─ svm.json
│  ├─ knn.json
│  ├─ kmeans.json
│  ├─ naive-bayes.json
│  ├─ pca.json
│  └─ gradient-descent.json
├─ python-fastapi-reference/
└─ nextjs-reference/
```

正式平台檔案：

```text
src/types/ml-algorithm.ts
src/lib/ml-algorithms.ts
src/app/ml-algorithms/page.tsx
src/app/ml-algorithms/[slug]/page.tsx
src/app/api/ml-algorithms/route.ts
src/app/api/ml-algorithms/[slug]/route.ts
src/components/ml-algorithm-card.tsx
src/components/ml-algorithm-quiz.tsx
src/components/ml-algorithm-visual.tsx
src/components/ml-favorite-button.tsx
src/components/ml-learning-progress.tsx
```

## 已接管功能

- 十大演算法卡片
- 白話解釋與生活比喻
- 搜尋、分類與難度篩選
- 十個演算法詳細頁
- 每個主題三題測驗
- 作答解析與通過門檻
- localStorage 學習進度與收藏
- 列表與詳細 API
- 十種 React／SVG Native 視覺化
- 線性回歸、SVM 與既有 Native Demo 交叉連結
- AI 未啟用時教材仍可獨立運作

## Native 視覺化

| visual_type | 站內互動內容 |
|---|---|
| `scatter-line` | 調整線性趨勢線 |
| `logistic-curve` | 移動分類門檻 |
| `decision-tree` | 調整樹深度 |
| `random-forest` | 樹數量與多數決 |
| `svm-margin` | 分隔線與 Margin |
| `knn-neighbors` | K 值與鄰居範圍 |
| `kmeans-clustering` | 群數與中心點 |
| `naive-bayes-text` | 詞彙線索與示意機率 |
| `pca-projection` | 投影方向 |
| `gradient-descent` | 學習率與收斂路徑 |

這些元件用來接管來源網站的教學互動，不宣稱取代完整科學計算套件；精確模型實驗仍可連到已移植的進階課程模組。

## 資料設計

大型 `algorithms.json` 已拆為每演算法獨立檔案：

1. 單一教材可獨立修改與審查。
2. 測驗答案不會因大型檔案合併衝突而錯位。
3. 可逐主題加入 Prompt、視覺化與版本欄位。
4. 新平台不需在 Runtime 呼叫舊 Repo。

## AI 移植原則

來源 `chat.py` 只作為可追溯參考，不直接成為正式平台 AI Runtime。

正式版本必須：

1. 改走中央 AI Gateway。
2. Prompt 寫入 Prompt Registry 並有版本號。
3. API Key 只放部署 Secret。
4. 記錄模型、Token 與成本。
5. 限制 history 長度與輸入大小。
6. AI 回覆失敗時保留非 AI 教材與固定 FAQ。
7. 不記錄不必要的 `user_id` 或對話個資。

## 數學校訂

SVM 來源教材用 3D 映射解釋 Kernel Trick。中央版保留幾何直覺，但補充：RBF Kernel 可對應更高甚至無限維特徵空間，3D 僅是簡化示意，不是完整顯式映射。

## 待處理

- AI Tutor UI
- 中央 AI Gateway
- Prompt Registry／Token Cost Ledger
- SQLite／SQLAlchemy 實際用途確認
- Build／TypeScript／瀏覽器與 RWD 驗收
- 舊 Vercel／FastAPI 導向或停止
- 舊 Repo 搬遷公告與人工退役核准

## 退役條件

1. 十大演算法教材與測驗完整進入中央資料層。**已完成**
2. 首頁、搜尋、詳細頁、收藏與進度完成接管。**已完成，待 Runtime 驗收**
3. 必要視覺化完成接管。**已完成，待 Runtime 驗收**
4. AI 助教改走中央 AI Gateway 或明確取消。
5. 舊 FastAPI 與 Vercel 部署不再是正式依賴。
6. 完成最低必要 Runtime 驗收。
7. 舊 Repo README 加入搬遷公告。
8. 使用者核准後 Archived／唯讀。
