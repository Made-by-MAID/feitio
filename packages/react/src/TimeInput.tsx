import type { ReactElement } from 'react';
import { usePageBehavior } from './actions/use-page-behavior.ts';
import { wireForms } from './actions/wire.ts';

export interface TimeInputProps {
  hour?: string;
  minute?: string;
  cycle?: '12' | '24';
  period?: 'AM' | 'PM';
  hourLabel?: string;
  minuteLabel?: string;
  periodLabel?: string;
  invalid?: boolean;
  disabled?: boolean;
}

/** TimeInput: an hour and its minutes in two short fields; in a 12-hour cycle, AM or PM. */
export function TimeInput({
  hour = '09',
  minute = '00',
  cycle = '24',
  period = 'AM',
  hourLabel = 'Hora',
  minuteLabel = 'Minuto',
  periodLabel = 'AM ou PM',
  invalid,
  disabled,
}: TimeInputProps): ReactElement {
  usePageBehavior('feitioForms', wireForms);
  return (
    <div className="feitio-time-field" data-hour-cycle={cycle}>
      <input
        className="seg"
        inputMode="numeric"
        maxLength={2}
        defaultValue={hour}
        aria-label={hourLabel}
        aria-invalid={invalid ? 'true' : undefined}
        disabled={disabled}
      />
      <span className="sep" aria-hidden="true">
        :
      </span>
      <input
        className="seg"
        inputMode="numeric"
        maxLength={2}
        defaultValue={minute}
        aria-label={minuteLabel}
        disabled={disabled}
      />
      {cycle === '12' && (
        <button type="button" className="period" aria-label={periodLabel} disabled={disabled}>
          {period}
        </button>
      )}
    </div>
  );
}
