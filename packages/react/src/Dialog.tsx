import type { ReactElement, ReactNode } from 'react';
import { usePageBehavior } from './actions/use-page-behavior.ts';
import { wireDialogs } from './actions/wire.ts';

export interface DialogProps {
  id: string;
  title: string;
  action: string;
  cancel?: string;
  danger?: boolean;
  /** For what deletes a lot at once: the word to type, and the field's label. */
  confirmWord?: { word: string; label: string };
  /** Called when it closes, with "yes" or "cancel". */
  onClose?: (answer: string) => void;
  children?: ReactNode;
}

/**
 * Dialog: a question that stops everything until it is answered. A button with
 * data-open-dialog="its id" opens it.
 */
export function Dialog({
  id,
  title,
  action,
  cancel = 'Cancelar',
  danger = false,
  confirmWord,
  onClose,
  children,
}: DialogProps): ReactElement {
  usePageBehavior('feitioDialogs', wireDialogs);
  return (
    <dialog
      className="feitio-dialog"
      id={id}
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-d`}
      onClose={onClose && ((event) => onClose(event.currentTarget.returnValue))}
    >
      <form method="dialog" data-type-to-confirm={confirmWord?.word}>
        <h2 id={`${id}-t`}>{title}</h2>
        <div id={`${id}-d`}>{children}</div>
        {confirmWord && (
          <div className="feitio-field">
            <label className="feitio-label" htmlFor={`${id}-word`}>
              {confirmWord.label}
            </label>
            <input className="feitio-input" id={`${id}-word`} autoComplete="off" />
          </div>
        )}
        <div className="actions">
          <button
            type="submit"
            className="feitio-button"
            data-variant={danger ? 'danger' : 'primary'}
            value="yes"
            disabled={Boolean(confirmWord)}
          >
            {action}
          </button>
          {/* biome-ignore lint/a11y/noAutofocus: a Dialog puts the focus on its safe answer. */}
          <button type="submit" className="feitio-button" value="cancel" autoFocus={!confirmWord}>
            {cancel}
          </button>
        </div>
      </form>
    </dialog>
  );
}
