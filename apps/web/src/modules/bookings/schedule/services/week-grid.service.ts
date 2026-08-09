import type { Booking } from '@domain/models/interfaces/booking.interface';

import { formatLocalTime } from '../../services/booking-format.service';
import type { WeekCell, WeekRow, WeekSlot } from '../types/week.types';
import { bookingAt } from './booking-options.service';

const nowOffsetIn = (slot: WeekSlot, now: Date): number | null => {
  if (now < slot.start || now >= slot.end) {
    return null;
  }

  return (now.getTime() - slot.start.getTime()) / (slot.end.getTime() - slot.start.getTime());
};

const buildCell = (
  slot: WeekSlot,
  dayIndex: number,
  rowIndex: number,
  bookings: Booking[],
  now: Date,
): WeekCell => {
  const booking = bookingAt(bookings, slot);

  return {
    key: slot.start.toISOString(),
    slot,
    dayIndex,
    rowIndex,
    booking,
    isPast: slot.start <= now,
    isBookingStart: booking !== null && new Date(booking.startsAt) >= slot.start,
    isBookingEnd: booking !== null && new Date(booking.endsAt) <= slot.end,
    nowOffset: nowOffsetIn(slot, now),
  };
};

export const buildWeekRows = (
  weekSlots: WeekSlot[][],
  bookings: Booking[],
  now: Date,
): WeekRow[] => {
  const [referenceDay = []] = weekSlots;

  return referenceDay.map((referenceSlot, rowIndex) => ({
    key: referenceSlot.start.toISOString(),
    time: formatLocalTime(referenceSlot.start),
    isHourStart: referenceSlot.start.getMinutes() === 0,
    isHourEnd: referenceSlot.end.getMinutes() === 0,
    cells: weekSlots.flatMap((daySlots, dayIndex) => {
      const slot = daySlots[rowIndex];

      return slot === undefined ? [] : [buildCell(slot, dayIndex, rowIndex, bookings, now)];
    }),
  }));
};
