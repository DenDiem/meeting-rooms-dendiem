import type { JSX } from 'react';

import { classNames } from '@domain/services/class-names.service';

import styles from './BrandMark.module.scss';

interface BrandMarkProps {
  readonly className?: string;
}

export const BrandMark = ({ className }: BrandMarkProps): JSX.Element => (
  <svg className={classNames(styles.mark, className)} viewBox="0 0 32 32" aria-hidden="true">
    <rect className={styles.plate} width="32" height="32" rx="7" />
    <path className={styles.hand} d="M16 8.5v8h6" />
  </svg>
);
