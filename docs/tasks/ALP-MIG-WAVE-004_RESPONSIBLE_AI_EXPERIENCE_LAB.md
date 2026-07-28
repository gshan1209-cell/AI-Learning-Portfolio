# ALP Migration Wave 004｜Responsible AI Experience Lab

## 1. 波次目標

本波次完成 AI-Learning-Portfolio 最後三個 `planned` 來源 Repository 的 Migration，建立「生成式 AI 體驗、敏感資料分類、公版多媒體敘事」三類能力，同時維持三個獨立 Migration、課程、Runtime 與退役門檻。

| Migration | 來源 Repository | 固定來源 Commit | 新模組 | 核心定位 |
|---|---|---|---|---|
| ALP-MIG-012 | `gshan1209-cell/hw3-cosmos-text2image` | `f253f47b364d4148ce8f6481187f5c7550f0c31f` | `modules/cosmos-text-to-image` | 文字生圖、Prompt 控制、Provider／Model 誠實標示與離線展示 |
| ALP-MIG-013 | `gshan1209-cell/L20-Ensemble-Model` | `46f23c298da353ded39aca4cfa000c8df29589f4` | `modules/ensemble-income-predictor` | Adult Census Ensemble 分類、真實推論、模型比較與公平性治理 |
| ALP-MIG-014 | `gshan1209-cell/L2DOC1-github` | `07c40f377f2e7fdee8d3ce9b69c9dade26792699` | `modules/ai-visual-story` | 12 幕圖文故事播放器、素材 Manifest、可存取播放與來源追溯 |

本波次命名為 **Responsible AI Experience Lab**。三個模組共享輸入治理、Runtime Mode、來源追溯、資產 Manifest、模型／素材版本、Fallback、結果免責與測試能力；不得將三個來源專案合併成單一不可拆分產品。

## 2. 固定架構

### 2.1 共用能力層

建立：

```text
src/lib/responsible-ai-lab/
├── input-policy/
├── runtime-mode/
├── provenance/
├── model-registry/
├── asset-manifest/
├── fairness/
├── validation/
├── rate-limit/
└── types.ts

src/components/responsible-ai-lab/
├── runtime-mode-badge.tsx
├── model-provenance-card.tsx
├── asset-provenance-card.tsx
├── responsible-use-notice.tsx
├── fallback-notice.tsx
├── request-lifecycle.tsx
├── model-metric-grid.tsx
├── fairness-metric-table.tsx
├── sensitive-feature-warning.tsx
├── playback-controls.tsx
└── learning-checkpoint.tsx
```

共用層只能放通用能力：

- `snapshot`／`demo`／`live`／`fallback` 模式；
- Provider、Model、Dataset、Asset 與來源 Commit metadata；
- Prompt、表單、Slug、Seed、尺寸與 Request Body 驗證；
- Server-only Secret 邊界；
- Rate Limit、Timeout、回應大小與錯誤正規化；
- 不保存完整 Prompt 或敏感人口統計欄位的匿名事件合約；
- 公平性指標資料型別與教學說明；
- 素材 SHA-256、MIME、尺寸、替代文字與權利狀態；
- 生成／推論／播放流程圖元件。

模型特有前處理、電影感 Preset、Adult Dataset 欄位、故事轉場等規則，必須留在各自模組。

### 2.2 Native 頁面

建立：

- `/responsible-ai-lab`：三個模組入口、責任邊界與學習路線。
- `/responsible-ai-lab/text-to-image`：文字生圖教學與可選 Live Provider。
- `/responsible-ai-lab/ensemble-income`：Adult Census 模型比較、推論與公平性分析。
- `/responsible-ai-lab/visual-story`：12 幕圖文故事播放器。

既有 `/courses/[slug]` 必須能導向對應 Native Demo。主要教學流程不得依賴舊 Streamlit、外部 Hugging Face、舊 Vercel、GitHub Pages、遠端 BGM 或第三方 CDN 才能完成。

## 3. Runtime 與資料策略

### 3.1 來源保存

每個來源 Repository 的必要程式、設定、文件、資料、圖片、影片與示範素材，依類型保存於：

```text
modules/<module-slug>/source-reference/
modules/<module-slug>/python-reference/
modules/<module-slug>/assets/
modules/<module-slug>/artifacts/
modules/<module-slug>/snapshots/
```

不得只留下 README 摘要、外部連結或截圖。每個模組建立 `migration.json`，記錄：

- source repository／branch／commit；
- imported／excluded 檔案與理由；
- source runtime；
- Secret／Provider／Dataset／Asset 依賴；
- 舊部署；
- Native Route；
- Runtime Mode；
- 驗證命令與尚未驗證項目。

### 3.2 模式定義

- `demo`：版本化、可離線、明確標示的預生成結果或固定資料。
- `snapshot`：固定 Dataset／Artifact／Story Manifest。
- `live`：Server-side 呼叫正式 Provider 或執行真實模型。
- `fallback`：Live 失敗後回傳版本化 Demo／Snapshot，必須提供失敗原因摘要。

任何 Demo／Fallback 結果不得標示為本次使用者 Prompt 的即時生成結果；任何替代模型不得冒充原指定模型。

### 3.3 Build／CI 規則

CI 與 `next build`：

- 不呼叫 Hugging Face、Unsplash、UCI、GitHub Pages、SoundHelix 或其他外部網站；
- 不需要 Token、API Key、正式 Postgres 或外網；
- 使用本地 Fixture、Dataset Snapshot、Model Artifact 與 Asset Manifest；
- 所有可重建 Artifact 必須提供 deterministic exporter 與差異檢查。

## 4. 安全與責任治理

### 4.1 Secret 與外部請求

- Hugging Face Token 只能由 Server Runtime 讀取，不接受 Browser 傳入 Token。
- 不使用 `NEXT_PUBLIC_*` 保存 Provider Token。
- 不接受任意 Provider URL、Model ID、Image URL、Audio URL、Script URL、Asset Path 或 Python Import Path。
- Provider、Dataset、Story 與 Asset 必須使用 Allowlist／Registry。
- 外部回應限制 Timeout、MIME、尺寸與最大 Bytes。
- 錯誤不得回傳 Token、完整上游 Body、Stack 或本機路徑。

### 4.2 日誌與隱私

- 預設不保存完整 Prompt、Negative Prompt、圖片 Bytes、Adult Census 表單原始值或 IP。
- 如需 Usage Event，只記錄匿名 Request ID、模組、模式、Provider／Model Version、成功狀態、Latency、輸入長度與估算成本。
- Adult Census 模組不得建立含敏感欄位的個人預測紀錄 Dashboard；僅能展示版本化 aggregate metrics 或匿名統計。

### 4.3 誠實標示

每次生成、推論或播放結果都必須提供：

- mode；
- source／provider；
- model／dataset／asset version；
- generatedAt／trainedAt／snapshotAt；
- source commit／artifact hash；
- limitation／responsible-use notice；
- fallbackReason（如適用）。

## 5. 模組邊界

### ALP-MIG-012｜Cosmos Text-to-Image

負責：

- Prompt、Negative Prompt、Style、Aspect Ratio、Seed；
- Server-side Hugging Face Adapter；
- 真實 Provider／Model 名稱；
- 預生成 Demo Gallery；
- Prompt 與輸出安全邊界；
- 不將替代模型輸出冒充 Cosmos。

不負責：

- Adult Dataset 推論；
- 故事播放器；
- 任意模型／任意 URL Gateway；
- Browser Token 輸入。

### ALP-MIG-013｜Ensemble Income Predictor

負責：

- Adult Census Dataset Snapshot；
- Python 訓練與 Artifact Export；
- Ensemble 模型比較與真實推論；
- Responsible／Historical Benchmark 模式；
- 敏感欄位與公平性指標；
- 禁止高風險決策用途。

不負責：

- 保存個人預測紀錄；
- 就業、貸款、保險、住房、教育、福利或資格決策；
- 將公平性指標宣稱為公平保證。

### ALP-MIG-014｜AI Visual Story

負責：

- 公開 Repo 已保留的 12 幕故事播放器；
- 圖片、影片、故事 JSON 與可選音訊 Asset Manifest；
- 播放、暫停、上一幕、下一幕、進度、鍵盤、Reduced Motion；
- Alt Text、字幕、來源與權利狀態。

不負責：

- 重建來源 Repo 已移除的私有 Backend、Editor、Prompt 或 Upload 系統；
- 任意使用者檔案上傳；
- 任意遠端媒體 URL 播放。

## 6. 課程內容

三個課程皆使用既有六段式模板：

1. 主題能做什麼；
2. 白話原理與生活比喻；
3. 可操作 Demo；
4. 程式架構與關鍵程式碼；
5. 小測驗；
6. 延伸挑戰。

每課至少 3 題測驗與答案解析。

最低課程主題：

- Text-to-Image：Prompt、Seed、Aspect Ratio、Provider、Fallback、模型誠實標示與安全限制。
- Ensemble Income：分類、Ensemble、Confusion Matrix、Probability、敏感欄位、歷史偏誤與不適用情境。
- Visual Story：Manifest、Media Preload、User Gesture、Autoplay、字幕、可存取控制、素材權利與 Offline-first。

## 7. API 最低需求

### Text-to-Image

- `GET /api/responsible-ai-lab/text-to-image/presets`
- `GET /api/responsible-ai-lab/text-to-image/demo-results`
- `POST /api/responsible-ai-lab/text-to-image/generate`

### Ensemble Income

- `GET /api/responsible-ai-lab/ensemble-income/model-card`
- `GET /api/responsible-ai-lab/ensemble-income/metrics`
- `POST /api/responsible-ai-lab/ensemble-income/predict`

### Visual Story

- `GET /api/responsible-ai-lab/visual-stories`
- `GET /api/responsible-ai-lab/visual-stories/[slug]`

所有 API：

- 明確 Cache-Control；
- 輸入白名單與數值邊界；
- Request Body 最大 16 KB 或更嚴格；
- 不接受額外欄位；
- 錯誤回應格式一致；
- 不洩漏 Secret、Prompt 全文、敏感欄位、Stack 或路徑。

## 8. 測試與 CI

新增或擴充現有測試入口，不建立互不相容的第二套測試基礎。

最低測試：

### 共用層

- Runtime Mode 與 Provenance Schema；
- Allowlist／SSRF／Path Traversal；
- Body Size／字串長度／數值邊界；
- Fallback 誠實標示；
- Client Bundle 不含 Secret。

### ALP-MIG-012

- Prompt／Negative Prompt／Preset／Aspect／Seed 驗證；
- Demo 結果不是 Live；
- Provider／Model Name 不得失真；
- 無 Token、Timeout、非圖片 MIME、過大圖片與 Provider Error；
- Rate Limit；
- Python Streamlit `compileall`。

### ALP-MIG-013

- Dataset Schema／Hash／License metadata；
- Python exporter 可重現；
- Preprocessing、Logistic、Tree、Forest、Boosting、Voting；
- TypeScript／Python Golden Samples；
- Accuracy／Precision／Recall／F1／Confusion Matrix；
- Responsible Mode 排除直接敏感欄位；
- Historical Mode 必須明確 Opt-in；
- Fairness metrics 完整性；
- API 邊界與禁止額外欄位。

### ALP-MIG-014

- Story JSON Schema；
- 12 幕順序與 Duration／Transition Allowlist；
- Asset Manifest、SHA-256、MIME、Alt Text；
- 不接受任意 URL／Path；
- Player State：start／play／pause／next／previous／end；
- Reduced Motion／Keyboard／Caption；
- 外部 BGM 缺失時仍可靜音播放。

CI 至少執行：

```bash
npm ci
npm run prisma:generate
npm run lint
npx tsc --noEmit
npm run test
npm run build
python -m compileall modules/cosmos-text-to-image/python-reference
python -m compileall modules/ensemble-income-predictor/python-reference
python modules/ensemble-income-predictor/scripts/export_model_artifacts.py --check
python modules/ai-visual-story/scripts/verify_asset_manifest.py
```

如保留 Python 單元測試，CI 必須安裝固定版本依賴並執行；不得因依賴或測試失敗而關閉檢查。

## 9. Registry 與 Migration 狀態

開始盤點與移入來源後，可將 ALP-MIG-012～014 從 `planned` 更新為 `importing`。

只有在完成下列項目後才可更新為 `refactoring`：

- 來源 Inventory 與必要檔案保存；
- `migration.json`；
- Native 頁面與 API；
- 課程內容；
- Offline Demo／Snapshot；
- 真實模型／Provider 誠實標示；
- 自動測試與 CI；
- `DEVELOPMENT_RECORD.md` 與 Registry 更新。

本波次不得把任何來源設為：

- `ready_to_retire`；
- `retired`。

完成後預期 Migration Registry：

| 狀態 | 數量 |
|---|---:|
| importing | 0 |
| refactoring | 14 |
| planned | 0 |
| ready_to_retire | 0 |
| retired | 0 |

## 10. 完成定義

本波次 PR 最低需完成：

- 三個固定來源 Commit 的 Inventory 與保存；
- Responsible AI Experience 共用層；
- 三個 Native 頁面；
- Text-to-Image Offline Demo 與可選真實 Live Provider；
- Adult Census 真實 Ensemble Artifact 與 Golden Samples；
- Responsible／Historical Benchmark 公平性模式；
- 12 幕 Visual Story Native Player 與 Asset Manifest；
- 八支以上 API／Route Handlers；
- 三個六段式課程；
- Python、TypeScript、Route Handler、Artifact、Asset、Build 與 CI 全數通過；
- `DEVELOPMENT_RECORD.md`、Course／Demo／Repository／Migration Registry 更新。

舊 Repo README 導向、舊部署停止與 Archived 仍留待後續人工核准。