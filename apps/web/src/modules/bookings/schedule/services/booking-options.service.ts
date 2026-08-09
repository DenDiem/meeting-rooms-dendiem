import { MAX_SLOTS_PER_BOOKING } from '@domain/models/constants/booking.constants';
import type { Booking } from '@domain/models/interfaces/booking.interface';

import type { WeekSlot } from '../types/week.types';

export const bookingAt = (bookings: Booking[], slot: WeekSlot): Booking | null =>
  bookings.find(
    (booking) => new Date(booking.startsAt) < slot.end && slot.start < new Date(booking.endsAt),
  ) ?? null;

export const isSlotTaken = (bookings: Booking[], slot: WeekSlot): boolean =>
  bookingAt(bookings, slot) !== null;

export const freeStartTimes = (daySlots: WeekSlot[], bookings: Booking[], now: Date): Date[] =>
  daySlots
    .filter((slot) => slot.start > now && !isSlotTaken(bookings, slot))
    .map((slot) => slot.start);

export const availableEndTimes = (
  start: Date,
  daySlots: WeekSlot[],
  bookings: Booking[],
): Date[] => {
  const ends: Date[] = [];

  for (const slot of daySlots) {
    if (slot.start < start) {
      continue;
    }

    if (ends.length === MAX_SLOTS_PER_BOOKING || isSlotTaken(bookings, slot)) {
      break;
    }

    ends.push(slot.end);
  }

  return ends;
};
