/** How a level of a Heatmap looks: a state, or a step of an intensity scale. */
export type HeatmapTone = 'ok' | 'warn' | 'error' | 'empty' | 'low' | 'mid' | 'high';

/** A level of the legend: its id (what the cells name), its words, and its tone. */
export interface HeatmapLevel {
  id: string;
  label: string;
  tone: HeatmapTone;
}

/** One square: its level (an id from the levels) and its title, the moment it stands for. */
export interface HeatmapCell {
  level: string;
  title: string;
}

/** A label over the columns: a label covers its column and the unlabelled ones after it. */
export interface LabelSpan {
  label: string;
  span: number;
}

/**
 * The column labels as spans: each label runs until the next one, so a month's name has room over
 * its weeks. The unlabelled columns before the first label make one empty span.
 */
export function labelSpans(labels: readonly (string | null | undefined)[]): LabelSpan[] {
  const spans: LabelSpan[] = [];
  for (const label of labels) {
    const last = spans[spans.length - 1];
    if (label || !last) spans.push({ label: label || '', span: 1 });
    else last.span += 1;
  }
  return spans;
}

/** What a square shows and says: its level's tone, and its title with its level's words. */
export function squareOf(
  cell: HeatmapCell | null | undefined,
  levels: readonly HeatmapLevel[],
): { tone: HeatmapTone; text: string } {
  if (!cell) return { tone: 'empty', text: '' };
  const level = levels.find((l) => l.id === cell.level);
  return {
    tone: level?.tone ?? 'empty',
    text: level ? `${cell.title}, ${level.label}` : cell.title,
  };
}
