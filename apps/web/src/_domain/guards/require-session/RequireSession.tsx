import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router';

import { PageLoader } from '@components/feedback/page-loader/PageLoader';
import { StatusMessage } from '@components/feedback/status-message/StatusMessage';
import { useGetSessionQuery } from '@store/api/auth.api';

export const RequireSession = (): JSX.Element => {
  const { data: user, isUninitialized, isLoading, isError } = useGetSessionQuery();

  if (isUninitialized || isLoading) {
    return <PageLoader label="Checking your session…" />;
  }

  if (isError) {
    return <StatusMessage tone="error">The server is unavailable. Try again later.</StatusMessage>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
