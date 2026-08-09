import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@components/button/Button';
import { FormField } from '@components/form-field/FormField';
import { StatusMessage } from '@components/status-message/StatusMessage';
import type { LoginPayload } from '@domain/models/interfaces/auth-payload.interface';
import {
  applyFieldErrors,
  getErrorMessage,
  hasFieldErrors,
} from '@domain/services/api-error.service';
import { loginValidator } from '@domain/validators/auth.validators';
import { useLoginMutation } from '@store/api/auth.api';

import styles from './LoginForm.module.scss';

const SERVER_FIELDS = ['email', 'password'] as const;

export const LoginForm = (): JSX.Element => {
  const [login, { isLoading, error }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginPayload>({ resolver: zodResolver(loginValidator) });

  const submit = async (values: LoginPayload): Promise<void> => {
    const result = await login(values);

    if ('error' in result) {
      applyFieldErrors(result.error, SERVER_FIELDS, (field, message) =>
        setError(field, { message }),
      );
    }
  };

  return (
    <form className={styles.form} onSubmit={(event) => void handleSubmit(submit)(event)} noValidate>
      <FormField label="Email" error={errors.email?.message}>
        <input type="email" autoComplete="email" {...register('email')} />
      </FormField>

      <FormField label="Password" error={errors.password?.message}>
        <input type="password" autoComplete="current-password" {...register('password')} />
      </FormField>

      {error !== undefined && !hasFieldErrors(error) && (
        <StatusMessage tone="error">{getErrorMessage(error)}</StatusMessage>
      )}

      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
};
