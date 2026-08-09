import { describe, expect, it } from 'vitest';

import {
  isSlotAligned,
  isWithinOfficeHours,
  officeWeekOf,
} from '@modules/bookings/helpers/office-hours';

import { KATHMANDU_OFFICE, KYIV_OFFICE, UNKNOWN_OFFICE } from '../support/office-hours.constants';
import { zonedInterval, zonedTime } from '../support/zoned-moments';

describe('isSlotAligned', () => {
  it('accepts the start and the middle of an hour', () => {
    expect(isSlotAligned(zonedTime('2026-09-15T09:00', KYIV_OFFICE.timeZone), KYIV_OFFICE)).toBe(
      true,
    );
    expect(isSlotAligned(zonedTime('2026-09-15T09:30', KYIV_OFFICE.timeZone), KYIV_OFFICE)).toBe(
      true,
    );
  });

  it('rejects a quarter of an hour', () => {
    expect(isSlotAligned(zonedTime('2026-09-15T09:15', KYIV_OFFICE.timeZone), KYIV_OFFICE)).toBe(
      false,
    );
  });

  it('rejects leftover seconds and milliseconds', () => {
    expect(isSlotAligned(zonedTime('2026-09-15T09:00:01', KYIV_OFFICE.timeZone), KYIV_OFFICE)).toBe(
      false,
    );
    expect(
      isSlotAligned(zonedTime('2026-09-15T09:00:00.001', KYIV_OFFICE.timeZone), KYIV_OFFICE),
    ).toBe(false);
  });

  it('reads the clock of the office, not of the server', () => {
    const alignedInUtc = zonedTime('2026-09-15T09:00', 'UTC');

    expect(isSlotAligned(alignedInUtc, KYIV_OFFICE)).toBe(true);
    expect(isSlotAligned(alignedInUtc, KATHMANDU_OFFICE)).toBe(false);
  });

  it('refuses to guess an unknown zone', () => {
    expect(() => isSlotAligned(zonedTime('2026-09-15T09:00', 'UTC'), UNKNOWN_OFFICE)).toThrow(
      UNKNOWN_OFFICE.timeZone,
    );
  });
});

describe('isWithinOfficeHours', () => {
  it('accepts a booking that opens the day', () => {
    const interval = zonedInterval('2026-09-15T09:00', '2026-09-15T10:00', KYIV_OFFICE.timeZone);

    expect(isWithinOfficeHours(interval, KYIV_OFFICE)).toBe(true);
  });

  it('accepts a booking that ends exactly at closing time', () => {
    const interval = zonedInterval('2026-09-15T18:00', '2026-09-15T19:00', KYIV_OFFICE.timeZone);

    expect(isWithinOfficeHours(interval, KYIV_OFFICE)).toBe(true);
  });

  it('rejects a booking that starts before opening time', () => {
    const interval = zonedInterval('2026-09-15T08:30', '2026-09-15T09:30', KYIV_OFFICE.timeZone);

    expect(isWithinOfficeHours(interval, KYIV_OFFICE)).toBe(false);
  });

  it('rejects a booking that runs past closing time', () => {
    const interval = zonedInterval('2026-09-15T18:30', '2026-09-15T19:30', KYIV_OFFICE.timeZone);

    expect(isWithinOfficeHours(interval, KYIV_OFFICE)).toBe(false);
  });

  it('measures the window in the office zone', () => {
    const kyivAfternoon = zonedInterval(
      '2026-09-15T17:00',
      '2026-09-15T18:00',
      KYIV_OFFICE.timeZone,
    );

    expect(isWithinOfficeHours(kyivAfternoon, KYIV_OFFICE)).toBe(true);
    expect(isWithinOfficeHours(kyivAfternoon, KATHMANDU_OFFICE)).toBe(false);
  });

  it('keeps the same working hours across a daylight saving change', () => {
    const beforeChange = zonedInterval(
      '2026-03-27T09:00',
      '2026-03-27T10:00',
      KYIV_OFFICE.timeZone,
    );
    const afterChange = zonedInterval('2026-03-30T09:00', '2026-03-30T10:00', KYIV_OFFICE.timeZone);

    expect(beforeChange.start.toISOString()).toBe('2026-03-27T07:00:00.000Z');
    expect(afterChange.start.toISOString()).toBe('2026-03-30T06:00:00.000Z');
    expect(isWithinOfficeHours(beforeChange, KYIV_OFFICE)).toBe(true);
    expect(isWithinOfficeHours(afterChange, KYIV_OFFICE)).toBe(true);
  });
});

describe('officeWeekOf', () => {
  it('starts the week on Monday in the office zone', () => {
    const week = officeWeekOf('2026-09-16', KYIV_OFFICE);

    expect(week.start.toISOString()).toBe('2026-09-13T21:00:00.000Z');
  });

  it('spans seven days', () => {
    const week = officeWeekOf('2026-09-16', KYIV_OFFICE);

    expect(week.end.toISOString()).toBe('2026-09-20T21:00:00.000Z');
  });

  it('returns the same week for every day inside it', () => {
    const monday = officeWeekOf('2026-09-14', KYIV_OFFICE);
    const sunday = officeWeekOf('2026-09-20', KYIV_OFFICE);

    expect(monday.start.toISOString()).toBe(sunday.start.toISOString());
  });

  it('refuses to guess an unknown zone', () => {
    expect(() => officeWeekOf('2026-09-16', UNKNOWN_OFFICE)).toThrow(UNKNOWN_OFFICE.timeZone);
  });
});
