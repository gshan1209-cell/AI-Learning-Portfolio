import type { CourseAssets } from "@/types/course";

interface CourseAssetsPanelProps {
  courseSlug: string;
  assets?: CourseAssets;
}

export default function CourseAssetsPanel({ courseSlug, assets }: CourseAssetsPanelProps) {
  if (!assets) return null;

  const items = [
    {
      title: "重點圖卡",
      description: "以 9:16 圖卡快速複習課程核心觀念。",
      href: `/courses/${courseSlug}/summary`,
      sourceUrl: assets.summaryCard.url,
      external: false,
    },
    {
      title: "課程簡報",
      description: "閱讀 8 頁課程敘事與核心視覺說明。",
      href: assets.presentation.url,
      external: true,
    },
    {
      title: "NotebookLM 提示語",
      description: "直接貼入 NotebookLM 使用的完整合併提示語。",
      href: assets.notebookLmPrompt.url,
      external: true,
    },
    {
      title: "64 秒影片設計",
      description: "查看 8 個場景、每段 8 秒的 FLOW 影片設計稿。",
      href: assets.videoDesign.url,
      external: true,
    },
  ];

  return (
    <section id="section-assets" className="mt-10 scroll-mt-20 rounded-3xl border border-slate-200 bg-slate-50 p-7 md:p-9">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black text-brand">COURSE ASSETS</p>
          <h2 className="mt-1 text-3xl font-black text-ink">課程資產一次打開</h2>
          <p className="mt-2 text-slate-600">圖卡、簡報、NotebookLM 提示語與影片設計皆以 course slug 對應管理。</p>
        </div>
        <a href={assets.driveFolderUrl} target="_blank" rel="noreferrer" className="font-bold text-brand hover:underline">
          開啟 Drive 課程資料夾 ↗
        </a>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black text-ink">{item.title}</h3>
            <p className="mt-2 leading-7 text-slate-600">{item.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white"
              >
                開啟{item.title}
              </a>
              {item.sourceUrl && (
                <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-ink">
                  Drive 原始檔
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
