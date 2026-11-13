import type { ReactElement } from 'react';
import { paginationEntries } from './calculations/pagination.ts';
import { Icon } from './Icon.tsx';

export interface PaginationProps {
  label: string;
  current: number;
  total: number;
  href: (page: number) => string;
  count?: string;
  perPage?: { label: string; options: number[]; current: number; href: (n: number) => string };
  previousLabel?: string;
  nextLabel?: string;
  pageLabel?: (page: number) => string;
  sprite?: string;
}

function defaultPageLabel(page: number): string {
  return `Página ${page}`;
}

/** Pagination: the pages of a long list, the first and last always in reach. */
export function Pagination({
  label,
  current,
  total,
  href,
  count,
  perPage,
  previousLabel = 'Anterior',
  nextLabel = 'Próxima',
  pageLabel = defaultPageLabel,
  sprite,
}: PaginationProps): ReactElement {
  return (
    <nav className="feitio-pagination" aria-label={label}>
      <ul>
        {current > 1 && (
          <li>
            <a className="step prev" href={href(current - 1)} rel="prev">
              <Icon name="chevron-right" sprite={sprite} />
              {previousLabel}
            </a>
          </li>
        )}
        {paginationEntries(current, total).map((entry) =>
          entry.kind === 'gap' ? (
            <li key={`gap-${entry.after}`}>
              <span className="gap" aria-hidden="true">
                …
              </span>
            </li>
          ) : (
            <li key={entry.page}>
              {entry.page === current ? (
                <span aria-current="page">{entry.page}</span>
              ) : (
                <a href={href(entry.page)} aria-label={pageLabel(entry.page)}>
                  {entry.page}
                </a>
              )}
            </li>
          ),
        )}
        {current < total && (
          <li>
            <a className="step" href={href(current + 1)} rel="next">
              {nextLabel}
              <Icon name="chevron-right" sprite={sprite} />
            </a>
          </li>
        )}
      </ul>
      {(count || perPage) && (
        <div className="meta">
          {count && <p className="count">{count}</p>}
          {perPage && (
            // biome-ignore lint/a11y/useSemanticElements: a group of links, not a form.
            <div className="per-page" role="group" aria-label={perPage.label}>
              <span>{perPage.label}</span>
              {perPage.options.map((n) =>
                n === perPage.current ? (
                  <span key={n} aria-current="true">
                    {n}
                  </span>
                ) : (
                  <a key={n} href={perPage.href(n)}>
                    {n}
                  </a>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
