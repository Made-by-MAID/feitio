import type { ReactElement, ReactNode } from 'react';

export interface HintProps {
  id?: string;
  children?: ReactNode;
}

/** Hint: a short help under a label; the control points to it with aria-describedby. */
export function Hint({ id, children }: HintProps): ReactElement {
  return (
    <span className="feitio-hint" id={id}>
      {children}
    </span>
  );
}
