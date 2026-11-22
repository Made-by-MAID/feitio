import type { CSSProperties, ReactElement, ReactNode } from 'react';

export interface GridProps {
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /**
   * The narrowest a column may get: "narrow" (10rem), "regular" (15rem, the default) or "wide"
   * (20rem), rendered as data-min. Any other length, like "9rem", still works as an inline custom
   * property, but a page with a strict CSP (`style-src 'self'`) blocks it.
   */
  min?: 'narrow' | 'regular' | 'wide' | (string & {});
  as?: 'div' | 'ul';
  children?: ReactNode;
}

/** Grid: columns that fit the width; below their narrowest, they wrap. */
export function Grid({ gap = 4, min, as: Tag = 'div', children }: GridProps): ReactElement {
  const step = min === 'narrow' || min === 'wide' ? min : undefined;
  const length = min && min !== 'regular' && !step ? min : undefined;
  const style = length ? ({ '--feitio-grid-min': length } as CSSProperties) : undefined;
  return (
    <Tag className="feitio-grid" data-gap={gap} data-min={step} style={style}>
      {children}
    </Tag>
  );
}
