import type { IntervalDto } from '@modules/bookings/dto/interval.dto';

import { officeInterval } from './office-moments';
import { TEST_FIXTURE_PREFIX } from './test-database';

const BOOKED_DAY_OFFSET = 7;
const REFUSED_DAY_OFFSET = 8;
const PAST_DAY_OFFSET = -7;

export const MISSING_BOOKING_ID = '00000000-0000-4000-8000-000000000001';
export const MISSING_ROOM_ID = '00000000-0000-4000-8000-000000000002';

export const FIXTURE_BOOKING_TITLE = `${TEST_FIXTURE_PREFIX}lifecycle`;

export const FIXTURE_ROOM = {
  name: `${TEST_FIXTURE_PREFIX}lifecycle-room`,
  floor: 2,
  capacity: 6,
};

export const FIXTURE_OWNER = {
  name: 'Booking Owner',
  email: `${TEST_FIXTURE_PREFIX}owner@example.com`,
  emailNormalized: `${TEST_FIXTURE_PREFIX}owner@example.com`,
  passwordHash: 'not-a-real-hash',
};

export const FIXTURE_STRANGER = {
  name: 'Someone Else',
  email: `${TEST_FIXTURE_PREFIX}stranger@example.com`,
  emailNormalized: `${TEST_FIXTURE_PREFIX}stranger@example.com`,
  passwordHash: 'not-a-real-hash',
};

export const NEW_BOOKING_SLOT: IntervalDto = officeInterval(BOOKED_DAY_OFFSET, '10:00', '11:00');
export const RECLAIMED_SLOT: IntervalDto = officeInterval(BOOKED_DAY_OFFSET, '12:00', '13:00');
export const STRANGERS_SLOT: IntervalDto = officeInterval(BOOKED_DAY_OFFSET, '14:00', '15:00');
export const TWICE_CANCELED_SLOT: IntervalDto = officeInterval(BOOKED_DAY_OFFSET, '16:00', '17:00');
export const CONTESTED_SLOT: IntervalDto = officeInterval(BOOKED_DAY_OFFSET, '09:00', '09:30');

export const FREE_SLOT: IntervalDto = officeInterval(REFUSED_DAY_OFFSET, '15:00', '16:00');
export const TOO_SHORT_SLOT: IntervalDto = officeInterval(REFUSED_DAY_OFFSET, '10:00', '10:15');
export const TOO_LONG_SLOT: IntervalDto = officeInterval(REFUSED_DAY_OFFSET, '09:00', '14:00');
export const MISALIGNED_SLOT: IntervalDto = officeInterval(REFUSED_DAY_OFFSET, '10:15', '11:15');
export const BEFORE_OPENING_SLOT: IntervalDto = officeInterval(
  REFUSED_DAY_OFFSET,
  '07:00',
  '08:00',
);
export const AFTER_CLOSING_SLOT: IntervalDto = officeInterval(REFUSED_DAY_OFFSET, '18:30', '19:30');
export const PAST_SLOT: IntervalDto = officeInterval(PAST_DAY_OFFSET, '10:00', '11:00');
