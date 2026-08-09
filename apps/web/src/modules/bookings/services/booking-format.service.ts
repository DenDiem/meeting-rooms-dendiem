import { DateTime } from 'luxon';

import type { OfficeHours } from '@domain/models/interfaces/office.interface';

export const formatLocalTime = (moment: Date): string =>
  DateTime.fromJSDate(moment).toFormat('HH:mm');

export const formatLocalDate = (moment: Date): string =>
  DateTime.fromJSDate(moment).toFormat('ccc, dd LLL');

export const formatLocalDayAndTime = (start: Date, end: Date): string => {
  const from = DateTime.fromJSDate(start);

  return `${from.toFormat('cccc, d LLLL')}, ${from.toFormat('HH:mm')} – ${DateTime.fromJSDate(end).toFormat('HH:mm')}`;
};

export const officeWeekDateOf = (moment: Date, { timeZone }: OfficeHours): string =>
  DateTime.fromJSDate(moment).setZone(timeZone).toISODate() ?? '';

export const browserTimeZone = (): string => DateTime.local().zoneName ?? '';

export const isOfficeZoneDifferent = ({ timeZone }: OfficeHours): boolean =>
  DateTime.now().setZone(timeZone).offset !== DateTime.now().offset;
