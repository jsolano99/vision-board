import Image from "next/image";

export function NavBar() {
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

        <span className="cursor-not-allowed rounded-full bg-card-sunken px-4 py-2 text-sm font-medium text-ink-secondary opacity-60">
          Sign In
        </span>
      </div>
    </header>
  );
}
