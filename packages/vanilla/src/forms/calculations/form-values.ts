/** The other half of the day: AM becomes PM and back. */
export function togglePeriod(period: string): 'AM' | 'PM' {
  return period.trim().toUpperCase() === 'AM' ? 'PM' : 'AM';
}

/** Takes accents and case away, so "acao" finds "Ação". */
export function plainText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/** Whether a list item's search words hold every word typed, in any order. */
export function matchesFilter(itemWords: string, typed: string): boolean {
  const words = plainText(typed).split(/\s+/).filter(Boolean);
  const target = plainText(itemWords);
  return words.every((word) => target.includes(word));
}
