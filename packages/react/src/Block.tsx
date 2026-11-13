import type { ReactElement, ReactNode } from 'react';

export interface BlockProps {
  as?: 'div' | 'section' | 'article';
  children?: ReactNode;
}

/** Block: a surface that groups related content, with the inner padding of the scale. */
export function Block({ as: Tag = 'div', children }: BlockProps): ReactElement {
  return <Tag className="feitio-block">{children}</Tag>;
}
