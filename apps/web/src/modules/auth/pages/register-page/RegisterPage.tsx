import type { JSX } from 'react';
import { Link } from 'react-router';

import { AuthCard } from '../../components/auth-card/AuthCard';
import { RegisterForm } from '../../components/register-form/RegisterForm';

export const RegisterPage = (): JSX.Element => (
  <AuthCard
    title="Create an account"
    subtitle="You will be signed in right away"
    footer={
      <>
        Already registered? <Link to="/login">Sign in</Link>
      </>
    }
  >
    <RegisterForm />
  </AuthCard>
);
