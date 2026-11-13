import type { CSSProperties, ReactElement, ReactNode } from 'react';

export interface GridProps {
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** The narrowest a column may get, like "9rem". */
  min?: string;
  as?: 'div' | 'ul';
  children?: ReactNode;
}

/** Grid: columns that fit the width; below their narrowest, they wrap. */
export function Grid({ gap = 4, min, as: Tag = 'div', children }: GridProps): ReactElement {
  const style = min ? ({ '--feitio-grid-min': min } as CSSProperties) : undefined;
  return (
    <Tag className="feitio-grid" data-gap={gap} style={style}>
      {children}
    </Tag>
  );
}
