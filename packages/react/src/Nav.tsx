import type { ReactElement } from 'react';
import { Icon } from './Icon.tsx';

export interface NavGroup {
  title?: string;
  items: { text: string; href: string; current?: boolean; icon?: string }[];
}

export interface NavProps {
  groups: NavGroup[];
  label?: string;
  sprite?: string;
}

/** Nav: the side navigation of a product, in groups, the current page marked. */
export function Nav({ groups, label, sprite }: NavProps): ReactElement {
  return (
    <nav className="feitio-nav" aria-label={label}>
      {groups.map((g, n) => (
        <div className="group" key={g.title ?? n}>
          {g.title && <p className="group-title">{g.title}</p>}
          <ul>
            {g.items.map((i) => (
              <li key={i.href}>
                <a href={i.href} aria-current={i.current ? 'page' : undefined}>
                  {i.icon && <Icon name={i.icon} sprite={sprite} />}
                  {i.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
