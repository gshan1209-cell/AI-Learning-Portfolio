interface EthicsNoticeProps {
  type: "financial" | "boston" | "general";
}

export default function EthicsNotice({ type }: EthicsNoticeProps) {
  if (type === "financial") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 shadow-2xs">
        <div className="flex items-center gap-2 font-black text-amber-950">
          <span>⚠️ 投資風險與教學免責聲明</span>
        </div>
        <p className="mt-1 leading-relaxed text-amber-900/90">
          本頁面包含的股票歷史回測、時間序列迴歸與機器學習模型僅作為**機器學習演算法教學與程式實作展示**。歷史數據不代表未來表現，模型預測結果**不構成任何投資建議、買賣訊號或報酬承諾**。進行任何實際投資決策前，請自行評估個人風險承受能力。
        </p>
      </div>
    );
  }

  if (type === "boston") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-950 shadow-2xs">
        <div className="flex items-center gap-2 font-black text-rose-950">
          <span>🚨 資料集倫理與欄位爭議說明 (Boston Housing Dataset Notice)</span>
        </div>
        <p className="mt-1 leading-relaxed text-rose-900/90">
          Boston Housing 資料集收集於 1970 年代，其中包含爭議性欄位 <code className="rounded bg-rose-100 px-1 py-0.5 font-bold">B</code>（按城鎮黑人人口比例計算之變數）與 <code className="rounded bg-rose-100 px-1 py-0.5 font-bold">LSTAT</code>（低社經地位人口比例）。
          本站**預設倫理模式 (Ethical Mode)** 已主動排除 <code className="rounded bg-rose-100 px-1 py-0.5 font-bold">B</code> 欄位，並將 <code className="rounded bg-rose-100 px-1 py-0.5 font-bold">LSTAT</code> 標示為歷史社經代理變數。**嚴禁將此模型或結果用於真實房貸核准、保險定價、租屋篩選或任何人群評分決策。**
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs text-blue-900 shadow-2xs">
      <div className="flex items-center gap-2 font-black text-blue-950">
        <span>ℹ️ 數據與模型限制說明</span>
      </div>
      <p className="mt-1 leading-relaxed text-blue-900/90">
        本實驗室展示之機器學習演算法基於公開教學資料集。模型對於超出訓練範圍之資料外插能力有限，特徵重要性不等同於因果關係，結果請作為學術研究與概念理解參考。
      </p>
    </div>
  );
}
