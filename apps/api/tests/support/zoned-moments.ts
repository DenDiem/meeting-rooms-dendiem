import { DateTime } from 'luxon';

import type { IntervalDto } from '@modules/bookings/dto/interval.dto';

const UTC = 'UTC';

export const zonedTime = (localIso: string, timeZone: string): Date => {
  const moment = DateTime.fromISO(localIso, { zone: timeZone });

  if (!moment.isValid) {
    throw new Error(`Unusable test moment: ${localIso} in ${timeZone}`);
  }

  return moment.toJSDate();
};

export const zonedInterval = (startIso: string, endIso: string, timeZone: string): IntervalDto => ({
  start: zonedTime(startIso, timeZone),
  end: zonedTime(endIso, timeZone),
});

export const utcInterval = (startIso: string, endIso: string): IntervalDto =>
  zonedInterval(startIso, endIso, UTC);
