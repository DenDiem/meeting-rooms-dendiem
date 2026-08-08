import { z, type ZodType } from 'zod';

import { TITLE_MAX_LENGTH } from '../constants/bookings.constants';
import type { CreateBookingDto } from '../dto/create-booking.dto';

const instant = z.iso.datetime({ offset: true }).transform((value) => new Date(value));

export const createBookingRequestSchema: ZodType<CreateBookingDto> = z.object({
  roomId: z.uuid('Choose a room.'),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(TITLE_MAX_LENGTH, `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`),
  startsAt: instant,
  endsAt: instant,
});
