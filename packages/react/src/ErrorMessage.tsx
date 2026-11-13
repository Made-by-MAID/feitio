import type { ReactElement, ReactNode } from 'react';
import { Icon } from './Icon.tsx';

export interface ErrorMessageProps {
  id?: string;
  sprite?: string;
  children?: ReactNode;
}

/** ErrorMessage: what is wrong with a field and how to fix it, right above it. */
export function ErrorMessage({ id, sprite, children }: ErrorMessageProps): ReactElement {
  return (
    <span className="feitio-error-message" id={id}>
      <Icon name="close" sprite={sprite} />
      {children}
    </span>
  );
}
