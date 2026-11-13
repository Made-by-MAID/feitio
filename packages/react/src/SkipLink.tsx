import type { ReactElement, ReactNode } from 'react';

/** SkipLink: the first thing the keyboard reaches; jumps straight to the content. */
export function SkipLink({
  href = '#content',
  children,
}: {
  href?: string;
  children?: ReactNode;
}): ReactElement {
  return (
    <a className="feitio-skip-link" href={href}>
      {children}
    </a>
  );
}
