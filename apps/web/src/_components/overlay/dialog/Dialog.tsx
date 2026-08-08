import type { JSX, ReactNode } from 'react';

import styles from './Dialog.module.scss';

interface DialogProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const Dialog = ({ title, children }: DialogProps): JSX.Element => (
  <div className={styles.dialog} role="dialog" aria-label={title}>
    <h2>{title}</h2>
    {children}
  </div>
);

export const DialogActions = ({ children }: { readonly children: ReactNode }): JSX.Element => (
  <div className={styles.actions}>{children}</div>
);
