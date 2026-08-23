"use client";

import { useState } from "react";
import { CATEGORY_META, Category } from "@/lib/categories";
import { CheckIcon, SendIcon } from "@/components/icons";

export function StepCard({
  category,
  count,
  goal,
  steps,
  checked,
  isRefining,
  onToggle,
  onRefine,
}: {
  category: Category;
  count: number;
  goal: string;
  steps: string[];
  checked: boolean[];
  isRefining: boolean;
  onToggle: (index: number) => void;
  onRefine: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const meta = CATEGORY_META[category];

  function submitRefine() {
    const trimmed = note.trim();
    if (!trimmed || isRefining) return;
    onRefine(trimmed);
    setNote("");
  }

  return (
    <div className="rounded-2xl bg-card-sunken p-4">
      <div className="flex items-center gap-2">
        <span
          style={{ backgroundColor: meta.tint, color: meta.tintText }}
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide"
        >
          {meta.label}
        </span>
        <span className="text-xs text-ink-secondary">
          {count} {count === 1 ? "image" : "images"}
        </span>
      </div>

      <p className="mt-2 text-sm font-bold text-ink">{goal}</p>

      <ul className="mt-3 space-y-2">
        {steps.map((step, i) => {
          const isChecked = checked[i] ?? false;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => onToggle(i)}
                className="flex w-full items-start gap-2.5 text-left"
                aria-pressed={isChecked}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors ${
                    isChecked ? "border-brand bg-brand" : "border-card-line bg-card"
                  }`}
                >
                  {isChecked && <CheckIcon className="h-3 w-3 text-white" />}
                </span>
                <span
                  className={`text-sm leading-snug ${
                    isChecked ? "text-ink-secondary line-through" : "text-ink"
                  }`}
                >
                  {step}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex items-center gap-2 border-t border-card-line pt-3">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitRefine();
          }}
          placeholder="Want this more specific? Add detail…"
          disabled={isRefining}
          className="flex-1 rounded-full border border-card-line bg-card px-3 py-1.5 text-xs text-ink placeholder:text-ink-secondary focus:border-brand focus:outline-none disabled:opacity-60"
        />
        <button
          type="button"
          onClick={submitRefine}
          disabled={isRefining || !note.trim()}
          aria-label="Refine this area's steps"
          className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      {isRefining && <p className="mt-2 text-xs text-ink-secondary">Refining…</p>}
    </div>
  );
}
