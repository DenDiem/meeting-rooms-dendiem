import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router';

import { PageLoader } from '@components/page-loader/PageLoader';
import { StatusMessage } from '@components/status-message/StatusMessage';
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
