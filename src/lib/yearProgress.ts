export type YearProgress = {
  daysLeft: number;
  weeksLeft: number;
  monthsLeft: number;
  fraction: number;
  currentWeekIndex: number;
  totalWeeks: number;
};

export function computeYearProgress(year: number): YearProgress {
  const now = new Date();
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
