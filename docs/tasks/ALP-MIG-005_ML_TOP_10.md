# ALP-MIG-005｜機器學習十大演算法完整移植

## 任務目標

將 `gshan1209-cell/machinelearningHw05` 的十大演算法教材、測驗、搜尋、收藏、學習進度、互動視覺化與 AI 助教移植進 AI-Learning-Portfolio，完成驗收後退役舊 Next.js／FastAPI 部署與來源 Repo。

## 來源資訊

```text
Repository: gshan1209-cell/machinelearningHw05
Branch: main
Source commit: 9567a798c0f7de0065a1834f6af8500708e902a1
Frontend: Next.js 15
Backend: FastAPI
AI: Gemini google-genai
Legacy deployment: https://machinelearning-hw05.vercel.app/
```

## 已完成

- [x] README 與前後端架構盤點
- [x] 保存主要來源 blob SHA
- [x] FastAPI requirements 移入來源參考區
- [x] FastAPI main／algorithms／chat 移入
- [x] Next.js package reference 移入
- [x] Home Page、AlgorithmGrid、AlgorithmCard、ProgressBar 移入
- [x] Algorithm／Quiz／DisplayAlgorithm 型別移入
- [x] 教材 normalization 與亂碼 fallback 邏輯移入
- [x] Gemini fallback 行為盤點
- [x] AI Gateway／Prompt Registry 改造要求文件化
- [x] 模組 README 與 migration manifest

## 待完成

### 教材資料

- [ ] 完整移入 `frontend/data/algorithms.json`
- [ ] 完整移入 `backend/data/algorithms.json`
- [ ] 比對兩份 JSON SHA／內容是否相同
- [ ] 拆成中央平台可讀的 chunk 或每演算法獨立檔
- [ ] 建立十大演算法與中央 Course Registry 的關聯
- [ ] 驗證每個演算法都有完整測驗

### 前端

- [ ] FavoriteButton 與收藏資料格式
- [ ] 演算法詳細頁
- [ ] Quiz 元件
- [ ] 完成標記與進度事件
- [ ] 視覺化元件
- [ ] AI Tutor UI
- [ ] Layout、Global CSS 與 RWD
- [ ] 將 Next.js 15 寫法調整為中央 Next.js 14 相容版本
- [ ] 路由從 `/algorithms/*` 映射到中央平台正式 URL

### AI 與後端

- [ ] 將 Gemini 呼叫改走中央 AI Gateway
- [ ] 建立 Prompt ID／Version
- [ ] 建立 Token Usage／Cost Ledger
- [ ] Server-side Schema 驗證模型輸出
- [ ] Prompt Injection 與輸入長度防護
- [ ] 對話紀錄與 user_id 個資最小化
- [ ] 確認 SQLAlchemy／SQLite 是否實際使用
- [ ] 未使用的 OpenAI 相依移除

### 驗收與退役

- [ ] Build／TypeScript／瀏覽器驗收
- [ ] 測驗、收藏與進度驗收
- [ ] AI fallback／live mode 驗收
- [ ] 舊 Vercel／FastAPI 停止或導向
- [ ] 舊 Repo README 搬遷公告
- [ ] 使用者核准後 Archived

## 重要發現

1. README 同時描述 OpenAI，但目前實作使用 Gemini；正式規格以實際程式為準。
2. 前端 package 為 Next.js 15.5，中央平台目前是 Next.js 14，不可直接放進 `src/app`。
3. 教材 JSON 約 703 行，是最重要的正式內容資產，必須完整轉移且做資料驗證。
4. AlgorithmCard 依賴尚未移入的 FavoriteButton，因此目前只放來源參考區。
5. FastAPI `chat.py` 會接收 `user_id` 與最近五筆 history；正式版需要個資與日誌規範。

## 驗收標準

- 十大演算法皆可搜尋與篩選。
- 每個演算法都有用途、白話說明、運作方式、案例、優缺點與測驗。
- 測驗答案與解析完整。
- 收藏與進度不因重新整理遺失。
- AI 未設定時不影響教材使用。
- AI 設定後以繁體中文、JSON Schema 格式回應。
- Prompt、模型、Token 與成本可稽核。
- 正式 Runtime 不再呼叫舊 Repo 或舊 FastAPI。

## 退役門檻

- 教材與測驗完整接管
- 主要前端功能完成
- AI 助教完成中央治理或明確取消
- 舊部署停止或導向新平台
- Runtime 最低驗收完成
- 搬遷公告完成
- 使用者人工核准
