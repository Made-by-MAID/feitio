/** Joins class names, leaving out the empty ones. */
export function classNames(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(' ');
}

/** The years a Footer shows: the year it started, or "since–now" when that was before this year. */
export function yearsText(since: number, year: number): string {
  return since === year ? String(since) : `${since}–${year}`;
}
