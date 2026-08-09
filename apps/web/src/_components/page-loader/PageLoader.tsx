import type { JSX } from 'react';

import styles from './PageLoader.module.scss';

interface PageLoaderProps {
  readonly label: string;
}

export const PageLoader = ({ label }: PageLoaderProps): JSX.Element => (
  <div className={styles.loader}>
    <span className={styles.spinner} />
    <span className={styles.label}>{label}</span>
  </div>
);
