import type { ChangeEvent, ReactElement } from 'react';

export interface CheckboxProps {
  label: string;
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
}

/** Checkbox: one choice that is on or off, its words beside it. */
export function Checkbox({
  label,
  name,
  value,
  checked,
  disabled,
  onChange,
}: CheckboxProps): ReactElement {
  return (
    <label className="feitio-choice">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={checked}
        disabled={disabled}
        onChange={onChange && ((event) => onChange(event.target.checked, event))}
      />
      {label}
    </label>
  );
}
