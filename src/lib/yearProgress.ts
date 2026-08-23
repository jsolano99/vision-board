export type YearProgress = {
  daysLeft: number;
  weeksLeft: number;
  monthsLeft: number;
  fraction: number;
  currentWeekIndex: number;
  totalWeeks: number;
};

export function computeYearProgress(year: number, now = new Date()): YearProgress {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59, 999);
  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = Math.min(totalMs, Math.max(0, now.getTime() - start.getTime()));
  const remainingMs = Math.max(0, end.getTime() - now.getTime());

  const daysLeft = Math.ceil(remainingMs / 86400000);
  const weeksLeft = Math.ceil(daysLeft / 7);
  const monthsLeft = now.getFullYear() < year ? 12 : Math.max(0, 11 - now.getMonth());

  const daysInYear = Math.round(totalMs / 86400000) + 1;
  const totalWeeks = Math.ceil(daysInYear / 7);
  const rawDayOfYear = Math.floor(elapsedMs / 86400000);
  const currentWeekIndex = Math.min(Math.floor(rawDayOfYear / 7), totalWeeks - 1);

  return {
    daysLeft,
    weeksLeft,
    monthsLeft,
    fraction: totalMs > 0 ? elapsedMs / totalMs : 0,
    currentWeekIndex,
    totalWeeks,
  };
}

/** Server-computed "now" for model prompts — do not let the model guess the date. */
export type CalendarContext = {
  todayIso: string;
  todayLabel: string;
  year: number;
  daysLeft: number;
  weeksLeft: number;
  monthsLeft: number;
};

export function getCalendarContext(now = new Date()): CalendarContext {
  const year = now.getFullYear();
  const { daysLeft, weeksLeft, monthsLeft } = computeYearProgress(year, now);
  const todayIso = [
    year,
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const todayLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return { todayIso, todayLabel, year, daysLeft, weeksLeft, monthsLeft };
}

export function formatCalendarContext(cal: CalendarContext): string {
  return `Today is ${cal.todayLabel} (${cal.todayIso}). ${cal.daysLeft} day(s) remain in ${cal.year} — ${cal.weeksLeft} week(s), ${cal.monthsLeft} month(s) left.`;
}
