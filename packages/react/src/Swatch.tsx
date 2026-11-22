import type { ReactElement } from 'react';

/**
 * Swatch: a color role, painted. role is like "accent" or "ok"; it is a data attribute, never an
 * inline style, so it works under a strict CSP.
 */
export function Swatch({ role }: { role: string }): ReactElement {
  return <span className="feitio-swatch" data-role={role} />;
}
