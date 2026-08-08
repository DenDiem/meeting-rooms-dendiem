import type { JSX, ReactNode } from 'react';

import styles from './FormField.module.scss';

interface FormFieldProps {
  readonly label: string;
  readonly error?: string;
  readonly children: ReactNode;
}

export const FormField = ({ label, error, children }: FormFieldProps): JSX.Element => (
  <label className={styles.field}>
    <span className={styles.label}>{label}</span>
    {children}
    {error && <span className={styles.error}>{error}</span>}
  </label>
);
