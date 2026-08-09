import type { JSX, ReactNode } from 'react';

import styles from './FormField.module.scss';

interface FormFieldProps {
  readonly label: string;
  readonly error?: string;
  readonly hint?: string;
  readonly children: ReactNode;
}

export const FormField = ({ label, error, hint, children }: FormFieldProps): JSX.Element => (
  <label className={styles.field}>
    <span className={styles.label}>{label}</span>
    {children}
    {error !== undefined && <span className={styles.error}>{error}</span>}
    {error === undefined && hint !== undefined && <span className={styles.hint}>{hint}</span>}
  </label>
);
