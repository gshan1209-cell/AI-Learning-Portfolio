# Django Blog Module｜Django Blog 基礎與請求生命週期模組

## 來源資訊

- **來源 Repo**：`gshan1209-cell/2026-DjangoBlog`
- **固定 Branch**：`main`
- **固定 Commit**：`eb900202f0d791951a26b6ea1767d15e69cde9ac`
- **來源 Runtime**：Python / Django / SQLite / Template HTML
- **核心 Model**：`Post(title, slug, content, pub_date)`

## 雙層設計原則

本模組包含雙層清楚分離之架構：
1. **真實 Django Runtime** (`python-reference/`)：完整保存並通過 `manage.py check`、`makemigrations` 與單元測試。
2. **平台 Native 教學鏡像** (`src/app/applied-web-systems/django-blog/`)：在 Next.js 中透過版本化 JSON Artifacts 解說 Django MVT、ORM、URL Routing 與 Request Lifecycle。

## 目錄結構

```text
modules/django-blog/
├── README.md
├── migration.json
├── python-reference/
│   ├── manage.py
│   ├── DjangoBlog/
│   ├── article/
│   ├── templates/
│   └── requirements.txt
├── artifacts/
│   ├── django-schema.json
│   ├── url-map.json
│   ├── template-map.json
│   └── fixture-posts.json
└── scripts/
    └── export_django_artifacts.py
```

## Native 入口

- 頁面：`/applied-web-systems/django-blog`
- API：
  - `GET /api/web-lab/django-blog/schema`
  - `GET /api/web-lab/django-blog/posts`
  - `GET /api/web-lab/django-blog/posts/[slug]`
