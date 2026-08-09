import type { JSX } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@components/button/Button';
import { EmptyState } from '@components/empty-state/EmptyState';
import { StatusMessage } from '@components/status-message/StatusMessage';
import { DEFAULT_PER_PAGE } from '@domain/models/constants/booking.constants';
import { BookingScope } from '@domain/models/enums/booking-scope.enum';
import type { Booking } from '@domain/models/interfaces/booking.interface';
import { classNames } from '@domain/services/class-names.service';
import { useGetMyBookingsQuery } from '@store/api/booking.api';
import { useGetOfficeQuery } from '@store/api/office.api';

import { CancelDialog } from '../../../components/cancel-dialog/CancelDialog';
import {
  browserTimeZone,
  formatLocalDate,
  formatLocalTime,
  isOfficeZoneDifferent,
} from '../../../services/booking-format.service';
import styles from './MyBookingsPage.module.scss';

const SCOPES = [
  { value: BookingScope.Upcoming, label: 'Upcoming' },
  { value: BookingScope.Past, label: 'Past' },
];

export const MyBookingsPage = (): JSX.Element => {
  const [scope, setScope] = useState<BookingScope>(BookingScope.Upcoming);
  const [page, setPage] = useState(1);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const navigate = useNavigate();

  const bookings = useGetMyBookingsQuery({ scope, page, perPage: DEFAULT_PER_PAGE });
  const office = useGetOfficeQuery();
  const pageSize = bookings.data?.perPage ?? DEFAULT_PER_PAGE;
  const lastPage = Math.max(1, Math.ceil((bookings.data?.total ?? 0) / pageSize));

  const openInSchedule = (booking: Booking): void => {
    void navigate(`/schedule?roomId=${booking.room.id}&week=${booking.startsAt.slice(0, 10)}`);
  };

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <div className={styles.title}>
          <h1>My bookings</h1>
          {office.data !== undefined && isOfficeZoneDifferent(office.data) && (
            <p className={styles.subtitle}>Times shown in {browserTimeZone()}</p>
          )}
        </div>

        <div className={styles.tabs}>
          {SCOPES.map((item) => (
            <button
              key={item.value}
              type="button"
              className={classNames(styles.tab, scope === item.value && styles.tabActive)}
              onClick={() => {
                setScope(item.value);
                setPage(1);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {bookings.isLoading && <StatusMessage tone="info">Loading…</StatusMessage>}
      {bookings.isError && (
        <StatusMessage tone="error">Could not load your bookings.</StatusMessage>
      )}

      {bookings.data?.items.length === 0 && (
        <EmptyState
          title="Nothing here yet"
          description={
            scope === BookingScope.Upcoming
              ? 'Pick a free slot in the schedule and it will show up here.'
              : 'Bookings you have already had will show up on this tab.'
          }
        >
          {scope === BookingScope.Upcoming && (
            <Button variant="primary" size="small" onClick={() => void navigate('/schedule')}>
              Go to the schedule
            </Button>
          )}
        </EmptyState>
      )}

      <ul className={styles.list}>
        {bookings.data?.items.map((booking) => {
          const startsAt = new Date(booking.startsAt);
          const endsAt = new Date(booking.endsAt);

          return (
            <li key={booking.id} className={styles.item}>
              <div className={styles.when}>
                <span className={styles.date}>{formatLocalDate(startsAt)}</span>
                <span className={styles.time}>
                  {formatLocalTime(startsAt)} – {formatLocalTime(endsAt)}
                </span>
              </div>

              <div className={styles.main}>
                <span className={styles.name}>
                  {booking.title}
                  {booking.seriesId !== null && <span className={styles.badge}>Weekly</span>}
                </span>
                <span className={styles.room}>{booking.room.name}</span>
              </div>

              <span className={styles.spacer} />

              <div className={styles.actions}>
                <Button variant="ghost" size="small" onClick={() => openInSchedule(booking)}>
                  Open in schedule
                </Button>
                {scope === BookingScope.Upcoming && (
                  <Button variant="danger" size="small" onClick={() => setBookingToCancel(booking)}>
                    Cancel
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {lastPage > 1 && (
        <div className={styles.pager}>
          <Button size="small" disabled={page === 1} onClick={() => setPage(page - 1)}>
            ← Newer
          </Button>
          <span>
            Page {page} of {lastPage}
          </span>
          <Button size="small" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
            Older →
          </Button>
        </div>
      )}

      {bookingToCancel !== null && (
        <CancelDialog booking={bookingToCancel} onClose={() => setBookingToCancel(null)} />
      )}
    </main>
  );
};
