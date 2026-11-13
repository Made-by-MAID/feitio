import type { ReactElement } from 'react';
import { usePageBehavior } from './actions/use-page-behavior.ts';
import { wireForms } from './actions/wire.ts';

export interface SwitchProps {
  label: string;
  on?: boolean;
  disabled?: boolean;
  onLabel?: string;
  offLabel?: string;
  name?: string;
  onChange?: (on: boolean) => void;
}

/** Switch: a setting that takes effect at once, its state said in words. */
export function Switch({
  label,
  on = false,
  disabled,
  onLabel = 'Ligado',
  offLabel = 'Desligado',
  name,
  onChange,
}: SwitchProps): ReactElement {
  usePageBehavior('feitioForms', wireForms);
  return (
    <label className="feitio-switch" data-on={onLabel} data-off={offLabel}>
      <input
        type="checkbox"
        // biome-ignore lint/a11y/useAriaPropsForRole: a checkbox says whether it is checked by itself.
        role="switch"
        name={name}
        defaultChecked={on}
        disabled={disabled}
        onChange={onChange && ((event) => onChange(event.target.checked))}
      />
      {label}
      <span className="state">{on ? onLabel : offLabel}</span>
    </label>
  );
}
