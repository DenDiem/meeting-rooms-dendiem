import type { JSX } from 'react';
import { NavLink, Outlet } from 'react-router';

import { BrandMark } from '@components/brand-mark/BrandMark';
import { Button } from '@components/button/Button';
import { classNames } from '@domain/services/class-names.service';
import { toInitials } from '@domain/services/initials.service';
import { EmailConfirmationBanner } from '@modules/auth/components/email-confirmation-banner/EmailConfirmationBanner';
import { EmailStatus } from '@modules/auth/components/email-status/EmailStatus';
import { NotificationToasts } from '@modules/notifications/components/notification-toasts/NotificationToasts';
import { useGetSessionQuery, useLogoutMutation } from '@store/api/auth.api';

import styles from './AppLayout.module.scss';

export const AppLayout = (): JSX.Element => {
  const { data: user } = useGetSessionQuery();
  const [logout, { isLoading }] = useLogoutMutation();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.brand}>
          <BrandMark className={styles.mark} />
          <span className={styles.wordmark}>Meeting Rooms</span>
        </span>

        <nav className={styles.nav}>
          <NavLink
            to="/schedule"
            className={({ isActive }) => classNames(styles.link, isActive && styles.linkActive)}
          >
            Schedule
          </NavLink>
          <NavLink
            to="/my-bookings"
            className={({ isActive }) => classNames(styles.link, isActive && styles.linkActive)}
          >
            My bookings
          </NavLink>
        </nav>

        <span className={styles.spacer} />

        {user && (
          <span className={styles.user}>
            <EmailStatus isConfirmed={user.isEmailConfirmed} />
            <span className={styles.avatar}>{toInitials(user.name)}</span>
            <span className={styles.name}>{user.name}</span>
          </span>
        )}

        <Button variant="ghost" size="small" onClick={() => void logout()} disabled={isLoading}>
          Sign out
        </Button>
      </header>

      {user?.isEmailConfirmed === false && <EmailConfirmationBanner />}

      <Outlet />

      <NotificationToasts />
    </div>
  );
};
