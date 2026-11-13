import type { ReactElement } from 'react';
import { Icon } from './Icon.tsx';

export interface SelectProps {
  id: string;
  options: string[];
  value?: string;
  /** A first, empty option, like "Choose…". */
  empty?: string;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  name?: string;
  sprite?: string;
  onChange?: (value: string) => void;
}

/** Select: one option out of a long list, closed until opened. */
export function Select({
  id,
  options,
  value,
  empty,
  disabled,
  invalid,
  describedBy,
  name,
  sprite,
  onChange,
}: SelectProps): ReactElement {
  return (
    <span className="feitio-select">
      <select
        id={id}
        name={name}
        disabled={disabled}
        aria-invalid={invalid ? 'true' : undefined}
        aria-describedby={describedBy}
        defaultValue={value}
        onChange={onChange && ((event) => onChange(event.target.value))}
      >
        {empty && <option value="">{empty}</option>}
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <Icon name="chevron-down" sprite={sprite} />
    </span>
  );
}
