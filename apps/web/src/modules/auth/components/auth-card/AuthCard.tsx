import type { JSX, ReactNode } from 'react';

import { BrandMark } from '@components/branding/brand-mark/BrandMark';

import styles from './AuthCard.module.scss';

interface AuthCardProps {
  readonly title: string;
  readonly subtitle: string;
  readonly footer: ReactNode;
  readonly children: ReactNode;
}

export const AuthCard = ({ title, subtitle, footer, children }: AuthCardProps): JSX.Element => (
  <main className={styles.page}>
    <section className={styles.card}>
      <header className={styles.head}>
        <BrandMark className={styles.mark} />
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </header>

      {children}

      <p className={styles.footer}>{footer}</p>
    </section>
  </main>
);
