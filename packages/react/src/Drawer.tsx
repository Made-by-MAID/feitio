import type { ReactElement, ReactNode } from 'react';
import { Icon } from './Icon.tsx';

export interface DrawerProps {
  id: string;
  title?: string;
  side?: 'end' | 'start' | 'top' | 'bottom';
  label?: string;
  closeLabel?: string;
  sprite?: string;
  footer?: ReactNode;
  children?: ReactNode;
}

/** Drawer: a panel that slides in from a side, over the page; a button with popoverTarget opens it. */
export function Drawer({
  id,
  title,
  side = 'end',
  label,
  closeLabel = 'Fechar',
  sprite,
  footer,
  children,
}: DrawerProps): ReactElement {
  return (
    <div
      className="feitio-drawer"
      id={id}
      popover=""
      data-side={side === 'end' ? undefined : side}
      role="dialog"
      aria-label={label ?? title}
    >
      <div className="drawer-header">
        {title && <h2>{title}</h2>}
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
      <div className="drawer-body">{children}</div>
      {footer !== undefined && footer !== null && <div className="drawer-footer">{footer}</div>}
    </div>
  );
}
