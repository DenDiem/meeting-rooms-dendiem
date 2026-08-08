import { describe, expect, it } from 'vitest';

import type { IntervalDto } from '@modules/bookings/dto/interval.dto';
import { BookingTimeViolation } from '@modules/bookings/enums/booking-time-violation.enum';
import {
  describeBookingTimeViolation,
  findBookingTimeViolation,
} from '@modules/bookings/helpers/booking-time';

import { KYIV_OFFICE } from '../support/office-hours.constants';
import { zonedInterval, zonedTime } from '../support/zoned-moments';

const now = zonedTime('2026-09-15T08:00', KYIV_OFFICE.timeZone);

const officeInterval = (startIso: string, endIso: string): IntervalDto =>
  zonedInterval(startIso, endIso, KYIV_OFFICE.timeZone);

describe('findBookingTimeViolation', () => {
  it('accepts a booking of the shortest allowed length', () => {
    const interval = officeInterval('2026-09-16T09:00', '2026-09-16T09:30');

    expect(findBookingTimeViolation(interval, KYIV_OFFICE, now)).toBeNull();
  });

  it('accepts a booking of the longest allowed length', () => {
    const interval = officeInterval('2026-09-16T09:00', '2026-09-16T13:00');

    expect(findBookingTimeViolation(interval, KYIV_OFFICE, now)).toBeNull();
  });

  it('accepts a booking that ends when the office closes', () => {
    const interval = officeInterval('2026-09-16T18:30', '2026-09-16T19:00');

    expect(findBookingTimeViolation(interval, KYIV_OFFICE, now)).toBeNull();
  });

  it('rejects an end that does not follow the start', () => {
    const reversed = officeInterval('2026-09-16T10:00', '2026-09-16T09:00');
    const empty = officeInterval('2026-09-16T10:00', '2026-09-16T10:00');

    expect(findBookingTimeViolation(reversed, KYIV_OFFICE, now)).toBe(
      BookingTimeViolation.EndNotAfterStart,
    );
    expect(findBookingTimeViolation(empty, KYIV_OFFICE, now)).toBe(
      BookingTimeViolation.EndNotAfterStart,
    );
  });

  it('reports a short booking before it reports a misplaced end', () => {
    const interval = officeInterval('2026-09-16T09:00', '2026-09-16T09:15');

    expect(findBookingTimeViolation(interval, KYIV_OFFICE, now)).toBe(
      BookingTimeViolation.TooShort,
    );
  });

  it('rejects a booking longer than four hours', () => {
    const interval = officeInterval('2026-09-16T09:00', '2026-09-16T13:30');

    expect(findBookingTimeViolation(interval, KYIV_OFFICE, now)).toBe(BookingTimeViolation.TooLong);
  });

  it('rejects a booking that misses the half hour marks', () => {
    const interval = officeInterval('2026-09-16T09:15', '2026-09-16T09:45');

    expect(findBookingTimeViolation(interval, KYIV_OFFICE, now)).toBe(
      BookingTimeViolation.NotAlignedToSlot,
    );
  });

  it('rejects a booking that already started', () => {
    const interval = officeInterval('2026-09-14T09:00', '2026-09-14T10:00');

    expect(findBookingTimeViolation(interval, KYIV_OFFICE, now)).toBe(
      BookingTimeViolation.InThePast,
    );
  });

  it('rejects a booking before the office opens', () => {
    const interval = officeInterval('2026-09-16T08:00', '2026-09-16T08:30');

    expect(findBookingTimeViolation(interval, KYIV_OFFICE, now)).toBe(
      BookingTimeViolation.OutsideOfficeHours,
    );
  });

  it('rejects a booking that runs past closing time', () => {
    const interval = officeInterval('2026-09-16T18:30', '2026-09-16T19:30');

    expect(findBookingTimeViolation(interval, KYIV_OFFICE, now)).toBe(
      BookingTimeViolation.OutsideOfficeHours,
    );
  });

  it('rejects a booking that spills into the next day', () => {
    const interval = officeInterval('2026-09-16T18:00', '2026-09-17T09:00');

    expect(findBookingTimeViolation(interval, KYIV_OFFICE, now)).toBe(BookingTimeViolation.TooLong);
  });
});

describe('describeBookingTimeViolation', () => {
  it('gives every violation its own message', () => {
    const messages = Object.values(BookingTimeViolation).map((violation) =>
      describeBookingTimeViolation(violation, KYIV_OFFICE),
    );

    expect(messages.every((message) => message.length > 0)).toBe(true);
    expect(new Set(messages).size).toBe(messages.length);
  });

  it('names the working hours of the office', () => {
    const message = describeBookingTimeViolation(
      BookingTimeViolation.OutsideOfficeHours,
      KYIV_OFFICE,
    );

    expect(message).toContain('09:00');
    expect(message).toContain('19:00');
    expect(message).toContain(KYIV_OFFICE.timeZone);
  });
});
