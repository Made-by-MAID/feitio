import type { ReactElement } from 'react';
import { usePageBehavior } from './actions/use-page-behavior.ts';
import { wireForms } from './actions/wire.ts';

export interface FilterFieldProps {
  id: string;
  /** The id of the list it filters; each item carries data-search. */
  list: string;
  label: string;
  placeholder?: string;
  /** Milliseconds to wait for the typing to stop before filtering. */
  debounce?: number;
  /**
   * The search runs elsewhere: the field sends a feitio-filter event with the query and a done() to
   * call when the results are in, and shows it is busy meanwhile.
   */
  async?: boolean;
  /** What the count says while an asynchronous search runs. */
  busyLabel?: string;
}

/** FilterField: narrows a list as you type, and says how many are left. */
export function FilterField({
  id,
  list,
  label,
  placeholder,
  debounce,
  async: isAsync,
  busyLabel = 'Buscando…',
}: FilterFieldProps): ReactElement {
  usePageBehavior('feitioForms', wireForms);
  return (
    <div className="feitio-filter">
      <label className="feitio-visually-hidden" htmlFor={id}>
        {label}
      </label>
      <span className="box">
        <input
          className="feitio-input"
          id={id}
          type="search"
          autoComplete="off"
          placeholder={placeholder}
          data-filter={list}
          data-debounce={debounce}
          data-async={isAsync ? '' : undefined}
          data-busy-label={isAsync ? busyLabel : undefined}
        />
        <span className="wait" aria-hidden="true" />
        <svg className="busy" viewBox="0 0 24 24" aria-hidden="true">
          <path
            pathLength={1}
            d="M12 3.4C16.9 3.2 20.7 7.1 20.6 12C20.5 16.7 16.7 20.6 12 20.6C7.2 20.6 3.4 16.8 3.4 12.1C3.4 7.6 6.9 3.9 11.4 3.5"
          />
        </svg>
      </span>
      <span className="count" data-count={list} aria-live="polite" />
    </div>
  );
}
