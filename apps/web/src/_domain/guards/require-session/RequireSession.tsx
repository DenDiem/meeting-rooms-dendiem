import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router';

import { StatusMessage } from '@components/feedback/status-message/StatusMessage';
import { useGetSessionQuery } from '@store/api/auth.api';

export const RequireSession = (): JSX.Element => {
  const { data: user, isLoading, isError } = useGetSessionQuery();

  if (isLoading) {
    return <StatusMessage tone="info">Checking your session…</StatusMessage>;
  }

  if (isError) {
    return <StatusMessage tone="error">The server is unavailable. Try again later.</StatusMessage>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
