# ALP-MIG-009｜電影資料擷取與來源治理

## 任務目標

將 `gshan1209-cell/scrape_movie` 的 Next.js 電影資料收集工作台移植進 AI-Learning-Portfolio，建立可離線驗證、具來源追溯、快取與合理擷取規則的 Native 教學模組。

## 固定來源

- Repository：`gshan1209-cell/scrape_movie`
- Branch：`main`
- Commit：`f3e0b48074c91adab5b92879b011e9ace805581a`
- 來源 Runtime：Next.js 15／React 19／TypeScript／Node.js server-side scraper
- 來源資料：Scrape Center、@movies 開眼電影網

## 目前狀態

**`planned`**

## 來源功能盤點

必須盤點並保存：

- monorepo／workspace 設定；
- `/api/movies`；
- `getMovies()`、source allowlist 與 view normalization；
- Scrape Center parser；
- @movies parser；
- 電影型別與正規化規則；
- 分類、分頁、view；
- 主儀表板與客服機器人；
- Tailwind／shadcn 設定；
- README、部署與測試方式。

來源目前會將上游 error message 直接回傳，移植時必須改成受控錯誤，不得洩漏上游 HTML、selector 或內部堆疊。

## 目標模組

```text
modules/movie-scraper/
├── README.md
├── migration.json
├── source-reference/
├── fixtures/
│   ├── atmovies/
│   └── scrape-center/
├── snapshots/
├── scripts/
└── artifacts/
```

Native 程式：

```text
src/lib/web-lab/movie-scraper/
├── adapters/
├── parsers/
├── normalize.ts
├── snapshots.ts
├── cache.ts
├── policy.ts
└── types.ts

src/app/applied-web-systems/movie-scraper/page.tsx
src/app/api/web-lab/movies/route.ts
```

## 完成需求

### 1. 來源保存與 Inventory

- 建立 `migration.json`。
- 保存必要來源碼，不得只複製 UI。
- 每個 imported／excluded 檔案需記錄理由。
- 固定來源 commit，不得只寫 `main latest`。

### 2. 電影資料 schema

最低欄位：

- `id`；
- `title`；
- `originalTitle`（如來源有提供）；
- `genres`；
- `durationMinutes`；
- `releaseDate`；
- `rating`；
- `posterUrl`；
- `source`；
- `sourceUrl`；
- `fetchedAt`；
- `dataMode`。

缺少欄位時使用 `null`，不得以猜測值補齊。

### 3. Snapshot 與 Fixture

- 為兩個來源保存合法、最小化 HTML fixture。
- fixture 不得包含完整頁面不必要內容。
- 產生版本化 JSON snapshot。
- snapshot 記錄來源、擷取日期、schemaVersion、hash 與資料筆數。
- 預設 Native Demo 使用 snapshot。

### 4. Parser

- parser 必須使用 fixture 測試。
- HTML 結構缺少海報、評分、片長或日期時不得崩潰。
- 清理空白、HTML entity 與不可信字串。
- 不渲染來源 HTML。
- 來源 URL 必須驗證為固定 host。

### 5. Live 擷取

Live 模式為選用功能：

- 僅 server-side；
- 固定 host allowlist；
- URL 由內部模板生成；
- timeout 5～8 秒；
- response size 上限建議 2 MB；
- 最多一次受控重試；
- 快取與基本 rate limit；
- 遵守來源 robots／條款；
- 來源政策不允許時停用該來源 live，只保留 snapshot 教學。

不得實作：

- 任意 URL；
- proxy rotation；
- CAPTCHA／登入繞過；
- 指紋規避；
- 大量並行抓取；
- 完整影評、字幕、影片或付費內容擷取。

### 6. API

`GET /api/web-lab/movies`

允許參數：

- `source=atmovies|scrape-center`；
- `page`：1～100；
- `category`：長度上限與允許字元；
- `view=new|now|next`；
- `mode=snapshot|live`。

規則：

- 未知 source／view／mode 回 400，不可默默改成其他來源。
- 上游失敗時回 snapshot fallback 與清楚 metadata。
- 回應包含 `Cache-Control`。
- 錯誤不得回傳上游 body、stack 或內部路徑。

### 7. Native 頁面

頁面需提供：

- source、view、category、page 切換；
- 電影卡片；
- data mode、來源與新鮮度標示；
- snapshot／live 差異；
- parser pipeline 圖解；
- server/client 邊界；
- 負責任擷取與著作權提醒；
- 來源失敗時 fallback 狀態。

客服機器人可保留為教學導覽，但不得接收任意 URL、執行爬蟲指令或偽裝成生成式 AI。

### 8. 課程

建立 `movie-scraper-nextjs` 六段式課程，至少涵蓋：

- 為什麼爬蟲應在伺服器端；
- HTML parser 與 schema normalization；
- timeout、cache、rate limit、fallback；
- robots、使用條款與著作權；
- 3 題以上測驗與解析。

## 測試

最低測試：

- 兩種 fixture parser；
- 缺欄位容錯；
- source／view／page／category 驗證；
- source host allowlist；
- timeout／oversize／upstream failure；
- snapshot fallback metadata；
- API 不洩漏上游內容；
- Native 頁面資料載入。

CI 不得連線外部電影網站。

## 退役門檻

在以下項目完成前保持 `refactoring`：

- 兩個來源 fixture 與 snapshot 可重現；
- Native 頁面與 API 驗收；
- live 擷取政策確認；
- 舊 Vercel 導向或停止；
- 來源 README 搬遷公告；
- 使用者人工核准 Archived。