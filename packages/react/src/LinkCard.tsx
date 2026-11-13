import type { ReactElement, ReactNode } from 'react';
import { Icon } from './Icon.tsx';

export interface LinkCardProps {
  href: string;
  title: string;
  sprite?: string;
  children?: ReactNode;
}

/** LinkCard: a whole card that is one link, its title and a line about where it goes. */
export function LinkCard({ href, title, sprite, children }: LinkCardProps): ReactElement {
  return (
    <a className="feitio-link-card" href={href}>
      <strong>
        {title}
        <Icon name="chevron-right" sprite={sprite} />
      </strong>
      <span>{children}</span>
    </a>
  );
}
