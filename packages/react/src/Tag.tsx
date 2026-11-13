import type { ReactElement, ReactNode } from 'react';
import { Icon } from './Icon.tsx';

const icons = { ok: 'check', warn: 'warn', error: 'close', info: 'info' } as const;

export interface TagProps {
  status?: 'ok' | 'warn' | 'error';
  size?: 'small';
  sprite?: string;
  children?: ReactNode;
}

/** Tag: a short word about a state, with its icon, never color alone. */
export function Tag({ status, size, sprite, children }: TagProps): ReactElement {
  return (
    <span className="feitio-tag" data-status={status} data-size={size}>
      {size !== 'small' && <Icon name={icons[status ?? 'info']} sprite={sprite} />}
      {children}
    </span>
  );
}
