# ALP-MIG-005｜機器學習十大演算法完整移植

## 任務目標

將 `gshan1209-cell/machinelearningHw05` 的十大演算法教材、測驗、搜尋、收藏、學習進度、互動視覺化與 AI 助教移植進 AI-Learning-Portfolio，完成驗收後退役舊 Next.js／FastAPI 部署與來源 Repo。

## 目前狀態

**`refactoring`**

核心教材、主要前端流程、十種視覺化、中央 AI 助教與唯讀治理儀表板已接管；尚未達 `ready_to_retire`。

## 已完成

### 來源與教材

- [x] 前後端架構、主要來源碼與 blob SHA 盤點
- [x] FastAPI／Next.js 來源參考版移入
- [x] 703 行教材拆成 10 個中央 JSON chunk
- [x] 10 個主題、30 題測驗與 30 組解析
- [x] 正式資料型別、Loader、搜尋、分類、難度與統計
- [x] SVM Kernel Trick 數學校訂

### Native 前端與 API

- [x] `/ml-algorithms` 主題目錄
- [x] `/ml-algorithms/[slug]` 十個詳細頁
- [x] 搜尋、分類、難度、收藏、測驗與進度
- [x] 十種 React／SVG Native 視覺化
- [x] 演算法列表／單筆 API
- [x] 線性回歸／SVM 與進階 Native 課程勾稽

### AI Gateway 與 Prompt 治理

- [x] AI Tutor UI 接入十個詳細頁
- [x] `POST /api/ai/ml-tutor`
- [x] 教材 fallback 與 Provider Error／Timeout fallback
- [x] Prompt Registry 正式來源
- [x] Prompt v1.0.0 歷史版保留
- [x] Prompt v1.1.0 Injection Guard 啟用
- [x] Gemini Structured JSON Schema
- [x] Server-side Response Validation
- [x] Question／History／Request Body Limits
- [x] 不接收 `user_id`，不保存完整對話或原始 IP
- [x] 匿名雜湊 Rate Limit
- [x] Token Usage 與可設定費率的成本估算
- [x] 本機 JSONL Ledger／正式 PostgreSQL Schema 預留
- [x] `ai_prompts`、`ai_prompt_versions`、`ai_model_rates`、`ai_usage_logs`
- [x] `/ai-governance` 唯讀治理儀表板
- [x] Secret 配置、Prompt 版本、Rate Limit、費率、Ledger 模式與近期用量檢視
- [x] AI Gateway 架構文件

## 待完成

### AI 驗收與正式管理

- [ ] 使用測試 Secret 驗證 Live Gemini 回覆
- [ ] 驗證 JSON Schema、Token Metadata、Timeout 與供應商錯誤
- [ ] 執行 Prisma Migration
- [ ] 正式 Usage Ledger 寫入 PostgreSQL
- [ ] 具認證／授權的 Prompt 編輯、發布與回滾後台
- [ ] 正式 Token／成本查詢與圖表
- [ ] 多實例 Redis／資料庫型 Rate Limiter
- [ ] 確認 SQLAlchemy／SQLite 與來源 OpenAI 相依是否可移除

### 全體驗收與退役

- [x] Build／TypeScript／瀏覽器驗收
- [ ] 十種視覺化互動與 RWD 驗收
- [ ] 搜尋、詳細頁、測驗、收藏與進度驗收
- [ ] localStorage 無法使用時的降級驗收
- [ ] AI fallback／live mode 驗收
- [ ] 舊 Vercel／FastAPI 停止或導向
- [ ] 舊 Repo README 搬遷公告
- [ ] 使用者核准後 Archived

## 退役門檻

- [x] 教材、測驗、主要前端流程與視覺化接管
- [x] AI 助教程式完成中央治理接管
- [x] Prompt／Token／Cost 唯讀治理資訊可檢視
- [ ] AI Live／Fallback 最低驗收完成
- [ ] 正式 Usage Ledger 可保存與查詢
- [ ] 舊部署停止或導向新平台
- [ ] 全體 Runtime 最低驗收完成
- [ ] 搬遷公告完成
- [ ] 使用者人工核准
