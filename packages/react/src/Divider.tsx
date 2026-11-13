import type { ReactElement } from 'react';

export interface DividerProps {
  tone?: 'ink';
  orientation?: 'horizontal' | 'vertical';
}

/** Divider: a hand-drawn line between two parts. */
export function Divider({ tone, orientation = 'horizontal' }: DividerProps): ReactElement {
  return (
    <hr
      className="feitio-divider"
      data-tone={tone}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
    />
  );
}
