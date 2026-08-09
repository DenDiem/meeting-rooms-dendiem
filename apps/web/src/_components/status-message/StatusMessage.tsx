import type { JSX } from 'react';

import { classNames } from '@domain/services/class-names.service';

import styles from './StatusMessage.module.scss';

interface StatusMessageProps {
  readonly tone: 'info' | 'error';
  readonly children: string;
}

export const StatusMessage = ({ tone, children }: StatusMessageProps): JSX.Element => (
  <p className={classNames(styles.status, tone === 'error' && styles.error)}>{children}</p>
);
