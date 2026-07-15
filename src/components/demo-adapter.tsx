"use client";

import { useEffect, useMemo, useState } from "react";
import type { CourseDemo, CourseSource } from "@/types/course";
import LinearRegressionPlayground from "@/components/native-demos/linear-regression-playground";

interface DemoAdapterProps {
  courseTitle: string;
  demo?: CourseDemo;
  source: CourseSource;
}

function DemoFallback({
  title,
  message,
  fallbackUrl,
}: {
  title: string;
  message: string;
  fallbackUrl: string;
}) {
  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7">
      <p className="text-sm font-black text-amber-700">展示備援模式</p>
      <h3 className="mt-2 text-xl font-black text-ink">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{message}</p>
      <a
        href={fallbackUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 font-bold text-white"
      >
        前往原始作品
      </a>
    </div>
  );
}

function NativeDemo({ nativeKey, fallbackUrl }: { nativeKey?: string; fallbackUrl: string }) {
  if (nativeKey === "linear-regression-playground") {
    return <LinearRegressionPlayground />;
  }

  return (
    <DemoFallback
      title="站內互動元件尚未註冊"
      message={`找不到 nativeKey：${nativeKey || "未設定"}。可先查看原始作品，之後再補上對應的站內元件。`}
      fallbackUrl={fallbackUrl}
    />
  );
}

export default function DemoAdapter({ courseTitle, demo, source }: DemoAdapterProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedDemo = useMemo<CourseDemo | undefined>(() => {
    if (demo) return demo;
    if (source.demoUrl) {
      return {
        mode: "external",
        title: `${courseTitle} 原始 Demo`,
        url: source.demoUrl,
        fallbackUrl: source.repositoryUrl,
      };
    }
    return undefined;
  }, [courseTitle, demo, source.demoUrl, source.repositoryUrl]);

  useEffect(() => setHasError(false), [resolvedDemo?.mode, resolvedDemo?.url, resolvedDemo?.nativeKey]);

  if (!resolvedDemo) return null;

  const fallbackUrl = resolvedDemo.fallbackUrl || source.demoUrl || source.repositoryUrl;
  const title = resolvedDemo.title || `${courseTitle} Demo`;
  const description = resolvedDemo.description || "透過原始作品或站內互動元件，實際操作本課程的核心概念。";

  if (hasError) {
    return (
      <DemoFallback
        title={`${title} 暫時無法顯示`}
        message="外部服務可能休眠、拒絕嵌入，或展示網址已變更。課程內容仍可正常閱讀，並可改由原始作品連結開啟。"
        fallbackUrl={fallbackUrl}
      />
    );
  }

  if (resolvedDemo.mode === "native") {
    return <NativeDemo nativeKey={resolvedDemo.nativeKey} fallbackUrl={fallbackUrl} />;
  }

  if (resolvedDemo.mode === "external") {
    const targetUrl = resolvedDemo.url || fallbackUrl;
    return (
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-7">
        <p className="text-sm font-black text-brand">EXTERNAL DEMO</p>
        <h3 className="mt-2 text-2xl font-black text-ink">{title}</h3>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">{description}</p>
        <a
          href={targetUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 font-bold text-white"
        >
          在新分頁開啟 Demo
        </a>
      </div>
    );
  }

  if (resolvedDemo.mode === "iframe") {
    if (!resolvedDemo.url) {
      return <DemoFallback title="尚未設定嵌入網址" message={description} fallbackUrl={fallbackUrl} />;
    }

    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-200 p-5">
          <p className="text-sm font-black text-brand">EMBEDDED DEMO</p>
          <h3 className="mt-1 text-xl font-black text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <iframe
          src={resolvedDemo.url}
          title={title}
          loading="lazy"
          allowFullScreen
          onError={() => setHasError(true)}
          className="h-[620px] w-full bg-slate-50"
          sandbox="allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
          <span>若外部網站拒絕嵌入，可改用新分頁開啟。</span>
          <a href={fallbackUrl} target="_blank" rel="noreferrer" className="font-bold text-brand hover:underline">開啟備援連結</a>
        </div>
      </div>
    );
  }

  if (resolvedDemo.mode === "video") {
    if (!resolvedDemo.url) {
      return <DemoFallback title="尚未設定教學影片" message={description} fallbackUrl={fallbackUrl} />;
    }

    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-soft">
        <video
          controls
          preload="metadata"
          poster={resolvedDemo.posterUrl}
          onError={() => setHasError(true)}
          className="aspect-video w-full"
        >
          <source src={resolvedDemo.url} />
          您的瀏覽器不支援影片播放。
        </video>
        <div className="bg-white p-5">
          <h3 className="text-xl font-black text-ink">{title}</h3>
          <p className="mt-2 leading-7 text-slate-600">{description}</p>
        </div>
      </div>
    );
  }

  if (resolvedDemo.mode === "snapshot") {
    if (!resolvedDemo.url) {
      return <DemoFallback title="尚未設定作品快照" message={description} fallbackUrl={fallbackUrl} />;
    }

    return (
      <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
        <img
          src={resolvedDemo.url}
          alt={`${title} 快照`}
          onError={() => setHasError(true)}
          className="aspect-video w-full object-cover"
        />
        <figcaption className="p-5">
          <p className="text-sm font-black text-brand">SNAPSHOT</p>
          <h3 className="mt-1 text-xl font-black text-ink">{title}</h3>
          <p className="mt-2 leading-7 text-slate-600">{description}</p>
          <a href={fallbackUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex font-bold text-brand hover:underline">查看完整作品 →</a>
        </figcaption>
      </figure>
    );
  }

  return (
    <DemoFallback
      title="無法辨識的 Demo 模式"
      message={`目前設定的模式為 ${String(resolvedDemo.mode)}，請更新 Course Registry。`}
      fallbackUrl={fallbackUrl}
    />
  );
}
