import type { ReactElement, ReactNode } from 'react';

export interface MasonryProps {
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** The narrowest a column may get: narrow (10rem), regular (15rem, the default) or wide (20rem). */
  min?: 'narrow' | 'regular' | 'wide';
  as?: 'div' | 'ul';
  children?: ReactNode;
}

/**
 * Masonry: blocks in columns that fit the width, each right under the one before, none split or
 * stretched. The reading order goes down a column, then the next: put what matters first.
 */
export function Masonry({ gap = 4, min, as: Tag = 'div', children }: MasonryProps): ReactElement {
  return (
    <Tag
      className="feitio-masonry"
      data-gap={gap}
      data-min={min && min !== 'regular' ? min : undefined}
    >
      {children}
    </Tag>
  );
}
