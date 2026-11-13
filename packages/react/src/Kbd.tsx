import type { ReactElement, ReactNode } from 'react';

/** Kbd: a key to press. */
export function Kbd({ children }: { children?: ReactNode }): ReactElement {
  return <kbd className="feitio-kbd">{children}</kbd>;
}
