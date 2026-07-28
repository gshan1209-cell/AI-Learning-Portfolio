# Codex 執行指令｜Migration Wave 003 Applied Web Systems

請在 Repository `gshan1209-cell/AI-Learning-Portfolio` 執行第三波來源移植。

## 工作分支

直接使用既有分支：

`codex/migration-wave-3-applied-web-systems`

開始前先同步最新 `main`。如有衝突，保留目前 Wave 003 任務文件、主線既有功能、Regression Lab 與既有 CWA OpenData 能力。

## 必讀文件

依序閱讀：

1. `AGENT.md`
2. `docs/tasks/ALP-MIG-WAVE-003_APPLIED_WEB_SYSTEMS.md`
3. `docs/tasks/ALP-MIG-009_MOVIE_SCRAPER.md`
4. `docs/tasks/ALP-MIG-010_AGRI_WEATHER_DASHBOARD.md`
5. `docs/tasks/ALP-MIG-011_DJANGO_BLOG.md`
6. `docs/tasks/ALP-MIG-002_CWA_OPEN_DATA.md`（如實際檔名不同，搜尋 ALP-MIG-002）
7. `docs/migrations/SOURCE_REPOSITORY_MIGRATION.md`
8. `DEVELOPMENT_RECORD.md`
9. `migration_registry/migrations.json`
10. `repository_registry/repositories.json`
11. `course_demo_registry/demo_registry.json`

以上文件是完成定義。不得把 Native Demo 縮減為 iframe、外部連結、純截圖、固定答案或假 Runtime。

## 固定來源 Repository 與 Commit

- ALP-MIG-009：`gshan1209-cell/scrape_movie@f3e0b48074c91adab5b92879b011e9ace805581a`
- ALP-MIG-010：`gshan1209-cell/scrape_weather@788311e505d9231378f55e093a7f1e791266693d`
- ALP-MIG-011：`gshan1209-cell/2026-DjangoBlog@eb900202f0d791951a26b6ea1767d15e69cde9ac`

必須依固定 commit 盤點，不可只記錄「main 最新版」。如來源 main 後續有新提交，先記錄差異，不要未經說明改用不同 commit。

## 工作原則

1. 不得任意刪除既有功能、課程、Registry、Migration、Prompt、測試或 CI。
2. 發現問題直接修正，不只產生報告。
3. 不提交 API Key、Token、Cookie、Django SECRET_KEY、管理員密碼、真實 SQLite 個資資料庫或 `.env`。
4. 不封存、不停止、不刪除任何來源 Repo 或舊部署。
5. Build／CI 不得呼叫外部電影網站、CWA 或 Windy。
6. Live 外部資料只能是可選 server-side 模式，預設體驗必須可離線使用。
7. 不用 Next.js 假裝 Django Runtime；真實 Django 必須保留並執行 Python 檢查。
8. 不建立任意 URL 爬蟲、SSRF 入口、任意 tile URL、任意 script URL 或任意 Python import path。

## 執行順序

### Phase A｜來源 Inventory 與保存

針對三個來源：

1. 讀取 README、入口、package／requirements、設定、API、測試、部署與資料來源。
2. 建立模組目錄與 `migration.json`。
3. 保存必要原始程式於 `source-reference/` 或 `python-reference/`。
4. 逐檔記錄 imported／excluded 與理由。
5. 記錄固定來源 commit、Runtime、Secret、外部依賴與舊部署。
6. 開始移入後，Migration Registry 狀態更新為 `importing`。

### Phase B｜Applied Web Systems 共用層

建立：

```text
src/lib/web-lab/
src/components/web-lab/
src/app/applied-web-systems/page.tsx
```

最低共用能力：

- provenance metadata；
- snapshot／live／fallback mode；
- data hash／snapshot version／freshness；
- server-only adapter 合約；
- allowlist、timeout、response size、cache key；
- error normalization；
- schema／request lifecycle 教學元件。

不得把電影 selector、農事規則或 Django model 欄位放進共用層。

### Phase C｜ALP-MIG-009 Movie Scraper

1. 保存兩個來源 adapter、parser、型別與 UI。
2. 建立最小化、合法 HTML fixtures。
3. 產生版本化 JSON snapshots。
4. parser 必須處理缺欄位與 HTML entity。
5. 建立 `/applied-web-systems/movie-scraper`。
6. 建立 `GET /api/web-lab/movies`。
7. 預設 snapshot，live 為 server-only 選用模式。
8. 固定 host allowlist、timeout、2 MB response 上限、有限重試、cache 與 rate limit。
9. 上游失敗時 fallback，且 UI／API 誠實標示資料模式。
10. 不回傳上游 HTML、stack、selector 或內部路徑。
11. 不實作任意 URL、代理輪替、CAPTCHA／登入繞過、指紋規避或大量並行抓取。
12. 檢查 robots／使用條款；不允許 live 的來源只保留 snapshot 教學。

### Phase D｜ALP-MIG-010 Agri Weather Dashboard

1. 先盤點並重用既有 ALP-MIG-002 CWA server client、Secret、parser、timeout 與 schema。
2. 不建立第二套 `CWA_API_KEY` 管理。
3. 保存 FastAPI、Pydantic、mock fallback、advisory 與地圖來源。
4. 建立版本化 weekly／stations snapshots。
5. 建立資料化農事風險規則 JSON。
6. 建立 `/applied-web-systems/agri-weather`。
7. 建立：
   - `GET /api/web-lab/weather/weekly`
   - `GET /api/web-lab/weather/advisory`
   - `GET /api/web-lab/weather/stations`
8. city／district／crop 必須驗證，不接受任意 CWA dataset ID 或 URL。
9. Leaflet 必須是 Client Component／dynamic import，SSR 不得碰 `window`。
10. 預設 Leaflet + OpenStreetMap；Windy 不作主要依賴。
11. 無 key、timeout 或 provider failure 時使用 snapshot／fallback。
12. CWA key 不得進 Client Bundle。
13. 原 ALP-MIG-002 測試與功能不得回歸。

### Phase E｜ALP-MIG-011 Django Blog

1. 保存完整 Django Project、article App、templates、migrations、requirements 與文件。
2. 建立虛構 fixture，不提交真實 SQLite 個資資料庫。
3. 修正／文件化 SECRET_KEY、DEBUG、ALLOWED_HOSTS、CSRF、XSS 與 timezone。
4. Post slug 使用唯一性或明確衝突策略，修改 model 時建立 migration。
5. 建立文章 list／detail、404、admin、template escaping 與 Django tests。
6. 由 Python 受控 script 產生 schema、URL map、template map 與 fixture artifact，不得手工偽造。
7. 建立 `/applied-web-systems/django-blog` Native 教學鏡像。
8. 建立唯讀：
   - `GET /api/web-lab/django-blog/schema`
   - `GET /api/web-lab/django-blog/posts`
   - `GET /api/web-lab/django-blog/posts/[slug]`
9. Native 頁面清楚標示它不是 Django Runtime。
10. 不開放未認證的文章新增、修改或刪除 API。
11. 真實 Django 必須通過 check、migration check 與 tests。

### Phase F｜課程與 Registry

1. 新增三個六段式課程 chunk：
   - `movie-scraper-nextjs`
   - `agri-weather-dashboard`
   - `django-blog-basics`
2. 每課至少 3 題測驗與解析。
3. 更新 Course／Demo／Repository／Migration Registry。
4. Native Demo 必須從課程頁可到達。
5. 完成來源保存、Native 基礎與測試後，狀態才可更新為 `refactoring`。
6. 不得更新為 `ready_to_retire` 或 `retired`。

### Phase G｜測試

優先沿用專案既有測試基礎，不建立互相競爭的測試框架。

#### Movie

- 兩種 fixture parser；
- 缺欄位；
- source／view／category／page／mode；
- host allowlist；
- timeout／oversize／upstream failure；
- fallback metadata；
- API 不洩漏上游內容。

#### Weather

- weekly／stations fixture parser；
- city／district／crop；
- 農事規則 golden cases；
- 無 key／timeout／empty stations；
- snapshot／live／fallback；
- Leaflet client boundary；
- 三支 API；
- ALP-MIG-002 regression tests。

#### Django

- `manage.py check`；
- `makemigrations --check --dry-run`；
- Post model／ordering／slug；
- list／detail／404；
- template escaping；
- fixture；
- admin；
- schema artifact 與 Native API 一致。

## CI

更新 CI，至少執行：

```bash
npm ci
npm run prisma:generate
npm run lint
npx tsc --noEmit
npm run test
npm run build
python -m compileall modules/django-blog/python-reference
python modules/django-blog/python-reference/manage.py check
python modules/django-blog/python-reference/manage.py makemigrations --check --dry-run
python modules/django-blog/python-reference/manage.py test
```

另需對來源 Python 執行必要 `compileall`／pytest。

CI 限制：

- 不需要真實 Secret；
- 不呼叫外網；
- 不啟動正式資料庫 migration；
- 不將測試 SQLite 提交；
- 不因外部服務失敗而跳過核心測試；
- 不因測試失敗而關閉或刪除測試。

## 文件更新

更新：

- `DEVELOPMENT_RECORD.md`
- `README.md`（需要時）
- Wave 003 與三份 ALP-MIG 文件
- `migration_registry/migrations.json`
- `repository_registry/repositories.json`
- `course_demo_registry/demo_registry.json`

記錄：

- 實際來源 commit；
- imported／excluded；
- 執行命令；
- 測試結果；
- snapshot 版本與 hash；
- live 尚待人工驗證項目；
- 三個 Migration 最終狀態。

## 交付

完成後提交並 Push 同一分支，建立 Pull Request 到 `main`。

PR 標題：

`feat: 移植 Applied Web Systems 三個模組`

PR 說明至少包含：

- 三個來源 Inventory；
- 共用能力層；
- Movie parser、snapshot、來源政策與 fallback；
- Weather 與 ALP-MIG-002 共用狀態；
- 農事規則與地圖；
- Django 真實 Runtime 與 Native 鏡像界線；
- 測試與 CI；
- 尚待 live／Secret／人工瀏覽器驗證；
- 三個 Migration 狀態。

不要自動合併 PR，完成後等待驗收。