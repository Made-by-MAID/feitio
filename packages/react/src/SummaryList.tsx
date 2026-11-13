import type { ReactElement } from 'react';

export interface SummaryListProps {
  rows: { key: string; value: string; change?: { href: string; label: string } }[];
}

/** SummaryList: pairs of a name and its value, each one with a link to change it. */
export function SummaryList({ rows }: SummaryListProps): ReactElement {
  return (
    <dl className="feitio-summary-list">
      {rows.map((r) => (
        <div key={r.key}>
          <dt>{r.key}</dt>
          <dd>{r.value}</dd>
          {r.change && (
            <dd className="change">
              <a className="feitio-link" href={r.change.href}>
                {r.change.label}
                <span className="feitio-visually-hidden"> {r.key}</span>
              </a>
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
