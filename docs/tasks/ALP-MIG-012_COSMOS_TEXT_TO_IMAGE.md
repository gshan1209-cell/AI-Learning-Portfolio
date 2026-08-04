# ALP-MIG-012｜Cosmos Text-to-Image 與生成式 AI 責任體驗

## 1. 任務目標

將 `gshan1209-cell/hw3-cosmos-text2image` 的 Streamlit 文字生圖應用移植進 AI-Learning-Portfolio，保留原始 Python Runtime、Prompt 控制與展示素材，建立不依賴外部服務即可操作的 Native 教學體驗，並提供可選的 Server-side Hugging Face Live 模式。

核心原則是：**Provider、Model、Demo、Fallback 與即時生成結果必須誠實區分。**

## 2. 固定來源

- Repository：`gshan1209-cell/hw3-cosmos-text2image`
- Branch：`main`
- Commit：`f253f47b364d4148ce8f6481187f5c7550f0c31f`
- Source Runtime：Python／Streamlit／Pillow／requests／Hugging Face
- Source Model Label：`nvidia/Cosmos3-Super-Text2Image`
- Source Entry：`app.py`

## 3. 來源風險盤點

來源程式必須保存，但 Native 版本不得延續以下問題：

1. Source UI 顯示 Cosmos Model，但 DNS fallback 實際呼叫 `black-forest-labs/FLUX.1-schnell`，容易造成模型身分失真。
2. Mock Mode 從 Unsplash 即時下載圖片，卻顯示為「Cosmos3 模擬生成結果」。
3. 本機 Token 可由 Browser UI 輸入，不符合主平台中央 Server-only Secret 邊界。
4. Mock Mode、Build 與 Demo 依賴外部圖片網址，無法保證離線與可重現。
5. Provider 回應缺少完整 MIME、Bytes、尺寸與模型 metadata 驗證。
6. Prompt、Negative Prompt、Style Preset、Seed 與 Provider Error 尚未建立中央 API Schema。
7. 部分 Style Preset 使用特定創作者／工作室名稱；Native Preset 應改為描述性視覺語彙，不依賴模仿特定在世創作者。

以上項目需在 `migration.json` 與模組 README 中記錄 source behavior 與 Native correction。

## 4. 目標模組

```text
modules/cosmos-text-to-image/
├── README.md
├── migration.json
├── python-reference/
├── source-reference/
├── assets/
│   ├── demo-results/
│   └── demo-manifest.json
├── fixtures/
├── artifacts/
│   └── provider-model-registry.json
└── snapshots/
    └── generation-examples.json
```

Native 程式：

```text
src/lib/responsible-ai-lab/text-to-image/
├── provider-registry.ts
├── presets.ts
├── request-schema.ts
├── demo-results.ts
├── huggingface-adapter.server.ts
├── image-response-validation.ts
├── generation-service.server.ts
└── types.ts

src/components/responsible-ai-lab/text-to-image/
├── generation-form.tsx
├── prompt-enhancer.tsx
├── generation-result.tsx
├── demo-gallery.tsx
└── provider-status.tsx

src/app/responsible-ai-lab/text-to-image/page.tsx
src/app/api/responsible-ai-lab/text-to-image/presets/route.ts
src/app/api/responsible-ai-lab/text-to-image/demo-results/route.ts
src/app/api/responsible-ai-lab/text-to-image/generate/route.ts
```

## 5. Source Inventory 與保存

至少保存：

- `app.py`；
- `requirements.txt`；
- `.streamlit` 的範例設定但不含 Secret；
- README；
- Demo 截圖；
- Source Prompt Presets；
- Hugging Face request／fallback 流程；
- 原始圖片處理與 Download 邏輯；
- `.gitignore` 與部署說明。

不得提交：

- 真實 `HF_TOKEN`；
- `.streamlit/secrets.toml`；
- 使用者 Prompt／生成圖片紀錄；
- 未確認權利的遠端快取圖片。

## 6. Provider／Model Registry

建立版本化：

```text
modules/cosmos-text-to-image/artifacts/provider-model-registry.json
```

每個模型至少記錄：

- providerId；
- providerLabel；
- modelId；
- modelLabel；
- sourceRepository；
- sourceCommit；
- liveEnabled；
- supportedAspectRatios；
- maxPromptLength；
- timeoutMs；
- responseMaxBytes；
- documentationNote；
- fallbackPolicy。

規則：

- Client 不得提供任意 Provider URL 或 Model ID。
- Native 預設只顯示來源指定模型。
- 如實作替代模型，必須由 Registry 明確 Allowlist，結果回應顯示實際 `modelId`；不得標示為 Cosmos。
- Live Provider 不可用時切換本地 Demo，`mode=fallback` 並提供 `fallbackReason`。

## 7. Native Demo 模式

預設模式為 `demo`，使用本地版本化圖片，不呼叫外網。

Demo Manifest 每筆至少包含：

- id；
- localPath；
- sha256；
- mimeType；
- width／height；
- promptExcerpt；
- stylePreset；
- aspectRatio；
- seed；
- provider／model；
- generatedAt；
- source／rightsStatus；
- altText；
- notice。

UI 必須顯示：

> 此為預先生成的教學範例，不是本次 Prompt 的即時生成結果。

禁止以隨機挑選 Demo 圖片的方式冒充本次生成成功。

## 8. Live 生成 API

### `POST /api/responsible-ai-lab/text-to-image/generate`

Request：

```json
{
  "prompt": "A greenhouse robot inspecting crops at sunrise",
  "negativePrompt": "blurry, distorted",
  "stylePreset": "cinematic",
  "aspectRatio": "16:9",
  "seed": 42,
  "mode": "live"
}
```

固定驗證：

- Body 最大 16 KB；
- `prompt`：1～2000 字元；
- `negativePrompt`：0～1000 字元；
- `stylePreset`：Registry Allowlist；
- `aspectRatio`：`1:1`、`16:9`、`9:16`、`4:3`；
- `seed`：0～999999 的整數；
- `mode`：`demo|live`；
- 拒絕額外欄位；
- 每匿名來源預設最多 5 次／10 分鐘；
- Live Timeout 不超過 60 秒；
- Provider Response 最大 15 MB；
- 只接受 `image/png`、`image/jpeg`、`image/webp`；
- 圖片必須可解碼且尺寸在允許範圍；
- 不接受 Browser Token、Provider URL、Model ID 或 Callback URL。

Response metadata：

```json
{
  "requestId": "anonymous-id",
  "mode": "live",
  "providerId": "huggingface",
  "modelId": "actual-model-id",
  "seed": 42,
  "stylePreset": "cinematic",
  "aspectRatio": "16:9",
  "mimeType": "image/png",
  "generatedAt": "ISO-8601",
  "promptHash": "sha256",
  "notice": "AI-generated image; verify suitability before use."
}
```

圖片可使用同一 Response Binary＋metadata headers，或短生命週期的 server response；不得將完整圖片永久寫入公開檔案系統。

## 9. Prompt Presets

Native Preset 使用描述性名稱：

- `cinematic`：電影光線、景深、戲劇構圖；
- `anime-illustration`：日系動畫插畫、清晰線稿、細緻背景；
- `futuristic`：未來科技、霓虹、機械設計；
- `minimal-photography`：留白、自然光、乾淨構圖；
- `photorealistic`：寫實攝影、自然材質、清楚細節。

Prompt Enhancer：

- 完全 deterministic；
- 不呼叫 LLM；
- 不重複疊加；
- 顯示強化前／後文字；
- 使用者可復原；
- 不加入特定在世創作者姓名。

## 10. 安全與隱私

- `HF_TOKEN` 只讀取 `process.env.HF_TOKEN` 或既有中央 Secret Provider。
- 不把 Token 放進 URL、Client Bundle、Log 或 Error。
- 預設不保存完整 Prompt、Negative Prompt、圖片 Bytes 或 IP。
- Usage Event 只能保存 Prompt 長度／Hash、Mode、Provider、Model、Latency、Bytes 與狀態。
- Live Provider 的安全拒絕需原樣轉成安全摘要，不嘗試繞過 Provider Safety。
- 不提供任意模型、任意 URL、代理輪替、Safety Filter Bypass 或自動重試不同模型來繞過拒絕。

## 11. Native 頁面最低功能

- Demo／Live 模式切換；
- Prompt 與 Negative Prompt；
- Style Preset；
- Aspect Ratio；
- 固定／隨機 Seed；
- Deterministic Prompt Enhancer；
- Provider／Model Status；
- 預生成 Demo Gallery；
- 生成結果與 Metadata；
- Download（僅當前 Browser Session）；
- Fallback Notice；
- Responsible Use Notice；
- Source Python 與 Native 架構對照；
- 手機版無水平捲軸。

## 12. 課程

建立 `cosmos-text-to-image` 六段式課程，至少涵蓋：

- Text-to-Image 基本流程；
- Prompt、Negative Prompt、Seed 與 Aspect Ratio；
- Provider／Model ID 與模型身分；
- Server-only Token；
- Demo／Live／Fallback 的差異；
- MIME、Timeout、Bytes 與 Rate Limit；
- 生成內容的不確定性與使用限制；
- 至少 3 題測驗與解析。

## 13. 測試

最低測試：

- Preset 與 Aspect Ratio Allowlist；
- Prompt／Negative Prompt／Seed 邊界；
- 額外欄位與超量 Body；
- Browser Token／Model ID／URL 被拒絕；
- Demo Manifest SHA／MIME／尺寸／Alt Text；
- Demo 回應標示 `demo`；
- Live 無 Token 回 `fallback` 或明確 503，不得假稱 Live；
- Provider Timeout／401／429／5xx；
- 非圖片 MIME、無法解碼、過大 Bytes；
- 替代模型顯示實際 Model ID；
- Rate Limit；
- Client Bundle 不含 Token；
- Python `compileall`；
- Next.js Route Handler、TypeScript、Lint、Build。

CI 不得呼叫 Hugging Face、Unsplash 或其他遠端圖片來源。

## 14. Migration 狀態與退役門檻

完成 Source Inventory、Python 保存、Native Demo、Live Adapter、課程與測試後可設為 `refactoring`。

在以下項目完成前不可設為 `ready_to_retire`：

- 使用合法測試 Token 人工驗證來源指定模型；
- 確認 Provider／Model 實際可用性與輸出 metadata；
- 生成圖片下載與 RWD 驗收；
- 舊 Streamlit README 搬遷公告；
- 舊部署停止或導向；
- 使用者人工核准 Archived。