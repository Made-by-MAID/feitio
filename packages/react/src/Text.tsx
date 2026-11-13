import type { ReactElement, ReactNode } from 'react';

/** Text: a paragraph, at the measure that reads well. */
export function Text({ children }: { children?: ReactNode }): ReactElement {
  return <p className="feitio-text">{children}</p>;
}
