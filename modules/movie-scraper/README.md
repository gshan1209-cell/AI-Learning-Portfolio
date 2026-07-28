# Movie Scraper Module｜電影資料擷取與來源治理模組

## 來源資訊

- **來源 Repo**：`gshan1209-cell/scrape_movie`
- **固定 Branch**：`main`
- **固定 Commit**：`f3e0b48074c91adab5b92879b011e9ace805581a`
- **來源 Runtime**：Next.js 15 / React 19 / TypeScript / Server-side HTTP Scraper
- **資料來源**：Scrape Center (`https://ssr1.scrape.center`), @movies 開眼電影網 (`https://www.atmovies.com.tw`)

## 模組說明

本模組展示受控的伺服器端網頁擷取 (Server-side Web Scraping)、HTML Parser 正規化、版本化 Snapshots、Allowlist 安全防禦與快取機制。預設使用離線版本化 Snapshot 進行教學與示範，亦支援可選的 Server-only Live Mode。

## 目錄結構

```text
modules/movie-scraper/
├── README.md
├── migration.json
├── source-reference/
├── fixtures/
│   ├── atmovies/
│   └── scrape-center/
├── snapshots/
└── artifacts/
```

## Native 入口

- 頁面：`/applied-web-systems/movie-scraper`
- API：`GET /api/web-lab/movies`
