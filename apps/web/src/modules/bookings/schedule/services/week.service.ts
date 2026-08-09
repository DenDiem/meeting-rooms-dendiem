import { DateTime } from 'luxon';

import {
  DAYS_PER_WEEK,
  MINUTES_PER_HOUR,
  SLOT_MINUTES,
} from '@domain/models/constants/booking.constants';
import type { OfficeHours } from '@domain/models/interfaces/office.interface';

import type { WeekDay, WeekSlot } from '../types/week.types';

const padHour = (hour: number): string => String(hour).padStart(2, '0');

export const currentWeekDate = ({ timeZone }: OfficeHours): string =>
  DateTime.now().setZone(timeZone).toISODate() ?? '';

export const shiftWeek = (week: string, direction: number, { timeZone }: OfficeHours): string =>
  DateTime.fromISO(week, { zone: timeZone }).plus({ weeks: direction }).toISODate() ?? week;

export const officeWeekDays = (week: string, { timeZone }: OfficeHours): WeekDay[] => {
  const monday = DateTime.fromISO(week, { zone: timeZone }).startOf('week');
  const today = DateTime.now().setZone(timeZone).startOf('day');

  return Array.from({ length: DAYS_PER_WEEK }, (_unused, index) => {
    const day = monday.plus({ days: index });

    return {
      date: day.toJSDate(),
      label: day.toFormat('dd LLL'),
      weekday: day.toFormat('ccc'),
      isToday: day.hasSame(today, 'day'),
    };
  });
};

export const officeDaySlots = (
  day: Date,
  { timeZone, openHour, closeHour }: OfficeHours,
): WeekSlot[] => {
  const dayStart = DateTime.fromJSDate(day)
    .setZone(timeZone)
    .set({ hour: openHour, minute: 0, second: 0, millisecond: 0 });
  const slotCount = ((closeHour - openHour) * MINUTES_PER_HOUR) / SLOT_MINUTES;

  return Array.from({ length: slotCount }, (_unused, index) => {
    const start = dayStart.plus({ minutes: index * SLOT_MINUTES });

    return { start: start.toJSDate(), end: start.plus({ minutes: SLOT_MINUTES }).toJSDate() };
  });
};

export const formatWeekRange = (week: string, { timeZone }: OfficeHours): string => {
  const monday = DateTime.fromISO(week, { zone: timeZone }).startOf('week');
  const sunday = monday.plus({ days: DAYS_PER_WEEK - 1 });

  return monday.hasSame(sunday, 'month')
    ? `${monday.toFormat('d')} – ${sunday.toFormat('d LLLL yyyy')}`
    : `${monday.toFormat('d LLL')} – ${sunday.toFormat('d LLL yyyy')}`;
};

export const formatOfficeHours = ({ openHour, closeHour }: OfficeHours): string =>
  `${padHour(openHour)}:00–${padHour(closeHour)}:00`;
