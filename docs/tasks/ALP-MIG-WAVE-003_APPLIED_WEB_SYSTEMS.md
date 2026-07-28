# ALP Migration Wave 003｜Applied Web Systems Lab

## 1. 波次目標

本波次推進三個不同技術類型的來源 Repository，建立「外部資料擷取、資料治理、地圖呈現、後端框架理解」的共用教學能力，同時維持三個獨立 Migration、課程與退役門檻。

| Migration | 來源 Repository | 固定來源 Commit | 新模組 | 核心定位 |
|---|---|---|---|---|
| ALP-MIG-009 | `gshan1209-cell/scrape_movie` | `f3e0b48074c91adab5b92879b011e9ace805581a` | `modules/movie-scraper` | 受控網頁擷取、資料正規化、來源追溯與快取 |
| ALP-MIG-010 | `gshan1209-cell/scrape_weather` | `788311e505d9231378f55e093a7f1e791266693d` | `modules/agri-weather-dashboard` | CWA 一週預報、農事風險、地圖與備援資料 |
| ALP-MIG-011 | `gshan1209-cell/2026-DjangoBlog` | `eb900202f0d791951a26b6ea1767d15e69cde9ac` | `modules/django-blog` | Django Model／View／Template／Admin 與請求生命週期 |

本波次命名為 **Applied Web Systems Lab**。三個模組可共用資料來源標示、版本化 snapshot、伺服器端快取、輸入驗證、狀態提示與教學元件；不得把三個來源專案合併成單一不可拆分產品。

## 2. 固定架構

### 2.1 共用能力層

建立或擴充：

```text
src/lib/web-lab/
├── adapters/
├── cache/
├── provenance/
├── snapshots/
├── validation/
├── request-policy/
└── types.ts

src/components/web-lab/
├── source-provenance-card.tsx
├── data-mode-badge.tsx
├── freshness-indicator.tsx
├── fallback-notice.tsx
├── request-lifecycle.tsx
├── schema-table.tsx
├── code-path-viewer.tsx
└── learning-checkpoint.tsx
```

共用層僅保存通用能力：

- server-only 外部來源 adapter 合約；
- snapshot／live／fallback 模式標示；
- 資料來源、擷取時間、來源 URL 與版本資訊；
- allowlist、timeout、response size、cache 與 error normalization；
- JSON schema 與輸入驗證；
- 教學用 request lifecycle 元件。

來源網站 selector、農事規則、Django 模型欄位等專案特有邏輯，必須留在各自模組。

### 2.2 Native 頁面

建立：

- `/applied-web-systems`：三個模組入口、學習路線與共用概念。
- `/applied-web-systems/movie-scraper`：電影資料擷取、正規化、分類與來源追溯。
- `/applied-web-systems/agri-weather`：一週天氣、農事風險與台灣地圖。
- `/applied-web-systems/django-blog`：Django MVT、資料模型、路由與請求生命週期。

既有 `/courses/[slug]` 必須能導向相對應 Native Demo。主要學習流程不得依賴舊 Vercel、FastAPI、Django 伺服器或外部網站才能完成。

## 3. Runtime 策略

### 3.1 來源保存

每個來源 Repository 的必要程式、設定、測試、文件與資料，保存於：

```text
modules/<module-slug>/source-reference/
```

Python 專案可再使用：

```text
modules/<module-slug>/python-reference/
```

不得只留下截圖、README 摘要或外部連結。每個模組建立 `migration.json`，記錄：

- sourceRepository；
- sourceBranch；
- sourceCommit；
- importedFiles；
- excludedFiles 與理由；
- sourceRuntime；
- targetRuntime；
- data sources；
- secrets；
- deployment dependencies；
- retirement gates。

### 3.2 Native 與原始 Runtime 的界線

- **電影爬蟲**：主要 UI 與 API 在平台 Next.js Runtime 內運作；live scrape 是可選 server-only 模式，預設使用版本化 snapshot。
- **農事天氣**：主要 UI 在平台 Next.js Runtime 內運作；優先共用既有 `modules/cwa-open-data` 與中央 CWA server client，不建立第二套 API key 管理。
- **Django Blog**：保留並驗證真實 Django 專案；平台 Native 頁面提供由真實來源碼與 fixture 驅動的架構／請求流程教學，不得宣稱 Next.js 頁面本身是 Django Runtime。

## 4. API 最低需求

建立或擴充：

- `GET /api/web-lab/movies`
- `GET /api/web-lab/weather/weekly`
- `GET /api/web-lab/weather/advisory`
- `GET /api/web-lab/weather/stations`
- `GET /api/web-lab/django-blog/schema`
- `GET /api/web-lab/django-blog/posts`
- `GET /api/web-lab/django-blog/posts/[slug]`

API 規則：

- 不接受任意 URL、host、selector、檔案路徑或 Python import path。
- 電影來源只能使用固定 allowlist。
- 城市、行政區、作物、頁碼、分類、view 與 slug 必須驗證長度與白名單／格式。
- 所有外部 HTTP 請求必須設定 timeout、response size 上限、User-Agent 與錯誤正規化。
- 錯誤不得回傳 stack trace、伺服器路徑、API key、Cookie 或完整上游 HTML。
- 回應需提供 `Cache-Control` 與資料模式 metadata。
- Build、Lint、Test 不得呼叫外部網站。

## 5. 資料模式與來源治理

所有外部資料型模組必須明確回傳：

```json
{
  "mode": "snapshot | live | fallback",
  "source": "來源代碼",
  "sourceUrl": "固定來源頁面或 API",
  "fetchedAt": "ISO-8601",
  "snapshotVersion": "版本",
  "dataHash": "SHA-256",
  "stale": false
}
```

### 5.1 Snapshot 優先

- CI、正式 Build 與預設 Demo 使用版本化 snapshot。
- snapshot 需由受控 script 產製並留下來源 commit、擷取日期、schema 與 hash。
- 重新產製不得在 `npm run build` 階段自動執行。

### 5.2 Live 模式

- 只能在 server-side Route Handler 或受控 script 執行。
- 必須設定短 timeout、有限重試、頻率限制與 cache。
- live 失敗時回傳 snapshot／fallback，且 UI 必須清楚標示，不可假裝是即時資料。

### 5.3 合法與負責任擷取

電影模組必須：

- 只擷取公開頁面基本資訊；
- 保留原始來源連結；
- 不繞過登入、CAPTCHA、付費牆或存取控制；
- 不擷取完整文章、影評、字幕、串流影片或其他受著作權保護的大量內容；
- 不使用代理輪替、瀏覽器指紋規避或反封鎖技術；
- 遵守來源站 robots、使用條款與合理頻率；
- 若來源政策不允許自動擷取，該來源只能保留教學 snapshot，不啟用 live。

## 6. 模組邊界

### ALP-MIG-009｜Movie Scraper

負責：

- 固定來源 adapter；
- HTML parse 與正規化；
- 電影片名、分類、片長、上映日、評分、海報與來源 URL；
- 分頁、分類與 view；
- snapshot、cache、provenance 與失敗降級。

不得：

- 建立任意 URL 爬蟲；
- 在 Client Component 直接抓來源網站；
- 把來源 HTML 或錯誤訊息原樣回傳；
- 依賴 live scrape 才能顯示頁面。

### ALP-MIG-010｜Agri Weather Dashboard

負責：

- 一週天氣；
- 行政區與測站；
- 農事風險規則；
- Leaflet + OpenStreetMap；
- mock／snapshot／live 模式；
- CWA key server-only；
- 地圖與資料失敗時的備援體驗。

必須與既有 ALP-MIG-002 整合：

- 優先重用中央 CWA request client、timeout、XML／JSON parser 與 Secret 管理；
- `modules/cwa-open-data` 保留「CWA OpenData 入門與 API 基礎」定位；
- `modules/agri-weather-dashboard` 負責「農事情境、風險規則、地圖與一週決策支援」；
- 不複製 `CWA_API_KEY` 讀取、URL 組裝與共用 schema。

### ALP-MIG-011｜Django Blog

負責：

- Django Project／App 結構；
- URL routing；
- Model、QuerySet、View、Template、Admin；
- SQLite migration 與 fixture；
- Django request lifecycle；
- 原始 Python Runtime 的測試與安全設定說明。

Native Demo 必須：

- 由來源 `Post` model、URL、view、template 與 fixture 產生可操作的架構教學；
- 清楚標示「Native 教學鏡像」與「真實 Django Runtime」差異；
- 不使用 iframe；
- 不宣稱 Next.js Route Handler 是 Django；
- 不提供未認證的公開文章新增、修改或刪除 API。

## 7. 安全規則

### 電影與外部來源

- 固定 host allowlist。
- URL 必須由程式內部模板生成。
- 禁止 open redirect、SSRF、任意 selector 與任意 header 注入。
- response body 限制，建議 HTML 上限 2 MB。
- timeout 建議 5～8 秒，最多一次受控重試。
- Cache key 僅能由正規化參數組成。

### 天氣與地圖

- `CWA_API_KEY` 不得進入 Client Bundle。
- Windy key 如使用，必須標明前端可見並要求網域／用量限制。
- 預設使用 Leaflet + OpenStreetMap，不依賴 Windy。
- 不允許使用者輸入任意 tile URL、script URL 或 provider URL。

### Django

- `DEBUG=False` 與 `ALLOWED_HOSTS` 的正式環境規則必須文件化。
- 不提交 `SECRET_KEY`、SQLite 個資資料庫或管理員密碼。
- fixture 只能包含虛構教學資料。
- slug 必須唯一或明確處理衝突。
- Template 預設自動 escaping 不得關閉。

## 8. 課程內容

三個課程沿用平台六段式模板：

1. 這個主題能做什麼；
2. 白話原理與生活比喻；
3. 可操作 Demo；
4. 程式架構與關鍵程式碼；
5. 小測驗；
6. 延伸挑戰。

每個課程至少 3 題測驗與解析。

額外必須涵蓋：

- Movie Scraper：server/client 邊界、HTML parser、快取、資料來源倫理。
- Agri Weather：API key、fallback、地圖 client-only、農事風險規則。
- Django Blog：MVT、ORM、migration、admin、template escaping。

## 9. 測試與 CI

CI 不需真實 Secret，且不得依賴外網。

最低測試：

### 共用層

- provenance metadata schema；
- hash、snapshot version 與 cache key；
- allowlist、timeout、body size 與錯誤正規化。

### Movie Scraper

- 兩種來源 parser fixture；
- 分頁、分類、view 與非法參數；
- HTML 結構缺欄位時的容錯；
- live 失敗時 fallback；
- API 不洩漏上游 HTML／stack。

### Agri Weather

- CWA mock／snapshot parser；
- city／district／crop 驗證；
- 農事風險規則 golden cases；
- stations、weekly、advisory API；
- 無 key、timeout 與 provider failure；
- Leaflet 元件只在 Client Component 載入。

### Django Blog

- `python manage.py check`；
- `python manage.py makemigrations --check --dry-run`；
- Django tests；
- fixture 載入；
- Post ordering、slug、template render；
- Native schema／posts API 與來源 fixture 一致。

CI 至少執行：

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

若 Django 路徑不同，依實際保存結構調整，但不得略過真實 Django 檢查。

## 10. Migration 狀態

Codex 開始盤點並移入來源檔案後，可將 ALP-MIG-009～011 從 `planned` 更新為 `importing`；完成來源保存、Native 基礎、課程、測試後才可更新為 `refactoring`。

本波次不得將任何項目設為：

- `ready_to_retire`；
- `retired`。

## 11. 完成定義

本波次 PR 最低需完成：

- 三個來源 Inventory 與 `migration.json`；
- 必要來源程式、設定、測試與文件保存；
- Applied Web Systems 共用能力層；
- 三個 Native 頁面與三個課程 chunk；
- Movie snapshot／parser／provenance／fallback；
- Agri Weather 與既有 CWA 共用層整合；
- Django 真實 Runtime 檢查與 Native 教學鏡像；
- API、測試、Lint、TypeScript、Build 與 Python 檢查通過；
- `DEVELOPMENT_RECORD.md` 與 ALP-MIG 任務文件更新。

舊 Repo README 導向、舊部署停止與 Archived，仍留待後續人工核准。