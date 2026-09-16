"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Quiz, QuizQuestion } from "@/features/quiz/types/quiz";

type Props = {
  quiz: Quiz;
  quizId: string;
  onRetry: () => void;
};

type AnswerState = Record<number, string>;

export function QuizResult({ quiz, quizId, onRetry }: Props) {
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitted, setSubmitted] = useState(false);

  const { questions } = quiz;

  function handleSelect(index: number, value: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [index]: value }));
  }

  async function handleSubmit() {
    setSubmitted(true);

    // คำนวณ score
    const correct = questions.filter(
      (q, i) => answers[i] === q.answer
    ).length;

    // บันทึก score ลง DB
    try {
      await fetch("/api/quiz", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          score: correct,
          total: questions.length,
        }),
      });
    } catch {
      // ไม่ block UI แม้บันทึกไม่สำเร็จ
    }
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
  }

  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.answer).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Score banner */}
      {submitted && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-center">
          <p className="text-sm text-emerald-300">Your Score</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {score} / {questions.length}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {Math.round((score / questions.length) * 100)}% correct
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-5">
        {questions.map((question, index) => (
          <QuestionCard
            key={index}
            index={index}
            question={question}
            selected={answers[index]}
            submitted={submitted}
            onSelect={(value) => handleSelect(index, value)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {!submitted ? (
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
          >
            Submit Answers
          </Button>
        ) : (
          <>
            <Button variant="ghost" className="flex-1" onClick={handleReset}>
              Retake Quiz
            </Button>
            <Button className="flex-1" onClick={onRetry}>
              Generate New Quiz
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Question Card ────────────────────────────────────────────────────────────

type QuestionCardProps = {
  index: number;
  question: QuizQuestion;
  selected: string | undefined;
  submitted: boolean;
  onSelect: (value: string) => void;
};

function QuestionCard({
  index,
  question,
  selected,
  submitted,
  onSelect,
}: QuestionCardProps) {
  const isCorrect = submitted && selected === question.answer;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/40 p-5 space-y-4">
      {/* Question */}
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-medium text-slate-400">
          {index + 1}
        </span>

        <p className="text-sm font-medium leading-relaxed text-white">
          {question.question}
        </p>

        {submitted && (
          <div className="ml-auto shrink-0">
            {isCorrect ? (
              <CheckCircle className="size-5 text-emerald-400" />
            ) : (
              <XCircle className="size-5 text-red-400" />
            )}
          </div>
        )}
      </div>

      {/* Options (multiple-choice & true-false) */}
      {question.options && question.options.length > 0 && (
        <div className="space-y-2 pl-9">
          {question.options.map((option) => {
            const isSelected = selected === option.text;
            const isAnswer = question.answer === option.text;

            let optionClass =
              "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition";

            if (!submitted) {
              optionClass += isSelected
                ? " border-emerald-500/50 bg-emerald-500/10 text-white"
                : " border-white/10 bg-slate-950/40 text-slate-300 hover:border-white/20 hover:text-white";
            } else {
              if (isAnswer) {
                optionClass +=
                  " border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
              } else if (isSelected && !isAnswer) {
                optionClass +=
                  " border-red-500/50 bg-red-500/10 text-red-300";
              } else {
                optionClass +=
                  " border-white/5 bg-slate-950/20 text-slate-500";
              }
            }

            return (
              <button
                key={option.label}
                className={optionClass}
                onClick={() => onSelect(option.text)}
                disabled={submitted}
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-current text-xs font-medium">
                  {option.label}
                </span>
                {option.text}
              </button>
            );
          })}
        </div>
      )}

      {/* Short answer */}
      {question.type === "short-answer" && (
        <div className="pl-9 space-y-2">
          <textarea
            rows={2}
            placeholder="Type your answer..."
            value={selected ?? ""}
            onChange={(e) => onSelect(e.target.value)}
            disabled={submitted}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-60 resize-none"
          />
        </div>
      )}

      {/* Explanation (after submit) */}
      {submitted && (
        <div className="ml-9 rounded-lg bg-slate-800/60 px-4 py-3 space-y-1">
          <p className="text-xs font-medium text-slate-400">Correct answer</p>
          <p className="text-sm text-emerald-300">{question.answer}</p>
          {question.explanation && (
            <>
              <p className="mt-2 text-xs font-medium text-slate-400">
                Explanation
              </p>
              <p className="text-sm text-slate-300">{question.explanation}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}