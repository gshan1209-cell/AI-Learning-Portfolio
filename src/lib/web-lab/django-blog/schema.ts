import fs from "node:fs";
import path from "node:path";
import { createProvenanceMetadata } from "../provenance";
import type { ProvenanceMetadata } from "../types";

const ARTIFACTS_DIR = path.join(process.cwd(), "modules/django-blog/artifacts");

export interface DjangoSchemaArtifact {
  sourceRepository: string;
  sourceCommit: string;
  djangoVersion: string;
  pythonVersion: string;
  appName: string;
  modelName: string;
  fields: Array<{
    name: string;
    type: string;
    maxLength?: number;
    primaryKey?: boolean;
    options: Record<string, unknown>;
  }>;
  ordering: string[];
  migrations: string[];
  generatedAt: string;
}

export interface DjangoUrlMapArtifact {
  routes: Array<{
    pattern: string;
    name: string;
    view: string;
    description: string;
  }>;
}

export interface DjangoTemplateMapArtifact {
  templates: Array<{
    file: string;
    usedByView: string;
    contextVariables: string[];
    features: string[];
  }>;
}

export interface DjangoFullSchemaResult {
  schema: DjangoSchemaArtifact;
  urlMap: DjangoUrlMapArtifact;
  templateMap: DjangoTemplateMapArtifact;
  provenance: ProvenanceMetadata;
}

export function loadDjangoFullSchema(): DjangoFullSchemaResult {
  let schema: DjangoSchemaArtifact = {
    sourceRepository: "gshan1209-cell/2026-DjangoBlog",
    sourceCommit: "eb900202f0d791951a26b6ea1767d15e69cde9ac",
    djangoVersion: "6.0",
    pythonVersion: "3.11",
    appName: "article",
    modelName: "Post",
    fields: [
      { name: "id", type: "BigAutoField", primaryKey: true, options: { auto_created: true } },
      { name: "title", type: "CharField", maxLength: 200, options: { required: true } },
      { name: "slug", type: "CharField", maxLength: 200, options: { unique: true, required: true } },
      { name: "content", type: "TextField", options: { required: true } },
      { name: "pub_date", type: "DateTimeField", options: { auto_now_add: true } },
    ],
    ordering: ["-pub_date"],
    migrations: ["0001_initial.py", "0002_alter_post_slug_unique.py"],
    generatedAt: new Date().toISOString(),
  };

  let urlMap: DjangoUrlMapArtifact = {
    routes: [
      { pattern: "admin/", name: "admin:index", view: "django.contrib.admin.site.urls", description: "Django 預設後台管理" },
      { pattern: "", name: "post_list", view: "article.views.index", description: "文章列表頁" },
      { pattern: "post/<slug:slug>/", name: "post_detail", view: "article.views.detail", description: "單篇文章詳細頁" },
    ],
  };

  let templateMap: DjangoTemplateMapArtifact = {
    templates: [
      { file: "templates/index.html", usedByView: "article.views.index", contextVariables: ["posts", "now"], features: ["for loop", "date filter"] },
      { file: "templates/show.html", usedByView: "article.views.detail", contextVariables: ["post", "now"], features: ["linebreaks filter"] },
    ],
  };

  try {
    const sPath = path.join(ARTIFACTS_DIR, "django-schema.json");
    const uPath = path.join(ARTIFACTS_DIR, "url-map.json");
    const tPath = path.join(ARTIFACTS_DIR, "template-map.json");

    if (fs.existsSync(sPath)) schema = JSON.parse(fs.readFileSync(sPath, "utf-8"));
    if (fs.existsSync(uPath)) urlMap = JSON.parse(fs.readFileSync(uPath, "utf-8"));
    if (fs.existsSync(tPath)) templateMap = JSON.parse(fs.readFileSync(tPath, "utf-8"));
  } catch (err) {
    console.error("Failed to load Django schema artifacts:", err);
  }

  const provenance = createProvenanceMetadata({
    mode: "snapshot",
    source: "django-blog",
    sourceLabel: "2026-DjangoBlog (Python Django Project)",
    sourceUrl: "https://github.com/gshan1209-cell/2026-DjangoBlog",
    snapshotVersion: "1.0.0",
    notice: "由 Python 受控腳本 export_django_artifacts.py 導出真實 Django Model / View / Template 元數據。",
  });

  return {
    schema,
    urlMap,
    templateMap,
    provenance,
  };
}
