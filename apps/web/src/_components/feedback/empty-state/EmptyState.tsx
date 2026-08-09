import type { JSX, ReactNode } from 'react';

import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly children?: ReactNode;
}

export const EmptyState = ({ title, description, children }: EmptyStateProps): JSX.Element => (
  <div className={styles.empty}>
    <span className={styles.mark} />
    <span className={styles.title}>{title}</span>
    <p className={styles.description}>{description}</p>
    {children}
  </div>
);
