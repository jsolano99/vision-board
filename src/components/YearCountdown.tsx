"use client";

import { useEffect, useState } from "react";
import { computeYearProgress, YearProgress } from "@/lib/yearProgress";

const SIZE = 128;
const STROKE = 11;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function YearCountdown({
  year,
  compact = false,
}: {
  year: number;
  compact?: boolean;
}) {
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

  const fraction = progress?.fraction ?? 0;
  const offset = CIRCUMFERENCE * (1 - fraction);

  const stats: { value: number | null; label: string }[] = [
    { value: progress?.monthsLeft ?? null, label: "months" },
    { value: progress?.weeksLeft ?? null, label: "weeks" },
    { value: progress?.daysLeft ?? null, label: "days" },
  ];

  return (
    <div className="flex flex-col items-center rounded-[28px] bg-card px-6 py-5 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--brand-tint)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--brand)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 600ms ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tabular-nums leading-none text-ink">
            {progress === null ? "--" : progress.daysLeft}
          </span>
          <span className="mt-1 text-xs font-medium tracking-wide text-ink-secondary uppercase">
            days left
          </span>
        </div>
      </div>

      <span className="mt-3 text-xs font-medium text-ink-secondary">Through {year}</span>

      {!compact && (
        <div className="mt-4 flex w-full items-stretch justify-between gap-2 border-t border-canvas-line pt-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-1 flex-col items-center">
              <span className="text-lg font-bold tabular-nums leading-none text-ink">
                {s.value === null ? "--" : s.value}
              </span>
              <span className="mt-1 text-xs font-medium tracking-wide text-ink-secondary uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
