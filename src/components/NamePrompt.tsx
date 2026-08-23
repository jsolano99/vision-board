"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { XIcon } from "@/components/icons";
import { MAX_NAME_LENGTH, sanitizeName } from "@/lib/displayName";

export function NamePrompt({
  currentName,
  onSave,
  onClear,
  onClose,
}: {
  currentName: string | null;
  onSave: (name: string) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(currentName ?? "");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const editing = Boolean(currentName);

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(id);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleaned = sanitizeName(value);
    if (!cleaned) {
      setError("Enter a first name.");
      return;
    }
    onSave(cleaned);
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      aria-modal="false"
      className="name-prompt absolute right-0 top-full z-20 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-3xl bg-card p-5 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.35)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 id={titleId} className="text-lg font-bold tracking-tight text-ink">
          {editing ? "Your name" : "Add your name"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-ink-secondary transition-[transform,color] duration-150 ease-out active:scale-[0.97] [@media(hover:hover)]:hover:bg-card-sunken [@media(hover:hover)]:hover:text-ink"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1 text-sm text-ink-secondary">
        It replaces “Your” on the board. Saved on this device — no password, no
        account.
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor="board-display-name" className="block text-sm font-medium text-ink">
          First name
        </label>
        <input
          ref={inputRef}
          id="board-display-name"
          type="text"
          autoComplete="given-name"
          maxLength={MAX_NAME_LENGTH}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Jacob"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "board-display-name-error" : undefined}
          className="mt-1.5 w-full rounded-xl border border-card-line bg-card-sunken px-3 py-2 text-sm text-ink placeholder:text-ink-secondary focus:border-brand focus:outline-none"
        />
        {error && (
          <p id="board-display-name-error" className="mt-2 text-xs text-cat-finance-text">
            {error}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="submit"
            className="flex-1 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-[transform,background-color] duration-150 ease-out active:scale-[0.97] [@media(hover:hover)]:hover:bg-brand-deep"
          >
            {editing ? "Save name" : "Use this name"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                onClear();
                onClose();
              }}
              className="rounded-full px-3 py-2.5 text-sm font-semibold text-ink-secondary underline underline-offset-2 transition-colors duration-150 ease-out [@media(hover:hover)]:hover:text-ink"
            >
              Remove
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
