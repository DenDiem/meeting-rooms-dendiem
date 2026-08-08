import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router';

import { StatusMessage } from '@components/feedback/status-message/StatusMessage';
import { useGetSessionQuery } from '@store/api/auth.api';

export const RedirectWhenSignedIn = (): JSX.Element => {
  const { data: user, isLoading } = useGetSessionQuery();

  if (isLoading) {
    return <StatusMessage tone="info">Checking your session…</StatusMessage>;
  }

  return user ? <Navigate to="/schedule" replace /> : <Outlet />;
};
