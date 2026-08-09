import { z, type ZodType } from 'zod';

import {
  MAX_SERIES_REPEATS,
  MIN_SERIES_REPEATS,
  TITLE_MAX_LENGTH,
} from '../constants/bookings.constants';
import type { CreateBookingSeriesDto } from '../dto/create-booking-series.dto';

const instant = z.iso.datetime({ offset: true }).transform((value) => new Date(value));

export const createBookingSeriesRequestSchema: ZodType<CreateBookingSeriesDto> = z.object({
  roomId: z.uuid('Choose a room.'),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(TITLE_MAX_LENGTH, `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`),
  startsAt: instant,
  endsAt: instant,
  repeats: z
    .int()
    .min(MIN_SERIES_REPEATS, `A series repeats at least ${MIN_SERIES_REPEATS} times.`)
    .max(MAX_SERIES_REPEATS, `A series repeats at most ${MAX_SERIES_REPEATS} times.`),
});
