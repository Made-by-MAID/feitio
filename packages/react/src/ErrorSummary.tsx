import type { ReactElement } from 'react';
import { Icon } from './Icon.tsx';

export interface ErrorSummaryProps {
  title: string;
  errors: { text: string; href: string }[];
  sprite?: string;
}

/** ErrorSummary: every error of a form at the top, each one a link to its field. */
export function ErrorSummary({ title, errors, sprite }: ErrorSummaryProps): ReactElement {
  return (
    <div className="feitio-error-summary" role="alert" tabIndex={-1}>
      <h3>
        <Icon name="close" sprite={sprite} />
        {title}
      </h3>
      <ul>
        {errors.map((e) => (
          <li key={e.href}>
            <a href={e.href}>{e.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
