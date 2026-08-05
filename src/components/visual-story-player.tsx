"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import storyData from "@/data/ai-visual-story.json";

type Transition = "fade" | "slide-in" | "zoom-in";

type StorySlide = {
  id: string;
  imageUrl: string;
  alt: string;
  text: string;
  duration: number;
  transition: Transition;
};

const slides = storyData.slides as StorySlide[];

function transitionClass(transition: Transition, reducedMotion: boolean): string {
  if (reducedMotion) return "opacity-100";
  if (transition === "slide-in") return "animate-[story-slide_650ms_ease-out]";
  if (transition === "zoom-in") return "animate-[story-zoom_650ms_ease-out]";
  return "animate-[story-fade_650ms_ease-out]";
}

export default function VisualStoryPlayer() {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const startedAtRef = useRef(0);
  const elapsedRef = useRef(0);

  const slide = slides[index];
  const total = slides.length;
  const durationMs = slide.duration * 1000;

  const show = useCallback((nextIndex: number) => {
    const normalized = (nextIndex + total) % total;
    setIndex(normalized);
    setProgress(0);
    elapsedRef.current = 0;
    startedAtRef.current = Date.now();
  }, [total]);

  const next = useCallback(() => show(index + 1), [index, show]);
  const previous = useCallback(() => show(index - 1), [index, show]);

  const toggle = useCallback(() => {
    if (!started) setStarted(true);
    setPlaying((current) => {
      if (!current) startedAtRef.current = Date.now() - elapsedRef.current;
      else elapsedRef.current = Date.now() - startedAtRef.current;
      return !current;
    });
  }, [started]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!started || !playing) return;
    startedAtRef.current = Date.now() - elapsedRef.current;

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current;
      elapsedRef.current = elapsed;
      const percent = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(percent);
      if (elapsed >= durationMs) next();
    }, 100);

    return () => window.clearInterval(timer);
  }, [durationMs, next, playing, started]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
      if (event.key === " " || event.key === "k") {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, previous, toggle]);

  const [heading, ...paragraphs] = useMemo(() => slide.text.split("\n"), [slide.text]);

  const start = () => {
    setStarted(true);
    setPlaying(true);
    setProgress(0);
    elapsedRef.current = 0;
    startedAtRef.current = Date.now();
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 text-white shadow-2xl" aria-label="AI 圖文故事播放器">
      <style jsx>{`
        @keyframes story-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes story-slide { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes story-zoom { from { opacity: 0; transform: scale(1.035); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <div className="h-1 bg-white/10" aria-hidden="true">
        <div className="h-full bg-gradient-to-r from-sky-300 to-rose-300 transition-[width] duration-100" style={{ width: `${progress}%` }} />
      </div>

      <div className="relative min-h-[620px] bg-[radial-gradient(circle_at_50%_42%,rgba(54,75,112,0.3),transparent_42%)] md:min-h-[720px]">
        <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between gap-3">
          <div className="rounded-xl border border-white/15 bg-slate-950/75 px-4 py-2 text-sm font-black backdrop-blur-xl">
            {storyData.title}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-slate-950/75 p-2 backdrop-blur-xl" aria-label="播放控制">
            <button type="button" onClick={previous} className="rounded-lg px-3 py-2 font-black hover:bg-white/10" aria-label="上一幕">←</button>
            <button type="button" onClick={toggle} className="min-w-20 rounded-lg px-3 py-2 font-black hover:bg-white/10" aria-label={playing ? "暫停" : "播放"}>
              {playing ? "暫停" : "播放"}
            </button>
            <button type="button" onClick={next} className="rounded-lg px-3 py-2 font-black hover:bg-white/10" aria-label="下一幕">→</button>
            <span className="min-w-16 px-2 text-center text-sm text-slate-300">{index + 1} / {total}</span>
          </div>
        </div>

        <div className="grid min-h-[620px] grid-rows-[minmax(0,1fr)_auto] md:min-h-[720px]">
          <div className="grid place-items-center px-4 pb-6 pt-24 md:px-10">
            <figure key={slide.id} className={`grid h-full max-h-[470px] w-full max-w-4xl place-items-center overflow-hidden rounded-2xl bg-black shadow-2xl ${transitionClass(slide.transition, reducedMotion)}`}>
              <img src={slide.imageUrl} alt={slide.alt} className="h-full max-h-[470px] w-full object-contain" />
            </figure>
          </div>

          <div className="border-t border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950 p-6 text-center md:px-12 md:py-8" aria-live="polite">
            <p className="text-sm font-black uppercase tracking-widest text-sky-300">{heading}</p>
            <p className="mx-auto mt-3 max-w-4xl whitespace-pre-wrap text-lg font-semibold leading-8 text-slate-100 md:text-xl">
              {paragraphs.join("\n")}
            </p>
          </div>
        </div>

        {!started && (
          <div className="absolute inset-0 z-30 grid place-items-center bg-[radial-gradient(circle_at_center,rgba(20,43,72,0.55),rgba(5,8,22,0.94))] p-5">
            <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-slate-950/80 p-8 text-center shadow-2xl backdrop-blur-2xl">
              <p className="text-sm font-black tracking-widest text-sky-300">NATIVE STORY RUNTIME</p>
              <h1 className="mt-3 text-4xl font-black">{storyData.title}</h1>
              <p className="mt-4 leading-7 text-slate-300">十二幕故事、播放狀態、鍵盤操作與進度控制均由 AI-Learning-Portfolio 的 React 元件執行，不再嵌入外部播放器。</p>
              <button type="button" onClick={start} className="mt-7 rounded-full bg-gradient-to-r from-sky-300 to-rose-300 px-7 py-3 font-black text-slate-950">
                開始播放
              </button>
              <p className="mt-4 text-xs text-slate-400">鍵盤：← 上一幕｜→ 下一幕｜空白鍵或 K 播放／暫停</p>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-white/10 bg-slate-950 px-6 py-5 text-sm leading-6 text-slate-400">
        <p><strong className="text-slate-200">來源：</strong>{storyData.sourceRepository}／{storyData.sourcePath}，Blob {storyData.sourceBlobSha.slice(0, 12)}。</p>
        <p className="mt-1"><strong className="text-slate-200">素材權利：</strong>{storyData.rightsStatus}</p>
      </footer>
    </section>
  );
}
