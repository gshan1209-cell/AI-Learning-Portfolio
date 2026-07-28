# ALP-MIG-002｜CWA OpenData 完整移植

## 任務目標

將 `gshan1209-cell/cwa_scraper` 的 Python CLI、CWA File API 呼叫、參數與預覽功能接管到 AI-Learning-Portfolio，完成驗收後才允許舊 Repo 退役。

## 來源

```text
Repository: gshan1209-cell/cwa_scraper
Branch: main
Entry: cwa_scraper.py
Dependencies: requests, python-dotenv
```

## 已完成

- [x] README、CLI 與 requirements 盤點
- [x] 保存來源 blob SHA
- [x] 原始 Python CLI 移入 `modules/cwa-open-data/python-cli/`
- [x] requirements 移入
- [x] 模組 README 與 `migration.json`
- [x] `CWA_API_KEY` 改為 Server-only Secret
- [x] 新增 `/api/modules/cwa-open-data`
- [x] Dataset ID 與 JSON／XML 格式驗證
- [x] 教學模擬回應
- [x] Native CWA Playground
- [x] 課程 Demo 從 external 改為 native
- [x] 即時 API 401、404、上游錯誤處理
- [x] Content-Disposition 下載檔名

## 待完成

- [ ] 執行 Next.js Build／TypeScript 檢查
- [ ] 瀏覽器操作驗收
- [ ] 使用測試用 CWA_API_KEY 驗證即時 JSON
- [ ] 驗證即時 XML 與下載檔名
- [ ] Python CLI 參考版啟動驗收
- [ ] 檢查 API 回應是否需要額外裁切或快取
- [ ] 更新 `migration.json` verification
- [ ] 將狀態改為 `verifying`
- [ ] 驗收通過後更新舊 Repo 搬遷公告
- [ ] 使用者核准後封存舊 Repo

## 驗收重點

1. Sample 模式不需要 API Key，也不呼叫外部服務。
2. Live 模式的 API Key 不可出現在前端、Log 或錯誤回應。
3. Dataset ID 不合法時回傳 400。
4. Format 只允許 JSON 或 XML。
5. 未設定 Secret 時 Live 模式回傳明確 503。
6. 401、404 與上游錯誤需轉為安全、可理解的訊息。
7. JSON 與 XML 應提供合理的 Content-Type／Content-Disposition。
8. 舊 Repo 尚未核准前不得 Archived。
