import type { ReactElement, ReactNode } from 'react';
import { Icon } from './Icon.tsx';

export interface FieldProps {
  label: string;
  /** The id of the control inside; the hint and the error take ids from it. */
  for: string;
  hint?: string;
  error?: string;
  sprite?: string;
  children?: ReactNode;
}

/**
 * Field: a label, an optional hint, the control and its error, in that order. The hint is
 * "{for}-hint" and the error "{for}-error", for the control's aria-describedby.
 */
export function Field({
  label,
  for: target,
  hint,
  error,
  sprite,
  children,
}: FieldProps): ReactElement {
  return (
    <div className="feitio-field">
      <label className="feitio-label" htmlFor={target}>
        {label}
      </label>
      {hint && (
        <span className="feitio-hint" id={`${target}-hint`}>
          {hint}
        </span>
      )}
      {children}
      {error && (
        <span className="feitio-error-message" id={`${target}-error`}>
          <Icon name="close" sprite={sprite} />
          {error}
        </span>
      )}
    </div>
  );
}
