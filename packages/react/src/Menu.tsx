import { type ReactElement, useRef } from 'react';
import { useElementBehavior } from './actions/use-element-behavior.ts';
import { wireMenu } from './actions/wire.ts';
import { Icon } from './Icon.tsx';

export interface MenuItem {
  text: string;
  href?: string;
  current?: boolean;
  lang?: string;
  hreflang?: string;
  /** For an item without href: what it does. */
  onSelect?: () => void;
}

export interface MenuProps {
  /** What the button says: the current choice, or what the menu is for. */
  label: string;
  /**
   * Words screen readers hear after the label, when it is short ("PT" + ", idioma: Português"). They
   * come after the visible text, never instead of it, so a voice command can still say "PT".
   */
  hint?: string;
  items: MenuItem[];
  id: string;
  size?: 'small';
  sprite?: string;
}

/** Menu: a button that opens a short list of links or actions, moved through with the arrows. */
export function Menu({ label, hint, items, id, size, sprite }: MenuProps): ReactElement {
  const ref = useRef<HTMLSpanElement>(null);
  useElementBehavior(ref, 'menu', wireMenu);
  return (
    <span className="feitio-menu" ref={ref}>
      <button
        type="button"
        className="feitio-button"
        data-size={size}
        popoverTarget={`${id}-list`}
        aria-haspopup="true"
        aria-expanded="false"
      >
        {label}
        {hint && <span className="feitio-visually-hidden">{hint}</span>}
        <Icon name="chevron-down" sprite={sprite} />
      </button>
      <ul className="feitio-menu-list" id={`${id}-list`} popover="">
        {items.map((item) =>
          item.href ? (
            <li key={item.text}>
              <a
                href={item.href}
                lang={item.lang}
                hrefLang={item.hreflang}
                aria-current={item.current ? 'true' : undefined}
              >
                {item.current && <Icon name="check" sprite={sprite} />}
                <span>{item.text}</span>
              </a>
            </li>
          ) : (
            <li key={item.text}>
              <button type="button" onClick={item.onSelect}>
                {item.text}
              </button>
            </li>
          ),
        )}
      </ul>
    </span>
  );
}
