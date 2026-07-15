# ALP-MIG-005｜機器學習十大演算法完整移植

## 任務目標

將 `gshan1209-cell/machinelearningHw05` 的十大演算法教材、測驗、搜尋、收藏、學習進度、互動視覺化與 AI 助教移植進 AI-Learning-Portfolio，完成驗收後退役舊 Next.js／FastAPI 部署與來源 Repo。

## 目前狀態

**`refactoring`**

核心教材、主要前端流程、十種視覺化與中央 AI 助教程式已接管；尚未達 `ready_to_retire`。

## 已完成

### 來源接管

- [x] README 與前後端架構盤點
- [x] 保存主要來源 blob SHA
- [x] FastAPI requirements、main、algorithms、chat 移入來源參考區
- [x] Next.js 主要頁面、元件、型別與資料流程移入來源參考區

### 教材資料

- [x] 將來源 703 行教材拆成 10 個中央 JSON chunk
- [x] 完整接管 10 個演算法主題
- [x] 完整接管 30 題測驗與 30 組解析
- [x] 建立正式資料型別與中央 Loader
- [x] 建立搜尋、分類、難度與統計
- [x] SVM 教材加入 Kernel Trick 數學校訂

### Native 前端與 API

- [x] `/ml-algorithms` 主題目錄
- [x] `/ml-algorithms/[slug]` 十個詳細頁
- [x] 搜尋、分類與難度篩選
- [x] 收藏、三題 Quiz、解析、通過門檻與進度
- [x] 十種 React／SVG Native 視覺化
- [x] `GET /api/ml-algorithms`
- [x] `GET /api/ml-algorithms/[slug]`
- [x] 導覽列與移植中心入口
- [x] 線性回歸／SVM 與進階 Native 課程勾稽

### AI Gateway 與 Prompt 治理

- [x] AI Tutor UI 接入十個詳細頁
- [x] `POST /api/ai/ml-tutor`
- [x] 未設定 Secret 時教材 fallback
- [x] Provider 錯誤／Timeout／格式錯誤 fallback
- [x] Prompt Registry 正式來源
- [x] Prompt v1.0.0 歷史版保留
- [x] Prompt v1.1.0 啟用並加入 Prompt Injection 防護
- [x] Gemini Structured JSON 回應 Schema
- [x] 伺服器端回應欄位再次驗證
- [x] 最多 1,000 字問題、6 則歷史、每則 800 字
- [x] 不接收 `user_id`，不保存完整對話內容
- [x] 匿名雜湊 Rate Limit
- [x] 16 KB Request Body 上限
- [x] Token Usage 合約與 `usageMetadata` 對應
- [x] 可設定費率的成本估算
- [x] 本機 JSONL Ledger／正式 PostgreSQL Schema 預留
- [x] Prisma 預留 `ai_prompts`、`ai_prompt_versions`、`ai_model_rates`、`ai_usage_logs`
- [x] AI Gateway 架構文件

## 待完成

### AI 驗收與管理

- [ ] 使用測試 Secret 驗證 Live Gemini 回覆
- [ ] 驗證 JSON Schema、Token Metadata 與供應商錯誤處理
- [ ] 執行 Prisma Migration
- [ ] 將正式 Usage Ledger 改寫入 PostgreSQL
- [ ] Prompt 管理後台
- [ ] Token／成本儀表板
- [ ] 多實例 Redis／資料庫型 Rate Limiter
- [ ] 確認 SQLAlchemy／SQLite 與來源 OpenAI 相依是否可移除

### 全體驗收與退役

- [ ] Build／TypeScript／瀏覽器驗收
- [ ] 十種視覺化互動與 RWD 驗收
- [ ] 搜尋、詳細頁、測驗、收藏與進度驗收
- [ ] localStorage 無法使用時的降級驗收
- [ ] AI fallback／live mode 驗收
- [ ] 舊 Vercel／FastAPI 停止或導向
- [ ] 舊 Repo README 搬遷公告
- [ ] 使用者核准後 Archived

## 驗收標準

- 十大演算法皆可搜尋、篩選、閱讀、互動與作答。
- 每個主題都有用途、白話說明、運作方式、案例、優缺點、視覺化與三題測驗。
- 收藏與進度不因重新整理遺失。
- AI 未設定時不影響教材使用。
- AI 設定後以繁體中文與 Schema 格式回應。
- Prompt、模型、Token 與成本可稽核。
- API 不接收不必要個資，且有輸入與流量限制。
- 正式 Runtime 不再呼叫舊 Repo 或舊 FastAPI。

## 退役門檻

- [x] 教材與測驗完整接管
- [x] 主題目錄、搜尋、詳細頁、收藏與進度完成接管
- [x] 十種必要視覺化完成接管
- [x] AI 助教程式完成中央治理接管
- [ ] AI Live／Fallback 最低驗收完成
- [ ] 正式 Usage Ledger 可保存與查詢
- [ ] 舊部署停止或導向新平台
- [ ] 全體 Runtime 最低驗收完成
- [ ] 搬遷公告完成
- [ ] 使用者人工核准
