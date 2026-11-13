import type { InputHTMLAttributes, ReactElement } from 'react';
import { classNames } from './calculations/text.ts';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'width'> {
  id: string;
  invalid?: boolean;
  describedBy?: string;
  /** The width it is meant for, in characters: 2, 4, 10, 20 or 40. Without it, the whole line. */
  width?: 2 | 4 | 10 | 20 | 40;
}

/** TextInput: one line of text, as wide as what it is meant to hold. */
export function TextInput({
  invalid,
  describedBy,
  width,
  className,
  ...rest
}: TextInputProps): ReactElement {
  return (
    <input
      {...rest}
      className={classNames('feitio-input', className)}
      aria-invalid={invalid ? 'true' : undefined}
      aria-describedby={describedBy}
      data-width={width}
    />
  );
}
