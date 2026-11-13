import type { ReactElement, ReactNode } from 'react';

export interface TableColumn {
  label: string;
  align?: 'end';
  /** The column's name is only heard (like the actions column). */
  hidden?: boolean;
}

export interface TableProps {
  id: string;
  caption?: string;
  columns: TableColumn[];
  /** Each row: one cell per column (text, or a Tag, a link, a button). */
  rows: ReactNode[][];
  /** The first column is the row's title on a phone card. */
  compact?: boolean;
}

/** Table: rows to compare; on a phone, each row becomes a card. */
export function Table({ id, caption, columns, rows, compact }: TableProps): ReactElement {
  const cap = `${id}-cap`;
  return (
    <div data-density={compact ? 'compact' : undefined} style={{ inlineSize: '100%' }}>
      {/* biome-ignore lint/a11y/useSemanticElements: the same HTML as the Astro Table. */}
      <div
        className="feitio-table-scroll"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a table that scrolls sideways must be reachable by keyboard.
        tabIndex={0}
        role="region"
        aria-labelledby={caption ? cap : undefined}
        aria-label={caption ? undefined : columns[0]?.label}
      >
        <table className="feitio-table">
          {caption && <caption id={cap}>{caption}</caption>}
          <thead>
            <tr>
              {columns.map((c) => (
                <th scope="col" data-align={c.align} key={c.label}>
                  {c.hidden ? <span className="feitio-visually-hidden">{c.label}</span> : c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, n) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: rows have no id of their own.
              <tr key={n}>
                {r.map((cell, i) =>
                  i === 0 ? (
                    // biome-ignore lint/suspicious/noArrayIndexKey: one cell per column, in order.
                    <td className="title" key={i}>
                      {cell}
                    </td>
                  ) : columns[i]?.hidden ? (
                    // biome-ignore lint/suspicious/noArrayIndexKey: one cell per column, in order.
                    <td className="actions" key={i}>
                      {cell}
                    </td>
                  ) : (
                    // biome-ignore lint/suspicious/noArrayIndexKey: one cell per column, in order.
                    <td data-align={columns[i]?.align} data-label={columns[i]?.label} key={i}>
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
