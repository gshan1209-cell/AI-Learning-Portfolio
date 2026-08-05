export default function EnsembleRuntimeLab() {
  return (
    <>
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft md:p-12">
        <p className="text-sm font-black text-brand">ENSEMBLE RUNTIME</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Adult Census 模型推論與公平性驗證</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          真實模型 Runtime 將由固定資料切分重新訓練多個分類器，輸出版本化 Pipeline、整體評估與分群公平性報告，再由 Python Function 執行短時間推論。
        </p>
      </header>
      <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-7">
        <h2 className="text-2xl font-black text-ink">目前 Runtime Gate</h2>
        <p className="mt-3 leading-7 text-slate-700">等待可重現 Artifact、固定測試資料與 `/api/ensemble-predict` 完成後，此區才會開放真實機率與模型版本。</p>
      </section>
    </>
  );
}
