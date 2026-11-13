import type { ReactElement, ReactNode } from 'react';
import { Icon } from './Icon.tsx';

export interface LinkProps {
  href: string;
  newTab?: boolean;
  /** What screen readers hear after the text when it opens in a new tab. */
  newTabLabel?: string;
  sprite?: string;
  children?: ReactNode;
}

/** Link: goes somewhere; opening in a new tab, it says so, to the eye and to the ear. */
export function Link({
  href,
  newTab = false,
  newTabLabel = '(abre em nova aba)',
  sprite,
  children,
}: LinkProps): ReactElement {
  return (
    <a
      className="feitio-link"
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener' : undefined}
    >
      {children}
      {newTab && <Icon name="new-tab" sprite={sprite} />}
      {newTab && <span className="feitio-visually-hidden"> {newTabLabel}</span>}
    </a>
  );
}
