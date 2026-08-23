import Image from "next/image";
import { YearCountdown } from "@/components/YearCountdown";

export function DesktopOnlyGate({ year }: { year: number }) {
  return (
    <main className="desktop-gate-in flex min-h-dvh flex-col items-center justify-center overflow-y-auto px-[max(1.5rem,env(safe-area-inset-left))] pt-[max(2.5rem,env(safe-area-inset-top))] pr-[max(1.5rem,env(safe-area-inset-right))] pb-[max(2.5rem,env(safe-area-inset-bottom))] md:hidden">
      <section
        aria-labelledby="desktop-gate-heading"
        className="flex w-full max-w-sm flex-col items-center text-center"
      >
        <Image
          src="/vision-board-logo.png"
          alt="Vision Board"
          width={184}
          height={128}
          className="h-10 w-auto"
          priority
        />

        <div className="mt-8">
          <YearCountdown year={year} compact />
        </div>

        <h1
          id="desktop-gate-heading"
          className="mt-8 text-4xl font-extrabold tracking-tight text-ink"
        >
          This board is built for a desk.
        </h1>
        <p className="mt-3 max-w-[22rem] text-sm leading-relaxed text-ink-secondary">
          Open it on a computer — the canvas needs room to pin, drag, and plan
          the year.
        </p>
      </section>
    </main>
  );
}
