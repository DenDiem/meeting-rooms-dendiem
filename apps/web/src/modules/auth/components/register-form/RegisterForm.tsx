import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useForm } from 'react-hook-form';

import { StatusMessage } from '@components/feedback/status-message/StatusMessage';
import { FormField } from '@components/forms/form-field/FormField';
import type { RegisterPayload } from '@domain/models/interfaces/auth-payload.interface';
import { getErrorMessage } from '@domain/services/api-error.service';
import { registerValidator } from '@domain/validators/auth.validators';
import { useRegisterMutation } from '@store/api/auth.api';

import styles from './RegisterForm.module.scss';

export const RegisterForm = (): JSX.Element => {
  const [createAccount, { isLoading, error }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>({ resolver: zodResolver(registerValidator) });

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit((values) => void createAccount(values))}
      noValidate
    >
      <FormField label="Name" error={errors.name?.message}>
        <input type="text" autoComplete="name" {...register('name')} />
      </FormField>

      <FormField label="Email" error={errors.email?.message}>
        <input type="email" autoComplete="email" {...register('email')} />
      </FormField>

      <FormField label="Password" error={errors.password?.message}>
        <input type="password" autoComplete="new-password" {...register('password')} />
      </FormField>

      {error && <StatusMessage tone="error">{getErrorMessage(error)}</StatusMessage>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
};
