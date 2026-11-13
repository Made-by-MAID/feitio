import type { ReactElement, ReactNode } from 'react';
import { Icon } from './Icon.tsx';

export interface HeaderProps {
  brand: string;
  brandHref: string;
  areas: { text: string; href: string; current?: boolean }[];
  label?: string;
  /** The Menu button's words and the id of the Drawer it opens; without it, no Menu. */
  menu?: { label: string; target: string };
  sprite?: string;
  logo?: ReactNode;
  /** Tools on the right, like search or the language. */
  children?: ReactNode;
}

/** Header: the brand, the areas of the site and its tools; on a narrow screen, a Menu for a Drawer. */
export function Header({
  brand,
  brandHref,
  areas,
  label,
  menu,
  sprite,
  logo,
  children,
}: HeaderProps): ReactElement {
  return (
    <div className="feitio-header-wrap">
      <header className="feitio-header">
        <a className="brand" href={brandHref}>
          {logo}
          {brand}
        </a>
        <nav className="areas" aria-label={label}>
          {areas.map((a) => (
            <a key={a.href} href={a.href} aria-current={a.current ? 'true' : undefined}>
              {a.text}
            </a>
          ))}
        </nav>
        <div className="tools">
          {children}
          {menu && (
            <button
              type="button"
              className="feitio-button menu"
              data-size="small"
              popoverTarget={menu.target}
              aria-controls={menu.target}
            >
              {menu.label}
              <Icon name="menu" sprite={sprite} />
            </button>
          )}
        </div>
      </header>
    </div>
  );
}
