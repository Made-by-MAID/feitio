import type { ReactElement, ReactNode } from 'react';
import { Icon } from './Icon.tsx';

export interface KanbanCardProps {
  id: string;
  /** The card's name, for screen readers (and the move button's label). */
  name: string;
  /** The columns it may go to, by id. */
  to?: string[];
  /** The move button's words, before the card's name. */
  moveLabel?: string;
  /** What a card that cannot move says. */
  fixedLabel?: string;
  sprite?: string;
  /** The card's content, free. */
  children?: ReactNode;
}

/** KanbanCard: one card of a Kanban column, lifted paper held by a strip of tape. */
export function KanbanCard({
  id,
  name,
  to = [],
  moveLabel = 'Mover',
  fixedLabel = 'fixo',
  sprite,
  children,
}: KanbanCardProps): ReactElement {
  return (
    <article
      className="feitio-kanban-card"
      data-id={id}
      data-to={to.length ? to.join(' ') : undefined}
      aria-label={name}
    >
      {children}
      {to.length ? (
        <button
          type="button"
          className="feitio-button move"
          data-size="small"
          aria-label={`${moveLabel}: ${name}`}
          aria-haspopup="true"
          aria-expanded="false"
        >
          <Icon name="chevron-down" sprite={sprite} />
        </button>
      ) : (
        <span className="fixed">{fixedLabel}</span>
      )}
    </article>
  );
}
