"use client";

import { useEffect, useState } from "react";
import { computeYearProgress, YearProgress } from "@/lib/yearProgress";

export function WeeksGrid({ year }: { year: number }) {
  const [progress, setProgress] = useState<YearProgress | null>(null);

  useEffect(() => {
    const tick = () => setProgress(computeYearProgress(year));
    const firstTick = setTimeout(tick, 0);
    const id = setInterval(tick, 60000);
    return () => {
      clearTimeout(firstTick);
      clearInterval(id);
    };
  }, [year]);

  const totalWeeks = progress?.totalWeeks ?? 52;
  const currentWeekIndex = progress?.currentWeekIndex ?? 0;
  const completedWeeks = currentWeekIndex;

  return (
    <div className="rounded-[28px] bg-card p-6 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-ink">Weeks in {year}</h2>
        <span className="text-xs font-medium text-ink-secondary">
          {progress === null ? "--" : `${completedWeeks} of ${totalWeeks} completed`}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-secondary">
        Every week checked off brings your vision to life.
      </p>
      <div
        className="mt-4 flex flex-wrap items-center gap-2"
        role="img"
        aria-label={
          progress === null
            ? `Loading week progress for ${year}`
            : `Week ${currentWeekIndex + 1} of ${totalWeeks} in ${year}; ${completedWeeks} weeks completed`
        }
      >
        {Array.from({ length: totalWeeks }).map((_, i) => {
          const isCurrent = i === currentWeekIndex;
          const isCompleted = i < currentWeekIndex;
          return (
            <span
              key={i}
              className={`rounded-full ${
                isCurrent
                  ? "h-5 w-5 bg-brand-deep ring-2 ring-brand-tint"
                  : isCompleted
                    ? "h-3.5 w-3.5 bg-brand"
                    : "h-3.5 w-3.5 bg-card-sunken"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
