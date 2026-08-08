import type { JSX } from 'react';

import type { Booking } from '@domain/models/interfaces/booking.interface';

import { formatLocalTime, officeDaySlots, officeWeekDays } from '../../services/week.service';
import type { WeekSlot } from '../../types/week.types';
import styles from './WeekGrid.module.scss';

interface WeekGridProps {
  readonly week: string;
  readonly bookings: Booking[];
  readonly onSelectSlot: (slot: WeekSlot) => void;
  readonly onSelectBooking: (booking: Booking) => void;
}

const bookingAt = (bookings: Booking[], slot: WeekSlot): Booking | undefined =>
  bookings.find(
    (booking) => new Date(booking.startsAt) < slot.end && slot.start < new Date(booking.endsAt),
  );

export const WeekGrid = ({
  week,
  bookings,
  onSelectSlot,
  onSelectBooking,
}: WeekGridProps): JSX.Element => {
  const days = officeWeekDays(week);
  const firstDay = days[0];

  if (!firstDay) {
    return <p>No days to show.</p>;
  }

  const slotsPerDay = officeDaySlots(firstDay.date);
  const now = new Date();

  return (
    <div className={styles.scroll}>
      <table className={styles.grid}>
        <thead>
          <tr>
            <th scope="col">Time</th>
            {days.map((day) => (
              <th key={day.label} scope="col" className={day.isToday ? styles.today : undefined}>
                {day.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slotsPerDay.map((referenceSlot, slotIndex) => (
            <tr key={referenceSlot.start.toISOString()}>
              <th scope="row">{formatLocalTime(referenceSlot.start)}</th>
              {days.map((day) => {
                const slot = officeDaySlots(day.date)[slotIndex];

                if (!slot) {
                  return <td key={day.label} />;
                }

                const booking = bookingAt(bookings, slot);
                const isPast = slot.end <= now;

                if (booking) {
                  return (
                    <td key={day.label} className={booking.isMine ? styles.mine : styles.taken}>
                      <button type="button" onClick={() => onSelectBooking(booking)}>
                        <span className={styles.title}>{booking.title}</span>
                        <span className={styles.author}>{booking.user.name}</span>
                      </button>
                    </td>
                  );
                }

                return (
                  <td key={day.label} className={isPast ? styles.past : undefined}>
                    <button type="button" disabled={isPast} onClick={() => onSelectSlot(slot)}>
                      <span className={styles.free}>Free</span>
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
