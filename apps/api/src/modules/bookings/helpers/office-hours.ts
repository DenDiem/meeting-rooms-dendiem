import { DateTime } from 'luxon';

import { SLOT_MINUTES } from '../constants/bookings.constants';
import type { IntervalDto } from '../dto/interval.dto';
import type { OfficeHoursDto } from '../dto/office-hours.dto';

const toOfficeTime = (moment: Date, { timeZone }: OfficeHoursDto): DateTime => {
  const officeTime = DateTime.fromJSDate(moment, { zone: timeZone });

  if (!officeTime.isValid) {
    throw new Error(`Unknown office time zone: ${timeZone}`);
  }

  return officeTime;
};

export const isSlotAligned = (moment: Date, officeHours: OfficeHoursDto): boolean => {
  const officeTime = toOfficeTime(moment, officeHours);

  return (
    officeTime.minute % SLOT_MINUTES === 0 &&
    officeTime.second === 0 &&
    officeTime.millisecond === 0
  );
};

export const isWithinOfficeHours = (
  { start, end }: IntervalDto,
  officeHours: OfficeHoursDto,
): boolean => {
  const officeStart = toOfficeTime(start, officeHours);
  const officeEnd = toOfficeTime(end, officeHours);
  const opensAt = officeStart.set({
    hour: officeHours.openHour,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const closesAt = officeStart.set({
    hour: officeHours.closeHour,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  return officeStart >= opensAt && officeEnd <= closesAt;
};

export const officeWeekOf = (date: string, { timeZone }: OfficeHoursDto): IntervalDto | null => {
  const weekStart = DateTime.fromISO(date, { zone: timeZone }).startOf('week');

  if (!weekStart.isValid) {
    return null;
  }

  return { start: weekStart.toJSDate(), end: weekStart.plus({ weeks: 1 }).toJSDate() };
};
