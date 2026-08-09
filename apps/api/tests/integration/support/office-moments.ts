import { DateTime } from 'luxon';

import type { IntervalDto } from '@modules/bookings/dto/interval.dto';

import { KYIV_OFFICE } from '../../support/office-hours.constants';
import { zonedTime } from '../../support/zoned-moments';

const officeDay = (daysFromToday: number): string => {
  const day = DateTime.now()
    .setZone(KYIV_OFFICE.timeZone)
    .plus({ days: daysFromToday })
    .toISODate();

  if (day === null) {
    throw new Error(
      `Unusable test day: ${daysFromToday} days from today in ${KYIV_OFFICE.timeZone}`,
    );
  }

  return day;
};

export const officeMoment = (daysFromToday: number, localTime: string): Date =>
  zonedTime(`${officeDay(daysFromToday)}T${localTime}`, KYIV_OFFICE.timeZone);

export const officeInterval = (
  daysFromToday: number,
  startTime: string,
  endTime: string,
): IntervalDto => ({
  start: officeMoment(daysFromToday, startTime),
  end: officeMoment(daysFromToday, endTime),
});
