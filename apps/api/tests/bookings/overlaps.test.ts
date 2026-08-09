import { describe, expect, it } from 'vitest';

import { overlaps } from '@modules/bookings/helpers/interval';

import { utcInterval } from '../support/zoned-moments';

const TEN_TO_ELEVEN = utcInterval('2026-09-15T10:00', '2026-09-15T11:00');

describe('overlaps', () => {
  it('lets neighbours touch', () => {
    expect(overlaps(TEN_TO_ELEVEN, utcInterval('2026-09-15T11:00', '2026-09-15T12:00'))).toBe(
      false,
    );
    expect(overlaps(TEN_TO_ELEVEN, utcInterval('2026-09-15T09:00', '2026-09-15T10:00'))).toBe(
      false,
    );
  });

  it('catches a partial overlap from either side', () => {
    expect(overlaps(TEN_TO_ELEVEN, utcInterval('2026-09-15T10:30', '2026-09-15T11:30'))).toBe(true);
    expect(overlaps(TEN_TO_ELEVEN, utcInterval('2026-09-15T09:30', '2026-09-15T10:30'))).toBe(true);
  });

  it('catches an exact match', () => {
    expect(overlaps(TEN_TO_ELEVEN, utcInterval('2026-09-15T10:00', '2026-09-15T11:00'))).toBe(true);
  });

  it('catches an interval swallowed by another', () => {
    expect(overlaps(TEN_TO_ELEVEN, utcInterval('2026-09-15T10:15', '2026-09-15T10:45'))).toBe(true);
    expect(overlaps(TEN_TO_ELEVEN, utcInterval('2026-09-15T09:00', '2026-09-15T12:00'))).toBe(true);
  });

  it('leaves the same hour on neighbouring days alone', () => {
    expect(overlaps(TEN_TO_ELEVEN, utcInterval('2026-09-16T10:00', '2026-09-16T11:00'))).toBe(
      false,
    );
    expect(overlaps(TEN_TO_ELEVEN, utcInterval('2026-09-14T10:00', '2026-09-14T11:00'))).toBe(
      false,
    );
  });

  it('sees the same pair from both directions', () => {
    const other = utcInterval('2026-09-15T10:30', '2026-09-15T11:30');

    expect(overlaps(TEN_TO_ELEVEN, other)).toBe(overlaps(other, TEN_TO_ELEVEN));
  });
});
