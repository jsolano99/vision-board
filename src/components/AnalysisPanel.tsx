"use client";

import { useState } from "react";
import { CATEGORY_META, Category, QUESTION_COPY } from "@/lib/categories";
import { CheckIcon, CopyIcon, MailIcon } from "@/components/icons";
import { StepCard } from "@/components/StepCard";

export type AnalysisResult = { category: Category; count: number; goal: string; steps: string[] };
export type AnalysisStatus = "idle" | "vision_loading" | "questions" | "loading" | "success" | "error";
export type AnalysisAnswers = Partial<Record<Category, string>>;
export type AnalysisInsights = Partial<Record<Category, { description: string; question: string }>>;

export function AnalysisPanel({
  imageCount,
  status,
  categoriesPresent,
  insights,
  answers,
  results,
  checkedSteps,
  refiningCategory,
  errorMessage,
  onStartAnalysis,
  onBackToIdle,
  onEditAnswers,
  onAnswerChange,
  onSubmitAnswers,
  onRetry,
  onToggleStep,
  onRefineCategory,
  onExportList,
}: {
  imageCount: number;
  status: AnalysisStatus;
  categoriesPresent: Category[];
  insights: AnalysisInsights;
  answers: AnalysisAnswers;
  results: AnalysisResult[];
  checkedSteps: Partial<Record<Category, boolean[]>>;
  refiningCategory: Category | null;
  errorMessage: string | null;
  onStartAnalysis: () => void;
  onBackToIdle: () => void;
  onEditAnswers: () => void;
  onAnswerChange: (category: Category, value: string) => void;
  onSubmitAnswers: () => void;
  onRetry: () => void;
  onToggleStep: (category: Category, index: number) => void;
  onRefineCategory: (category: Category, note: string) => void;
  onExportList: () => string;
}) {
  const [copied, setCopied] = useState(false);

  function handleEmail() {
    const body = onExportList();
    const subject = "My Vision Board — Next Steps";
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(onExportList());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Couldn't copy to clipboard:", err);
    }
  }

  return (
    <aside className="flex w-full flex-col rounded-[28px] bg-card p-6 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.35)] lg:w-[380px]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-ink">Next Steps</h2>
        {status === "success" && (
          <span className="rounded-full bg-card-sunken px-2.5 py-1 text-xs text-ink-secondary">
            {results.length} {results.length === 1 ? "area" : "areas"}
          </span>
        )}
      </div>

      {status === "idle" && (
        <>
          <button
            type="button"
            disabled={imageCount === 0}
            onClick={onStartAnalysis}
            className="mt-4 w-full rounded-full bg-brand py-2.5 text-sm font-semibold text-white transition-transform enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-card-sunken disabled:text-ink-secondary"
          >
            Analyze Board
          </button>
          {imageCount === 0 && (
            <p className="mt-3 text-sm text-ink-secondary">
              Add a few images to your board, then analyze it to get concrete next steps.
            </p>
          )}
          {imageCount > 0 && imageCount < 5 && (
            <p className="mt-3 text-sm text-ink-secondary">
              A few more images will give you a richer read — but {imageCount} is enough to
              start.
            </p>
          )}
          {imageCount > 0 && (
            <p className="mt-5 text-sm text-ink-secondary">
              Your next steps will show up here.
            </p>
          )}
        </>
      )}

      {status === "vision_loading" && (
        <div className="mt-5 flex-1">
          <p className="text-sm text-ink-secondary">Looking at your board…</p>
          <div className="mt-4 space-y-3">
            {Array.from({ length: categoriesPresent.length || 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-card-sunken p-4"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="h-3 w-16 rounded-full bg-black/10" />
                <div className="mt-3 h-3 w-full rounded-full bg-black/10" />
              </div>
            ))}
          </div>
        </div>
      )}

      {status === "questions" && (
        <div className="mt-4 flex flex-1 flex-col">
          <p className="text-sm text-ink-secondary">
            Quick context per area — the more specific, the more useful your next steps.
          </p>
          <div className="mt-4 flex-1 space-y-4">
            {categoriesPresent.map((category) => {
              const meta = CATEGORY_META[category];
              const insight = insights[category];
              return (
                <div key={category}>
                  <span
                    style={{ backgroundColor: meta.tint, color: meta.tintText }}
                    className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide"
                  >
                    {meta.label}
                  </span>
                  {insight?.description && (
                    <p className="mt-2 text-xs text-ink-secondary">{insight.description}</p>
                  )}
                  <label className="mt-2 block text-sm text-ink" htmlFor={`answer-${category}`}>
                    {insight?.question || QUESTION_COPY[category]}
                  </label>
                  <textarea
                    id={`answer-${category}`}
                    value={answers[category] ?? ""}
                    onChange={(e) => onAnswerChange(category, e.target.value)}
                    rows={2}
                    placeholder="Type your answer…"
                    className="mt-2 w-full resize-none rounded-xl border border-card-line bg-card-sunken px-3 py-2 text-sm text-ink placeholder:text-ink-secondary focus:border-brand focus:outline-none"
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={onBackToIdle}
              className="rounded-full bg-card-sunken px-4 py-2.5 text-sm font-semibold text-ink-secondary transition-colors hover:text-ink"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onSubmitAnswers}
              className="flex-1 rounded-full bg-brand py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Get Next Steps
            </button>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="mt-5 flex-1 space-y-3">
          {Array.from({ length: categoriesPresent.length || 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl bg-card-sunken p-4"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="h-3 w-16 rounded-full bg-black/10" />
              <div className="mt-3 h-3 w-full rounded-full bg-black/10" />
              <div className="mt-2 h-3 w-2/3 rounded-full bg-black/10" />
            </div>
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="mt-5 flex-1">
          <div className="rounded-2xl bg-cat-finance-tint p-4">
            <p className="text-sm text-cat-finance-text">
              {errorMessage ?? "Something went wrong analyzing your board."}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 text-sm font-semibold text-cat-finance-text underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="mt-4 flex flex-1 flex-col">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleEmail}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-card-sunken py-2 text-xs font-semibold text-ink transition-colors hover:bg-canvas"
            >
              <MailIcon className="h-3.5 w-3.5" />
              Email me this list
            </button>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy list to clipboard"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-card-sunken text-ink transition-colors hover:bg-canvas"
            >
              {copied ? (
                <CheckIcon className="h-3.5 w-3.5 text-brand" />
              ) : (
                <CopyIcon className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <div className="mt-4 flex-1 space-y-3">
            {results.map((r) => (
              <StepCard
                key={r.category}
                category={r.category}
                count={r.count}
                goal={r.goal}
                steps={r.steps}
                checked={checkedSteps[r.category] ?? []}
                isRefining={refiningCategory === r.category}
                onToggle={(i) => onToggleStep(r.category, i)}
                onRefine={(note) => onRefineCategory(r.category, note)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onEditAnswers}
            className="mt-3 text-sm font-semibold text-brand underline underline-offset-2"
          >
            Refine your answers
          </button>
        </div>
      )}
    </aside>
  );
}
