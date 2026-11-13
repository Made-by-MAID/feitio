import type { ReactElement, ReactNode } from 'react';

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  id?: string;
  children?: ReactNode;
}

/** Heading: a title at one of the four levels of the scale. */
export function Heading({ level = 2, id, children }: HeadingProps): ReactElement {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  return <Tag id={id}>{children}</Tag>;
}
