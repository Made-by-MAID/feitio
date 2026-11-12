import { wireForms } from './actions/wire-forms.ts';

export { matchesFilter, plainText, togglePeriod } from './calculations/form-values.ts';

/** The form controls of a page: Switch, SegmentedControl, TimeInput and FilterField. */
export function forms(window: Window, root: Document | HTMLElement = window.document): void {
  wireForms(window, root);
}
