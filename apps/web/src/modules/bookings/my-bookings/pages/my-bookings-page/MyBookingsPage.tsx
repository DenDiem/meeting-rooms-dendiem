import type { JSX } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { StatusMessage } from '@components/status-message/StatusMessage';
import { DEFAULT_PER_PAGE } from '@domain/models/constants/booking.constants';
import { BookingScope } from '@domain/models/enums/booking-scope.enum';
import type { Booking } from '@domain/models/interfaces/booking.interface';
import { useGetMyBookingsQuery } from '@store/api/booking.api';

import { CancelDialog } from '../../../schedule/components/cancel-dialog/CancelDialog';
import { formatLocalDateTime } from '../../../schedule/services/week.service';
import styles from './MyBookingsPage.module.scss';

export const MyBookingsPage = (): JSX.Element => {
  const [scope, setScope] = useState<BookingScope>(BookingScope.Upcoming);
  const [page, setPage] = useState(1);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const navigate = useNavigate();

  const bookings = useGetMyBookingsQuery({ scope, page, perPage: DEFAULT_PER_PAGE });
  const lastPage = Math.max(1, Math.ceil((bookings.data?.total ?? 0) / DEFAULT_PER_PAGE));

  return (
    <main className={styles.page}>
      <h1>My bookings</h1>

      <div className={styles.tabs}>
        {[BookingScope.Upcoming, BookingScope.Past].map((value) => (
          <button
            key={value}
            type="button"
            className={scope === value ? styles.active : undefined}
            onClick={() => {
              setScope(value);
              setPage(1);
            }}
          >
            {value === BookingScope.Upcoming ? 'Upcoming' : 'Past'}
          </button>
        ))}
      </div>

      {bookings.isLoading && <StatusMessage tone="info">Loading…</StatusMessage>}
      {bookings.isError && (
        <StatusMessage tone="error">Could not load your bookings.</StatusMessage>
      )}
      {bookings.data?.items.length === 0 && (
        <StatusMessage tone="info">
          {scope === BookingScope.Upcoming
            ? 'You have no upcoming bookings.'
            : 'You have no past bookings.'}
        </StatusMessage>
      )}

      <ul className={styles.list}>
        {bookings.data?.items.map((booking) => (
          <li key={booking.id} className={styles.item}>
            <button
              type="button"
              className={styles.row}
              onClick={() =>
                void navigate(
                  `/schedule?roomId=${booking.room.id}&week=${booking.startsAt.slice(0, 10)}`,
                )
              }
            >
              <span>{formatLocalDateTime(booking.startsAt)}</span>
              <span>{booking.room.name}</span>
              <span>{booking.title}</span>
            </button>

            {scope === BookingScope.Upcoming && (
              <button type="button" onClick={() => setBookingToCancel(booking)}>
                Cancel
              </button>
            )}
          </li>
        ))}
      </ul>

      {lastPage > 1 && (
        <div className={styles.pager}>
          <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>
            ← Newer
          </button>
          <span>
            Page {page} of {lastPage}
          </span>
          <button type="button" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
            Older →
          </button>
        </div>
      )}

      {bookingToCancel && (
        <CancelDialog booking={bookingToCancel} onClose={() => setBookingToCancel(null)} />
      )}
    </main>
  );
};
