import { type ReactElement, type ReactNode, useRef } from 'react';
import { useElementBehavior } from './actions/use-element-behavior.ts';
import { wireScroll } from './actions/wire.ts';
import { Icon } from './Icon.tsx';
import { Nav, type NavGroup } from './Nav.tsx';

export interface AppShellProps {
  id: string;
  brand: string;
  nav: NavGroup[];
  user?: string;
  signOut?: { text: string; href: string };
  menuLabel?: string;
  closeLabel?: string;
  topLabel?: string;
  sprite?: string;
  /** The main area's content. */
  children?: ReactNode;
}

/**
 * AppShell: a product's layout of regions: the header (it leaves when scrolling down on mobile and
 * comes back up), the navigation in a Drawer from the right, the main area with its ScrollFade and
 * BackToTop.
 */
export function AppShell({
  id,
  brand,
  nav,
  user,
  signOut,
  menuLabel = 'Menu',
  closeLabel = 'Fechar',
  topLabel = 'Topo',
  sprite,
  children,
}: AppShellProps): ReactElement {
  const fade = useRef<HTMLSpanElement>(null);
  useElementBehavior(fade, 'scroll', wireScroll);
  return (
    <div className="feitio-app">
      <header className="feitio-app-header" data-hide-on-scroll="">
        <a className="brand" href={`#${id}-content`}>
          {brand}
        </a>
        <button
          type="button"
          className="feitio-button menu"
          data-size="small"
          popoverTarget={id}
          aria-controls={id}
        >
          {menuLabel}
          <Icon name="menu" sprite={sprite} />
        </button>
      </header>
      <nav className="feitio-drawer feitio-app-nav" id={id} popover="" aria-label={menuLabel}>
        <div className="drawer-header">
          <h2>{menuLabel}</h2>
          <button
            type="button"
            className="feitio-button close"
            data-size="small"
            popoverTarget={id}
            popoverTargetAction="hide"
          >
            <Icon name="close" sprite={sprite} />
            {closeLabel}
          </button>
        </div>
        <div className="drawer-body">
          <Nav groups={nav} sprite={sprite} />
        </div>
        {(user || signOut) && (
          <div className="drawer-footer nav-footer">
            {user && <span className="who">{user}</span>}
            {signOut && (
              <a className="feitio-link" href={signOut.href}>
                {signOut.text}
              </a>
            )}
          </div>
        )}
      </nav>
      <div className="feitio-app-main" id={`${id}-content`} tabIndex={-1}>
        {children}
        <span className="feitio-scroll-fade" aria-hidden="true" ref={fade} />
        <a className="feitio-button feitio-back-to-top" data-size="small" href={`#${id}-content`}>
          <Icon name="chevron-down" sprite={sprite} />
          {topLabel}
        </a>
      </div>
    </div>
  );
}
