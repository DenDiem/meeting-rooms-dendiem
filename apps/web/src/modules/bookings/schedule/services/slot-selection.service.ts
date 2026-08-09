import { MAX_SLOTS_PER_BOOKING } from '@domain/models/constants/booking.constants';
import type { Booking } from '@domain/models/interfaces/booking.interface';

import type { SlotSelection, WeekSlot } from '../types/week.types';
import { isSlotTaken } from './booking-options.service';

export const extendSelection = (
  selection: SlotSelection,
  headIndex: number,
  daySlots: WeekSlot[],
  bookings: Booking[],
  now: Date,
): SlotSelection => {
  const step = headIndex >= selection.anchorIndex ? 1 : -1;
  let reached = selection.anchorIndex;

  for (
    let index = selection.anchorIndex + step;
    step > 0 ? index <= headIndex : index >= headIndex;
    index += step
  ) {
    const slot = daySlots[index];

    if (slot === undefined || slot.start <= now || isSlotTaken(bookings, slot)) {
      break;
    }

    if (Math.abs(index - selection.anchorIndex) + 1 > MAX_SLOTS_PER_BOOKING) {
      break;
    }

    reached = index;
  }

  return { ...selection, headIndex: reached };
};

export const isInsideSelection = (
  selection: SlotSelection | null,
  dayIndex: number,
  rowIndex: number,
): boolean => {
  if (selection === null || selection.dayIndex !== dayIndex) {
    return false;
  }

  const { firstIndex, lastIndex } = selectionBounds(selection);

  return rowIndex >= firstIndex && rowIndex <= lastIndex;
};

export const selectionBounds = (
  selection: SlotSelection,
): { readonly firstIndex: number; readonly lastIndex: number } => ({
  firstIndex: Math.min(selection.anchorIndex, selection.headIndex),
  lastIndex: Math.max(selection.anchorIndex, selection.headIndex),
});

export const selectionToSlot = (
  selection: SlotSelection,
  daySlots: WeekSlot[],
): WeekSlot | null => {
  const { firstIndex, lastIndex } = selectionBounds(selection);
  const first = daySlots[firstIndex];
  const last = daySlots[lastIndex];

  return first !== undefined && last !== undefined ? { start: first.start, end: last.end } : null;
};
