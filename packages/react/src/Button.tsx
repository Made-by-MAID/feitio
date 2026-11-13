import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactElement } from 'react';
import { classNames } from './calculations/text.ts';

interface Common {
  /** primary is the screen's main action (orange, at most one); danger destroys something. */
  variant?: 'primary' | 'danger';
  size?: 'small' | 'large';
}

export type ButtonProps = Common &
  (
    | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
        type?: 'button' | 'submit' | 'reset';
        href?: undefined;
      })
    | (AnchorHTMLAttributes<HTMLAnchorElement> & {
        /** Makes it a link that looks like a button. */
        href: string;
      })
  );

/** Button: an action. With href, a link that looks like one. */
export function Button(props: ButtonProps): ReactElement {
  const { variant, size, className, children } = props;
  const classes = classNames('feitio-button', className);
  if (props.href !== undefined) {
    const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <a {...rest} className={classes} data-variant={variant} data-size={size}>
        {children}
      </a>
    );
  }
  const { variant: _v, size: _s, className: _c, children: _ch, type = 'button', ...rest } = props;
  return (
    <button {...rest} className={classes} type={type} data-variant={variant} data-size={size}>
      {children}
    </button>
  );
}
