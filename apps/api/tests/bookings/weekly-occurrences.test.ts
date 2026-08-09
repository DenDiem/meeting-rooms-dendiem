import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';

import { weeklyOccurrences } from '@modules/bookings/helpers/weekly-occurrences';

import { KYIV_OFFICE } from '../support/office-hours.constants';
import { zonedInterval } from '../support/zoned-moments';

const localTimes = (moments: Date[], timeZone: string): string[] =>
  moments.map((moment) =>
    DateTime.fromJSDate(moment).setZone(timeZone).toFormat('yyyy-LL-dd HH:mm'),
  );

describe('weeklyOccurrences', () => {
  it('repeats the same weekday and time', () => {
    const occurrences = weeklyOccurrences(
      zonedInterval('2026-09-15T10:00', '2026-09-15T11:00', KYIV_OFFICE.timeZone),
      3,
      KYIV_OFFICE,
    );

    expect(
      localTimes(
        occurrences.map(({ start }) => start),
        KYIV_OFFICE.timeZone,
      ),
    ).toEqual(['2026-09-15 10:00', '2026-09-22 10:00', '2026-09-29 10:00']);
    expect(
      localTimes(
        occurrences.map(({ end }) => end),
        KYIV_OFFICE.timeZone,
      ),
    ).toEqual(['2026-09-15 11:00', '2026-09-22 11:00', '2026-09-29 11:00']);
  });

  it('keeps the office wall clock across a daylight saving change', () => {
    const occurrences = weeklyOccurrences(
      zonedInterval('2026-10-20T10:00', '2026-10-20T11:00', KYIV_OFFICE.timeZone),
      3,
      KYIV_OFFICE,
    );

    expect(
      localTimes(
        occurrences.map(({ start }) => start),
        KYIV_OFFICE.timeZone,
      ),
    ).toEqual(['2026-10-20 10:00', '2026-10-27 10:00', '2026-11-03 10:00']);
    expect(occurrences.map(({ start }) => start.toISOString())).toEqual([
      '2026-10-20T07:00:00.000Z',
      '2026-10-27T08:00:00.000Z',
      '2026-11-03T08:00:00.000Z',
    ]);
  });

  it('returns a single occurrence when nothing repeats', () => {
    const interval = zonedInterval('2026-09-15T10:00', '2026-09-15T11:00', KYIV_OFFICE.timeZone);

    expect(weeklyOccurrences(interval, 1, KYIV_OFFICE)).toEqual([interval]);
  });
});
