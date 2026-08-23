export const BOARD_NAME_KEY = "vision-board-display-name";
export const MAX_NAME_LENGTH = 32;

export function sanitizeName(raw: string): string | null {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  return cleaned.slice(0, MAX_NAME_LENGTH).trim();
}

export function possessive(name: string): string {
  return /s$/i.test(name) ? `${name}'` : `${name}'s`;
}

export function boardHeading(name: string | null, year: number): string {
  if (!name) return `Your ${year} Vision Board`;
  return `${possessive(name)} ${year} Vision Board`;
}
