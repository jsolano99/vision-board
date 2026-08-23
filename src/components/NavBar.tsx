"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { NamePrompt } from "@/components/NamePrompt";

export function NavBar({
  name,
  onSaveName,
  onClearName,
}: {
  name: string | null;
  onSaveName: (name: string) => void;
  onClearName: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="flex justify-center px-4 pt-6 sm:px-8">
      <div className="flex w-full max-w-6xl items-center justify-between rounded-full bg-card px-3 py-2 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="flex items-center gap-2.5 pl-1.5">
          <Image
            src="/vision-board-logo.png"
            alt="Vision Board"
            width={184}
            height={128}
            className="h-8 w-auto"
            priority
          />
          <span
            className="hidden text-lg font-bold tracking-tight text-ink sm:inline"
            aria-hidden="true"
          >
            Vision Board
          </span>
        </div>

        <nav className="hidden items-center gap-1 text-sm font-medium text-ink-secondary sm:flex">
          <span className="rounded-full bg-brand-tint px-4 py-2 font-semibold text-brand-deep">
            Board
          </span>
          <span className="cursor-not-allowed px-4 py-2 opacity-50">Archive</span>
        </nav>

        <div className="relative">
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="dialog"
            onClick={() => setOpen((v) => !v)}
            className="max-w-[9rem] truncate rounded-full bg-card-sunken px-4 py-2 text-sm font-medium text-ink transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand [@media(hover:hover)]:hover:bg-brand-tint [@media(hover:hover)]:hover:text-brand-deep"
          >
            {name ?? "Sign In"}
          </button>
          {open && (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setOpen(false)}
              />
              <NamePrompt
                currentName={name}
                onSave={onSaveName}
                onClear={onClearName}
                onClose={() => setOpen(false)}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
