import type { JSX } from 'react';
import { Link } from 'react-router';

import { RegisterForm } from '../../components/register-form/RegisterForm';
import styles from './RegisterPage.module.scss';

export const RegisterPage = (): JSX.Element => (
  <main className={styles.page}>
    <h1>Create an account</h1>
    <RegisterForm />
    <p>
      Already registered? <Link to="/login">Sign in</Link>
    </p>
  </main>
);
