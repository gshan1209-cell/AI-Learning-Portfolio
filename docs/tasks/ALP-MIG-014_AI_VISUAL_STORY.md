# ALP-MIG-014｜AI Visual Story 圖文小說播放器

## 1. 任務目標

將 `gshan1209-cell/L2DOC1-github` 公開展示版中保留的 HW1 圖文小說播放器移植進 AI-Learning-Portfolio，保存 12 幕故事 JSON、圖片、展示影片與播放器邏輯，建立 Native React Player、版本化 Asset Manifest、可存取播放控制與離線展示。

來源 Repository 已明確移除私有 Backend、Editor、Prompt、API 與 Upload 系統；本 Migration **不得猜測或重建已移除的私有功能**。

## 2. 固定來源

- Repository：`gshan1209-cell/L2DOC1-github`
- Branch：`main`
- Commit：`07c40f377f2e7fdee8d3ce9b69c9dade26792699`
- Source Runtime：Static HTML／CSS／JavaScript／GitHub Pages
- Source Story：`小王子與銀色之花`
- Source Files：
  - `HW1/indexHw1.html`
  - `HW1/default_novel.json`
  - `uploads/story1.png`～`story12.png`
  - `uploads/929ca1fb907446cb858d0cd639c9db68.mp4`

## 3. 來源邊界與已知問題

Native 版本需保存來源行為，但修正以下問題：

1. Source Player 依賴 Font Awesome CDN；Native 不應依賴第三方 CDN 才能顯示控制按鈕。
2. `default_novel.json` 使用外部 SoundHelix BGM URL，Build／Runtime 無法離線保證，且顯示名稱與實際音檔權利／曲目未充分對應。
3. Source JSON 使用任意 URL 欄位；Native 必須改成 Asset ID Allowlist。
4. 圖片與影片缺少完整 SHA-256、MIME、尺寸、Alt Text 與 rights status。
5. Source Player 的文字、轉場與 Duration 尚未經 Schema 驗證。
6. `body overflow:hidden` 與固定 Viewport Player 需補鍵盤、Focus、Reduced Motion、Screen Reader 與小螢幕驗收。
7. Autoplay／BGM 必須遵守 Browser User Gesture，不可預設自動播放有聲音媒體。

## 4. 目標模組

```text
modules/ai-visual-story/
├── README.md
├── migration.json
├── source-reference/
├── assets/
│   ├── images/
│   ├── video/
│   ├── audio/
│   └── asset-manifest.json
├── stories/
│   └── silver-flower-prince.json
├── artifacts/
│   └── story-index.json
└── scripts/
    ├── build_asset_manifest.py
    └── verify_asset_manifest.py

public/responsible-ai-lab/visual-story/
├── images/
├── video/
└── audio/
```

Native 程式：

```text
src/lib/responsible-ai-lab/visual-story/
├── story-schema.ts
├── story-registry.ts
├── asset-manifest.ts
├── player-state.ts
├── transition-policy.ts
└── types.ts

src/components/responsible-ai-lab/visual-story/
├── visual-story-player.tsx
├── story-stage.tsx
├── story-caption.tsx
├── story-progress.tsx
├── playback-controls.tsx
├── audio-controls.tsx
├── start-overlay.tsx
└── asset-info-panel.tsx

src/app/responsible-ai-lab/visual-story/page.tsx
src/app/api/responsible-ai-lab/visual-stories/route.ts
src/app/api/responsible-ai-lab/visual-stories/[slug]/route.ts
```

## 5. Source Inventory 與保存

至少保存：

- README；
- `index.html`、`static/index.html`；
- `HW1/index.html`、`HW1/indexHw1.html`；
- `HW1/default_novel.json`；
- 12 張故事圖片；
- Intro Video；
- Source CSS／JS 播放邏輯；
- Source Demo Screenshot；
- `.gitignore`；
- GitHub Pages 路徑與部署說明。

`migration.json` 必須記錄：

- Source Public Edition 的功能邊界；
- 已移除功能清單；
- imported／excluded assets；
- Binary Asset Hash；
- 外部 BGM 未直接採用的理由；
- Source／Native 功能對照；
- Rights Verification 狀態；
- 舊 GitHub Pages URL。

## 6. Story Schema

Native Story 不使用任意 URL，使用 Asset ID：

```json
{
  "slug": "silver-flower-prince",
  "title": "小王子與銀色之花",
  "version": "1.0.0",
  "language": "zh-Hant",
  "introVideoAssetId": "intro-video",
  "bgmAssetId": null,
  "slides": [
    {
      "id": "slide-story-1",
      "type": "image",
      "assetId": "story-01",
      "altText": "銀色花朵在星光下發出微光",
      "text": "第一幕……",
      "durationSeconds": 7,
      "transition": "fade"
    }
  ],
  "sourceRepository": "gshan1209-cell/L2DOC1-github",
  "sourceCommit": "07c40f377f2e7fdee8d3ce9b69c9dade26792699",
  "rightsNotice": "Source repository assets; rights status recorded in asset manifest."
}
```

固定驗證：

- `slug`：`^[a-z0-9-]{3,80}$`；
- title：1～120 字元；
- slides：1～50；
- slide ID：唯一且符合固定格式；
- type：`image|video`；
- assetId：必須存在於 Manifest；
- text：0～2000 字元；
- altText：圖片必填，1～300 字元；
- durationSeconds：2～60；
- transition：`none|fade|slide-in|zoom-in`；
- 不接受 HTML、Script、Style、URL、Path 或 Callback；
- 不以 `dangerouslySetInnerHTML` 渲染故事文字。

## 7. Asset Manifest

建立版本化：

```text
modules/ai-visual-story/assets/asset-manifest.json
```

每筆至少記錄：

- assetId；
- kind：`image|video|audio`；
- sourcePath；
- publicPath；
- fileName；
- sha256；
- bytes；
- mimeType；
- width／height（圖像／影片）；
- durationSeconds（影片／音訊）；
- altText／description；
- sourceRepository；
- sourceCommit；
- rightsStatus：`verified|source-repository-only|unknown|excluded`；
- rightsNote；
- importedAt；
- usedByStories。

驗證器必須確認：

- 檔案存在；
- Hash 一致；
- MIME 與副檔名一致；
- 圖片可解碼；
- Asset ID 唯一；
- Story 引用完整；
- 未被 Story 使用的 Binary Asset 有文件化理由；
- 不存在 `http://`／`https://` Runtime Asset URL。

## 8. BGM 與音訊策略

- 預設 Silent，播放器不需要 BGM 也能完整操作。
- 不直接依賴 Source 外部 SoundHelix URL。
- 如有權利清楚的本地 BGM，可移入 `assets/audio/` 並加入 Manifest。
- 無法確認權利時將 BGM 設為 `null`，並在 migration 文件記錄 excluded。
- 音訊只在使用者按下「開始播放」後載入／播放。
- 提供 Mute／Volume／Pause。
- 音訊載入失敗不得中止故事播放。
- 不把外部曲目錯誤標示成「卡農」或其他未核實曲名。

## 9. Native Player 狀態

建立純函式 Player State：

```text
idle → ready → playing ↔ paused → ended
```

事件：

- `START`；
- `PLAY`；
- `PAUSE`；
- `NEXT`；
- `PREVIOUS`；
- `SEEK_SLIDE`；
- `SLIDE_TIMEOUT`；
- `RESTART`；
- `MEDIA_ERROR`；
- `SET_REDUCED_MOTION`；
- `SET_MUTED`／`SET_VOLUME`。

規則：

- Index 不得小於 0 或超過最後一幕；
- `NEXT` 到最後一幕後進入 `ended`；
- `PREVIOUS` 在第一幕保持 0；
- Pause 清除 Timer；
- Slide 變更需重設 Caption／Progress Timer；
- Manual Navigation 不產生重複 Timer；
- 媒體失敗顯示 fallback panel，字幕與控制仍可使用。

## 10. 播放與顯示功能

最低功能：

- Start Overlay；
- Intro Video（可跳過）；
- 12 幕圖片播放；
- Typewriter Caption，可關閉；
- Play／Pause／Previous／Next／Restart；
- Slide Counter；
- Progress Bar；
- Slide List／Seek；
- Fullscreen（Browser 支援時）；
- Mute／Volume（有音訊時）；
- Loading／Media Error；
- Source／Asset Info；
- Story JSON／Player Architecture 教學；
- 手機、平板、桌面版；
- 不遮擋圖片主要內容。

## 11. Accessibility

- 所有控制有可讀 Label；
- 支援鍵盤：
  - Space：Play／Pause；
  - ArrowLeft／ArrowRight：Previous／Next；
  - Home／End：First／Last；
  - Escape：退出 Fullscreen／Overlay；
- Focus Visible；
- Caption 使用 `aria-live="polite"`；
- 圖片有 Alt Text；
- Video 提供描述文字；
- `prefers-reduced-motion` 時：
  - 停用 Zoom／Slide 動畫；
  - Typewriter 改為立即顯示或提供切換；
  - 保留 Fade 或 `none`；
- 提供 Pause 所有自動移動內容；
- 色彩對比與文字縮放驗收；
- 200% Zoom 不產生不可操作內容。

## 12. Asset Loading

- 第一幕與目前幕優先載入；
- Preload 下一幕，避免一次載入全部大圖；
- 不透過遠端 URL Preload；
- 圖像使用固定 width／height 避免 Layout Shift；
- Video 使用 `preload="metadata"`；
- 失敗時顯示本地 Placeholder 與 Alt Text；
- 不因單一圖片、影片或音訊錯誤中止 Player。

## 13. API

### `GET /api/responsible-ai-lab/visual-stories`

回傳 Story Index：

- slug；
- title；
- version；
- slideCount；
- language；
- thumbnailAssetId；
- sourceCommit；
- rightsStatus Summary。

### `GET /api/responsible-ai-lab/visual-stories/[slug]`

規則：

- Slug 必須符合格式並存在 Registry；
- 不接受 Path Traversal；
- 不接受 File Path／URL Query；
- 回傳 Story Schema 與必要 Asset Metadata；
- 不回傳本機 source path；
- `Cache-Control` 使用版本化 public cache；
- 不存在回 404。

Binary Assets 由本地 `public` 路徑提供，不建立任意檔案 Proxy API。

## 14. Native 頁面責任標示

頁面需說明：

- 這是來源公開展示版的播放器移植；
- 未重建來源已移除的 Editor／Backend／Upload；
- 故事與素材來源 Commit；
- Asset Rights Status；
- AI 參與程度如來源未提供完整 metadata，必須標示「來源未完整記錄」，不可自行推定；
- External BGM 未納入時的原因。

## 15. 課程

建立 `ai-visual-story` 六段式課程，至少涵蓋：

- Story JSON 與 Schema；
- Asset Manifest 與 Hash；
- Player State Machine；
- Browser Autoplay／User Gesture；
- Timer 與 Cleanup；
- Preload 與 Error Fallback；
- Caption、Alt Text、Keyboard、Reduced Motion；
- 素材權利與來源追溯；
- Static HTML 到 React Native Player 的遷移；
- 至少 3 題測驗與解析。

## 16. 測試與 CI

最低測試：

- Story JSON Schema；
- 12 幕完整且 ID 唯一；
- Duration／Transition Allowlist；
- Asset Manifest Hash／MIME／尺寸／Alt Text；
- Story Asset 引用完整；
- 無任意 HTTP URL；
- External BGM 不作必要 Runtime；
- API 正常／404／非法 Slug／Path Traversal；
- Player State START／PLAY／PAUSE／NEXT／PREVIOUS／END／RESTART；
- Timer Cleanup；
- Media Error Fallback；
- Reduced Motion；
- Keyboard Mapping；
- Caption 與 ARIA；
- TypeScript、Lint、Build；
- `python modules/ai-visual-story/scripts/verify_asset_manifest.py`。

CI 不得呼叫 GitHub Pages、SoundHelix、CDN 或任何遠端媒體。

## 17. Migration 狀態與退役門檻

完成 Source Inventory、Binary Assets、Manifest、Native Player、課程與測試後可設為 `refactoring`。

以下完成前不可設為 `ready_to_retire`：

- 12 張圖片與 Intro Video 人工播放驗收；
- 手機、鍵盤、Screen Reader、Reduced Motion 驗收；
- Asset Rights Status 人工確認；
- GitHub Pages 導向／停止；
- Source README 搬遷公告；
- 使用者人工核准 Archived。