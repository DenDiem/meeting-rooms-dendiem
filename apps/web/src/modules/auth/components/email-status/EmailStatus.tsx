import type { JSX } from 'react';

import { classNames } from '@domain/services/class-names.service';

import styles from './EmailStatus.module.scss';

interface EmailStatusProps {
  readonly isConfirmed: boolean;
}

export const EmailStatus = ({ isConfirmed }: EmailStatusProps): JSX.Element => (
  <span className={classNames(styles.status, isConfirmed ? styles.confirmed : styles.pending)}>
    <span className={styles.dot} />
    {isConfirmed ? 'Email confirmed' : 'Confirm email to book'}
  </span>
);
