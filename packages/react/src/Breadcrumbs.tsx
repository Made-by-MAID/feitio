import type { ReactElement } from 'react';
import { Icon } from './Icon.tsx';

export interface BreadcrumbsProps {
  items: { text: string; href: string }[];
  current: string;
  label?: string;
  sprite?: string;
}

/** Breadcrumbs: where the page sits, from the top down to here. */
export function Breadcrumbs({
  items,
  current,
  label = 'Você está em',
  sprite,
}: BreadcrumbsProps): ReactElement {
  return (
    <nav className="feitio-breadcrumbs" aria-label={label}>
      <ol>
        {items.map((i, n) => (
          <li key={i.href}>
            {n > 0 && (
              <span className="sep" aria-hidden="true">
                <Icon name="chevron-right" sprite={sprite} />
              </span>
            )}
            <a href={i.href}>{i.text}</a>
          </li>
        ))}
        <li>
          <span className="sep" aria-hidden="true">
            <Icon name="chevron-right" sprite={sprite} />
          </span>
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
