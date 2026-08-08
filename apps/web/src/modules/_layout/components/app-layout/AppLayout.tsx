import type { JSX } from 'react';
import { NavLink, Outlet } from 'react-router';

import { useGetSessionQuery, useLogoutMutation } from '@store/api/auth.api';

import styles from './AppLayout.module.scss';

export const AppLayout = (): JSX.Element => {
  const { data: user } = useGetSessionQuery();
  const [logout, { isLoading }] = useLogoutMutation();

  return (
    <div>
      <nav className={styles.nav}>
        <NavLink to="/schedule">Schedule</NavLink>
        <NavLink to="/my-bookings">My bookings</NavLink>

        <span className={styles.user}>{user?.name}</span>
        <button type="button" onClick={() => void logout()} disabled={isLoading}>
          Sign out
        </button>
      </nav>

      <Outlet />
    </div>
  );
};
