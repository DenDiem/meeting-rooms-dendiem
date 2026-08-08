import type { JSX } from 'react';

import styles from './StatusMessage.module.scss';

interface StatusMessageProps {
  readonly tone: 'info' | 'error';
  readonly children: string;
}

export const StatusMessage = ({ tone, children }: StatusMessageProps): JSX.Element => (
  <p
    className={tone === 'error' ? `${styles.status} ${styles.error}` : styles.status}
    role={tone === 'error' ? 'alert' : 'status'}
  >
    {children}
  </p>
);
