# ML Top 10 Module｜機器學習十大演算法移植模組

## 中文摘要

- 本模組接管原 `gshan1209-cell/machinelearningHw05` 的 Next.js 教學網站與 FastAPI Gemini 助教。
- 來源核心教材已拆為 10 個中央 JSON chunk，共 10 個主題、30 題測驗與 30 組解析。
- 中央平台已提供目錄、搜尋、詳細頁、收藏、測驗、進度、API、十種 Native 視覺化與受治理 AI 助教。
- 正式教材與非 AI 學習流程已不需要舊 FastAPI 或舊 Vercel。
- AI 程式已改由中央 Gateway 接管，但 Live Provider、PostgreSQL Ledger 與全體 Runtime 尚未驗收。
- 目前狀態為 `refactoring`，尚不可退役來源 Repo。

## 來源

```text
Repository: gshan1209-cell/machinelearningHw05
Branch: main
Source commit: 9567a798c0f7de0065a1834f6af8500708e902a1
Legacy deployment: https://machinelearning-hw05.vercel.app/
```

## 已接管功能

- 十大演算法卡片與詳細教材
- 搜尋、分類與難度篩選
- 每個主題三題測驗與解析
- localStorage 學習進度與收藏
- 列表與詳細 API
- 十種 React／SVG Native 視覺化
- 線性回歸、SVM 與進階 Native Demo 勾稽
- 中央 AI Tutor UI
- `/api/ai/ml-tutor` Gateway
- Prompt Registry 與 Prompt Version
- Structured JSON Response Schema
- Token Usage 與可設定費率的成本估算
- 未設定 Secret／Provider 錯誤時教材 fallback
- 匿名雜湊 Rate Limit 與 Request Body 上限
- AI Prompt／Rate／Usage Prisma Schema 預留

## 正式平台檔案

```text
prompt_registry/prompts.json
src/types/ml-algorithm.ts
src/types/ai.ts
src/lib/ml-algorithms.ts
src/lib/prompt-registry.ts
src/lib/ai-gateway.ts
src/lib/ai-usage-ledger.ts
src/lib/rate-limit.ts
src/app/ml-algorithms/page.tsx
src/app/ml-algorithms/[slug]/page.tsx
src/app/api/ml-algorithms/route.ts
src/app/api/ml-algorithms/[slug]/route.ts
src/app/api/ai/ml-tutor/route.ts
src/components/ml-algorithm-card.tsx
src/components/ml-algorithm-quiz.tsx
src/components/ml-algorithm-visual.tsx
src/components/ml-favorite-button.tsx
src/components/ml-learning-progress.tsx
src/components/ml-ai-tutor.tsx
```

## Prompt 版本

| Version | 狀態 | 說明 |
|---|---|---|
| `1.0.0` | inactive | 初始繁體中文白話助教 |
| `1.1.0` | active | 新增 Prompt Injection、角色改寫、秘密揭露與外部動作拒絕規則 |

舊版本保留在 Registry，沒有被直接覆寫。

## AI 安全與成本規則

- 不接收 `user_id`。
- 不保存完整提問、回答或原始 IP。
- 單次訊息最多 1,000 字。
- 最多傳入最近 6 則對話，每則最多 800 字。
- Request Body 上限 16 KB。
- 預設每匿名來源 10 分鐘最多 10 次請求。
- Gemini Secret 只允許存在 Server Runtime。
- 回覆先要求 JSON Schema，再由程式驗證必要欄位。
- Token 由 Provider Usage Metadata 勾稽。
- 費率必須由營運者依實際合約設定；未設定時成本為 `null`，不猜價格。
- 本機可寫 JSONL；正式環境必須寫 PostgreSQL。

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

這些元件接管來源網站的教學互動，不宣稱取代完整科學計算套件。

## 數學校訂

SVM 來源教材用 3D 映射解釋 Kernel Trick。中央版保留幾何直覺，但補充：RBF Kernel 可對應更高甚至無限維特徵空間，3D 僅是簡化示意，不是完整顯式映射。

## 待處理

- 使用測試 Secret 驗證 Gemini Live／Structured Output／Token Metadata
- 執行 Prisma Migration
- 正式 Usage Ledger 寫入 PostgreSQL
- Prompt 管理後台與 Token／成本儀表板
- 多實例 Redis／資料庫型 Rate Limiter
- SQLite／SQLAlchemy 與來源 OpenAI 相依盤點
- Build／TypeScript／瀏覽器／RWD／localStorage 驗收
- 舊 Vercel／FastAPI 導向或停止
- 舊 Repo 搬遷公告與人工退役核准

## 退役條件

1. 教材、測驗、前端流程與視覺化完整接管。**已完成，待 Runtime 驗收**
2. AI 助教程式完成中央治理接管。**已完成，待 Live／Fallback 驗收**
3. 正式 Token／Cost Ledger 可保存與查詢。
4. 舊 FastAPI 與 Vercel 部署不再是正式依賴。
5. 完成最低必要 Runtime 驗收。
6. 舊 Repo README 加入搬遷公告。
7. 使用者核准後 Archived／唯讀。
