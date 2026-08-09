import * as RadixToast from '@radix-ui/react-toast';
import type { JSX } from 'react';

import { formatLocalTime } from '@modules/bookings/services/booking-format.service';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from '@store/api/notification.api';

import {
  NOTIFICATION_POLL_INTERVAL_MS,
  NOTIFICATION_TOAST_DURATION_MS,
} from './notification-toasts.constants';
import styles from './NotificationToasts.module.scss';

export const NotificationToasts = (): JSX.Element => {
  const { data: notifications } = useGetNotificationsQuery(undefined, {
    pollingInterval: NOTIFICATION_POLL_INTERVAL_MS,
  });
  const [markRead] = useMarkNotificationReadMutation();

  return (
    <RadixToast.Provider duration={NOTIFICATION_TOAST_DURATION_MS} swipeDirection="right">
      {notifications?.map((notification) => (
        <RadixToast.Root
          key={notification.id}
          className={styles.toast}
          open
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              void markRead(notification.id);
            }
          }}
        >
          <RadixToast.Title className={styles.title}>
            {notification.roomName} is booked right after you
          </RadixToast.Title>
          <RadixToast.Description className={styles.description}>
            {notification.title} ends at {formatLocalTime(new Date(notification.endsAt))}. Wrap up
            so the next meeting can start on time.
          </RadixToast.Description>
          <RadixToast.Close className={styles.close}>Got it</RadixToast.Close>
        </RadixToast.Root>
      ))}

      <RadixToast.Viewport className={styles.viewport} />
    </RadixToast.Provider>
  );
};
