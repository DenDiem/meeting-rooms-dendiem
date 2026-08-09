import type { ButtonHTMLAttributes, JSX } from 'react';

import { classNames } from '@domain/services/class-names.service';

import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  readonly size?: 'medium' | 'small' | 'icon';
}

export const Button = ({
  variant = 'secondary',
  size = 'medium',
  type = 'button',
  className,
  ...rest
}: ButtonProps): JSX.Element => (
  <button
    type={type}
    className={classNames(styles.button, styles[variant], styles[size], className)}
    {...rest}
  />
);
