"use client";

import { FormEvent, useState } from "react";
import type { AiConversationMessage, MlTutorResponse } from "@/types/ai";

interface DisplayMessage extends AiConversationMessage {
  id: string;
}

const starterQuestions = [
  "可以用更生活化的例子解釋嗎？",
  "這個演算法最適合用在哪裡？",
  "初學者最容易犯什麼錯？",
];

export default function MlAiTutor({
  algorithmSlug,
  algorithmName,
}: {
  algorithmSlug: string;
  algorithmName: string;
}) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState(starterQuestions);
  const [metadata, setMetadata] = useState<MlTutorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askTutor(question: string) {
    const normalized = question.trim();
    if (!normalized || loading) return;

    const userMessage: DisplayMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: normalized,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/ml-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          algorithmSlug,
          message: normalized,
          history: messages.slice(-6).map(({ role, content }) => ({ role, content })),
        }),
      });
      const payload = await response.json() as MlTutorResponse | { error?: string };
      if (!response.ok || !("reply" in payload)) {
        throw new Error("error" in payload && payload.error ? payload.error : "AI tutor request failed.");
      }

      setMessages([
        ...nextMessages,
        { id: crypto.randomUUID(), role: "assistant", content: payload.reply },
      ]);
      setSuggestions(payload.suggested_questions.length > 0 ? payload.suggested_questions : starterQuestions);
      setMetadata(payload);
    } catch (requestError) {
      console.error(requestError);
      setError("助教目前無法回覆，教材、視覺化與測驗仍可正常使用。稍後可以再試一次。");
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askTutor(input);
  }

  function exportNotes() {
    if (messages.length === 0) return;
    const dateStr = new Date().toLocaleDateString("zh-TW");
    let content = `# ${algorithmName} AI 學習對話筆記\n\n- **對話日期**：${dateStr}\n- **演算法**：${algorithmName} (${algorithmSlug})\n\n---\n\n`;
    messages.forEach((msg) => {
      content += `### ${msg.role === "user" ? "👤 提問" : "🤖 AI 助教"}\n\n${msg.content}\n\n`;
    });

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${algorithmSlug}-ai-learning-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-brand">AI TUTOR · GOVERNED MODE</p>
          <h2 className="mt-2 text-2xl font-black text-ink">詢問 {algorithmName} 助教</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            AI 只取得目前教材與最近六則對話，不需要姓名、Email 或帳號。未設定 Gemini Secret 時會自動使用固定教材回答。
          </p>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={exportNotes}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1 shadow-sm"
              title="將目前的對話匯出為 Markdown 筆記"
            >
              📥 匯出 Markdown 筆記
            </button>
          )}
          <span className={`rounded-full px-3 py-2 text-xs font-black ${metadata?.mode === "live" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
            {metadata?.mode === "live" ? "LIVE AI" : "SAFE FALLBACK READY"}
          </span>
        </div>
      </div>

      <div className="mt-6 min-h-40 space-y-3 rounded-2xl bg-slate-50 p-4" aria-live="polite">
        {messages.length === 0 && (
          <p className="py-8 text-center text-slate-500">選一個建議問題，或輸入你看不懂的地方。</p>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7 ${message.role === "user" ? "bg-ink text-white" : "border border-emerald-200 bg-emerald-50 text-emerald-950"}`}>
              {message.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-sm font-bold text-slate-500">助教正在整理教材重點…</p>}
        {error && <p className="rounded-xl bg-amber-50 p-4 text-sm font-bold text-amber-900">{error}</p>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.slice(0, 3).map((question) => (
          <button
            key={question}
            type="button"
            disabled={loading}
            onClick={() => void askTutor(question)}
            className="rounded-full border border-slate-300 px-4 py-2 text-left text-sm font-bold text-slate-700 hover:border-brand hover:text-brand disabled:opacity-50"
          >
            {question}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value.slice(0, 1000))}
          placeholder="例如：為什麼 K 值不能隨便選？"
          maxLength={1000}
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-brand"
        />
        <button disabled={loading || !input.trim()} className="rounded-xl bg-brand px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">
          送出問題
        </button>
      </form>

      {metadata && (
        <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
          <div><span className="font-black">Prompt</span><br />{metadata.prompt.id}@{metadata.prompt.version}</div>
          <div><span className="font-black">Model</span><br />{metadata.model}</div>
          <div><span className="font-black">Token</span><br />{metadata.usage.totalTokens}</div>
          <div><span className="font-black">估算成本</span><br />{metadata.cost.estimatedUsd === null ? "尚未設定費率" : `$${metadata.cost.estimatedUsd}`}</div>
        </div>
      )}
    </section>
  );
}
