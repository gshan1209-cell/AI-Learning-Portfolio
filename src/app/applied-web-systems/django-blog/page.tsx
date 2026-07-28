"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SourceProvenanceCard } from "@/components/web-lab/source-provenance-card";
import { RequestLifecycleViewer, type LifecycleStep } from "@/components/web-lab/request-lifecycle";
import type { DjangoFullSchemaResult } from "@/lib/web-lab/django-blog/schema";
import type { DjangoPostItem, DjangoPostsResult } from "@/lib/web-lab/django-blog/fixtures";

export default function DjangoBlogPage() {
  const [schemaData, setSchemaData] = useState<DjangoFullSchemaResult | null>(null);
  const [postsData, setPostsData] = useState<DjangoPostsResult | null>(null);
  const [selectedPost, setSelectedPost] = useState<DjangoPostItem | null>(null);
  const [activeTab, setActiveTab] = useState<"schema" | "routes" | "templates" | "runtime">("schema");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [sRes, pRes] = await Promise.all([
          fetch("/api/web-lab/django-blog/schema"),
          fetch("/api/web-lab/django-blog/posts"),
        ]);

        if (sRes.ok) setSchemaData(await sRes.json());
        if (pRes.ok) {
          const pJson: DjangoPostsResult = await pRes.json();
          setPostsData(pJson);
          if (pJson.posts && pJson.posts.length > 0) {
            setSelectedPost(pJson.posts[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load Django blog lab data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const lifecycleSteps: LifecycleStep[] = [
    {
      step: 1,
      name: "Client 點擊與 URL Routing (urls.py)",
      description: "瀏覽器請求 /post/django-mvt-architecture-guide/，Django 依據 urls.py 匹配路徑: path('post/<slug:slug>/', views.detail)",
      status: "completed",
      codeSnippet: "path('post/<slug:slug>/', detail, name='post_detail')",
    },
    {
      step: 2,
      name: "View 商業邏輯與 ORM 查詢 (views.py)",
      description: "detail 視圖被觸發，呼叫 ORM get_object_or_404(Post, slug=slug) 產生 SELECT SQL 查詢 SQLite 資料庫。",
      status: "completed",
      codeSnippet: "post = get_object_or_404(Post, slug=slug)",
    },
    {
      step: 3,
      name: "Template HTML 渲染與 Autoescape (show.html)",
      description: "View 將 Context 物件傳入 show.html 進行模板渲染。預設啟用自動 escaping 防止 XSS 攻擊。",
      status: "completed",
      codeSnippet: "return render(request, 'show.html', {'post': post, 'now': now})",
    },
    {
      step: 4,
      name: "HTTP 200/404 Response 回傳",
      description: "渲染完成的 HTML 回傳給使用者瀏覽器；若 ORM 找不到 slug 則回傳 HTTP 404 Not Found。",
      status: "completed",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <Link
            href="/applied-web-systems"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mb-1"
          >
            &larr; 返回 Applied Web Systems 實驗室
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            🐍 ALP-MIG-011 Django Blog 基礎與請求生命週期
          </h1>
        </div>
        <Link
          href="/courses/django-blog-basics"
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
        >
          查看對應六段式課程 &rarr;
        </Link>
      </div>

      {/* Distinction Alert Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs space-y-1 text-amber-900 dark:text-amber-200">
        <div className="font-bold text-sm flex items-center gap-2">
          <span>🏛️</span> 本頁面為「平台 Native 教學鏡像 (Next.js)」，非真實 Django Python 執行環境
        </div>
        <p className="leading-relaxed">
          真實 Django Python 原始碼已完整保存於專案 <code>modules/django-blog/python-reference/</code> 目錄，並通過完整的 <code>python manage.py check</code> 與單元測試。本頁展現之 Schema、URL 路由與文章內容皆由 Python 受控腳本產出之 Schema Artifacts 驅動。
        </p>
      </div>

      {/* Provenance Card */}
      {schemaData && <SourceProvenanceCard provenance={schemaData.provenance} />}

      {/* Interactive MVT Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Fixture Posts Reader */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span>📚 Fixture 文章列表 (唯讀展示)</span>
            <span className="text-xs text-slate-500 font-normal">{postsData?.total || 0} 篇</span>
          </h3>

          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {postsData?.posts.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelectedPost(p)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    selectedPost?.id === p.id
                      ? "bg-amber-50 border-amber-400 dark:bg-amber-950/60 dark:border-amber-600 font-medium"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{p.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">slug: {p.slug}</div>
                </button>
              ))}
            </div>
          )}

          {selectedPost && (
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs space-y-2 mt-4">
              <div className="font-bold text-amber-700 dark:text-amber-400">{selectedPost.title}</div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedPost.content}</p>
              <div className="text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-1">
                發布時間: {new Date(selectedPost.pubDate).toLocaleString("zh-TW")}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Django Architecture & Artifacts Viewer */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              🛠️ Django MVT 結構與 Artifacts 檢視器
            </h3>
            <div className="flex gap-1 text-xs">
              {(["schema", "routes", "templates", "runtime"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 rounded-md font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-amber-600 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "schema" && schemaData && (
            <div className="space-y-3 text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Model: <code>{schemaData.schema.appName}.{schemaData.schema.modelName}</code> (Django {schemaData.schema.djangoVersion})
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="p-2">欄位名稱</th>
                      <th className="p-2">型別 (Type)</th>
                      <th className="p-2">選項與約束 (Options)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {schemaData.schema.fields.map((f) => (
                      <tr key={f.name} className="hover:bg-slate-50 dark:hover:bg-slate-950">
                        <td className="p-2 font-mono font-bold">{f.name}</td>
                        <td className="p-2 text-indigo-600 dark:text-indigo-400 font-mono">{f.type}</td>
                        <td className="p-2 text-slate-500">{JSON.stringify(f.options)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "routes" && schemaData && (
            <div className="space-y-3 text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-200">URL Routing (urls.py)</div>
              <div className="space-y-2">
                {schemaData.urlMap.routes.map((r) => (
                  <div key={r.pattern} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1">
                    <div className="flex items-center justify-between font-mono font-bold text-amber-700 dark:text-amber-400">
                      <span>path(&quot;{r.pattern}&quot;)</span>
                      <span className="text-[10px] text-slate-500">name=&quot;{r.name}&quot;</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">View: <code>{r.view}</code></div>
                    <div className="text-slate-500 text-[11px]">{r.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "templates" && schemaData && (
            <div className="space-y-3 text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-200">Template Engine (templates/)</div>
              <div className="space-y-2">
                {schemaData.templateMap.templates.map((t) => (
                  <div key={t.file} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1">
                    <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.file}</div>
                    <div className="text-slate-600 dark:text-slate-400">使用的 View: <code>{t.usedByView}</code></div>
                    <div className="text-slate-500 text-[11px]">Context 變數: {t.contextVariables.join(", ")}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "runtime" && (
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="font-semibold text-slate-800 dark:text-slate-200">🖥️ 本機啟動真實 Django 測試與管理員後台：</div>
              <pre className="p-3 rounded-lg bg-black text-emerald-400 font-mono text-[11px] overflow-x-auto space-y-1">
                <div>cd modules/django-blog/python-reference</div>
                <div>python manage.py check</div>
                <div>python manage.py test</div>
                <div>python manage.py runserver</div>
              </pre>
              <p>
                啟動後瀏覽 <code>http://127.0.0.1:8000/admin/</code> 可進行文章的新增、編輯與刪除教學。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Teaching Lifecycle */}
      <RequestLifecycleViewer steps={lifecycleSteps} />
    </div>
  );
}
