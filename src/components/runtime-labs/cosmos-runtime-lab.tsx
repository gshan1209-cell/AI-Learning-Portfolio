export default function CosmosRuntimeLab() {
  return (
    <>
      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft md:p-12">
        <p className="text-sm font-black text-brand">COSMOS RUNTIME</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Cosmos 外部 GPU Provider 實驗室</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          真實生成介面正在接入伺服器端 Secret 與可設定 GPU Endpoint。系統不會使用 Mock 圖片或暗中切換其他模型；未設定 Provider 時會明確顯示未啟用。
        </p>
      </header>
      <section className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-7">
        <h2 className="text-2xl font-black text-ink">目前 Runtime Gate</h2>
        <p className="mt-3 leading-7 text-slate-700">等待 `/api/cosmos/status` 與 `/api/cosmos/generate` 完成後，此區會顯示實際模型、Provider、生成時間與真實圖片。</p>
      </section>
    </>
  );
}
