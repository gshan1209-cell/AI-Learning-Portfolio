import type { CourseAssets } from "@/types/course";

interface CourseAssetsPanelProps {
  courseSlug: string;
  assets?: CourseAssets;
}

export default function CourseAssetsPanel({ courseSlug, assets }: CourseAssetsPanelProps) {
  if (!assets) return null;

  return (
    <section id="section-assets" className="mt-10 scroll-mt-20 rounded-3xl border border-slate-200 bg-slate-50 p-7 md:p-9">
      <div>
        <p className="text-sm font-black text-brand">COURSE SUMMARY</p>
        <h2 className="mt-1 text-3xl font-black text-ink">課程重點摘要</h2>
        <p className="mt-2 text-slate-600">公開課程頁只呈現學習內容與重點圖卡；簡報、NotebookLM 提示語與影片設計保留在內部資產管理，不對外顯示。</p>
      </div>

      <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-black text-ink">重點圖卡</h3>
        <p className="mt-2 leading-7 text-slate-600">以 9:16 圖卡快速複習課程核心觀念。</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`/courses/${courseSlug}/summary`}
            className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white"
          >
            開啟重點圖卡
          </a>
          {assets.summaryCard.url && (
            <a
              href={assets.summaryCard.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-ink"
            >
              Drive 原始圖卡
            </a>
          )}
        </div>
      </article>
    </section>
  );
}
