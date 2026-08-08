import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useForm } from 'react-hook-form';

import { StatusMessage } from '@components/feedback/status-message/StatusMessage';
import { FormField } from '@components/forms/form-field/FormField';
import type { LoginPayload } from '@domain/models/interfaces/auth-payload.interface';
import { getErrorMessage } from '@domain/services/api-error.service';
import { loginValidator } from '@domain/validators/auth.validators';
import { useLoginMutation } from '@store/api/auth.api';

import styles from './LoginForm.module.scss';

export const LoginForm = (): JSX.Element => {
  const [login, { isLoading, error }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({ resolver: zodResolver(loginValidator) });

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit((values) => void login(values))}
      noValidate
    >
      <FormField label="Email" error={errors.email?.message}>
        <input type="email" autoComplete="email" {...register('email')} />
      </FormField>

      <FormField label="Password" error={errors.password?.message}>
        <input type="password" autoComplete="current-password" {...register('password')} />
      </FormField>

      {error && <StatusMessage tone="error">{getErrorMessage(error)}</StatusMessage>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
};
