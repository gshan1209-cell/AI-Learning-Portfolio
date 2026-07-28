# Agri Weather Dashboard Module｜農事天氣儀表板與風險提醒模組

## 來源資訊

- **來源 Repo**：`gshan1209-cell/scrape_weather`
- **固定 Branch**：`main`
- **固定 Commit**：`788311e505d9231378f55e093a7f1e791266693d`
- **來源 Runtime**：Next.js App Router / FastAPI / Pydantic / Leaflet / CWA OpenData
- **地圖**：Leaflet + OpenStreetMap (Client Component 動態載入)

## 模組說明

本模組整合 CWA 中央氣象署一週預報與測站資料，並結合資料化版本控管的農事風險規則 JSON (`agri-risk-rules.json`)，為水稻、高麗菜、水果等作物提供高溫、低溫、豪雨與強風風險提醒。主要 API 重用既有 ALP-MIG-002 CWA Client，API Key 為 Server-only，不外洩至前端 Bundle。

## 目錄結構

```text
modules/agri-weather-dashboard/
├── README.md
├── migration.json
├── source-reference/
├── python-reference/
├── rules/
│   └── agri-risk-rules.json
├── fixtures/
├── snapshots/
└── artifacts/
```

## Native 入口

- 頁面：`/applied-web-systems/agri-weather`
- API：
  - `GET /api/web-lab/weather/weekly`
  - `GET /api/web-lab/weather/advisory`
  - `GET /api/web-lab/weather/stations`
