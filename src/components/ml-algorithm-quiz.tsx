"use client";

import { useMemo, useState } from "react";
import type { MlQuizQuestion } from "@/types/ml-algorithm";

const COMPLETED_KEY = "mlAlgorithmCompleted";
const RESULTS_KEY = "mlAlgorithmQuizResults";
const EVENT_NAME = "mlProgressUpdated";

interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  submittedAt: string;
}

export default function MlAlgorithmQuiz({ slug, questions }: { slug: string; questions: MlQuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers, questions],
  );
  const passed = questions.length > 0 && score / questions.length >= 2 / 3;
  const allAnswered = questions.every((_, index) => Boolean(answers[index]));

  function submitQuiz() {
    if (!allAnswered) return;
    setSubmitted(true);

    try {
      const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || "{}") as Record<string, QuizResult>;
      results[slug] = {
        score,
        total: questions.length,
        passed,
        submittedAt: new Date().toISOString(),
      };
      localStorage.setItem(RESULTS_KEY, JSON.stringify(results));

      if (passed) {
        const completed = JSON.parse(localStorage.getItem(COMPLETED_KEY) || "[]") as string[];
        localStorage.setItem(COMPLETED_KEY, JSON.stringify(Array.from(new Set([...completed, slug]))));
        window.dispatchEvent(new Event(EVENT_NAME));
      }
    } catch {
      // localStorage may be unavailable in privacy mode; the current result still remains visible.
    }
  }

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
      <p className="text-sm font-black text-brand">CHECKPOINT QUIZ</p>
      <h2 className="mt-2 text-2xl font-black text-ink">三題檢核：你真的懂了嗎？</h2>
      <p className="mt-3 text-slate-600">全部作答後送出；答對至少兩題，就會記錄為完成。</p>

      <div className="mt-8 space-y-8">
        {questions.map((question, index) => {
          const selected = answers[index];
          const correct = selected === question.answer;
          return (
            <fieldset key={question.question} className="rounded-2xl border border-slate-200 p-5">
              <legend className="px-2 font-black text-ink">{index + 1}. {question.question}</legend>
              <div className="mt-4 grid gap-3">
                {question.options.map((option) => {
                  const isSelected = selected === option;
                  const answerClass = submitted
                    ? option === question.answer
                      ? "border-emerald-400 bg-emerald-50"
                      : isSelected
                        ? "border-rose-400 bg-rose-50"
                        : "border-slate-200 bg-white"
                    : isSelected
                      ? "border-brand bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-brand";

                  return (
                    <label key={option} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${answerClass}`}>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={isSelected}
                        disabled={submitted}
                        onChange={() => setAnswers((current) => ({ ...current, [index]: option }))}
                        className="mt-1"
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
              {submitted && (
                <div className={`mt-4 rounded-xl p-4 text-sm leading-6 ${correct ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>
                  <p className="font-black">{correct ? "答對了" : `正確答案：${question.answer}`}</p>
                  <p className="mt-1">{question.explanation}</p>
                </div>
              )}
            </fieldset>
          );
        })}
      </div>

      {submitted && (
        <div className={`mt-8 rounded-2xl p-5 ${passed ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>
          <p className="text-xl font-black">得分 {score} / {questions.length}</p>
          <p className="mt-2">{passed ? "已通過，本主題完成進度已保存。" : "尚未通過，重新閱讀後可以再試一次。"}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {!submitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={submitQuiz}
            className="rounded-xl bg-brand px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            送出答案
          </button>
        ) : (
          <button type="button" onClick={resetQuiz} className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700">
            重新作答
          </button>
        )}
      </div>
    </section>
  );
}
