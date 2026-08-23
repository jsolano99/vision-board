"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORY_META, Category } from "@/lib/categories";
import { CheckIcon, SendIcon } from "@/components/icons";

type DemoPhase = "idle" | "press" | "on" | "off" | "done";

let checkDemoConsumed = false;

function useCheckDemo(enabled: boolean) {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const abortRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (checkDemoConsumed) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      checkDemoConsumed = true;
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const later = (ms: number, fn: () => void) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) fn();
        }, ms),
      );
    };

    abortRef.current = () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      checkDemoConsumed = true;
      setPhase("done");
      abortRef.current = null;
    };

    later(560, () => {
      checkDemoConsumed = true;
      setPhase("press");
    });
    later(700, () => setPhase("on"));
    later(1460, () => setPhase("off"));
    later(1680, () => setPhase("done"));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      abortRef.current = null;
    };
  }, [enabled]);

  return { phase, abort: () => abortRef.current?.() };
}

export function StepCard({
  category,
  count,
  goal,
  steps,
  checked,
  isRefining,
  playCheckDemo = false,
  onToggle,
  onRefine,
}: {
  category: Category;
  count: number;
  goal: string;
  steps: string[];
  checked: boolean[];
  isRefining: boolean;
  playCheckDemo?: boolean;
  onToggle: (index: number) => void;
  onRefine: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const meta = CATEGORY_META[category];
  const { phase: demoPhase, abort: abortDemo } = useCheckDemo(
    playCheckDemo && steps.length > 0,
  );

  function submitRefine() {
    const trimmed = note.trim();
    if (!trimmed || isRefining) return;
    onRefine(trimmed);
    setNote("");
  }

  function handleToggle(index: number) {
    if (index === 0) abortDemo();
    onToggle(index);
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
          const demoOn = i === 0 && demoPhase === "on";
          const demoPress = i === 0 && demoPhase === "press";
          const visualOn = isChecked || demoOn;

          return (
            <li key={i}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => handleToggle(i)}
                className="step-row flex w-full items-start gap-2.5 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span
                  className="step-checkbox mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-[4px] border-2 border-card-line bg-card"
                  data-on={visualOn ? "true" : "false"}
                  data-pressed={demoPress ? "true" : undefined}
                >
                  <span
                    aria-hidden
                    className="step-checkbox-fill pointer-events-none absolute inset-0 rounded-[2px] bg-brand"
                    data-on={visualOn ? "true" : "false"}
                  />
                  <span
                    className="step-check-mark relative"
                    data-on={visualOn ? "true" : "false"}
                  >
                    <CheckIcon className="h-3 w-3 text-white" />
                  </span>
                </span>
                <span
                  className={`relative text-sm leading-snug ${
                    visualOn ? "text-ink-secondary" : "text-ink"
                  }`}
                >
                  {step}
                  <span
                    aria-hidden
                    className="step-strike pointer-events-none absolute left-0 top-[0.7em] h-px w-full bg-current"
                    data-on={visualOn ? "true" : "false"}
                  />
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
