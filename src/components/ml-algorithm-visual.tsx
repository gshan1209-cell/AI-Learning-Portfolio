"use client";

import { useMemo, useState } from "react";

function VisualShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-soft md:p-8">
      <p className="text-sm font-black text-emerald-300">NATIVE VISUAL LAB</p>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-slate-300">{description}</p>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">{children}</div>
    </section>
  );
}

function Slider({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-sm font-bold text-slate-200">
      <span className="flex justify-between"><span>{label}</span><span className="text-emerald-300">{value}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-3 w-full" />
    </label>
  );
}

const scatterPoints = [[25, 78], [42, 70], [60, 65], [78, 56], [95, 52], [112, 43], [130, 38], [148, 31], [165, 25]];
const classAPoints = [[35, 35], [52, 48], [42, 66], [65, 75]];
const classBPoints = [[125, 28], [142, 46], [135, 68], [158, 78]];

export default function MlAlgorithmVisual({ visualType }: { visualType: string }) {
  const [primary, setPrimary] = useState(5);
  const [secondary, setSecondary] = useState(3);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const gradientSteps = useMemo(() => {
    const rate = primary / 20;
    let x = 4.2;
    const points: Array<[number, number]> = [];
    for (let index = 0; index < 8; index += 1) {
      points.push([x, x * x]);
      x -= rate * 2 * x;
    }
    return points;
  }, [primary]);

  if (visualType === "scatter-line") {
    const slope = primary / 5;
    return (
      <VisualShell title="線性回歸：調整趨勢線" description="改變斜率，觀察直線如何描述散點資料的整體趨勢。">
        <Slider label="斜率" value={primary} min={1} max={9} onChange={setPrimary} />
        <svg viewBox="0 0 190 100" className="mt-5 w-full rounded-xl bg-white">
          {scatterPoints.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="#0f766e" />)}
          <line x1="15" y1={92 - slope * 5} x2="175" y2={92 - slope * 55} stroke="#f97316" strokeWidth="3" />
        </svg>
      </VisualShell>
    );
  }

  if (visualType === "logistic-curve") {
    const thresholdX = 35 + primary * 13;
    return (
      <VisualShell title="邏輯回歸：機率與分類門檻" description="移動門檻，觀察同一組機率如何產生不同分類結果。">
        <Slider label="分類門檻" value={primary} min={1} max={9} onChange={setPrimary} />
        <svg viewBox="0 0 190 100" className="mt-5 w-full rounded-xl bg-white">
          <path d="M15 88 C55 88 65 82 82 65 C98 48 104 18 175 12" fill="none" stroke="#0f766e" strokeWidth="4" />
          <line x1={thresholdX} y1="8" x2={thresholdX} y2="92" stroke="#f97316" strokeWidth="2" strokeDasharray="5 4" />
          <text x={Math.min(150, thresholdX + 4)} y="20" fontSize="8" fill="#0f172a">threshold</text>
        </svg>
      </VisualShell>
    );
  }

  if (visualType === "decision-tree") {
    return (
      <VisualShell title="決策樹：條件分支" description="增加樹深度會提高表達能力，但過深也可能造成過度擬合。">
        <Slider label="示意深度" value={secondary} min={2} max={4} onChange={setSecondary} />
        <svg viewBox="0 0 190 115" className="mt-5 w-full rounded-xl bg-white">
          <line x1="95" y1="22" x2="55" y2="55" stroke="#64748b" strokeWidth="2" /><line x1="95" y1="22" x2="135" y2="55" stroke="#64748b" strokeWidth="2" />
          {secondary >= 3 && <><line x1="55" y1="55" x2="32" y2="92" stroke="#64748b" strokeWidth="2" /><line x1="55" y1="55" x2="75" y2="92" stroke="#64748b" strokeWidth="2" /><line x1="135" y1="55" x2="115" y2="92" stroke="#64748b" strokeWidth="2" /><line x1="135" y1="55" x2="158" y2="92" stroke="#64748b" strokeWidth="2" /></>}
          {[[95, 18], [55, 55], [135, 55], [32, 94], [75, 94], [115, 94], [158, 94]].map(([x, y], index) => (index < 3 || secondary >= 3) && <circle key={index} cx={x} cy={y} r={index === 0 ? 10 : 8} fill={index === 0 ? "#0f766e" : "#cbd5e1"} />)}
        </svg>
      </VisualShell>
    );
  }

  if (visualType === "random-forest") {
    const trees = Array.from({ length: primary }, (_, index) => index);
    return (
      <VisualShell title="隨機森林：多棵樹一起投票" description="增加樹的數量，觀察集成模型如何用多數決降低單棵樹的偏差。">
        <Slider label="決策樹數量" value={primary} min={3} max={9} onChange={setPrimary} />
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {trees.map((tree) => <div key={tree} className="rounded-xl bg-white p-4 text-center text-3xl">🌳<p className="mt-2 text-xs font-bold text-slate-600">Vote {tree % 3 === 0 ? "B" : "A"}</p></div>)}
        </div>
        <p className="mt-4 rounded-xl bg-emerald-400/15 p-4 font-black text-emerald-200">多數決結果：A</p>
      </VisualShell>
    );
  }

  if (visualType === "svm-margin") {
    const margin = 8 + primary * 2;
    return (
      <VisualShell title="SVM：最大化分類間隔" description="調整間隔寬度，觀察分隔線與兩側 Margin 的關係。">
        <Slider label="Margin 寬度" value={primary} min={2} max={9} onChange={setPrimary} />
        <svg viewBox="0 0 190 105" className="mt-5 w-full rounded-xl bg-white">
          {classAPoints.map(([x, y]) => <circle key={`a-${x}-${y}`} cx={x} cy={y} r="4" fill="#2563eb" />)}
          {classBPoints.map(([x, y]) => <circle key={`b-${x}-${y}`} cx={x} cy={y} r="4" fill="#dc2626" />)}
          <line x1="95" y1="10" x2="95" y2="95" stroke="#0f172a" strokeWidth="3" />
          <line x1={95 - margin} y1="10" x2={95 - margin} y2="95" stroke="#f59e0b" strokeDasharray="5 4" />
          <line x1={95 + margin} y1="10" x2={95 + margin} y2="95" stroke="#f59e0b" strokeDasharray="5 4" />
        </svg>
      </VisualShell>
    );
  }

  if (visualType === "knn-neighbors") {
    const k = primary % 2 === 0 ? primary + 1 : primary;
    return (
      <VisualShell title="KNN：最近鄰居投票" description="調整 K，觀察查詢點會參考多少個鄰居。K 太小容易受雜訊影響，太大則可能模糊局部結構。">
        <Slider label="K 值（自動取奇數）" value={primary} min={1} max={7} onChange={setPrimary} />
        <svg viewBox="0 0 190 105" className="mt-5 w-full rounded-xl bg-white">
          {classAPoints.map(([x, y]) => <circle key={`a-${x}-${y}`} cx={x} cy={y} r="4" fill="#2563eb" />)}
          {classBPoints.map(([x, y]) => <circle key={`b-${x}-${y}`} cx={x} cy={y} r="4" fill="#dc2626" />)}
          <circle cx="96" cy="57" r={12 + k * 3} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 4" />
          <circle cx="96" cy="57" r="5" fill="#111827" /><text x="103" y="53" fontSize="8" fill="#111827">K={k}</text>
        </svg>
      </VisualShell>
    );
  }

  if (visualType === "kmeans-clustering") {
    const k = Math.min(4, Math.max(2, secondary));
    const centers = [[48, 38], [138, 65], [90, 82], [145, 22]].slice(0, k);
    return (
      <VisualShell title="K-means：更新群中心" description="設定 K 值，觀察資料將圍繞不同中心形成群組。">
        <Slider label="群組數 K" value={secondary} min={2} max={4} onChange={setSecondary} />
        <svg viewBox="0 0 190 105" className="mt-5 w-full rounded-xl bg-white">
          {scatterPoints.concat([[38, 28], [145, 74], [88, 87], [154, 19]]).map(([x, y], index) => <circle key={index} cx={x} cy={y} r="3.5" fill={["#2563eb", "#dc2626", "#16a34a", "#9333ea"][index % k]} opacity="0.75" />)}
          {centers.map(([x, y], index) => <g key={index}><circle cx={x} cy={y} r="8" fill="none" stroke="#0f172a" strokeWidth="2" /><text x={x - 2.5} y={y + 3} fontSize="9" fill="#0f172a">×</text></g>)}
        </svg>
      </VisualShell>
    );
  }

  if (visualType === "naive-bayes-text") {
    const words = ["免費", "中獎", "會議", "立即領取", "報告", "優惠"];
    const risky = new Set(["免費", "中獎", "立即領取", "優惠"]);
    const riskScore = Math.min(100, selectedWords.filter((word) => risky.has(word)).length * 25);
    return (
      <VisualShell title="Naive Bayes：文字線索與機率" description="點選郵件中出現的詞彙，觀察垃圾郵件風險如何隨特徵累積。">
        <div className="flex flex-wrap gap-3">
          {words.map((word) => {
            const selected = selectedWords.includes(word);
            return <button key={word} type="button" onClick={() => setSelectedWords((current) => selected ? current.filter((item) => item !== word) : [...current, word])} className={`rounded-full px-4 py-2 font-bold ${selected ? "bg-emerald-400 text-slate-950" : "bg-white/10 text-white"}`}>{word}</button>;
          })}
        </div>
        <div className="mt-6 h-4 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-amber-400 transition-[width]" style={{ width: `${riskScore}%` }} /></div>
        <p className="mt-3 font-black text-amber-200">垃圾郵件示意機率：{riskScore}%</p>
      </VisualShell>
    );
  }

  if (visualType === "pca-projection") {
    const angle = (primary / 10) * Math.PI;
    const x1 = 95 - Math.cos(angle) * 75;
    const y1 = 55 + Math.sin(angle) * 38;
    const x2 = 95 + Math.cos(angle) * 75;
    const y2 = 55 - Math.sin(angle) * 38;
    return (
      <VisualShell title="PCA：尋找最大變異方向" description="旋轉投影軸，理解 PCA 如何尋找最能保留資料差異的方向。">
        <Slider label="投影角度" value={primary} min={0} max={10} onChange={setPrimary} />
        <svg viewBox="0 0 190 110" className="mt-5 w-full rounded-xl bg-white">
          {scatterPoints.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="#0f766e" />)}
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f97316" strokeWidth="3" />
        </svg>
      </VisualShell>
    );
  }

  if (visualType === "gradient-descent") {
    const mapped = gradientSteps.map(([x, loss]) => ({ x: 95 + x * 15, y: 94 - Math.min(80, loss * 4) }));
    return (
      <VisualShell title="梯度下降：學習率與收斂" description="改變學習率，觀察參數是否平穩走向誤差最低點，或因步伐太大而震盪。">
        <Slider label="學習率 × 20" value={primary} min={1} max={10} onChange={setPrimary} />
        <svg viewBox="0 0 190 105" className="mt-5 w-full rounded-xl bg-white">
          <path d="M18 18 Q95 155 172 18" fill="none" stroke="#64748b" strokeWidth="3" />
          {mapped.map((point, index) => <g key={index}><circle cx={point.x} cy={point.y} r="4" fill={index === mapped.length - 1 ? "#16a34a" : "#f97316"} /><text x={point.x + 4} y={point.y - 3} fontSize="7" fill="#0f172a">{index + 1}</text></g>)}
        </svg>
      </VisualShell>
    );
  }

  return (
    <VisualShell title="視覺化元件待註冊" description={`找不到 visualType：${visualType}`}>
      <p className="text-slate-300">教材與測驗仍可正常使用。</p>
    </VisualShell>
  );
}
