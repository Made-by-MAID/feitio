import type { ReactElement } from 'react';
import {
  type HeatmapCell,
  type HeatmapLevel,
  labelSpans,
  squareOf,
} from './calculations/heatmap.ts';

export type { HeatmapCell, HeatmapLevel, HeatmapTone } from './calculations/heatmap.ts';

export interface HeatmapProps {
  id?: string;
  caption: string;
  /** One label per row; an empty one shows nothing (GitHub labels every other weekday). */
  rows: readonly (string | null | undefined)[];
  /** One label per column; a label runs over the unlabelled columns after it (a month over its weeks). */
  columns: readonly (string | null | undefined)[];
  /** One list per row, one cell per column. */
  cells: readonly (readonly (HeatmapCell | null | undefined)[])[];
  /** The legend, in order. */
  levels: readonly HeatmapLevel[];
}

/**
 * Heatmap: a grid of fixed positions for a value over time, as a real table. Each square is a level;
 * the legend gives each level its words, and every square says its title and level to a screen
 * reader. No inline style, so it works under a strict Content Security Policy.
 */
export function Heatmap({ id, caption, rows, columns, cells, levels }: HeatmapProps): ReactElement {
  return (
    <div className="feitio-heatmap" id={id}>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <td />
            {labelSpans(columns).map((s, i) => {
              const colSpan = s.span > 1 ? s.span : undefined;
              return s.label ? (
                // biome-ignore lint/suspicious/noArrayIndexKey: columns are positions, with no id of their own.
                <th scope="col" colSpan={colSpan} key={i}>
                  <span>{s.label}</span>
                </th>
              ) : (
                // biome-ignore lint/suspicious/noArrayIndexKey: columns are positions, with no id of their own.
                <td colSpan={colSpan} key={i} />
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((label, r) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: rows are positions, with no id of their own.
            <tr key={r}>
              {label ? <th scope="row">{label}</th> : <td />}
              {columns.map((_, c) => {
                const square = squareOf(cells[r]?.[c], levels);
                return square.text ? (
                  // biome-ignore lint/suspicious/noArrayIndexKey: squares are positions, with no id of their own.
                  <td data-tone={square.tone} title={square.text} key={c}>
                    <span className="feitio-visually-hidden">{square.text}</span>
                  </td>
                ) : (
                  // biome-ignore lint/suspicious/noArrayIndexKey: squares are positions, with no id of their own.
                  <td data-tone={square.tone} key={c} />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="legend">
        {levels.map((l) => (
          <li key={l.id}>
            <span className="swatch" data-tone={l.tone} />
            {l.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
