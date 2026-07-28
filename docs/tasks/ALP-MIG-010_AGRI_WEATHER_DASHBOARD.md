# ALP-MIG-010｜農事天氣儀表板與風險提醒

## 任務目標

將 `gshan1209-cell/scrape_weather` 的 Next.js／FastAPI 農事天氣儀表板移植進 AI-Learning-Portfolio，並與既有 ALP-MIG-002 CWA OpenData 模組整合，形成不重複 Secret、HTTP Client、parser 與 schema 的農事情境教學模組。

## 固定來源

- Repository：`gshan1209-cell/scrape_weather`
- Branch：`main`
- Commit：`788311e505d9231378f55e093a7f1e791266693d`
- 來源 Runtime：Next.js App Router／FastAPI／Pydantic／httpx
- 地圖：Leaflet + OpenStreetMap；Windy 為選用 skeleton
- 主要資料：CWA OpenData

## 目前狀態

**`planned`**

## 定位邊界

### ALP-MIG-002｜CWA OpenData

負責：

- CWA API 入門；
- server-only API key；
- JSON／XML 解析；
- 通用資料請求與下載。

### ALP-MIG-010｜Agri Weather Dashboard

負責：

- 城市／行政區的一週天氣；
- 測站資料；
- 農事風險規則；
- 作物情境；
- Leaflet 地圖；
- mock／snapshot／live 模式；
- 農民可理解的提醒與決策支援。

禁止建立第二套 `CWA_API_KEY` 管理、通用 CWA URL builder、HTTP timeout 或共用 parser。

## 來源功能盤點

必須保存並盤點：

- `apps/api` FastAPI 結構；
- health、locations、weather、stations、advisory routes；
- config、CORS 與 Secret；
- CWA client、mock fallback、SSL verification 設定；
- 農事 advisory 規則；
- Pydantic schema；
- `apps/web` 頁面、元件、API client；
- Leaflet、OpenStreetMap 與 Windy fallback skeleton；
- 測試、README、開發摘要與部署設定。

## 目標模組

```text
modules/agri-weather-dashboard/
├── README.md
├── migration.json
├── source-reference/
├── python-reference/
├── fixtures/
├── snapshots/
├── rules/
└── artifacts/
```

Native 程式：

```text
src/lib/web-lab/agri-weather/
├── adapters/
├── forecast/
├── stations/
├── advisory/
├── snapshots/
├── validation/
└── types.ts

src/components/web-lab/agri-weather/
src/app/applied-web-systems/agri-weather/page.tsx
src/app/api/web-lab/weather/weekly/route.ts
src/app/api/web-lab/weather/advisory/route.ts
src/app/api/web-lab/weather/stations/route.ts
```

## 完成需求

### 1. CWA 共用層整合

- 先盤點 `modules/cwa-open-data` 與既有 CWA Route Handler。
- 抽出或重用中央 server-only CWA client。
- Secret 僅能由 server runtime 讀取。
- 不得將 CWA key 放進 `NEXT_PUBLIC_*`。
- 共用 timeout、重試、JSON／XML parser、錯誤類型與 response metadata。
- 原 ALP-MIG-002 頁面與 API 不得被破壞。

### 2. 資料 schema

一週預報最低欄位：

- city；
- district；
- startTime／endTime；
- temperatureMin／temperatureMax；
- precipitationProbability；
- weatherDescription；
- comfort；
- wind；
- humidity（來源有提供時）；
- source metadata。

測站最低欄位：

- stationId；
- name；
- latitude；
- longitude；
- temperature；
- rainfall；
- observedAt；
- source metadata。

### 3. 農事風險規則

規則必須資料化、版本化，不得散落在 UI：

```text
modules/agri-weather-dashboard/rules/agri-risk-rules.json
```

最低風險類型：

- 高溫；
- 低溫；
- 豪雨／高降雨機率；
- 強風；
- 連續潮濕；
- 日夜溫差。

每條規則記錄：

- ruleId；
- version；
- crop allowlist；
- threshold；
- severity；
- userMessage；
- recommendation；
- limitations；
- source／review note。

提醒必須標示「教學與初步風險參考」，不得宣稱取代農業專家、災害警報或官方防災資訊。

### 4. Snapshot／Mock／Live

- 預設 Demo 使用版本化 snapshot 或 mock。
- 無 CWA key 時一週預報與 advisory 仍可操作。
- stations 無 live data 時可回空陣列或 snapshot，但 UI 必須誠實標示。
- live timeout／provider failure 時自動 fallback。
- response metadata 明確標示 `snapshot`、`live` 或 `fallback`。

### 5. API

#### `GET /api/web-lab/weather/weekly`

參數：

- `city`；
- `district`；
- `mode=snapshot|live`。

#### `GET /api/web-lab/weather/advisory`

參數：

- `city`；
- `district`；
- `crop`；
- `mode=snapshot|live`。

#### `GET /api/web-lab/weather/stations`

參數：

- `city` 或 bounding box 僅能使用受控格式；
- `mode=snapshot|live`。

規則：

- city／district／crop 使用 allowlist 或中央行政區資料；
- 不接受任意 CWA dataset ID、URL、API parameter map；
- 不接受任意 tile、script 或 provider URL；
- `Cache-Control` 與資料新鮮度 metadata；
- provider error 不洩漏 key、完整上游 response 或 stack。

### 6. Native 頁面

最低功能：

- 城市、行政區與作物選擇；
- 七日天氣卡片；
- 農事風險摘要與嚴重度；
- Leaflet + OpenStreetMap 台灣地圖；
- 區域 mock 點與 live stations；
- data mode、更新時間與 fallback 提示；
- CWA 資料流與農事規則圖解；
- 手機版不產生水平捲軸。

Leaflet：

- 必須為 Client Component 或 dynamic import；
- SSR 不得存取 `window`；
- 地圖容器必須有明確高度；
- CSS 必須正確載入；
- map 初始化失敗時頁面其他資訊仍可使用。

Windy：

- 不作預設 provider；
- 沒有合法 key 時不可載入；
- 前端可見 key 必須文件化網域與用量限制；
- 不複製 Windy 品牌 UI。

### 7. FastAPI 保存

- 原 FastAPI 必要程式保存於 `python-reference/`。
- 執行 `python -m compileall` 與 pytest。
- CORS 不得預設萬用 `*` 搭配 credentials。
- `CWA_VERIFY_SSL=false` 只能作本機除錯選項，文件需警告正式環境不得停用驗證。
- 不要求主平台啟動 FastAPI 才能使用 Native Demo。

### 8. 課程

建立 `agri-weather-dashboard` 六段式課程，至少涵蓋：

- API key 的 server/client 邊界；
- CWA fallback 與資料新鮮度；
- Leaflet client-only；
- 規則引擎與風險分級；
- 農事建議的限制；
- 3 題以上測驗與解析。

## 測試

最低測試：

- weekly／stations fixture parser；
- 行政區與作物驗證；
- 風險規則 golden cases；
- 無 key、timeout、invalid upstream、empty stations；
- snapshot／live／fallback metadata；
- CWA Secret 不出現在 client bundle；
- Leaflet client boundary；
- 三支 Route Handler 正常與錯誤；
- FastAPI compileall／pytest；
- 原 ALP-MIG-002 regression tests。

CI 不得呼叫 CWA 或 Windy live API。

## 退役門檻

在以下項目完成前保持 `refactoring`：

- CWA 共用層完成且 ALP-MIG-002 無回歸；
- 一週預報、advisory、stations 與地圖驗收；
- live CWA 使用測試 key 人工驗收；
- 舊 FastAPI／Vercel 導向或停止；
- README 搬遷公告；
- 使用者人工核准 Archived。