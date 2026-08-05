# AI-Learning-Portfolio 四項真實 Runtime 工程設計

日期：2026-08-05

## 目標

把目前仍停留在導覽、規格或外部展示的四項課程功能，提升為可重建、可驗證、可追溯的真實 Runtime：

1. 台股 Manim：在 Linux CI 安裝 FFmpeg、Pango、Cairo 與繁體中文字體，實際渲染九個場景並以 ffprobe 驗證 MP4。
2. Cosmos：在 Next.js Server Route 中以伺服器端 Secret 呼叫外部文字生圖 Provider，顯示真實模型、Provider、時間與錯誤狀態；沒有 GPU Endpoint 或 Token 時必須回傳未設定，不得假生成。
3. Ensemble：使用 UCI Adult 資料與固定訓練腳本重建模型、評估與公平性報告，產出版本化 Artifact，並由 Vercel Python Function 提供真實推論。
4. AI 圖文故事：把十二幕 JSON、播放狀態與操作介面移入 React／Next.js，移除 iframe 依賴並保留來源與素材權利說明。

## 架構

### Manim

`modules/stock-manim-animation/python-manim` 保留九個場景來源。`render_all.py` 改為可指定品質、輸出根目錄與嚴格失敗模式。GitHub Actions 安裝系統依賴後執行九幕渲染，使用 `ffprobe` 檢查每個 MP4 的影像串流、時長與尺寸，最後產生 `render-manifest.json` 並上傳 Workflow Artifact。

### Cosmos

新增 `src/lib/cosmos-runtime.ts` 負責輸入驗證、尺寸映射、Provider 請求與錯誤正規化；新增 `/api/cosmos/status` 與 `/api/cosmos/generate`。Token 僅從 `HF_TOKEN` 讀取，模型由 `COSMOS_MODEL_ID` 設定，預設仍標示 `nvidia/Cosmos3-Super-Text2Image`。若該模型沒有可用 Inference Provider，系統回傳 `provider_unavailable`，不得偷偷改用其他模型；如需替代模型，必須由 `COSMOS_MODEL_ID` 明確設定並在 UI 顯示實際模型。

### Ensemble

把來源 Repository 的訓練腳本、資料與 Artifact 契約移入 `modules/ensemble-income-predictor`。訓練固定 random seed、固定資料切分，輸出：模型、欄位規格、整體 metrics、confusion matrix、依 sex/race 分組的樣本數、Recall、FPR 與 selection rate。根目錄 Python Function 只載入版本化模型，不在請求期間訓練。前端表單顯示真實預測、機率、模型版本與教育用途警告。

### AI 圖文故事

新增 `src/components/visual-story-player.tsx`，以來源 `default_novel.json` 的十二幕文字與轉場為資料基準。播放器支援開始、上一幕、下一幕、播放／暫停、進度、鍵盤操作與 reduced-motion。圖片先使用來源 GitHub Pages 的固定公開資產 URL；同時建立來源 Manifest 與 SHA，避免 iframe。後續若二進位素材納入 Repository，只需替換 Manifest URL，不改播放器介面。

## 資料與安全邊界

- 不在 GitHub、瀏覽器 Bundle、Log 或回應中暴露 Token。
- Cosmos 回應必須包含實際 `model`、`provider`、`generatedAt`；失敗時不得回傳預置圖片。
- Ensemble 不保存 race、sex 或完整輸入到資料庫；本次僅完成無狀態推論。
- Ensemble 預測不得用於徵才、授信、薪資或其他高風險自動決策。
- 台股動畫只供教學，不構成投資建議。
- 圖文故事保留來源 Repository 與素材權利狀態，不宣稱 AI 生成來源已完成法律驗證。

## 驗收門檻

### Manim

- 九個場景都實際產生 MP4。
- 每個檔案經 ffprobe 驗證有 video stream、duration > 0、width > 0、height > 0。
- Workflow Artifact 含九支影片與 manifest。

### Cosmos

- Status API 清楚回報 Secret 與模型設定狀態。
- Generate API 在有有效 Token／Provider 時回傳真實 image bytes。
- 未設定、401、429、503、逾時與不支援模型都有不同錯誤碼。
- UI 不存在 Mock Mode 或假圖片。

### Ensemble

- CI 從來源 CSV 重新訓練並以雜湊確認 Artifact 可重現。
- Metrics、confusion matrix 與群體公平性報告均由測試資料計算。
- Python Function 使用同一 Artifact 回傳真實 prediction/probability/model_version。

### AI 圖文故事

- 不再嵌入外部 iframe。
- 十二幕資料可完整播放，上一幕、下一幕、暫停與鍵盤操作可用。
- 正式 Production Route HTTP 200，且顯示來源與權利說明。
