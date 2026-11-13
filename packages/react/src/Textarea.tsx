import type { ReactElement, TextareaHTMLAttributes } from 'react';
import { classNames } from './calculations/text.ts';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  invalid?: boolean;
  describedBy?: string;
}

/** Textarea: longer text, over several lines. */
export function Textarea({
  invalid,
  describedBy,
  className,
  ...rest
}: TextareaProps): ReactElement {
  return (
    <textarea
      {...rest}
      className={classNames('feitio-textarea', className)}
      aria-invalid={invalid ? 'true' : undefined}
      aria-describedby={describedBy}
    />
  );
}
