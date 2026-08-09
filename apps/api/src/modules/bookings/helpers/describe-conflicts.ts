import { DateTime } from 'luxon';

import type { OfficeHoursDto } from '@modules/office/dto/office-hours.dto';

import { LISTED_CONFLICTS_LIMIT } from '../constants/bookings.constants';

const formatDay = (moment: Date, timeZone: string): string =>
  DateTime.fromJSDate(moment).setZone(timeZone).toFormat('d LLL');

export const describeConflicts = (starts: Date[], { timeZone }: OfficeHoursDto): string => {
  const listed = starts.slice(0, LISTED_CONFLICTS_LIMIT).map((start) => formatDay(start, timeZone));
  const hidden = starts.length - listed.length;
  const tail = hidden > 0 ? ` and ${hidden} more` : '';

  return `This room is already booked on ${listed.join(', ')}${tail}.`;
};
