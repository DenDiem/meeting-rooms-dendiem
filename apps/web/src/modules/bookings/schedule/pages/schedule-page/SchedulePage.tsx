import type { JSX } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { StatusMessage } from '@components/feedback/status-message/StatusMessage';
import { OFFICE_TIME_ZONE } from '@domain/models/constants/office.constants';
import type { Booking } from '@domain/models/interfaces/booking.interface';
import { useGetWeekScheduleQuery } from '@store/api/booking.api';
import { useGetRoomsQuery } from '@store/api/room.api';
import { useAppSelector } from '@store/hooks';
import { selectMinCapacity } from '@store/slices/filters.slice';

import { BookingDialog } from '../../components/booking-dialog/BookingDialog';
import { CancelDialog } from '../../components/cancel-dialog/CancelDialog';
import { RoomSelect } from '../../components/room-select/RoomSelect';
import { WeekGrid } from '../../components/week-grid/WeekGrid';
import { browserTimeZone, currentWeekDate, shiftWeek } from '../../services/week.service';
import type { WeekSlot } from '../../types/week.types';
import styles from './SchedulePage.module.scss';

export const SchedulePage = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSlot, setSelectedSlot] = useState<WeekSlot | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const minCapacity = useAppSelector(selectMinCapacity);
  const rooms = useGetRoomsQuery(minCapacity);

  const week = searchParams.get('week') ?? currentWeekDate();
  const roomId = searchParams.get('roomId') ?? rooms.data?.[0]?.id ?? '';
  const schedule = useGetWeekScheduleQuery({ roomId, week }, { skip: roomId === '' });

  const setParams = (next: { roomId?: string; week?: string }): void => {
    setSearchParams({ roomId: next.roomId ?? roomId, week: next.week ?? week });
  };

  return (
    <main className={styles.page}>
      <header className={styles.toolbar}>
        {rooms.data && (
          <RoomSelect
            rooms={rooms.data}
            roomId={roomId}
            onSelectRoom={(nextRoomId) => setParams({ roomId: nextRoomId })}
          />
        )}

        <div className={styles.weeks}>
          <button type="button" onClick={() => setParams({ week: shiftWeek(week, -1) })}>
            ← Previous
          </button>
          <button type="button" onClick={() => setParams({ week: currentWeekDate() })}>
            This week
          </button>
          <button type="button" onClick={() => setParams({ week: shiftWeek(week, 1) })}>
            Next →
          </button>
        </div>
      </header>

      <p className={styles.hint}>
        Times are shown in your time zone ({browserTimeZone()}). The office works 09:00–19:00{' '}
        {OFFICE_TIME_ZONE}.
      </p>

      {rooms.isError && <StatusMessage tone="error">Could not load the rooms.</StatusMessage>}
      {rooms.data?.length === 0 && (
        <StatusMessage tone="info">No room matches this capacity.</StatusMessage>
      )}
      {schedule.isLoading && <StatusMessage tone="info">Loading the week…</StatusMessage>}
      {schedule.isError && <StatusMessage tone="error">Could not load the schedule.</StatusMessage>}

      {schedule.data && (
        <WeekGrid
          week={week}
          bookings={schedule.data}
          onSelectSlot={setSelectedSlot}
          onSelectBooking={setSelectedBooking}
        />
      )}

      {selectedSlot && (
        <BookingDialog roomId={roomId} slot={selectedSlot} onClose={() => setSelectedSlot(null)} />
      )}

      {selectedBooking && (
        <CancelDialog booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </main>
  );
};
