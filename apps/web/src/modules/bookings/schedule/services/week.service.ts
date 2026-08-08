import { DateTime } from 'luxon';

import { DAYS_PER_WEEK, SLOT_MINUTES } from '@domain/models/constants/booking.constants';
import {
  OFFICE_CLOSE_HOUR,
  OFFICE_OPEN_HOUR,
  OFFICE_TIME_ZONE,
} from '@domain/models/constants/office.constants';

import type { WeekDay, WeekSlot } from '../types/week.types';

const MINUTES_PER_HOUR = 60;

export const currentWeekDate = (): string =>
  DateTime.now().setZone(OFFICE_TIME_ZONE).toISODate() ?? '';

export const shiftWeek = (week: string, direction: number): string =>
  DateTime.fromISO(week, { zone: OFFICE_TIME_ZONE }).plus({ weeks: direction }).toISODate() ?? week;

export const officeWeekDays = (week: string): WeekDay[] => {
  const monday = DateTime.fromISO(week, { zone: OFFICE_TIME_ZONE }).startOf('week');
  const today = DateTime.now().setZone(OFFICE_TIME_ZONE).startOf('day');

  return Array.from({ length: DAYS_PER_WEEK }, (_unused, index) => {
    const day = monday.plus({ days: index });

    return {
      date: day.toJSDate(),
      label: day.toFormat('ccc dd LLL'),
      isToday: day.hasSame(today, 'day'),
    };
  });
};

export const officeDaySlots = (day: Date): WeekSlot[] => {
  const dayStart = DateTime.fromJSDate(day)
    .setZone(OFFICE_TIME_ZONE)
    .set({ hour: OFFICE_OPEN_HOUR, minute: 0, second: 0, millisecond: 0 });
  const slotCount = ((OFFICE_CLOSE_HOUR - OFFICE_OPEN_HOUR) * MINUTES_PER_HOUR) / SLOT_MINUTES;

  return Array.from({ length: slotCount }, (_unused, index) => {
    const start = dayStart.plus({ minutes: index * SLOT_MINUTES });

    return { start: start.toJSDate(), end: start.plus({ minutes: SLOT_MINUTES }).toJSDate() };
  });
};

export const formatLocalTime = (moment: Date): string =>
  DateTime.fromJSDate(moment).toFormat('HH:mm');

export const formatLocalDateTime = (moment: string): string =>
  DateTime.fromISO(moment).toFormat('ccc dd LLL, HH:mm');

export const browserTimeZone = (): string => DateTime.local().zoneName ?? '';
