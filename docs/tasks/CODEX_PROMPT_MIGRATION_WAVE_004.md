# Codex 執行指令｜Migration Wave 004 Responsible AI Experience Lab

請在 Repository `gshan1209-cell/AI-Learning-Portfolio` 執行第四波，也是最後一波 `planned` 來源移植。

## 工作分支

直接使用既有分支：

`codex/migration-wave-4-responsible-ai-experience-lab`

開始前先同步最新 `main`。如有衝突，必須保留：

- Wave 004 任務文件；
- Wave 002 Regression Lab；
- Wave 003 Applied Web Systems；
- 中央 AI Gateway、Prompt Registry、Usage Ledger 合約；
- 現有 CI、Artifact 重建、FastAPI／Django Runtime 驗證；
- 所有既有 Migration、Course、Demo、Repository Registry。

## 必讀文件

依序閱讀：

1. `AGENT.md`
2. `docs/tasks/ALP-MIG-WAVE-004_RESPONSIBLE_AI_EXPERIENCE_LAB.md`
3. `docs/tasks/ALP-MIG-012_COSMOS_TEXT_TO_IMAGE.md`
4. `docs/tasks/ALP-MIG-013_ENSEMBLE_INCOME_PREDICTOR.md`
5. `docs/tasks/ALP-MIG-014_AI_VISUAL_STORY.md`
6. `docs/migrations/SOURCE_REPOSITORY_MIGRATION.md`
7. `DEVELOPMENT_RECORD.md`
8. `migration_registry/migrations.json`
9. `repository_registry/repositories.json`
10. `course_demo_registry/demo_registry.json`
11. `.github/workflows/ci.yml`
12. `scripts/run_tests.ts`

以上文件是本次完成定義。不得把 Native Demo 縮減為 iframe、外部連結、純截圖、固定答案或假 Runtime。

## 固定來源 Repository 與 Commit

- ALP-MIG-012：`gshan1209-cell/hw3-cosmos-text2image@f253f47b364d4148ce8f6481187f5c7550f0c31f`
- ALP-MIG-013：`gshan1209-cell/L20-Ensemble-Model@46f23c298da353ded39aca4cfa000c8df29589f4`
- ALP-MIG-014：`gshan1209-cell/L2DOC1-github@07c40f377f2e7fdee8d3ce9b69c9dade26792699`

必須依固定 commit 盤點。來源 main 後續如有新提交，只能記錄差異，不可未經文件化改用其他 commit。

## 非協商原則

1. 不得任意刪除既有程式、課程、Registry、Migration、Prompt、測試、CI 或文件。
2. 發現問題直接修正，不只產生報告。
3. 不提交 Token、API Key、Cookie、憑證、`.env`、Streamlit Secrets、個人預測紀錄或含敏感資料的 DB。
4. 不封存、不停止、不刪除任何來源 Repo 或舊部署。
5. Build／CI 不呼叫 Hugging Face、Unsplash、UCI、SoundHelix、GitHub Pages、CDN 或其他外部服務。
6. 不接受任意 URL、Model ID、Provider URL、Asset Path、Script URL、Callback URL、Python Import Path 或 Dataset ID。
7. Demo／Snapshot／Fallback 必須誠實標示，不得冒充即時生成或真實模型推論。
8. 替代模型必須顯示實際 Model ID，不得冒充 Cosmos。
9. Adult Census 必須是真實 Python 訓練與 Artifact Export，不得使用固定公式、隨機機率、假 Metrics 或同源自我 Golden Sample。
10. Responsible Mode 不得使用 `race`、`sex`、`native-country` 作模型特徵。
11. 不建立含完整人口統計輸入的 Prediction Logs。
12. 不重建 L2DOC1 公開版已移除的私有 Backend、Editor、Prompt、API 或 Upload 系統。
13. 不降低 TypeScript strict、ESLint、Artifact Check、Python Runtime 或 CI 標準。
14. 不因測試失敗而跳過、關閉或改成永遠成功。

## 執行順序

### Phase A｜來源 Inventory 與保存

針對三個來源：

1. 讀取 README、入口程式、package／requirements、設定、API、資料、模型、圖片、影片、部署與測試。
2. 建立模組目錄與 `migration.json`。
3. 保存必要原始程式於 `source-reference/` 或 `python-reference/`。
4. 保存必要 Binary Assets，建立 Hash 與來源紀錄。
5. 逐檔記錄 imported／excluded 與理由。
6. 記錄固定來源 commit、Runtime、Secret、Provider、Dataset、Asset 與舊部署。
7. 開始移入後，三個 Migration 狀態先更新為 `importing`。

### Phase B｜Responsible AI Experience 共用層

建立：

```text
src/lib/responsible-ai-lab/
src/components/responsible-ai-lab/
src/app/responsible-ai-lab/page.tsx
```

最低共用能力：

- Runtime Mode：demo／snapshot／live／fallback；
- Model／Dataset／Asset Provenance；
- Input Validation；
- Server-only Secret 邊界；
- Allowlist／SSRF／Path Traversal 防護；
- Timeout／Response Size／MIME；
- Rate Limit；
- Anonymous Usage Event 合約；
- Responsible Use Notice；
- Fairness Metric 型別；
- Asset Manifest 型別。

共用層不得包含 Cosmos、Adult Dataset 或特定故事的專案規則。

### Phase C｜ALP-MIG-012 Cosmos Text-to-Image

1. 保存完整 Streamlit Python 來源、requirements、README 與 Demo Screenshot。
2. 建立 Provider／Model Registry。
3. 建立本地預生成 Demo Gallery 與 Manifest，不使用 Unsplash Runtime。
4. 建立 deterministic Prompt Presets／Enhancer。
5. 建立 Server-only Hugging Face Adapter。
6. Token 只讀 `process.env.HF_TOKEN` 或中央 Secret Provider，禁止 Browser Token。
7. 建立三支 API：presets、demo-results、generate。
8. Generate API 實作 Body、Prompt、Negative Prompt、Aspect、Seed、Rate、Timeout、MIME、Bytes 驗證。
9. Provider 回應顯示實際 Provider／Model；替代模型不得標示為 Cosmos。
10. 無 Token／Timeout／Provider Error 時回明確 fallback，不得假稱 Live。
11. 建立 `/responsible-ai-lab/text-to-image`。
12. 建立六段式課程與至少 3 題測驗。

### Phase D｜ALP-MIG-013 Ensemble Income Predictor

1. 保存來源規格與 Next.js 骨架。
2. 取得並版本化 UCI Adult train／test Dataset，建立 Dataset Manifest／Card／Hash／Terms Note。
3. 固定 seed 與 preprocessing，處理 `?`、Category Vocabulary、Feature Order。
4. 建立 Responsible／Historical Benchmark 兩種模式。
5. Responsible Mode 在 preprocessing 前移除 `race`、`sex`、`native-country`。
6. 真實訓練五模型：Logistic、Decision Tree、Random Forest、Gradient Boosting、Voting。
7. 匯出完整 Artifact 與可重現 exporter。
8. TypeScript 實作五模型推論，不依賴 Production Python Server。
9. 建立至少 24 筆 Python Golden Samples，與 TS Probability 比對。
10. 產生 Accuracy、Precision、Recall、F1、Confusion Matrix。
11. 產生依 sex／race 的 aggregate fairness metrics，明確標示限制。
12. 建立 Model Card、Metrics、Predict 三支 API。
13. Predict API 實作兩種模式 Schema、敏感欄位政策、Body／數值／Category／額外欄位驗證。
14. 不建立含原始表單的 Prediction Logs。
15. 建立 `/responsible-ai-lab/ensemble-income`。
16. 建立六段式課程與至少 3 題測驗。

### Phase E｜ALP-MIG-014 AI Visual Story

1. 保存公開版 Static HTML／CSS／JS、12 幕 JSON、12 張圖片、Intro Video 與 Demo Screenshot。
2. 不重建已移除的私有 Backend／Editor／Upload。
3. 將任意 URL Story Schema 改為 Asset ID Allowlist。
4. 建立 Asset Manifest，記錄 SHA、MIME、Bytes、尺寸、Duration、Alt Text、Rights Status。
5. 外部 SoundHelix BGM 不作必要 Runtime；無法確認權利時排除並預設 Silent。
6. 建立 deterministic Player State Machine。
7. 建立 Start、Play、Pause、Previous、Next、Seek、Restart、Progress、Caption、Fullscreen、Audio Controls。
8. 加入 Keyboard、Focus、ARIA、Alt Text、Reduced Motion、200% Zoom。
9. 建立 Story List／Detail 兩支 API，拒絕非法 Slug 與 Path Traversal。
10. 建立 `/responsible-ai-lab/visual-story`。
11. 建立六段式課程與至少 3 題測驗。

### Phase F｜Course、Demo 與 Registry

1. 新增三份 Course Chunk。
2. 每課至少 3 題測驗與解析。
3. 更新 Course／Demo／Repository／Migration Registry。
4. Native Demo 必須由 Course Page 可到達。
5. 完成 Native 基礎、來源保存、測試後，三個狀態更新為 `refactoring`。
6. 最終 Registry 必須是：

```text
importing: 0
refactoring: 14
planned: 0
ready_to_retire: 0
retired: 0
```

不得提前改為 `ready_to_retire` 或 `retired`。

### Phase G｜測試與 CI

擴充現有 `scripts/run_tests.ts` 或既有測試基礎，確保新測試真的被 `npm run test` 執行；不可只新增帶有 `describe/test` 但未被 Runner 載入的檔案。

最低測試依三份 Migration Spec 執行，特別包含：

- Demo／Live／Fallback 誠實標示；
- Cosmos Provider／Model 身分；
- Browser Token、任意 URL、Model ID、SSRF；
- Adult 真實 Artifact、Golden Samples、Metrics、敏感欄位與 Historical Opt-in；
- Visual Story Asset Hash、12 幕 Schema、Player State、Keyboard、Reduced Motion；
- 所有 Route Handler 正常、錯誤、邊界與 Body Size；
- Python compileall／tests；
- Artifact／Manifest deterministic rebuild；
- TypeScript／Lint／Build。

## 必跑命令

```bash
npm ci
npm run prisma:generate
npm run lint
npx tsc --noEmit
npm run test
npm run build

python -m compileall modules/cosmos-text-to-image/python-reference
python -m compileall modules/ensemble-income-predictor/python-reference

python -m pip install -r modules/ensemble-income-predictor/python-reference/requirements.txt
python modules/ensemble-income-predictor/python-reference/export_model_artifacts.py --check
python -m pytest modules/ensemble-income-predictor/python-reference/tests

python modules/ai-visual-story/scripts/verify_asset_manifest.py
```

如 Cosmos Python Source 有可執行單元測試，也必須安裝固定版本依賴並執行；Streamlit Live Provider 不在 CI 呼叫。

## CI 更新

擴充 `.github/workflows/ci.yml`：

- Node 與 Python 使用固定版本；
- 安裝 ML 依賴；
- 重建／驗證 Wave 002 ML Artifacts；
- 重建／驗證 Django Artifacts；
- 執行 FastAPI／Django Runtime；
- 新增 Adult Ensemble Artifact Rebuild；
- 新增 Visual Story Asset Manifest Verification；
- Cosmos Python compileall；
- Prisma／Lint／TypeScript／Tests／Build；
- 無 Secret、無外網可成功。

不要刪除或取代既有 CI 步驟。

## 文件更新

更新：

- `DEVELOPMENT_RECORD.md`
- `README.md`（需要時）
- 三份 ALP-MIG 任務文件的實際完成狀態
- `migration_registry/migrations.json`
- `repository_registry/repositories.json`
- `course_demo_registry/demo_registry.json`
- Course Manifest（如專案採生成流程）
- 各模組 README／migration.json／Dataset Card／Model Card／Asset Rights Note

必須記錄：

- 實際執行命令與結果；
- Dataset／Model／Asset Hash；
- 真實模型與 Fallback 差異；
- Provider／Model 實際狀態；
- Fairness 指標與限制；
- Rights Status；
- 尚待人工／Secret／Browser 驗證項目。

## 交付

完成後 Push 同一分支，建立 PR 到 `main`。

PR 標題：

`feat: 移植 Responsible AI Experience 三個最終模組`

PR 說明至少包含：

- 三個來源 Inventory 與固定 Commit；
- 共用 Responsible AI Experience 能力層；
- Cosmos Demo／Live／Fallback 與實際 Model 標示；
- Adult Dataset Hash、五模型、Golden Samples、Metrics 與公平性模式；
- Visual Story 12 幕、Asset Manifest、Rights Status 與 Accessibility；
- Course／API／Registry；
- Python／TypeScript／CI 結果；
- 尚待人工或 Secret 驗證項目；
- 最終 Migration 狀態 `14 refactoring / 0 planned`。

不要自動合併 PR；完成後等待人工驗收。