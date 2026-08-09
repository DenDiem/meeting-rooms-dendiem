import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { Button } from '@components/button/Button';
import { Chevron } from '@components/chevron/Chevron';
import { EmptyState } from '@components/empty-state/EmptyState';
import { PageLoader } from '@components/page-loader/PageLoader';
import { StatusMessage } from '@components/status-message/StatusMessage';
import type { Booking } from '@domain/models/interfaces/booking.interface';
import { bookingApi, useGetWeekScheduleQuery } from '@store/api/booking.api';
import { useGetOfficeQuery } from '@store/api/office.api';
import { useGetRoomsQuery } from '@store/api/room.api';
import { useAppSelector } from '@store/hooks';
import { selectMinCapacity } from '@store/slices/filters.slice';

import { BookingDialog } from '../../components/booking-dialog/BookingDialog';
import { CancelDialog } from '../../../components/cancel-dialog/CancelDialog';
import { ScheduleFilters } from '../../components/schedule-filters/ScheduleFilters';
import { ScheduleLegend } from '../../components/schedule-legend/ScheduleLegend';
import { WeekGrid } from '../../components/week-grid/WeekGrid';
import { browserTimeZone, isOfficeZoneDifferent } from '../../../services/booking-format.service';
import {
  currentWeekDate,
  formatOfficeHours,
  formatWeekRange,
  shiftWeek,
} from '../../services/week.service';
import type { WeekSlot } from '../../types/week.types';
import styles from './SchedulePage.module.scss';

const EMPTY_BOOKINGS: Booking[] = [];

export const SchedulePage = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSlot, setSelectedSlot] = useState<WeekSlot | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const minCapacity = useAppSelector(selectMinCapacity);
  const rooms = useGetRoomsQuery(minCapacity);
  const office = useGetOfficeQuery();

  const week =
    searchParams.get('week') ?? (office.data === undefined ? '' : currentWeekDate(office.data));
  const roomId = searchParams.get('roomId') ?? rooms.data?.[0]?.id ?? '';
  const schedule = useGetWeekScheduleQuery(
    { roomId, week },
    { skip: roomId === '' || week === '' },
  );
  const bookings = schedule.currentData ?? EMPTY_BOOKINGS;
  const room = rooms.data?.find((item) => item.id === roomId);

  const prefetchSchedule = bookingApi.usePrefetch('getWeekSchedule');

  useEffect(() => {
    if (roomId === '' || office.data === undefined) {
      return;
    }

    prefetchSchedule({ roomId, week: shiftWeek(week, -1, office.data) });
    prefetchSchedule({ roomId, week: shiftWeek(week, 1, office.data) });
  }, [prefetchSchedule, roomId, week, office.data]);

  const setParams = (next: { roomId?: string; week?: string }): void => {
    setSearchParams({ roomId: next.roomId ?? roomId, week: next.week ?? week });
  };

  if (office.data === undefined) {
    return <PageLoader label="Loading the office hours…" />;
  }

  const officeHours = office.data;

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <div className={styles.title}>
          <h1>{room?.name ?? 'Schedule'}</h1>
          <p className={styles.subtitle}>
            {room !== undefined && `Floor ${room.floor} · ${room.capacity} seats · `}
            {isOfficeZoneDifferent(officeHours)
              ? `shown in ${browserTimeZone()}, the office works ${formatOfficeHours(officeHours)} ${officeHours.timeZone}`
              : `the office works ${formatOfficeHours(officeHours)}`}
          </p>
        </div>
      </header>

      <div className={styles.toolbar}>
        {rooms.data !== undefined && rooms.data.length > 0 && (
          <ScheduleFilters
            rooms={rooms.data}
            roomId={roomId}
            onSelectRoom={(nextRoomId) => setParams({ roomId: nextRoomId })}
          />
        )}

        <div className={styles.weeks}>
          <Button size="icon" onClick={() => setParams({ week: shiftWeek(week, -1, officeHours) })}>
            <Chevron direction="left" />
          </Button>
          <span className={styles.weekLabel}>{formatWeekRange(week, officeHours)}</span>
          <Button size="icon" onClick={() => setParams({ week: shiftWeek(week, 1, officeHours) })}>
            <Chevron direction="right" />
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => setParams({ week: currentWeekDate(officeHours) })}
          >
            This week
          </Button>
        </div>
      </div>

      {rooms.isError && <StatusMessage tone="error">Could not load the rooms.</StatusMessage>}
      {schedule.isError && <StatusMessage tone="error">Could not load the schedule.</StatusMessage>}

      {rooms.data?.length === 0 && (
        <EmptyState
          title="No room matches this filter"
          description="Lower the capacity you asked for and the rooms will come back."
        />
      )}

      {!rooms.isError && rooms.data?.length !== 0 && (
        <>
          <ScheduleLegend />
          <WeekGrid
            week={week}
            officeHours={officeHours}
            bookings={bookings}
            isUpdating={roomId === '' || schedule.isFetching}
            onSelectSlot={setSelectedSlot}
            onSelectBooking={setSelectedBooking}
          />
        </>
      )}

      {selectedSlot !== null && (
        <BookingDialog
          roomId={roomId}
          officeHours={officeHours}
          slot={selectedSlot}
          bookings={bookings}
          onClose={() => setSelectedSlot(null)}
        />
      )}

      {selectedBooking !== null && (
        <CancelDialog booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </main>
  );
};
