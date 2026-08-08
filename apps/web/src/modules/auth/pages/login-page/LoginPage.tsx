import type { JSX } from 'react';
import { Link } from 'react-router';

import { LoginForm } from '../../components/login-form/LoginForm';
import styles from './LoginPage.module.scss';

export const LoginPage = (): JSX.Element => (
  <main className={styles.page}>
    <h1>Sign in</h1>
    <LoginForm />
    <p>
      No account yet? <Link to="/register">Create one</Link>
    </p>
  </main>
);
