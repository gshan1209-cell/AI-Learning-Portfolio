# ALP-MIG-011｜Django Blog 基礎與請求生命週期

## 任務目標

將 `gshan1209-cell/2026-DjangoBlog` 的 Django Blog 專案完整保存並整合進 AI-Learning-Portfolio，提供真實 Django Runtime 驗證，以及由來源碼與 fixture 驅動的 Native MVT／ORM／Routing 教學。

## 固定來源

- Repository：`gshan1209-cell/2026-DjangoBlog`
- Branch：`main`
- Commit：`eb900202f0d791951a26b6ea1767d15e69cde9ac`
- 來源 Runtime：Python／Django／SQLite／Template HTML
- 來源核心 Model：`Post(title, slug, content, pub_date)`

## 目前狀態

**`planned`**

## 核心原則

本模組必須同時保留兩個清楚分離的層次：

1. **真實 Django Runtime**：原始 Django Project、App、migration、template、admin 與 tests。
2. **平台 Native 教學鏡像**：在 Next.js 中解說並模擬 Django request lifecycle，資料來自受控 fixture 與真實來源 schema。

不得：

- 用 Next.js Route Handler 冒充 Django；
- 只保存 README 或截圖；
- 以 iframe 嵌入舊部署；
- 為了 Native Demo 刪除 Django Runtime；
- 建立未認證的公開文章寫入 API。

## 來源功能盤點

必須保存並盤點：

- `manage.py`；
- Django project settings／urls／wsgi／asgi；
- `article` app；
- Post model；
- views、urls、admin、apps；
- templates 與 static files；
- migrations；
- SQLite 使用方式；
- requirements；
- tests；
- start script 與部署設定；
- README、documents、AGENT／SKILL 文件。

## 目標模組

```text
modules/django-blog/
├── README.md
├── migration.json
├── python-reference/
│   ├── manage.py
│   ├── DjangoBlog/
│   ├── article/
│   ├── templates/
│   ├── fixtures/
│   └── requirements.txt
├── artifacts/
│   ├── django-schema.json
│   ├── url-map.json
│   └── template-map.json
└── scripts/
```

Native 程式：

```text
src/lib/web-lab/django-blog/
├── schema.ts
├── fixtures.ts
├── request-lifecycle.ts
├── url-resolver.ts
└── types.ts

src/app/applied-web-systems/django-blog/page.tsx
src/app/api/web-lab/django-blog/schema/route.ts
src/app/api/web-lab/django-blog/posts/route.ts
src/app/api/web-lab/django-blog/posts/[slug]/route.ts
```

## 完成需求

### 1. Django Runtime 保存與整理

- 固定來源 commit。
- 保存所有必要 Django 程式與 migration。
- 移除或排除 `.venv`、cache、真實 SQLite 個資與 Secret。
- 建立虛構 fixture，不使用真實個人資料。
- 建立 `migration.json`，逐檔記錄 imported／excluded。

### 2. 安全設定

真實 Django 專案必須檢查並文件化：

- `SECRET_KEY` 由環境變數取得；
- `DEBUG` 預設不得在正式環境開啟；
- `ALLOWED_HOSTS` 不可無條件 `*`；
- CSRF、XSS 與 template autoescape；
- SQLite 僅作教學／開發用途；
- admin 帳號不得硬編碼；
- 不提交 `.env`、管理員密碼或 production database。

### 3. Post Model 改善

保留來源語意，但最低需處理：

- `title` 長度；
- `slug` 唯一性或明確衝突策略；
- `content`；
- `pub_date`；
- ordering；
- `__str__`；
- 可選 `get_absolute_url()`；
- migration 與 fixture 一致。

若修改來源 model，必須建立正式 migration，不可直接改資料庫。

### 4. View／URL／Template

- 建立文章列表與單篇文章 detail。
- 使用 Django ORM／QuerySet，不用硬編碼文章陣列。
- URL name 與 namespace 清楚。
- slug 不存在回 404。
- Template 不使用 `safe` 顯示不可信內容。
- 顯示時間使用 timezone-aware Django API，不使用 naive `datetime.now()`。
- Admin 註冊 Post，並提供合理 list display／search／prepopulate slug（若適用）。

### 5. 版本化 Artifact

由受控 Python script 讀取 Django source／model metadata，產生：

- `django-schema.json`；
- `url-map.json`；
- `template-map.json`；
- fixture posts JSON。

Artifact metadata 至少包含：

- sourceRepository；
- sourceCommit；
- Django version；
- Python version；
- model fields；
- migration names；
- generatedAt；
- fixture hash。

不得手工寫死與來源不一致的 schema。

### 6. Native 教學頁面

最低功能：

- Django Project／App 目錄圖；
- MVT 對應；
- URL → View → QuerySet → Template → Response 流程；
- Post schema 表格；
- fixture 文章列表與 slug detail；
- 點選 URL 顯示實際會進入的 view／template；
- Admin、migration、ORM 與 template escaping 說明；
- 「Native 教學鏡像」標示；
- 「真實 Django Runtime」的啟動與測試方式。

Native posts 僅為唯讀 fixture 展示。文章新增／修改／刪除應在真實 Django Admin 中教學，不在公開 Next.js API 開放。

### 7. Native API

#### `GET /api/web-lab/django-blog/schema`

回傳版本化 model、URL 與 template metadata。

#### `GET /api/web-lab/django-blog/posts`

- 唯讀 fixture；
- 分頁上限；
- 不接受任意排序欄位或 SQL 條件。

#### `GET /api/web-lab/django-blog/posts/[slug]`

- slug 長度與格式驗證；
- 不存在回 404；
- 不回傳檔案路徑或來源模板完整內容。

### 8. Django Tests

最低測試：

- `manage.py check`；
- migration 無缺漏；
- Post 建立與 ordering；
- slug 唯一／衝突行為；
- index 200；
- detail 200／404；
- template 使用正確；
- admin 已註冊；
- fixture 可載入；
- timezone-aware pub_date；
- template escaping。

### 9. 課程

建立 `django-blog-basics` 六段式課程，至少涵蓋：

- Django Project 與 App；
- MVT；
- Model／migration／ORM；
- URL／View／Template；
- Admin；
- CSRF、XSS、Secret、DEBUG 與 ALLOWED_HOSTS；
- 3 題以上測驗與解析。

## CI

至少執行：

```bash
python -m compileall modules/django-blog/python-reference
python modules/django-blog/python-reference/manage.py check
python modules/django-blog/python-reference/manage.py makemigrations --check --dry-run
python modules/django-blog/python-reference/manage.py test
```

並執行平台既有：

```bash
npm ci
npm run prisma:generate
npm run lint
npx tsc --noEmit
npm run test
npm run build
```

CI 使用臨時 SQLite 或 in-memory test database，不提交產生的資料庫檔。

## 退役門檻

在以下項目完成前保持 `refactoring`：

- 真實 Django Runtime 可安裝、check、migrate 與 test；
- Native schema／request lifecycle／fixture 頁面驗收；
- 安全設定文件完成；
- 舊部署停止或導向；
- README 搬遷公告；
- 使用者人工核准 Archived。