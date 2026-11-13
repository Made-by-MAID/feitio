import type { ReactElement } from 'react';

export interface CodeBlockProps {
  code: string;
  label?: string;
  syntax?: 'html' | 'jsx' | 'shell';
  copyLabel?: string;
  copiedLabel?: string;
}

/** CodeBlock: code to read and copy, with its language named on the bar. */
export function CodeBlock({
  code,
  label = 'HTML',
  syntax = 'html',
  copyLabel = 'Copiar',
  copiedLabel = 'Copiado',
}: CodeBlockProps): ReactElement {
  return (
    <div className="feitio-code" data-lang={syntax}>
      <div className="bar">
        <span>{label}</span>
        <button
          type="button"
          className="feitio-button copy"
          data-size="small"
          data-done-label={copiedLabel}
        >
          {copyLabel}
        </button>
      </div>
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a code block scrolls sideways, so the keyboard must reach it. */}
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
