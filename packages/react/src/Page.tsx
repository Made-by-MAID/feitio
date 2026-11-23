import type { ReactElement, ReactNode } from 'react';
import { Breadcrumbs } from './Breadcrumbs.tsx';

export interface PageProps {
  layout?: 'dashboard' | 'sections' | 'detail' | 'board';
  /** detail only: full for long lines (a table of settings). */
  width?: 'reading' | 'full';
  title: string;
  lede?: string;
  /** The places above this page, the page itself being the current one. */
  trail?: { text: string; href: string }[];
  /** The name of the way back, for a screen reader (Breadcrumbs' own by default). */
  trailLabel?: string;
  /** The name of the detail's summary, for a screen reader. */
  asideLabel?: string;
  sprite?: string;
  /** main by default; div where the page already has its main (an example in the docs), its title then an h2. */
  as?: 'main' | 'div';
  /** As a div, the title's level under the headings around it (2 to 4, 2 by default). */
  level?: 2 | 3 | 4;
  /**
   * The detail's summary, beside the content; only the detail has one, other layouts drop it. No summary is
   * null or undefined: a component that renders nothing still makes the column.
   */
  aside?: ReactNode;
  children?: ReactNode;
}

/** Page: a page's frame inside an AppShell: its header, and its content in one of four layouts. */
export function Page({
  layout = 'sections',
  width,
  title,
  lede,
  trail = [],
  trailLabel,
  asideLabel = 'Resumo',
  sprite,
  as: Tag = 'main',
  level = 2,
  aside,
  children,
}: PageProps): ReactElement {
  const Title = Tag === 'main' ? 'h1' : (`h${level}` as const);
  return (
    <Tag
      className="feitio-page"
      data-layout={layout}
      data-width={layout === 'detail' && width === 'full' ? 'full' : undefined}
    >
      <header className="feitio-page-header">
        {trail.length > 0 && (
          <Breadcrumbs items={trail} current={title} label={trailLabel} sprite={sprite} />
        )}
        <Title>{title}</Title>
        {lede && <p className="lede">{lede}</p>}
      </header>
      {layout === 'detail' ? (
        <div className="feitio-page-detail">
          {aside != null &&
            aside !== false &&
            !(typeof aside === 'string' && aside.trim() === '') && (
              <aside className="aside" aria-label={asideLabel}>
                {aside}
              </aside>
            )}
          <div className="main">{children}</div>
        </div>
      ) : (
        children
      )}
    </Tag>
  );
}
