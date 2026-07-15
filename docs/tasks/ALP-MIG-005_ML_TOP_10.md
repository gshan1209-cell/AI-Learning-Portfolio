# ALP-MIG-005｜機器學習十大演算法完整移植

## 任務目標

將 `gshan1209-cell/machinelearningHw05` 的十大演算法教材、測驗、搜尋、收藏、學習進度、互動視覺化與 AI 助教移植進 AI-Learning-Portfolio，完成驗收後退役舊 Next.js／FastAPI 部署與來源 Repo。

## 目前狀態

**`refactoring`**

核心教材與非 AI 學習流程已接管；尚未達 `ready_to_retire`。

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

### 來源接管

- [x] README 與前後端架構盤點
- [x] 保存主要來源 blob SHA
- [x] FastAPI requirements、main、algorithms、chat 移入來源參考區
- [x] Next.js package、Home、AlgorithmGrid、AlgorithmCard、ProgressBar 移入來源參考區
- [x] Algorithm／Quiz／DisplayAlgorithm 型別移入
- [x] 教材 normalization 與文字 fallback 邏輯移入
- [x] Gemini fallback 行為盤點
- [x] AI Gateway／Prompt Registry 改造要求文件化

### 教材資料

- [x] 將來源 703 行教材拆成 10 個中央 JSON chunk
- [x] 完整接管 10 個演算法主題
- [x] 完整接管 30 題測驗與 30 組解析
- [x] 建立 `MlAlgorithm`／`MlQuizQuestion` 正式型別
- [x] 建立中央 Loader、搜尋、分類、難度與統計
- [x] SVM 教材加入核技巧／3D 幾何示意校訂註記

### Native 前端

- [x] `/ml-algorithms` 正式主題目錄
- [x] `/ml-algorithms/[slug]` 十個詳細頁
- [x] 搜尋、分類與難度篩選
- [x] 收藏與 localStorage 格式
- [x] 三題 Quiz 元件
- [x] 作答解析、通過門檻與重新作答
- [x] 完成標記、結果紀錄與進度事件
- [x] 整體學習進度元件
- [x] 導覽列入口
- [x] 線性回歸／SVM 與既有 Native 課程交叉連結
- [x] Next.js 15 來源功能改寫為中央 Next.js 14 相容路由

### API

- [x] `GET /api/ml-algorithms`
- [x] 搜尋、分類、難度與分頁
- [x] `GET /api/ml-algorithms/[slug]`
- [x] 404 回應

## 待完成

### 視覺化

- [ ] `scatter-line`
- [ ] `logistic-curve`
- [ ] `decision-tree`
- [ ] `random-forest`
- [ ] `svm-margin`
- [ ] `knn-neighbors`
- [ ] `kmeans-clustering`
- [ ] `naive-bayes-text`
- [ ] `pca-projection`
- [ ] `gradient-descent`
- [ ] 將 Visual Adapter placeholder 改為正式 Native 元件

### AI 與後端

- [ ] Gemini 呼叫改走中央 AI Gateway
- [ ] 建立 Prompt ID／Version
- [ ] 建立 Token Usage／Cost Ledger
- [ ] Server-side Schema 驗證模型輸出
- [ ] Prompt Injection 與輸入長度防護
- [ ] 對話紀錄與 user_id 個資最小化
- [ ] 確認 SQLAlchemy／SQLite 是否仍有實際用途
- [ ] 移除未使用的 OpenAI 相依
- [ ] AI Tutor UI

### 驗收與退役

- [ ] Build／TypeScript／瀏覽器驗收
- [ ] 搜尋、詳細頁、測驗、收藏與進度驗收
- [ ] localStorage 無法使用時的降級驗收
- [ ] AI fallback／live mode 驗收
- [ ] 舊 Vercel／FastAPI 停止或導向
- [ ] 舊 Repo README 搬遷公告
- [ ] 使用者核准後 Archived

## 重要發現

1. README 描述 OpenAI，但目前實作使用 Gemini；正式規格以實際程式為準。
2. 來源使用 Next.js 15.5，中央平台為 Next.js 14；已採重新實作而非直接複製進編譯路徑。
3. 來源教材已拆成每演算法獨立 JSON，降低單一大型檔案維護風險。
4. AI API 會接收 `user_id` 與 history；正式版仍需個資最小化與日誌規範。
5. SVM 舊教材把 Kernel 簡化成 3D 映射；中央版已加入數學界線與修正解析。

## 驗收標準

- 十大演算法皆可搜尋與篩選。
- 每個演算法都有用途、白話說明、運作方式、案例、優缺點與三題測驗。
- 測驗答案與解析完整。
- 收藏與進度不因重新整理遺失。
- AI 未設定時不影響教材使用。
- AI 設定後以繁體中文與 Schema 格式回應。
- Prompt、模型、Token 與成本可稽核。
- 正式 Runtime 不再呼叫舊 Repo 或舊 FastAPI。

## 退役門檻

- [x] 教材與測驗完整接管
- [x] 主題目錄、搜尋、詳細頁、收藏與進度完成接管
- [ ] 必要視覺化完成接管
- [ ] AI 助教完成中央治理或明確取消
- [ ] 舊部署停止或導向新平台
- [ ] Runtime 最低驗收完成
- [ ] 搬遷公告完成
- [ ] 使用者人工核准
