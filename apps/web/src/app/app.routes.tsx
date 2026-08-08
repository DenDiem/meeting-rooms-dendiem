import { createBrowserRouter, Navigate } from 'react-router';

import { RedirectWhenSignedIn } from '@domain/guards/redirect-when-signed-in/RedirectWhenSignedIn';
import { RequireSession } from '@domain/guards/require-session/RequireSession';
import { AppLayout } from '@modules/_layout/components/app-layout/AppLayout';
import { LoginPage } from '@modules/auth/pages/login-page/LoginPage';
import { RegisterPage } from '@modules/auth/pages/register-page/RegisterPage';

export const appRouter = createBrowserRouter([
  {
    element: <RedirectWhenSignedIn />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <RequireSession />,
    children: [{ element: <AppLayout />, children: [] }],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
]);
