# ALP-MIG-001｜L4 線性迴歸完整移植

## 任務目標

將 `gshan1209-cell/L4` 的程式、相依、教學內容與互動功能正式接管到 AI-Learning-Portfolio，完成驗收後才允許舊 Repo 退役。

## 來源

```text
Repository: gshan1209-cell/L4
Branch: main
Entry: app.py
```

## 已完成

- [x] README 盤點
- [x] app.py 盤點
- [x] requirements.txt 盤點
- [x] 原始 Streamlit app.py 移入 `modules/linear-regression/python-streamlit/`
- [x] requirements 移入
- [x] 模組 README
- [x] migration.json
- [x] Native seeded random dataset
- [x] Native OLS fitting
- [x] Residual／Abs residual
- [x] Top K Outliers
- [x] React SVG chart
- [x] 指標卡與資料表

## 待完成

- [ ] 執行 `npm install`
- [ ] 執行 TypeScript／Build 檢查
- [ ] 瀏覽器操作驗收
- [ ] Python Streamlit 參考版啟動驗收
- [ ] 決定 CSV 與 PNG 匯出是否屬必要等價功能
- [ ] 更新 migration.json verification
- [ ] 將狀態改為 `verifying`
- [ ] 驗收通過後更新舊 Repo 搬遷公告
- [ ] 使用者核准後封存舊 Repo

## 驗收重點

1. 相同 seed 應產生相同資料。
2. OLS 擬合結果應合理接近 true slope／intercept。
3. 雜訊提高時誤差指標通常上升。
4. Top K Outliers 數量與選擇一致。
5. fitted 與 manual 模式可切換。
6. 手機與桌面均可操作。
7. 不含 API Key、Token、`.env` 或個資。

## 退役限制

在下列條件完成前，禁止封存 `gshan1209-cell/L4`：

- Runtime 驗收完成
- 功能差異獲接受
- 舊 Repo README 搬遷公告完成
- 舊 Streamlit 部署處理完成
- 使用者人工核准
