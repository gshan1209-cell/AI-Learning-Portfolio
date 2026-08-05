# Drive 原生資產與分享權限整理

日期：2026-08-05  
專案：AI-Learning-Portfolio

## 已完成

- 將 13 門課程的 `.pptx` 簡報轉換為原生 Google Slides。
- 將 13 門課程的 `.html` 影片設計稿轉換為原生 Google Docs。
- 每門課程新增 `exports/`，保留舊格式檔案作為匯出備份。
- 正式課程資料夾只保留原生簡報、原生影片稿、NotebookLM 提示語與重點圖卡。
- 更新 GitHub Asset Registry，改用 26 筆新的原生檔案 ID。
- 資產測試新增原生 MIME Type、Google Slides／Docs URL 與舊副檔名檢查。

## 驗證標準

每門課程必須符合：

- `presentation.mimeType` 為 `application/vnd.google-apps.presentation`
- `videoDesign.mimeType` 為 `application/vnd.google-apps.document`
- 簡報網址使用 `/presentation/d/`
- 影片稿網址使用 `/document/d/`
- 正式資產名稱不包含 `.pptx` 或 `.html`
- 56 筆核心資產 ID 不重複

## 分享權限現況

Drive 專案根目錄與 `courses` 資料夾目前只有擁有者權限，尚未設定「知道連結的任何人可檢視」。

目前連線工具只支援：

- 分享給指定使用者
- 分享給 Google Workspace 公司網域

它不支援個人 Gmail 的「知道連結的任何人」權限，因此此項不能由自動化工具安全完成，也不應誤設為公司網域分享。

## 需要人工完成的設定

在 Google Drive 對 `AI-Learning-Portfolio` 專案根目錄設定：

1. 開啟「共用」。
2. 將一般存取權改為「知道連結的任何人」。
3. 權限選擇「檢視者」。
4. 確認子資料夾與檔案可沿用或逐項補齊權限。
5. 使用無痕視窗驗證課程圖卡、簡報、NotebookLM 提示語與影片設計稿。
