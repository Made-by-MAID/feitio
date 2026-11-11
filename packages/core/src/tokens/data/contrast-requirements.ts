/**
 * The pairs of color roles that must stay readable in every theme, by day and at night, with the
 * WCAG 2.2 AA minimum for each: 4.5 for text, 3 for shapes that carry meaning.
 */
export type ContrastRequirement = {
  readonly foreground: string;
  readonly background: string;
  readonly minimum: number;
  readonly why: string;
};

export const CONTRAST_REQUIREMENTS: readonly ContrastRequirement[] = [
  { foreground: 'text', background: 'surface', minimum: 4.5, why: 'main text on the page' },
  { foreground: 'text', background: 'surface-raised', minimum: 4.5, why: 'main text in a block' },
  { foreground: 'text', background: 'surface-top', minimum: 4.5, why: 'text on lifted paper' },
  {
    foreground: 'text-soft',
    background: 'surface',
    minimum: 4.5,
    why: 'supporting text on the page',
  },
  {
    foreground: 'text-soft',
    background: 'surface-raised',
    minimum: 4.5,
    why: 'supporting text in a block',
  },
  {
    foreground: 'accent-strong',
    background: 'surface',
    minimum: 4.5,
    why: 'links and notes on the page',
  },
  {
    foreground: 'accent-strong',
    background: 'surface-raised',
    minimum: 4.5,
    why: 'links and notes in a block',
  },
  {
    foreground: 'on-accent',
    background: 'accent',
    minimum: 4.5,
    why: 'the label of the main button',
  },
  {
    foreground: 'accent',
    background: 'surface',
    minimum: 3,
    why: 'the main button and the focus ring',
  },
  { foreground: 'ok', background: 'ok-surface', minimum: 4.5, why: 'a success notice' },
  { foreground: 'warn', background: 'warn-surface', minimum: 4.5, why: 'a warning notice' },
  { foreground: 'error', background: 'error-surface', minimum: 4.5, why: 'an error notice' },
  {
    foreground: 'error',
    background: 'surface',
    minimum: 4.5,
    why: 'a field error under its field',
  },
];
