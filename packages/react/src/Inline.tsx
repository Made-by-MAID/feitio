import type { ReactElement, ReactNode } from 'react';

export interface InlineProps {
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  justify?: 'between' | 'end';
  as?: 'div' | 'ul';
  children?: ReactNode;
}

/** Inline: pieces side by side, wrapping when they do not fit, one step of the scale apart. */
export function Inline({ gap = 3, justify, as: Tag = 'div', children }: InlineProps): ReactElement {
  return (
    <Tag className="feitio-inline" data-gap={gap} data-justify={justify}>
      {children}
    </Tag>
  );
}
