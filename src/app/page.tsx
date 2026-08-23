"use client";

import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { YearCountdown } from "@/components/YearCountdown";
import { WeeksGrid } from "@/components/WeeksGrid";
import { CategoryFilterTabs } from "@/components/CategoryFilterTabs";
import { BoardCanvas } from "@/components/BoardCanvas";
import {
  AnalysisAnswers,
  AnalysisInsights,
  AnalysisPanel,
  AnalysisResult,
  AnalysisStatus,
} from "@/components/AnalysisPanel";
import { BoardImage } from "@/lib/board";
import { CATEGORY_ORDER, Category, nextCategory } from "@/lib/categories";

const YEAR = new Date().getFullYear();
const TAP_HINT_KEY = "vision-board-tap-hint-dismissed";

export default function Home() {
  const [images, setImages] = useState<BoardImage[]>([]);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [insights, setInsights] = useState<AnalysisInsights>({});
  const [answers, setAnswers] = useState<AnalysisAnswers>({});
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryStage, setRetryStage] = useState<"vision" | "final">("vision");
  const [tapHintDismissed, setTapHintDismissed] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Partial<Record<Category, boolean[]>>>({});
  const [refiningCategory, setRefiningCategory] = useState<Category | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      if (sessionStorage.getItem(TAP_HINT_KEY) === "1") setTapHintDismissed(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const categoriesPresent = CATEGORY_ORDER.filter((c) =>
    images.some((img) => img.category === c)
  );

  function handleImagesAdded(added: BoardImage[]) {
    setImages((prev) => [...prev, ...added]);
    setStatus("idle");
  }

  function handleMove(id: string, x: number, y: number) {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, x, y } : img)));
  }

  function handleCycleCategory(id: string) {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, category: nextCategory(img.category) } : img))
    );
    setStatus("idle");
    if (!tapHintDismissed) {
      setTapHintDismissed(true);
      sessionStorage.setItem(TAP_HINT_KEY, "1");
    }
  }

  function handleRemove(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setStatus("idle");
  }

  function handleAnswerChange(category: Category, value: string) {
    setAnswers((prev) => ({ ...prev, [category]: value }));
  }

  async function handleStartAnalysis() {
    setStatus("vision_loading");
    setErrorMessage(null);
    setRetryStage("vision");
    try {
      const res = await fetch("/api/vision-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: images.map((img) => ({ category: img.category, dataUrl: img.url })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error ?? "Couldn't read your board's images.");
        setStatus("error");
        return;
      }
      setInsights(data.categories);
      setStatus("questions");
    } catch {
      setErrorMessage("Couldn't reach the image analyzer. Check your connection and try again.");
      setStatus("error");
    }
  }

  async function handleSubmitAnswers() {
    setStatus("loading");
    setErrorMessage(null);
    setRetryStage("final");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: images.map((img) => ({ category: img.category })),
          answers,
          descriptions: Object.fromEntries(
            Object.entries(insights).map(([c, v]) => [c, v.description])
          ),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error ?? "Something went wrong analyzing your board.");
        setStatus("error");
        return;
      }
      setResults(data.results);
      setCheckedSteps(
        Object.fromEntries(
          (data.results as AnalysisResult[]).map((r) => [r.category, r.steps.map(() => false)])
        )
      );
      setStatus("success");
    } catch {
      setErrorMessage("Couldn't reach the analyzer. Check your connection and try again.");
      setStatus("error");
    }
  }

  function handleRetry() {
    if (retryStage === "vision") {
      handleStartAnalysis();
    } else {
      handleSubmitAnswers();
    }
  }

  function handleToggleStep(category: Category, index: number) {
    setCheckedSteps((prev) => {
      const current = prev[category] ?? [];
      const next = current.map((v, i) => (i === index ? !v : v));
      return { ...prev, [category]: next };
    });
  }

  async function handleRefineCategory(category: Category, note: string) {
    setRefiningCategory(category);
    try {
      const existing = results.find((r) => r.category === category);
      const combinedAnswer = [answers[category], note].filter(Boolean).join(" Also: ");
      const res = await fetch("/api/refine-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          count: existing?.count ?? 1,
          description: insights[category]?.description,
          answer: combinedAnswer,
        }),
      });
      const data = await res.json();
      if (!res.ok) return;
      setResults((prev) =>
        prev.map((r) =>
          r.category === category ? { ...r, goal: data.goal, steps: data.steps } : r
        )
      );
      setCheckedSteps((prev) => ({ ...prev, [category]: data.steps.map(() => false) }));
    } finally {
      setRefiningCategory(null);
    }
  }

  function handleExportList(): string {
    const lines: string[] = [`My ${YEAR} Vision Board — Next Steps`, ""];
    for (const r of results) {
      lines.push(`${r.category.toUpperCase()} — ${r.goal}`);
      for (const step of r.steps) lines.push(`- ${step}`);
      lines.push("");
    }
    return lines.join("\n");
  }

  return (
    <div className="flex min-h-screen flex-col pb-10">
      <NavBar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pt-8 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="max-w-md text-sm text-ink-secondary">
              Pin the images that show where you are headed. Once the board is ready, get a
              concrete list of what to actually do about it.
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Your {YEAR} Vision Board
            </h1>
          </div>
          <YearCountdown year={YEAR} />
        </div>

        <WeeksGrid year={YEAR} />

        <CategoryFilterTabs active={filter} onChange={setFilter} />

        <div className="flex flex-1 flex-col gap-6 lg:flex-row">
          <BoardCanvas
            images={images}
            filter={filter}
            showTapHint={!tapHintDismissed}
            onImagesAdded={handleImagesAdded}
            onMove={handleMove}
            onCycleCategory={handleCycleCategory}
            onRemove={handleRemove}
          />
          <AnalysisPanel
            imageCount={images.length}
            status={status}
            categoriesPresent={categoriesPresent}
            insights={insights}
            answers={answers}
            results={results}
            checkedSteps={checkedSteps}
            refiningCategory={refiningCategory}
            errorMessage={errorMessage}
            onStartAnalysis={handleStartAnalysis}
            onBackToIdle={() => setStatus("idle")}
            onEditAnswers={() => setStatus("questions")}
            onAnswerChange={handleAnswerChange}
            onSubmitAnswers={handleSubmitAnswers}
            onRetry={handleRetry}
            onToggleStep={handleToggleStep}
            onRefineCategory={handleRefineCategory}
            onExportList={handleExportList}
          />
        </div>
      </main>
    </div>
  );
}
