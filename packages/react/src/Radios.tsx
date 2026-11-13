import type { ReactElement } from 'react';

export interface RadiosProps {
  legend: string;
  name: string;
  options: string[];
  value?: string;
  disabled?: boolean;
  /** "inline" puts short options side by side. */
  layout?: 'stack' | 'inline';
  onChange?: (value: string) => void;
}

/** Radios: one answer out of a few, all of them in sight. */
export function Radios({
  legend,
  name,
  options,
  value,
  disabled,
  layout = 'stack',
  onChange,
}: RadiosProps): ReactElement {
  return (
    <fieldset className="feitio-fieldset" disabled={disabled}>
      <legend className="feitio-label">{legend}</legend>
      <div className="feitio-choices" data-layout={layout === 'inline' ? 'inline' : undefined}>
        {options.map((o) => (
          <label className="feitio-choice" key={o}>
            <input
              type="radio"
              name={name}
              value={o}
              defaultChecked={o === value}
              onChange={onChange && (() => onChange(o))}
            />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
