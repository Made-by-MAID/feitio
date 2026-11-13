import type { ReactElement, ReactNode } from 'react';

export interface FieldsetProps {
  legend: string;
  hint?: string;
  children?: ReactNode;
}

/** Fieldset: controls that answer one question together, under its legend. */
export function Fieldset({ legend, hint, children }: FieldsetProps): ReactElement {
  return (
    <fieldset className="feitio-fieldset">
      <legend className="feitio-label">{legend}</legend>
      {hint && <span className="feitio-hint">{hint}</span>}
      {children}
    </fieldset>
  );
}
