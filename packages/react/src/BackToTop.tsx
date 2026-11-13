import { type ReactElement, useRef } from 'react';
import { useElementBehavior } from './actions/use-element-behavior.ts';
import { wireScroll } from './actions/wire.ts';
import { Icon } from './Icon.tsx';

export interface BackToTopProps {
  href?: string;
  label?: string;
  sprite?: string;
}

/** BackToTop: shows after half a screen of scrolling and takes the reader (and the focus) back up. */
export function BackToTop({
  href = '#content',
  label = 'Topo',
  sprite,
}: BackToTopProps): ReactElement {
  const ref = useRef<HTMLAnchorElement>(null);
  useElementBehavior(ref, 'scroll', wireScroll);
  return (
    <a ref={ref} className="feitio-button feitio-back-to-top" data-size="small" href={href}>
      <Icon name="chevron-down" sprite={sprite} />
      {label}
    </a>
  );
}
