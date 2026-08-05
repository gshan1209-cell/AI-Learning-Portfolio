import Link from "next/link";
import { notFound } from "next/navigation";

const labSlugs = [
  "stock-manim",
  "cosmos-prompt-lab",
  "ensemble-fairness-lab",
] as const;

type LabSlug = (typeof labSlugs)[number];

export function generateStaticParams() {
  return labSlugs.map((slug) => ({ slug }));
}

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

function StockManimLab() {
  return (
    <>
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft md:p-12">
        <p className="text-sm font-black text-brand">NATIVE SCENE LAB</p>
        <h1 className="mt-2 text-4xl font-black text-ink">台股 Manim 九幕場景導覽</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          此頁導覽已移入 Monorepo 的九個 Python／Manim 場景與渲染流程，不冒充尚未完成環境驗收的 MP4 成果。
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
        <p className="text-sm font-black text-emerald-300">RENDER WORKFLOW</p>
        <h2 className="mt-2 text-2xl font-black">從單幕預覽到批次渲染</h2>
        <pre className="mt-5 overflow-x-auto rounded-2xl bg-black/40 p-5 text-sm leading-7"><code>{`cd modules/stock-manim-animation/python-manim
python -m venv .venv
pip install -r requirements.txt
manim -pql scenes/scene_02_candlestick_basics.py CandlestickBasics
python render_all.py`}</code></pre>
        <p className="mt-5 leading-7 text-slate-300">
          Manim 通常還需要 FFmpeg、Cairo／Pango 與合法可用的繁體中文字體。未完成實際渲染前，不宣稱影片已驗收。
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-7">
        <h2 className="text-2xl font-black text-ink">風險檢查</h2>
        <ul className="mt-4 space-y-3 leading-7 text-slate-700">
          <li>✓ 技術指標不得描述成獲利保證。</li>
          <li>✓ 回測要同時呈現交易成本、資料洩漏與最大回撤。</li>
          <li>✓ 本課程為視覺化教學，不構成投資建議。</li>
        </ul>
      </section>
    </>
  );
}

function CosmosPromptLab() {
  return (
    <>
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft md:p-12">
        <p className="text-sm font-black text-brand">PROMPT WORKSHEET</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Cosmos 提示詞設計實驗室</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          這是提示詞與 Runtime 邊界練習頁，不呼叫 Hugging Face，也不顯示假生成圖片。正式 Live 模式需要有效 Token 與可用 Provider。
        </p>
      </header>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-7">
          <h2 className="text-2xl font-black text-ink">提示詞五層結構</h2>
          <ol className="mt-5 space-y-4 leading-7 text-slate-700">
            <li><strong>1. 主體：</strong>誰或什麼是畫面焦點。</li>
            <li><strong>2. 動作：</strong>主體正在做什麼。</li>
            <li><strong>3. 環境：</strong>時間、地點與背景條件。</li>
            <li><strong>4. 構圖：</strong>景別、鏡頭、比例與光線。</li>
            <li><strong>5. 限制：</strong>負面提示詞與禁止元素。</li>
          </ol>
        </article>

        <form className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
          <h2 className="text-2xl font-black text-ink">設計草稿</h2>
          <label className="mt-5 block text-sm font-bold text-slate-700">
            主體與動作
            <input className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="例：農業無人機飛越稻田" />
          </label>
          <label className="mt-4 block text-sm font-bold text-slate-700">
            環境與光線
            <input className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="例：清晨薄霧、柔和側光" />
          </label>
          <label className="mt-4 block text-sm font-bold text-slate-700">
            長寬比
            <select className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" defaultValue="16:9">
              <option>16:9</option>
              <option>9:16</option>
              <option>1:1</option>
            </select>
          </label>
          <label className="mt-4 block text-sm font-bold text-slate-700">
            負面提示詞
            <input className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="例：模糊、浮水印、過多文字" />
          </label>
          <p className="mt-5 rounded-xl bg-white p-4 text-sm leading-6 text-slate-600">
            此表單只協助整理欄位，不會送出資料或產生圖片。請將完成的草稿貼到具備合法存取權與清楚模型標示的生成服務。
          </p>
        </form>
      </section>

      <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-7">
        <h2 className="text-2xl font-black text-ink">Runtime 誠實標示</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["LIVE", "Provider 已回傳真實結果，並標示模型與時間。"],
            ["WAITING／ERROR", "排隊、逾時或錯誤必須原樣呈現。"],
            ["DEMO／FALLBACK", "預先準備素材不可冒充本次即時生成。"],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl bg-white p-5">
              <p className="font-black text-brand">{title}</p>
              <p className="mt-2 leading-7 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function EnsembleFairnessLab() {
  return (
    <>
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft md:p-12">
        <p className="text-sm font-black text-brand">RESPONSIBLE AI LAB</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Ensemble 評估與公平性決策實驗室</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          來源 Repository 目前提供 Adult Census 分類系統規格。本頁只做模型選擇與治理練習，不輸出個人收入分類、假機率或未經訓練驗證的指標。
        </p>
      </header>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-7">
          <h2 className="text-2xl font-black text-ink">模型比較清單</h2>
          <ul className="mt-5 space-y-4 leading-7 text-slate-700">
            <li>□ Logistic Regression：可解釋的分類基準。</li>
            <li>□ Decision Tree：規則直觀，但容易過度擬合。</li>
            <li>□ Random Forest：多棵樹降低單樹不穩定。</li>
            <li>□ Gradient Boosting：逐步修正錯誤，需控制複雜度。</li>
            <li>□ Voting Classifier：整合多模型，但不能取代驗證。</li>
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
          <h2 className="text-2xl font-black text-ink">評估不能只看 Accuracy</h2>
          <div className="mt-5 space-y-4">
            {[
              ["Precision", "判為高收入者中，有多少真的屬於該類。"],
              ["Recall", "真實高收入者中，有多少被模型找出。"],
              ["F1", "Precision 與 Recall 的折衷。"],
              ["Confusion Matrix", "直接查看四種正確與錯誤數量。"],
            ].map(([metric, description]) => (
              <div key={metric} className="rounded-2xl bg-white p-5">
                <p className="font-black text-brand">{metric}</p>
                <p className="mt-1 leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-7">
        <h2 className="text-2xl font-black text-ink">敏感欄位與代理變數檢查</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {[
            "race、sex 是否為任務真正必要欄位？",
            "教育、職業或地區是否可能成為代理變數？",
            "是否依群體分開檢查錯誤率與 Recall？",
            "Prediction Logs 是否只保存必要資訊？",
            "模型版本、資料版本與部署時間是否可追溯？",
            "是否禁止把結果用於歧視性或高風險自動決策？",
          ].map((item) => (
            <label key={item} className="flex gap-3 rounded-xl bg-white p-4 leading-7 text-slate-700">
              <input type="checkbox" className="mt-1 h-4 w-4" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>
    </>
  );
}

export default function LearningLabPage({ params }: { params: { slug: string } }) {
  if (!labSlugs.includes(params.slug as LabSlug)) notFound();

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <Link href="/courses" className="text-sm font-bold text-brand hover:underline">
        ← 回到課程目錄
      </Link>
      <div className="mt-8">
        {params.slug === "stock-manim" && <StockManimLab />}
        {params.slug === "cosmos-prompt-lab" && <CosmosPromptLab />}
        {params.slug === "ensemble-fairness-lab" && <EnsembleFairnessLab />}
      </div>
    </main>
  );
}
