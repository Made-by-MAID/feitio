import type { ReactElement, ReactNode } from 'react';

export interface StackProps {
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  align?: 'start' | 'center';
  as?: 'div' | 'section' | 'ul' | 'ol';
  children?: ReactNode;
}

/** Stack: pieces one below the other, one step of the scale apart. */
export function Stack({ gap = 4, align, as: Tag = 'div', children }: StackProps): ReactElement {
  return (
    <Tag className="feitio-stack" data-gap={gap} data-align={align}>
      {children}
    </Tag>
  );
}
