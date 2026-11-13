import type { ReactElement, ReactNode } from 'react';
import { Icon } from './Icon.tsx';

export interface SearchProps {
  id: string;
  title: string;
  placeholder?: string;
  closeLabel?: string;
  keys?: { open: string; choose: string; close: string };
  sprite?: string;
  /** The results, as list items. */
  children?: ReactNode;
}

/** Search: the site's search in a Dialog, its results in a list, moved through with the keyboard. */
export function Search({
  id,
  title,
  placeholder,
  closeLabel = 'Fechar',
  keys,
  sprite,
  children,
}: SearchProps): ReactElement {
  return (
    <dialog className="feitio-dialog search-dialog" id={id} aria-labelledby={`${id}-t`}>
      <form method="dialog">
        <h2 id={`${id}-t`} className="feitio-visually-hidden">
          {title}
        </h2>
        <div className="search-head">
          <Icon name="search" sprite={sprite} />
          <label className="feitio-visually-hidden" htmlFor={`${id}-field`}>
            {title}
          </label>
          <input
            className="search-field"
            id={`${id}-field`}
            type="search"
            autoComplete="off"
            placeholder={placeholder}
          />
          <button type="submit" className="feitio-button close" data-size="small" value="close">
            <Icon name="close" sprite={sprite} />
            {closeLabel}
          </button>
        </div>
        <ul className="results">{children}</ul>
        {keys && (
          <p className="foot">
            <span>
              <kbd className="feitio-kbd">↵</kbd> {keys.open}
            </span>
            <span>
              <kbd className="feitio-kbd">↑</kbd>
              <kbd className="feitio-kbd">↓</kbd> {keys.choose}
            </span>
            <span>
              <kbd className="feitio-kbd">Esc</kbd> {keys.close}
            </span>
          </p>
        )}
      </form>
    </dialog>
  );
}
