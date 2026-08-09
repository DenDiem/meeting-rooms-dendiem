import * as RadixDialog from '@radix-ui/react-dialog';
import type { JSX, ReactNode } from 'react';

import styles from './Dialog.module.scss';

interface DialogProps {
  readonly title: string;
  readonly description: string;
  readonly onDismiss: () => void;
  readonly children: ReactNode;
}

export const Dialog = ({ title, description, onDismiss, children }: DialogProps): JSX.Element => (
  <RadixDialog.Root
    open
    onOpenChange={(isOpen) => {
      if (!isOpen) {
        onDismiss();
      }
    }}
  >
    <RadixDialog.Portal>
      <RadixDialog.Overlay className={styles.overlay} />
      <RadixDialog.Content className={styles.dialog}>
        <header className={styles.head}>
          <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
          <RadixDialog.Description className={styles.description}>
            {description}
          </RadixDialog.Description>
        </header>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  </RadixDialog.Root>
);

export const DialogBody = ({ children }: { readonly children: ReactNode }): JSX.Element => (
  <div className={styles.body}>{children}</div>
);

export const DialogActions = ({ children }: { readonly children: ReactNode }): JSX.Element => (
  <div className={styles.actions}>{children}</div>
);
