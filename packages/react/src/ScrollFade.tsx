import { type ReactElement, useRef } from 'react';
import { useElementBehavior } from './actions/use-element-behavior.ts';
import { wireScroll } from './actions/wire.ts';

/** ScrollFade: a soft edge at the bottom of a box that scrolls, while there is more below. */
export function ScrollFade(): ReactElement {
  const ref = useRef<HTMLSpanElement>(null);
  useElementBehavior(ref, 'scroll', wireScroll);
  return <span className="feitio-scroll-fade" aria-hidden="true" ref={ref} />;
}
