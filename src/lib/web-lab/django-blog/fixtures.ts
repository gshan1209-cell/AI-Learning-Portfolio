import fs from "node:fs";
import path from "node:path";
import { createProvenanceMetadata } from "../provenance";
import type { ProvenanceMetadata } from "../types";

const ARTIFACTS_DIR = path.join(process.cwd(), "modules/django-blog/artifacts");

export interface DjangoPostItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  pubDate: string;
}

export interface DjangoPostsResult {
  total: number;
  posts: DjangoPostItem[];
  provenance: ProvenanceMetadata;
}

export function loadDjangoPostsFixture(slug?: string): { post?: DjangoPostItem; posts?: DjangoPostItem[]; total: number; provenance: ProvenanceMetadata } {
  let raw = {
    snapshotVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    dataHash: "django-fixture-hash",
    posts: [
      {
        id: 1,
        title: "Django MVT 架構入門指南",
        slug: "django-mvt-architecture-guide",
        content: "Model-View-Template (MVT) 是 Django 的核心設計模式。Model 處理資料庫結構，View 負責商業邏輯與 HTTP 請求處理，Template 則渲染 HTML 展示給使用者。",
        pubDate: "2026-07-28T08:00:00Z",
      },
      {
        id: 2,
        title: "Django ORM 與 Migration 版本控管",
        slug: "django-orm-and-migrations",
        content: "Django ORM 提供強大的 Python 物件導向 API，讓開發者無需編寫 SQL 即可進行 CRUD 操作。Migration 則為資料庫 Schema 的異動提供精確的版本歷史紀錄。",
        pubDate: "2026-07-28T09:30:00Z",
      },
      {
        id: 3,
        title: "Django Admin 後台管理系統與安全性設定",
        slug: "django-admin-and-security",
        content: "Django 內建自動產生的 Admin 後台。正式環境中應將 DEBUG 設為 False，經由環境變數注入 SECRET_KEY，並妥善設定 ALLOWED_HOSTS 與 CSRF 防禦。",
        pubDate: "2026-07-28T11:00:00Z",
      },
    ],
  };

  try {
    const fPath = path.join(ARTIFACTS_DIR, "fixture-posts.json");
    if (fs.existsSync(fPath)) {
      const content = fs.readFileSync(fPath, "utf-8");
      raw = JSON.parse(content);
    }
  } catch (err) {
    console.error("Failed to load fixture-posts JSON:", err);
  }

  const provenance = createProvenanceMetadata({
    mode: "snapshot",
    source: "django-blog",
    sourceLabel: "2026-DjangoBlog Fixture Data",
    sourceUrl: "https://github.com/gshan1209-cell/2026-DjangoBlog",
    snapshotVersion: raw.snapshotVersion,
    dataHash: raw.dataHash,
    notice: "文章內容為受控虛構教學 Fixture，非真實個資資料庫。",
  });

  if (slug) {
    const found = raw.posts.find((p) => p.slug === slug);
    return {
      post: found,
      total: found ? 1 : 0,
      provenance,
    };
  }

  return {
    posts: raw.posts,
    total: raw.posts.length,
    provenance,
  };
}
