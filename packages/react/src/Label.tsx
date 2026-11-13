import type { ReactElement, ReactNode } from 'react';

export interface LabelProps {
  /** The control's id. */
  htmlFor: string;
  children?: ReactNode;
}

/** Label: a control's name, tied to it by htmlFor (the control's id). */
export function Label({ htmlFor, children }: LabelProps): ReactElement {
  return (
    <label className="feitio-label" htmlFor={htmlFor}>
      {children}
    </label>
  );
}
