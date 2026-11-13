import type { ReactElement, ReactNode } from 'react';

/** VisuallyHidden: words only screen readers hear. */
export function VisuallyHidden({ children }: { children?: ReactNode }): ReactElement {
  return <span className="feitio-visually-hidden">{children}</span>;
}
