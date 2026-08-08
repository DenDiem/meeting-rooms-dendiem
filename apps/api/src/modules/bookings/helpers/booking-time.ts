import {
  MAX_BOOKING_MINUTES,
  MIN_BOOKING_MINUTES,
  SLOT_MINUTES,
} from '../constants/bookings.constants';
import type { IntervalDto } from '../dto/interval.dto';
import type { OfficeHoursDto } from '../dto/office-hours.dto';
import { BookingTimeViolation } from '../enums/booking-time-violation.enum';
import { durationInMinutes } from './interval';
import { isSlotAligned, isWithinOfficeHours } from './office-hours';

const formatHour = (hour: number): string => `${String(hour).padStart(2, '0')}:00`;

export const findBookingTimeViolation = (
  interval: IntervalDto,
  officeHours: OfficeHoursDto,
  now: Date,
): BookingTimeViolation | null => {
  const duration = durationInMinutes(interval);

  if (duration <= 0) {
    return BookingTimeViolation.EndNotAfterStart;
  }

  if (duration < MIN_BOOKING_MINUTES) {
    return BookingTimeViolation.TooShort;
  }

  if (duration > MAX_BOOKING_MINUTES) {
    return BookingTimeViolation.TooLong;
  }

  if (!isSlotAligned(interval.start, officeHours) || !isSlotAligned(interval.end, officeHours)) {
    return BookingTimeViolation.NotAlignedToSlot;
  }

  if (interval.start < now) {
    return BookingTimeViolation.InThePast;
  }

  if (!isWithinOfficeHours(interval, officeHours)) {
    return BookingTimeViolation.OutsideOfficeHours;
  }

  return null;
};

export const describeBookingTimeViolation = (
  violation: BookingTimeViolation,
  { timeZone, openHour, closeHour }: OfficeHoursDto,
): string => {
  const messages: Record<BookingTimeViolation, string> = {
    [BookingTimeViolation.EndNotAfterStart]: 'The end of a booking must be later than its start.',
    [BookingTimeViolation.TooShort]: `A booking must last at least ${MIN_BOOKING_MINUTES} minutes.`,
    [BookingTimeViolation.TooLong]: `A booking cannot last longer than ${MAX_BOOKING_MINUTES / 60} hours.`,
    [BookingTimeViolation.NotAlignedToSlot]: `Start and end must fall on ${SLOT_MINUTES}-minute marks.`,
    [BookingTimeViolation.InThePast]: 'A booking can only be made for a future time.',
    [BookingTimeViolation.OutsideOfficeHours]: `The room is open ${formatHour(openHour)}–${formatHour(closeHour)} (${timeZone}).`,
  };

  return messages[violation];
};
