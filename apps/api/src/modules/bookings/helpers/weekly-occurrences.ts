import { DateTime } from 'luxon';

import type { OfficeHoursDto } from '@modules/office/dto/office-hours.dto';

import type { IntervalDto } from '../dto/interval.dto';

const shiftWeeks = (moment: Date, weeks: number, timeZone: string): Date =>
  DateTime.fromJSDate(moment).setZone(timeZone).plus({ weeks }).toJSDate();

export const weeklyOccurrences = (
  { start, end }: IntervalDto,
  repeats: number,
  { timeZone }: OfficeHoursDto,
): IntervalDto[] =>
  Array.from({ length: repeats }, (_unused, index) => ({
    start: shiftWeeks(start, index, timeZone),
    end: shiftWeeks(end, index, timeZone),
  }));
