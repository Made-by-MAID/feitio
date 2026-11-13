import basket from '@feitio/core/illustrations/empty-basket.svg' with { type: 'text' };
import torn from '@feitio/core/illustrations/torn-paper.svg' with { type: 'text' };
import type { ReactElement, ReactNode } from 'react';
import { svgParts } from './calculations/svg-parts.ts';

const art = { basket: svgParts(basket), torn: svgParts(torn) };

export interface EmptyStateProps {
  title: string;
  text?: string;
  /** "basket" for nothing yet, "torn" for an error. */
  illustration?: 'basket' | 'torn' | 'none';
  size?: 'compact';
  children?: ReactNode;
}

/** EmptyState: what shows where there is nothing yet, or where something went wrong, and what to do. */
export function EmptyState({
  title,
  text,
  illustration = 'basket',
  size,
  children,
}: EmptyStateProps): ReactElement {
  const drawing = illustration === 'none' ? undefined : art[illustration];
  return (
    <div className="feitio-empty" data-size={size}>
      {drawing && (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: the illustration is Feitio's own file.
        <svg {...drawing.attributes} dangerouslySetInnerHTML={{ __html: drawing.inner }} />
      )}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
