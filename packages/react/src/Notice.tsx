import { type ReactElement, type ReactNode, type Ref, useImperativeHandle, useRef } from 'react';
import { useElementBehavior } from './actions/use-element-behavior.ts';
import { wireNotice } from './actions/wire.ts';
import { Icon } from './Icon.tsx';

const icons = { ok: 'check', warn: 'warn', error: 'close', info: 'info' } as const;
const ring =
  'M12 3.2C17.2 3 21 7 20.8 12.2C20.6 17.2 16.8 20.9 11.8 20.8C6.9 20.7 3.1 16.8 3.2 11.8C3.3 7 6.9 3.4 12.6 3.5';

export interface NoticeProps {
  status?: 'ok' | 'warn' | 'error';
  title: string;
  close?: boolean;
  /** Milliseconds until it closes by itself (never for a warning or an error). */
  timeout?: number;
  id?: string;
  hidden?: boolean;
  /** "status" after an action, "alert" for an error after an action. */
  role?: 'status' | 'alert';
  closeLabel?: string;
  sprite?: string;
  /** The element, for useNotices().show() and close(). */
  ref?: Ref<HTMLDivElement | null>;
  children?: ReactNode;
}

/** Notice: a message about the page or about what just happened; it may close, or close by itself. */
export function Notice({
  status,
  title,
  close = false,
  timeout,
  id,
  hidden,
  role,
  closeLabel = 'Fechar o aviso',
  sprite,
  ref,
  children,
}: NoticeProps): ReactElement {
  const own = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => own.current as HTMLDivElement, []);
  useElementBehavior(own, 'notice', wireNotice);
  const hasTools = close || Boolean(timeout);
  const text = children !== undefined && children !== null && children !== false;
  return (
    <div
      className="feitio-notice"
      data-status={status}
      id={id}
      role={role}
      data-timeout={timeout}
      hidden={hidden}
      ref={own}
    >
      <Icon name={icons[status ?? 'info']} sprite={sprite} />
      <strong>{title}</strong>
      {text && <p>{children}</p>}
      {hasTools && (
        <span className="tools">
          <button type="button" className="close" aria-label={closeLabel}>
            {Boolean(timeout) && (
              <svg className="ring" viewBox="0 0 24 24" aria-hidden="true">
                <path pathLength={100} d={ring} />
              </svg>
            )}
            <Icon name="close" sprite={sprite} />
          </button>
        </span>
      )}
    </div>
  );
}
