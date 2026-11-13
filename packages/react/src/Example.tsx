import type { ReactElement, ReactNode } from 'react';
import { CodeBlock } from './CodeBlock.tsx';
import { Icon } from './Icon.tsx';

export interface ExampleProps {
  id: string;
  title: string;
  description: string;
  code: string;
  showLabel?: string;
  copyLabel?: string;
  copiedLabel?: string;
  sprite?: string;
  children?: ReactNode;
}

/** Example: a live piece of interface, what it is for, and its code behind a Details. */
export function Example({
  id,
  title,
  description,
  code,
  showLabel = 'Mostrar código',
  copyLabel,
  copiedLabel,
  sprite,
  children,
}: ExampleProps): ReactElement {
  return (
    <div className="feitio-example">
      <div className="live">{children}</div>
      <div className="about">
        <h3 id={id}>{title}</h3>
        <p>{description}</p>
        <details>
          <summary>
            <Icon name="chevron-right" sprite={sprite} />
            {showLabel}
          </summary>
          <CodeBlock code={code} copyLabel={copyLabel} copiedLabel={copiedLabel} />
        </details>
      </div>
    </div>
  );
}
