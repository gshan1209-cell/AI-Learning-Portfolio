const stockScenes = [
  ["00", "課程開場與學習地圖", "先建立九幕的觀看順序與風險邊界。"],
  ["01", "台股市場基本規則", "理解交易時間、價格與台股紅漲綠跌。"],
  ["02", "K 線 OHLC", "把開、高、低、收轉成單根 K 線。"],
  ["03", "MA5／MA20／MA60", "觀察短、中、長期均線的差異。"],
  ["04", "成交量與價量", "辨識量增、量縮與價格變化。"],
  ["05", "支撐與壓力", "用區域而非單一神奇價位理解市場反應。"],
  ["06", "趨勢與突破", "比較有效突破與假突破。"],
  ["07", "RSI／MACD／布林通道", "技術指標只提供觀察角度，不是保證。"],
  ["08", "回測與最大回撤", "把風險、成本與失敗案例一起放進結果。"],
] as const;

export default function StockManimLab() {
  return (
    <>
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft md:p-12">
        <p className="text-sm font-black text-brand">REAL MANIM RUNTIME</p>
        <h1 className="mt-2 text-4xl font-black text-ink">台股 Manim 九幕場景與渲染驗證</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          九個 Python／Manim 場景由獨立 GitHub Actions Runtime 安裝 FFmpeg、Cairo、Pango 與繁體中文字體後實際渲染。每支 MP4 必須通過 ffprobe 的影像串流、尺寸與時長檢查，才會被列入 Workflow Artifact。
        </p>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {stockScenes.map(([number, title, description]) => (
          <article key={number} className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-black text-brand">SCENE {number}</p>
            <h2 className="mt-2 text-xl font-black text-ink">{title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{description}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl bg-slate-950 p-7 text-slate-100 md:p-9">
        <p className="text-sm font-black text-emerald-300">STRICT RENDER WORKFLOW</p>
        <h2 className="mt-2 text-2xl font-black">Headless 渲染、ffprobe 與 SHA-256</h2>
        <pre className="mt-5 overflow-x-auto rounded-2xl bg-black/40 p-5 text-sm leading-7"><code>{`cd modules/stock-manim-animation/python-manim
python render_all.py \\
  --quality=-ql \\
  --media-dir runtime-media \\
  --manifest runtime-media/render-manifest.json`}</code></pre>
        <p className="mt-5 leading-7 text-slate-300">
          Renderer 採 strict 模式：缺少場景、Manim 非零退出、找不到 MP4、ffprobe 無影像串流，或尺寸／時長為零，都會使 Workflow 失敗。
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-7">
        <h2 className="text-2xl font-black text-ink">教學與風險邊界</h2>
        <ul className="mt-4 space-y-3 leading-7 text-slate-700">
          <li>✓ 技術指標不得描述成獲利保證。</li>
          <li>✓ 回測要同時呈現交易成本、資料洩漏與最大回撤。</li>
          <li>✓ 本課程為視覺化教學，不構成投資建議。</li>
        </ul>
      </section>
    </>
  );
}
