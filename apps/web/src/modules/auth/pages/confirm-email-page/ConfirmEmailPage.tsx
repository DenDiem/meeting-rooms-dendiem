import type { JSX } from 'react';
import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';

import { StatusMessage } from '@components/status-message/StatusMessage';
import { getErrorMessage } from '@domain/services/api-error.service';
import { useConfirmEmailMutation } from '@store/api/auth.api';

import { AuthCard } from '../../components/auth-card/AuthCard';
import { MISSING_TOKEN_MESSAGE } from '../../constants/confirm-email.constants';

export const ConfirmEmailPage = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [confirmEmail, { isLoading, isSuccess, error }] = useConfirmEmailMutation();
  const requested = useRef(false);

  useEffect(() => {
    if (token && !requested.current) {
      requested.current = true;
      void confirmEmail(token);
    }
  }, [token, confirmEmail]);

  return (
    <AuthCard
      title="Email confirmation"
      subtitle="One step before you can book a room"
      footer={<Link to="/schedule">Go to the schedule</Link>}
    >
      {!token && <StatusMessage tone="error">{MISSING_TOKEN_MESSAGE}</StatusMessage>}
      {isLoading && <StatusMessage tone="info">Confirming your email…</StatusMessage>}
      {isSuccess && (
        <StatusMessage tone="info">Your email is confirmed. Happy booking!</StatusMessage>
      )}
      {error !== undefined && <StatusMessage tone="error">{getErrorMessage(error)}</StatusMessage>}
    </AuthCard>
  );
};
