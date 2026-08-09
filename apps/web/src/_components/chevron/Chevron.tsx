import type { JSX } from 'react';

import { classNames } from '@domain/services/class-names.service';

import styles from './Chevron.module.scss';

interface ChevronProps {
  readonly direction: 'left' | 'right';
}

export const Chevron = ({ direction }: ChevronProps): JSX.Element => (
  <svg
    className={classNames(styles.chevron, direction === 'right' && styles.right)}
    viewBox="0 0 20 20"
  >
    <path d="M12.25 4.5 6.75 10l5.5 5.5" />
  </svg>
);
