import { Children, type ReactElement, type ReactNode, useEffect, useRef } from 'react';
import { useElementBehavior } from './actions/use-element-behavior.ts';
import { wireKanban } from './actions/wire.ts';
import { Icon } from './Icon.tsx';

export interface KanbanColumn {
  id: string;
  title: string;
  /** What an empty column says, inviting to act. */
  empty?: string;
  /** The new-card button: its words, the field's label, and the words of Save and Cancel. */
  create?: { label: string; field: string; save?: string; cancel?: string };
}

/** A move the board asks for: the card, from where, to where, and at which place. */
export interface KanbanMove {
  id: string;
  from: string;
  to: string;
  index: number;
}

export interface KanbanProps {
  id: string;
  /** The board's name, for screen readers. */
  label: string;
  columns: KanbanColumn[];
  /** Each column's cards (KanbanCard), by column id. */
  cards?: Record<string, ReactNode>;
  /** The stage a phone shows first; the first column when left out. */
  current?: string;
  /** The title of the move list. */
  moveLabel?: string;
  /** A card was dragged or sent to another column: move it in your state. */
  onMove?: (move: KanbanMove) => void;
  /** Something was written in a column's new-card field: add the card. */
  onCreate?: (column: string, text: string) => void;
  sprite?: string;
}

/** Kanban: work in columns, one per stage, and cards that go from one to the next. */
export function Kanban({
  id,
  label,
  columns,
  cards = {},
  current,
  moveLabel = 'Mover para',
  onMove,
  onCreate,
  sprite,
}: KanbanProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  useElementBehavior(ref, 'kanban', wireKanban);
  const handlers = useRef({ onMove, onCreate });
  handlers.current = { onMove, onCreate };
  useEffect(() => {
    const board = ref.current;
    if (!board) return;
    // React owns the cards: the board's own move is cancelled and the state moves them instead.
    const move = (event: Event): void => {
      const { onMove: handle } = handlers.current;
      if (!handle) return;
      event.preventDefault();
      const { id: card, from, to, index } = (event as CustomEvent<KanbanMove>).detail;
      handle({ id: card, from, to, index });
    };
    const create = (event: Event): void => {
      const { column, text } = (event as CustomEvent<{ column: string; text: string }>).detail;
      handlers.current.onCreate?.(column, text);
    };
    board.addEventListener('feitio-kanban-move', move);
    board.addEventListener('feitio-kanban-create', create);
    return () => {
      board.removeEventListener('feitio-kanban-move', move);
      board.removeEventListener('feitio-kanban-create', create);
    };
  }, []);
  const shown = current ?? columns[0]?.id;
  const rendered = columns.map((c) => ({ ...c, n: Children.toArray(cards[c.id]).length }));
  return (
    <div className="feitio-kanban" id={id} data-move-label={moveLabel} ref={ref}>
      <div className="feitio-kanban-scroll tabs-scroll">
        <span className="edge start" aria-hidden="true" />
        {/* biome-ignore lint/a11y/useSemanticElements: a group of toggle buttons, not a form. */}
        <div className="tabs" role="group" aria-label={label}>
          {rendered.map((c) => (
            <button
              type="button"
              key={c.id}
              data-col={c.id}
              aria-pressed={c.id === shown ? 'true' : 'false'}
              data-has={c.n ? '' : undefined}
            >
              {c.title} <span className="n">{c.n}</span>
            </button>
          ))}
        </div>
        <span className="edge end" aria-hidden="true" />
      </div>
      <div className="feitio-kanban-scroll">
        <span className="edge start" aria-hidden="true" />
        <div className="cols">
          {rendered.map((c) => (
            // biome-ignore lint/a11y/useSemanticElements: a named group of cards, not a form; a section would make every column a landmark.
            <div
              className="col"
              role="group"
              key={c.id}
              data-col={c.id}
              aria-labelledby={`${id}-${c.id}`}
              data-current={c.id === shown ? '' : undefined}
              data-empty={c.n ? undefined : ''}
            >
              <div className="col-head">
                <h3 id={`${id}-${c.id}`}>{c.title}</h3>
                <span className="n">{c.n}</span>
              </div>
              {c.empty && (
                <p className="empty" hidden={c.n > 0}>
                  {c.empty}
                </p>
              )}
              {cards[c.id]}
              {c.create && (
                <button
                  type="button"
                  className="add"
                  data-field={c.create.field}
                  data-save={c.create.save ?? 'Salvar'}
                  data-cancel={c.create.cancel ?? 'Cancelar'}
                >
                  <Icon name="plus" sprite={sprite} />
                  {c.create.label}
                </button>
              )}
            </div>
          ))}
        </div>
        <span className="edge end" aria-hidden="true" />
      </div>
      <div className="minimap" aria-hidden="true" hidden />
    </div>
  );
}
