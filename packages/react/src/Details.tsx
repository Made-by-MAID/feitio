import type { ReactElement, ReactNode } from 'react';
import { Icon } from './Icon.tsx';

export interface DetailsProps {
  summary: string;
  open?: boolean;
  sprite?: string;
  children?: ReactNode;
}

/** Details: more about something, closed until the reader asks for it. */
export function Details({ summary, open, sprite, children }: DetailsProps): ReactElement {
  return (
    <details className="feitio-details" open={open}>
      <summary>
        <Icon name="chevron-right" sprite={sprite} />
        {summary}
      </summary>
      <div className="content">{children}</div>
    </details>
  );
}
