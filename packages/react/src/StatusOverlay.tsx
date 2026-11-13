import type { ReactElement, ReactNode, Ref } from 'react';

export interface StatusOverlayProps {
  /** What it shows over the content: loading, done or failed; nothing without it. */
  state?: 'loading' | 'ok' | 'error';
  /** The words for the state, which screen readers hear. */
  label?: string;
  as?: 'div' | 'form' | 'section';
  ref?: Ref<HTMLElement | null>;
  children?: ReactNode;
}

/** StatusOverlay: feedback drawn over a part of the page while it loads, and when it is done or failed. */
export function StatusOverlay({
  state,
  label = '',
  as: Tag = 'div',
  ref,
  children,
}: StatusOverlayProps): ReactElement {
  return (
    <Tag className="feitio-status-host" data-state={state} ref={ref as Ref<never>}>
      {children}
      <div className="feitio-status" role="status">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <g className="loading">
            <path pathLength={1} d="M24 7 C34 6.5 41.5 14 41 24 C40.6 33 33 41 24 41.2" />
            <path
              pathLength={1}
              d="M25.5 41 C14.5 41.6 6.8 33.5 7.2 23.6 C7.6 14 14.6 7.4 23 6.4"
            />
          </g>
          <g className="ok">
            <path pathLength={1} d="M13 25 L21 33.5" />
            <path pathLength={1} d="M19.5 34 L36 14.5" />
          </g>
          <g className="error">
            <path pathLength={1} d="M15 15 L33.5 33" />
            <path pathLength={1} d="M33 14.5 L15.5 33.5" />
          </g>
        </svg>
        <span className="label">{label}</span>
      </div>
    </Tag>
  );
}
