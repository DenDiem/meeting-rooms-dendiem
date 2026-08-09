import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@components/actions/button/Button';
import { StatusMessage } from '@components/feedback/status-message/StatusMessage';
import { FormField } from '@components/forms/form-field/FormField';
import { PASSWORD_MIN_LENGTH } from '@domain/models/constants/auth.constants';
import type { RegisterPayload } from '@domain/models/interfaces/auth-payload.interface';
import {
  applyFieldErrors,
  getErrorMessage,
  hasFieldErrors,
} from '@domain/services/api-error.service';
import { registerValidator } from '@domain/validators/auth.validators';
import { useRegisterMutation } from '@store/api/auth.api';

import styles from './RegisterForm.module.scss';

const SERVER_FIELDS = ['name', 'email', 'password'] as const;

export const RegisterForm = (): JSX.Element => {
  const [createAccount, { isLoading, error }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterPayload>({ resolver: zodResolver(registerValidator) });

  const submit = async (values: RegisterPayload): Promise<void> => {
    const result = await createAccount(values);

    if ('error' in result) {
      applyFieldErrors(result.error, SERVER_FIELDS, (field, message) =>
        setError(field, { message }),
      );
    }
  };

  return (
    <form className={styles.form} onSubmit={(event) => void handleSubmit(submit)(event)} noValidate>
      <FormField label="Name" error={errors.name?.message}>
        <input type="text" autoComplete="name" {...register('name')} />
      </FormField>

      <FormField label="Email" error={errors.email?.message}>
        <input type="email" autoComplete="email" {...register('email')} />
      </FormField>

      <FormField
        label="Password"
        error={errors.password?.message}
        hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}
      >
        <input type="password" autoComplete="new-password" {...register('password')} />
      </FormField>

      {error !== undefined && !hasFieldErrors(error) && (
        <StatusMessage tone="error">{getErrorMessage(error)}</StatusMessage>
      )}

      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
};
