import { describe, expect, it } from 'vitest';

import { durationInMinutes, overlaps } from '@modules/bookings/helpers/interval';

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

describe('overlaps', () => {
  const morning = utcInterval('2026-09-15T09:00', '2026-09-15T11:00');

  it('leaves back to back bookings free', () => {
    const before = utcInterval('2026-09-15T08:00', '2026-09-15T09:00');
    const after = utcInterval('2026-09-15T11:00', '2026-09-15T12:00');

    expect(overlaps(morning, after)).toBe(false);
    expect(overlaps(after, morning)).toBe(false);
    expect(overlaps(morning, before)).toBe(false);
    expect(overlaps(before, morning)).toBe(false);
  });

  it('leaves bookings with a gap between them free', () => {
    const afternoon = utcInterval('2026-09-15T14:00', '2026-09-15T15:00');

    expect(overlaps(morning, afternoon)).toBe(false);
    expect(overlaps(afternoon, morning)).toBe(false);
  });

  it('catches a booking that starts before the other one ends', () => {
    const later = utcInterval('2026-09-15T10:30', '2026-09-15T12:00');

    expect(overlaps(morning, later)).toBe(true);
    expect(overlaps(later, morning)).toBe(true);
  });

  it('catches a booking nested inside another one', () => {
    const nested = utcInterval('2026-09-15T09:30', '2026-09-15T10:00');

    expect(overlaps(morning, nested)).toBe(true);
    expect(overlaps(nested, morning)).toBe(true);
  });

  it('catches two bookings on the same hours', () => {
    expect(overlaps(morning, utcInterval('2026-09-15T09:00', '2026-09-15T11:00'))).toBe(true);
  });

  it('catches bookings that share only their opening minute', () => {
    const shorter = utcInterval('2026-09-15T09:00', '2026-09-15T09:30');

    expect(overlaps(morning, shorter)).toBe(true);
    expect(overlaps(shorter, morning)).toBe(true);
  });

  it('separates the same hours on different days', () => {
    const nextDay = utcInterval('2026-09-16T09:00', '2026-09-16T11:00');

    expect(overlaps(morning, nextDay)).toBe(false);
  });
});
