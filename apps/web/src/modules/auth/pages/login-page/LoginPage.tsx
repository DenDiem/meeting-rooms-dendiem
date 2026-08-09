import type { JSX } from 'react';
import { Link } from 'react-router';

import { AuthCard } from '../../components/auth-card/AuthCard';
import { LoginForm } from '../../components/login-form/LoginForm';

export const LoginPage = (): JSX.Element => (
  <AuthCard
    title="Sign in"
    subtitle="Book a meeting room in a couple of clicks"
    footer={
      <>
        No account yet? <Link to="/register">Create one</Link>
      </>
    }
  >
    <LoginForm />
  </AuthCard>
);
