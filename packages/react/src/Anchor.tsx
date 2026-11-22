import { type ReactElement, useRef } from 'react';
import { useElementBehavior } from './actions/use-element-behavior.ts';
import { wireAnchor } from './actions/wire.ts';
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
  /** Stays in view while the page scrolls, in a side column (data-sticky). */
  sticky?: boolean;
  sprite?: string;
}

/**
 * Anchor: the page index, following the scroll; the current part in ink, with the hand-drawn arrow.
 * When it mounts, a click scrolls smoothly to the section and the scroll marks the section in view.
 */
export function Anchor({ title, items, label, sticky, sprite }: AnchorProps): ReactElement {
  const ref = useRef<HTMLElement>(null);
  useElementBehavior(ref, 'anchor', wireAnchor);
  return (
    <nav
      className="feitio-anchor"
      aria-label={label ?? title}
      data-sticky={sticky ? '' : undefined}
      ref={ref}
    >
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
