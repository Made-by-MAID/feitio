import type { ReactElement } from 'react';
import { usePageBehavior } from './actions/use-page-behavior.ts';
import { wireForms } from './actions/wire.ts';

export interface SegmentedControlProps {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}

/** SegmentedControl: a few options side by side, one of them on. */
export function SegmentedControl({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps): ReactElement {
  usePageBehavior('feitioForms', wireForms);
  const current = value ?? options[0];
  return (
    // biome-ignore lint/a11y/useSemanticElements: a group of toggle buttons, not a form.
    <div className="feitio-segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          type="button"
          key={o}
          aria-pressed={o === current ? 'true' : 'false'}
          onClick={onChange && (() => onChange(o))}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
