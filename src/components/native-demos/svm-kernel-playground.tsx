"use client";

import { useMemo, useState } from "react";

type Kernel = "rbf" | "linear" | "poly" | "sigmoid";

type Point = {
  x: number;
  y: number;
  label: 0 | 1;
  score: number;
  predicted: 0 | 1;
  isSupport: boolean;
};

const width = 620;
const height = 420;
const padding = 42;
const domain = 3.2;

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(random: () => number) {
  const u = Math.max(random(), Number.EPSILON);
  const v = Math.max(random(), Number.EPSILON);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function scaleX(value: number) {
  return padding + ((value + domain) / (domain * 2)) * (width - padding * 2);
}

function scaleY(value: number) {
  return height - padding - ((value + domain) / (domain * 2)) * (height - padding * 2);
}

function modelScore(kernel: Kernel, x: number, y: number, gamma: number, degree: number) {
  const radiusSquared = x * x + y * y;
  const radialDistance = radiusSquared - 1.85;

  if (kernel === "linear") return x * 0.9 + y * 0.25 - 0.15;
  if (kernel === "poly") return radialDistance * Math.max(1, degree * 0.55);
  if (kernel === "sigmoid") return Math.tanh(gamma * radialDistance);
  return gamma * radialDistance;
}

function teachingNotes(kernel: Kernel, cValue: number, gamma: number) {
  const notes: string[] = [];

  if (kernel === "linear") {
    notes.push("線性 Kernel 只能畫直線，面對同心圓資料通常會明顯分類失敗。");
  } else if (gamma < 0.2) {
    notes.push("Gamma 很小：單一資料點的影響範圍較廣，邊界較平滑，通常較不容易追著雜訊跑。");
  } else if (gamma > 3) {
    notes.push("Gamma 很大：影響範圍變窄，真實 RBF SVM 可能形成局部小泡泡，過擬合風險升高。");
  } else {
    notes.push("Gamma 位於中間區間：通常能在平滑程度與局部細節之間取得折衷。");
  }

  if (cValue < 1) {
    notes.push("C 很小：偏向軟間隔，願意容忍部分錯誤以換取較寬、較平滑的邊界。");
  } else if (cValue > 20) {
    notes.push("C 很大：會更積極修正訓練錯誤，真實模型可能因此產生更複雜的邊界。");
  } else {
    notes.push("C 位於平衡區間：兼顧分類正確率與間隔寬度。");
  }

  return notes;
}

export default function SvmKernelPlayground() {
  const [kernel, setKernel] = useState<Kernel>("rbf");
  const [cValue, setCValue] = useState(10);
  const [gamma, setGamma] = useState(1);
  const [degree, setDegree] = useState(3);
  const [pointCount, setPointCount] = useState(120);
  const [noise, setNoise] = useState(0.08);
  const [seed, setSeed] = useState(7);

  const model = useMemo(() => {
    const random = mulberry32(seed);
    const innerCount = Math.round(pointCount * 0.45);
    const outerCount = pointCount - innerCount;
    const raw: Array<{ x: number; y: number; label: 0 | 1 }> = [];

    for (let index = 0; index < innerCount; index += 1) {
      const radius = random();
      const angle = random() * Math.PI * 2;
      raw.push({
        x: radius * Math.cos(angle) + gaussian(random) * noise,
        y: radius * Math.sin(angle) + gaussian(random) * noise,
        label: 0,
      });
    }

    for (let index = 0; index < outerCount; index += 1) {
      const radius = 1.6 + random() * 0.9;
      const angle = random() * Math.PI * 2;
      raw.push({
        x: radius * Math.cos(angle) + gaussian(random) * noise,
        y: radius * Math.sin(angle) + gaussian(random) * noise,
        label: 1,
      });
    }

    const marginWidth = Math.max(0.08, 0.85 / Math.sqrt(cValue + 0.3));
    const points: Point[] = raw.map((point) => {
      const score = modelScore(kernel, point.x, point.y, gamma, degree);
      const predicted = score >= 0 ? 1 : 0;
      return {
        ...point,
        score,
        predicted,
        isSupport: Math.abs(score) <= marginWidth,
      };
    });

    const correct = points.filter((point) => point.predicted === point.label).length;
    const accuracy = correct / points.length;
    const supportCount = points.filter((point) => point.isSupport).length;

    return { points, accuracy, supportCount, marginWidth };
  }, [cValue, degree, gamma, kernel, noise, pointCount, seed]);

  const notes = teachingNotes(kernel, cValue, gamma);
  const boundaryRadius = Math.sqrt(1.85);

  return (
    <div className="rounded-3xl border border-indigo-200 bg-indigo-50/60 p-5 md:p-7">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <strong>Native 教學模型：</strong>此元件重現原課程的操作與觀念，用於快速理解 Kernel、C、Gamma 與支持向量；精確的 scikit-learn SVC 結果仍以已移入 Monorepo 的 Python 參考版為準。
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
          <label className="block text-sm font-bold text-ink">
            Kernel
            <select value={kernel} onChange={(event) => setKernel(event.target.value as Kernel)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2">
              <option value="rbf">RBF</option>
              <option value="linear">Linear</option>
              <option value="poly">Polynomial</option>
              <option value="sigmoid">Sigmoid</option>
            </select>
          </label>

          <label className="block text-sm font-bold text-ink">
            C：{cValue.toFixed(2)}
            <input type="range" min="0.1" max="100" step="0.1" value={cValue} onChange={(event) => setCValue(Number(event.target.value))} className="mt-2 w-full accent-indigo-700" />
          </label>

          {kernel !== "linear" && (
            <label className="block text-sm font-bold text-ink">
              Gamma：{gamma.toFixed(2)}
              <input type="range" min="0.05" max="10" step="0.05" value={gamma} onChange={(event) => setGamma(Number(event.target.value))} className="mt-2 w-full accent-indigo-700" />
            </label>
          )}

          {kernel === "poly" && (
            <label className="block text-sm font-bold text-ink">
              Degree：{degree}
              <input type="range" min="1" max="10" step="1" value={degree} onChange={(event) => setDegree(Number(event.target.value))} className="mt-2 w-full accent-indigo-700" />
            </label>
          )}

          <label className="block text-sm font-bold text-ink">
            資料點：{pointCount}
            <input type="range" min="40" max="300" step="10" value={pointCount} onChange={(event) => setPointCount(Number(event.target.value))} className="mt-2 w-full accent-indigo-700" />
          </label>

          <label className="block text-sm font-bold text-ink">
            Noise：{noise.toFixed(2)}
            <input type="range" min="0" max="0.5" step="0.01" value={noise} onChange={(event) => setNoise(Number(event.target.value))} className="mt-2 w-full accent-indigo-700" />
          </label>

          <label className="block text-sm font-bold text-ink">
            Seed
            <input type="number" min="1" max="1000" value={seed} onChange={(event) => setSeed(Math.max(1, Number(event.target.value) || 1))} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>
        </aside>

        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-bold text-slate-400">教學分類率</p><p className="mt-1 text-2xl font-black text-ink">{(model.accuracy * 100).toFixed(1)}%</p></div>
            <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-bold text-slate-400">近似支持向量</p><p className="mt-1 text-2xl font-black text-ink">{model.supportCount} / {pointCount}</p></div>
            <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-bold text-slate-400">目前 Kernel</p><p className="mt-1 text-2xl font-black uppercase text-ink">{kernel}</p></div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-3">
              <figcaption className="px-2 pb-3 text-sm font-bold text-white">2D 決策邊界與支持向量</figcaption>
              <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="SVM 二維決策邊界教學圖">
                <rect width={width} height={height} rx="16" fill="#020617" />
                <line x1={scaleX(0)} y1={padding} x2={scaleX(0)} y2={height - padding} stroke="#334155" />
                <line x1={padding} y1={scaleY(0)} x2={width - padding} y2={scaleY(0)} stroke="#334155" />

                {kernel === "linear" ? (
                  <line x1={scaleX(-3)} y1={scaleY(10.2)} x2={scaleX(3)} y2={scaleY(-11.4)} stroke="#facc15" strokeWidth="4" />
                ) : (
                  <circle cx={scaleX(0)} cy={scaleY(0)} r={(boundaryRadius / (domain * 2)) * (width - padding * 2)} fill="none" stroke="#facc15" strokeWidth="4" />
                )}

                {model.points.map((point, index) => (
                  <g key={`${index}-${point.x.toFixed(3)}`}>
                    {point.isSupport && <circle cx={scaleX(point.x)} cy={scaleY(point.y)} r="8" fill="none" stroke="#fde68a" strokeWidth="2" />}
                    <circle cx={scaleX(point.x)} cy={scaleY(point.y)} r="4.5" fill={point.label === 0 ? "#38bdf8" : "#fb7185"} opacity="0.9" />
                  </g>
                ))}
              </svg>
            </figure>

            <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
              <figcaption className="px-2 pb-3 text-sm font-bold text-ink">特徵提升直覺：z = x² + y²</figcaption>
              <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="資料點提升到高維特徵空間的示意圖">
                <rect width={width} height={height} rx="16" fill="#f8fafc" />
                <line x1="80" y1="350" x2="560" y2="350" stroke="#94a3b8" strokeWidth="2" />
                <line x1="120" y1="380" x2="120" y2="55" stroke="#94a3b8" strokeWidth="2" />
                <line x1="120" y1="350" x2="500" y2="105" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="105" y1="245" x2="535" y2="245" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10 8" />
                <text x="445" y="232" fontSize="15" fill="#92400e">3D 分割超平面</text>

                {model.points.map((point, index) => {
                  const z = point.x * point.x + point.y * point.y;
                  const screenX = 310 + point.x * 58 + point.y * 24;
                  const screenY = 350 - Math.min(z, 7) * 38 + point.y * 9;
                  return <circle key={`lift-${index}`} cx={screenX} cy={screenY} r="4.5" fill={point.label === 0 ? "#0284c7" : "#e11d48"} opacity="0.78" />;
                })}
              </svg>
            </figure>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-white p-5">
            <h4 className="font-black text-ink">動態教學提示</h4>
            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              {notes.map((note) => <p key={note}>• {note}</p>)}
              <p>• 黃色外圈代表靠近教學邊界的資料點，用來對應「支持向量決定邊界」的核心概念。</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
