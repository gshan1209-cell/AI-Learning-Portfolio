# ML Top 10 Module｜機器學習十大演算法移植模組

## 中文摘要

- 本模組接管原 `gshan1209-cell/machinelearningHw05` 的 Next.js 教學網站與 FastAPI AI 助教。
- 來源實際架構為 Next.js 15 + FastAPI + Gemini + JSON 教材，不只是單純 Next.js。
- FastAPI 入口、演算法路由、Gemini 助教與主要前端資料流已先移入來源參考區。
- 來源參考區不加入中央平台編譯，避免未移完的元件與樣式破壞現有 Next.js 14。
- 目前狀態為 `importing`；完整教材、詳細頁、測驗、收藏、視覺化與 AI Gateway 尚待接管。

## 來源

```text
Repository: gshan1209-cell/machinelearningHw05
Branch: main
Source commit: 9567a798c0f7de0065a1834f6af8500708e902a1
Legacy deployment: https://machinelearning-hw05.vercel.app/
```

## 已移入

```text
modules/ml-top-10/
├─ README.md
├─ migration.json
├─ python-fastapi-reference/
│  ├─ requirements.txt
│  ├─ main.py
│  ├─ algorithms.py
│  └─ chat.py
└─ nextjs-reference/
   ├─ package.json
   ├─ app/page.tsx
   ├─ lib/types.ts
   ├─ lib/algorithms.ts
   └─ components/
      ├─ AlgorithmGrid.tsx
      ├─ AlgorithmCard.tsx
      └─ ProgressBar.tsx
```

## 來源功能

- 十大演算法卡片
- 白話解釋與生活比喻
- 搜尋、分類與難度篩選
- 演算法詳細頁
- 每個主題測驗
- localStorage 學習進度
- 收藏
- 動態視覺化
- Gemini AI 助教
- 未設定金鑰時的 fallback 回覆

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

## 版本相容性

來源前端使用 Next.js 15.5，中央平台目前是 Next.js 14。不能直接複製到 `src/app` 後宣稱完成，必須逐元件確認：

- App Router API 相容性
- React 18 相容性
- CSS Variables 與全域樣式
- localStorage Hydration
- Link／Router 路徑
- 舊 `/algorithms/*` 路由如何映射至中央課程架構

## 待處理

- 完整移入 `frontend/data/algorithms.json` 與 `backend/data/algorithms.json`
- 確認兩份教材是否相同並去重
- 收藏元件與儲存格式
- 演算法詳細頁
- Quiz 元件與答題紀錄
- 其餘視覺化元件
- AI 助教 UI
- 中央 Course Registry／API 轉換
- Prompt Registry／Token Cost Ledger
- SQLite／SQLAlchemy 是否仍有實際用途
- 來源 `.env`、資料庫與敏感檔掃描
- Runtime／Build／瀏覽器驗收

## 退役條件

1. 十大演算法教材與測驗完整進入中央資料層。
2. 首頁、搜尋、詳細頁、收藏與進度完成接管。
3. 必要視覺化完成接管。
4. AI 助教改走中央 AI Gateway 或明確取消。
5. 舊 FastAPI 與 Vercel 部署不再是正式依賴。
6. 完成最低必要 Runtime 驗收。
7. 舊 Repo README 加入搬遷公告。
8. 使用者核准後 Archived／唯讀。
