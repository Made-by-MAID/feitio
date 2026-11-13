import type { CSSProperties, ReactElement } from 'react';

/** Swatch: a color role, painted. role is like "accent" or "ok". */
export function Swatch({ role }: { role: string }): ReactElement {
  return (
    <span
      className="feitio-swatch"
      style={{ '--swatch': `var(--feitio-color-${role})` } as CSSProperties}
    />
  );
}
