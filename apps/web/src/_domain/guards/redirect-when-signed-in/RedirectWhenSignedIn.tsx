import type { JSX } from 'react';
import { Navigate, Outlet } from 'react-router';

import { PageLoader } from '@components/feedback/page-loader/PageLoader';
import { useGetSessionQuery } from '@store/api/auth.api';

export const RedirectWhenSignedIn = (): JSX.Element => {
  const { data: user, isUninitialized, isLoading } = useGetSessionQuery();

  if (isUninitialized || isLoading) {
    return <PageLoader label="Checking your session…" />;
  }

  return user ? <Navigate to="/schedule" replace /> : <Outlet />;
};
