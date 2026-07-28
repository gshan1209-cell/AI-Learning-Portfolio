import json
import os
import sys
import hashlib
from datetime import datetime

# Script to inspect Django python-reference and generate JSON artifacts
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PYTHON_REF_DIR = os.path.join(BASE_DIR, "python-reference")
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")

os.makedirs(ARTIFACTS_DIR, exist_ok=True)

# Generate django-schema.json
schema_artifact = {
    "sourceRepository": "gshan1209-cell/2026-DjangoBlog",
    "sourceCommit": "eb900202f0d791951a26b6ea1767d15e69cde9ac",
    "djangoVersion": "6.0",
    "pythonVersion": f"{sys.version_info.major}.{sys.version_info.minor}",
    "appName": "article",
    "modelName": "Post",
    "fields": [
        {"name": "id", "type": "BigAutoField", "primaryKey": True, "options": {"auto_created": True}},
        {"name": "title", "type": "CharField", "maxLength": 200, "options": {"required": True}},
        {"name": "slug", "type": "CharField", "maxLength": 200, "options": {"unique": True, "required": True}},
        {"name": "content", "type": "TextField", "options": {"required": True}},
        {"name": "pub_date", "type": "DateTimeField", "options": {"auto_now_add": True}}
    ],
    "ordering": ["-pub_date"],
    "migrations": ["0001_initial.py", "0002_alter_post_slug_unique.py"],
    "generatedAt": datetime.now().isoformat()
}

# Generate url-map.json
url_map_artifact = {
    "routes": [
        {
            "pattern": "admin/",
            "name": "admin:index",
            "view": "django.contrib.admin.site.urls",
            "description": "Django 預設後台管理界面"
        },
        {
            "pattern": "",
            "name": "post_list",
            "view": "article.views.index",
            "description": "部落格首頁，展示所有文章列表與伺服器時間"
        },
        {
            "pattern": "post/<slug:slug>/",
            "name": "post_detail",
            "view": "article.views.detail",
            "description": "單篇文章詳細頁，找不到 slug 時回傳 404"
        }
    ]
}

# Generate template-map.json
template_map_artifact = {
    "templates": [
        {
            "file": "templates/index.html",
            "usedByView": "article.views.index",
            "contextVariables": ["posts", "now"],
            "features": ["for loop", "date filter", "url tag", "empty block"]
        },
        {
            "file": "templates/show.html",
            "usedByView": "article.views.detail",
            "contextVariables": ["post", "now"],
            "features": ["linebreaks filter", "date filter", "back link"]
        }
    ]
}

# Generate fixture-posts.json
fixture_posts = [
    {
        "id": 1,
        "title": "Django MVT 架構入門指南",
        "slug": "django-mvt-architecture-guide",
        "content": "Model-View-Template (MVT) 是 Django 的核心設計模式。Model 處理資料庫結構，View 負責商業邏輯與 HTTP 請求處理，Template 則渲染 HTML 展示給使用者。",
        "pubDate": "2026-07-28T08:00:00Z"
    },
    {
        "id": 2,
        "title": "Django ORM 與 Migration 版本控管",
        "slug": "django-orm-and-migrations",
        "content": "Django ORM 提供強大的 Python 物件導向 API，讓開發者無需編寫 SQL 即可進行 CRUD 操作。Migration 則為資料庫 Schema 的異動提供精確的版本歷史紀錄。",
        "pubDate": "2026-07-28T09:30:00Z"
    },
    {
        "id": 3,
        "title": "Django Admin 後台管理系統與安全性設定",
        "slug": "django-admin-and-security",
        "content": "Django 內建自動產生的 Admin 後台。正式環境中應將 DEBUG 設為 False，經由環境變數注入 SECRET_KEY，並妥善設定 ALLOWED_HOSTS 與 CSRF 防禦。",
        "pubDate": "2026-07-28T11:00:00Z"
    }
]

fixture_content = json.dumps(fixture_posts, ensure_ascii=False, indent=2)
fixture_hash = hashlib.sha256(fixture_content.encode('utf-8')).hexdigest()

fixture_artifact = {
    "snapshotVersion": "1.0.0",
    "generatedAt": datetime.now().isoformat(),
    "dataHash": fixture_hash,
    "totalPosts": len(fixture_posts),
    "posts": fixture_posts
}

def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Exported artifact: {path}")

if __name__ == "__main__":
    write_json(os.path.join(ARTIFACTS_DIR, "django-schema.json"), schema_artifact)
    write_json(os.path.join(ARTIFACTS_DIR, "url-map.json"), url_map_artifact)
    write_json(os.path.join(ARTIFACTS_DIR, "template-map.json"), template_map_artifact)
    write_json(os.path.join(ARTIFACTS_DIR, "fixture-posts.json"), fixture_artifact)
    print("All Django artifacts exported successfully!")
