import type { ReactElement } from 'react';
import { Icon } from './Icon.tsx';

export interface AnchorItem {
  id: string;
  text: string;
  current?: boolean;
  children?: { id: string; text: string; current?: boolean }[];
}

export interface AnchorProps {
  title?: string;
  items: AnchorItem[];
  label?: string;
  sprite?: string;
}

/** Anchor: the page index, following the scroll; the current part in ink, with the hand-drawn arrow. */
export function Anchor({ title, items, label, sprite }: AnchorProps): ReactElement {
  return (
    <nav className="feitio-anchor" aria-label={label ?? title}>
      {title && <p className="title">{title}</p>}
      <ul>
        {items.map((t) => (
          <li key={t.id}>
            <a href={`#${t.id}`} aria-current={t.current ? 'location' : undefined}>
              <Icon name="chevron-right" sprite={sprite} />
              {t.text}
            </a>
            {t.children && (
              <ul>
                {t.children.map((c) => (
                  <li key={c.id}>
                    <a href={`#${c.id}`} aria-current={c.current ? 'location' : undefined}>
                      <Icon name="chevron-right" sprite={sprite} />
                      {c.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
