import { describe, expect, it } from 'vitest';

import { durationInMinutes } from '@modules/bookings/helpers/interval';

import { utcInterval } from '../support/zoned-moments';

describe('durationInMinutes', () => {
  it('measures the shortest allowed booking', () => {
    expect(durationInMinutes(utcInterval('2026-09-15T09:00', '2026-09-15T09:30'))).toBe(30);
  });

  it('measures the longest allowed booking', () => {
    expect(durationInMinutes(utcInterval('2026-09-15T09:00', '2026-09-15T13:00'))).toBe(240);
  });

  it('measures a span that crosses midnight', () => {
    expect(durationInMinutes(utcInterval('2026-09-15T23:30', '2026-09-16T00:30'))).toBe(60);
  });

  it('is not positive when the end does not follow the start', () => {
    expect(durationInMinutes(utcInterval('2026-09-15T09:30', '2026-09-15T09:00'))).toBe(-30);
    expect(durationInMinutes(utcInterval('2026-09-15T09:00', '2026-09-15T09:00'))).toBe(0);
  });
});
